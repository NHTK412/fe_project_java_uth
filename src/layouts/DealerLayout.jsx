// src/layouts/DealerLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { LayoutDashboard, Calendar, ShoppingCart, FileText, Package } from "lucide-react";
import SharedSidebar from "../components/shared/SharedSidebar";
import SharedHeader from "../components/shared/SharedHeader";

const DealerLayout = ({ children }) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dealer",
      badge: "Hot",
      badgeColor: "#e91e63",
    },
    {
      id: "test-drive",
      label: "Quản lý lịch hẹn lái thử",
      icon: Calendar,
      path: "/dealer/test-drive",
    },
    {
      id: "orders",
      label: "Quản lý đơn hàng của tôi",
      icon: ShoppingCart,
      path: "/dealer/order",
    },
    {
      id: "quotes",
      label: "Quản lý báo giá",
      icon: FileText,
      path: "/dealer/quotes",
    },
    {
      id: "vehicles",
      label: "Xem thông tin xe",
      icon: Package,
      path: "/dealer/vehicles",
    },
    {
      id: "inventory",
      label: "Quản lý tồn kho",
      icon: Package,
      path: "/dealer/inventory",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <SharedSidebar menuItems={menuItems} bgColor="bg-white" borderColor="border-gray-200" />
      <div className="flex flex-col flex-1 min-h-0">
        <SharedHeader title="Dealer Staff" />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
          {children}
        </main>
      </div>
    </div>
  );
};

export default DealerLayout;
