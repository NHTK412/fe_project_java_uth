import { useState, useEffect } from "react";
import {
  XCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Building2,
  Crown,
  UserCircle,
  Save,
  Loader2,
} from "lucide-react";
import { fetchAgenciesActive } from "../../services/api/agencyApi";

const ROLES = [
  {
    value: "ROLE_ADMIN",
    label: "Quản trị viên",
    color: "bg-red-100 text-red-700",
  },
  {
    value: "ROLE_DEALER_MANAGER",
    label: "Quản lý đại lý",
    color: "bg-purple-100 text-purple-700",
  },
  {
    value: "ROLE_DEALER_STAFF",
    label: "Nhân viên đại lý",
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: "ROLE_EVM_STAFF",
    label: "Nhân viên hãng",
    color: "bg-orange-100 text-orange-700",
  },
];

// 
const MEMBERSHIP_LEVELS = [
  { value: "COPPER", label: "Đồng", color: "bg-amber-100 text-amber-700" },
  { value: "SILVER", label: "Bạc", color: "bg-gray-100 text-gray-700" },
  { value: "GOLD", label: "Vàng", color: "bg-yellow-100 text-yellow-700" },
  { value: "DIAMOND", label: "Bạch kim", color: "bg-cyan-100 text-cyan-700" },
];

const GENDERS = [
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
];

