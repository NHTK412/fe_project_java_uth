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
        throw new Error(errorData.message || "Get feedback list failed");
      }

      return await res.json();
    } catch (error) {
      console.error("Get feedback list failed:", error);
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
        throw new Error(errorData.message || "Get feedback detail failed");
      }

      return await res.json();
    } catch (error) {
      console.error("Get feedback detail failed:", error);
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
        throw new Error(errorData.message || "Handle feedback failed");
      }

      return await res.json();
    } catch (error) {
      console.error("Handle feedback failed:", error);
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
        throw new Error(errorData.message || "Count feedback failed");
      }

      return await res.json();
    } catch (error) {
      console.error("Count feedback failed:", error);
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
        throw new Error("Export feedback report failed");
      }

      const blob = await res.blob();

      if (blob.type === "application/json") {
        const text = await blob.text();
        const error = JSON.parse(text);
        throw new Error(error.message || "Export feedback report failed");
      }

      return blob;
    } catch (error) {
      console.error("Export feedback report failed:", error);
      throw error;
    }
  },
};

export default feedbackApi;
