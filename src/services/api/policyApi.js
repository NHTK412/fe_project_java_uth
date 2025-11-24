/* eslint-disable no-undef */
// policyApi.js
const API_BASE_URL = 'http://localhost:8080/api/policy';

// Hàm lấy token từ localStorage hoặc nơi lưu trữ khác
const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Hàm tạo headers với authentication
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Hàm xử lý response
const handleResponse = async (response) => {
  // Nếu response không có content (204 No Content)
  if (response.status === 204) {
    return { success: true, data: null };
  }

  // Kiểm tra xem response có content không
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return { success: true, data: null };
  }

  // Parse JSON
  const data = await response.json();

  // Kiểm tra status code
  if (!response.ok) {
    // Xử lý các mã lỗi cụ thể
    if (response.status === 401) {
      // Unauthorized - có thể redirect về trang login
      console.error('Unauthorized. Please login again.');
      // window.location.href = '/login'; // Uncomment nếu cần redirect
      throw new Error('Bạn cần đăng nhập để thực hiện thao tác này');
    }
    if (response.status === 403) {
      throw new Error('Bạn không có quyền thực hiện thao tác này');
    }
    if (response.status === 404) {
      throw new Error('Không tìm thấy dữ liệu');
    }
    if (response.status === 400) {
      throw new Error(data.message || 'Dữ liệu không hợp lệ');
    }
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  return data;
};

export const policyAPI = {
  // Lấy danh sách chính sách
  getAll: async (page = 0, size = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}?page=${page+1}&size=${size}`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Lỗi khi tải danh sách:', error);
      throw error;
    }
  },

  // Lấy chi tiết chính sách theo ID
  getById: async (policyId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${policyId}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Lỗi khi tải chi tiết:', error);
      throw error;
    }
  },

  // Tạo chính sách mới
  create: async (data) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Lỗi khi tạo mới:', error);
      throw error;
    }
  },

  // Cập nhật chính sách
  update: async (policyId, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${policyId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      throw error;
    }
  },

  // Xóa chính sách
  delete: async (policyId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${policyId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      throw error;
    }
  },
};