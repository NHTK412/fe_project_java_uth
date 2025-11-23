import { useState, useEffect } from "react";
import { getUserInfo } from "../services/api/userService";

/**
 * Custom hook để quản lý user data từ API
 * Tự động load thông tin user từ backend
 */
export const useUserData = () => {
  const [user, setUser] = useState({
    employeeId: 0,
    username: "User",
    employeeName: "User",
    email: "user@example.com",
    phoneNumber: "",
    address: "",
    gender: "MALE",
    birthDate: "",
    role: "USER",
    agencyId: 0,
    agencyName: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [role, setRole] = useState("USER");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data từ API khi component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Thử load từ API trước
        try {
          const apiData = await getUserInfo();
          if (apiData) {
            setUser({
              employeeId: apiData.employeeId || 0,
              username: apiData.username || "User",
              employeeName: apiData.employeeName || apiData.username || "User",
              email: apiData.email || "user@example.com",
              phoneNumber: apiData.phoneNumber || "",
              address: apiData.address || "",
              gender: apiData.gender || "MALE",
              birthDate: apiData.birthDate || "",
              role: apiData.role || "USER",
              agencyId: apiData.agencyId || 0,
              agencyName: apiData.agencyName || "",
              createdAt: apiData.createdAt || new Date().toISOString(),
              updatedAt: apiData.updatedAt || new Date().toISOString(),
            });
            setRole(apiData.role || "USER");

            // Lưu vào localStorage để backup
            // eslint-disable-next-line no-undef
            localStorage.setItem("user", JSON.stringify(apiData));
            // eslint-disable-next-line no-undef
            localStorage.setItem("username", apiData.username || "User");
            // eslint-disable-next-line no-undef
            localStorage.setItem("email", apiData.email || "user@example.com");
            return;
          }
        } catch (apiError) {
          // eslint-disable-next-line no-console
          console.warn("Không thể load từ API, sử dụng localStorage:", apiError);
        }

        // Fallback: load từ localStorage nếu API fail
        // eslint-disable-next-line no-undef
        const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
        // eslint-disable-next-line no-undef
        const username = typeof window !== "undefined" ? localStorage.getItem("username") : null;
        // eslint-disable-next-line no-undef
        const email = typeof window !== "undefined" ? localStorage.getItem("email") : null;
        // eslint-disable-next-line no-undef
        const roleVal = (typeof window !== "undefined" ? localStorage.getItem("role") : null) || "USER";

        let userData = {
          employeeId: 0,
          username: username || "User",
          employeeName: username || "User",
          email: email || "user@example.com",
          phoneNumber: "",
          address: "",
          gender: "MALE",
          birthDate: "",
          role: roleVal,
          agencyId: 0,
          agencyName: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Nếu có user object, merge nó
        if (userStr) {
          try {
            const parsed = JSON.parse(userStr);
            userData = {
              ...userData,
              ...parsed,
              employeeName: parsed.employeeName || parsed.username || username || "User",
            };
          } catch {
            // ignore parse error
          }
        }

        setUser(userData);
        setRole(roleVal);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Lỗi load user data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Hàm cập nhật user data
  const updateUser = (newData) => {
    const updatedUser = {
      ...user,
      ...newData,
    };
    setUser(updatedUser);
    // Lưu vào localStorage
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-undef
      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (newData.username) {
        // eslint-disable-next-line no-undef
        localStorage.setItem("username", newData.username);
      }
      if (newData.email) {
        // eslint-disable-next-line no-undef
        localStorage.setItem("email", newData.email);
      }
    }
  };

  // Hàm logout
  const logout = () => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-undef
      localStorage.removeItem("token");
      // eslint-disable-next-line no-undef
      localStorage.removeItem("user");
      // eslint-disable-next-line no-undef
      localStorage.removeItem("role");
      // eslint-disable-next-line no-undef
      localStorage.removeItem("username");
      // eslint-disable-next-line no-undef
      localStorage.removeItem("email");
    }
  };

  return {
    user,
    role,
    isLoading,
    error,
    updateUser,
    logout,
  };
};
