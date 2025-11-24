/* eslint-disable no-undef */
const BASE_URL = "http://localhost:8080/api/vehicle/type/detail";
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
    const data = await res.json();
    return data;
  } catch {
    return { success: false, message: "Lỗi parse dữ liệu" };
  }
};

export const vehicleTypeDetailApi = {
  getAll: async (page = 0, size = 10) => {
    try {
      let url = `${BASE_URL}?page=${page + 1}&size=${size}`;
      const res = await fetch(url, { method: "GET", headers: getHeaders(false) });
      return await handleResponse(res);
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  getById: async (vehicleTypeDetailId) => {
    try {
      const url = `${BASE_URL}/${vehicleTypeDetailId}`;
      const res = await fetch(url, { method: "GET", headers: getHeaders(false) });
      return await handleResponse(res);
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  create: async (data) => {
    try {
      const res = await fetch(BASE_URL, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) });
      return await handleResponse(res);
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  update: async (vehicleTypeDetailId, data) => {
    try {
      const url = `${BASE_URL}/${vehicleTypeDetailId}`;
      const res = await fetch(url, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) });
      return await handleResponse(res);
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  delete: async (vehicleTypeDetailId) => {
    try {
      const url = `${BASE_URL}/${vehicleTypeDetailId}`;
      const res = await fetch(url, { method: "DELETE", headers: getHeaders(false) });
      return await handleResponse(res);
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  fetchAllVehicleTypeDetails: async (vehicleTypeId = null) => {
    try {
      let allDetails = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        let url = `${BASE_URL}?page=${page}&size=100`;
        if (vehicleTypeId) url += `&vehicleTypeId=${vehicleTypeId}`;

        const res = await fetch(url, { method: "GET", headers: getHeaders(false) });
        const result = await handleResponse(res);

        if (result.success && result.data && result.data.content && Array.isArray(result.data.content)) {
          allDetails = [...allDetails, ...result.data.content];

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
        message: 'Lấy danh sách chi tiết loại xe thành công',
        data: allDetails
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Không thể tải danh sách chi tiết loại xe',
        data: []
      };
    }
  },
};
