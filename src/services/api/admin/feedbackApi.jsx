const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const feedbackApi = {
  getAllFeedback: async (params = {}) => {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(
          ([_, value]) => value !== null && value !== undefined && value !== ""
        )
      );

      const query = new URLSearchParams(cleanParams).toString();
      const url = query
        ? `${API_BASE_URL}/feedback?${query}`
        : `${API_BASE_URL}/feedback`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Lấy danh sách phản hồi thất bại");
      }

      return await res.json();
    } catch (error) {
      console.error("Lấy danh sách phản hồi thất bại:", error);
      throw error;
    }
  },

  // Lấy chi tiết feedback theo ID
  getFeedbackDetail: async (feedbackId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/feedback/${feedbackId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Lấy chi tiết phản hồi thất bại");
      }

      return await res.json();
    } catch (error) {
      console.error("Lấy chi tiết phản hồi thất bại:", error);
      throw error;
    }
  },

  // Xử lý feedback
  handleFeedback: async (feedbackId, handleData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/feedback/${feedbackId}/handle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(handleData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Xử lý phản hồi thất bại");
      }

      return await res.json();
    } catch (error) {
      console.error("Xử lý phản hồi thất bại:", error);
      throw error;
    }
  },

  // Đếm feedback theo trạng thái
  countByStatus: async (status) => {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries({ status }).filter(
          ([_, value]) => value !== null && value !== undefined && value !== ""
        )
      );

      const query = new URLSearchParams(cleanParams).toString();
      const url = query
        ? `${API_BASE_URL}/feedback/count?${query}`
        : `${API_BASE_URL}/feedback/count`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Đếm phản hồi thất bại");
      }

      return await res.json();
    } catch (error) {
      console.error("Đếm phản hồi thất bại:", error);
      throw error;
    }
  },

  // Export feedback report
  exportFeedbackReport: async (params = {}) => {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(
          ([_, value]) => value !== null && value !== undefined && value !== ""
        )
      );

      const query = new URLSearchParams(cleanParams).toString();
      const url = query
        ? `${API_BASE_URL}/feedback/export?${query}`
        : `${API_BASE_URL}/feedback/export`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Xuất báo cáo phản hồi thất bại");
      }

      const blob = await res.blob();

      if (blob.type === "application/json") {
        const text = await blob.text();
        const error = JSON.parse(text);
        throw new Error(error.message || "Xuất báo cáo phản hồi thất bại");
      }

      return blob;
    } catch (error) {
      console.error("Xuất báo cáo phản hồi thất bại:", error);
      throw error;
    }
  },
};

// Export default để tương thích với inventoryApi pattern
export default feedbackApi;
