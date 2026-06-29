const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const { URL } = require('url');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE = (process.env.API_BASE || 'http://localhost:8000').replace(/\/+$/, '');
let API_HOSTNAME = 'localhost';
let API_URL = null;
try { API_URL = new URL(API_BASE); API_HOSTNAME = API_URL.hostname; } catch (_) {}

// Local ANPR camera MJPEG service (rp-anpr). Proxied same-origin so the guard
// dashboard <img> avoids cross-origin CSP / Private-Network-Access blocks.
let CAM_URL = null;
try { CAM_URL = new URL(process.env.CAM_STREAM_URL || 'http://127.0.0.1:8088'); } catch (_) {}

// Role sets for server-side page guards (audit F-05).
const STAFF_ROLES = ['ROOT', 'ADMIN', 'OPERATOR', 'SALES'];
const RESIDENT_ROLES = ['RESIDENT'];
const GUARD_PAGE_ROLES = ['GUARD', 'ADMIN', 'ROOT'];

// Content-Security-Policy (audit F-16): defense-in-depth. Whitelists only the
// CDNs/fonts the SPA actually loads. 'unsafe-inline'/'unsafe-eval' are kept
// because existing pages rely on inline scripts/handlers — tightening that is a
// separate refactor. connect-src must include the backend API origin.
const CSP = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net",
    `img-src 'self' data: blob: https://api.qrserver.com ${API_BASE}`,
    `connect-src 'self' ${API_BASE}`,
    "frame-ancestors 'self'",
    "base-uri 'self'",
    // AzeriCard redirect: the bank-card flow does a top-level form.submit() to the
    // 3DSecure gateway (testmpi.3dsecure.az / mpi.3dsecure.az). 'self' alone makes
    // the browser silently block that POST (payment hangs on "Обработка"), so the
    // 3dsecure.az gateway must be allowed for form submissions.
    "form-action 'self' https://*.3dsecure.az",
    "object-src 'none'",
].join('; ');

// Security: do not advertise framework (reduces fingerprinting surface).
app.disable('x-powered-by');

// Standard hardening headers applied to every response (audit F-16).
// Avoids clickjacking, MIME-sniffing, referrer leakage; adds CSP + HSTS.
//
// Server-side page authorization IS now applied below via pageGuard() — see the
// guard block before the static mounts. (A previous report claimed these
// guards existed; the code had lost them — audit F-05.)
app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader('Content-Security-Policy', CSP);
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});

// --- Same-origin API reverse proxy (audit F-05/F-06/F-07/F-11) -------------
// The browser now talks ONLY to this origin; we stream /api and /uploads to the
// backend. This makes the backend session cookie first-party (HttpOnly,
// SameSite=Lax) so: server-side guards work in prod too, no bearer token in
// localStorage, no cross-site CORS, and CSRF is blocked by SameSite=Lax.
// IMPORTANT: registered BEFORE the body parsers so the raw request body
// (including multipart photo/avatar uploads) streams through untouched.
function apiProxy(req, res) {
    if (!API_URL) { res.status(502).json({ detail: 'API base not configured' }); return; }
    const client = API_URL.protocol === 'https:' ? https : http;
    const options = {
        protocol: API_URL.protocol,
        hostname: API_URL.hostname,
        port: API_URL.port || (API_URL.protocol === 'https:' ? 443 : 80),
        method: req.method,
        path: req.originalUrl,
        headers: { ...req.headers, host: API_URL.host },
    };
    const pReq = client.request(options, (pRes) => {
        const headers = { ...pRes.headers };
        // Keep backend self-redirects same-origin. FastAPI's trailing-slash 307
        // (e.g. /api/blocks -> /api/blocks/) builds an ABSOLUTE Location using the
        // backend host (we forward Host: <backend>). If passed through, the browser
        // follows it cross-site, OUT of this proxy, where the first-party session
        // cookie doesn't exist -> 401 -> the SPA bounces to login. Rewrite any
        // Location that points at the backend origin to a relative path so the
        // redirect is re-proxied with the cookie intact. (Redirects to the frontend,
        // e.g. AzeriCard success/fail, don't match and pass through untouched.)
        const loc = headers.location || headers.Location;
        if (loc && API_URL && String(loc).indexOf(API_URL.origin) === 0) {
            const rel = String(loc).slice(API_URL.origin.length) || '/';
            headers.location = rel;
            delete headers.Location;
        }
        res.writeHead(pRes.statusCode || 502, headers);
        pRes.pipe(res);
    });
    pReq.on('error', () => { if (!res.headersSent) res.status(502).json({ detail: 'Upstream unavailable' }); });
    req.pipe(pReq);
}

