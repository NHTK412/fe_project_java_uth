import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { vehicleApi } from "../../services/api/admin/vehicleApi";
import { showError } from "../../components/shared/toast";

export default function VehicleTypeDetailPage() {
  const { vehicleTypeId } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await vehicleApi.getAllTypeDetail(0, 10, vehicleTypeId);
      if (res.success && res.data?.content) {
        setDetails(res.data.content);
      } else {
        showError(res.message || "Không thể tải chi tiết loại xe");
      }
    } catch (error) {
      showError("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vehicleTypeId) fetchDetails();
  }, [vehicleTypeId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-500">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại
      </button>

      <h1 className="text-2xl font-bold text-gray-800">Chi tiết loại xe</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {details.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">Không có dữ liệu</p>
        ) : (
          details.map((d) => (
            <div
              key={d.vehicleTypeDetailId}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Ảnh trên cùng */}
              {d.vehicleImage && (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                  <img
                    src={`/images/${d.vehicleImage}`}
                    alt={d.version}
                    className="max-h-40 object-contain"
                  />
                </div>
              )}

              {/* Thông tin chi tiết */}
              <div className="p-6 space-y-2">
                <h2 className="text-lg font-semibold text-gray-800">{d.version}</h2>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>
                    <span className="font-medium text-gray-600">Cấu hình:</span> {d.configuration}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Màu sắc:</span> {d.color}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Tính năng:</span> {d.features}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Giá:</span> {d.price} USD
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
