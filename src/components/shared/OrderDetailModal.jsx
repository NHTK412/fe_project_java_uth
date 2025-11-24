import { useEffect, useState } from 'react';
import agencyOrderApi from '../../services/api/order/agencyOrderApi';
import { toast } from 'react-toastify';

const OrderDetailModal = ({ orderId, onClose }) => {
    const [orderDetail, setOrderDetail] = useState(null);
    const [loading, setLoading] = useState(false);

    const paymentMethodMap = {
        'CASH': 'Tiền mặt',
        'BANK_TRANSFER': 'Chuyển khoản',
        'INSTALLMENT': 'Trả góp',
        'VNPAY': 'VNPay'
    };

    const paymentStatusMap = {
        'PAID': { label: 'Đã thanh toán', color: 'bg-green-100 text-green-800' },
        'PENDING': { label: 'Chờ thanh toán', color: 'bg-yellow-100 text-yellow-800' },
        'OVERDUE': { label: 'Quá hạn', color: 'bg-red-100 text-red-800' },
        'CANCELLED': { label: 'Đã hủy', color: 'bg-gray-100 text-gray-800' }
    };

    const deliveryStatusMap = {
        'PREPARING': { label: 'Đang chuẩn bị', color: 'bg-yellow-100 text-yellow-800' },
        'IN_TRANSIT': { label: 'Đang vận chuyển', color: 'bg-blue-100 text-blue-800' },
        'DELIVERED': { label: 'Đã giao hàng', color: 'bg-green-100 text-green-800' },
        'CANCELLED': { label: 'Đã hủy', color: 'bg-red-100 text-red-800' }
    };

    useEffect(() => {
        const loadOrderDetail = async () => {
            setLoading(true);
            try {
                const response = await agencyOrderApi.getOrderById(orderId);
                console.log('=== Order Detail Response ===', response);

                if (response.success && response.data) {
                    setOrderDetail(response.data);
                } else {
                    toast.error('Không thể tải thông tin chi tiết đơn hàng');
                }
            } catch (error) {
                console.error('Error loading order detail:', error);
                toast.error('Không thể tải thông tin chi tiết đơn hàng');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            loadOrderDetail();
        }
    }, [orderId]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-center mt-4 text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (!orderDetail) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Chi tiết đơn hàng #{orderDetail.orderId}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Thông tin cơ bản */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Thông tin đơn hàng */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold text-lg mb-4 text-gray-900">Thông tin đơn hàng</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Mã đơn hàng:</span>
                                    <span className="font-medium">#{orderDetail.orderId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Số hợp đồng:</span>
                                    <span className="font-medium">{orderDetail.contractNumber || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Trạng thái:</span>
                                    <span className="font-medium">{orderDetail.status}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tổng tiền:</span>
                                    <span className="font-bold text-blue-600">{formatCurrency(orderDetail.totalAmount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Ghi chú:</span>
                                    <span className="font-medium text-right max-w-xs">{orderDetail.notes || '-'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Thông tin khách hàng */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold text-lg mb-4 text-gray-900">Thông tin khách hàng</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Họ tên:</span>
                                    <span className="font-medium">{orderDetail.customerName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Email:</span>
                                    <span className="font-medium">{orderDetail.customerEmail || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Số điện thoại:</span>
                                    <span className="font-medium">{orderDetail.customerPhoneNumber || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Địa chỉ:</span>
                                    <span className="font-medium text-right max-w-xs">{orderDetail.customerAddress || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Thông tin nhân viên */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold text-lg mb-4 text-gray-900">Nhân viên phụ trách</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Họ tên:</span>
                                    <span className="font-medium">{orderDetail.employeeName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Email:</span>
                                    <span className="font-medium">{orderDetail.employeeEmail || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Số điện thoại:</span>
                                    <span className="font-medium">{orderDetail.employeePhoneNumber || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Thông tin đại lý */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold text-lg mb-4 text-gray-900">Thông tin đại lý</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tên đại lý:</span>
                                    <span className="font-medium">{orderDetail.agencyName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Địa chỉ:</span>
                                    <span className="font-medium text-right max-w-xs">{orderDetail.agencyAddress || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Số điện thoại:</span>
                                    <span className="font-medium">{orderDetail.agencyPhone || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chi tiết sản phẩm */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <h3 className="font-semibold text-lg px-4 py-3 bg-gray-100 text-gray-900">Chi tiết sản phẩm</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Xe</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Phiên bản</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Màu sắc</th>
                                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Số lượng</th>
                                        <th className="px-4 py-3 text-right font-semibold text-gray-700">Giá bán lẻ</th>
                                        <th className="px-4 py-3 text-right font-semibold text-gray-700">Giá sỉ</th>
                                        <th className="px-4 py-3 text-right font-semibold text-gray-700">Giảm giá</th>
                                        <th className="px-4 py-3 text-right font-semibold text-gray-700">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {orderDetail.orderDetailResponseDTOs?.map((detail, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900">
                                                {detail.vehicleTypeName}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">{detail.vehicleVersion || 'N/A'}</td>
                                            <td className="px-4 py-3 text-gray-600">{detail.vehicleColor || 'N/A'}</td>
                                            <td className="px-4 py-3 text-center font-medium">{detail.quantity}</td>
                                            <td className="px-4 py-3 text-right">{formatCurrency(detail.vehiclePrice)}</td>
                                            <td className="px-4 py-3 text-right">{formatCurrency(detail.wholesalePrice)}</td>
                                            <td className="px-4 py-3 text-right text-green-600">
                                                {detail.discountPercentage}% ({formatCurrency(detail.discount)})
                                            </td>
                                            <td className="px-4 py-3 text-right font-semibold text-blue-600">
                                                {formatCurrency(detail.totalAmount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50 border-t border-gray-200">
                                    <tr>
                                        <td colSpan="7" className="px-4 py-3 text-right font-semibold text-gray-900">
                                            Tổng cộng:
                                        </td>
                                        <td className="px-4 py-3 text-right font-bold text-blue-600 text-lg">
                                            {formatCurrency(orderDetail.totalAmount)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Thông tin thanh toán */}
                    {orderDetail.paymentResponseDTOs && orderDetail.paymentResponseDTOs.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <h3 className="font-semibold text-lg px-4 py-3 bg-gray-100 text-gray-900">Thông tin thanh toán</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Phương thức</th>
                                            <th className="px-4 py-3 text-right font-semibold text-gray-700">Số tiền</th>
                                            <th className="px-4 py-3 text-center font-semibold text-gray-700">Kỳ thanh toán</th>
                                            <th className="px-4 py-3 text-center font-semibold text-gray-700">Hạn thanh toán</th>
                                            <th className="px-4 py-3 text-center font-semibold text-gray-700">Ngày thanh toán</th>
                                            <th className="px-4 py-3 text-right font-semibold text-gray-700">Phí phạt</th>
                                            <th className="px-4 py-3 text-center font-semibold text-gray-700">Trạng thái</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Mã VNPay</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {orderDetail.paymentResponseDTOs.map((payment, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium text-gray-900">
                                                    {paymentMethodMap[payment.paymentMethod] || payment.paymentMethod}
                                                </td>
                                                <td className="px-4 py-3 text-right font-semibold">
                                                    {formatCurrency(payment.amount)}
                                                </td>
                                                <td className="px-4 py-3 text-center">{payment.numberCycle || 'N/A'}</td>
                                                <td className="px-4 py-3 text-center">{formatDate(payment.dueDate)}</td>
                                                <td className="px-4 py-3 text-center">{formatDate(payment.paymentDate)}</td>
                                                <td className="px-4 py-3 text-right text-red-600">
                                                    {formatCurrency(payment.penaltyAmount)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded ${paymentStatusMap[payment.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                                                        {paymentStatusMap[payment.status]?.label || payment.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">{payment.vnpayCode || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Thông tin giao hàng */}
                    {orderDetail.vehicleDeliveryResponseDTO && (
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h3 className="font-semibold text-lg mb-4 text-gray-900">Thông tin giao hàng</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Trạng thái:</span>
                                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded ${deliveryStatusMap[orderDetail.vehicleDeliveryResponseDTO.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                                            {deliveryStatusMap[orderDetail.vehicleDeliveryResponseDTO.status]?.label || orderDetail.vehicleDeliveryResponseDTO.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Ngày giao dự kiến:</span>
                                        <span className="font-medium">{formatDate(orderDetail.vehicleDeliveryResponseDTO.expectedDeliveryDate)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Ngày giao thực tế:</span>
                                        <span className="font-medium">{formatDate(orderDetail.vehicleDeliveryResponseDTO.deliveryDate)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Người nhận:</span>
                                        <span className="font-medium">{orderDetail.vehicleDeliveryResponseDTO.name || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Nhân viên giao hàng:</span>
                                        <span className="font-medium">{orderDetail.vehicleDeliveryResponseDTO.employeeName || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">SĐT nhân viên:</span>
                                        <span className="font-medium">{orderDetail.vehicleDeliveryResponseDTO.employeePhoneNumber || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">SĐT người nhận:</span>
                                        <span className="font-medium">{orderDetail.vehicleDeliveryResponseDTO.phoneNumber || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Địa chỉ giao hàng:</span>
                                        <span className="font-medium text-right max-w-xs">{orderDetail.vehicleDeliveryResponseDTO.address || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
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

export default OrderDetailModal;
