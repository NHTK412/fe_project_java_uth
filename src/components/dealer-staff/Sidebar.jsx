import { useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Package, Car, Settings, Clipboard, LayoutDashboard, Briefcase, Building2, Boxes, Calendar, ChevronLeft, LogOut, FileText, UserCog, Search } from "lucide-react";

import LOGO from "../../assets/logo.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // NOTE: Map menu items với các đường dẫn tương ứng
  // Admin menu includes: Dashboard, Quản lý người dùng (Users), Báo cáo (Reports), Báo cáo tồn kho, Báo cáo doanh thu, Phản hồi, Cài đặt
  const menuItems = useMemo(
    () => [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        isHot: true,
        path: "/Dealer-Staff",
      },
      {
        id: "order",
        label: "Đơn hàng",
        icon: ShoppingCart,
        path: "/Dealer-Staff/order",
      },
      {
        id: "vehicles",
        label: "Danh mục xe",
        icon: Car,
        path: "/Dealer-Staff/vehicles",
      },
      {
        id: "test-drive",
        label: "Lịch lái thử",
        icon: Calendar,
        path: "/Dealer-Staff/test-drive",
      },
      {
        id: "quote-management",
        label: "Quản lý báo giá",
        icon: FileText,
        path: "/Dealer-Staff/quote-management",
      },
      {
        id: "inventory-management",
        label: "Quản lý tồn kho",
        icon: Boxes,
        path: "/Dealer-Staff/inventory-management",
      },
      {
        id: "agency-order-management",
        label: "Đơn hàng đại lý",
        icon: Building2,
        path: "/Dealer-Staff/agency-oder-management",
      },
      {
        id: "employee-order-management",
        label: "Đơn hàng nhân viên",
        icon: Briefcase,
        path: "/Dealer-Staff/employee-oder-management",
      },
      {
        id: "order-management",
        label: "Quản lý đơn hàng",
        icon: Package,
        path: "/Dealer-Staff/order-management",
      },
      {
        id: "customer-management",
        label: "Quản lý khách hàng",
        icon: UserCog,
        path: "/Dealer-Staff/customer-management",
      },
      {
        id: "vehicle-inquiry",
        label: "Truy vấn thông tin xe",
        icon: Search,
        path: "/Dealer-Staff/vehicle-inquiry",
      },
      {
        id: "test-drive-appointments",
        label: "Quản lý lịch hẹn",
        icon: Calendar,
        path: "/Dealer-Staff/test-drive-appointments",
      },
    ],
    []
  );

  const toggleSidebar = useCallback(() => setIsOpen((prev) => !prev), []);

  const handleMenuClick = useCallback(
    (id, path) => {
      setActiveMenu(id);
      navigate(path);
    },
    [navigate]
  );

  const handleLogout = useCallback(() => {
    // Xử lý logout
    console.log("Logging out...");
    // navigate("/login");
    setShowLogoutConfirm(true);
  }, []);

  const confirmLogout = useCallback(() => {
    setShowLogoutConfirm(false);
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    } catch (err) { }
    navigate("/");
  }, [navigate]);

  const cancelLogout = useCallback(() => {
    setShowLogoutConfirm(false);
  }, []);

  // Kiểm tra menu nào đang active dựa trên URL
  const isActiveMenu = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${isOpen ? "w-64" : "w-20"
        }`}
      style={{ height: "100vh" }}
      role="navigation"
      aria-label="Sidebar navigation"
    >
      {/* Header Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 flex-shrink-0">
        <div className={`flex items-center gap-3 ${!isOpen ? "mx-auto" : ""}`}>
          <img
            src={LOGO}
            alt="EVM Logo"
            className="w-10 h-10 rounded-lg object-cover"
          />
          {isOpen && (
            <span className="font-semibold text-gray-900 text-lg">
              EVM System
            </span>
          )}
        </div>

        {isOpen && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Thu gọn sidebar"
            title="Thu gọn"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Toggle button */}
      {!isOpen && (
        <div className="px-4 py-3 border-b border-gray-200">
          <button
            onClick={toggleSidebar}
            className="w-full p-1.5 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Mở rộng sidebar"
            title="Mở rộng"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 mx-auto" />
          </button>
        </div>
      )}

      {/* Main Navigation Menu */}
      <nav className="flex-1 p-3 overflow-y-auto" aria-label="Main menu">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = isActiveMenu(item.path);
            const showAppsLabel = index === 1;

            return (
              <li key={item.id}>
                {showAppsLabel && (
                  <div className="px-4 pt-4 pb-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Apps
                    </span>
                  </div>
                )}
                <button
                  onClick={() => handleMenuClick(item.id, item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  aria-current={isActive ? "page" : undefined}
                  title={!isOpen ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && (
                    <span className="flex-1 text-left text-sm truncate">
                      {item.label}
                    </span>
                  )}

                  {/* HOT Badge */}
                  {item.isHot && isOpen && (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: "#e91e63", fontSize: "10px" }}
                    >
                      Hot
                    </span>
                  )}

                  {/* Tooltip when closed */}
                  {!isOpen && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">
                      {item.label}
                      <div className="absolute top-1/2 right-full -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Setting + Logout */}
      <div className="p-3 border-t border-gray-200 flex-shrink-0 space-y-1">
        <button
          onClick={() => handleMenuClick("settings", "/admin/settings")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${isActiveMenu("/admin/settings")
            ? "bg-blue-50 text-blue-600 font-semibold"
            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
          aria-current={isActiveMenu("/admin/settings") ? "page" : undefined}
          title={!isOpen ? "Cài đặt" : undefined}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="flex-1 text-left text-sm">Cài đặt</span>}

          {!isOpen && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">
              Cài đặt
              <div className="absolute top-1/2 right-full -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
            </div>
          )}
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-gray-700 hover:bg-red-50 hover:text-red-600 group relative focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
          title={!isOpen ? "Đăng xuất" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isOpen && (
            <span className="flex-1 text-left text-sm">Đăng xuất</span>
          )}

          {!isOpen && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">
              Đăng xuất
              <div className="absolute top-1/2 right-full -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
            </div>
          )}
        </button>
      </div>

      {/* Popup xác nhận đăng xuất */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm"
          onClick={cancelLogout}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Xác nhận đăng xuất</h2>
            <p className="mb-6">Bạn có chắc chắn muốn đăng xuất không?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
