// src/layouts/DealerLayout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const DealerLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="dealer-layout flex h-screen">
      <aside className="w-64 bg-green-800 text-white flex-shrink-0">
        <div className="p-4 font-bold text-xl border-b border-green-700">Dealer Staff Panel</div>
        <nav className="mt-4">
          <ul>
            <li
              onClick={() => handleNavigate('/dealer')}
              className="p-3 hover:bg-green-700 cursor-pointer transition-colors"
            >
              🏠 Dashboard
            </li>
            <li
              onClick={() => handleNavigate('/dealer/order')}
              className="p-3 hover:bg-green-700 cursor-pointer transition-colors"
            >
              📋 Đơn hàng của tôi
            </li>
            <li
              onClick={() => handleNavigate('/user-profile')}
              className="p-3 hover:bg-green-700 cursor-pointer transition-colors"
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

export default DealerLayout;
