import React from "react";

const Revenue = () => {
  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Báo cáo doanh thu
          </h1>
          <p className="text-gray-500 mt-1">
            Chi tiết doanh thu theo thời gian
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
          Xuất báo cáo
        </button>
      </div>

      {/* Revenue */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <p className="text-gray-600">Báo cáo doanh thu</p>
      </div>
    </div>
  );
};

export default Revenue;
