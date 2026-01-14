const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Get session ID for guest cart
const getSessionId = () => {
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId =
      "guest_" +
      Math.random().toString(36).substring(2) +
      Date.now().toString(36);
    localStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
};

// Get auth headers
const getHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
    "x-session-id": getSessionId(),
  };
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: getHeaders(),
    });
    return response.json();
  },
};

// Products API
export const productsAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/products?${query}`);
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return response.json();
  },

  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/products/meta/categories`);
    return response.json();
  },

  create: async (productData) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    return response.json();
  },

  update: async (id, productData) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return response.json();
  },
};

// Cart API
export const cartAPI = {
  get: async () => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  add: async (productId, size, quantity = 1) => {
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ productId, size, quantity }),
    });
    return response.json();
  },

  update: async (productId, size, quantity) => {
    const response = await fetch(`${API_BASE_URL}/cart/update`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ productId, size, quantity }),
    });
    return response.json();
  },

  remove: async (productId, size) => {
    const response = await fetch(`${API_BASE_URL}/cart/remove`, {
      method: "DELETE",
      headers: getHeaders(),
      body: JSON.stringify({ productId, size }),
    });
    return response.json();
  },

  merge: async () => {
    const response = await fetch(`${API_BASE_URL}/cart/merge`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ sessionId: getSessionId() }),
    });
    return response.json();
  },

  clear: async () => {
    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return response.json();
  },
};

// Orders API
export const ordersAPI = {
  checkout: async (shippingAddress) => {
    const response = await fetch(`${API_BASE_URL}/orders/checkout`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ shippingAddress }),
    });
    return response.json();
  },

  getMyOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: getHeaders(),
    });
    return response.json();
  },
};

export { getSessionId };