app.use('/api', apiProxy);
app.use('/uploads', apiProxy);
app.get('/healthz', apiProxy);

// Same-origin MJPEG proxy for the guard live camera (rp-anpr → :8088).
// Session-gated: the live КПП feed must not be watchable anonymously.
// (pageGuard is a hoisted function declaration, so it is usable here.)
app.get('/guard/cam-stream', pageGuard(GUARD_PAGE_ROLES), (req, res) => {
    if (!CAM_URL) { res.status(502).end(); return; }
    const pReq = http.request({
        hostname: CAM_URL.hostname,
        port: CAM_URL.port || 8088,
        path: '/stream',
        method: 'GET',
    }, (pRes) => {
        res.writeHead(pRes.statusCode || 502, {
            'Content-Type': pRes.headers['content-type'] || 'multipart/x-mixed-replace',
            'Cache-Control': 'no-cache, private',
            'Connection': 'close',
        });
        pRes.pipe(res);
    });
    pReq.on('error', () => { if (!res.headersSent) res.status(502).end(); else res.end(); });
    req.on('close', () => pReq.destroy());
    pReq.end();
});
// Top-level backend auth routes used by the panels' logout (and the backend's
// GET /login redirect). Needed since the same-origin client uses API_BASE=''
// so window.location.href = `${API_BASE}/logout` resolves to this origin.
app.get('/logout', apiProxy);
app.get('/login', apiProxy);

// cors() removed: the browser talks same-origin to this server (API is proxied),
// and the backend keeps its own CORS config for any direct callers.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Runtime config for browser clients (useful for Railway deployments).
app.get('/js/config.js', (req, res) => {
    res.type('application/javascript');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.send(`
(function initAppConfig() {
    const userConfig = window.APP_CONFIG || {};
    // audit F-05/F-06/F-07/F-11: same-origin. The browser calls /api/* on THIS
    // host and Express proxies to the backend, so the base is empty (relative).
    const configuredBase = userConfig.API_BASE || "";
    const normalizedBase = String(configuredBase).replace(/\\/+$/, "");

    window.APP_CONFIG = {
        ...userConfig,
        API_BASE: normalizedBase
    };

    window.BACKEND_API_BASE = normalizedBase;
    window.API_BASE = normalizedBase;
    window.API_BASE_URL = normalizedBase;
    window.getApiBase = function getApiBase() {
        return window.APP_CONFIG.API_BASE;
    };

    // audit F-17: global HTML-escape helper for safe innerHTML interpolation of
    // API/user-controlled data (resident names, appeals, comments, etc.).
    window.escapeHtml = function escapeHtml(value) {
        if (value === null || value === undefined) return "";
        const div = document.createElement("div");
        div.textContent = String(value);
        return div.innerHTML;
    };

    // audit F-06: no bearer token in localStorage anymore. With the same-origin
    // proxy the backend session cookie is first-party (HttpOnly), so a same-origin
    // fetch() sends it automatically — the previous fetch monkey-patch is gone.

    // Unified API access: a dead session must land on the login page, not leave
    // half-broken pages silently ignoring 401s.
    function onLoginPage() {
        const p = window.location.pathname;
        return p === "/" || p.endsWith("/index.html") || p.includes("qr-password-setup");
    }
    function handleUnauthorized(url) {
        // login/auth-check calls legitimately return 401 — never loop on them
        if (onLoginPage()) return;
        if (/\\/login|\\/api\\/auth\\//.test(url)) return;
        window.location.href = "/";
    }

    // Preferred helper for new code.
    window.apiFetch = async function apiFetch(input, init) {
        const resp = await fetch(input, { credentials: "include", ...(init || {}) });
        if (resp.status === 401) {
            handleUnauthorized(typeof input === "string" ? input : (input && input.url) || "");
        }
        return resp;
    };

    // Safety net for the existing bare fetch() calls all over the codebase:
    // any same-origin /api/* response with 401 sends the user to login.
    if (!window.__rp401Patched && typeof window.fetch === "function") {
        window.__rp401Patched = true;
        const origFetch = window.fetch.bind(window);
        window.fetch = function (input, init) {
            const url = typeof input === "string" ? input : (input && input.url) || "";
            const isApi = url.startsWith("/api/") ||
                url.startsWith(normalizedBase + "/api/");
            const p = origFetch(input, init);
            if (!isApi) return p;
            return p.then((resp) => {
                if (resp.status === 401) handleUnauthorized(url);
                return resp;
            });
        };
    }

    // Pending-password gate: an account that logged in with a TEMP password
    // (require_password_change) must finish setting a permanent password + profile
    // before reaching ANY panel — including via the browser Back button. Applies to
    // every role. Skips the login page and the setup page itself.
    if (!onLoginPage()) {
        fetch(normalizedBase + "/api/auth/check", { credentials: "include" })
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => {
                if (d && d.authenticated && d.require_password_change) {
                    window.location.replace("/qr-password-setup.html?from_login=true");
                }
            })
            .catch(() => {});
    }
})();
`);
});

