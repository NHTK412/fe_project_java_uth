import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Loader, Edit2, Trash2, Eye, Filter, RefreshCw, FileText, DollarSign, AlertCircle, ShoppingCart } from "lucide-react";
import { getQuotes, deleteQuote } from "../../services/api/quoteService";
import { showError, showSuccess } from "../../components/shared/toast";
import CreateQuoteModal from "../../components/shared/CreateQuoteModal";
import QuoteDetailModal from "../../components/shared/QuoteDetailModal";
import EditQuoteModal from "../../components/shared/EditQuoteModal";
import UpdateQuoteStatusModal from "../../components/shared/UpdateQuoteStatusModal";
import ConvertQuoteToOrderModal from "../../components/shared/ConvertQuoteToOrderModal";

const QuoteManagementPage = () => {
    const navigate = useNavigate();
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedQuoteId, setSelectedQuoteId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editQuoteId, setEditQuoteId] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [showConvertModal, setShowConvertModal] = useState(false);
    const [convertQuote, setConvertQuote] = useState(null);

    const quoteStatusMap = {
        'CREATE': { label: 'Tạo mới', color: 'blue' },
        'PROCESSING': { label: 'Đang xử lý', color: 'yellow' },
        'REJECTED': { label: 'Bị từ chối', color: 'red' },
        'ORDERED': { label: 'Đã đặt hàng', color: 'green' }
    };

    useEffect(() => {
        fetchQuotes();
    }, [page, size]);

    const fetchQuotes = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getQuotes(page, size);
            console.log("Response from API:", response);
            console.log("Type of response:", typeof response);
            console.log("Is Array:", Array.isArray(response));

            // Handle different response structures
            let quotesData = [];
            if (Array.isArray(response)) {
                quotesData = response;
            } else if (response?.content && Array.isArray(response.content)) {
                quotesData = response.content;
            } else if (response?.data && Array.isArray(response.data)) {
                quotesData = response.data;
            } else if (response?.data?.content && Array.isArray(response.data.content)) {
                quotesData = response.data.content;
            }

            console.log("Extracted quotes data:", quotesData);
            setQuotes(quotesData);
        } catch (err) {
            setError(err.message || "Có lỗi khi tải dữ liệu");
            showError(err.message || "Không thể tải danh sách báo giá");
            console.error("Lỗi tải danh sách báo giá:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredQuotes = quotes.filter((quote) => {
        const matchSearch =
            quote.quoteId?.toString().includes(searchTerm) ||
            quote.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quote.employeeName?.toLowerCase().includes(searchTerm.toLowerCase());

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

    const handleViewDetail = (quoteId) => {
        setSelectedQuoteId(quoteId);
        setShowDetailModal(true);
    };

    const handleEdit = (quoteId) => {
        setEditQuoteId(quoteId);
        setShowEditModal(true);
    };

    const handleUpdateStatus = (quote) => {
        setSelectedQuote(quote);
        setShowStatusModal(true);
    };

    const handleConvertToOrder = (quote) => {
        setConvertQuote(quote);
        setShowConvertModal(true);
    };

    const handleDelete = async (quoteId) => {
        if (window.confirm("Bạn chắc chắn muốn xóa báo giá này?")) {
            try {
                await deleteQuote(quoteId);
                setQuotes((prev) => prev.filter((q) => q.quoteId !== quoteId));
                showSuccess("Xóa báo giá thành công");
            } catch (err) {
                showError(err.message || "Không thể xóa báo giá");
                console.error("Lỗi xóa báo giá:", err);
            }
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý báo giá</h1>
                    <p className="text-gray-600 mt-1">Quản lý và theo dõi các báo giá của khách hàng</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Tạo báo giá mới
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative col-span-2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo mã báo giá, tên khách hàng, nhân viên..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Tất cả trạng thái</option>
                            {Object.entries(quoteStatusMap).map(([key, value]) => (
                                <option key={key} value={key}>{value.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <div>
                        <p className="text-red-800 font-medium">Lỗi</p>
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 flex flex-col items-center justify-center">
                    <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                    <p className="mt-4 text-gray-600">Đang tải danh sách báo giá...</p>
                </div>
            ) : (
                <>
                    {/* Table */}
                    {filteredQuotes.length === 0 ? (
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 font-medium">
                                {searchTerm || filterStatus ? "Không tìm thấy báo giá phù hợp" : "Chưa có báo giá nào"}
                            </p>
                            <p className="text-gray-500 text-sm mt-1">
                                {!searchTerm && !filterStatus && 'Nhấn "Tạo báo giá mới" để bắt đầu'}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Mã báo giá</th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Khách hàng</th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Nhân viên</th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Ngày tạo</th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Ngày hết hạn</th>
                                            <th className="px-6 py-3 text-right font-semibold text-gray-700">Tổng tiền</th>
                                            <th className="px-6 py-3 text-center font-semibold text-gray-700">Trạng thái</th>
                                            <th className="px-6 py-3 text-center font-semibold text-gray-700">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredQuotes.map((quote) => (
                                            <tr key={quote.quoteId} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    #{quote.quoteId}
                                                </td>
                                                <td className="px-6 py-4 text-gray-700">
                                                    {quote.customerName || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-gray-700">
                                                    {quote.employeeName || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-gray-700 text-sm">
                                                    {formatDate(quote.issueDate)}
                                                </td>
                                                <td className="px-6 py-4 text-gray-700 text-sm">
                                                    {formatDate(quote.expirationDate)}
                                                </td>
                                                <td className="px-6 py-4 text-right font-medium text-gray-900">
                                                    {formatCurrency(quote.totalAmount)}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {getStatusBadge(quote.status)}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleViewDetail(quote.quoteId)}
                                                            className="inline-flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Xem chi tiết"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        {quote.status === 'CREATE' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleEdit(quote.quoteId)}
                                                                    className="inline-flex items-center gap-2 px-3 py-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                                    title="Chỉnh sửa"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(quote.quoteId)}
                                                                    className="inline-flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                    title="Xóa"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                        {quote.status !== 'ORDERED' && quote.status !== 'REJECTED' && (
                                                            <button
                                                                onClick={() => handleUpdateStatus(quote)}
                                                                className="inline-flex items-center gap-2 px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                                title="Cập nhật trạng thái"
                                                            >
                                                                <AlertCircle className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        {quote.status === 'PROCESSING' && (
                                                            <button
                                                                onClick={() => handleConvertToOrder(quote)}
                                                                className="inline-flex items-center gap-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                                title="Chuyển thành đơn hàng"
                                                            >
                                                                <ShoppingCart className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <p className="text-sm text-gray-700">
                                    Hiển thị <span className="font-medium">{filteredQuotes.length}</span> báo giá
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage(Math.max(1, page - 1))}
                                        disabled={page === 1}
                                        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    >
                                        Trước
                                    </button>
                                    <span className="px-3 py-1 text-sm text-gray-700">Trang {page}</span>
                                    <button
                                        onClick={() => setPage(page + 1)}
                                        disabled={quotes.length < size}
                                        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    >
                                        Sau
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Create Quote Modal */}
            {showCreateModal && (
                <CreateQuoteModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onQuoteCreated={fetchQuotes}
                />
            )}

            {/* Quote Detail Modal */}
            {showDetailModal && selectedQuoteId && (
                <QuoteDetailModal
                    isOpen={showDetailModal}
                    quoteId={selectedQuoteId}
                    onClose={() => {
                        setShowDetailModal(false);
                        setSelectedQuoteId(null);
                    }}
                />
            )}

            {/* Edit Quote Modal */}
            {showEditModal && editQuoteId && (
                <EditQuoteModal
                    isOpen={showEditModal}
                    quoteId={editQuoteId}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditQuoteId(null);
                    }}
                    onQuoteUpdated={fetchQuotes}
                />
            )}

            {/* Update Quote Status Modal */}
            {showStatusModal && selectedQuote && (
                <UpdateQuoteStatusModal
                    isOpen={showStatusModal}
                    quote={selectedQuote}
                    onClose={() => {
                        setShowStatusModal(false);
                        setSelectedQuote(null);
                    }}
                    onStatusUpdated={fetchQuotes}
                />
            )}

            {/* Convert to Order Modal */}
            {showConvertModal && convertQuote && (
                <ConvertQuoteToOrderModal
                    isOpen={showConvertModal}
                    quote={convertQuote}
                    onClose={() => {
                        setShowConvertModal(false);
                        setConvertQuote(null);
                    }}
                    onOrderCreated={() => {
                        fetchQuotes();
                        setShowConvertModal(false);
                        setConvertQuote(null);
                    }}
                />
            )}
        </div>
    );
};

export default QuoteManagementPage;
