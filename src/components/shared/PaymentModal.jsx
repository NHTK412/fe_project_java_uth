import { useState } from 'react';
import { toast } from 'react-toastify';
import { processPayment } from '../../services/api/orderService';

const PaymentModal = ({ orderId, isOpen, onClose, onSuccess }) => {
    const [paymentType, setPaymentType] = useState('FULL_PAYMENT');
    const [paymentPlanId, setPaymentPlanId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (paymentType === 'INSTALLMENT' && !paymentPlanId) {
            toast.warning('Vui lòng chọn kế hoạch thanh toán');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                paymentType,
                paymentPlanId: paymentType === 'INSTALLMENT' ? Number(paymentPlanId) : 0
            };

            console.log('Payment data:', payload);
            const result = await processPayment(orderId, payload);

            toast.success('Xử lý thanh toán thành công!');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error processing payment:', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900">Xử lý Thanh toán</h2>
                    <p className="text-sm text-gray-600 mt-1">Mã đơn hàng: #{orderId}</p>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                    {/* Loại thanh toán */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Loại thanh toán <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={paymentType}
                            onChange={(e) => {
                                setPaymentType(e.target.value);
                                setPaymentPlanId('');
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="FULL_PAYMENT">Thanh toán toàn bộ</option>
                            <option value="INSTALLMENT">Trả góp</option>
                        </select>
                    </div>

                    {/* Payment Plan ID - chỉ hiển thị khi chọn INSTALLMENT */}
                    {paymentType === 'INSTALLMENT' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ID Kế hoạch thanh toán <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={paymentPlanId}
                                onChange={(e) => setPaymentPlanId(e.target.value)}
                                placeholder="Nhập ID kế hoạch thanh toán"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required={paymentType === 'INSTALLMENT'}
                            />
                            <p className="text-xs text-gray-500 mt-1">Ví dụ: 1, 2, 3...</p>
                        </div>
                    )}

                    {/* Info */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-900">
                            {paymentType === 'FULL_PAYMENT'
                                ? '💳 Khách hàng sẽ thanh toán toàn bộ số tiền ngay'
                                : '📆 Khách hàng sẽ trả góp theo kế hoạch đã chọn'}
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 justify-end pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>}
                            {loading ? 'Đang xử lý...' : 'Xác nhận'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;