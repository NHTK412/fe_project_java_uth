import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { vehicleTypeApi } from "../../services/api/admin/vehicleTypeApi";
import { showError } from "../../components/shared/toast";

export default function VehicleTypePage() {
  const { vehicleTypeId } = useParams();
  const navigate = useNavigate();
  const [vehicleType, setVehicleType] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchVehicleType = async (id) => {
    setLoading(true);
    try {
      const res = await vehicleTypeApi.getById(id);
      if (res.success && res.data) setVehicleType(res.data);
      else showError(res.message || "Không thể tải dữ liệu loại xe");
    } catch {
      showError("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vehicleTypeId) fetchVehicleType(vehicleTypeId);
  }, [vehicleTypeId]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );

  if (!vehicleType) return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="w-5 h-5" /> Quay lại
      </button>

      {/* Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {vehicleType.vehicleTypeName}
        </h1>

        <div className="space-y-3 text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium">Năm sản xuất:</span>
            <span>{vehicleType.manufactureYear || "Chưa có"}</span>
          </div>

          <div className="flex flex-col">
            <span className="font-medium mb-1">Mô tả:</span>
            <p className="text-gray-600">{vehicleType.description || "Chưa có mô tả"}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
