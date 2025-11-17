// AdminLayout.jsx
import React from "react";
import { Outlet, Navigate } from "react-router-dom";

// Lấy role từ sessionStorage
const getUserRole = () => sessionStorage.getItem("usernameRole") || null;

const AdminLayout = () => {
  const role = getUserRole();

  // Nếu không phải admin, redirect về trang khác (ví dụ: home)
  if (role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-layout flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex-shrink-0">
        <div className="p-4 font-bold text-xl border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="mt-4">
          <ul>
            <li className="p-2 hover:bg-gray-700 cursor-pointer">Dashboard</li>
            <li className="p-2 hover:bg-gray-700 cursor-pointer">Users</li>
            <li className="p-2 hover:bg-gray-700 cursor-pointer">Settings</li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </header>
        {/* Outlet sẽ render component con dựa vào route */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
