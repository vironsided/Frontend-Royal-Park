const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE = (process.env.API_BASE || 'http://localhost:8000').replace(/\/+$/, '');

// Security: do not advertise framework (reduces fingerprinting surface).
app.disable('x-powered-by');

// Standard hardening headers applied to every response.
// Avoids clickjacking, MIME-sniffing, and aggressive referrer leakage.
//
// NOTE: Server-side auth gating is intentionally NOT applied here. The
// backend session cookie is bound to the backend domain (cross-site,
// SameSite=None) and the frontend is served from a different Railway host,
// so the Node process here has no access to that cookie at all and cannot
// validate the user. Authentication is enforced where it actually matters:
//   1) every backend /api/* route validates the session cookie via
//      Depends(get_current_user) — no data leaks without a valid session;
//   2) every protected HTML page runs an early-blocking checkSession()
//      that hits ${API_BASE}/api/auth/check with credentials and redirects
//      to / before any sensitive content is shown.
app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
});

app.use(cors());
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
    const configuredBase = userConfig.API_BASE || ${JSON.stringify(API_BASE)};
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

    // Incognito-safe auth fallback:
    // when third-party cookies are blocked, attach bearer session token
    // to backend API requests.
    if (!window.__rpFetchPatched && typeof window.fetch === "function") {
        const originalFetch = window.fetch.bind(window);
        const backendBase = normalizedBase;

        window.fetch = function patchedFetch(input, init) {
            try {
                const reqUrl = typeof input === "string" ? input : (input && input.url) || "";
                const isBackendCall =
                    reqUrl.startsWith(backendBase) ||
                    reqUrl.startsWith("/api/");

                if (!isBackendCall) {
                    return originalFetch(input, init);
                }

                const token = localStorage.getItem("sessionToken");
                if (!token) {
                    return originalFetch(input, init);
                }

                const nextInit = { ...(init || {}) };
                const headers = new Headers(
                    (init && init.headers) ||
                    ((typeof Request !== "undefined" && input instanceof Request) ? input.headers : undefined)
                );
                if (!headers.has("Authorization")) {
                    headers.set("Authorization", "Bearer " + token);
                }
                nextInit.headers = headers;
                return originalFetch(input, nextInit);
            } catch (_e) {
                return originalFetch(input, init);
            }
        };
        window.__rpFetchPatched = true;
    }
})();
`);
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));
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

app.get('/maintenance', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'maintenance', 'dashboard.html'));
});

app.get('/accountant', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'accountant', 'dashboard.html'));
});

// QR Password Setup Page
app.get('/qr-password-setup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'qr-password-setup.html'));
});

app.listen(PORT, () => {
    console.log(`RoyalPark Frontend Server running on port ${PORT}`);
    console.log(`Access the application at: http://localhost:${PORT}`);
    console.log(`API_BASE configured as: ${API_BASE}`);
});
