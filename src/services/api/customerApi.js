import axios from "axios";

const BASE_URL = "http://localhost:8080/api/customers";

const getToken = () => {
    return localStorage.getItem("token");
};

const customerApi = {
    // Get danh sách khách hàng với phân trang
    getCustomers: async (page = 1, size = 10) => {
        try {
            const token = getToken();
            const url = `${BASE_URL}?page=${page}&size=${size}`;
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

    // Get chi tiết khách hàng theo ID
    getCustomerById: async (customerId) => {
        try {
            const token = getToken();
            const url = `${BASE_URL}/${customerId}`;
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

    // Tạo khách hàng mới
    createCustomer: async (customerData) => {
        try {
            const token = getToken();
            const res = await axios.post(BASE_URL, customerData, {
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

    // Cập nhật thông tin khách hàng
    updateCustomer: async (customerId, customerData) => {
        try {
            const token = getToken();
            const url = `${BASE_URL}/${customerId}`;
            const res = await axios.put(url, customerData, {
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

    // Xóa khách hàng
    deleteCustomer: async (customerId) => {
        try {
            const token = getToken();
            const url = `${BASE_URL}/${customerId}`;
            const res = await axios.delete(url, {
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
};

export default customerApi;
