import { API_BASE_URL, getAuthHeaders } from "./apiConfig";

const REQUEST_TIMEOUT_MS = 8000;

const parseJsonResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  console.log("[workshopApi] response", {
    url: response.url,
    status: response.status,
    ok: response.ok,
    contentType
  });

  if (!response.ok) {
    const errorText = await response.text();
    const errorMsg = `[workshopApi] Request failed: ${response.url} | Status: ${response.status} | ${errorText}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json();
};

export const fetchWorkshops = async () => {
  const url = `${API_BASE_URL}/workshops`;
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  console.log("[workshopApi] GET", url);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal
    });
    const data = await parseJsonResponse(response);
    
    // Handle both { workshops: [...] } and [...]
    const list = data && typeof data === 'object' && Array.isArray(data.workshops) 
      ? data.workshops 
      : Array.isArray(data) ? data : [];

    console.log("[workshopApi] workshops payload", {
      isArray: Array.isArray(list),
      count: list.length
    });
    return list;
  } finally {
    window.clearTimeout(timeoutId);
  }
};

export const createWorkshop = async (workshop) => {
  const response = await fetch(`${API_BASE_URL}/workshops`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(workshop)
  });

  return parseJsonResponse(response);
};

export const deleteWorkshop = async (id) => {
  const response = await fetch(`${API_BASE_URL}/workshops/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Delete failed with status ${response.status}`);
  }
};

export const fetchPublicWorkshop = async (id) => {
  const response = await fetch(`${API_BASE_URL}/workshops/${id}/public`, {
    cache: "no-store"
  });

  return parseJsonResponse(response);
};

export const fetchAdminWorkshop = async (id) => {
  const response = await fetch(`${API_BASE_URL}/workshops/${id}/admin`, {
    cache: "no-store",
    headers: getAuthHeaders()
  });

  return parseJsonResponse(response);
};
