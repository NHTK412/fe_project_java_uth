import axios from "axios";

const BASE_URL = "http://localhost:8080/api/reports/inventory";

const getToken = () => {
    return localStorage.getItem("token");
};

const inventoryApi = {
    // Get danh sách chi tiết loại xe kèm số lượng
    getInventoryList: async (agencyId, page = 1, size = 10) => {
        try {
            const token = getToken();
            const url = `${BASE_URL}/${agencyId}?page=${page}&size=${size}&agencyId=${agencyId}`;
            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                },
            });
            return res.data;
        } catch (error) {
            console.error("Error fetching inventory list:", error);
            throw error;
        }
    },

    // Get danh sách xe cụ thể theo vehicle type detail
    getVehiclesByTypeDetail: async (agencyId, vehicleTypeDetailId) => {
        try {
            const token = getToken();
            const url = `${BASE_URL}/${agencyId}/vehicle-type-detail/${vehicleTypeDetailId}?agencyId=${agencyId}&vehicleTypeDetailId=${vehicleTypeDetailId}`;
            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                },
            });
            return res.data;
        } catch (error) {
            console.error("Error fetching vehicles by type detail:", error);
            throw error;
        }
    },
};

export default inventoryApi;
