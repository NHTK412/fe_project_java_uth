const API_BASE_URL = "http://localhost:8080/api";

/**
 * Hàm fetch wrapper để xử lý các yêu cầu API một cách nhất quán.
 * Tự động thêm token, xử lý lỗi và phân tích JSON.
 */
const customFetch = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const { isPublic, ...restOptions } = options; // Tách option isPublic ra

    const defaultHeaders = {
        "Content-Type": "application/json",
        Accept: "*/*",
    };

    // Chỉ thêm token vào header nếu đây không phải là một yêu cầu public
    if (!isPublic) {
        const token = localStorage.getItem("token");
        defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    const finalOptions = {
        ...restOptions, // Sử dụng các options còn lại
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, finalOptions); // finalOptions đã không còn isPublic

        // Xử lý khi response không có nội dung (status 204)
        if (response.status === 204) {
            return null;
        }

        const data = await response.json();

        if (!response.ok) {
            // Xử lý lỗi 401 (Unauthorized) -> token hết hạn hoặc không hợp lệ
            if (response.status === 401 && !isPublic) { // Chỉ redirect nếu đây là request cần xác thực
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                // NOTE: Delay redirect để component kịp handle error
                setTimeout(() => {
                    // Chuyển hướng về trang đăng nhập, lưu lại trang hiện tại để quay lại sau
                    window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
                }, 100);
            }
            // Ném lỗi để các hàm gọi có thể bắt và xử lý
            throw new Error(data.message || `Lỗi HTTP: ${response.status}`);
        }

        return data; // Trả về toàn bộ response data (thường có dạng { success, message, data })
    } catch (error) {
        console.error(`Lỗi gọi API tại ${endpoint}:`, error);
        // Xử lý lỗi mạng hoặc lỗi không thể parse JSON
        if (error instanceof TypeError) { // Lỗi mạng thường là TypeError
            throw new Error("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.");
        }
        throw error; // Ném lại lỗi để component có thể xử lý
    }
};

// Xuất các phương thức tiện ích
const apiClient = {
    get: (endpoint, options) => customFetch(endpoint, { ...options, method: "GET" }), // isPublic sẽ được truyền qua options
    post: (endpoint, body, options) => customFetch(endpoint, { ...options, method: "POST", body: JSON.stringify(body) }),
    put: (endpoint, body, options) => customFetch(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) }),
    delete: (endpoint, options) => customFetch(endpoint, { ...options, method: "DELETE" }),
};

export default apiClient;