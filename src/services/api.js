const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://tickets-backend-4pxl.onrender.com/api';

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';

  let data;

  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' && data?.message
        ? data.message
        : typeof data === 'string' && data
        ? data
        : 'Error en la petición al servidor';

    throw new Error(message);
  }

  return data;
};

const jsonHeaders = (token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const ticketService = {
  getAll: async (token) => {
    const response = await fetch(`${API_URL}/tickets`, {
      method: 'GET',
      headers: jsonHeaders(token),
    });

    return handleResponse(response);
  },

  create: async (ticket, token) => {
    const response = await fetch(`${API_URL}/tickets`, {
      method: 'POST',
      headers: jsonHeaders(token),
      body: JSON.stringify(ticket),
    });

    return handleResponse(response);
  },

  update: async (id, updates, token) => {
    const response = await fetch(`${API_URL}/tickets/${id}`, {
      method: 'PUT',
      headers: jsonHeaders(token),
      body: JSON.stringify(updates),
    });

    return handleResponse(response);
  },

  delete: async (id, token) => {
    const response = await fetch(`${API_URL}/tickets/${id}`, {
      method: 'DELETE',
      headers: jsonHeaders(token),
    });

    return handleResponse(response);
  },
};

export const authService = {
  getProfile: async (token) => {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: jsonHeaders(token),
    });

    return handleResponse(response);
  },

  updateProfile: async (token, payload) => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: jsonHeaders(token),
      body: JSON.stringify(payload),
    });

    return handleResponse(response);
  },

  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({
        email,
        password,
      }),
    });

    return handleResponse(response);
  },

  register: async (name, email, password, role = 'user') => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({
        name,
        email,
        password,
        role,
      }),
    });

    return handleResponse(response);
  },

  createUser: async (payload, token) => {
    const response = await fetch(`${API_URL}/auth/users`, {
      method: 'POST',
      headers: jsonHeaders(token),
      body: JSON.stringify(payload),
    });

    return handleResponse(response);
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({
        email,
      }),
    });

    return handleResponse(response);
  },

  resetPassword: async (token, newPassword) => {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({
        token,
        newPassword,
      }),
    });

    return handleResponse(response);
  },
};