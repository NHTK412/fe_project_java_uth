import axios from "axios";

const BASE_URL = "http://localhost:8080/api/test-drive-appointments";

const getToken = () => {
    return localStorage.getItem("token");
};

const testDriveApi = {
    // Lấy danh sách lịch hẹn
    getAppointments: async () => {
        try {
            const token = getToken();
            const res = await axios.get(BASE_URL, {
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

    // Lấy chi tiết lịch hẹn theo ID
    getAppointmentById: async (testDriveAppointmentId) => {
        try {
            const token = getToken();
            const url = `${BASE_URL}/${testDriveAppointmentId}`;
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

    // Tạo lịch hẹn mới
    createAppointment: async (appointmentData) => {
        try {
            const token = getToken();
            const res = await axios.post(BASE_URL, appointmentData, {
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

    // Cập nhật lịch hẹn
    updateAppointment: async (id, appointmentData) => {
        try {
            const token = getToken();
            const url = `${BASE_URL}/${id}`;
            const res = await axios.put(url, appointmentData, {
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

    // Cập nhật trạng thái lịch hẹn
    updateAppointmentStatus: async (id, status) => {
        try {
            const token = getToken();
            const url = `${BASE_URL}/${id}?status=${status}`;
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

    // Xóa lịch hẹn
    deleteAppointment: async (id) => {
        try {
            const token = getToken();
            const url = `${BASE_URL}/${id}`;
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

export default testDriveApi;
