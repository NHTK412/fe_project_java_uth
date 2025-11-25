import { useState, useEffect } from 'react';
import { X, Loader, ShoppingCart } from 'lucide-react';
import { showError, showSuccess } from './toast';
import { createOrderFromQuote, updateQuoteStatus } from '../../services/api/quoteService';

const ConvertQuoteToOrderModal = ({ quote, isOpen, onClose, onOrderCreated }) => {
    const [loading, setLoading] = useState(false);
    const [paymentPlans, setPaymentPlans] = useState([]);
    const [formData, setFormData] = useState({
        customerId: '',
        quoteId: '',
        notes: '',
        paymentType: 'FULL_PAYMENT',
        paymentPlanId: 0
    });

    useEffect(() => {
        if (quote && isOpen) {
            setFormData({
                customerId: quote.customerId || '',
                quoteId: quote.quoteId || '',
                notes: '',
                paymentType: 'FULL_PAYMENT',
                paymentPlanId: 0
            });
            // TODO: Load payment plans if needed
            // fetchPaymentPlans();
        }
    }, [quote, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.customerId) {
            showError('Vui lòng nhập ID khách hàng');
            return;
        }

        if (formData.paymentType === 'INSTALLMENT' && !formData.paymentPlanId) {
            showError('Vui lòng chọn gói trả góp');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                customerId: Number(formData.customerId),
                quoteId: Number(formData.quoteId),
                notes: formData.notes || '',
                paymentType: formData.paymentType,
                paymentPlanId: formData.paymentType === 'INSTALLMENT' ? Number(formData.paymentPlanId) : 0
            };

            console.log('Step 1: Updating quote status to ORDERED...');
            // Bước 1: Cập nhật trạng thái báo giá thành ORDERED
            await updateQuoteStatus(formData.quoteId, 'ORDERED');

            console.log('Step 2: Creating order from quote...');
            // Bước 2: Tạo đơn hàng từ báo giá
            const orderResponse = await createOrderFromQuote(payload);

            console.log('Order created successfully:', orderResponse);
            showSuccess('Chuyển báo giá thành đơn hàng thành công!');
            onOrderCreated?.();
        } catch (error) {
            console.error('Error converting quote to order:', error);
            showError(error.message || 'Lỗi khi chuyển báo giá thành đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !quote) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-green-600 to-green-700">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5" />
                            Chuyển thành đơn hàng
                        </h2>
                        <p className="text-sm text-green-100 mt-1">Báo giá #{quote.quoteId}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-green-800 rounded-lg p-2 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="px-6 py-4 space-y-4">
                        {/* Customer Info - Display only */}
                        <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Thông tin khách hàng</p>
                            <div className="space-y-1 text-sm">
                                <p className="text-gray-900"><span className="font-medium">Tên:</span> {quote.customerName}</p>
                                <p className="text-gray-900"><span className="font-medium">ID:</span> {quote.customerId}</p>
                            </div>
                        </div>

                        {/* Payment Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hình thức thanh toán <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="paymentType"
                                value={formData.paymentType}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            >
                                <option value="FULL_PAYMENT">Thanh toán đủ</option>
                                <option value="INSTALLMENT">Trả góp</option>
                            </select>
                        </div>

                        {/* Payment Plan ID - Only show if INSTALLMENT */}
                        {formData.paymentType === 'INSTALLMENT' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gói trả góp <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="paymentPlanId"
                                    value={formData.paymentPlanId || ''}
                                    onChange={handleChange}
                                    placeholder="Nhập ID gói trả góp (ví dụ: 1, 2, 3...)"
                                    min="1"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    💡 Nhập ID của gói trả góp mà bạn muốn áp dụng
                                </p>
                            </div>
                        )}

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ghi chú
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Nhập ghi chú (tùy chọn)"
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        {/* Warning */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                            <div className="flex-shrink-0">
                                <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-amber-800">Lưu ý</p>
                                <p className="text-sm text-amber-700 mt-1">
                                    Sau khi chuyển thành đơn hàng, báo giá sẽ chuyển sang trạng thái "Đã đặt hàng" và không thể chỉnh sửa.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading && <Loader className="w-4 h-4 animate-spin" />}
                            {loading ? 'Đang xử lý...' : 'Tạo đơn hàng'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConvertQuoteToOrderModal;
