import React, { createContext, useContext, useState } from "react";

// Tạo context
const LanguageContext = createContext();

// Hook sử dụng context
export const useLanguageContext = () => useContext(LanguageContext);

// Provider cho context
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState("vi");

  // Hàm chuyển đổi ngôn ngữ
  const changeLanguage = (lang) => setCurrentLanguage(lang);

  // Hàm dịch đơn giản (mock)
  const t = (key) => {
    const translations = {
      vi: {
        "login.error.enterCredentials": "Vui lòng nhập tài khoản và mật khẩu!",
        "login.error.wrongCredentials": "Sai tài khoản hoặc mật khẩu!",
        "login.error.noAccess": "Bạn không có quyền truy cập!",
        "login.error.failed": "Đăng nhập thất bại!",
        "login.title": "Đăng nhập hệ thống",
        "login.username": "Tên đăng nhập",
        "login.password": "Mật khẩu",
        "login.submit": "Đăng nhập",
        "login.success": "Đăng nhập thành công",
      },
      en: {
        "login.error.enterCredentials": "Please enter username and password!",
        "login.error.wrongCredentials": "Wrong username or password!",
        "login.error.noAccess": "You do not have access!",
        "login.error.failed": "Login failed!",
        "login.title": "Login to System",
        "login.username": "Username",
        "login.password": "Password",
        "login.submit": "Login",
        "login.success": "Login successful", 
      },
    };
    return translations[currentLanguage][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ t, currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
