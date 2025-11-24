import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Briefcase, Calendar, Building2, User } from "lucide-react";
import { getUserInfo, getEmployeeInfo } from "../../services/api/userService";
import { toast } from "react-toastify";

// Ánh xạ giới tính tiếng Việt
const GENDER_MAP = {
    MALE: "Nam",
    FEMALE: "Nữ",
    OTHER: "Khác",
};

// Ánh xạ vị trí tiếng Việt
const POSITION_MAP = {
    ADMIN: "Quản trị viên",
    DEALER_STAFF: "Nhân Viên Đại Lý",
    DEALER_MANAGER: "Quản Lý Đại Lý",
    EVM_STAFF: "Nhân Viên Hãng",
};


/**
 * Component InfoCard - Hiển thị một thông tin với icon (theme trắng đen)
 */
const InfoCard = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 py-4 border-b border-gray-200 last:border-b-0">
        <Icon className="w-5 h-5 text-gray-700 flex-shrink-0 mt-1" />
        <div className="flex-1">
            <p className="text-sm text-gray-600 font-medium">{label}</p>
            <p className="text-gray-900 font-semibold mt-1">{value || "N/A"}</p>
        </div>
    </div>
);

/**
 * Component AvatarBadge - Hiển thị avatar từ initials (theme trắng đen)
 */
const AvatarBadge = ({ name }) => {
    const getInitials = (fullName) => {
        if (!fullName) return "ND";
        return fullName
            .split(" ")
            .map((word) => word[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };

    const initials = getInitials(name);
    // Avatar màu xám đen để phù hợp theme
    const AVATAR_GRADIENT = "linear-gradient(135deg, #1f2937, #374151)";

    return (
        <div className="flex justify-center mb-8">
            <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-md"
                style={{ background: AVATAR_GRADIENT }}
            >
                {initials}
            </div>
        </div>
    );
};

/**
 * Component UserProfile - Hiển thị thông tin chi tiết của user
 */
const UserProfile = ({ employeeId = 1 }) => {
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Gọi API khi component mount
    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                setLoading(true);
                setError(null);
                // Sử dụng getUserInfo thay vì getEmployeeInfo vì endpoint /users/me dùng chung cho tất cả roles
                const data = await getUserInfo();
                console.log("📊 API Response data:", data);
                console.log("📊 Cấu trúc dữ liệu:", JSON.stringify(data, null, 2));
                setEmployee(data);
            } catch (err) {
                const errorMessage = "Không thể lấy thông tin nhân viên";
                setError(errorMessage);
                toast.error(errorMessage);
                console.error("❌ Chi tiết lỗi:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeData();
    }, [employeeId]);

    // Hiển thị loading
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-800 mb-4"></div>
                    <p className="text-gray-600">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    // Hiển thị lỗi
    if (error || !employee) {
        return (
            <div className="bg-red-50 border border-red-300 rounded-lg p-6">
                <p className="text-red-700">
                    {error || "Không thể tải thông tin nhân viên"}
                </p>
            </div>
        );
    }

    // Ánh xạ giới tính
    const genderDisplay = GENDER_MAP[employee.gender] || employee.gender || "N/A";

    // Ánh xạ vị trí
    const positionDisplay =
        POSITION_MAP[employee.position] || employee.position || "N/A";

    // Format ngày tháng
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    return (
        <div className="w-full">
            {/* Header - Tên và vị trí (theme trắng đen) */}
            <div className="bg-white border-b border-gray-200 rounded-lg p-8 mb-6">
                <AvatarBadge name={employee.employeeName} />
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {employee.employeeName}
                    </h1>
                    <p className="text-lg text-gray-800 font-semibold">{positionDisplay}</p>
                    {employee.agencyName && (
                        <p className="text-gray-600 mt-2">{employee.agencyName}</p>
                    )}
                </div>
            </div>

            {/* Thông tin chi tiết - Grid 2 cột */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cột 1 - Thông tin cá nhân */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b border-gray-300">
                        <User className="w-5 h-5 text-gray-700" />
                        Thông tin cá nhân
                    </h2>

                    <div className="space-y-0">
                        <InfoCard
                            icon={User}
                            label="ID nhân viên"
                            value={employee.employeeId}
                        />
                        <InfoCard
                            icon={User}
                            label="Giới tính"
                            value={genderDisplay}
                        />
                        <InfoCard
                            icon={Calendar}
                            label="Ngày sinh"
                            value={formatDate(employee.birthDate)}
                        />
                    </div>
                </div>

                {/* Cột 2 - Thông tin liên hệ */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b border-gray-300">
                        <Mail className="w-5 h-5 text-gray-700" />
                        Thông tin liên hệ
                    </h2>

                    <div className="space-y-0">
                        <InfoCard
                            icon={Mail}
                            label="Email"
                            value={employee.email}
                        />
                        <InfoCard
                            icon={Phone}
                            label="Số điện thoại"
                            value={employee.phoneNumber}
                        />
                        <InfoCard
                            icon={MapPin}
                            label="Địa chỉ"
                            value={employee.address}
                        />
                    </div>
                </div>

                {/* Cột 3 - Thông tin công việc */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b border-gray-300">
                        <Briefcase className="w-5 h-5 text-gray-700" />
                        Thông tin công việc
                    </h2>

                    <div className="space-y-0">
                        <InfoCard
                            icon={Briefcase}
                            label="Vị trí"
                            value={positionDisplay}
                        />
                        <InfoCard
                            icon={Building2}
                            label="ID đại lý"
                            value={employee.agencyId}
                        />
                        <InfoCard
                            icon={Building2}
                            label="Tên đại lý"
                            value={employee.agencyName}
                        />
                    </div>
                </div>

                {/* Cột 4 - Lịch sử cập nhật */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b border-gray-300">
                        <Calendar className="w-5 h-5 text-gray-700" />
                        Lịch sử cập nhật
                    </h2>

                    <div className="space-y-0">
                        <InfoCard
                            icon={Calendar}
                            label="Ngày tạo"
                            value={formatDate(employee.createdAt)}
                        />
                        <InfoCard
                            icon={Calendar}
                            label="Cập nhật lần cuối"
                            value={formatDate(employee.updatedAt)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
