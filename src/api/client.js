const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });
    let data = null;
    try {
        data = await response.json();
    } catch {
        data = null;
    }
    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        const error = new Error(data?.message || "Une erreur est survenue.");
        error.status = response.status;
        throw error;
    }
    return data;
}

export function get(endpoint) {
    return apiRequest(endpoint);
}
export function post(endpoint, body) {
    return apiRequest(endpoint, { method: "POST", body: JSON.stringify(body) });
}
export function put(endpoint, body) {
    return apiRequest(endpoint, { method: "PUT", body: JSON.stringify(body) });
}
export function remove(endpoint) {
    return apiRequest(endpoint, { method: "DELETE" });
}