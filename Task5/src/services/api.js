const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.message || data?.error || `Request failed (${response.status})`);
  return data;
}

export const getProfile = () => request("/api/github/profile");
export const getRepositories = () => request("/api/github/repositories");
export const syncRepositories = () => request("/api/github/repositories/sync", { method: "POST" });
export const getRecommendedIssues = () => request("/api/issues/recommended");


export const getContributions = () =>
  request("/api/contributions");

export const saveContribution = (issue) =>
  request("/api/contributions", {
    method: "POST",
    body: JSON.stringify({
      githubId: issue.githubId,
      repositoryFullName: issue.repositoryFullName,
      title: issue.title,
      description: issue.description,
      url: issue.url,
      labels: issue.labels || [],
      matchedSkills: issue.matchedSkills || [],
    }),
  });

export const updateContributionStatus = (id, status) =>
  request(`/api/contributions/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const deleteContribution = (id) =>
  request(`/api/contributions/${id}`, {
    method: "DELETE",
  });