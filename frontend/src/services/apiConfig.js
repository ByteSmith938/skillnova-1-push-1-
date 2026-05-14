const trimTrailingSlash = (value) => value.replace(/\/$/, "");

const getWindowOrigin = (port) => {
  const protocol = window.location.protocol || "http:";
  const hostname = window.location.hostname;
  return `${protocol}//${hostname}:${port}`;
};

export const getPublicFrontendOrigin = () => {
  const configuredHost = import.meta.env.VITE_PUBLIC_HOST;
  const hostname = window.location.hostname;

  const isLanIp =
    /^192\.168\./.test(hostname) ||
    /^10\./.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);

  if (configuredHost) {
    return `http://${configuredHost}:5173`;
  }

  if (isLanIp) {
    return window.location.origin;
  }

  return window.location.origin;
};

export const API_BASE_URL = (() => {
  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const envApiUrl = import.meta.env.VITE_API_BASE_URL;

  // If browser is on localhost, always prefer localhost:5000 for stability
  if (isLocalhost) return "http://localhost:5000";

  // Otherwise use env var or dynamic origin
  return trimTrailingSlash(envApiUrl || getWindowOrigin("5000"));
})();

export const getAuthToken = () => localStorage.getItem("skillnova_auth_token") || "";

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
