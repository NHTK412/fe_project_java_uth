import { useEffect, useState, useCallback } from 'react';
import paymentApi from '../../services/api/paymentApi';
import { toast } from 'react-toastify';
import PaymentDetailModal from '../../components/shared/PaymentDetailModal';
import UpdatePaymentStatusModal from '../../components/shared/UpdatePaymentStatusModal';
import { Search, Eye, Edit, CreditCard, CheckCircle, XCircle, DollarSign, Calendar, Phone } from 'lucide-react';

const PaymentManagement = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [customerPhone, setCustomerPhone] = useState('');
    const [searchPhone, setSearchPhone] = useState('');
    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const paymentMethodMap = {
        'CASH': { label: 'Tiền mặt', color: 'bg-green-100 text-green-800', icon: DollarSign },
        'VNPAY': { label: 'VNPay', color: 'bg-blue-100 text-blue-800', icon: CreditCard }
    };

    const statusMap = {
        'PAID': { label: 'Đã thanh toán', color: 'bg-green-100 text-green-800', icon: CheckCircle },
        'UNPAID': { label: 'Chưa thanh toán', color: 'bg-red-100 text-red-800', icon: XCircle }
    };

    const loadPayments = useCallback(async () => {
        if (!searchPhone || searchPhone.trim() === '') {
            setPayments([]);
            return;
        }

        setLoading(true);
        try {
            const response = await paymentApi.getPaymentsByCustomerPhone(searchPhone, page, size);
            console.log('=== Payments Response ===', response);

            if (response.success && response.data) {
                setPayments(response.data);
            } else {
                setPayments([]);
                toast.info('Không tìm thấy thanh toán nào');
            }
        } catch (error) {
            console.error('Error loading payments:', error);
            toast.error('Không thể tải danh sách thanh toán');
            setPayments([]);
        } finally {
            setLoading(false);
        }
    }, [searchPhone, page, size]);

    const handleSearch = () => {
        setSearchPhone(customerPhone);
        setPage(1);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        if (searchPhone) {
            loadPayments();
        }
    }, [searchPhone, page, loadPayments]);

    const handleViewDetail = (payment) => {
        setSelectedPayment(payment);
        setIsDetailModalOpen(true);
    };

    const handleUpdateStatus = (payment) => {
        setSelectedPayment(payment);
        setIsUpdateModalOpen(true);
    };

    const handleDetailModalClose = () => {
        setIsDetailModalOpen(false);
        setSelectedPayment(null);
    };

    const handleUpdateModalClose = () => {
        setIsUpdateModalOpen(false);
        setSelectedPayment(null);
    };

    const handleUpdateSuccess = () => {
        setIsUpdateModalOpen(false);
        setSelectedPayment(null);
        loadPayments();
    };

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
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Quản lý thanh toán</h1>
                <p className="text-gray-600 mt-1">Quản lý các khoản thanh toán của khách hàng</p>
            </div>

            {/* Search Box */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="flex gap-3">
                    <div className="flex-1">
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Nhập số điện thoại khách hàng..."
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleSearch}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                        <Search size={20} />
                        Tìm kiếm
                    </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    💡 Nhập số điện thoại khách hàng để tìm kiếm các khoản thanh toán
                </p>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : payments.length === 0 ? (
                    <div className="text-center py-12">
                        <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">
                            {searchPhone ? 'Không tìm thấy thanh toán' : 'Chưa tìm kiếm'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchPhone ? 'Không có thanh toán nào cho số điện thoại này.' : 'Nhập số điện thoại khách hàng để tìm kiếm.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mã thanh toán
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Phương thức
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Số tiền
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kỳ hạn
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Hạn thanh toán
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {payments.map((payment) => {
                                    const methodInfo = paymentMethodMap[payment.paymentMethod] || {};
                                    const statusInfo = statusMap[payment.status] || {};
                                    const MethodIcon = methodInfo.icon || CreditCard;
                                    const StatusIcon = statusInfo.icon || XCircle;

                                    return (
                                        <tr key={payment.paymentId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    #{payment.paymentId}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${methodInfo.color}`}>
                                                    <MethodIcon size={14} />
                                                    {methodInfo.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {formatCurrency(payment.amount)}
                                                </div>
                                                {payment.penaltyAmount > 0 && (
                                                    <div className="text-xs text-red-600">
                                                        +{formatCurrency(payment.penaltyAmount)} phạt
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    Kỳ {payment.numberCycle}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {formatDateTime(payment.dueDate)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                                    <StatusIcon size={14} />
                                                    {statusInfo.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleViewDetail(payment)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    {payment.status === 'UNPAID' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(payment)}
                                                            className="text-green-600 hover:text-green-900"
                                                            title="Cập nhật trạng thái"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {payments.length > 0 && (
                <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-700">
                        Hiển thị {payments.length} kết quả
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Trước
                        </button>
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={payments.length < size}
                            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            )}

            {/* Modals */}
            {isDetailModalOpen && selectedPayment && (
                <PaymentDetailModal
                    payment={selectedPayment}
                    onClose={handleDetailModalClose}
                />
            )}

            {isUpdateModalOpen && selectedPayment && (
                <UpdatePaymentStatusModal
                    payment={selectedPayment}
                    onClose={handleUpdateModalClose}
                    onSuccess={handleUpdateSuccess}
                />
            )}
        </div>
    );
};

export default PaymentManagement;
