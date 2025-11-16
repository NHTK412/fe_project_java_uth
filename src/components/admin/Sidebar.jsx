import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import LOGO from "../../assets/logo.png";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "Quản lý người dùng", icon: Users },
    { id: "inventory report", label: "Báo cáo tồn kho", icon: ShoppingCart },
    { id: "revenue report", label: "Báo cáo doanh thu", icon: BarChart3 },
  ];

  return (
    <div
      className={`flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
      style={{ height: "100vh" }}
    >
      <div className="h-16 flex items-center border-b border-gray-200 flex-shrink-0 relative">
        <div
          className={`flex items-center mx-auto ${
            !isOpen ? "justify-center w-full" : ""
          }`}
        >
          <img
            src={LOGO}
            alt="EVM Logo"
            className="w-10 h-10 rounded-lg object-cover"
          />
        </div>

        {isOpen && (
          <div className="absolute right-0 mr-4">
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {!isOpen && (
        <div className="px-4 py-4">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 ml-auto mr-3" />
          </button>
        </div>
      )}

      {/* Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 mb-1 rounded-lg transition-all ${
                isActive ? "font-semibold" : "text-gray-700 hover:bg-gray-50"
              }`}
              style={
                isActive
                  ? {
                      backgroundColor: "#eff6ff",
                      color: "#2563eb",
                    }
                  : {}
              }
            >
              <Icon className="w-6 h-6 flex-shrink-0" />
              {isOpen && (
                <span className="flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Setting + Logout */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <button
          onClick={() => setActiveMenu("settings")}
          className={`w-full flex items-center gap-4 px-4 py-3 mb-1 rounded-lg transition-all ${
            activeMenu === "settings"
              ? "font-semibold"
              : "text-gray-700 hover:bg-gray-50"
          }`}
          style={
            activeMenu === "settings"
              ? {
                  backgroundColor: "#eff6ff",
                  color: "#2563eb",
                }
              : {}
          }
        >
          <Settings className="w-6 h-6 flex-shrink-0" />
          {isOpen && <span className="flex-1 text-left">Cài đặt</span>}
        </button>

        <button
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all"
          style={{ color: "#dc2626" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#fee2e2")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <LogOut className="w-6 h-6 flex-shrink-0" />
          {isOpen && <span className="flex-1 text-left">Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
