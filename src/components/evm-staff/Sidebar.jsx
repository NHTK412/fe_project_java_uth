import { useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, PackageOpen, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import LOGO from "../../assets/logo.png";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = useMemo(
    () => [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: ShoppingCart,
        isHot: true,
      },
      {
        id: "agency-management",
        label: "Quản lý đại lý",
        icon: ShoppingCart,
        path: "/staff/agencies",
      },
      {
        id: "warehouse-receipt",
        label: "Quản lý phiếu nhập kho",
        icon: ShoppingCart,
        path: "/staff/warehouse-receipts",
      },
      {
        id: "warehouse-release-note",
        label: "Quản lý phiếu xuất kho",
        icon: PackageOpen,
        path: "/staff/warehouse-release-notes",
      },
    ],
    []
  );

  const toggleSidebar = useCallback(() => setIsOpen((prev) => !prev), []);
  const handleMenuClick = useCallback((path) => navigate(path), [navigate]);

  const handleLogout = useCallback(() => setShowLogoutConfirm(true), []);
  const confirmLogout = useCallback(() => {
    setShowLogoutConfirm(false);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  }, [navigate]);
  const cancelLogout = useCallback(() => setShowLogoutConfirm(false), []);

  const isActiveMenu = (path) => location.pathname.startsWith(path);

  return (
    <aside
      className={`flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
      style={{ height: "100vh" }}
      role="navigation"
      aria-label="Sidebar"
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 flex-shrink-0">
        <div className={`flex items-center gap-3 ${!isOpen ? "mx-auto" : ""}`}>
          <img src={LOGO} alt="Logo" className="w-10 h-10 rounded-lg object-cover" />
          {isOpen && <span className="font-semibold text-gray-900 text-lg">EVM System</span>}
        </div>
        {isOpen && (
          <button onClick={toggleSidebar} className="p-1.5 rounded-md hover:bg-gray-100" title="Thu gọn">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Toggle small */}
      {!isOpen && (
        <div className="px-4 py-3 border-b border-gray-200">
          <button onClick={toggleSidebar} className="w-full p-1.5 rounded-md hover:bg-gray-100" title="Mở rộng">
            <ChevronRight className="w-5 h-5 text-gray-600 mx-auto" />
          </button>
        </div>
      )}

      {/* Menu */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActiveMenu(item.path);

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    active ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                  aria-current={active ? "page" : undefined}
                  title={!isOpen ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && <span className="flex-1 text-left text-sm truncate">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Setting + Logout */}
      <div className="p-3 border-t border-gray-200 flex-shrink-0 space-y-1">
        <button
          onClick={() => handleMenuClick("/admin/settings")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
            isActiveMenu("/admin/settings")
              ? "bg-blue-50 text-blue-600 font-semibold"
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          }`}
          title={!isOpen ? "Cài đặt" : undefined}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="flex-1 text-left text-sm">Cài đặt</span>}
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600"
          title={!isOpen ? "Đăng xuất" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="flex-1 text-left text-sm">Đăng xuất</span>}
        </button>
      </div>

      {/* Logout popup */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm" onClick={cancelLogout}>
          <div className="bg-white rounded-lg shadow-lg p-6 w-80" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Xác nhận đăng xuất</h2>
            <p className="mb-6">Bạn có chắc chắn muốn đăng xuất không?</p>
            <div className="flex justify-end gap-3">
              <button onClick={cancelLogout} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Hủy</button>
              <button onClick={confirmLogout} className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600">Đăng xuất</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
