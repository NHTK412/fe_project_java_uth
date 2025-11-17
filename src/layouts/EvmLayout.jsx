// EvmLayout.jsx
import React from "react";
import { Outlet, Navigate } from "react-router-dom";

// Lấy role từ sessionStorage
const getUserRole = () => sessionStorage.getItem("usernameRole") || null;

const EvmLayout = () => {
  const role = getUserRole();

  // Nếu không phải user EVM, redirect về trang khác
  if (role !== "EVM_USER") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="evm-layout flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white flex-shrink-0">
        <div className="p-4 font-bold text-xl border-b border-blue-700">
          EVM Panel
        </div>
        <nav className="mt-4">
          <ul>
            <li className="p-2 hover:bg-blue-700 cursor-pointer">Home</li>
            <li className="p-2 hover:bg-blue-700 cursor-pointer">Orders</li>
            <li className="p-2 hover:bg-blue-700 cursor-pointer">Profile</li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">EVM Dashboard</h1>
        </header>
        {/* Outlet sẽ render component con dựa vào route */}
        <Outlet />
      </main>
    </div>
  );
};

export default EvmLayout;
