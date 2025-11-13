import React, { useState } from "react";
import {
  Car,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Users,
  ChartLine,
  Package,
  Bot,
  UserPlus,
} from "lucide-react";
import "../../style.css";

const menuItems = [
  { id: 1, label: "Dashboard", icon: Car },
  { id: 2, label: "Employee Management", icon: Users },
  { id: 3, label: "Customer Management", icon: UserPlus },
  { id: 4, label: "Renevue Report", icon: ChartLine },
  { id: 5, label: "Inventory Report", icon: Package },
  { id: 6, label: "AI Assistant", icon: Bot },
];

function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="app-container">
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        {/* Logo */}
        <div className="sidebar-header">
          {sidebarOpen ? (
            <>
              <div className="logo-container">
                <div className="logo-icon">
                  <Car className="icon" />
                </div>
                <span className="logo-text">EVM</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="toggle-btn"
              >
                <X className="icon-sm" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="toggle-btn centered"
            >
              <Menu className="icon-sm" />
            </button>
          )}
        </div>

        {/* Menu Items */}
        <nav className="menu-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`menu-item ${isActive ? "active" : ""}`}
              >
                <Icon className="icon-sm" />
                {sidebarOpen && (
                  <span className="menu-label">{item.label}</span>
                )}
                {sidebarOpen && isActive && (
                  <ChevronRight className="icon-xs" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button className="logout-btn">
            <LogOut className="icon-sm" />
            {sidebarOpen && <span className="menu-label">Đăng xuất</span>}
          </button>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
