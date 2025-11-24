import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/evm-staff/Header";
import Sidebar from "../components/evm-staff/Sidebar";

const EvmLayout = () => {
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
};

export default EvmLayout;