import { useState } from "react";
import { X, Loader, CheckCircle, XCircle, Clock, ShoppingCart } from "lucide-react";
import { updateQuoteStatus } from "../../services/api/quoteService";
import { showError, showSuccess } from "../shared/toast";

const UpdateQuoteStatusModal = ({ isOpen, onClose, quote, onStatusUpdated }) => {
    const [loading, setLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(quote?.status || "CREATE");

    const statusOptions = [
        {
            value: "CREATE",
            label: "Tạo mới",
            icon: Clock,
            color: "blue",
            description: "Báo giá mới được tạo"
        },
        {
            value: "PROCESSING",
            label: "Đang xử lý",
            icon: Clock,
            color: "yellow",
            description: "Báo giá đang được xem xét"
        },
        {
            value: "REJECTED",
            label: "Bị từ chối",
            icon: XCircle,
            color: "red",
            description: "Báo giá đã bị từ chối"
        },
        {
            value: "ORDERED",
            label: "Đã đặt hàng",
            icon: ShoppingCart,
            color: "green",
            description: "Đã chuyển thành đơn hàng"
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedStatus === quote.status) {
            showError("Vui lòng chọn trạng thái khác với trạng thái hiện tại");
            return;
        }

        try {
            setLoading(true);
            await updateQuoteStatus(quote.quoteId, selectedStatus);
            showSuccess("Cập nhật trạng thái báo giá thành công");
            onStatusUpdated?.();
            onClose();
        } catch (err) {
            showError(err.message || "Không thể cập nhật trạng thái báo giá");
            console.error("Error updating quote status:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !quote) return null;

    const colorMap = {
        blue: {
            bg: "bg-blue-50",
            border: "border-blue-200",
            text: "text-blue-700",
            ring: "ring-blue-500"
        },
        yellow: {
            bg: "bg-yellow-50",
            border: "border-yellow-200",
            text: "text-yellow-700",
            ring: "ring-yellow-500"
        },
        red: {
            bg: "bg-red-50",
            border: "border-red-200",
            text: "text-red-700",
            ring: "ring-red-500"
        },
        green: {
            bg: "bg-green-50",
            border: "border-green-200",
            text: "text-green-700",
            ring: "ring-green-500"
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Cập nhật trạng thái</h2>
                        <p className="text-sm text-gray-600 mt-1">Báo giá #{quote.quoteId}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Body */}
                    <div className="p-6 space-y-6">
                        {/* Current Status */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-2">Trạng thái hiện tại:</p>
                            <div className="flex items-center gap-2">
                                {(() => {
                                    const current = statusOptions.find(s => s.value === quote.status);
                                    const Icon = current?.icon;
                                    const colors = colorMap[current?.color];
                                    return (
                                        <>
                                            {Icon && <Icon className={`w-5 h-5 ${colors.text}`} />}
                                            <span className={`font-semibold ${colors.text}`}>{current?.label}</span>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* New Status Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Chọn trạng thái mới <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {statusOptions.map((option) => {
                                    const Icon = option.icon;
                                    const colors = colorMap[option.color];
                                    const isSelected = selectedStatus === option.value;
                                    const isCurrent = quote.status === option.value;

                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setSelectedStatus(option.value)}
                                            disabled={isCurrent}
                                            className={`
                        relative p-4 rounded-lg border-2 text-left transition-all
                        ${isCurrent
                                                    ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200'
                                                    : isSelected
                                                        ? `${colors.bg} ${colors.border} ring-2 ${colors.ring}`
                                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                }
                      `}
                                        >
                                            <div className="flex items-start gap-3">
                                                <Icon className={`w-5 h-5 mt-0.5 ${isSelected ? colors.text : 'text-gray-400'}`} />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className={`font-semibold ${isSelected ? colors.text : 'text-gray-900'}`}>
                                                            {option.label}
                                                        </p>
                                                        {isCurrent && (
                                                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                                                                Hiện tại
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-600 mt-1">{option.description}</p>
                                                </div>
                                                {isSelected && !isCurrent && (
                                                    <CheckCircle className={`w-5 h-5 ${colors.text}`} />
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Warning Message */}
                        {selectedStatus !== quote.status && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                                <div className="flex-shrink-0">
                                    <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-amber-800">Lưu ý</p>
                                    <p className="text-sm text-amber-700 mt-1">
                                        Thao tác này sẽ thay đổi trạng thái của báo giá. Vui lòng kiểm tra kỹ trước khi xác nhận.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading || selectedStatus === quote.status}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading && <Loader className="w-4 h-4 animate-spin" />}
                            {loading ? "Đang cập nhật..." : "Xác nhận cập nhật"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateQuoteStatusModal;
