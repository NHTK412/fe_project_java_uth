/* eslint-disable no-undef */

const BASE_URL = "http://localhost:8080/api/vehicle";
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

export const vehicleApi = {
  getAll: async (page = 0, size = 10, sortBy = "vehicleId", sortDir = "asc") => {
    const url = `${BASE_URL}?page=${page + 1}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
    const res = await fetch(url, { method: "GET", headers: getHeaders(false) });
    return handleResponse(res);
  },
  getById: async (vehicleId) => {
    const res = await fetch(`${BASE_URL}/${vehicleId}`, { method: "GET", headers: getHeaders(false) });
    return handleResponse(res);
  },
  create: async (data) => {
    const res = await fetch(BASE_URL, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
  },
  update: async (vehicleId, data) => {
    const res = await fetch(`${BASE_URL}/${vehicleId}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
  },
  delete: async (vehicleId) => {
    const res = await fetch(`${BASE_URL}/${vehicleId}`, { method: "DELETE", headers: getHeaders(false) });
    return handleResponse(res);
  },
};
