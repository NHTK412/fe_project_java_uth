import React from "react";
import { Outlet } from "react-router-dom";
import { LayoutDashboard, Users, MessageSquare, BarChart3, Settings } from "lucide-react";
// import SharedSidebar from "../components/shared/SharedSidebar";
// import SharedHeader from "../components/shared/SharedHeader";
import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header"

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-h-0">
        <Header />

        {/* Content area */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
  // const menuItems = [
  //   {
  //     id: "dashboard",
  //     label: "Dashboard",
  //     icon: LayoutDashboard,
  //     path: "/admin",
  //     badge: "Hot",
  //     badgeColor: "#e91e63",
  //   },
  //   {
  //     id: "users",
  //     label: "Quản lý tài khoản nhân viên",
  //     icon: Users,
  //     path: "/admin/users",
  //   },
  //   {
  //     id: "feedback",
  //     label: "Ghi nhận và xử lý phản hồi",
  //     icon: MessageSquare,
  //     path: "/admin/feedback",
  //   },
  //   {
  //     id: "reports",
  //     label: "Báo cáo",
  //     icon: BarChart3,
  //     path: "/admin/inventory",
  //   },
  //   {
  //     id: "products",
  //     label: "Quản lý sản phẩm",
  //     icon: BarChart3,
  //     path: "/admin/products",
  //   },
    
  // ];

  // return (
  //   <div className="flex h-screen overflow-hidden">
  //     <SharedSidebar menuItems={menuItems} bgColor="bg-white" borderColor="border-gray-200" />
  //     <div className="flex flex-col flex-1 min-h-0">
  //       <SharedHeader title="Admin Dashboard" />
  //       <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
  //         <Outlet />
  //       </main>
  //     </div>
  //   </div>
  // );
};

export default AdminLayout;
