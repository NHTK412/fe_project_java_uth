import axios from "axios";

const BASE_URL = "http://localhost:8080/api/vehicle";

const getToken = () => {
    return localStorage.getItem("token");
};

const vehicleTypeApi = {
    // Lấy danh sách loại xe với phân trang
    getVehicleTypes: async (page = 1, size = 10) => {
        try {
            const token = getToken();
            const url = `${BASE_URL}/type?page=${page}&size=${size}`;
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

    // Lấy danh sách chi tiết loại xe theo vehicleTypeId
    getVehicleTypeDetails: async (vehicleTypeId, page = 1, size = 10) => {
        try {
            const token = getToken();
            const url = `${BASE_URL}/type/detail?page=${page}&size=${size}&vehicleTypeId=${vehicleTypeId}`;
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

    // Lấy chi tiết một vehicle type detail theo ID
    getVehicleTypeDetailById: async (vehicleTypeDetailId) => {
        try {
            const token = getToken();
            const url = `${BASE_URL}/type/detail/${vehicleTypeDetailId}`;
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
};

export default vehicleTypeApi;
