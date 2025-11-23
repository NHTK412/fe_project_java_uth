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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{initialData ? "Cập nhật loại xe" : "Tạo loại xe mới"}</h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Tên loại xe"
            className="border p-2 rounded"
            value={vehicleTypeName}
            onChange={(e) => setVehicleTypeName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Năm sản xuất"
            className="border p-2 rounded"
            value={manufactureYear}
            onChange={(e) => setManufactureYear(e.target.value)}
          />
          <textarea
            placeholder="Mô tả"
            className="border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {initialData ? "Cập nhật" : "Tạo mới"}
          </button>
        </div>
      </div>
    </div>
  );
}
