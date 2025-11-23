import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, updateOrderStatus, updateDeliveryStatus, formatCurrency, formatDate } from '../../services/api/orderService';
import { toast } from 'react-toastify';

const OrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showDeliveryModal, setShowDeliveryModal] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const orderStatusMap = {
        'PENDING': { label: 'Chờ thanh toán', color: 'yellow', nextStatus: 'PENDING_DELIVERY' },
        'PENDING_DELIVERY': { label: 'Chờ giao hàng', color: 'blue', nextStatus: 'DELIVERED' },
        'DELIVERED': { label: 'Đã giao hàng', color: 'green', nextStatus: null },
        'PAID': { label: 'Đã thanh toán', color: 'purple', nextStatus: null },
        'INSTALLMENT': { label: 'Đang trả góp', color: 'orange', nextStatus: null }
    };

    const deliveryStatusMap = {
        'PREPARING': { label: 'Chuẩn bị', color: 'gray' },
        'DELIVERING': { label: 'Đang giao', color: 'blue' },
        'DELIVERED': { label: 'Đã giao', color: 'green' },
        'CANCELED': { label: 'Đã hủy', color: 'red' }
    };

    const paymentStatusMap = {
        'PAID': { label: 'Đã thanh toán', color: 'green' },
        'UNPAID': { label: 'Chưa thanh toán', color: 'red' }
    };

    // Load order detail
    const loadOrder = async () => {
        setLoading(true);
        try {
            const response = await getOrderById(orderId);
            console.log('Order Detail Response:', response);

            // API returns { success: true, data: {...} }
            if (response && response.data) {
                setOrder(response.data);
            } else if (response) {
                setOrder(response);
            }
        } catch (error) {
            console.error('Error loading order:', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrder();
    }, [orderId]);

    const handleUpdateStatus = async () => {
        const nextStatus = orderStatusMap[order.status]?.nextStatus;
        if (!nextStatus) {
            toast.info('Đơn hàng đã ở trạng thái cuối cùng');
            return;
        }

        setUpdatingStatus(true);
        try {
            const response = await updateOrderStatus(orderId, nextStatus, order.contractNumber);
            if (response.success) {
                toast.success('Cập nhật trạng thái thành công');
                setOrder(response.data);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleUpdateDeliveryStatus = async (newStatus) => {
        setUpdatingStatus(true);
        try {
            const response = await updateDeliveryStatus(orderId, newStatus);
            if (response.success) {
                toast.success('Cập nhật trạng thái giao hàng thành công');
                setOrder(response.data);
                setShowDeliveryModal(false);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const getStatusColor = (status, map) => {
        const statusInfo = map[status];
        const colorMap = {
            yellow: 'bg-yellow-100 text-yellow-800',
            blue: 'bg-blue-100 text-blue-800',
            green: 'bg-green-100 text-green-800',
            purple: 'bg-purple-100 text-purple-800',
            orange: 'bg-orange-100 text-orange-800',
            gray: 'bg-gray-100 text-gray-800',
            red: 'bg-red-100 text-red-800'
        };
        return colorMap[statusInfo?.color] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-gray-500">Không tìm thấy đơn hàng</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <button
                        onClick={() => navigate('/admin/order')}
                        className="text-blue-600 hover:text-blue-900 font-medium mb-2"
                    >
                        ← Quay lại
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Đơn hàng #{order.orderId}</h1>
                </div>
                <span className={`inline-block px-4 py-2 text-lg font-medium rounded-lg ${getStatusColor(order.status, orderStatusMap)}`}>
                    {orderStatusMap[order.status]?.label || order.status}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* Thông tin chung */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin chung</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Ghi chú</p>
                                <p className="text-gray-900 font-medium">{order.notes || 'Không có'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Số hợp đồng</p>
                                <p className="text-gray-900 font-medium">{order.contractNumber || 'Chưa cập nhật'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Thông tin khách hàng */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin khách hàng</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Tên khách hàng</p>
                                <p className="text-gray-900 font-medium">{order.customerName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="text-gray-900 font-medium">{order.customerEmail}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Số điện thoại</p>
                                <p className="text-gray-900 font-medium">{order.customerPhoneNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Địa chỉ</p>
                                <p className="text-gray-900 font-medium">{order.customerAddress}</p>
                            </div>
                        </div>
                    </div>

                    {/* Thông tin nhân viên */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin nhân viên bán hàng</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Tên nhân viên</p>
                                <p className="text-gray-900 font-medium">{order.employeeName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="text-gray-900 font-medium">{order.employeeEmail}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Số điện thoại</p>
                                <p className="text-gray-900 font-medium">{order.employeePhoneNumber}</p>
                            </div>
                            {order.agencyName && (
                                <div>
                                    <p className="text-sm text-gray-600">Đại lý</p>
                                    <p className="text-gray-900 font-medium">{order.agencyName}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chi tiết đơn hàng */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Chi tiết sản phẩm</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Sản phẩm</th>
                                        <th className="px-4 py-3 text-left">Phiên bản</th>
                                        <th className="px-4 py-3 text-center">SL</th>
                                        <th className="px-4 py-3 text-right">Đơn giá</th>
                                        <th className="px-4 py-3 text-right">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {order.orderDetailResponseDTOs?.map((detail, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="font-medium text-gray-900">{detail.vehicleTypeName}</p>
                                                    <p className="text-xs text-gray-500">{detail.vehicleConfiguration}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-gray-900">{detail.vehicleVersion}</p>
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
                    </div>

                    {/* Thông tin thanh toán */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin thanh toán</h2>
                        <div className="space-y-3 mb-6">
                            {order.paymentResponseDTOs?.map((payment, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Kỳ {payment.numberCycle}
                                            {payment.numberCycle === 0 ? ' (Trả trước)' : ` (${formatDate(payment.dueDate)})`}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {payment.paymentMethod ? `Phương thức: ${payment.paymentMethod}` : ''}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
                                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded mt-1 ${getStatusColor(payment.status, paymentStatusMap)}`}>
                                            {paymentStatusMap[payment.status]?.label}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tổng cộng */}
                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Tổng cộng:</span>
                                <span className="text-2xl text-blue-600">{formatCurrency(order.totalAmount)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    {/* Giao hàng */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Giao hàng</h2>
                        {order.vehicleDeliveryResponseDTO ? (
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">Trạng thái</p>
                                    <span className={`inline-block px-3 py-1 text-sm font-medium rounded mt-1 ${getStatusColor(order.vehicleDeliveryResponseDTO.status, deliveryStatusMap)}`}>
                                        {deliveryStatusMap[order.vehicleDeliveryResponseDTO.status]?.label}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Người nhận</p>
                                    <p className="text-gray-900 font-medium">{order.vehicleDeliveryResponseDTO.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Địa chỉ giao</p>
                                    <p className="text-gray-900 font-medium">{order.vehicleDeliveryResponseDTO.address}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Số điện thoại</p>
                                    <p className="text-gray-900 font-medium">{order.vehicleDeliveryResponseDTO.phoneNumber}</p>
                                </div>
                                {order.vehicleDeliveryResponseDTO.deliveryDate && (
                                    <div>
                                        <p className="text-sm text-gray-600">Ngày giao</p>
                                        <p className="text-gray-900 font-medium">{formatDate(order.vehicleDeliveryResponseDTO.deliveryDate)}</p>
                                    </div>
                                )}
                                <button
                                    onClick={() => setShowDeliveryModal(true)}
                                    className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                                >
                                    Cập nhật trạng thái
                                </button>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">Chưa có thông tin giao hàng</p>
                        )}
                    </div>

                    {/* Hành động */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Hành động</h2>
                        <button
                            onClick={handleUpdateStatus}
                            disabled={updatingStatus || !orderStatusMap[order.status]?.nextStatus}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {updatingStatus ? 'Đang cập nhật...' : `Chuyển sang "${orderStatusMap[orderStatusMap[order.status]?.nextStatus]?.label || 'N/A'}"`}
                        </button>
                    </div>
                </div>
            </div>

            {/* Delivery Status Modal */}
            {showDeliveryModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Cập nhật trạng thái giao hàng</h2>
                        <div className="space-y-3 mb-6">
                            {Object.entries(deliveryStatusMap).map(([key, value]) => (
                                <button
                                    key={key}
                                    onClick={() => handleUpdateDeliveryStatus(key)}
                                    disabled={updatingStatus}
                                    className={`w-full px-4 py-2 rounded-lg font-medium text-left transition-colors ${order.vehicleDeliveryResponseDTO.status === key
                                        ? `bg-blue-600 text-white`
                                        : `border border-gray-300 text-gray-900 hover:bg-gray-50`
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {value.label}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowDeliveryModal(false)}
                            className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-50"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetail;
