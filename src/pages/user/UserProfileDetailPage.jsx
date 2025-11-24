import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, Calendar, Edit2, Save, X, ArrowLeft } from "lucide-react";
import { useUserData } from "../../hooks/useUserData";

/**
 * Page Hồ sơ cá nhân - Cho phép user xem và chỉnh sửa thông tin cá nhân
 */
const UserProfileDetailPage = () => {
    const navigate = useNavigate();
    const { user, isLoading, updateUser } = useUserData();
    const [isEditing, setIsEditing] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);

    const [formData, setFormData] = useState({
        employeeName: user.employeeName || "User",
        email: user.email || "user@example.com",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        gender: user.gender || "MALE",
        birthDate: user.birthDate || "",
        agencyName: user.agencyName || "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Cập nhật formData khi user data thay đổi
    React.useEffect(() => {
        setFormData({
            employeeName: user.employeeName || "User",
            email: user.email || "user@example.com",
            phoneNumber: user.phoneNumber || "",
            address: user.address || "",
            gender: user.gender || "MALE",
            birthDate: user.birthDate || "",
            agencyName: user.agencyName || "",
        });
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = () => {
        // Cập nhật thông tin user
        updateUser(formData);
        setIsEditing(false);
        alert("Thông tin đã được cập nhật thành công!");
    };

    const handleChangePassword = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Mật khẩu mới không khớp!");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            alert("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }
        // TODO: Gọi API thay đổi mật khẩu
        alert("Mật khẩu đã được thay đổi thành công!");
        setShowChangePassword(false);
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Back Button */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
                        <p className="text-sm text-gray-600">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="text-gray-600 mt-4">Đang tải thông tin...</p>
                        </div>
                    </div>
                )}

                {!isLoading && (
                    <>
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
                            <p className="text-gray-600 mt-2">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
                        </div>

                        {/* Profile Card */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            {/* Cover Image */}
                            <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

                            {/* Profile Info */}
                            <div className="px-6 pb-6">
                                {/* Avatar and Basic Info */}
                                <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
                                    <div className="flex items-end gap-4">
                                        <div className="w-32 h-32 bg-blue-500 rounded-lg border-4 border-white flex items-center justify-center shadow-md">
                                            <span className="text-4xl font-bold text-white">
                                                {formData.employeeName.charAt(0)}
                                            </span>
                                        </div>
                                        <div className="mb-2">
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                {formData.employeeName}
                                            </h2>
                                            <p className="text-gray-600">{formData.agencyName || "Cơ quan"}</p>
                                            <p className="text-sm text-gray-500">{user.role?.replace("ROLE_", "") || "USER"}</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 mt-4 md:mt-0">
                                        {!isEditing ? (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Chỉnh sửa
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={handleSave}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    Lưu
                                                </button>
                                                <button
                                                    onClick={() => setIsEditing(false)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Hủy
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 my-6"></div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Employee Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Họ và tên
                                        </label>
                                        <input
                                            type="text"
                                            name="employeeName"
                                            value={formData.employeeName}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-2 rounded-lg border ${isEditing
                                                ? "border-gray-300 bg-white focus:border-blue-500 outline-none"
                                                : "border-gray-300 bg-gray-50 text-gray-600"
                                                }`}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`flex-1 px-4 py-2 rounded-lg border ${isEditing
                                                    ? "border-gray-300 bg-white focus:border-blue-500 outline-none"
                                                    : "border-gray-300 bg-gray-50 text-gray-600"
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Số điện thoại
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-5 h-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`flex-1 px-4 py-2 rounded-lg border ${isEditing
                                                    ? "border-gray-300 bg-white focus:border-blue-500 outline-none"
                                                    : "border-gray-300 bg-gray-50 text-gray-600"
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    {/* Gender */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Giới tính
                                        </label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-2 rounded-lg border ${isEditing
                                                ? "border-gray-300 bg-white focus:border-blue-500 outline-none"
                                                : "border-gray-300 bg-gray-50 text-gray-600"
                                                }`}
                                        >
                                            <option value="MALE">Nam</option>
                                            <option value="FEMALE">Nữ</option>
                                            <option value="OTHER">Khác</option>
                                        </select>
                                    </div>

                                    {/* Agency Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cơ quan
                                        </label>
                                        <input
                                            type="text"
                                            name="agencyName"
                                            value={formData.agencyName}
                                            onChange={handleInputChange}
                                            disabled={true}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-600"
                                        />
                                    </div>

                                    {/* Birth Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ngày sinh
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-gray-400" />
                                            <input
                                                type="date"
                                                name="birthDate"
                                                value={formData.birthDate}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`flex-1 px-4 py-2 rounded-lg border ${isEditing
                                                    ? "border-gray-300 bg-white focus:border-blue-500 outline-none"
                                                    : "border-gray-300 bg-gray-50 text-gray-600"
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Địa chỉ
                                        </label>
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-5 h-5 text-gray-400 mt-2" />
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                rows="3"
                                                className={`flex-1 px-4 py-2 rounded-lg border ${isEditing
                                                    ? "border-gray-300 bg-white focus:border-blue-500 outline-none"
                                                    : "border-gray-300 bg-gray-50 text-gray-600"
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 my-8"></div>

                                {/* Security Section */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Bảo mật tài khoản
                                    </h3>

                                    {!showChangePassword ? (
                                        <button
                                            onClick={() => setShowChangePassword(true)}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                        >
                                            Thay đổi mật khẩu
                                        </button>
                                    ) : (
                                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                            <div className="space-y-4">
                                                {/* Current Password */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Mật khẩu hiện tại
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="currentPassword"
                                                        value={passwordData.currentPassword}
                                                        onChange={handlePasswordChange}
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 outline-none"
                                                        placeholder="Nhập mật khẩu hiện tại"
                                                    />
                                                </div>

                                                {/* New Password */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Mật khẩu mới
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="newPassword"
                                                        value={passwordData.newPassword}
                                                        onChange={handlePasswordChange}
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 outline-none"
                                                        placeholder="Nhập mật khẩu mới"
                                                    />
                                                </div>

                                                {/* Confirm Password */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Xác nhận mật khẩu
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        value={passwordData.confirmPassword}
                                                        onChange={handlePasswordChange}
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 outline-none"
                                                        placeholder="Xác nhận mật khẩu mới"
                                                    />
                                                </div>

                                                {/* Buttons */}
                                                <div className="flex gap-3 justify-end pt-4">
                                                    <button
                                                        onClick={() => setShowChangePassword(false)}
                                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                                                    >
                                                        Hủy
                                                    </button>
                                                    <button
                                                        onClick={handleChangePassword}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                    >
                                                        Cập nhật mật khẩu
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserProfileDetailPage;
