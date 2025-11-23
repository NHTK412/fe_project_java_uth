/* eslint-disable no-undef */
// src/services/api/agencyApi.js
const API_URL = "/api/agency";
const getToken = () => localStorage.getItem("token");

const request = async (url, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
    ...options.headers,
  };
  const res = await fetch(url, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Lỗi API");
  return data;
};

export const agencyApi = {
  getAll: (page = 1, size = 10) =>
    request(`${API_URL}?page=${page}&size=${size}`),

  getById: (id) => request(`${API_URL}/${id}`),

  create: (data) =>
    request(API_URL, { method: "POST", body: JSON.stringify(data) }),

  update: (id, data) =>
    request(`${API_URL}/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id) =>
    request(`${API_URL}/${id}`, { method: "DELETE" }),
};
