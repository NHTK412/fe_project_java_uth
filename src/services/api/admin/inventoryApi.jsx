const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const inventoryApi = {
  getInventoryReport: async (params = {}) => {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(
          ([_, value]) => value !== null && value !== undefined && value !== ""
        )
      );

      const query = new URLSearchParams(cleanParams).toString();
      const url = query
        ? `${API_BASE_URL}/reports/inventory?${query}`
        : `${API_BASE_URL}/reports/inventory`;

      // console.log("Test call API:", url);

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Lấy báo cáo thất bại");
      }

      return await res.json();
    } catch (error) {
      // console.error("Lấy báo cáo thất bại: ", error);
      throw error;
    }
  },

  exportInventoryReport: async (params = {}) => {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(
          ([_, value]) => value !== null && value !== undefined && value !== ""
        )
      );

      const query = new URLSearchParams(cleanParams).toString();
      const url = query
        ? `${API_BASE_URL}/reports/inventory/export?${query}`
        : `${API_BASE_URL}/reports/inventory/export`;

      // console.log("Export tuwf: ", url);
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Xuất báo cáo thất bại");
      }

      const blob = await res.blob();

      if (blob.type === "application/json") {
        const text = await blob.text();
        const error = JSON.parse(text);
        throw new Error(error.message || "Xuất báo cáo thất bại");
      }

      return blob;
    } catch (error) {
      // console.error("Xuất báo cáo thất bại:", error);
      throw error;
    }
  },

  getInventoryReportPost: async (body = {}) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reports/inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Lấy báo cáo thất bại");
      }

      return await res.json();
    } catch (error) {
      // console.error("Lấy báo cáo thất bại (POST):", error);
      throw error;
    }
  },

  exportInventoryReportPost: async (body = {}) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reports/inventory/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Xuất báo cáo thất bại");
      }

      const blob = await res.blob();

      if (blob.type === "application/json") {
        const text = await blob.text();
        const error = JSON.parse(text);
        throw new Error(error.message || "Xuất báo cáo thất bại");
      }

      return blob;
    } catch (error) {
      // console.error("Xuất báo cáo thất bại (POST):", error);
      throw error;
    }
  },
};
