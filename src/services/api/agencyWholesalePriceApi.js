/* eslint-disable no-undef */
// src/services/api/agencyWholesalePriceApi.js

const API_BASE = "http://localhost:8080/api/agencyWholesalePrices";

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
    "Accept": "*/*"
  };
};

export const fetchWholesalePrices = async (page = 1, size = 10) => {
  try {
    const response = await fetch(`${API_BASE}?page=${page}&size=${size}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching wholesale prices:", error);
    return {
      success: false,
      message: error.message || "Không thể tải danh sách giá sỉ",
      data: null
    };
  }
};

export const fetchWholesalePriceById = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching wholesale price by ID:", error);
    return {
      success: false,
      message: error.message || "Không thể tải chi tiết giá sỉ",
      data: null
    };
  }
};

export const createWholesalePrice = async (data) => {
  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating wholesale price:", error);
    return {
      success: false,
      message: error.message || "Không thể tạo giá sỉ mới",
      data: null
    };
  }
};

export const updateWholesalePrice = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating wholesale price:", error);
    return {
      success: false,
      message: error.message || "Không thể cập nhật giá sỉ",
      data: null
    };
  }
};

export const deleteWholesalePrice = async (agencyWholesalePriceId) => {
  try {
    const response = await fetch(`${API_BASE}/${agencyWholesalePriceId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting wholesale price:", error);
    return {
      success: false,
      message: error.message || "Không thể xóa giá sỉ",
      data: null
    };
  }
};