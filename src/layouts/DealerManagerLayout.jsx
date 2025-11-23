// src/layouts/DealerManagerLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { LayoutDashboard, MessageSquare, BarChart3, ShoppingCart, TrendingUp } from "lucide-react";
import SharedSidebar from "../components/shared/SharedSidebar";
import SharedHeader from "../components/shared/SharedHeader";

const DealerManagerLayout = ({ children }) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dealerManager",
      badge: "Hot",
      badgeColor: "#e91e63",
    },
    {
      id: "feedback",
      label: "Ghi nhận và xử lý phản hồi",
      icon: MessageSquare,
      path: "/dealerManager/feedback",
    },
    {
      id: "reports",
      label: "Báo cáo",
      icon: BarChart3,
      path: "/dealerManager/reports",
    },
    {
      id: "import-request",
      label: "Đặt xe từ hãng",
      icon: ShoppingCart,
      path: "/dealerManager/import-request",
    },
    {
      id: "promotions",
      label: "Quản lý khuyến mãi",
      icon: TrendingUp,
      path: "/dealerManager/promotions",
    },
    {
      id: "orders",
      label: "Quản lý đơn hàng bán được",
      icon: ShoppingCart,
      path: "/dealerManager/order",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <SharedSidebar menuItems={menuItems} bgColor="bg-white" borderColor="border-gray-200" />
      <div className="flex flex-col flex-1 min-h-0">
        <SharedHeader title="Dealer Manager" />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
          {children}
        </main>
      </div>
    </div>
  );
};

export default DealerManagerLayout;
