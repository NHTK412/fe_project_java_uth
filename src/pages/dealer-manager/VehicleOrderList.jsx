import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Loader } from "lucide-react";
import { toast } from "react-toastify";

const VehicleOrderList = () => {
    const navigate = useNavigate();
    const [vehicleOrders, setVehicleOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    // NOTE: Gọi API để lấy danh sách các đơn đặt xe từ hãng
    useEffect(() => {
        const fetchVehicleOrders = async () => {
            try {
                setLoading(true);
                setError(null);

                // TODO: Replace với API call thực tế
                // const data = await getVehicleOrders(page, size);

                // Mock data tạm thời
                const mockData = [
                    {
                        vehicleOrderId: 1,
                        vehicleOrderCode: "VO-2024-001",
                        status: "REQUESTED",
                        createdAt: "2024-11-20T10:00:00Z",
                        vehicleTypeName: "Honda City",
                        quantity: 5,
                        totalAmount: 2500000000,
                        note: "Đơn đặt xe từ hãng"
                    },
                    {
                        vehicleOrderId: 2,
                        vehicleOrderCode: "VO-2024-002",
                        status: "APPROVED",
                        createdAt: "2024-11-19T14:30:00Z",
                        vehicleTypeName: "Honda Accord",
                        quantity: 3,
                        totalAmount: 2400000000,
                        note: "Ghi chú chi tiết"
                    }
                ];

                setVehicleOrders(Array.isArray(mockData) ? mockData : []);
            } catch (err) {
                setError(err.message || "Có lỗi khi tải dữ liệu");
                console.error("Lỗi tải danh sách đơn đặt xe:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicleOrders();
    }, [page, size]);

    // NOTE: Lọc danh sách theo từ khóa tìm kiếm
    const filteredOrders = vehicleOrders.filter(
        (order) =>
            order.vehicleOrderCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.vehicleTypeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.note?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // NOTE: Map trạng thái thành màu sắc và label
    const getStatusBadge = (status) => {
        const statusMap = {
            REQUESTED: {
                label: "Đã Yêu Cầu",
                bgColor: "bg-blue-100",
                textColor: "text-blue-800",
            },
            APPROVED: {
                label: "Đã Duyệt",
                bgColor: "bg-green-100",
                textColor: "text-green-800",
            },
            REJECTED: {
                label: "Đã Từ Chối",
                bgColor: "bg-red-100",
                textColor: "text-red-800",
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
        if (!value) return "0 ₫";
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);
    };

    return (
        <div className="space-y-6">
            {/* NOTE: Header với tiêu đề và nút tạo mới */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Đặt xe từ hãng</h1>
                <button
                    onClick={() => navigate("/dealerManager/vehicle-order/create")}
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
                    placeholder="Tìm kiếm theo mã đơn, loại xe hoặc ghi chú..."
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

            {/* NOTE: Bảng danh sách các đơn đặt xe */}
            {!loading && !error && (
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full min-w-max">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                                    Mã đơn
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                                    Loại xe
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                                    Số lượng
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                                    Tổng tiền
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                                    Trạng thái
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                                    Ghi chú
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                                    Ngày tạo
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
                                        key={order.vehicleOrderId}
                                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-xs text-gray-900 whitespace-nowrap font-medium">
                                            {order.vehicleOrderCode}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-900 whitespace-nowrap">
                                            {order.vehicleTypeName || "-"}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-900 whitespace-nowrap">
                                            {order.quantity} chiếc
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-900 whitespace-nowrap font-semibold text-green-600">
                                            {formatCurrency(order.totalAmount)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-600 max-w-xs">
                                            <span className="line-clamp-2">{order.note || "-"}</span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                                            {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                                        </td>
                                        <td className="px-4 py-3 text-xs whitespace-nowrap">
                                            <button
                                                onClick={() =>
                                                    navigate(`/dealerManager/vehicle-order/${order.vehicleOrderId}`)
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
                                            : "Không có đơn đặt xe nào"}
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

export default VehicleOrderList;
