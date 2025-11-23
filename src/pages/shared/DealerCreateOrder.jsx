import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrderFromQuote, formatCurrency } from '../../services/api/orderService';
import { getQuotes } from '../../services/api/quoteService';
import { toast } from 'react-toastify';

const DealerCreateOrder = ({ isDealerManager = false }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [quotes, setQuotes] = useState([]);
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [quoteDetails, setQuoteDetails] = useState([]);
    const [formData, setFormData] = useState({
        notes: '',
        paymentType: 'FULL_PAYMENT',
        paymentPlanId: null
    });
    const [paymentPlans, setPaymentPlans] = useState([]);

    const paymentTypeMap = {
        'FULL_PAYMENT': { label: 'Thanh toán toàn bộ', icon: '💰' },
        'INSTALLMENT': { label: 'Trả góp', icon: '📅' }
    };

    // Load quotes
    useEffect(() => {
        const loadQuotes = async () => {
            try {
                const response = await getQuotes(0, 100);
                if (response.success) {
                    // Filter chỉ lấy báo giá ở trạng thái "CREATE"
                    const createQuotes = (response.data.content || response.data || []).filter(q => q.status === 'CREATE');
                    setQuotes(createQuotes);
                }
            } catch (error) {
                toast.error('Lỗi lấy danh sách báo giá');
            }
        };
        loadQuotes();

        // Load payment plans (có thể từ API hoặc data cứng)
        setPaymentPlans([
            { id: 1, name: '6 tháng', months: 6, rate: 1.5 },
            { id: 2, name: '12 tháng', months: 12, rate: 1.2 },
            { id: 3, name: '24 tháng', months: 24, rate: 1.0 }
        ]);
    }, []);

    // Khi chọn báo giá
    const handleSelectQuote = (quote) => {
        setSelectedQuote(quote);
        setQuoteDetails(quote.quotationDetailResponseDTOs || []);
    };

    // Handle form change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'paymentPlanId' ? (value ? parseInt(value) : null) : value
        }));
    };

    // Submit tạo đơn hàng
    const handleCreateOrder = async () => {
        if (!selectedQuote) {
            toast.warning('Vui lòng chọn báo giá');
            return;
        }

        if (formData.paymentType === 'INSTALLMENT' && !formData.paymentPlanId) {
            toast.warning('Vui lòng chọn kế hoạch trả góp');
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                quoteId: selectedQuote.quoteId,
                notes: formData.notes,
                paymentType: formData.paymentType,
                paymentPlanId: formData.paymentPlanId || 0
            };

            const response = await createOrderFromQuote(orderData);
            if (response.success) {
                toast.success('Tạo đơn hàng thành công');
                const path = isDealerManager ? `/dealerManager/order/${response.data.orderId}` : `/dealer/order/${response.data.orderId}`;
                navigate(path);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getBackPath = () => {
        return isDealerManager ? '/dealerManager/order' : '/dealer/order';
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate(getBackPath())}
                    className="text-blue-600 hover:text-blue-900 font-medium mb-2"
                >
                    ← Quay lại
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Tạo Đơn hàng từ Báo giá</h1>
                <p className="text-gray-600 mt-1">Chọn báo giá và cấu hình thanh toán</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* Chọn báo giá */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Chọn Báo giá</h2>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {quotes.length === 0 ? (
                                <p className="text-gray-500 py-8 text-center">Không có báo giá nào</p>
                            ) : (
                                quotes.map(quote => (
                                    <div
                                        key={quote.quoteId}
                                        onClick={() => handleSelectQuote(quote)}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${selectedQuote?.quoteId === quote.quoteId
                                                ? 'border-blue-600 bg-blue-50'
                                                : 'border-gray-200 bg-white hover:border-blue-300'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    Báo giá #{quote.quoteId}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Khách: {quote.customerName}
                                                </p>
                                            </div>
                                            <span className="text-lg font-bold text-blue-600">
                                                {formatCurrency(quote.totalAmount)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Nhân viên: {quote.employeeName}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chi tiết báo giá đã chọn */}
                    {selectedQuote && (
                        <div className="bg-white rounded-lg shadow p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Chi tiết Báo giá</h2>

                            {/* Thông tin khách hàng */}
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <h3 className="font-semibold text-gray-900 mb-3">Thông tin khách hàng</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Tên khách hàng</p>
                                        <p className="text-gray-900 font-medium">{selectedQuote.customerName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="text-gray-900 font-medium">{selectedQuote.customerEmail}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Số điện thoại</p>
                                        <p className="text-gray-900 font-medium">{selectedQuote.customerPhoneNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Địa chỉ</p>
                                        <p className="text-gray-900 font-medium">{selectedQuote.customerAddress}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Danh sách sản phẩm */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm mb-6">
                                    <thead className="bg-gray-100 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Sản phẩm</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Phiên bản</th>
                                            <th className="px-4 py-3 text-center font-semibold text-gray-700">SL</th>
                                            <th className="px-4 py-3 text-right font-semibold text-gray-700">Đơn giá</th>
                                            <th className="px-4 py-3 text-right font-semibold text-gray-700">Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {quoteDetails.map((detail, idx) => (
                                            <tr key={idx}>
                                                <td className="px-4 py-3 text-gray-900">
                                                    {detail.vehicleTypeName}
                                                </td>
                                                <td className="px-4 py-3 text-gray-900">
                                                    {detail.version}
                                                </td>
                                                <td className="px-4 py-3 text-center text-gray-900">
                                                    {detail.quantity}
                                                </td>
                                                <td className="px-4 py-3 text-right text-gray-900">
                                                    {formatCurrency(detail.vehiclePrice)}
                                                </td>
                                                <td className="px-4 py-3 text-right font-semibold text-gray-900">
                                                    {formatCurrency(detail.vehiclePrice * detail.quantity)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Tổng cộng */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span>Tổng cộng:</span>
                                    <span className="text-2xl text-blue-600">{formatCurrency(selectedQuote.totalAmount)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar - Cấu hình thanh toán */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Cấu hình Thanh toán</h2>

                        {/* Ghi chú */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Nhập ghi chú..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Hình thức thanh toán */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Hình thức thanh toán</label>
                            <div className="space-y-2">
                                {Object.entries(paymentTypeMap).map(([key, value]) => (
                                    <label key={key} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="paymentType"
                                            value={key}
                                            checked={formData.paymentType === key}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="ml-3 text-gray-900 font-medium">
                                            {value.icon} {value.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Kế hoạch trả góp */}
                        {formData.paymentType === 'INSTALLMENT' && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kế hoạch trả góp
                                </label>
                                <select
                                    name="paymentPlanId"
                                    value={formData.paymentPlanId || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">-- Chọn kế hoạch --</option>
                                    {paymentPlans.map(plan => (
                                        <option key={plan.id} value={plan.id}>
                                            {plan.name} ({plan.rate}%/tháng)
                                        </option>
                                    ))}
                                </select>
                                {formData.paymentPlanId && (
                                    <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
                                        <p className="font-medium mb-2">Chi tiết kế hoạch:</p>
                                        <p>Lãi suất: {paymentPlans.find(p => p.id === formData.paymentPlanId)?.rate}%/tháng</p>
                                        <p>Số kỳ: {paymentPlans.find(p => p.id === formData.paymentPlanId)?.months} tháng</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Nút tạo đơn hàng */}
                        <button
                            onClick={handleCreateOrder}
                            disabled={loading || !selectedQuote}
                            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Đang tạo...' : 'Tạo Đơn hàng'}
                        </button>

                        {!selectedQuote && (
                            <p className="text-sm text-red-600 mt-3 text-center">
                                Vui lòng chọn báo giá trước
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DealerCreateOrder;
