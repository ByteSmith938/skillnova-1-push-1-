import { API_BASE_URL, FRONTEND_URL } from "../config/env";

export { API_BASE_URL, FRONTEND_URL };

export const getAuthToken = () => localStorage.getItem("skillnova_auth_token") || "";

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
