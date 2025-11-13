export default function MainContent({ currentPath }) {
  const renderContent = () => {
    switch (currentPath) {
      case "/dashboard":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-500 text-sm">Tổng người dùng</p>
                <p className="text-3xl font-bold text-blue-600">1,234</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-500 text-sm">Phương tiện</p>
                <p className="text-3xl font-bold text-green-600">567</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-500 text-sm">Vi phạm</p>
                <p className="text-3xl font-bold text-red-600">89</p>
              </div>
            </div>
          </div>
        );
      case "/users":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Quản lý người dùng</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">
                Danh sách người dùng sẽ hiển thị ở đây...
              </p>
            </div>
          </div>
        );
      case "/statistics":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Thống kê</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">
                Biểu đồ thống kê sẽ hiển thị ở đây...
              </p>
            </div>
          </div>
        );
      case "/settings":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Cấu hình hệ thống</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">Các cài đặt hệ thống...</p>
            </div>
          </div>
        );
      case "/vehicles":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Quản lý phương tiện</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">Danh sách phương tiện...</p>
            </div>
          </div>
        );
      case "/maintenance":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Lịch sử bảo trì</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">Lịch sử bảo trì phương tiện...</p>
            </div>
          </div>
        );
      case "/records":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Xử lý biên bản</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">Danh sách biên bản...</p>
            </div>
          </div>
        );
      case "/profiles":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Theo dõi hồ sơ</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">Danh sách hồ sơ...</p>
            </div>
          </div>
        );
      case "/profile":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Thông tin cá nhân</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">Thông tin cá nhân của bạn...</p>
            </div>
          </div>
        );
      case "/violations":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Lịch sử vi phạm</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">Danh sách vi phạm của bạn...</p>
            </div>
          </div>
        );
      default:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Trang không tồn tại</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">Vui lòng chọn menu bên trái.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
      {renderContent()}
    </main>
  );
}
