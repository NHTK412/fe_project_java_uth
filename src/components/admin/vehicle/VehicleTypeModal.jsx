import React, { useState, useEffect } from "react";

export default function VehicleTypeModal({ isOpen, onClose, onSubmit, initialData }) {
  const [vehicleTypeName, setVehicleTypeName] = useState("");
  const [manufactureYear, setManufactureYear] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialData) {
      setVehicleTypeName(initialData.vehicleTypeName || "");
      setManufactureYear(initialData.manufactureYear || "");
      setDescription(initialData.description || "");
    } else {
      setVehicleTypeName("");
      setManufactureYear("");
      setDescription("");
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!vehicleTypeName || !manufactureYear || !description) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    onSubmit({
      vehicleTypeName,
      manufactureYear: parseInt(manufactureYear, 10),
      description,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4"
      onClick={onClose} // click ngoài modal để đóng
    >
      <div
        className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-6 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()} // chặn click bubble ra overlay
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {initialData ? "Cập nhật loại xe" : "Tạo loại xe mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên loại xe</label>
            <input
              type="text"
              placeholder="Nhập tên loại xe"
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={vehicleTypeName}
              onChange={(e) => setVehicleTypeName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Năm sản xuất</label>
            <input
              type="number"
              placeholder="Nhập năm sản xuất"
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={manufactureYear}
              onChange={(e) => setManufactureYear(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea
              placeholder="Nhập mô tả"
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all"
          >
            {initialData ? "Cập nhật" : "Tạo mới"}
          </button>
        </div>
      </div>
    </div>
  );
}
