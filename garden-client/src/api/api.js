const BASE_URL = "http://127.0.0.1:8000/api";

const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem("access_token");

    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    let data = {};
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        data = await res.json();
    } else {
        // Handle non-json responses (e.g. server error pages)
        data = { message: (await res.text()) || res.statusText };
    }

    if (!res.ok) {
        throw { status: res.status, data };
    }

    return data;
};

export const authApi = {
    register: (payload) =>
        apiFetch("/register", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    login: (payload) =>
        apiFetch("/login", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    logout: () => apiFetch("/logout", { method: "POST" }),

    refresh: (refreshToken) =>
        apiFetch("/refresh", {
            method: "POST",
            body: JSON.stringify({ refresh_token: refreshToken }),
        }),
};

export const userApi = {
    getProfile: () => apiFetch("/user"),
    updatePassword: (payload) =>
        apiFetch("/user/settings/password", {
            method: "POST",
            body: JSON.stringify(payload),
        }),
    updateAvatar: async (formData) => {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${BASE_URL}/user/settings/avatar`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw { status: res.status, data };
        return data;
    },
};

export const gardenApi = {
    getGarden: () => apiFetch("/garden"),
};

export const tasksApi = {
    getTasks: (status) => {
        const query = status ? `?status=${status}` : "";
        return apiFetch(`/tasks${query}`);
    },
    createTask: (payload) =>
        apiFetch("/tasks", {
            method: "POST",
            body: JSON.stringify(payload),
        }),
    updateTask: (id, payload) =>
        apiFetch(`/tasks/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
        }),
    deleteTask: (id) =>
        apiFetch(`/tasks/${id}`, {
            method: "DELETE",
        }),
    completeTask: (id) =>
        apiFetch(`/tasks/${id}/complete`, {
            method: "PATCH",
        }),
};

export const pomodoroApi = {
    start: () => apiFetch("/pomodoro/start", { method: "POST" }),
    finish: () => apiFetch("/pomodoro/finish", { method: "POST" }),
    getStatus: () => apiFetch("/pomodoro/status"),
};

export default apiFetch;
