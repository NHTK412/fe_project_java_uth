import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { showError, showSuccess } from "../shared/toast";

const ImportRequestDetailModal = ({ isOpen, importRequestId, onClose, onStatusChange }) => {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const BASE_URL = "http://localhost:8080/api";

    const fetchDetail = async () => {
        if (!importRequestId) return;

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${BASE_URL}/import-request/${importRequestId}`, {
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
        if (isOpen && importRequestId) {
            fetchDetail();
        }
    }, [isOpen, importRequestId]);

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
                if (onStatusChange) onStatusChange();
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

    if (!isOpen) return null;

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
                    <div className="flex justify-center">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!detail) return null;

    const d = detail;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Yêu cầu nhập hàng #{d.importRequestId}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-gray-900 mb-3">Thông tin nhân viên</h3>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <p className="text-gray-500">Tên</p>
                                    <p className="font-semibold">{d.employeeName}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Chức vụ</p>
                                    <p className="font-semibold">{d.employeePosition}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Email</p>
                                    <p className="font-semibold">{d.employeeEmail}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Điện thoại</p>
                                    <p className="font-semibold">{d.employeePhoneNumber}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-gray-900 mb-3">Thông tin đại lý</h3>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <p className="text-gray-500">Tên đại lý</p>
                                    <p className="font-semibold">{d.agencyName}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Địa chỉ</p>
                                    <p className="font-semibold">{d.agencyAddress}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Trạng thái</p>
                                    <span
                                        className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                            d.status
                                        )}`}
                                    >
                                        {getStatusLabel(d.status)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Note */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-bold text-gray-900 mb-2">Ghi chú</h3>
                        <p className="text-gray-700 text-sm">{d.note || "Không có ghi chú"}</p>
                    </div>

                    {/* Details Table */}
                    {d.importRequestDetails && d.importRequestDetails.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-gray-900 mb-3">
                                Chi tiết xe ({d.importRequestDetails.length})
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-2 font-semibold">Loại xe</th>
                                            <th className="text-left py-2 px-2 font-semibold">Version</th>
                                            <th className="text-left py-2 px-2 font-semibold">Màu</th>
                                            <th className="text-left py-2 px-2 font-semibold">SL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {d.importRequestDetails.map((item, idx) => (
                                            <tr key={idx} className="border-b">
                                                <td className="py-2 px-2">{item.vehicleTypeName}</td>
                                                <td className="py-2 px-2">{item.version}</td>
                                                <td className="py-2 px-2">{item.color}</td>
                                                <td className="py-2 px-2 font-bold">{item.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-medium"
                    >
                        Đóng
                    </button>
                    <button
                        onClick={() => setShowStatusModal(true)}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium"
                    >
                        Thay đổi trạng thái
                    </button>
                </div>

                {/* Status Change Modal */}
                {showStatusModal && (
                    <div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
                        onClick={(e) => e.target === e.currentTarget && setShowStatusModal(false)}
                    >
                        <div
                            className="bg-white rounded-xl p-6 w-full max-w-sm"
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
        </div>
    );
};

export default ImportRequestDetailModal;
