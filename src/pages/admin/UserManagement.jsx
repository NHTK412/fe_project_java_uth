import React from "react";

const Users = () => {
  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý người dùng
          </h1>
          <p className="text-gray-500 mt-1">Danh sách tất cả người dùng</p>
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
          Thêm người dùng
        </button>
      </div>

      {/*Users */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <p className="text-gray-600">Quản lý người dùng</p>
      </div>
    </div>
  );
};

export default Users;
