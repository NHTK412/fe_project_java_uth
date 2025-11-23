// src/layouts/DealerManagerLayout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const DealerManagerLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="dealer-manager-layout flex h-screen">
      <aside className="w-64 bg-yellow-800 text-white flex-shrink-0">
        <div className="p-4 font-bold text-xl border-b border-yellow-700">Dealer Manager Panel</div>
        <nav className="mt-4">
          <ul>
            <li
              onClick={() => handleNavigate('/dealerManager')}
              className="p-3 hover:bg-yellow-700 cursor-pointer transition-colors"
            >
              🏠 Dashboard
            </li>
            <li
              onClick={() => handleNavigate('/dealerManager/order')}
              className="p-3 hover:bg-yellow-700 cursor-pointer transition-colors"
            >
              📋 Quản lý đơn hàng
            </li>
            <li
              onClick={() => handleNavigate('/user-profile')}
              className="p-3 hover:bg-yellow-700 cursor-pointer transition-colors"
            >
              👤 Hồ sơ
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-100 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default DealerManagerLayout;
