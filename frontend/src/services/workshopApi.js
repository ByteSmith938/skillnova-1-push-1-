import { API_BASE_URL, getAuthHeaders } from "./apiConfig";

const parseJsonResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return null;
};

export const fetchWorkshops = async () => {
  const response = await fetch(`${API_BASE_URL}/workshops/public`);
  if (!response.ok) {
    console.warn("fetchWorkshops: HTTP", response.status);
    return [];
  }
  try {
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn("fetchWorkshops: invalid JSON response", err);
    return [];
  }
};

export const fetchWorkshopById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/workshops/${id}`);
  return parseJsonResponse(response);
};

export const createWorkshop = async (workshopData) => {
  const response = await fetch(`${API_BASE_URL}/workshops`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workshopData),
  });
  return parseJsonResponse(response);
};

export const updateWorkshop = async (id, workshopData) => {
  const response = await fetch(`${API_BASE_URL}/workshops/${id}`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workshopData),
  });
  return parseJsonResponse(response);
};

export const deleteWorkshop = async (id) => {
  const response = await fetch(`${API_BASE_URL}/workshops/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Delete failed");
  }
};
