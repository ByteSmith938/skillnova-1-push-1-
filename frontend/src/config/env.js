/**
 * Centralised environment config.
 *
 * Priority for API_BASE_URL:
 *   1. VITE_API_BASE_URL   — explicit override (always set this in .env.local / production)
 *   2. VITE_PUBLIC_HOST    — LAN IP → builds http://<host>:5000
 *   3. window.location.hostname at runtime → same host, port 5000
 *   4. localhost fallback
 *
 * Priority for FRONTEND_URL:
 *   1. VITE_FRONTEND_URL   — explicit override
 *   2. VITE_PUBLIC_HOST    — LAN IP → builds http://<host>:5173
 *   3. window.location.origin at runtime — always correct on any device
 *   4. localhost fallback
 */

// API backend URL
export const API_BASE_URL = (() => {
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
  if (import.meta.env.VITE_PUBLIC_HOST)   return `http://${import.meta.env.VITE_PUBLIC_HOST}:5000`;
  if (typeof window !== "undefined")      return `${window.location.protocol}//${window.location.hostname}:5000`;
  return "http://localhost:5000";
})();

// Frontend URL used for QR codes and shareable links
export const FRONTEND_URL = (() => {
  if (import.meta.env.VITE_FRONTEND_URL) return import.meta.env.VITE_FRONTEND_URL;
  if (import.meta.env.VITE_PUBLIC_HOST)  return `http://${import.meta.env.VITE_PUBLIC_HOST}:5173`;
  if (typeof window !== "undefined")     return window.location.origin;
  return "http://localhost:5173";
})();

// Convenience flag
export const IS_DEV = import.meta.env.DEV === true;
