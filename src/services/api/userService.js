// Service API để gọi thông tin người dùng từ backend
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// Token cố định (tạm thời cho đến khi có hệ thống login)
const TEMP_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbl91c2VyIiwicm9sZSI6IlF14bqjbiBUcuG7iyBWacOqbiIsImlhdCI6MTc2MzM4ODI5OSwiZXhwIjoxNzYzMzkxODk5fQ.8XR1vuPkzupr_-eG7Cm-ekn2Bx6MaxTbT5EqwW8BVvE";

// Tạo instance axios với cấu hình mặc định
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        // Token cố định để test (sẽ được thay thế bằng token từ login sau)
        Authorization: `Bearer ${TEMP_TOKEN}`,
    },
});

/**
 * Gọi API để lấy thông tin chi tiết của một nhân viên
 * @param {number} employeeId - ID của nhân viên
 * @returns {Promise<Object>} - Dữ liệu nhân viên
 */
export const getEmployeeInfo = async () => {
    try {
        // const response = await axiosInstance.get(`/employees/${employeeId}`);
        const response = await axiosInstance.get(`/employees/me`);

        return response.data.data; // Trả về data từ response
    } catch (error) {
        console.error("Lỗi khi gọi API lấy thông tin nhân viên:", error);
        throw error;
    }
};
