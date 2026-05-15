import { API_BASE_URL, getAuthHeaders } from "./apiConfig";

export const fetchChannels = async () => {
  const response = await fetch(`${API_BASE_URL}/api/chat/channels`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch channels");
  return response.json();
};

export const fetchMessages = async (channelId) => {
  const response = await fetch(`${API_BASE_URL}/api/chat/messages/${channelId}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch messages");
  return response.json();
};

export const sendMessage = async (channelId, message) => {
  const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ channelId, message }),
  });
  if (!response.ok) throw new Error("Failed to send message");
  return response.json();
};

export const fetchOnlineUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/api/chat/online-users`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch online users");
  return response.json();
};

export const fetchActivity = async () => {
  const response = await fetch(`${API_BASE_URL}/api/chat/activity`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch activity");
  return response.json();
};
