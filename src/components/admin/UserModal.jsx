import { useState, useEffect } from "react";
import { X } from "lucide-react";

const ROLES = [
  { value: "ROLE_ADMIN", label: "Quản trị viên" },
  { value: "ROLE_DEALER_MANAGER", label: "Quản lý đại lý" },
  { value: "ROLE_DEALER_STAFF", label: "Nhân viên kinh doanh" },
  { value: "ROLE_EVM_STAFF", label: "Nhân viên giao xe" },
];

const MEMBERSHIP_LEVELS = [
  { value: "COPPER", label: "Đồng" },
  { value: "SILVER", label: "Bạc" },
  { value: "GOLD", label: "Vàng" },
  { value: "DIAMOND", label: "Kim cương" },
];

const DetailItem = ({ label, children, full }) => (
  <div className={`${full ? "col-span-2" : ""}`}>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-base font-medium text-gray-800 mt-1 bg-gray-50 p-2 rounded-lg border">
      {children || "—"}
    </p>
  </div>
);

const UserModal = ({
  isOpen,
  onClose,
  onSubmit,
  type = "employee",
  mode = "create",
  initialData = null,
  loading = false,
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // load data vào form
  useEffect(() => {
    if (isOpen) {
      if (mode !== "create" && initialData) {
        setFormData({
          ...initialData,
          name: initialData.employeeName || initialData.customerName || "",
          phone: initialData.phone || initialData.phoneNumber || "",
        });
      } else {
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          role: "ROLE_EVM_STAFF",
          membershipLevel: "COPPER",
          agencyId: "",
          password: "",
          username: "",
          gender: "MALE",
          birthDate: "2000-01-01",
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name?.trim()) newErrors.name = "Vui lòng nhập họ tên";

    if (!formData.email?.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.phone?.trim())
      newErrors.phone = "Vui lòng nhập số điện thoại";

    if (
      mode === "create" &&
      type === "employee" &&
      !formData.password?.trim()
    ) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData =
      type === "employee"
        ? {
            employeeName: formData.name,
            email: formData.email,
            phoneNumber: formData.phone,
            address: formData.address,
            role: formData.role,
            agencyId: formData.agencyId || null,
            password: formData.password,
            gender: formData.gender,
            birthDate: formData.birthDate,
            username:
              formData.username ||
              formData.name?.toLowerCase().replace(/\s+/g, ""),
          }
        : {
            customerName: formData.name,
            email: formData.email,
            phoneNumber: formData.phone,
            address: formData.address,
            membershipLevel: formData.membershipLevel,
            gender: formData.gender,
            birthDate: formData.birthDate,
          };

    onSubmit?.(submitData);
  };

  if (!isOpen) return null;

  const title =
    mode === "create"
      ? `Thêm ${type === "employee" ? "nhân viên" : "khách hàng"} mới`
      : mode === "edit"
        ? `Chỉnh sửa ${type === "employee" ? "nhân viên" : "khách hàng"}`
        : `Chi tiết ${type === "employee" ? "nhân viên" : "khách hàng"}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {mode === "view" ? (
          <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
            {/* Thông tin chung */}
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-3">
                Thông tin chung
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="ID">
                  {type === "employee"
                    ? formData.employeeId
                    : formData.customerId}
                </DetailItem>

                <DetailItem label="Họ tên">
                  {formData.employeeName || formData.customerName}
                </DetailItem>

                <DetailItem label="Giới tính">{formData.gender}</DetailItem>

                <DetailItem label="Ngày sinh">
                  {formData.birthDate
                    ? new Date(formData.birthDate).toLocaleDateString("vi-VN")
                    : "—"}
                </DetailItem>
              </div>
            </div>

            {/* Liên hệ */}
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-3">
                Thông tin liên hệ
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Email">{formData.email}</DetailItem>

                <DetailItem label="Số điện thoại">
                  {formData.phoneNumber || formData.phone}
                </DetailItem>

                <DetailItem label="Địa chỉ" full>
                  {formData.address}
                </DetailItem>
              </div>
            </div>

            {/* Employee / Customer */}
            {type === "employee" ? (
              <div>
                <h3 className="text-md font-semibold text-gray-800 mb-3">
                  Công việc
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <DetailItem label="Tên đăng nhập">
                    {formData.username}
                  </DetailItem>
                  <DetailItem label="Chức vụ">{formData.role}</DetailItem>
                  <DetailItem label="Mã đại lý">{formData.agencyId}</DetailItem>
                  <DetailItem label="Tên đại lý">
                    {formData.agencyName}
                  </DetailItem>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-md font-semibold text-gray-800 mb-3">
                  Khách hàng
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <DetailItem label="Hạng thành viên">
                    {formData.membershipLevel}
                  </DetailItem>
                </div>
              </div>
            )}

            {/* Time */}
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-3">
                Thời gian
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Ngày tạo">
                  {formData.createdAt
                    ? new Date(formData.createdAt).toLocaleString("vi-VN")
                    : "—"}
                </DetailItem>

                <DetailItem label="Cập nhật lần cuối">
                  {formData.updatedAt
                    ? new Date(formData.updatedAt).toLocaleString("vi-VN")
                    : "—"}
                </DetailItem>
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-4 overflow-y-auto max-h-[65vh]"
          >
            {/* name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nhập họ tên"
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name}</p>
              )}
            </div>

            {/* email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nhập email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>

            {/* phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nhập số điện thoại"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone}</p>
              )}
            </div>

            {/* address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ
              </label>
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg border-gray-300"
                placeholder="Nhập địa chỉ"
              />
            </div>

            {/* employee or customer field */}
            {type === "employee" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chức vụ
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg border-gray-300"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã đại lý
                  </label>
                  <input
                    type="text"
                    name="agencyId"
                    value={formData.agencyId || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg border-gray-300"
                  />
                </div>

                {mode === "create" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password || ""}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Nhập mật khẩu"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs">{errors.password}</p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hạng thành viên
                </label>
                <select
                  name="membershipLevel"
                  value={formData.membershipLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg border-gray-300"
                >
                  {MEMBERSHIP_LEVELS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </form>
        )}

        {/* FOOTER */}
        {mode !== "view" && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading
                ? "Đang xử lý..."
                : mode === "create"
                  ? "Thêm mới"
                  : "Cập nhật"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserModal;
