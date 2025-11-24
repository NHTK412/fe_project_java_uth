import axios from "axios";

const BASE_URL = "http://localhost:8080/api/order";

const getToken = () => {
  return localStorage.getItem("token");
};

const agencyOrderApi = {
  // Get danh sách đơn hàng của đại lý
  getAgencyOrders: async (page = 1, size = 10) => {
    try {
      const token = getToken();
      const url = `${BASE_URL}/agency?page=${page}&size=${size}`;
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Cancel đơn hàng
  cancelOrder: async (orderId) => {
    try {
      const token = getToken();
      const url = `${BASE_URL}/${orderId}/cancel`;
      const res = await axios.patch(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Get chi tiết đơn hàng
  getOrderById: async (orderId) => {
    try {
      const token = getToken();
      const url = `${BASE_URL}/${orderId}`;
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Create đơn hàng
  createOrder: async (data) => {
    try {
      const token = getToken();
      const res = await axios.post(BASE_URL, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
};

export default agencyOrderApi;
