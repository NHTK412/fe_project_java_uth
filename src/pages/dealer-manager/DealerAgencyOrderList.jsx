import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Loader } from "lucide-react";
import { getOrdersByAgency } from "../../services/api/orderService";

const DealerAgencyOrderList = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    // NOTE: Gọi API để lấy danh sách các đơn hàng của đại lý
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getOrdersByAgency(page, size);
                setOrders(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message || "Có lỗi khi tải dữ liệu");
                console.error("Lỗi tải danh sách đơn hàng:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [page, size]);

    // NOTE: Lọc danh sách theo từ khóa tìm kiếm
    const filteredOrders = orders.filter(
        (order) =>
            order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.contractNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // NOTE: Map trạng thái thành màu sắc và label
    const getStatusBadge = (status) => {
        const statusMap = {
            PENDING: {
                label: "Chờ thanh toán",
                bgColor: "bg-yellow-100",
                textColor: "text-yellow-800",
            },
            PAID: {
                label: "Đã thanh toán",
                bgColor: "bg-purple-100",
                textColor: "text-purple-800",
            },
            PENDING_DELIVERY: {
                label: "Chờ giao hàng",
                bgColor: "bg-blue-100",
                textColor: "text-blue-800",
            },
            DELIVERED: {
                label: "Đã giao hàng",
                bgColor: "bg-green-100",
                textColor: "text-green-800",
            },
        };

        const config = statusMap[status] || {
            label: status,
            bgColor: "bg-gray-100",
            textColor: "text-gray-800",
        };

        return (
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.textColor} whitespace-nowrap`}>
                {config.label}
            </span>
        );
    };

    // NOTE: Format tiền tệ
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);
    };

    return (
        <div className="space-y-6">
            {/* NOTE: Header với tiêu đề và nút tạo mới */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Đơn hàng của đại lý</h1>
                <button
                    onClick={() => navigate("/dealerManager/order/create")}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Tạo đơn mới
                </button>
            </div>

            {/* NOTE: Ô tìm kiếm */}
            <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Tìm kiếm theo khách hàng, số hợp đồng, nhân viên hoặc ghi chú..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* NOTE: Hiển thị trạng thái loading */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                    <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
                </div>
            )}

            {/* NOTE: Hiển thị lỗi nếu có */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <p className="font-semibold">Lỗi:</p>
                    <p>{error}</p>
                </div>
            )}

            {/* NOTE: Bảng danh sách các đơn hàng */}
            {!loading && !error && (
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full min-w-max">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                                    ID
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                                    Khách hàng
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                                    Số hợp đồng
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                                    Nhân viên
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-900 whitespace-nowrap">
                                    Tổng tiền
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                                    Trạng thái
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                                    Ghi chú
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr
                                        key={order.orderId}
                                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-xs text-gray-900 whitespace-nowrap font-medium">
                                            #{order.orderId}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-900 whitespace-nowrap">
                                            {order.customerName || "-"}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-900 whitespace-nowrap">
                                            {order.contractNumber || "-"}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-900 whitespace-nowrap">
                                            {order.employeeName || "-"}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-900 whitespace-nowrap text-right font-medium">
                                            {formatCurrency(order.totalAmount)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-600 max-w-xs">
                                            <span className="line-clamp-2">{order.notes || "-"}</span>
                                        </td>
                                        <td className="px-4 py-3 text-xs whitespace-nowrap">
                                            <button
                                                onClick={() =>
                                                    navigate(`/dealerManager/order/${order.orderId}`)
                                                }
                                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-xs font-medium"
                                            >
                                                Chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                        {searchTerm
                                            ? "Không tìm thấy kết quả phù hợp"
                                            : "Không có đơn hàng nào"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* NOTE: Phân trang */}
            {!loading && filteredOrders.length > 0 && (
                <div className="flex justify-between items-center mt-4">
                    <button
                        disabled={page <= 1}
                        onClick={() => setPage(Math.max(1, page - 1))}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Trang trước
                    </button>
                    <span className="text-gray-600">
                        Trang {page} - Hiển thị {filteredOrders.length} kết quả
                    </span>
                    <button
                        disabled={filteredOrders.length < size}
                        onClick={() => setPage(page + 1)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Trang sau
                    </button>
                </div>
            )}
        </div>
    );
};

export default DealerAgencyOrderList;
