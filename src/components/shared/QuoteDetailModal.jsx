import { useState, useEffect } from "react";
import { X, Loader, AlertCircle, User, Phone, Mail, Briefcase, Package, DollarSign, ChevronDown, ChevronUp, ShoppingCart } from "lucide-react";
import { getQuoteById } from "../../services/api/quoteService";
import ConvertQuoteToOrderModal from "./ConvertQuoteToOrderModal";

const QuoteDetailModal = ({ isOpen, onClose, quoteId, onOrderCreated }) => {
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedDetails, setExpandedDetails] = useState({});
    const [showConvertModal, setShowConvertModal] = useState(false);

    useEffect(() => {
        if (isOpen && quoteId) {
            fetchQuoteDetail();
        }
    }, [isOpen, quoteId]);

    const fetchQuoteDetail = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getQuoteById(quoteId);
            setQuote(data);
            // Auto expand all details
            const expanded = {};
            data.quotationDetails?.forEach((detail, index) => {
                expanded[index] = true;
            });
            setExpandedDetails(expanded);
        } catch (err) {
            setError(err.message || "Lỗi khi tải chi tiết báo giá");
            console.error("Error fetching quote detail:", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleDetail = (index) => {
        setExpandedDetails(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value || 0);
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            CREATE: { label: "Tạo mới", color: "blue" },
            PROCESSING: { label: "Đang xử lý", color: "yellow" },
            REJECTED: { label: "Bị từ chối", color: "red" },
            ORDERED: { label: "Đã đặt hàng", color: "green" },
        };
        const statusInfo = statusMap[status] || { label: status, color: "gray" };
        const colorMap = {
            yellow: "bg-yellow-100 text-yellow-800",
            green: "bg-green-100 text-green-800",
            red: "bg-red-100 text-red-800",
            blue: "bg-blue-100 text-blue-800",
            gray: "bg-gray-100 text-gray-800",
        };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorMap[statusInfo.color]}`}>
                {statusInfo.label}
            </span>
        );
    };

    const handleConvertToOrder = () => {
        setShowConvertModal(true);
    };

    const handleOrderCreatedSuccess = () => {
        setShowConvertModal(false);
        onOrderCreated?.();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden relative z-10 border border-gray-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white">Chi tiết báo giá</h2>
                        {quote && (
                            <p className="text-blue-100 text-sm mt-1">Mã báo giá: #{quote.quoteId}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-blue-800 rounded-lg p-2 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                            <p className="mt-4 text-gray-600">Đang tải chi tiết báo giá...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-red-800 font-medium">Lỗi</p>
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        </div>
                    ) : quote ? (
                        <div className="space-y-6">
                            {/* General Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Customer Info */}
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 text-lg mb-3 flex items-center gap-2">
                                        <User className="w-5 h-5 text-blue-600" />
                                        Thông tin khách hàng
                                    </h3>
                                    <div className="space-y-2">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Tên khách hàng</label>
                                            <p className="text-gray-900">{quote.customerName || "-"}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                                <Phone className="w-4 h-4" />
                                                Số điện thoại
                                            </label>
                                            <p className="text-gray-900">{quote.customerPhone || "-"}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                                <Mail className="w-4 h-4" />
                                                Email
                                            </label>
                                            <p className="text-gray-900">{quote.customerEmail || "-"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Employee Info */}
                                <div className="bg-green-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 text-lg mb-3 flex items-center gap-2">
                                        <Briefcase className="w-5 h-5 text-green-600" />
                                        Thông tin nhân viên
                                    </h3>
                                    <div className="space-y-2">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Tên nhân viên</label>
                                            <p className="text-gray-900">{quote.employeeName || "-"}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                                <Phone className="w-4 h-4" />
                                                Số điện thoại
                                            </label>
                                            <p className="text-gray-900">{quote.employeePhoneNumber || "-"}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                                <Mail className="w-4 h-4" />
                                                Email
                                            </label>
                                            <p className="text-gray-900">{quote.employeeEmail || "-"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status and Total */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Trạng thái</label>
                                        <div className="mt-1">{getStatusBadge(quote.status)}</div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                            <DollarSign className="w-4 h-4" />
                                            Tổng tiền
                                        </label>
                                        <p className="text-2xl font-bold text-green-600 mt-1">
                                            {formatCurrency(quote.totalAmount)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quotation Details */}
                            <div>
                                <h3 className="font-semibold text-gray-900 text-lg mb-3 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-blue-600" />
                                    Chi tiết báo giá
                                </h3>
                                <div className="space-y-4">
                                    {quote.quotationDetails?.map((detail, index) => (
                                        <div key={detail.quotationDetailId} className="border border-gray-200 rounded-lg overflow-hidden">
                                            {/* Vehicle Info Header */}
                                            <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">
                                                            {detail.vehicleTypeName} - {detail.vehicleVersion}
                                                        </h4>
                                                        <p className="text-sm text-gray-600">
                                                            Màu: {detail.vehicleColor} | Số lượng: {detail.quantity}
                                                        </p>
                                                        {detail.vehicleConfiguration && (
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Cấu hình: {detail.vehicleConfiguration}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-blue-600">
                                                            {formatCurrency(detail.totalAmount)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Detail Info */}
                                            <div className="p-4 bg-white">
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                                                    <div>
                                                        <label className="text-gray-600">Giá xe</label>
                                                        <p className="font-medium text-gray-900">{formatCurrency(detail.vehiclePrice)}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-gray-600">Giá sỉ</label>
                                                        <p className="font-medium text-gray-900">{formatCurrency(detail.wholesalePrice)}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-gray-600">Chiết khấu (%)</label>
                                                        <p className="font-medium text-gray-900">{detail.discountPercentage}%</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-gray-600">Chiết khấu</label>
                                                        <p className="font-medium text-gray-900">{formatCurrency(detail.discount)}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-gray-600">Thuế trước bạ</label>
                                                        <p className="font-medium text-gray-900">{formatCurrency(detail.registrationTax)}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-gray-600">Phí biển số</label>
                                                        <p className="font-medium text-gray-900">{formatCurrency(detail.licensePlateFee)}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-gray-600">Phí đăng ký</label>
                                                        <p className="font-medium text-gray-900">{formatCurrency(detail.registrartionFee)}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-gray-600">BH bắt buộc</label>
                                                        <p className="font-medium text-gray-900">{formatCurrency(detail.compulsoryInsurance)}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-gray-600">BH vật chất</label>
                                                        <p className="font-medium text-gray-900">{formatCurrency(detail.materialInsurance)}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-gray-600">Phí bảo trì đường</label>
                                                        <p className="font-medium text-gray-900">{formatCurrency(detail.roadMaintenanceMees)}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-gray-600">Phí dịch vụ ĐK</label>
                                                        <p className="font-medium text-gray-900">
                                                            {formatCurrency(detail.vehicleRegistrationServiceFee)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                    <div>
                        {quote && quote.status !== 'ORDERED' && quote.status !== 'REJECTED' && (
                            <button
                                onClick={handleConvertToOrder}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Chuyển thành đơn hàng
                            </button>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                        Đóng
                    </button>
                </div>

                {/* Convert to Order Modal */}
                {showConvertModal && quote && (
                    <ConvertQuoteToOrderModal
                        quote={quote}
                        isOpen={showConvertModal}
                        onClose={() => setShowConvertModal(false)}
                        onOrderCreated={handleOrderCreatedSuccess}
                    />
                )}
            </div>
        </div>
    );
};

export default QuoteDetailModal;
