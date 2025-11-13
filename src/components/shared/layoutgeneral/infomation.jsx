export default function AdminInfo() {
  const admin = {
    name: "Nguyễn Văn B",
    role: "Quản trị viên hệ thống",
    email: "admin@trafficsystem.com",
    phone: "0909 123 456",
    department: "Phòng Quản lý dữ liệu vi phạm",
    avatar: "/avatar_admin.jpg", // thay bằng ảnh của bạn
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Thông tin quản trị viên
      </h2>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Ảnh đại diện */}
        <div className="flex-shrink-0">
          <img
            src={admin.avatar}
            alt="Admin avatar"
            className="w-28 h-28 rounded-full border-4 border-blue-100 shadow-md"
          />
        </div>

        {/* Thông tin chi tiết */}
        <div className="flex-1 w-full space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {admin.name}
            </h3>
            <p className="text-sm text-gray-500">{admin.role}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{admin.email}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-500">Số điện thoại</p>
              <p className="font-medium text-gray-800">{admin.phone}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 sm:col-span-2">
              <p className="text-sm text-gray-500">Phòng ban</p>
              <p className="font-medium text-gray-800">{admin.department}</p>
            </div>
          </div>

          {/* Nút chỉnh sửa */}
          <div className="pt-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Chỉnh sửa thông tin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
