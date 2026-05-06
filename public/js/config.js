// Global frontend configuration.
// Change API_BASE here once for the whole project.
(function initAppConfig() {
    const userConfig = window.APP_CONFIG || {};
    const configuredBase = userConfig.API_BASE || "http://localhost:8000";
    const normalizedBase = String(configuredBase).replace(/\/+$/, "");

    window.APP_CONFIG = {
        ...userConfig,
        API_BASE: normalizedBase
    };

    // Backward-compatible globals used across legacy pages.
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
                    headers.set("Authorization", `Bearer ${token}`);
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
