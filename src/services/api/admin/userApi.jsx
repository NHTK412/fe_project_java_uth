const API_BASE = "http://localhost:8080/api";

const getHeaders = () => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("accessToken");
  // console.log("Test lấy token:", token);
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Employee API
export const employeeApi = {
  getAll: async (
    page = 0,
    size = 10,
    sortBy = "employeeId",
    sortDir = "asc"
  ) => {
    const res = await fetch(
      `${API_BASE}/employees?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
      { headers: getHeaders() }
    );
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE}/employees/${id}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${API_BASE}/employees`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${API_BASE}/employees/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE}/employees/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },

  getByRole: async (role, page = 0, size = 10) => {
    const res = await fetch(
      `${API_BASE}/employees/by-position?role=${role}&page=${page}&size=${size}`,
      { headers: getHeaders() }
    );
    return res.json();
  },

  getByAgency: async (agencyId, page = 0, size = 10) => {
    const res = await fetch(
      `${API_BASE}/employees/agencies/${agencyId}?page=${page}&size=${size}`,
      { headers: getHeaders() }
    );
    return res.json();
  },
};

// Customer API
export const customerApi = {
  getAll: async (
    page = 0,
    size = 10,
    sortBy = "customerId",
    sortDir = "asc"
  ) => {
    const res = await fetch(
      `${API_BASE}/customers?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
      { headers: getHeaders() }
    );
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE}/customers/${id}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${API_BASE}/customers`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${API_BASE}/customers/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE}/customers/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },

  getByMembership: async (level, page = 0, size = 10) => {
    const res = await fetch(
      `${API_BASE}/customers/by-membership?level=${level}&page=${page}&size=${size}`,
      { headers: getHeaders() }
    );
    return res.json();
  },

  getTotalCount: async () => {
    const res = await fetch(`${API_BASE}/customers/total-count`, {
      headers: getHeaders(),
    });
    return res.json();
  },
};
