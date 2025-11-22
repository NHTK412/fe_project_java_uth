const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const appointmentApi = {
  /**
   * Lấy tất cả lịch hẹn lái thử
   */
  getAllAppointments: async (params = {}) => {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(
          ([_, value]) => value !== null && value !== undefined && value !== ""
        )
      );

      const query = new URLSearchParams(cleanParams).toString();
      const url = query
        ? `${API_BASE_URL}/test-drive-appointments?${query}`
        : `${API_BASE_URL}/test-drive-appointments`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Lấy danh sách lịch hẹn lái thử thất bại"
        );
      }

      return await res.json();
    } catch (error) {
      console.error("Lấy danh sách lịch hẹn lái thử thất bại:", error);
      throw error;
    }
  },

  /**
   * Lấy lịch hẹn lái thử theo trạng thái
   */
  getAppointmentsByStatus: async (status) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/test-drive-appointments/by-status?status=${status}`,
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
          errorData.message ||
            `Lấy lịch hẹn lái thử theo trạng thái ${status} thất bại`
        );
      }

      return await res.json();
    } catch (error) {
      console.error(
        `Lấy lịch hẹn lái thử theo trạng thái ${status} thất bại:`,
        error
      );
      throw error;
    }
  },

  /**
   * Cập nhật lịch hẹn lái thử (ngày, giờ, trạng thái)
   */
  updateAppointment: async (id, body = {}) => {
    try {
      const res = await fetch(`${API_BASE_URL}/test-drive-appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Cập nhật lịch hẹn lái thử ${id} thất bại`
        );
      }

      return await res.json();
    } catch (error) {
      console.error(`Cập nhật lịch hẹn lái thử ${id} thất bại:`, error);
      throw error;
    }
  },

  /**
   * Cập nhật trạng thái lịch hẹn lái thử
   */
  updateAppointmentStatus: async (id, status) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/test-drive-appointments/${id}/status?status=${status}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Cập nhật trạng thái lịch hẹn lái thử ${id} thất bại`
        );
      }

      return await res.json();
    } catch (error) {
      console.error(
        `Cập nhật trạng thái lịch hẹn lái thử ${id} thất bại:`,
        error
      );
      throw error;
    }
  },
};
