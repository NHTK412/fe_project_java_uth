import { useState, useEffect } from "react";
import { X, Trash2, Loader } from "lucide-react";
import { showSuccess, showError } from "../shared/toast";
import agencyOrderApi from "../../services/api/order/agencyOrderApi.jsx";

const AgencyOrderDetailModal = ({ isOpen, onClose, orderId, onOrderCanceled }) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && orderId) {
            fetchOrderDetail();
        }
    }, [isOpen, orderId]);

    const fetchOrderDetail = async () => {
        setLoading(true);
        try {
            const res = await agencyOrderApi.getOrderById(orderId);
            if (res.success && res.data) {
                setOrder(res.data);
            } else {
                showError(res.message || "Không thể tải chi tiết đơn hàng");
            }
        } catch (err) {
            console.error(err);
            showError(err.response?.data?.message || "Lỗi tải chi tiết đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!window.confirm("Bạn chắc chắn muốn hủy đơn hàng này?")) return;

        try {
            const res = await agencyOrderApi.cancelOrder(order.orderId);
            if (res.success) {
                showSuccess("Hủy đơn hàng thành công!");
                onOrderCanceled();
                onClose();
            } else {
                showError(res.message || "Lỗi hủy đơn hàng");
            }
        } catch (err) {
            console.error(err);
            showError(err.response?.data?.message || "Lỗi hủy đơn hàng từ server");
        }
    };

    if (!isOpen) return null;

    const getStatusBadge = (status) => {
        const statusMap = {
            PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Chờ xử lý" },
            APPROVED: { bg: "bg-blue-100", text: "text-blue-800", label: "Đã duyệt" },
            CONFIRMED: { bg: "bg-green-100", text: "text-green-800", label: "Đã xác nhận" },
            CANCELLED: { bg: "bg-red-100", text: "text-red-800", label: "Đã hủy" },
            COMPLETED: { bg: "bg-green-100", text: "text-green-800", label: "Hoàn thành" },
        };
        return statusMap[status] || { bg: "bg-gray-100", text: "text-gray-800", label: status };
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-md">
                    <div className="flex flex-col items-center">
                        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                        <p className="mt-3 text-gray-600">Đang tải chi tiết đơn hàng...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) return null;

    const statusInfo = getStatusBadge(order.status);

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Đơn hàng #{order.orderId}</h2>
                        <p className="text-gray-500 mt-1">Mã hợp đồng: {order.contractNumber}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Agency Info - Delivery Destination */}
                    {order.agencyName && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h3 className="font-bold text-gray-900 mb-3">Thông tin đại lý nhận hàng</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Tên đại lý</p>
                                    <p className="font-semibold">{order.agencyName}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Số điện thoại</p>
                                    <p className="font-semibold">{order.agencyPhone || "Chưa cập nhật"}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-gray-500">Địa chỉ giao hàng</p>
                                    <p className="font-semibold">{order.agencyAddress || "Chưa cập nhật"}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Status & Employee Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-gray-900 mb-3">Trạng thái & Ghi chú</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-gray-500 text-sm">Trạng thái</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}>
                                        {statusInfo.label}
                                    </span>
                                </div>
                                {order.notes && (
                                    <div>
                                        <p className="text-gray-500 text-sm">Ghi chú</p>
                                        <p className="font-semibold text-sm">{order.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-gray-900 mb-3">Nhân viên phụ trách</h3>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <p className="text-gray-500">Tên</p>
                                    <p className="font-semibold">{order.employeeName}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">SĐT</p>
                                    <p className="font-semibold">{order.employeePhoneNumber || "Chưa cập nhật"}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Email</p>
                                    <p className="font-semibold text-xs">{order.employeeEmail || "Chưa cập nhật"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details Table */}
                    {order.orderDetailResponseDTOs && order.orderDetailResponseDTOs.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-gray-900 mb-3">Chi tiết đơn hàng ({order.orderDetailResponseDTOs.length})</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-2 font-semibold text-gray-700">Loại xe</th>
                                            <th className="text-left py-2 px-2 font-semibold text-gray-700">Phiên bản</th>
                                            <th className="text-left py-2 px-2 font-semibold text-gray-700">Màu sắc</th>
                                            <th className="text-left py-2 px-2 font-semibold text-gray-700">Cấu hình</th>
                                            <th className="text-left py-2 px-2 font-semibold text-gray-700">Tính năng</th>
                                            <th className="text-center py-2 px-2 font-semibold text-gray-700">SL</th>
                                            <th className="text-right py-2 px-2 font-semibold text-gray-700">Giá bán sỉ</th>
                                            <th className="text-right py-2 px-2 font-semibold text-gray-700">Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.orderDetailResponseDTOs.map((detail, idx) => (
                                            <tr key={idx} className="border-b hover:bg-white transition-colors">
                                                <td className="py-3 px-2 text-gray-700 font-medium">{detail.vehicleTypeName}</td>
                                                <td className="py-3 px-2 text-gray-600">{detail.vehicleVersion}</td>
                                                <td className="py-3 px-2 text-gray-600">{detail.vehicleColor}</td>
                                                <td className="py-3 px-2 text-gray-600 text-xs">
                                                    {detail.vehicleConfiguration || '-'}
                                                </td>
                                                <td className="py-3 px-2 text-gray-600 text-xs max-w-[150px] truncate" title={detail.vehicleFeatures}>
                                                    {detail.vehicleFeatures || '-'}
                                                </td>
                                                <td className="py-3 px-2 text-center text-gray-700">{detail.quantity}</td>
                                                <td className="py-3 px-2 text-right text-gray-700">{detail.wholesalePrice?.toLocaleString("vi-VN")} VNĐ</td>
                                                <td className="py-3 px-2 text-right font-semibold text-blue-600">{detail.totalAmount?.toLocaleString("vi-VN")} VNĐ</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-blue-50 font-bold">
                                            <td colSpan="7" className="py-3 px-2 text-right">Tổng cộng:</td>
                                            <td className="py-3 px-2 text-right text-blue-600">{order.totalAmount?.toLocaleString("vi-VN")} VNĐ</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Payment Info */}
                    {order.paymentResponseDTOs && order.paymentResponseDTOs.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-gray-900 mb-3">Thông tin thanh toán ({order.paymentResponseDTOs.length})</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-2 font-semibold text-gray-700">Phương thức</th>
                                            <th className="text-right py-2 px-2 font-semibold text-gray-700">Số tiền</th>
                                            <th className="text-center py-2 px-2 font-semibold text-gray-700">Kỳ</th>
                                            <th className="text-center py-2 px-2 font-semibold text-gray-700">Ngày đến hạn</th>
                                            <th className="text-center py-2 px-2 font-semibold text-gray-700">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.paymentResponseDTOs.map((payment, idx) => (
                                            <tr key={idx} className="border-b hover:bg-white transition-colors">
                                                <td className="py-3 px-2 text-gray-700">{payment.paymentMethod === 'CASH' ? 'Tiền mặt' : 'Chuyển khoản'}</td>
                                                <td className="py-3 px-2 text-right font-semibold">{payment.amount?.toLocaleString("vi-VN")} VNĐ</td>
                                                <td className="py-3 px-2 text-center text-gray-700">{payment.numberCycle || '-'}</td>
                                                <td className="py-3 px-2 text-center text-gray-600">{payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('vi-VN') : '-'}</td>
                                                <td className="py-3 px-2 text-center">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${payment.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {payment.status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Delivery Info */}
                    {order.vehicleDeliveryResponseDTO && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-gray-900 mb-3">Thông tin giao xe</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Trạng thái</p>
                                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${order.vehicleDeliveryResponseDTO.status === 'PREPARING' ? 'bg-yellow-100 text-yellow-800' :
                                            order.vehicleDeliveryResponseDTO.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {order.vehicleDeliveryResponseDTO.status === 'PREPARING' ? 'Đang chuẩn bị' : 'Đã giao'}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-gray-500">Nhân viên giao xe</p>
                                    <p className="font-semibold">{order.vehicleDeliveryResponseDTO.employeeName || 'Chưa phân công'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Ngày dự kiến giao</p>
                                    <p className="font-semibold">{order.vehicleDeliveryResponseDTO.expectedDeliveryDate ? new Date(order.vehicleDeliveryResponseDTO.expectedDeliveryDate).toLocaleDateString('vi-VN') : 'Chưa xác định'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Ngày giao thực tế</p>
                                    <p className="font-semibold">{order.vehicleDeliveryResponseDTO.deliveryDate ? new Date(order.vehicleDeliveryResponseDTO.deliveryDate).toLocaleDateString('vi-VN') : 'Chưa giao'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Người nhận</p>
                                    <p className="font-semibold">{order.vehicleDeliveryResponseDTO.name || 'Chưa cập nhật'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">SĐT người nhận</p>
                                    <p className="font-semibold">{order.vehicleDeliveryResponseDTO.phoneNumber || 'Chưa cập nhật'}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-gray-500">Địa chỉ giao xe</p>
                                    <p className="font-semibold">{order.vehicleDeliveryResponseDTO.address || 'Chưa cập nhật'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-white border-t border-gray-200 p-6 flex justify-between gap-3 sticky bottom-0">
                    <button
                        onClick={handleCancelOrder}
                        disabled={order.status === "CANCELLED"}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Trash2 className="w-4 h-4" />
                        Hủy đơn hàng
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgencyOrderDetailModal;
