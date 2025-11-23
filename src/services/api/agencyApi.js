// src/services/api/admin/agencyApi.js
const BASE_URL = "http://localhost:8080/api/agency";

// Thêm token nếu cần
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

export const fetchAgencies = async (page = 1, size = 10) => {
  const res = await fetch(`${BASE_URL}?page=${page}&size=${size}`, {
    method: "GET",
    headers: getHeaders(),
  });
  return res.json();
};

export const createAgency = async (data) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateAgency = async (id, data) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteAgency = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return res.json();
};
