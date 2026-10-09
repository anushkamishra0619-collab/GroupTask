const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await parseResponse(response).catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export async function getProfile() {
  return apiRequest("/api/profile");
}

export async function getRepositories() {
  return apiRequest("/api/repositories");
}

export async function syncRepositories() {
  return apiRequest("/api/repositories/sync", {
    method: "POST",
  });
}