const UserModal = ({
  isOpen,
  onClose,
  onSubmit,
  type = "employee",
  mode = "view",
  initialData = null,
  loading = false,
}) => {
  const isEmployee = type === "employee";
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";

  const [formData, setFormData] = useState({});
  const [agencies, setAgencies] = useState([]);

  useEffect(() => {
    if (isOpen && isEmployee) {
      fetchAgenciesActive().then((response) => {
        if (response.success && response.data) {
          setAgencies(response.data);
        }
      });
    }
  }, [isOpen, isEmployee]);

  useEffect(() => {
    if (isOpen) {
      if (initialData && (isViewMode || isEditMode)) {
        setFormData({ ...initialData });
      } else {
        // Reset form cho create mode - KHÔNG set ngày sinh mặc định
        setFormData({
          [isEmployee ? "employeeName" : "customerName"]: "",
          gender: "",
          birthDate: "",
          phoneNumber: "",
          email: "",
          address: "",
          ...(isEmployee
            ? { role: "", agencyId: "" }
            : { membershipLevel: "BRONZE" }),
        });
      }
    }
  }, [isOpen, initialData, mode, isEmployee]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  const nameField = isEmployee ? "employeeName" : "customerName";
  const idField = isEmployee ? "employeeId" : "customerId";

  // Lấy Role Info or Membership Info
  const getRoleInfo = (role) =>
    ROLES.find((r) => r.value === role) || {
      label: role,
      color: "bg-gray-100 text-gray-700",
    };
  const getMembershipInfo = (level) =>
    MEMBERSHIP_LEVELS.find((m) => m.value === level) || {
      label: level,
      color: "bg-gray-100 text-gray-700",
    };
  const getGenderLabel = (gender) =>
    GENDERS.find((g) => g.value === gender)?.label || gender;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-200">
        {/* Header */}
        <div
          className={`p-6 border-b ${isEmployee ? "bg-gradient-to-r from-blue-50 to-indigo-50" : "bg-gradient-to-r from-purple-50 to-pink-50"}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${isEmployee ? "bg-blue-100" : "bg-purple-100"}`}
              >
                {isEmployee ? (
                  <User
                    className={`w-6 h-6 ${isEmployee ? "text-blue-600" : "text-purple-600"}`}
                  />
                ) : (
                  <Building2 className="w-6 h-6 text-purple-600" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {isViewMode && "Chi tiết"}
                  {isEditMode && "Chỉnh sửa"}
                  {isCreateMode && "Thêm mới"}{" "}
                  {isEmployee ? "nhân viên" : "khách hàng"}
                </h3>
                {initialData && (
                  <p className="text-sm text-gray-500">
                    ID: #{initialData[idField]}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {isViewMode ? (
            <div className="space-y-6">
              {/* Thông tin cơ bản */}
              <div
                className={`rounded-xl p-5 border ${isEmployee ? "bg-blue-50 border-blue-100" : "bg-purple-50 border-purple-100"}`}
              >
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <UserCircle
                    className={`w-5 h-5 ${isEmployee ? "text-blue-600" : "text-purple-600"}`}
                  />
                  Thông tin cơ bản
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Họ và tên</p>
                    <p className="font-medium text-gray-800">
                      {formData[nameField] || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Giới tính</p>
                    <p className="font-medium text-gray-800">
                      {getGenderLabel(formData.gender) || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Ngày sinh</p>
                    <p className="font-medium text-gray-800">
                      {formData.birthDate
                        ? new Date(formData.birthDate).toLocaleDateString(
                          "vi-VN"
                        )
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      {isEmployee ? "Vai trò" : "Hạng thành viên"}
                    </p>
                    {isEmployee ? (
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getRoleInfo(formData.role).color}`}
                      >
                        {getRoleInfo(formData.role).label}
                      </span>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getMembershipInfo(formData.membershipLevel).color}`}
                      >
                        <Crown className="w-3 h-3" />
                        {getMembershipInfo(formData.membershipLevel).label}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Thông tin liên hệ */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-600" />
                  Thông tin liên hệ
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="font-medium text-gray-800">
                        {formData.email || "-"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="font-medium text-gray-800">
                        {formData.phoneNumber || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Địa chỉ</p>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <p className="font-medium text-gray-800">
                        {formData.address || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin công việc  */}
              {isEmployee && formData.agencyId && (
                <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-orange-600" />
                    Thông tin đại lý
                  </h4>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Mã đại lý</p>
                    <p className="font-medium text-gray-800">
                      #{formData.agencyId}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Tên + Giới tính */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData[nameField] || ""}
                      onChange={(e) => handleChange(nameField, e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới tính
                  </label>
                  <select
                    value={formData.gender || ""}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Chọn giới tính</option>
                    {GENDERS.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ngày sinh + Role/Membership */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày sinh
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={formData.birthDate || ""}
                      onChange={(e) =>
                        handleChange("birthDate", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isEmployee ? "Vai trò" : "Hạng thành viên"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    {isEmployee ? (
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    ) : (
                      <Crown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    )}
                    <select
                      value={
                        isEmployee
                          ? formData.role || ""
                          : formData.membershipLevel || ""
                      }
                      onChange={(e) =>
                        handleChange(
                          isEmployee ? "role" : "membershipLevel",
                          e.target.value
                        )
                      }
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      required
                    >
                      <option value="">
                        Chọn {isEmployee ? "vai trò" : "hạng"}
                      </option>
                      {(isEmployee ? ROLES : MEMBERSHIP_LEVELS).map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phoneNumber || ""}
                      onChange={(e) =>
                        handleChange("phoneNumber", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0123 456 789"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    value={formData.address || ""}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={2}
                    placeholder="Nhập địa chỉ"
                  />
                </div>
              </div>

              {/* Mã đại lý*/}
              {isEmployee && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đại lý
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={formData.agencyId || ""}
                      onChange={(e) =>
                        handleChange(
                          "agencyId",
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="">Chọn đại lý (nếu có)</option>
                      {agencies.map((agency) => (
                        <option key={agency.agencyId} value={agency.agencyId}>
                          {agency.agencyName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex gap-3">
            {isViewMode ? (
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Đóng
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  disabled={loading}
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white rounded-xl transition-colors font-medium ${isEmployee
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-purple-500 hover:bg-purple-600"
                    } disabled:opacity-50`}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {isCreateMode ? "Thêm mới" : "Lưu thay đổi"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
