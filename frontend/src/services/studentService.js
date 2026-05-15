import { API_BASE_URL, getAuthHeaders } from "./apiConfig";

/**
 * Public: fetch all workshops available for registration.
 * Used by the Register page.
 */
export const fetchWorkshops = async () => {
  const res = await fetch(`${API_BASE_URL}/workshops/public`);
  if (!res.ok) {
    console.warn("fetchWorkshops: HTTP", res.status);
    return [];
  }
  try {
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn("fetchWorkshops: invalid JSON", err);
    return [];
  }
};

/**
 * Public: submit student registration form.
 * @param {FormData} formData
 * @returns {Promise<string>} success message from server
 */
export const registerStudent = async (formData) => {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    // Do NOT set Content-Type — browser sets multipart/form-data boundary automatically
    body: formData,
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || `Registration failed (HTTP ${res.status})`);
  }

  return text;
};

// ── Admin endpoints (require auth) ──────────────────────────────────────────

export const fetchAllStudents = async () => {
  const res = await fetch(`${API_BASE_URL}/students`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch all students");
  return res.json();
};

export const fetchStudentsByWorkshop = async (workshopId) => {
  const res = await fetch(`${API_BASE_URL}/workshop/${workshopId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch students");
  return res.json();
};

export const fetchStudentById = async (studentId) => {
  const res = await fetch(`${API_BASE_URL}/student/${studentId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch student");
  return res.json();
};

export const updateStudent = async (studentId, data) => {
  const res = await fetch(`${API_BASE_URL}/student/${studentId}`, {
    method: "PUT",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update student");
  return res.json();
};

export const updateStudentPaymentStatus = async (studentId, paymentStatus) => {
  const res = await fetch(`${API_BASE_URL}/student/${studentId}/payment-status`, {
    method: "PATCH",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ paymentStatus }),
  });
  if (!res.ok) throw new Error("Failed to update payment status");
  return res.json();
};

export const deleteStudent = async (studentId) => {
  const res = await fetch(`${API_BASE_URL}/student/${studentId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete student");
  return res.json();
};
