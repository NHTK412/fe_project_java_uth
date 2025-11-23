// Service API để gọi thông tin người dùng từ backend
const API_BASE_URL = "http://localhost:8080/api";

/**
 * Gọi API để lấy thông tin chi tiết của người dùng hiện tại
 * Sử dụng fetch API và lấy token từ localStorage
 * Endpoint này dùng chung cho tất cả các role (Admin, EVM Staff, Dealer Staff, Dealer Manager)
 * @returns {Promise<Object>} - Dữ liệu người dùng
 */
export const getUserInfo = async () => {
    try {
        // Lấy token từ localStorage
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
        }

        const response = await fetch(`${API_BASE_URL}/employees/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*",
                "Authorization": `Bearer ${token}`,
            },
        });

        // Xử lý lỗi 401 (Unauthorized) - token hết hạn hoặc không hợp lệ
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
        return data.data; // Trả về data từ response
    } catch (error) {
        console.error("Lỗi khi gọi API lấy thông tin người dùng:", error);
        throw error;
    }
};

/**
 * Gọi API để lấy thông tin chi tiết của một nhân viên
 * Sử dụng fetch API và lấy token từ localStorage
 * @returns {Promise<Object>} - Dữ liệu nhân viên
 */
export const getEmployeeInfo = async () => {
    try {
        // Lấy token từ localStorage
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
        }

        const response = await fetch(`${API_BASE_URL}/employees/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*",
                "Authorization": `Bearer ${token}`,
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
        return data.data; // Trả về data từ response
    } catch (error) {
        console.error("Lỗi khi gọi API lấy thông tin nhân viên:", error);
        throw error;
    }
};
