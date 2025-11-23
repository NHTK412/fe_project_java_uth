import apiClient from './apiClient';

const API_URL = '/order';

// ========== GET Endpoints ==========

// Lấy chi tiết đơn hàng
export const getOrderById = async (orderId) => {
    try {
        const response = await apiClient.get(`${API_URL}/${orderId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi lấy chi tiết đơn hàng');
    }
};

// Lấy danh sách đơn hàng của đại lý
export const getOrdersByAgency = async (page = 1, size = 10) => {
    try {
        const response = await apiClient.get(`${API_URL}/agency?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi lấy danh sách đơn hàng của đại lý');
    }
};

// Lấy danh sách đơn hàng của nhân viên
export const getOrdersByEmployeeId = async (employeeId, page = 1, size = 10) => {
    try {
        const response = await apiClient.get(`${API_URL}/employee/${employeeId}?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi lấy danh sách đơn hàng của nhân viên');
    }
};

// ========== POST Endpoints ==========

// Tạo đơn hàng từ báo giá
export const createOrderFromQuote = async (orderData) => {
    try {
        const response = await apiClient.post(`${API_URL}/from-quotation`, orderData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi tạo đơn hàng từ báo giá');
    }
};

// Tạo đơn hàng (đại lý)
export const createOrder = async (orderData) => {
    try {
        const response = await apiClient.post(`${API_URL}`, orderData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi tạo đơn hàng');
    }
};

// Xử lý thanh toán cho đơn hàng
export const processPayment = async (orderId, paymentData) => {
    try {
        const response = await apiClient.post(`${API_URL}/${orderId}/process-payment`, paymentData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi xử lý thanh toán');
    }
};

// Tạo giao hàng cho đơn hàng
export const createDelivery = async (orderId, deliveryData) => {
    try {
        const response = await apiClient.post(`${API_URL}/${orderId}/delivery`, deliveryData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi tạo giao hàng');
    }
};

// ========== PATCH Endpoints ==========

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId, status, contractNumber) => {
    try {
        let url = `${API_URL}/${orderId}?`;
        const params = [];

        if (status) params.push(`status=${status}`);
        if (contractNumber) params.push(`contractNumber=${contractNumber}`);

        url += params.join('&');

        const response = await apiClient.patch(url);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi cập nhật trạng thái đơn hàng');
    }
};

// Cập nhật trạng thái giao hàng
export const updateDeliveryStatus = async (orderId, vehicleDeliveryStatusEnum) => {
    try {
        const response = await apiClient.patch(
            `${API_URL}/${orderId}/delivery?vehicleDeliveryStatusEnum=${vehicleDeliveryStatusEnum}`
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi cập nhật trạng thái giao hàng');
    }
};

// ========== Utility Functions ==========

// Hàm format tiền tệ
export const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value || 0);
};

// Hàm format ngày
export const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};
