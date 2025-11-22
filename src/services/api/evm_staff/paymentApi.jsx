const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const paymentApi = {
  /**
   * Lấy tất cả thanh toán
   */
  getAllPayments: async (params = {}) => {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(
          ([_, value]) => value !== null && value !== undefined && value !== ""
        )
      );

      const query = new URLSearchParams(cleanParams).toString();
      const url = query
        ? `${API_BASE_URL}/payments?${query}`
        : `${API_BASE_URL}/payments`;

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
          errorData.message || "Lấy danh sách thanh toán thất bại"
        );
      }

      return await res.json();
    } catch (error) {
      console.error("Lấy danh sách thanh toán thất bại:", error);
      throw error;
    }
  },

  /**
   * Lấy thanh toán theo ID
   */
  getPaymentById: async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/payments/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Lấy thanh toán ${id} thất bại`);
      }

      return await res.json();
    } catch (error) {
      console.error(`Lấy thanh toán ${id} thất bại:`, error);
      throw error;
    }
  },

  /**
   * Lấy thanh toán theo trạng thái
   */
  getPaymentsByStatus: async (status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/payments/status/${status}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Lấy thanh toán theo trạng thái ${status} thất bại`
        );
      }

      return await res.json();
    } catch (error) {
      console.error(
        `Lấy thanh toán theo trạng thái ${status} thất bại:`,
        error
      );
      throw error;
    }
  },

  /**
   * Lấy thanh toán theo Order ID
   */
  getPaymentsByOrderId: async (orderId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/payments/orders/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Lấy thanh toán cho Order ${orderId} thất bại`
        );
      }

      return await res.json();
    } catch (error) {
      console.error(`Lấy thanh toán cho Order ${orderId} thất bại:`, error);
      throw error;
    }
  },

  /**
   * Tạo thanh toán mới
   */
  createPayment: async (body = {}) => {
    try {
      const res = await fetch(`${API_BASE_URL}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Tạo thanh toán thất bại");
      }

      return await res.json();
    } catch (error) {
      console.error("Tạo thanh toán thất bại:", error);
      throw error;
    }
  },

  /**
   * Cập nhật thanh toán
   */
  updatePayment: async (id, body = {}) => {
    try {
      const res = await fetch(`${API_BASE_URL}/payments/${id}`, {
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
          errorData.message || `Cập nhật thanh toán ${id} thất bại`
        );
      }

      return await res.json();
    } catch (error) {
      console.error(`Cập nhật thanh toán ${id} thất bại:`, error);
      throw error;
    }
  },

  /**
   * Xác nhận thanh toán tiền mặt
   */
  confirmCashPayment: async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/payments/${id}/confirm-cash`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Xác nhận thanh toán tiền mặt ${id} thất bại`
        );
      }

      return await res.json();
    } catch (error) {
      console.error(`Xác nhận thanh toán tiền mặt ${id} thất bại:`, error);
      throw error;
    }
  },

  /**
   * Tạo link thanh toán VNPAY
   */
  createVNPAYPayment: async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/payments/${id}/vnpay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Tạo link VNPAY ${id} thất bại`);
      }

      return await res.json();
    } catch (error) {
      console.error(`Tạo link VNPAY ${id} thất bại:`, error);
      throw error;
    }
  },

  /**
   * Xử lý callback từ VNPAY
   */
  handleVNPAYCallback: async (vnpayCode, responseCode) => {
    try {
      const cleanParams = {
        vnp_TxnRef: vnpayCode,
        vnp_ResponseCode: responseCode,
      };

      const query = new URLSearchParams(cleanParams).toString();
      const url = `${API_BASE_URL}/payments/vnpay-callback?${query}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Xử lý callback VNPAY thất bại");
      }

      return await res.json();
    } catch (error) {
      console.error("Xử lý callback VNPAY thất bại:", error);
      throw error;
    }
  },

  /**
   * Xóa thanh toán
   */
  deletePayment: async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/payments/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Xóa thanh toán ${id} thất bại`);
      }

      return await res.json();
    } catch (error) {
      console.error(`Xóa thanh toán ${id} thất bại:`, error);
      throw error;
    }
  },
};
