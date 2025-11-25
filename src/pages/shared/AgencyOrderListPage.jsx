import { useState, useEffect } from "react";
import { Eye, Loader, AlertCircle, Plus, Trash2 } from "lucide-react";
import agencyOrderApi from "../../services/api/order/agencyOrderApi.jsx";
import AgencyOrderDetailModal from "../../components/shared/AgencyOrderDetailModal";
import CreateAgencyOrderModal from "../../components/shared/CreateAgencyOrderModal";
import { showError, showSuccess } from "../../components/shared/toast";

const AgencyOrderListPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Fetch orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await agencyOrderApi.getAgencyOrders(page, size);
                if (res.success) {
                    setOrders(res.data || []);
                } else {
                    setError(res.message || "Không thể tải danh sách đơn hàng");
                    setOrders([]);
                }
            } catch (err) {
                setError(err.message || "Lỗi khi tải dữ liệu");
                setOrders([]);
                console.error("Error fetching orders:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [page, size]);

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

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Đơn hàng của đại lý</h1>
                    <p className="text-gray-600 mt-1">Quản lý các đơn hàng được tạo cho các đại lý</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Tạo đơn hàng
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-red-800 font-medium">Lỗi</p>
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="flex flex-col items-center gap-3">
                            <Loader className="w-8 h-8 animate-spin text-blue-500" />
                            <p className="text-gray-600">Đang tải dữ liệu...</p>
                        </div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                        <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-gray-500">Không có đơn hàng nào</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Mã hợp đồng</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Nhân viên</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Khách hàng</th>
                                    <th className="px-6 py-3 text-right font-semibold text-gray-700">Tổng tiền</th>
                                    <th className="px-6 py-3 text-center font-semibold text-gray-700">Trạng thái</th>
                                    <th className="px-6 py-3 text-center font-semibold text-gray-700">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => {
                                    const statusInfo = getStatusBadge(order.status);
                                    return (
                                        <tr key={order.orderId} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{order.contractNumber}</td>
                                            <td className="px-6 py-4 text-gray-700">{order.employeeName}</td>
                                            <td className="px-6 py-4 text-gray-700">{order.customerName || "Chưa cập nhật"}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="font-semibold text-blue-600">{order.totalAmount?.toLocaleString("vi-VN")} VNĐ</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}>
                                                    {statusInfo.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => setSelectedOrderId(order.orderId)}
                                                        className="inline-flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        <span className="text-xs font-medium hidden sm:inline">Xem</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm("Bạn chắc chắn muốn hủy đơn hàng này?")) {
                                                                agencyOrderApi.cancelOrder(order.orderId)
                                                                    .then(res => {
                                                                        if (res.success) {
                                                                            showSuccess("Hủy đơn hàng thành công!");
                                                                            setPage(1);
                                                                        } else {
                                                                            showError(res.message || "Lỗi hủy đơn hàng");
                                                                        }
                                                                    })
                                                                    .catch(err => {
                                                                        showError(err.response?.data?.message || "Lỗi hủy đơn hàng từ server");
                                                                    });
                                                            }
                                                        }}
                                                        disabled={order.status === "CANCELLED"}
                                                        className="inline-flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Hủy đơn hàng"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        <span className="text-xs font-medium hidden sm:inline">Hủy</span>
                                                    </button>
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
            {orders.length > 0 && (
                <div className="flex justify-between items-center bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-600">
                        Trang <span className="font-semibold">{page}</span> | Kích thước: <span className="font-semibold">{size}</span> mục
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Trước
                        </button>
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={orders.length < size}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            <AgencyOrderDetailModal
                isOpen={!!selectedOrderId}
                onClose={() => setSelectedOrderId(null)}
                orderId={selectedOrderId}
                onOrderCanceled={() => {
                    setSelectedOrderId(null);
                    setPage(1); // Reload page
                }}
            />

            <CreateAgencyOrderModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onOrderCreated={() => {
                    setPage(1); // Reload page
                }}
            />
        </div>
    );
};

export default AgencyOrderListPage;
