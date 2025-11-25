import { useEffect, useState, useCallback } from 'react';
import agencyOrderApi from '../../services/api/order/agencyOrderApi';
import { toast } from 'react-toastify';
import OrderDetailModal from '../../components/shared/OrderDetailModal';

const AgencyOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const orderStatusMap = {
        'PENDING': { label: 'Chờ thanh toán', color: 'yellow' },
        'PENDING_DELIVERY': { label: 'Chờ giao hàng', color: 'blue' },
        'DELIVERED': { label: 'Đã giao hàng', color: 'green' },
        'PAID': { label: 'Đã thanh toán', color: 'purple' },
        'INSTALLMENT': { label: 'Đang trả góp', color: 'orange' },
        'CANCELLED': { label: 'Đã hủy', color: 'red' }
    };

    // Lấy danh sách đơn hàng
    const loadOrders = useCallback(async (page, size) => {
        setLoading(true);
        try {
            const response = await agencyOrderApi.getAgencyOrders(page, size);
            console.log('=== Agency Orders Response ===', response);

            if (response.success && response.data) {
                setOrders(response.data);
                setTotalElements(response.data.length);
            } else {
                setOrders([]);
                setTotalElements(0);
            }
        } catch (error) {
            console.error('Error loading orders:', error);
            toast.error('Không thể tải danh sách đơn hàng');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadOrders(currentPage, pageSize);
    }, [currentPage, pageSize, loadOrders]);

    // Filter và search
    const filteredOrders = orders.filter(order => {
        const matchSearch = searchTerm === '' ||
            order.orderId.toString().includes(searchTerm) ||
            order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.contractNumber?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchStatus = filterStatus === '' || order.status === filterStatus;

        return matchSearch && matchStatus;
    });

    const handleViewDetail = (orderId) => {
        setSelectedOrderId(orderId);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetail = () => {
        setIsDetailModalOpen(false);
        setSelectedOrderId(null);
    };

    const totalPages = Math.ceil(totalElements / pageSize);

    const getStatusColor = (status) => {
        const statusInfo = orderStatusMap[status];
        const colorMap = {
            yellow: 'bg-yellow-100 text-yellow-800',
            blue: 'bg-blue-100 text-blue-800',
            green: 'bg-green-100 text-green-800',
            purple: 'bg-purple-100 text-purple-800',
            orange: 'bg-orange-100 text-orange-800',
            red: 'bg-red-100 text-red-800'
        };
        return colorMap[statusInfo?.color] || 'bg-gray-100 text-gray-800';
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value || 0);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
                <p className="text-gray-600 mt-1">Danh sách đơn hàng của đại lý</p>
            </div>

            {/* Search và Filter */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tìm kiếm (Mã, Hợp đồng, Khách hàng)
                        </label>
                        <input
                            type="text"
                            placeholder="Nhập từ khóa..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trạng thái
                        </label>
                        <select
                            value={filterStatus}
                            onChange={(e) => {
                                setFilterStatus(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Tất cả</option>
                            {Object.entries(orderStatusMap).map(([key, value]) => (
                                <option key={key} value={key}>{value.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số hàng/trang
                        </label>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Không có đơn hàng</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Mã Đơn</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Số hợp đồng</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Khách hàng</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Nhân viên</th>
                                    <th className="px-6 py-3 text-right font-semibold text-gray-700">Tổng tiền</th>
                                    <th className="px-6 py-3 text-center font-semibold text-gray-700">Trạng thái</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Ghi chú</th>
                                    <th className="px-6 py-3 text-center font-semibold text-gray-700">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-blue-600">
                                            #{order.orderId}
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">
                                            {order.contractNumber || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{order.customerName || 'N/A'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-600">{order.employeeName || 'N/A'}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-gray-900">
                                            {formatCurrency(order.totalAmount)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-block px-3 py-1 text-xs font-medium rounded ${getStatusColor(order.status)}`}>
                                                {orderStatusMap[order.status]?.label || order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                                            {order.notes || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleViewDetail(order.orderId)}
                                                className="text-blue-600 hover:text-blue-900 font-medium text-sm"
                                            >
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-gray-600">
                    Hiển thị {filteredOrders.length} / {totalElements} đơn hàng
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                        Trước
                    </button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-2 rounded-lg font-medium ${currentPage === i + 1
                                    ? 'bg-blue-600 text-white'
                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                        Sau
                    </button>
                </div>
            </div>

            {/* Order Detail Modal */}
            {isDetailModalOpen && selectedOrderId && (
                <OrderDetailModal
                    orderId={selectedOrderId}
                    onClose={handleCloseDetail}
                />
            )}
        </div>
    );
};

export default AgencyOrderList;
