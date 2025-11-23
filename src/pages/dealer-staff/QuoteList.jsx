import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Loader, Edit2, Trash2, Eye } from "lucide-react";
import { getQuotes, deleteQuote, updateQuoteStatus } from "../../services/api/quoteService";
import { toast } from "react-toastify";

const QuoteList = () => {
    const navigate = useNavigate();
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState(""); // Lọc theo trạng thái
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);

    // NOTE: Gọi API để lấy danh sách báo giá
    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getQuotes(page, size);
                setQuotes(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message || "Có lỗi khi tải dữ liệu");
                toast.error(err.message || "Không thể tải danh sách báo giá");
                console.error("Lỗi tải danh sách báo giá:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuotes();
    }, [page, size]);

    // NOTE: Lọc danh sách theo từ khóa tìm kiếm
    const filteredQuotes = quotes.filter((quote) => {
        const matchSearch =
            quote.quoteId?.toString().includes(searchTerm) ||
            quote.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quote.employeeName?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchStatus = filterStatus === "" || quote.status === filterStatus;

        return matchSearch && matchStatus;
    });

    // NOTE: Map trạng thái thành màu sắc
    const getStatusBadge = (status) => {
        const statusMap = {
            CREATE: {
                label: "Tạo mới",
                bgColor: "bg-blue-100",
                textColor: "text-blue-800",
            },
            PROCESSING: {
                label: "Đang xử lý",
                bgColor: "bg-yellow-100",
                textColor: "text-yellow-800",
            },
            REJECTED: {
                label: "Bị từ chối",
                bgColor: "bg-red-100",
                textColor: "text-red-800",
            },
            ORDERED: {
                label: "Đã đặt hàng",
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

    // NOTE: Xử lý xóa báo giá
    const handleDelete = async (quoteId) => {
        if (window.confirm("Bạn chắc chắn muốn xóa báo giá này?")) {
            try {
                await deleteQuote(quoteId);
                setQuotes((prev) => prev.filter((q) => q.quoteId !== quoteId));
                toast.success("Xóa báo giá thành công");
            } catch (err) {
                toast.error(err.message || "Không thể xóa báo giá");
                console.error("Lỗi xóa báo giá:", err);
            }
        }
    };

    // NOTE: Xử lý cập nhật trạng thái
    const handleStatusChange = async (quoteId, newStatus) => {
        try {
            await updateQuoteStatus(quoteId, newStatus);
            setQuotes((prev) =>
                prev.map((q) =>
                    q.quoteId === quoteId ? { ...q, status: newStatus } : q
                )
            );
            toast.success("Cập nhật trạng thái thành công");
        } catch (err) {
            toast.error(err.message || "Không thể cập nhật trạng thái");
            console.error("Lỗi cập nhật trạng thái:", err);
        }
    };

    // NOTE: Format tiền tệ
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value || 0);
    };

    return (
        <div className="space-y-6">
            {/* NOTE: Header với tiêu đề và nút tạo mới */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Quản lý báo giá</h1>
                <button
                    onClick={() => navigate("/admin/quote/create")}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Tạo báo giá mới
                </button>
            </div>

            {/* NOTE: Thanh tìm kiếm và lọc */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo ID, tên khách hàng, tên nhân viên..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="CREATE">Tạo mới</option>
                    <option value="PROCESSING">Đang xử lý</option>
                    <option value="REJECTED">Bị từ chối</option>
                    <option value="ORDERED">Đã đặt hàng</option>
                </select>
            </div>

            {/* NOTE: Hiển thị loading */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                    <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
                </div>
            )}

            {/* NOTE: Hiển thị lỗi */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <p className="font-semibold">Lỗi:</p>
                    <p>{error}</p>
                </div>
            )}

            {/* NOTE: Bảng danh sách báo giá */}
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
                                    Nhân viên
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                                    Tổng giá trị
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                                    Trạng thái
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredQuotes.length > 0 ? (
                                filteredQuotes.map((quote) => (
                                    <tr
                                        key={quote.quoteId}
                                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-xs text-gray-900 whitespace-nowrap font-medium">
                                            #{quote.quoteId}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-900 whitespace-nowrap">
                                            {quote.customerName || "-"}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-900 whitespace-nowrap">
                                            {quote.employeeName || "-"}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-900 whitespace-nowrap font-semibold">
                                            {formatCurrency(quote.totalAmount)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {getStatusBadge(quote.status)}
                                        </td>
                                        <td className="px-4 py-3 text-xs whitespace-nowrap space-x-2">
                                            <button
                                                onClick={() => navigate(`/admin/quote/${quote.quoteId}`)}
                                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors inline-flex items-center gap-1"
                                                title="Xem chi tiết"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/quote/${quote.quoteId}/edit`)}
                                                className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors inline-flex items-center gap-1"
                                                title="Chỉnh sửa"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(quote.quoteId)}
                                                className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors inline-flex items-center gap-1"
                                                title="Xóa"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                        {searchTerm || filterStatus
                                            ? "Không tìm thấy kết quả phù hợp"
                                            : "Không có báo giá nào"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default QuoteList;
