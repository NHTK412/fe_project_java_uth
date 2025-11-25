import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { showError } from "../../components/shared/toast";
import VehicleTypeDetailTable from "../../components/admin/vehicle/VehicleTypeDetailTable";

export default function VehicleTypeDetailListPage() {
    const { vehicleTypeId } = useParams();
    const navigate = useNavigate();
    const [vehicleType, setVehicleType] = useState(null);
    const [loading, setLoading] = useState(false);

    const BASE_URL = "http://localhost:8080/api";

    useEffect(() => {
        const id = Number(vehicleTypeId);
        if (!id) {
            showError("ID loại xe không hợp lệ");
            return;
        }

        const fetchVehicleType = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${BASE_URL}/vehicle/type/${id}`, {
                    headers: { Authorization: `Bearer ${token}`, Accept: "*/*" },
                });

                if (res.data.success && res.data.data) {
                    setVehicleType(res.data.data);
                } else {
                    showError(res.data.message || "Không thể tải dữ liệu loại xe");
                }
            } catch (err) {
                console.error(err);
                showError(err.response?.data?.message || "Lỗi tải dữ liệu từ server");
            } finally {
                setLoading(false);
            }
        };

        fetchVehicleType();
    }, [vehicleTypeId]);

    const handleViewDetail = (item) => {
        navigate(`/admin/vehicle/type/detail/${item.vehicleTypeDetailId}`);
    };

    const handleEdit = (item) => {
        // Để trống cho sau
    };

    const handleDelete = async (item) => {
        // Để trống cho sau
    };

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium"
            >
                <ArrowLeft className="w-5 h-5" />
                Quay lại
            </button>

            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">
                    Chi tiết loại xe
                </h1>
                {vehicleType && (
                    <p className="text-gray-600 mt-2">
                        Loại xe: <span className="font-semibold">{vehicleType.vehicleTypeName}</span>
                    </p>
                )}
            </div>

            <VehicleTypeDetailTable
                vehicleTypeId={vehicleTypeId}
                onView={handleViewDetail}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}
