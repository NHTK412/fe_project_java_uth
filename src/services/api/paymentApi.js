import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

const paymentApi = {
    // Get payments by customer phone
    getPaymentsByCustomerPhone: async (customerPhone, page = 0, size = 10) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/payments/customer/${customerPhone}?page=${page}&size=${size}`,
                getAuthHeaders()
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching payments by customer phone:', error);
            throw error;
        }
    },

    // Update payment status
    updatePaymentStatus: async (paymentId, paymentData) => {
        try {
            const response = await axios.patch(
                `${API_BASE_URL}/payments/payment/${paymentId}`,
                paymentData,
                getAuthHeaders()
            );
            return response.data;
        } catch (error) {
            console.error('Error updating payment status:', error);
            throw error;
        }
    }
};

export default paymentApi;
