// src/pages/admin/FeedbackManagement.jsx
import { useState, useEffect } from "react";
import {
  MessageSquare,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  User,
  MessageCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  showSuccess,
  showError,
  showInfo,
} from "../../components/shared/toast";
import feedbackApi from "../../services/api/admin/feedbackApi";

// ========== ENUM MAPPING THEO BACKEND ==========
// FeedbackStatusEnum: NOT_YET_PROCESSED, IN_PROCESSED, PROCESSED
const FEEDBACK_STATUS = {
  "Not yet processed": {
    label: "Chưa xử lý",
    color: "bg-red-100 text-red-700 border border-red-200",
    bgCard: "bg-red-50",
    icon: AlertCircle,
    iconColor: "text-red-500",
  },
  "In processed": {
    label: "Đang xử lý",
    color: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    bgCard: "bg-yellow-50",
    icon: Clock,
    iconColor: "text-yellow-500",
  },
  Processed: {
    label: "Đã xử lý",
    color: "bg-green-100 text-green-700 border border-green-200",
    bgCard: "bg-green-50",
    icon: CheckCircle,
    iconColor: "text-green-500",
  },
};

// FeedbackHandlingMethodEnum: PHONE_NUMBER, EMAIL
const HANDLING_METHODS = {
  "Phone Number": "Điện thoại",
  Email: "Email",
};

// FeedbackHandlingStatusEnum: COMPLETE
const HANDLING_STATUS = {
  Complete: "Hoàn thành",
};

const FeedbackManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showHandleModal, setShowHandleModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  const [filters, setFilters] = useState({
    status: "",
  });

  // Form xử lý - theo enum backend (không có handlingStatus vì backend tự transition)
  const [handleForm, setHandleForm] = useState({
    feedbackHandlingContent: "",
    feedbackHandlingMethod: "Email", // Email hoặc Phone Number
  });

  const [statistics, setStatistics] = useState({
    notYetProcessed: 0,
    inProcessed: 0,
    processed: 0,
    total: 0,
  });

  useEffect(() => {
    fetchFeedbackList();
  }, [filters.status, currentPage]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchFeedbackList = async () => {
    setLoading(true);
    try {
      const response = await feedbackApi.getAllFeedback({
        status: filters.status,
        page: currentPage,
        size: pageSize,
      });

      console.log("📋 Feedback List Response:", response);

      if (response.success && response.data) {
        setData(response.data.content || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalElements(response.data.totalElements || 0);
      } else {
        showError("Không thể tải danh sách phản hồi");
        setData([]);
      }
    } catch (error) {
      console.error("❌ Fetch list error:", error);
      showError("Lỗi kết nối server");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      // Gọi API count theo displayName của enum
      const [notYetRes, inProcessRes, processedRes, totalRes] =
        await Promise.all([
          feedbackApi
            .countByStatus("Not yet processed")
            .catch(() => ({ data: 0 })),
          feedbackApi.countByStatus("In processed").catch(() => ({ data: 0 })),
          feedbackApi.countByStatus("Processed").catch(() => ({ data: 0 })),
          feedbackApi
            .getAllFeedback({ page: 0, size: 1 })
            .catch(() => ({ data: { totalElements: 0 } })),
        ]);

      setStatistics({
        notYetProcessed: notYetRes?.data || 0,
        inProcessed: inProcessRes?.data || 0,
        processed: processedRes?.data || 0,
        total: totalRes?.data?.totalElements || 0,
      });

      console.log("📊 Statistics fetched:", {
        notYetProcessed: notYetRes?.data,
        inProcessed: inProcessRes?.data,
        processed: processedRes?.data,
        total: totalRes?.data?.totalElements,
      });
    } catch (error) {
      console.error("❌ Fetch statistics error:", error);
    }
  };

  const handleViewDetail = async (feedbackId) => {
    try {
      const response = await feedbackApi.getFeedbackDetail(feedbackId);
      console.log("🔍 Detail Response:", response);
      if (response.success && response.data) {
        setSelectedFeedback(response.data);
        setShowDetailModal(true);
      }
    } catch (error) {
      showError("Không thể tải chi tiết phản hồi");
    }
  };

  const handleOpenHandleModal = (feedback) => {
    setSelectedFeedback(feedback);
    setHandleForm({
      feedbackHandlingContent: "",
      feedbackHandlingMethod: "Email",
    });
    setShowHandleModal(true);
  };

  const handleSubmitResolution = async () => {
    if (!handleForm.feedbackHandlingContent.trim()) {
      showInfo("Vui lòng nhập nội dung xử lý");
      return;
    }

    try {
      const response = await feedbackApi.handleFeedback(
        selectedFeedback.feedbackId,
        handleForm
      );

      console.log("✅ Handle Response:", response);

      if (response.success) {
        showSuccess("Xử lý phản hồi thành công");
        setShowHandleModal(false);
        setShowDetailModal(false);
        fetchFeedbackList();
        fetchStatistics();
      }
    } catch (error) {
      console.error("❌ Handle error:", error);
      showError("Không thể xử lý phản hồi");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  // Kiểm tra xem feedback có thể xử lý được không
  // Backend sẽ tự động chuyển: NOT_YET_PROCESSED → IN_PROCESSED → PROCESSED trong 1 lần gọi
  // Chỉ xử lý được khi:
  // 1. Status là "Not yet processed"
  // 2. HOẶC chưa có feedbackHandlingId (chưa được xử lý)
  const canHandle = (feedback) => {
    const hasNoHandling = !feedback.feedbackHandlingId;
    const isNotProcessed = feedback.status !== "Processed";
    return hasNoHandling && isNotProcessed;
  };

  // Lấy thông tin status
  const getStatusInfo = (status) => {
    return (
      FEEDBACK_STATUS[status] || {
        label: status,
        color: "bg-gray-100 text-gray-700",
        icon: MessageSquare,
        iconColor: "text-gray-500",
      }
    );
  };

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-blue-500" />
            Quản lý phản hồi
          </h1>
          <p className="text-gray-500 mt-1">
            Theo dõi và xử lý phản hồi từ khách hàng
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-all duration-200 ${
              showFilters
                ? "bg-blue-50 border-blue-200 text-blue-600"
                : "border-gray-200 hover:bg-gray-50 text-gray-700"
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="font-medium">Bộ lọc</span>
          </button>
          <button
            onClick={() => {
              setCurrentPage(0);
              fetchFeedbackList();
              fetchStatistics();
            }}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 text-gray-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="font-medium">Làm mới</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards - Thiết kế khác biệt rõ ràng */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tổng phản hồi */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-100">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Tổng phản hồi</p>
              <p className="text-2xl font-bold text-gray-800">
                {statistics.total}
              </p>
            </div>
          </div>
        </div>

        {/* Chưa xử lý - Màu đỏ nổi bật */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border-2 border-red-200 hover:shadow-lg transition-all duration-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-200/30 rounded-full -mr-10 -mt-10"></div>
          <div className="flex items-center gap-3 relative">
            <div className="p-3 rounded-xl bg-red-200">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-red-600 font-semibold">Chưa xử lý</p>
              <p className="text-2xl font-bold text-red-700">
                {statistics.notYetProcessed}
              </p>
            </div>
          </div>
          {statistics.notYetProcessed > 0 && (
            <div className="mt-2 text-xs text-red-500 font-medium">
              ⚠️ Cần xử lý ngay
            </div>
          )}
        </div>

        {/* Đang xử lý - Màu vàng */}
        <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-xl p-5 border-2 border-yellow-200 hover:shadow-lg transition-all duration-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-200/30 rounded-full -mr-10 -mt-10"></div>
          <div className="flex items-center gap-3 relative">
            <div className="p-3 rounded-xl bg-yellow-200">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-yellow-600 font-semibold">
                Đang xử lý
              </p>
              <p className="text-2xl font-bold text-yellow-700">
                {statistics.inProcessed}
              </p>
            </div>
          </div>
        </div>

        {/* Đã xử lý - Màu xanh */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-5 border-2 border-green-200 hover:shadow-lg transition-all duration-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/30 rounded-full -mr-10 -mt-10"></div>
          <div className="flex items-center gap-3 relative">
            <div className="p-3 rounded-xl bg-green-200">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-semibold">Đã xử lý</p>
              <p className="text-2xl font-bold text-green-700">
                {statistics.processed}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Bộ lọc tìm kiếm</h3>
            <button
              onClick={() => {
                setFilters({ status: "" });
                setCurrentPage(0);
              }}
              className="text-sm text-blue-500 hover:text-blue-600 font-medium"
            >
              Đặt lại
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Trạng thái
              </label>
              <select
                value={filters.status}
                onChange={(e) => {
                  setFilters({ ...filters, status: e.target.value });
                  setCurrentPage(0);
                }}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Tất cả trạng thái</option>
                {Object.entries(FEEDBACK_STATUS).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Danh sách phản hồi
          </h3>
          <span className="text-sm text-gray-500">
            Tổng: {totalElements} bản ghi
          </span>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Không có phản hồi nào</p>
              <p className="text-gray-400 text-sm mt-1">
                Chưa có phản hồi từ khách hàng
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    STT
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Khách hàng
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((item, idx) => {
                  const statusInfo = getStatusInfo(item.status);
                  const StatusIcon = statusInfo.icon;
                  const showHandleBtn = canHandle(item);

                  return (
                    <tr
                      key={item.feedbackId}
                      className={`hover:bg-gray-50 ${
                        item.status === "Not yet processed"
                          ? "bg-red-50/30"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {currentPage * pageSize + idx + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {item.customerName || "Khách hàng"}
                            </p>
                            <p className="text-xs text-gray-500">
                              ID: {item.customerId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-800 line-clamp-1 max-w-xs">
                          {item.feedbackTitle || "-"}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {item.feedbackContent || ""}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusInfo.color}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(item.createAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewDetail(item.feedbackId)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors font-medium"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Chi tiết</span>
                          </button>
                          {showHandleBtn ? (
                            <button
                              onClick={() => handleOpenHandleModal(item)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors font-medium shadow-sm"
                              title="Xử lý phản hồi"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>Xử lý</span>
                            </button>
                          ) : item.status === "In processed" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-yellow-700 bg-yellow-100 rounded-lg font-semibold border border-yellow-200">
                              <Clock className="w-3.5 h-3.5" />
                              Đang xử lý
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-green-700 bg-green-100 rounded-lg font-semibold border border-green-200">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Hoàn tất
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <p className="text-sm text-gray-500">
              Trang {currentPage + 1} / {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                }
                disabled={currentPage === totalPages - 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedFeedback && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  Chi tiết phản hồi #{selectedFeedback.feedbackId}
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Thông tin phản hồi */}
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  Thông tin phản hồi
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Tiêu đề</p>
                    <p className="font-medium text-gray-800">
                      {selectedFeedback.feedbackTitle || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusInfo(selectedFeedback.status).color}`}
                    >
                      {getStatusInfo(selectedFeedback.status).label}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Ngày tạo</p>
                    <p className="font-medium text-gray-800">
                      {formatDate(selectedFeedback.createAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Cập nhật</p>
                    <p className="font-medium text-gray-800">
                      {formatDate(selectedFeedback.updateAt)}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">
                    Nội dung phản hồi
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <p className="text-gray-700">
                      {selectedFeedback.feedbackContent || "Không có nội dung"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Thông tin khách hàng */}
              <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  Thông tin khách hàng
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Họ tên</p>
                    <p className="font-medium text-gray-800">
                      {selectedFeedback.customerName || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">ID</p>
                    <p className="font-medium text-gray-800">
                      #{selectedFeedback.customerId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-medium text-gray-800">
                      {selectedFeedback.customerEmail || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                    <p className="font-medium text-gray-800">
                      {selectedFeedback.customerPhone || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Thông tin xử lý (nếu đã xử lý) */}
              {selectedFeedback.feedbackHandlingId && (
                <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Thông tin xử lý
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Phương thức</p>
                      <p className="font-medium text-gray-800">
                        {HANDLING_METHODS[
                          selectedFeedback.feedbackHandlingMethod
                        ] ||
                          selectedFeedback.feedbackHandlingMethod ||
                          "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Trạng thái xử lý
                      </p>
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                        {HANDLING_STATUS[selectedFeedback.handlingStatus] ||
                          selectedFeedback.handlingStatus ||
                          "-"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Nhân viên xử lý
                      </p>
                      <p className="font-medium text-gray-800">
                        {selectedFeedback.employeeName || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Ngày xử lý</p>
                      <p className="font-medium text-gray-800">
                        {formatDate(selectedFeedback.handlingCreateAt)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Nội dung xử lý</p>
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <p className="text-gray-700">
                        {selectedFeedback.feedbackHandlingContent || "-"}
                      </p>
                    </div>
                  </div>
                  {selectedFeedback.employeeEmail && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-1">
                        Email nhân viên
                      </p>
                      <p className="text-gray-700">
                        {selectedFeedback.employeeEmail}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Nút xử lý nếu chưa hoàn tất */}
              {canHandle(selectedFeedback) && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleOpenHandleModal(selectedFeedback);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 font-medium shadow-sm"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Xử lý phản hồi này
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Handle Modal */}
      {showHandleModal && selectedFeedback && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-xl w-full shadow-2xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Xử lý phản hồi
                  </h3>
                </div>
                <button
                  onClick={() => setShowHandleModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-5">
              {/* Thông tin feedback đang xử lý */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {selectedFeedback.customerName || "Khách hàng"}
                  </span>
                  <span
                    className={`ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusInfo(selectedFeedback.status).color}`}
                  >
                    {getStatusInfo(selectedFeedback.status).label}
                  </span>
                </div>
                <p className="font-semibold text-gray-800 mb-2">
                  {selectedFeedback.feedbackTitle || "Không có tiêu đề"}
                </p>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {selectedFeedback.feedbackContent || "Không có nội dung"}
                </p>
              </div>

              {/* Form xử lý */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phương thức xử lý <span className="text-red-500">*</span>
                </label>
                <select
                  value={handleForm.feedbackHandlingMethod}
                  onChange={(e) =>
                    setHandleForm({
                      ...handleForm,
                      feedbackHandlingMethod: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                >
                  <option value="Email">Email</option>
                  <option value="Phone Number">Điện thoại</option>
                </select>
              </div>

              {/* Hiển thị trạng thái chuyển đổi */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-sm text-blue-700 font-medium flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Trạng thái sẽ chuyển:
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusInfo(selectedFeedback.status).color}`}
                  >
                    {getStatusInfo(selectedFeedback.status).label}
                  </span>
                  <span className="text-gray-400">→</span>
                  {selectedFeedback.status === "Not yet processed" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
                      <Clock className="w-3 h-3" />
                      Đang xử lý
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                      <CheckCircle className="w-3 h-3" />
                      Đã xử lý
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung xử lý <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={handleForm.feedbackHandlingContent}
                  onChange={(e) =>
                    setHandleForm({
                      ...handleForm,
                      feedbackHandlingContent: e.target.value,
                    })
                  }
                  rows={4}
                  placeholder="Nhập nội dung phản hồi cho khách hàng..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSubmitResolution}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 font-medium shadow-sm"
                >
                  <CheckCircle className="w-5 h-5" />
                  Xác nhận xử lý
                </button>
                <button
                  onClick={() => setShowHandleModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackManagement;
