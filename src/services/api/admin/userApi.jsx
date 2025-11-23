const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const getHeaders = () => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Employee API
export const employeeApi = {
  getAll: async (
    page = 1,
    size = 10,
    sortBy = "employeeId",
    sortDir = "asc"
  ) => {
    // Đảm bảo page > 0 theo quy định backend
    const validPage = Math.max(1, Math.floor(page));
    const res = await fetch(
      `${API_BASE_URL}/employees?page=${validPage}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
      { headers: getHeaders() }
    );
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${API_BASE_URL}/employees`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },

  getByRole: async (role, page = 1, size = 10) => {
    // Đảm bảo page > 0 theo quy định backend
    const validPage = Math.max(1, Math.floor(page));
    const res = await fetch(
      `${API_BASE_URL}/employees/by-position?role=${role}&page=${validPage}&size=${size}`,
      { headers: getHeaders() }
    );
    return res.json();
  },

  getByAgency: async (agencyId, page = 1, size = 10) => {
    // Đảm bảo page > 0 theo quy định backend
    const validPage = Math.max(1, Math.floor(page));
    const res = await fetch(
      `${API_BASE_URL}/employees/agencies/${agencyId}?page=${validPage}&size=${size}`,
      { headers: getHeaders() }
    );
    return res.json();
  },
};

// Customer API
export const customerApi = {
  getAll: async (
    page = 1,
    size = 10,
    sortBy = "customerId",
    sortDir = "asc"
  ) => {
    // Đảm bảo page > 0 theo quy định backend
    const validPage = Math.max(1, Math.floor(page));
    const res = await fetch(
      `${API_BASE_URL}/customers?page=${validPage}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
      { headers: getHeaders() }
    );
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/customers/${id}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${API_BASE_URL}/customers`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },

  getByMembership: async (level, page = 1, size = 10) => {
    // Đảm bảo page > 0 theo quy định backend
    const validPage = Math.max(1, Math.floor(page));
    const res = await fetch(
      `${API_BASE_URL}/customers/by-membership?level=${level}&page=${validPage}&size=${size}`,
      { headers: getHeaders() }
    );
    return res.json();
  },

  getTotalCount: async () => {
    const res = await fetch(`${API_BASE_URL}/customers/total-count`, {
      headers: getHeaders(),
    });
    return res.json();
  },
};
