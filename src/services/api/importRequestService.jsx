// Service API để gọi thông tin đặt xe từ hãng từ backend
const API_BASE_URL = "http://localhost:8080/api";

/**
 * Helper function để fetch API với token từ localStorage
 */
const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
            "Authorization": `Bearer ${token}`,
            ...options.headers,
        },
    });

    // Xử lý lỗi 401 (Unauthorized)
    if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        // NOTE: Delay redirect để component kịp handle error
        setTimeout(() => {
            window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        }, 100);
        throw new Error("Token hết hạn. Vui lòng đăng nhập lại.");
    }

    if (!response.ok) {
        throw new Error(`Lỗi HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
};

/**
 * Gọi API để lấy danh sách các đơn đặt xe từ hãng
 * Endpoint: http://localhost:8080/api/import-request/me?page=1&size=10
 * @param {number} page - Trang (bắt đầu từ 1, phải > 0)
 * @param {number} size - Số item trên mỗi trang
 * @returns {Promise<Array>} - Danh sách các đơn đặt xe
 */
export const getImportRequests = async (page = 1, size = 10) => {
    try {
        // Đảm bảo page > 0 theo quy định backend
        const validPage = Math.max(1, Math.floor(page));
        const params = new URLSearchParams({ page: validPage, size });
        const response = await apiFetch(`/import-request/me?${params}`, {
            method: "GET",
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
        const response = await apiFetch(`/import-request/${importRequestId}`, {
            method: "GET",
        });
        return response;
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
        const response = await apiFetch("/import-request", {
            method: "POST",
            body: JSON.stringify(data),
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API tạo đơn đặt xe:", error);
        throw error;
    }
};

/**
 * NOTE: Gọi API để lấy danh sách loại xe (vehicle type)
 * @param {number} page - Trang (bắt đầu từ 1, phải > 0)
 * @param {number} size - Số item trên mỗi trang
 * @returns {Promise<Object>} - Dữ liệu danh sách loại xe
 */
export const getVehicleTypes = async (page = 1, size = 10) => {
    try {
        // Đảm bảo page > 0 theo quy định backend
        const validPage = Math.max(1, Math.floor(page));
        const params = new URLSearchParams({ page: validPage, size });
        const response = await apiFetch(`/vehicle/type?${params}`, {
            method: "GET",
        });
        // NOTE: API trả về trong wrapper { success, data }, lấy data.content
        return response.data?.content || [];
    } catch (error) {
        console.error("Lỗi khi gọi API lấy danh sách loại xe:", error);
        throw error;
    }
};

/**
 * NOTE: Gọi API để lấy danh sách chi tiết loại xe (vehicle type detail)
 * @param {number} page - Trang (bắt đầu từ 1, phải > 0)
 * @param {number} size - Số item trên mỗi trang
 * @param {number} vehicleTypeId - ID loại xe (tùy chọn) để lọc chi tiết của loại xe cụ thể
 * @returns {Promise<Object>} - Dữ liệu danh sách chi tiết loại xe
 */
export const getVehicleTypeDetails = async (page = 1, size = 10, vehicleTypeId = null) => {
    try {
        // Đảm bảo page > 0 theo quy định backend
        const validPage = Math.max(1, Math.floor(page));
        const params = new URLSearchParams({ page: validPage, size });
        if (vehicleTypeId) {
            params.append("vehicleTypeId", vehicleTypeId);
        }

        const response = await apiFetch(`/vehicle/type/detail?${params}`, {
            method: "GET",
        });
        // NOTE: API trả về trong wrapper { success, data }, lấy data.content
        return response.data?.content || [];
    } catch (error) {
        console.error("Lỗi khi gọi API lấy danh sách chi tiết loại xe:", error);
        throw error;
    }
};
