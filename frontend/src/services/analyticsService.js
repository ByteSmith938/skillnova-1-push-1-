import { API_BASE_URL, getAuthHeaders } from "./apiConfig";

export const fetchAnalytics = async () => {
  const response = await fetch(`${API_BASE_URL}/api/analytics/dashboard`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch analytics data");
  }

  return response.json();
};
