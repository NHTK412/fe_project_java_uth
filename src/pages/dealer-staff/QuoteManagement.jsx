import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Loader, Edit2, Trash2, Eye, Filter } from "lucide-react";
import { toast } from "react-toastify";

const QuoteManagement = () => {
    const navigate = useNavigate();
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const quoteStatusMap = {
        'PENDING': { label: 'Chờ xử lý', color: 'yellow' },
        'APPROVED': { label: 'Đã duyệt', color: 'green' },
        'REJECTED': { label: 'Từ chối', color: 'red' },
        'CONVERTED': { label: 'Chuyển đơn hàng', color: 'blue' }
    };

    // NOTE: Mock data - Replace with actual API call
    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                setLoading(true);
                setError(null);
                // TODO: Replace with actual API call
                // const data = await getQuotes(page, size);

                // Mock data tạm thời
                setQuotes([]);
                setTotalPages(1);
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
            quote.customerName?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchStatus = filterStatus === "" || quote.status === filterStatus;

        return matchSearch && matchStatus;
    });

    const getStatusBadge = (status) => {
        const statusInfo = quoteStatusMap[status] || { label: 'Không xác định', color: 'gray' };
        const colorMap = {
            yellow: 'bg-yellow-100 text-yellow-800',
            green: 'bg-green-100 text-green-800',
            red: 'bg-red-100 text-red-800',
            blue: 'bg-blue-100 text-blue-800',
            gray: 'bg-gray-100 text-gray-800'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorMap[statusInfo.color]}`}>
                {statusInfo.label}
            </span>
        );
    };

    const handleCreateQuote = () => {
        navigate("/dealer/quote/create");
    };

    const handleViewDetail = (quoteId) => {
        navigate(`/dealer/quote/${quoteId}`);
    };

    const handleEditQuote = (quoteId) => {
        navigate(`/dealer/quote/${quoteId}/edit`);
    };

    const handleDeleteQuote = (quoteId) => {
        // TODO: Implement delete quote logic
        if (window.confirm("Bạn chắc chắn muốn xóa báo giá này?")) {
            toast.success("Xóa báo giá thành công");
        }
    };

    const handleConvertToOrder = (quoteId) => {
        // TODO: Implement convert to order logic
        navigate(`/dealer/order/create-from-quote/${quoteId}`);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(value || 0);
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("vi-VN");
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Quản lý Báo Giá</h1>
                <button
                    onClick={handleCreateQuote}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Tạo Báo Giá
                </button>
            </div>

            {/* Search & Filter */}
            <div className="bg-white rounded-lg shadow p-4 space-y-4">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo mã báo giá, tên khách hàng..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Filter className="w-4 h-4 inline mr-1" />
                            Trạng thái
                        </label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Tất cả</option>
                            {Object.entries(quoteStatusMap).map(([key, value]) => (
                                <option key={key} value={key}>{value.label}</option>
                            ))}
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
                ) : filteredQuotes.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">{searchTerm || filterStatus ? "Không tìm thấy kết quả phù hợp" : "Không có báo giá nào"}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Mã Báo Giá</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Khách Hàng</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Tổng Tiền</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Trạng Thái</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Ngày Tạo</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredQuotes.map((quote) => (
                                    <tr key={quote.quoteId} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="px-6 py-3 font-medium text-blue-600 cursor-pointer hover:underline"
                                            onClick={() => handleViewDetail(quote.quoteId)}>
                                            #{quote.quoteId}
                                        </td>
                                        <td className="px-6 py-3 text-gray-900">{quote.customerName}</td>
                                        <td className="px-6 py-3 font-semibold text-green-600">{formatCurrency(quote.totalAmount)}</td>
                                        <td className="px-6 py-3">{getStatusBadge(quote.status)}</td>
                                        <td className="px-6 py-3 text-gray-600">{formatDate(quote.createdDate)}</td>
                                        <td className="px-6 py-3 space-x-2">
                                            <button
                                                onClick={() => handleViewDetail(quote.quoteId)}
                                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors inline-flex items-center gap-1"
                                                title="Xem chi tiết"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEditQuote(quote.quoteId)}
                                                className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors inline-flex items-center gap-1"
                                                title="Chỉnh sửa"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteQuote(quote.quoteId)}
                                                className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors inline-flex items-center gap-1"
                                                title="Xóa"
                                            >
                                                <Trash2 className="w-4 h-4" />
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
            {!loading && filteredQuotes.length > 0 && totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                    <p className="text-sm text-gray-600">
                        Trang {page} / {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            Trước
                        </button>
                        <button
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuoteManagement;
