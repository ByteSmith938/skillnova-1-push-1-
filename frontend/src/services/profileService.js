import { API_BASE_URL, getAuthHeaders } from "./apiConfig";

const BASE = `${API_BASE_URL}/api/profile`;

/** Fetch the current user's profile from the backend. */
export const fetchProfile = async () => {
  const res = await fetch(`${BASE}/me`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
};

/**
 * Update profile fields (fullName, email, phone).
 * @param {{ fullName?: string, email?: string, phone?: string }} data
 */
export const updateProfile = async (data) => {
  const res = await fetch(`${BASE}/update`, {
    method: "PUT",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update profile");
  }
  return res.json();
};

/**
 * Upload a new avatar image.
 * @param {File} file
 */
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await fetch(`${BASE}/avatar`, {
    method: "POST",
    headers: getAuthHeaders(), // Do NOT set Content-Type — browser sets multipart boundary
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to upload avatar");
  }
  return res.json(); // { avatarUrl }
};

/** Remove the current avatar. */
export const removeAvatar = async () => {
  const res = await fetch(`${BASE}/avatar`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to remove avatar");
  return res.json();
};
