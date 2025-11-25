import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { showError, showSuccess } from "../../components/shared/toast";

export default function ImportRequestDetailPage() {
    const { importRequestId } = useParams();
    const navigate = useNavigate();

    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const BASE_URL = "http://localhost:8080/api";

    const fetchDetail = async () => {
        const id = Number(importRequestId);
        if (!id) {
            showError("ID yêu cầu không hợp lệ");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(`${BASE_URL}/import-request/${id}`, {
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

    useEffect(() => {
        fetchDetail();
    }, [importRequestId]);

    const handleStatusChange = async (status) => {
        setUpdating(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.patch(
                `${BASE_URL}/import-request/${detail.importRequestId}?status=${status}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}`, Accept: "*/*" },
                }
            );

            if (res.data.success) {
                setDetail(res.data.data);
                showSuccess("Cập nhật trạng thái thành công!");
                setShowStatusModal(false);
            } else {
                showError(res.data.message || "Lỗi cập nhật trạng thái");
            }
        } catch (err) {
            console.error(err);
            showError(err.response?.data?.message || "Lỗi cập nhật trạng thái từ server");
        } finally {
            setUpdating(false);
        }
    };

    const getStatusLabel = (status) => {
        const statusMap = {
            REQUESTED: "Chờ xử lý",
            APPROVED: "Đã duyệt",
            REJECTED: "Đã từ chối",
        };
        return statusMap[status] || status;
    };

    const getStatusColor = (status) => {
        const colorMap = {
            REQUESTED: "bg-blue-100 text-blue-800",
            APPROVED: "bg-green-100 text-green-800",
            REJECTED: "bg-red-100 text-red-800",
        };
        return colorMap[status] || "bg-gray-100 text-gray-800";
    };

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!detail) return null;

    const d = detail;

    return (
        <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium"
            >
                <ArrowLeft className="w-5 h-5" />
                Quay lại
            </button>

            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-extrabold text-gray-900">
                    Chi tiết yêu cầu nhập hàng #{d.importRequestId}
                </h1>
                <button
                    onClick={() => setShowStatusModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                    Thay đổi trạng thái
                </button>
            </div>

            {/* Thông tin chung */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin nhân viên</h3>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-500 font-semibold">Tên nhân viên</p>
                            <p className="text-lg text-gray-800 font-bold mt-1">{d.employeeName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-semibold">Chức vụ</p>
                            <p className="text-lg text-gray-800 font-bold mt-1">{d.employeePosition}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-semibold">Email</p>
                            <p className="text-lg text-gray-800 font-bold mt-1">{d.employeeEmail}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-semibold">Số điện thoại</p>
                            <p className="text-lg text-gray-800 font-bold mt-1">{d.employeePhoneNumber}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin đại lý</h3>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-500 font-semibold">Tên đại lý</p>
                            <p className="text-lg text-gray-800 font-bold mt-1">{d.agencyName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-semibold">Địa chỉ</p>
                            <p className="text-lg text-gray-800 font-bold mt-1">{d.agencyAddress}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-semibold">Trạng thái</p>
                            <span
                                className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                    d.status
                                )}`}
                            >
                                {getStatusLabel(d.status)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ghi chú */}
            <div className="bg-white rounded-2xl shadow-md p-6 max-w-4xl mx-auto w-full">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Ghi chú</h3>
                <p className="text-gray-700">{d.note || "Không có ghi chú"}</p>
            </div>

            {/* Chi tiết xe */}
            {d.importRequestDetails && d.importRequestDetails.length > 0 && (
                <div className="bg-white rounded-2xl shadow-md p-6 max-w-4xl mx-auto w-full">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Chi tiết xe ({d.importRequestDetails.length})
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Loại xe</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Version</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Màu sắc</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Cấu hình</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Tính năng</th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Số lượng</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {d.importRequestDetails.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-gray-700 text-sm">{item.vehicleTypeName}</td>
                                        <td className="px-4 py-3 text-gray-700 text-sm">{item.version}</td>
                                        <td className="px-4 py-3 text-gray-700 text-sm">{item.color}</td>
                                        <td className="px-4 py-3 text-gray-700 text-sm">{item.configuration}</td>
                                        <td className="px-4 py-3 text-gray-700 text-sm">{item.features}</td>
                                        <td className="px-4 py-3 text-gray-700 text-sm text-right font-bold">
                                            {item.quantity}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Status Change Modal */}
            {showStatusModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={(e) => e.target === e.currentTarget && setShowStatusModal(false)}
                >
                    <div
                        className="bg-white rounded-xl p-6 w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold mb-4">Thay đổi trạng thái</h3>
                        <p className="text-gray-600 mb-6">
                            Trạng thái hiện tại: <span className="font-bold">{getStatusLabel(d.status)}</span>
                        </p>

                        <div className="space-y-2 mb-6">
                            {["APPROVED", "REJECTED"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setSelectedStatus(status)}
                                    className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-all ${selectedStatus === status
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {status === "APPROVED" && "✓ Duyệt"}
                                    {status === "REJECTED" && "✕ Từ chối"}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => {
                                    if (selectedStatus) {
                                        handleStatusChange(selectedStatus);
                                    }
                                }}
                                disabled={!selectedStatus || updating}
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {updating ? "Đang cập nhật..." : "Xác nhận"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
