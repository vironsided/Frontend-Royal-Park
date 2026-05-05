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
app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader('Cache-Control', 'no-store');
    next();
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Runtime config for browser clients (useful for Railway deployments).
app.get('/js/config.js', (req, res) => {
    res.type('application/javascript');
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
})();
`);
});

// ---- Server-side auth gate ----------------------------------------------
// Backend session cookie is HttpOnly and is the ONLY trusted source of
// identity. We forward the user's cookies to the backend's session check
// endpoint and decide on the server BEFORE we serve any protected HTML.
// This eliminates the previous client-only redirect that could be bypassed
// by simply opening /admin/... directly or disabling JavaScript.
// Node 18+ has global fetch. We guard against older runtimes explicitly.
const httpFetch = (typeof globalThis.fetch === 'function')
    ? globalThis.fetch.bind(globalThis)
    : null;

async function fetchSessionUser(req) {
    const cookieHeader = req.headers.cookie || '';
    if (!cookieHeader) return null;
    if (!httpFetch) {
        console.error('[auth-gate] global fetch unavailable, refusing to serve protected pages');
        return null;
    }

    try {
        const response = await httpFetch(`${API_BASE}/api/auth/check`, {
            method: 'GET',
            headers: {
                Cookie: cookieHeader,
                Accept: 'application/json',
            },
        });
        if (!response.ok) return null;
        const data = await response.json().catch(() => null);
        if (!data || !data.authenticated) return null;
        const role = String(data.role || '').trim().toUpperCase();
        return { role, raw: data };
    } catch (err) {
        console.warn('[auth-gate] backend check failed:', err && err.message ? err.message : err);
        return null;
    }
}

function redirectToLogin(res) {
    res.status(302).setHeader('Location', '/');
    res.end();
}

function requireRoles(allowedRoles) {
    const allowed = new Set(allowedRoles.map(r => String(r).toUpperCase()));
    return async (req, res, next) => {
        const user = await fetchSessionUser(req);
        if (!user) {
            return redirectToLogin(res);
        }
        if (allowed.size > 0 && !allowed.has(user.role)) {
            return redirectToLogin(res);
        }
        req.sessionUser = user;
        next();
    };
}

// Anyone with a valid session is OK (used for shared protected resources).
const requireAnyAuth = requireRoles(['ROOT', 'ADMIN', 'OPERATOR', 'SALES', 'RESIDENT']);
// Admin-area roles only: residents must NOT reach the admin panel.
const requireStaff = requireRoles(['ROOT', 'ADMIN', 'OPERATOR', 'SALES']);
// Resident-area: only residents (staff has its own admin panel).
const requireResident = requireRoles(['RESIDENT']);

// Public pages first (login + branding assets).
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Static assets that must remain public (CSS/JS/images, branding).
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// QR Password Setup is reachable from email/SMS links by design.
app.get('/qr-password-setup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'qr-password-setup.html'));
});
app.get('/qr-password-setup.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'qr-password-setup.html'));
});

// ---- Protected: Admin panel ---------------------------------------------
app.get('/admin', requireStaff, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

app.get('/admin/*', requireStaff, (req, res) => {
    if (req.path.includes('/admin/content/')) {
        // Server has already validated the session role above.
        return res.sendFile(path.join(__dirname, 'public', req.path));
    }
    res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

// ---- Protected: Resident area -------------------------------------------
app.get('/user', requireResident, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user', 'dashboard.html'));
});

app.get('/user/*', requireResident, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', req.path));
});

// ---- Protected: shared dashboards (still expect a valid session) --------
app.get('/maintenance', requireAnyAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'maintenance', 'dashboard.html'));
});

app.get('/accountant', requireAnyAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'accountant', 'dashboard.html'));
});

// Generic public assets (favicon etc.) live at the root of /public.
// We mount this LAST so explicit routes above always take precedence; the
// static handler will not be able to leak protected HTML because /admin and
// /user have already been registered as guarded routes.
app.use(express.static(path.join(__dirname, 'public'), {
    index: false,
    extensions: ['html'],
}));

// Defensive 404 for anything we did not explicitly serve.
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`RoyalPark Frontend Server running on port ${PORT}`);
    console.log(`Access the application at: http://localhost:${PORT}`);
    console.log(`API_BASE configured as: ${API_BASE}`);
});
