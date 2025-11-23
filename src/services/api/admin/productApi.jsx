const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const productApi = {
    // Lấy danh sách sản phẩm
    getAllProducts: async (params = {}) => {
        try {
            const cleanParams = Object.fromEntries(
                Object.entries(params).filter(
                    ([_, value]) => value !== null && value !== undefined && value !== ""
                )
            );

            const query = new URLSearchParams(cleanParams).toString();
            const url = query
                ? `${API_BASE_URL}/product?${query}`
                : `${API_BASE_URL}/product`;

            const res = await fetch(url, {
                method: "GET",
                headers: getHeaders(),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Lỗi lấy danh sách sản phẩm");
            }

            return await res.json();
        } catch (error) {
            console.error("Lỗi lấy danh sách sản phẩm:", error);
            throw error;
        }
    },

    // Lấy chi tiết sản phẩm theo ID
    getProductById: async (productId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/product/${productId}`, {
                method: "GET",
                headers: getHeaders(),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Lỗi lấy chi tiết sản phẩm");
            }

            return await res.json();
        } catch (error) {
            console.error("Lỗi lấy chi tiết sản phẩm:", error);
            throw error;
        }
    },

    // Tạo sản phẩm mới
    createProduct: async (data) => {
        try {
            const res = await fetch(`${API_BASE_URL}/product`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Lỗi tạo sản phẩm");
            }

            return await res.json();
        } catch (error) {
            console.error("Lỗi tạo sản phẩm:", error);
            throw error;
        }
    },

    // Cập nhật sản phẩm
    updateProduct: async (productId, data) => {
        try {
            const res = await fetch(`${API_BASE_URL}/product/${productId}`, {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Lỗi cập nhật sản phẩm");
            }

            return await res.json();
        } catch (error) {
            console.error("Lỗi cập nhật sản phẩm:", error);
            throw error;
        }
    },

    // Xóa sản phẩm
    deleteProduct: async (productId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/product/${productId}`, {
                method: "DELETE",
                headers: getHeaders(),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Lỗi xóa sản phẩm");
            }

            return await res.json();
        } catch (error) {
            console.error("Lỗi xóa sản phẩm:", error);
            throw error;
        }
    },

    // Tìm kiếm sản phẩm
    searchProducts: async (searchTerm, params = {}) => {
        try {
            const cleanParams = {
                ...params,
                search: searchTerm,
            };

            const query = new URLSearchParams(cleanParams).toString();
            const url = `${API_BASE_URL}/product/search?${query}`;

            const res = await fetch(url, {
                method: "GET",
                headers: getHeaders(),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Lỗi tìm kiếm sản phẩm");
            }

            return await res.json();
        } catch (error) {
            console.error("Lỗi tìm kiếm sản phẩm:", error);
            throw error;
        }
    },
};
