const BASE_URL = 'http://localhost:8000/api';

const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('access_token');

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw { status: res.status, data };
  }

  return data;
};

export const authApi = {
  register: (payload) =>
    apiFetch('/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload) =>
    apiFetch('/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  logout: () =>
    apiFetch('/logout', { method: 'POST' }),

  refresh: (refreshToken) =>
    apiFetch('/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    }),
};

export default apiFetch;
