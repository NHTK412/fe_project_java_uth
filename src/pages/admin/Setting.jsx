import React from "react";
import COMINGSOON from "../../assets/comingsoon.gif";

const Settings = () => {
  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cài đặt</h1>
          <p className="text-gray-500 mt-1">Quản lý cấu hình hệ thống</p>
        </div>
      </div>

      {/*Settings */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <p className="text-gray-600">
          Tính năng đang được phát triển. Vui lòng thử lại trong thòi gian tới.
        </p>
        <br></br>
        <img
          className="mx-auto mt-4"
          src={COMINGSOON}
          alt="Feature in development"
        />
      </div>
    </div>
  );
};

export default Settings;
