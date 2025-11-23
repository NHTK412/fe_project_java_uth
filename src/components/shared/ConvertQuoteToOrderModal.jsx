import { useState } from 'react';
import { toast } from 'react-toastify';
import { createOrderFromQuote } from '../../services/api/quoteService';

const ConvertQuoteToOrderModal = ({ quoteId, isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        quoteId: quoteId || '',
        notes: '',
        employeeId: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.employeeId) {
            toast.warning('Vui lòng chọn nhân viên');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                quoteId: Number(formData.quoteId),
                notes: formData.notes,
                employeeId: Number(formData.employeeId)
            };

            console.log('Converting quote to order with data:', payload);
            const result = await createOrderFromQuote(payload);

            toast.success('Chuyển báo giá thành đơn hàng thành công!');
            onSuccess(result);
            onClose();
        } catch (error) {
            console.error('Error converting quote to order:', error);
            toast.error(error.message || 'Lỗi khi chuyển báo giá thành đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900">Chuyển sang Đơn hàng</h2>
                    <p className="text-sm text-gray-600 mt-1">Báo giá #{quoteId}</p>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                    {/* Quote ID - readonly */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mã Báo giá
                        </label>
                        <input
                            type="text"
                            value={`#${formData.quoteId}`}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                        />
                    </div>

                    {/* Employee ID */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ID Nhân viên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="employeeId"
                            value={formData.employeeId}
                            onChange={handleChange}
                            placeholder="Nhập ID nhân viên"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
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
                            {loading ? 'Đang xử lý...' : 'Chuyển sang Đơn hàng'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConvertQuoteToOrderModal;
