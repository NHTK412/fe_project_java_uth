/* eslint-disable no-undef */
const BASE_URL = "http://localhost:8080/api/vehicle/type";

// Lấy token từ localStorage
const getToken = () => localStorage.getItem("token");

// Tạo headers, luôn gửi token và Content-Type JSON
const getHeaders = () => {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

// Xử lý response, thêm check 401/403
const handleResponse = async (res) => {
  if (res.status === 401 || res.status === 403) {
    return { success: false, message: "Unauthorized", unauthorized: true };
  }
  try {
    const data = await res.json();
    return data;
  } catch {
    return { success: false, message: "Lỗi parse dữ liệu" };
  }
};

export const vehicleTypeApi = {
  getAll: async (page = 0, size = 10) => {
    try {
      const url = `${BASE_URL}?page=${page + 1}&size=${size}`;
      const res = await fetch(url, { method: "GET", headers: getHeaders() });
      return await handleResponse(res);
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  getById: async (vehicleTypeId) => {
    try {
      const url = `${BASE_URL}/${vehicleTypeId}`;
      const res = await fetch(url, { method: "GET", headers: getHeaders() });
      return await handleResponse(res);
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  create: async (data) => {
    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return await handleResponse(res);
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  update: async (vehicleTypeId, data) => {
    try {
      const url = `${BASE_URL}/${vehicleTypeId}`;
      const res = await fetch(url, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return await handleResponse(res);
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  delete: async (vehicleTypeId) => {
    try {
      const url = `${BASE_URL}/${vehicleTypeId}`;
      const res = await fetch(url, { method: "DELETE", headers: getHeaders() });
      return await handleResponse(res);
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  fetchAllVehicleTypes: async () => {
    try {
      let allVehicleTypes = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const url = `${BASE_URL}?page=${page}&size=100`;
        const res = await fetch(url, { method: "GET", headers: getHeaders() });
        const result = await handleResponse(res);

        if (result.success && result.data && result.data.content && Array.isArray(result.data.content)) {
          allVehicleTypes = [...allVehicleTypes, ...result.data.content];

          if (result.data.content.length < 100 || result.data.last) {
            hasMore = false;
          } else {
            page++;
          }
        } else {
          hasMore = false;
        }
      }

      return {
        success: true,
        message: 'Lấy danh sách loại xe thành công',
        data: allVehicleTypes
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Không thể tải danh sách loại xe',
        data: []
      };
    }
  },
};
