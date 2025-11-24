import { useState } from 'react';
import paymentApi from '../../services/api/paymentApi';
import { toast } from 'react-toastify';
import { X, CreditCard, DollarSign } from 'lucide-react';

const UpdatePaymentStatusModal = ({ payment, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        paymentMethod: payment.paymentMethod || 'CASH',
        paymentType: 'FULL_PAYMENT',
        vnpayCode: payment.vnpayCode || ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.paymentMethod) {
            newErrors.paymentMethod = 'Vui lòng chọn phương thức thanh toán';
        }

        if (formData.paymentMethod === 'VNPAY' && !formData.vnpayCode) {
            newErrors.vnpayCode = 'Vui lòng nhập mã VNPay';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Vui lòng kiểm tra lại thông tin');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                paymentMethod: formData.paymentMethod,
                paymentType: formData.paymentType,
                ...(formData.paymentMethod === 'VNPAY' && { vnpayCode: formData.vnpayCode })
            };

            const response = await paymentApi.updatePaymentStatus(payment.paymentId, payload);

            if (response.success) {
                toast.success('Cập nhật trạng thái thanh toán thành công');
                onSuccess();
            } else {
                toast.error(response.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error updating payment status:', error);
            toast.error(error.response?.data?.message || 'Không thể cập nhật trạng thái thanh toán');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const totalAmount = payment.amount + (payment.penaltyAmount || 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Cập nhật trạng thái thanh toán
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Payment Info Summary */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Thông tin thanh toán</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-600">Mã thanh toán:</p>
                                <p className="font-semibold">#{payment.paymentId}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Kỳ hạn:</p>
                                <p className="font-semibold">Kỳ {payment.numberCycle}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Số tiền:</p>
                                <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                            </div>
                            {payment.penaltyAmount > 0 && (
                                <div>
                                    <p className="text-gray-600">Tiền phạt:</p>
                                    <p className="font-semibold text-red-600">{formatCurrency(payment.penaltyAmount)}</p>
                                </div>
                            )}
                        </div>
                        {payment.penaltyAmount > 0 && (
                            <div className="mt-3 pt-3 border-t border-blue-300">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-900">Tổng cộng:</span>
                                    <span className="text-lg font-bold text-gray-900">
                                        {formatCurrency(totalAmount)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phương thức thanh toán <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'CASH'
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="CASH"
                                    checked={formData.paymentMethod === 'CASH'}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-green-600"
                                />
                                <DollarSign className={formData.paymentMethod === 'CASH' ? 'text-green-600' : 'text-gray-400'} size={24} />
                                <span className="font-semibold">Tiền mặt</span>
                            </label>
                            <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'VNPAY'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="VNPAY"
                                    checked={formData.paymentMethod === 'VNPAY'}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <CreditCard className={formData.paymentMethod === 'VNPAY' ? 'text-blue-600' : 'text-gray-400'} size={24} />
                                <span className="font-semibold">VNPay</span>
                            </label>
                        </div>
                        {errors.paymentMethod && (
                            <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>
                        )}
                    </div>

                    {/* VNPay Code */}
                    {formData.paymentMethod === 'VNPAY' && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mã VNPay <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="vnpayCode"
                                value={formData.vnpayCode}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono ${errors.vnpayCode ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Nhập mã giao dịch VNPay"
                            />
                            {errors.vnpayCode && (
                                <p className="text-red-500 text-sm mt-1">{errors.vnpayCode}</p>
                            )}
                        </div>
                    )}

                    {/* Payment Type (Hidden - always FULL_PAYMENT) */}
                    <input type="hidden" name="paymentType" value="FULL_PAYMENT" />

                    {/* Note */}
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                            <span className="font-semibold">⚠️ Lưu ý:</span> Sau khi cập nhật, trạng thái thanh toán sẽ chuyển sang "Đã thanh toán" và không thể hoàn tác.
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Đang cập nhật...' : 'Xác nhận thanh toán'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdatePaymentStatusModal;
