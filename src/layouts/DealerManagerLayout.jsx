// src/layouts/DealerManagerLayout.jsx
import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const DealerManagerLayout = () => {
  const role = localStorage.getItem("role") || null;

  if (role !== "ROLE_DEALER_MANAGER") return <Navigate to="/" replace />;

  return (
    <div className="dealer-manager-layout flex h-screen">
      <aside className="w-64 bg-yellow-800 text-white flex-shrink-0">
        <div className="p-4 font-bold text-xl border-b border-yellow-700">Dealer Manager Panel</div>
        <nav className="mt-4">
          <ul>
            <li className="p-2 hover:bg-yellow-700 cursor-pointer">Home</li>
            <li className="p-2 hover:bg-yellow-700 cursor-pointer">Reports</li>
            <li className="p-2 hover:bg-yellow-700 cursor-pointer">Settings</li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Dealer Manager Dashboard</h1>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default DealerManagerLayout;
