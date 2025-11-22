const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const deliveryApi = {
  /**
   * Lấy tất cả giao xe
   */
  getAllDeliveries: async (params = {}) => {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(
          ([_, value]) => value !== null && value !== undefined && value !== ""
        )
      );

      const query = new URLSearchParams(cleanParams).toString();
      const url = query
        ? `${API_BASE_URL}/vehicle-deliveries?${query}`
        : `${API_BASE_URL}/vehicle-deliveries`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Lấy danh sách giao xe thất bại");
      }

      return await res.json();
    } catch (error) {
      console.error("Lấy danh sách giao xe thất bại:", error);
      throw error;
    }
  },

  /**
   * Lấy giao xe theo trạng thái
   */
  getDeliveriesByStatus: async (status) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/vehicle-deliveries/by-status?status=${status}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Lấy giao xe theo trạng thái ${status} thất bại`
        );
      }

      return await res.json();
    } catch (error) {
      console.error(`Lấy giao xe theo trạng thái ${status} thất bại:`, error);
      throw error;
    }
  },
  /**
   * Tạo giao xe mới
   */
  createDelivery: async (body = {}) => {
    try {
      const res = await fetch(`${API_BASE_URL}/vehicle-deliveries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Tạo giao xe thất bại");
      }

      return await res.json();
    } catch (error) {
      console.error("Tạo giao xe thất bại:", error);
      throw error;
    }
  },

  /**
   * Cập nhật giao xe
   */
  updateDelivery: async (id, body = {}) => {
    try {
      const res = await fetch(`${API_BASE_URL}/vehicle-deliveries/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Cập nhật giao xe ${id} thất bại`);
      }

      return await res.json();
    } catch (error) {
      console.error(`Cập nhật giao xe ${id} thất bại:`, error);
      throw error;
    }
  },
};