// --- Server-side page guards (audit F-05) ---------------------------------
// For each protected page, forward the caller's session (cookie / bearer) to
// the backend /api/auth/check and enforce the role BEFORE serving any HTML; on
// failure 302 -> login. Registered before the static mounts so static cannot
// leak a protected HTML file (also index:false below).
//
// PAGE_GUARD_MODE: 'on' | 'off' | 'auto' (default 'auto'). 'auto' enforces only
// when the frontend and backend share the same hostname (single-origin / local).
// In a split-domain deploy the browser never sends the backend session cookie to
// this Node host, so a guard here could not see the user and would loop; the full
// cross-site fix is to serve the API same-origin (planned Stage C).
function pageGuard(allowedRoles) {
    return async function guard(req, res, next) {
        // Never gate static assets (css/js/images/fonts) — they are not sensitive,
        // and pages reused across roles (e.g. the resident invoice view pulls
        // /admin/content_css/invoice-view.css) must keep loading. Only HTML page
        // navigations are gated. (Fixes a CSS MIME error: a gated .css was 302'd to
        // the login HTML.)
        if (/\.(css|js|mjs|png|jpe?g|svg|webp|gif|ico|woff2?|ttf|eot|map|json|txt)$/i.test(req.path)) {
            return next();
        }
        const mode = (process.env.PAGE_GUARD_MODE || 'auto').toLowerCase();
        const enforce = mode === 'on' || (mode === 'auto' && req.hostname === API_HOSTNAME);
        if (!enforce) return next();
        // Редирект на логин с сохранением исходного пути (?next=), чтобы после входа
        // вернуть пользователя туда, куда он шёл (напр. на инвойс по QR с чека).
        // Примечание: hash (#...) до сервера не доходит — целевой маршрут восстанавливаем по query.
        const loginRedirect = () => {
            const orig = req.originalUrl || req.url || '/';
            return (orig && orig !== '/' && !orig.startsWith('/?'))
                ? res.redirect(302, '/?next=' + encodeURIComponent(orig))
                : res.redirect(302, '/');
        };
        try {
            const r = await fetch(`${API_BASE}/api/auth/check`, {
                headers: {
                    cookie: req.headers.cookie || '',
                    authorization: req.headers.authorization || '',
                },
            });
            if (!r.ok) return loginRedirect();
            const data = await r.json().catch(() => null);
            if (!data || data.authenticated !== true || !allowedRoles.includes(data.role)) {
                return loginRedirect();
            }
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
            return next();
        } catch (_e) {
            return loginRedirect();
        }
    };
}

app.use('/admin', pageGuard(STAFF_ROLES));
app.use('/user', pageGuard(RESIDENT_ROLES));
app.use('/guard', pageGuard(GUARD_PAGE_ROLES));

// Static files
app.use(express.static(path.join(__dirname, 'public'), { index: false }));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Admin Panel - SPA Routing
// Все маршруты /admin/* перенаправляются на index.html для клиентской маршрутизации.
// Реальная проверка авторизации делается на уровне backend (cookie сессии)
// и клиентским guard'ом в admin/index.html, который скрывает body до ответа.
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

app.get('/admin/*', (req, res) => {
    if (req.path.includes('/admin/content/')) {
        return res.sendFile(path.join(__dirname, 'public', req.path));
    }
    res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user', 'dashboard.html'));
});

// NOTE: /maintenance and /accountant routes removed — public/maintenance/ and
// public/accountant/ do not exist (neither locally nor in prod), the sendFile
// always crashed with ENOENT.

app.get('/guard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'guard', 'dashboard.html'));
});

// QR Password Setup Page
app.get('/qr-password-setup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'qr-password-setup.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`RoyalPark Frontend Server running on port ${PORT}`);
    console.log(`Access the application at: http://localhost:${PORT}`);
    console.log(`API_BASE configured as: ${API_BASE}`);
});
