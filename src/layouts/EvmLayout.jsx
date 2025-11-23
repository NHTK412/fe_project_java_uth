import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { LayoutDashboard, Package, Store, TrendingUp, Percent, DollarSign, ShoppingCart } from "lucide-react";
import SharedSidebar from "../components/shared/SharedSidebar";
import SharedHeader from "../components/shared/SharedHeader";

const getUserRole = () => localStorage.getItem("role") || null;

const EvmLayout = () => {
  const role = getUserRole();

  if (role !== "ROLE_EVM_STAFF") {
    return <Navigate to="/" replace />;
  }

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/staff",
      badge: "Hot",
      badgeColor: "#e91e63",
    },
    {
      id: "inventory",
      label: "Quản lý tồn kho",
      icon: Package,
      path: "/staff/inventory",
    },
    {
      id: "dealers",
      label: "Quản lý đại lý",
      icon: Store,
      path: "/staff/dealers",
    },
    {
      id: "promotions",
      label: "Quản lý khuyến mãi",
      icon: TrendingUp,
      path: "/staff/promotions",
    },
    {
      id: "discounts",
      label: "Quản lý chiết khấu",
      icon: Percent,
      path: "/staff/discounts",
    },
    {
      id: "wholesale",
      label: "Quản lý giá sĩ",
      icon: DollarSign,
      path: "/staff/wholesale",
    },
    {
      id: "orders",
      label: "Quản lý đơn hàng order",
      icon: ShoppingCart,
      path: "/staff/orders",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <SharedSidebar menuItems={menuItems} bgColor="bg-white" borderColor="border-gray-200" />
      <div className="flex flex-col flex-1 min-h-0">
        <SharedHeader title="EVM Staff" />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EvmLayout;
