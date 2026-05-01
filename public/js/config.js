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
})();
