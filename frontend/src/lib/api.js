import { getToken } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

function query(params = {}) {
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v !== undefined && v !== null));
  return new URLSearchParams(clean).toString();
}

async function request(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || "Request failed");
  }
  return payload;
}

export const api = {
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),
  updateProfile: (body) => request("/auth/profile", { method: "PATCH", body: JSON.stringify(body) }),

  universities: (params) => request(`/universities?${query(params)}`),
  popularUniversities: () => request("/universities/popular"),

  programs: (params) => request(`/programs?${query(params)}`),

  dashboard: () => request("/dashboard/overview"),
  recommendations: (studentId = "me") => request(`/recommendations/${studentId}`),

  applications: (params = {}) => request(`/applications?${query(params)}`),
  createApplication: (body) => request("/applications", { method: "POST", body: JSON.stringify(body) }),
  updateApplicationStatus: (id, body) =>
    request(`/applications/${id}/status`, { method: "PATCH", body: JSON.stringify(body) }),
};
