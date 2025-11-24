import { useState } from "react";
import { X, AlertCircle } from "lucide-react";

const InventoryDetailModal = ({ isOpen, onClose, detail, vehicles, loading }) => {
    const getStatusBadge = (status) => {
        const statusMap = {
            IN_STOCK: { bg: "bg-green-100", text: "text-green-800", label: "Còn hàng" },
            SOLD: { bg: "bg-red-100", text: "text-red-800", label: "Đã bán" },
            RESERVED: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Đặt trước" },
            DAMAGED: { bg: "bg-gray-100", text: "text-gray-800", label: "Hỏng hóc" },
        };
        return statusMap[status] || { bg: "bg-gray-100", text: "text-gray-800", label: status };
    };

    if (!isOpen) return null;

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
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{detail?.vehicleTypeName}</h2>
                        <p className="text-gray-500 mt-1">{detail?.vehicleTypeDetailName}</p>
                    </div>
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
                            <h3 className="font-bold text-gray-900 mb-3">Thông tin loại xe</h3>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <p className="text-gray-500">Phiên bản</p>
                                    <p className="font-semibold">{detail?.version}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Màu sắc</p>
                                    <p className="font-semibold">{detail?.color}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Số lượng</p>
                                    <p className="font-semibold text-lg text-blue-600">{detail?.totalQuantity} xe</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-gray-900 mb-3">Tính năng</h3>
                            <div className="space-y-2 text-sm">
                                <p className="text-gray-700">{detail?.features || "Không có thông tin"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Vehicles List */}
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : vehicles && vehicles.length > 0 ? (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-gray-900 mb-3">
                                Danh sách xe ({vehicles.length} xe)
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-2 font-semibold text-gray-700">STT</th>
                                            <th className="text-left py-2 px-2 font-semibold text-gray-700">Số khung</th>
                                            <th className="text-left py-2 px-2 font-semibold text-gray-700">Số máy</th>
                                            <th className="text-left py-2 px-2 font-semibold text-gray-700">Trạng thái</th>
                                            <th className="text-left py-2 px-2 font-semibold text-gray-700">Điều kiện</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vehicles.map((vehicle, idx) => {
                                            const statusInfo = getStatusBadge(vehicle.status);
                                            return (
                                                <tr key={vehicle.id} className="border-b hover:bg-white transition-colors">
                                                    <td className="py-3 px-2 text-gray-700 font-medium">#{idx + 1}</td>
                                                    <td className="py-3 px-2 text-gray-700 font-mono">{vehicle.chassisNumber}</td>
                                                    <td className="py-3 px-2 text-gray-700 font-mono">{vehicle.machineNumber}</td>
                                                    <td className="py-3 px-2">
                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}>
                                                            {statusInfo.label}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-2 text-gray-700">{vehicle.vehicleCondition}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p className="text-gray-500 font-semibold">Không có xe nào cho loại này</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-white border-t border-gray-200 p-6 flex justify-end gap-3 sticky bottom-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InventoryDetailModal;
