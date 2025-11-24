/* eslint-disable no-undef */

const BASE_URL = "http://localhost:8080/api/warehouse";
const getToken = () => localStorage.getItem("token");

const getHeaders = (isJson = true) => {
  const token = getToken();
  const headers = {};
  if (isJson) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

const handleResponse = async (res) => {
  try {
    return await res.json();
  } catch {
    return { success: false, message: "Lỗi parse dữ liệu" };
  }
};

export const warehouseReceiptApi = {
  getAll: async (page = 1, size = 10) => {
    const url = `${BASE_URL}/import?page=${page}&size=${size}`;
    const res = await fetch(url, { method: "GET", headers: getHeaders(false) });
    return handleResponse(res);
  },

  getById: async (warehouseReceiptId) => {
    const res = await fetch(`${BASE_URL}/import/${warehouseReceiptId}`, {
      method: "GET",
      headers: getHeaders(false),
    });
    return handleResponse(res);
  },

  create: async (data) => {
    const res = await fetch(`${BASE_URL}/import`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateStatus: async (warehouseReceiptId, data) => {
    const res = await fetch(`${BASE_URL}/import/${warehouseReceiptId}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  delete: async (warehouseReceiptId) => {
    const res = await fetch(`${BASE_URL}/import/${warehouseReceiptId}`, {
      method: "DELETE",
      headers: getHeaders(false),
    });
    return handleResponse(res);
  },
};
