import { useState, useEffect } from "react";
import { X, Loader, AlertCircle, Calendar, Percent, TrendingUp, Package } from "lucide-react";
import policyApi from "../../services/api/policyApi";

const PolicyDetailModal = ({ isOpen, onClose, policyId }) => {
    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && policyId) {
            fetchPolicyDetail();
        }
    }, [isOpen, policyId]);

    const fetchPolicyDetail = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await policyApi.getPolicyById(policyId);
            if (res.success) {
                setPolicy(res.data);
            } else {
                setError(res.message || "Không thể tải chi tiết chính sách");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Lỗi khi tải dữ liệu");
            console.error("Error fetching policy detail:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const getPolicyTypeLabel = (type) => {
        return type === 'QUANTITY' ? 'Theo số lượng' : 'Theo doanh số';
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            ACTIVE: { bg: "bg-green-100", text: "text-green-800", label: "Đang hoạt động" },
            NOT_ACTIVE: { bg: "bg-gray-100", text: "text-gray-800", label: "Không hoạt động" },
        };
        return statusMap[status] || { bg: "bg-gray-100", text: "text-gray-800", label: status };
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-gray-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Chi tiết chính sách chiết khấu</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-blue-800 rounded-lg p-2 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                            <p className="mt-4 text-gray-600">Đang tải chi tiết chính sách...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-red-800 font-medium">Lỗi</p>
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        </div>
                    ) : policy ? (
                        <div className="space-y-6">
                            {/* Thông tin cơ bản */}
                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                <h3 className="font-semibold text-gray-900 text-lg mb-3">Thông tin cơ bản</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Mã chính sách</label>
                                        <p className="text-gray-900 font-medium">#{policy.policyId}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Trạng thái</label>
                                        <div className="mt-1">
                                            {(() => {
                                                const statusInfo = getStatusBadge(policy.status);
                                                return (
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}>
                                                        {statusInfo.label}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                            <Package className="w-4 h-4" />
                                            Loại chính sách
                                        </label>
                                        <p className="text-gray-900 font-medium">{getPolicyTypeLabel(policy.policyType)}</p>
                                    </div>

                                    {policy.agencyId && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Đại lý áp dụng</label>
                                            <p className="text-gray-900 font-medium">Đại lý #{policy.agencyId}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Ngày bắt đầu
                                        </label>
                                        <p className="text-gray-900">{new Date(policy.startDate).toLocaleDateString('vi-VN')}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Ngày kết thúc
                                        </label>
                                        <p className="text-gray-900">{new Date(policy.endDate).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Các mức chiết khấu theo số lượng */}
                            {policy.policyType === 'QUANTITY' && policy.quantityDiscountLevels && policy.quantityDiscountLevels.length > 0 && (
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 text-lg mb-3 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-blue-600" />
                                        Các mức chiết khấu theo số lượng
                                    </h3>
                                    <div className="space-y-3">
                                        {policy.quantityDiscountLevels.map((level, index) => (
                                            <div key={level.quantityDiscountLevelId || index} className="bg-white rounded-lg p-3 border border-blue-200">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                                                            {index + 1}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600">Số lượng từ</p>
                                                            <p className="font-semibold text-gray-900">
                                                                {level.quantityFrom} - {level.quantityTo === 999999999 ? '∞' : level.quantityTo} đơn vị
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-600">Chiết khấu</p>
                                                        <p className="font-bold text-green-600 text-lg flex items-center gap-1">
                                                            <Percent className="w-4 h-4" />
                                                            {level.discountPercentage}%
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Các mức chiết khấu theo doanh số */}
                            {policy.policyType === 'SALES' && policy.salesDiscountLevels && policy.salesDiscountLevels.length > 0 && (
                                <div className="bg-green-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 text-lg mb-3 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                        Các mức chiết khấu theo doanh số
                                    </h3>
                                    <div className="space-y-3">
                                        {policy.salesDiscountLevels.map((level, index) => (
                                            <div key={level.salesDiscountLevelId || index} className="bg-white rounded-lg p-3 border border-green-200">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                                                            {index + 1}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600">Doanh số từ</p>
                                                            <p className="font-semibold text-gray-900">
                                                                {level.salesFrom?.toLocaleString('vi-VN')} - {level.salesTo === 999999999999 ? '∞' : level.salesTo?.toLocaleString('vi-VN')} VNĐ
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-600">Chiết khấu</p>
                                                        <p className="font-bold text-green-600 text-lg flex items-center gap-1">
                                                            <Percent className="w-4 h-4" />
                                                            {level.discountPercentage}%
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PolicyDetailModal;
