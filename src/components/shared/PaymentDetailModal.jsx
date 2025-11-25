import { X, CreditCard, DollarSign, Calendar, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const PaymentDetailModal = ({ payment, onClose }) => {
    const paymentMethodMap = {
        'CASH': { label: 'Tiền mặt', color: 'bg-green-100 text-green-800', icon: DollarSign },
        'VNPAY': { label: 'VNPay', color: 'bg-blue-100 text-blue-800', icon: CreditCard }
    };

    const statusMap = {
        'PAID': { label: 'Đã thanh toán', color: 'bg-green-100 text-green-800', icon: CheckCircle },
        'UNPAID': { label: 'Chưa thanh toán', color: 'bg-red-100 text-red-800', icon: XCircle }
    };

    const methodInfo = paymentMethodMap[payment.paymentMethod] || {};
    const statusInfo = statusMap[payment.status] || {};
    const MethodIcon = methodInfo.icon || CreditCard;
    const StatusIcon = statusInfo.icon || XCircle;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Chi tiết thanh toán
                        </h2>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusInfo.color}`}>
                            <StatusIcon className="w-4 h-4" />
                            {statusInfo.label}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Payment Information */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                            Thông tin thanh toán
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Mã thanh toán</p>
                                <p className="font-semibold text-gray-900">#{payment.paymentId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Phương thức thanh toán</p>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${methodInfo.color}`}>
                                    <MethodIcon size={14} />
                                    {methodInfo.label}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Số tiền</p>
                                <p className="font-semibold text-gray-900 text-lg">
                                    {formatCurrency(payment.amount)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Kỳ hạn</p>
                                <p className="font-semibold text-gray-900">Kỳ {payment.numberCycle}</p>
                            </div>
                            {payment.penaltyAmount > 0 && (
                                <div className="md:col-span-2">
                                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                                        <AlertTriangle className="w-4 h-4 text-red-500" />
                                        Tiền phạt
                                    </p>
                                    <p className="font-semibold text-red-600 text-lg">
                                        {formatCurrency(payment.penaltyAmount)}
                                    </p>
                                </div>
                            )}
                            {payment.vnpayCode && (
                                <div className="md:col-span-2">
                                    <p className="text-sm text-gray-600 mb-1">Mã VNPay</p>
                                    <p className="font-semibold text-gray-900 font-mono">{payment.vnpayCode}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Date Information */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-purple-600" />
                            Thông tin ngày tháng
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Hạn thanh toán</p>
                                <p className="font-semibold text-gray-900">
                                    {formatDateTime(payment.dueDate)}
                                </p>
                            </div>
                            {payment.paymentDate && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Ngày thanh toán</p>
                                    <p className="font-semibold text-gray-900">
                                        {formatDateTime(payment.paymentDate)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Information */}
                    <div className={`border rounded-lg p-4 ${payment.status === 'PAID' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <StatusIcon className={`w-5 h-5 ${payment.status === 'PAID' ? 'text-green-600' : 'text-red-600'}`} />
                            Trạng thái
                        </h3>
                        <div>
                            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${statusInfo.color}`}>
                                <StatusIcon size={16} />
                                {statusInfo.label}
                            </span>
                            {payment.status === 'UNPAID' && (
                                <p className="text-sm text-gray-600 mt-2">
                                    Khoản thanh toán này chưa được hoàn tất.
                                </p>
                            )}
                            {payment.status === 'PAID' && payment.paymentDate && (
                                <p className="text-sm text-gray-600 mt-2">
                                    Đã thanh toán vào {formatDateTime(payment.paymentDate)}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Total Amount */}
                    {payment.penaltyAmount > 0 && (
                        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                                <span className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(payment.amount + payment.penaltyAmount)}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                                (Bao gồm tiền phạt {formatCurrency(payment.penaltyAmount)})
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentDetailModal;
