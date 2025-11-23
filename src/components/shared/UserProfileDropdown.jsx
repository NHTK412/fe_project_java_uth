import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, User, FileText } from "lucide-react";
import { useUserData } from "../../hooks/useUserData";

/**
 * Component Dropdown cho User Profile
 * Hiển thị menu khi click vào biểu tượng user trên header
 */
const UserProfileDropdown = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { user, role } = useUserData();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleProfileClick = () => {
        navigate("/profile");
        onClose();
    };

    const handleSettingsClick = () => {
        navigate("/settings");
        onClose();
    };

    const handleLogout = () => {
        // Xóa localStorage
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

        // Điều hướng tới login
        navigate("/");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-30"
                onClick={onClose}
            />

            {/* Dropdown Menu */}
            <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-40">
                {/* User Info Header */}
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{user.employeeName || user.username || "User"}</p>
                            <p className="text-sm text-gray-600 truncate">{user.email || "user@example.com"}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {role?.replace("ROLE_", "") || "USER"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                    {/* Profile */}
                    <button
                        onClick={handleProfileClick}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                    >
                        <User className="w-5 h-5 text-gray-600" />
                        <div>
                            <p className="font-medium text-gray-900">Hồ sơ cá nhân</p>
                            <p className="text-xs text-gray-500">Xem và chỉnh sửa thông tin</p>
                        </div>
                    </button>

                    {/* Documents */}
                    <button
                        onClick={() => onClose()}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                    >
                        <FileText className="w-5 h-5 text-gray-600" />
                        <div>
                            <p className="font-medium text-gray-900">Tài liệu của tôi</p>
                            <p className="text-xs text-gray-500">Xem các tài liệu liên quan</p>
                        </div>
                    </button>

                    {/* Settings */}
                    <button
                        onClick={handleSettingsClick}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                    >
                        <Settings className="w-5 h-5 text-gray-600" />
                        <div>
                            <p className="font-medium text-gray-900">Cài đặt</p>
                            <p className="text-xs text-gray-500">Quản lý cài đặt tài khoản</p>
                        </div>
                    </button>

                    {/* Divider */}
                    <div className="my-2 border-t border-gray-200" />

                    {/* Logout */}
                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition-colors text-left"
                    >
                        <LogOut className="w-5 h-5 text-red-600" />
                        <div>
                            <p className="font-medium text-red-600">Đăng xuất</p>
                            <p className="text-xs text-gray-500">Thoát khỏi tài khoản</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-lg">
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-auto shadow-xl">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Xác nhận đăng xuất
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserProfileDropdown;
