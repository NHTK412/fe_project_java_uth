import React, { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useLoginPopup } from "../contexts/LoginPopupContext";
import { motion, AnimatePresence } from "framer-motion";

// Lấy role từ localStorage
const getUserRole = () => localStorage.getItem("role") || null;

const AdminLayout = () => {
  const role = getUserRole();
  const { showPopup, closePopup } = useLoginPopup();

  // Nếu không phải admin, redirect về home
  if (role !== "ROLE_ADMIN") {
    return <Navigate to="/" replace />;
  }

  // Tự tắt popup sau 3s
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(closePopup, 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup, closePopup]);

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
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
