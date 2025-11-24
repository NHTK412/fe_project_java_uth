/* eslint-disable no-undef */
// src/services/api/agencyApi.js

const API_BASE = "http://localhost:8080/api";

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': '*/*',
    'Content-Type': 'application/json'
  };
};

export const fetchAgencies = async (page = 1, size = 10) => {
  try {
    const response = await fetch(`${API_BASE}/agency?page=${page}&size=${size}`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching agencies:', error);
    return {
      success: false,
      message: error.message || 'Không thể tải danh sách đại lý',
      data: null
    };
  }
};

export const fetchAgencyById = async (agencyId) => {
  try {
    const response = await fetch(`${API_BASE}/agency/${agencyId}`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching agency detail:', error);
    return {
      success: false,
      message: error.message || 'Không thể tải chi tiết đại lý',
      data: null
    };
  }
};

export const createAgency = async (agencyData) => {
  try {
    const response = await fetch(`${API_BASE}/agency`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(agencyData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating agency:', error);
    return {
      success: false,
      message: error.message || 'Không thể tạo đại lý mới',
      data: null
    };
  }
};

export const updateAgency = async (agencyId, agencyData) => {
  try {
    const response = await fetch(`${API_BASE}/agency/${agencyId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(agencyData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating agency:', error);
    return {
      success: false,
      message: error.message || 'Không thể cập nhật đại lý',
      data: null
    };
  }
};

export const deleteAgency = async (agencyId) => {
  try {
    const response = await fetch(`${API_BASE}/agency/${agencyId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error deleting agency:', error);
    return {
      success: false,
      message: error.message || 'Không thể xóa đại lý',
      data: null
    };
  }
};

export const fetchAgenciesActive = async () => {
  try {
    let allAgencies = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(`${API_BASE}/agency?page=${page}&size=100`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data && Array.isArray(result.data)) {
        const activeAgencies = result.data.filter(
          agency => agency.status === "Đang Hoạt Động"
        );
        allAgencies = [...allAgencies, ...activeAgencies];

        if (result.data.length < 100) {
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
      message: 'Lấy danh sách đại lý thành công',
      data: allAgencies
    };
  } catch (error) {
    console.error('Error fetching active agencies:', error);
    return {
      success: false,
      message: error.message || 'Không thể tải danh sách đại lý',
      data: []
    };
  }
};