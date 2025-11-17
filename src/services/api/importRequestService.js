// Service API để gọi thông tin đặt xe từ hãng từ backend
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// Token cố định (tạm thời cho đến khi có hệ thống login)
const TEMP_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbl91c2VyIiwicm9sZSI6IlF14bqjbiBUcuG7iyBWacOqbiIsImlhdCI6MTc2MzM3ODE3NiwiZXhwIjoxNzYzMzgxNzc2fQ.eRHNwoVn7AINo35Yfv-vc4vRyMpaFPe48IP_kgQYSDE";

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
 * Gọi API để lấy danh sách các đơn đặt xe từ hãng
 * @param {number} page - Trang (bắt đầu từ 1)
 * @param {number} size - Số item trên mỗi trang
 * @param {number} employeeId - ID của nhân viên
 * @returns {Promise<Array>} - Danh sách các đơn đặt xe
 */
// export const getImportRequests = async (page = 1, size = 10, employeeId = 1) => {
export const getImportRequests = async (page = 1, size = 10) => {
    try {
        const response = await axiosInstance.get("/import-request/me", {
            params: {
                page,
                size,
                // employeeId,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API lấy danh sách đơn đặt xe:", error);
        throw error;
    }
};

/**
 * Gọi API để lấy chi tiết một đơn đặt xe
 * @param {number} importRequestId - ID của đơn đặt xe
 * @returns {Promise<Object>} - Chi tiết đơn đặt xe
 */
export const getImportRequestDetail = async (importRequestId) => {
    try {
        const response = await axiosInstance.get(`/import-request/${importRequestId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API lấy chi tiết đơn đặt xe:", error);
        throw error;
    }
};

/**
 * Gọi API để tạo một đơn đặt xe mới
 * @param {Object} data - Dữ liệu đơn đặt xe
 * @returns {Promise<Object>} - Dữ liệu đơn đặt xe vừa tạo
 */
export const createImportRequest = async (data) => {
    try {
        const response = await axiosInstance.post("/import-request", data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API tạo đơn đặt xe:", error);
        throw error;
    }
};

/**
 * NOTE: Gọi API để lấy danh sách loại xe (vehicle type)
 * @param {number} page - Trang (bắt đầu từ 1)
 * @param {number} size - Số item trên mỗi trang
 * @returns {Promise<Object>} - Dữ liệu danh sách loại xe
 */
export const getVehicleTypes = async (page = 1, size = 10) => {
    try {
        const response = await axiosInstance.get("/vehicle/type", {
            params: {
                page,
                size,
            },
        });
        // NOTE: API trả về trong wrapper { success, data }, lấy data.content
        return response.data.data?.content || [];
    } catch (error) {
        console.error("Lỗi khi gọi API lấy danh sách loại xe:", error);
        throw error;
    }
};

/**
 * NOTE: Gọi API để lấy danh sách chi tiết loại xe (vehicle type detail)
 * @param {number} page - Trang (bắt đầu từ 1)
 * @param {number} size - Số item trên mỗi trang
 * @param {number} vehicleTypeId - ID loại xe (tùy chọn) để lọc chi tiết của loại xe cụ thể
 * @returns {Promise<Object>} - Dữ liệu danh sách chi tiết loại xe
 */
export const getVehicleTypeDetails = async (page = 1, size = 10, vehicleTypeId = null) => {
    try {
        const params = {
            page,
            size,
        };
        // NOTE: Nếu có vehicleTypeId, thêm vào params để lọc chi tiết của loại xe đó
        if (vehicleTypeId) {
            params.vehicleTypeId = vehicleTypeId;
        }

        const response = await axiosInstance.get("/vehicle/type/detail", { params });
        // NOTE: API trả về trong wrapper { success, data }, lấy data.content
        return response.data.data?.content || [];
    } catch (error) {
        console.error("Lỗi khi gọi API lấy danh sách chi tiết loại xe:", error);
        throw error;
    }
};
