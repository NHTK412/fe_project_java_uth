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

export const warehouseReleaseNoteApi = {
  // Lấy danh sách phiếu xuất (có phân trang)
  getAll: async (page = 1, size = 10) => {
    const url = `${BASE_URL}/export?page=${page}&size=${size}`;
    const res = await fetch(url, { method: "GET", headers: getHeaders(false) });
    return handleResponse(res);
  },

  // Lấy chi tiết phiếu xuất theo id
  getById: async (warehouseReleaseNoteId) => {
    const res = await fetch(`${BASE_URL}/export/${warehouseReleaseNoteId}`, {
      method: "GET",
      headers: getHeaders(false),
    });
    return handleResponse(res);
  },

  // Tạo phiếu xuất mới
  create: async (data) => {
    const res = await fetch(`${BASE_URL}/export`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Cập nhật trạng thái phiếu xuất
  updateStatus: async (warehouseReleaseNoteId, data) => {
    const res = await fetch(`${BASE_URL}/export/${warehouseReleaseNoteId}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Xóa phiếu xuất theo id
  delete: async (warehouseReleaseNoteId) => {
    const res = await fetch(`${BASE_URL}/export/${warehouseReleaseNoteId}`, {
      method: "DELETE",
      headers: getHeaders(false),
    });
    return handleResponse(res);
  },
};
