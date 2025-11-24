import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { vehicleApi } from "../../services/api/admin/vehicleApi";
import { showError } from "../../components/shared/toast";

const STATUS = {
  IN_STOCK: {
    label: "Tồn kho",
  },
  SOLD: {
    label: "Đã bán",
  },
  IN_TRANSIT: {
    label: "Đang vận chuyển",
  },
  TEST_DRIVE: {
    label: "Xe lái thử",
  },
};
export default function VehicleDetailPage() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "http://localhost:8080/api";

  const fetchVehicle = async () => {
    if (!vehicleId) return;
    setLoading(true);
    try {
      const res = await vehicleApi.getById(vehicleId);
      if (res.success && res.data) setVehicle(res.data);
      else showError(res.message || "Không thể tải dữ liệu phương tiện");
    } catch {
      showError("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicle();
  }, [vehicleId]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!vehicle) return null;

  const v = vehicle.vehicleTypeDetail || {};
  const a = vehicle.agency || {};

  const cards = [
    [
      { label: "ID", value: vehicle.vehicleId },
      { label: "Mã khung", value: vehicle.chassisNumber },
      { label: "Mã máy", value: vehicle.machineNumber },
    ],
    [
      {
        label: "Trạng thái",
        value: (
          <span className={`py-1 ${STATUS[vehicle.status]?.color}`}>
            {STATUS[vehicle.status]?.label || "Không xác định"}
          </span>
        ),
      },
      { label: "Tình trạng", value: vehicle.vehicleCondition },
    ],
    [
      { label: "Phiên bản", value: v.version },
      { label: "Màu sắc", value: v.color },
      { label: "Cấu hình", value: v.configuration },
      { label: "Tính năng", value: v.features },
      { label: "Giá", value: `${v.price} VND` },
    ],
    [
      { label: "Đại lý", value: a.agencyName },
      { label: "Địa chỉ", value: a.address },
      { label: "Số điện thoại", value: a.phoneNumber },
      { label: "Email", value: a.email },
    ],
  ];

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Quay lại
      </button>

      <h1 className="text-3xl font-extrabold text-gray-900 text-center">
        Chi tiết phương tiện
      </h1>

      {v.vehicleImage && (
        <div className="w-full max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-white">
          <img
            src={`${BASE_URL}/images/${v.vehicleImage.split("/").pop()}`}
            alt={v.version}
            className="w-full h-96 object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {cards.map((group, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col space-y-2"
          >
            {group.map((item) => (
              <div key={item.label}>
                <p className="text-sm text-gray-500 font-semibold">{item.label}</p>
                <p className="text-lg text-gray-800 font-bold mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
