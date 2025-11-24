import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { showError } from "../../components/shared/toast";

export default function VehicleTypeDetailPage() {
  const { vehicleTypeDetailId } = useParams();
  const navigate = useNavigate();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "http://localhost:8080/api";

  useEffect(() => {
    const id = Number(vehicleTypeDetailId); // Ép kiểu số
    if (!id) {
      showError("ID loại xe không hợp lệ");
      return;
    }

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${BASE_URL}/vehicle/type/detail/${id}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "*/*" },
        });

        if (res.data.success && res.data.data) {
          setDetail(res.data.data);
        } else {
          showError(res.data.message || "Không thể tải dữ liệu");
        }
      } catch (err) {
        console.error(err);
        showError(err.response?.data?.message || "Lỗi tải dữ liệu từ server");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [vehicleTypeDetailId]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!detail) return null;

  const d = detail;

  const cards = [
    [
      { label: "ID", value: d.vehicleTypeDetailId },
      { label: "Màu sắc", value: d.color || "-" },
      { label: "Phiên bản", value: d.version || "-" },
    ],
    [
      { label: "Cấu hình", value: d.configuration || "-" },
      { label: "Tính năng", value: d.features || "-" },
      { label: "Giá", value: d.price ? `${d.price} VND` : "-" },
    ],
    [
      { label: "ID Loại xe", value: d.vehicleTypeId || "-" },
      { label: "Ảnh", value: d.vehicleImage || "-" },
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
        Chi tiết loại xe
      </h1>

      {d.vehicleImage && (
        <div className="w-full max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-white">
          <img
            src={`${BASE_URL}/images/${d.vehicleImage.split("/").pop()}`}
            alt={d.version || "Ảnh xe"}
            className="w-full h-96 object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              e.target.src = "/placeholder.png"; // ảnh fallback nếu server không có
            }}
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
