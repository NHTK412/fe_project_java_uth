// Service API để gọi quản lý báo giá từ backend
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
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        throw new Error("Token hết hạn. Vui lòng đăng nhập lại.");
    }

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Lỗi HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
};

/**
 * Gọi API để lấy danh sách báo giá
 * Endpoint: http://localhost:8080/api/quote?page=1&size=10
 * @param {number} page - Trang (bắt đầu từ 1)
 * @param {number} size - Số item trên mỗi trang
 * @returns {Promise<Array>} - Danh sách báo giá
 */
export const getQuotes = async (page = 1, size = 10) => {
    try {
        const params = new URLSearchParams({ page, size });
        const response = await apiFetch(`/quote?${params}`, {
            method: "GET",
        });
        return response.data || [];
    } catch (error) {
        console.error("Lỗi khi gọi API lấy danh sách báo giá:", error);
        throw error;
    }
};

/**
 * Gọi API để lấy chi tiết báo giá theo ID
 * @param {number} quoteId - ID báo giá
 * @returns {Promise<Object>} - Chi tiết báo giá
 */
export const getQuoteById = async (quoteId) => {
    try {
        const response = await apiFetch(`/quote/${quoteId}?quoteId=${quoteId}`, {
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API lấy chi tiết báo giá:", error);
        throw error;
    }
};

/**
 * Gọi API để tạo báo giá mới
 * @param {Object} data - Dữ liệu báo giá (QuoteRequestDTO)
 * @returns {Promise<Object>} - Báo giá vừa tạo
 */
export const createQuote = async (data) => {
    try {
        const response = await apiFetch("/quote", {
            method: "POST",
            body: JSON.stringify(data),
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API tạo báo giá:", error);
        throw error;
    }
};

/**
 * Gọi API để cập nhật báo giá
 * @param {number} quoteId - ID báo giá
 * @param {Object} data - Dữ liệu cập nhật (QuoteRequestDTO)
 * @returns {Promise<Object>} - Báo giá sau khi cập nhật
 */
export const updateQuote = async (quoteId, data) => {
    try {
        const response = await apiFetch(`/quote/${quoteId}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API cập nhật báo giá:", error);
        throw error;
    }
};

/**
 * Gọi API để cập nhật trạng thái báo giá
 * @param {number} quoteId - ID báo giá
 * @param {string} status - Trạng thái mới (CREATE, PROCESSING, REJECTED, ORDERED)
 * @returns {Promise<Object>} - Báo giá sau khi cập nhật trạng thái
 */
export const updateQuoteStatus = async (quoteId, status) => {
    try {
        const response = await apiFetch(`/quote/${quoteId}/${status}`, {
            method: "PATCH",
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API cập nhật trạng thái báo giá:", error);
        throw error;
    }
};

/**
 * Gọi API để xóa báo giá
 * @param {number} quoteId - ID báo giá
 * @returns {Promise<Object>} - Kết quả xóa
 */
export const deleteQuote = async (quoteId) => {
    try {
        const response = await apiFetch(`/quote/${quoteId}`, {
            method: "DELETE",
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API xóa báo giá:", error);
        throw error;
    }
};

/**
 * Gọi API để lấy danh sách khách hàng
 * @param {number} page - Trang (bắt đầu từ 0)
 * @param {number} size - Số item trên mỗi trang
 * @returns {Promise<Array>} - Danh sách khách hàng
 */
export const getCustomers = async (page = 0, size = 10) => {
    try {
        const params = new URLSearchParams({ page, size });
        const response = await apiFetch(`/customers?${params}`, {
            method: "GET",
        });
        // API trả về paginated response, lấy content array
        return response.data?.content || [];
    } catch (error) {
        console.error("Lỗi khi gọi API lấy danh sách khách hàng:", error);
        throw error;
    }
};

/**
 * Gọi API để tạo khách hàng mới
 * @param {Object} data - Dữ liệu khách hàng
 * @returns {Promise<Object>} - Khách hàng vừa tạo
 */
export const createCustomer = async (data) => {
    try {
        const response = await apiFetch("/customer", {
            method: "POST",
            body: JSON.stringify(data),
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API tạo khách hàng:", error);
        throw error;
    }
};
