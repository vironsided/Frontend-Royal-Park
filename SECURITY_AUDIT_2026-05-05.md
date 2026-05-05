# RoyalPark Frontend Security Audit and Hardening

Date: 2026-05-05
Scope: `frontend_repo` (Express static server) and its interaction with `backend_repo` session/auth.

## 1. Executive summary

A high-severity authorization gap was found and fixed:

- The Express frontend server was serving admin and resident HTML to anyone, and the only check was a JavaScript-side `fetch /api/auth/check` that redirected to `/` after the page already loaded. Disabling JavaScript, opening DevTools "view source", or hitting any protected page directly (for example `/admin/content/dashboard.html`) bypassed the check entirely.

After this work the frontend now validates the backend session cookie on the server BEFORE returning any protected HTML, and unauthorized requests are redirected with HTTP 302 to the login page. Standard hardening headers were added globally and the fake login stub was removed.

Live verification on the deployed Railway frontend confirms:
- `/admin`, `/admin/index.html`, `/admin/content/*.html`, `/user`, `/user/dashboard.html`, `/maintenance`, `/accountant` → 302 to `/` for anonymous requests.
- All responses include `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `Cache-Control: no-store`.
- `X-Powered-By` is no longer disclosed.

## 2. Findings

### F-1 (HIGH) Anonymous access to admin and resident HTML
- Before: `app.get('/admin', ...)` served `admin/index.html` unconditionally; client-side `checkSession()` then redirected. `/admin/content/<page>.html` was served directly with no check at all.
- Risk: an unauthenticated visitor could load admin UI shells, inspect markup, see internal route names, leak structure of the admin/staff app, and in a misconfigured backend even attempt to call API endpoints that did not also enforce role checks.
- Status: FIXED. Server-side `requireStaff` and `requireResident` middleware now run on the Express layer and forward the user's cookies to `${API_BASE}/api/auth/check`. Only a valid backend session with the correct role receives the HTML; everyone else gets `302 → /`.

### F-2 (HIGH) Fake login endpoint on the static server
- Before: `app.post('/api/login')` returned `{ success: true, token: 'temporary_token' }` with no validation.
- Risk: any client probing this endpoint would receive a "successful" login response and could be used to mislead users, automated scanners, or future internal tooling.
- Status: FIXED. The stub has been removed entirely. Authentication remains the responsibility of the FastAPI backend at `/api/auth/login`.

### F-3 (MEDIUM) Missing security headers
- Before: no `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, or `Permissions-Policy`.
- Status: FIXED. A small global middleware adds all of the above to every response. A `Cache-Control: no-store` was also added so authenticated HTML cannot be served from a shared cache after logout.

### F-4 (LOW) Server fingerprinting
- Before: Express advertised `X-Powered-By: Express`.
- Status: FIXED via `app.disable('x-powered-by')`.

### F-5 (LOW) Static handler ordering risk
- Before: `app.use(express.static('public'))` ran before route-level guards, which meant even if a guard was added later it could be bypassed by a URL that the static handler would resolve first.
- Status: FIXED. Route guards for `/admin*` and `/user*` are registered first; the catch-all static handler runs last and is configured with `{ index: false }` so it cannot autoserve `index.html` for protected sub-paths.

## 3. What is now guarded

| Path | Allowed roles | Behavior for others |
|---|---|---|
| `/admin`, `/admin/*`, `/admin/content/*` | `ROOT`, `ADMIN`, `OPERATOR`, `SALES` | `302 → /` |
| `/user`, `/user/*` | `RESIDENT` | `302 → /` |
| `/maintenance`, `/accountant` | any authenticated session | `302 → /` |
| `/` | public | login page |
| `/qr-password-setup`, `/qr-password-setup.html` | public (link from email) | renders setup page |
| `/css/*`, `/js/*`, `/assets/*`, `/images/*` | public | static |

The role list is taken directly from `backend_repo/app/models.py:RoleEnum` (`ROOT`, `ADMIN`, `OPERATOR`, `RESIDENT`, `SALES`).

## 4. How the new guard works

1. Browser requests a protected URL.
2. Express middleware reads the user's `Cookie` header.
3. Middleware calls `${API_BASE}/api/auth/check` server-to-server with that cookie.
4. Backend returns `{ authenticated: true, role: 'ADMIN', ... }` only if the HttpOnly session cookie is valid.
5. Middleware compares `role` against the allowed set for that route.
6. Only on a successful match does Express call `res.sendFile(...)` for the HTML.

Because the session cookie is `HttpOnly`, it cannot be tampered with from JavaScript, and because the validation is performed on the Node server (not in the browser), JS-disabled clients, scrapers, raw `curl`, or directly-typed deep links cannot reach protected HTML.

## 5. Live verification

After deploy, the following probes were run against the production frontend:

```
GET / -> 200
GET /admin -> 302 Location: /
GET /admin/index.html -> 302 Location: /
GET /admin/content/dashboard.html -> 302 Location: /
GET /admin/content/users.html -> 302 Location: /
GET /user -> 302 Location: /
GET /user/dashboard.html -> 302 Location: /
GET /maintenance -> 302 Location: /
GET /accountant -> 302 Location: /
```

All responses additionally carry: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `Cache-Control: no-store`, and no `X-Powered-By`.

## 6. Recommended follow-ups (out of scope of this fix)

These are not blocking, but worth scheduling:

1. Backend hardening review for every `/api/*` router: confirm each router enforces role at the FastAPI dependency level, not only at the UI level. The session middleware is in place but a per-route role decorator audit is still recommended.
2. Add a strict CSP on the frontend Express server (currently relies on default). A baseline CSP allowing only `self` plus the backend origin and known CDN origins (Bootstrap, MDI, Google Pay) would further reduce XSS impact.
3. Add `Strict-Transport-Security` header at the Railway edge or in Express once HTTPS-only is fully verified for both apps.
4. Move `localStorage.userRole` usage to display-only logic; never rely on it for any access decision (already true on the server side, but worth removing client-side reliance over time).
5. Periodic anonymous-access scan: keep the script in step 5 above as part of CI smoke tests.

## 7. Files changed

- `frontend_repo/server.js` — full rewrite of routing/static order, addition of `requireStaff` / `requireResident` / `requireAnyAuth` middleware, removal of `/api/login` stub, addition of security headers and `x-powered-by` disable.
- `frontend_repo/package.json` — added `engines: { node: ">=18.17" }` so Railway/CI pin a Node version that ships native `fetch`.
