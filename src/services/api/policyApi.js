import axios from "axios";

const BASE_URL = "http://localhost:8080/api/policy";

const getToken = () => {
    return localStorage.getItem("token");
};

const policyApi = {
    // Get danh sách policies
    getPolicies: async (page = 1, size = 10) => {
        try {
            const token = getToken();
            const url = `${BASE_URL}?page=${page}&size=${size}`;
            console.log("Calling policy API:", url);
            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                },
            });
            console.log("Policy API response:", res.data);
            return res.data;
        } catch (error) {
            console.error("Policy API error:", error);
            console.error("Error response:", error.response?.data);
            if (error.response?.data) {
                return error.response.data;
            }
            throw error;
        }
    },

    // Get policy by ID
    getPolicyById: async (policyId) => {
        try {
            const token = getToken();
            const url = `${BASE_URL}/${policyId}`;
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

    // Create policy
    createPolicy: async (data) => {
        try {
            const token = getToken();
            const res = await axios.post(BASE_URL, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                    "Content-Type": "application/json",
                },
            });
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    // Update policy
    updatePolicy: async (policyId, data) => {
        try {
            const token = getToken();
            const url = `${BASE_URL}/${policyId}`;
            const res = await axios.put(url, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                    "Content-Type": "application/json",
                },
            });
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete policy
    deletePolicy: async (policyId) => {
        try {
            const token = getToken();
            const url = `${BASE_URL}/${policyId}`;
            const res = await axios.delete(url, {
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

export default policyApi;
