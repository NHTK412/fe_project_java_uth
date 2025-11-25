/* eslint-disable no-undef */
const BASE_URL = "http://localhost:8080/api/import-request";
const getToken = () => localStorage.getItem("token");

const getHeaders = (isJson = true) => {
    const token = getToken();
    const headers = {};
    if (isJson) headers["Content-Type"] = "application/json";
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
};

const handleResponse = async (res) => {
    try {
        const data = await res.json();
        return data;
    } catch {
        return { success: false, message: "Lỗi parse dữ liệu" };
    }
};

export const importRequestApi = {
    getAll: async (page = 0, size = 10) => {
        try {
            let url = `${BASE_URL}?page=${page + 1}&size=${size}`;
            const res = await fetch(url, { method: "GET", headers: getHeaders(false) });
            return await handleResponse(res);
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    getById: async (importRequestId) => {
        try {
            const url = `${BASE_URL}/${importRequestId}`;
            const res = await fetch(url, { method: "GET", headers: getHeaders(false) });
            return await handleResponse(res);
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    create: async (data) => {
        try {
            const res = await fetch(BASE_URL, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            return await handleResponse(res);
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    update: async (importRequestId, data) => {
        try {
            const url = `${BASE_URL}/${importRequestId}`;
            const res = await fetch(url, {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            return await handleResponse(res);
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    delete: async (importRequestId) => {
        try {
            const url = `${BASE_URL}/${importRequestId}`;
            const res = await fetch(url, { method: "DELETE", headers: getHeaders(false) });
            return await handleResponse(res);
        } catch (error) {
            return { success: false, message: error.message };
        }
    },
};
