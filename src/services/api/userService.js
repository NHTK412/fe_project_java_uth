// Service API để gọi thông tin người dùng từ backend
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// Token cố định (tạm thời cho đến khi có hệ thống login)
const TEMP_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJRdeG6o24gVHLhu4sgVmnDqm4iLCJpYXQiOjE3NjMzMTkyNjgsImV4cCI6MTc2MzMyMjg2OH0.IOa3zr8ovmGLk8sb-T6xbj5E2n8e2m_QJYUe7mPdxkA";

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
export const getEmployeeInfo = async (employeeId) => {
    try {
        const response = await axiosInstance.get(`/employees/${employeeId}`);
        // const response = await axiosInstance.get(`/employees/1`);

        return response.data.data; // Trả về data từ response
    } catch (error) {
        console.error("Lỗi khi gọi API lấy thông tin nhân viên:", error);
        throw error;
    }
};
