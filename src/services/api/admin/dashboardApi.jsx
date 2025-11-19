const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

import {
  revenueMock7Days,
  revenueMock30Days,
  revenueMock90Days,
} from "../../../databases/mockRevenueData";

import {
  inventoryMockTopDealers7,
  inventoryMockTopDealers30,
  inventoryMockTopDealers90,
} from "../../../databases/mockInventoryData";

const getMockRevenueData = (period) => {
  if (period === "7days") return revenueMock7Days;
  if (period === "30days") return revenueMock30Days;
  if (period === "90days") return revenueMock90Days;
  return [];
};

const getMockInventoryData = (period) => {
  if (period === "7days") return inventoryMockTopDealers7;
  if (period === "30days") return inventoryMockTopDealers30;
  if (period === "90days") return inventoryMockTopDealers90;
  return [];
};

// Biểu đồ doanh thu
export const fetchRevenueData = async (period = "7days") => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/dashboard/revenue?period=${period}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch revenue data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    return getMockRevenueData(period);
  }
};

// Biểu đồ tồn kho
export const fetchInventoryData = async (period = "7days", limit = 4) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/dashboard/inventory/top-dealers?limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch inventory data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    return getMockInventoryData(period);
  }
};

// Tổng người dùng
export const fetchTotalUsers = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/customers/total-count`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch total users");
    return await res.json();
  } catch (err) {
    console.error(err);
    return { data: 0 };
  }
};

// Tổng đại lý
export const fetchTotalDealers = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/employees/agencies/1/count`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch total dealers");
    return await res.json();
  } catch (err) {
    console.error(err);
    return { data: 0 };
  }
};

// Tổng khách hàng
export const fetchTotalEmployees = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/employees/total-count`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch total employees");
    return await res.json();
  } catch (err) {
    console.error(err);
    return { data: 0 };
  }
};

// Tổng doanh thu
export const fetchTotalRevenue = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/revenue/total`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch total revenue");
    return await res.json();
  } catch (err) {
    console.error(err);
    return { data: 0 };
  }
};

// Thông kê đại lý theo thành phố
export const fetchDealersByCity = async () => {
  try {
    const response = await fetch("/api/admin/dealers/by-city", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch dealers by city");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching dealers by city:", error);
    return {
      success: true,
      data: [
        { city: "Hồ Chí Minh", count: 25 },
        { city: "Hà Nội", count: 18 },
        { city: "Đà Nẵng", count: 12 },
        { city: "Hải Phòng", count: 8 },
        { city: "Cần Thơ", count: 5 },
        { city: "Phú Quốc", count: 3 },
        { city: "Quần đảo Hoàng Sa", count: 0 },
        { city: "Quần đảo Trường Sa", count: 0 },
      ],
    };
  }
};
