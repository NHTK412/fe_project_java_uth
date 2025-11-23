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

  if (loading) return <div>Loading...</div>;
  if (!vehicleType) return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2">
        <ArrowLeft className="w-5 h-5" /> Quay lại
      </button>
      <h1 className="text-3xl font-bold mt-4">{vehicleType.vehicleTypeName}</h1>
      <p>Năm sản xuất: {vehicleType.manufactureYear}</p>
      <p>Mô tả: {vehicleType.description}</p>
    </div>
  );
}
