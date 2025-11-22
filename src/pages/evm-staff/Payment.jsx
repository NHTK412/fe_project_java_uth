import React, { useState, useEffect } from "react";
import {
  Trash2,
  Plus,
  Check,
  X,
  CreditCard,
  Eye,
  Search,
  Loader,
} from "lucide-react";
import { paymentApi } from "../../services/api/evm_staff/paymentApi";
import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
} from "../../components/shared/toast";

export default function PaymentManagement() {
  const [activeTab, setActiveTab] = useState("list");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchId, setSearchId] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePaymentId, setDeletePaymentId] = useState(null);
  const [newPayment, setNewPayment] = useState({
    orderId: "",
    amount: "",
    dueDate: "",
    paymentMethod: "VNPAY",
    paymentForm: "Full Payment",
    numberCycle: 1,
  });

  const statusColors = {
    PAID: "bg-green-100 text-green-800",
    UNPAID: "bg-yellow-100 text-yellow-800",
    OVERDUE: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  };

  const statusLabels = {
    PAID: "Đã thanh toán",
    UNPAID: "Chưa thanh toán",
    OVERDUE: "Quá hạn",
    CANCELLED: "Đã hủy",
  };

  const paymentMethodLabels = {
    CASH: "CASH",
    VNPAY: "VNPAY",
    BANK_TRANSFER: "Chuyển khoản",
  };

  const paymentFormLabels = {
    "Full Payment": "Thanh toán toàn bộ",
    Installment: "Thanh toán trả góp",
  };

  // Lấy dữ liệu thanh toán
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await paymentApi.getAllPayments();
      if (response && response.data) {
        setPayments(response.data || []);
      } else {
        setPayments([]);
        // showWarning("Không nhận được dữ liệu từ server");
      }
    } catch (err) {
      setPayments([]);
      showError(err.message || "Lỗi khi lấy dữ liệu thanh toán");
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  // Tìm thanh toán theo ID
  const handleSearchById = async () => {
    if (!searchId.trim()) {
      showWarning("Vui lòng nhập ID thanh toán");
      return;
    }

    setLoading(true);
    try {
      const response = await paymentApi.getPaymentById(parseInt(searchId));
      if (response && response.data) {
        setPayments([response.data]);
        showSuccess(`Tìm thấy thanh toán ID ${searchId}`);
      } else {
        setPayments([]);
        showError(`Không tìm thấy thanh toán có ID ${searchId}`);
      }
    } catch (err) {
      setPayments([]);
      showError(`Không tìm thấy thanh toán ID ${searchId}`);
      console.error("Error searching payment:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reset tìm kiếm
  const handleResetSearch = () => {
    setSearchId("");
    fetchPayments();
  };

  // Load dữ liệu khi component mount
  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments =
    filterStatus === "ALL"
      ? payments
      : payments.filter((p) => p.status === filterStatus);

  const handleAddPayment = async () => {
    if (
      !newPayment.orderId ||
      !newPayment.amount ||
      !newPayment.dueDate ||
      !newPayment.paymentMethod ||
      !newPayment.paymentForm
    ) {
      showWarning("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setLoading(true);
    try {
      const orderId = parseInt(newPayment.orderId);
      const amount = parseFloat(newPayment.amount);

      // Validate số
      if (isNaN(orderId) || orderId <= 0) {
        showError("Order ID phải là số dương");
        setLoading(false);
        return;
      }
      if (isNaN(amount) || amount <= 0) {
        showError("Số tiền phải là số dương");
        setLoading(false);
        return;
      }

      const dueDateTime = new Date(newPayment.dueDate);
      if (isNaN(dueDateTime.getTime())) {
        showError("Hạn thanh toán không hợp lệ");
        setLoading(false);
        return;
      }

      const dueDateISO = dueDateTime.toISOString();

      const paymentData = {
        orderId: orderId,
        amount: amount,
        dueDate: dueDateISO,
        paymentMethod: newPayment.paymentMethod,
        paymentForm: newPayment.paymentForm,
        numberCycle: parseInt(newPayment.numberCycle) || 1,
      };

      console.log("═══ DỮ LIỆU GỬI API ═══");
      console.log(JSON.stringify(paymentData, null, 2));
      console.log("═══ END ═══");

      const response = await paymentApi.createPayment(paymentData);

      if (response && response.data) {
        showSuccess(`Tạo thanh toán ID ${response.data.paymentId} thành công`);
      } else {
        showSuccess("Tạo thanh toán thành công");
      }

      setNewPayment({
        orderId: "",
        amount: "",
        dueDate: "",
        paymentMethod: "VNPAY",
        paymentForm: "Full Payment",
        numberCycle: 1,
      });
      setActiveTab("list");
      fetchPayments();
    } catch (err) {
      showError(err.message || "Lỗi khi tạo thanh toán");
      console.error("Chi tiết lỗi:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayment = async (id) => {
    setDeletePaymentId(id);
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletePaymentId(null);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    setLoading(true);
    try {
      await paymentApi.deletePayment(deletePaymentId);
      showSuccess(`Xóa thanh toán ID ${deletePaymentId} thành công`);
      fetchPayments();
    } catch (err) {
      showError(err.message || "Lỗi khi xóa thanh toán");
    } finally {
      setLoading(false);
      setDeletePaymentId(null);
    }
  };

  const handleConfirmCash = async (id) => {
    setLoading(true);
    try {
      await paymentApi.confirmCashPayment(id);
      showSuccess("Xác nhận thanh toán tiền mặt thành công");
      fetchPayments();
    } catch (err) {
      showError(err.message || "Lỗi khi xác nhận thanh toán");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVNPAY = async (id) => {
    setLoading(true);
    try {
      const response = await paymentApi.createVNPAYPayment(id);

      console.log("VNPAY Response:", response);

      if (response && response.data && response.data.paymentUrl) {
        showSuccess("Tạo link VNPAY thành công - Đang chuyển hướng...");

        // Chuyển hướng tới VNPAY payment page
        setTimeout(() => {
          window.location.href = response.data.paymentUrl;
        }, 1000);
      } else if (response && response.data && response.data.vnpayCode) {
        // Nếu backend trả về mã VNPAY
        showSuccess(
          `Tạo thanh toán VNPAY thành công (Mã: ${response.data.vnpayCode})`
        );
        fetchPayments();
      } else {
        showError("Không nhận được link thanh toán từ server");
      }
    } catch (err) {
      showError(err.message || "Lỗi khi tạo link VNPAY");
      console.error("Chi tiết lỗi VNPAY:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Quản lý Thanh toán
          </h1>
        </div>

        {/* Popup xác nhận xóa */}
        {showDeleteConfirm && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm"
            onClick={cancelDelete}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="bg-white rounded-lg shadow-lg p-6 w-80"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4">Xác nhận xóa</h2>
              <p className="mb-6">Bạn có chắc chắn muốn xóa thanh toán này?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("list")}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === "list"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Danh sách thanh toán
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === "create"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Plus className="inline mr-2" size={18} />
            Tạo thanh toán mới
          </button>
        </div>

        {/* Content */}
        {activeTab === "list" ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Search */}
            <div className="mb-6 flex gap-2">
              <input
                type="number"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Nhập ID thanh toán"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                onKeyPress={(e) => e.key === "Enter" && handleSearchById()}
              />
              <button
                onClick={handleSearchById}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                <Search size={18} />
                Tìm kiếm
              </button>
              {searchId && (
                <button
                  onClick={handleResetSearch}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Filter */}
            <div className="mb-6 flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterStatus("ALL")}
                className={`px-4 py-2 rounded-lg transition ${
                  filterStatus === "ALL"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilterStatus("PAID")}
                className={`px-4 py-2 rounded-lg transition ${
                  filterStatus === "PAID"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Đã thanh toán
              </button>
              <button
                onClick={() => setFilterStatus("UNPAID")}
                className={`px-4 py-2 rounded-lg transition ${
                  filterStatus === "UNPAID"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Chưa thanh toán
              </button>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex justify-center items-center py-8">
                <Loader className="animate-spin text-indigo-600" size={32} />
              </div>
            )}

            {/* Table */}
            {!loading && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b-2 border-gray-200">
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        Order
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        Phương thức
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        Hình thức
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        Số tiền
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        Kỳ
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        Hạn thanh toán
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        Ngày thanh toán
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        Phạt
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        Mã VNPAY
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        Trạng thái
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-900">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr
                        key={payment.paymentId}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          #{payment.paymentId}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          ORD-{payment.orderId}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            <CreditCard size={13} />
                            {paymentMethodLabels[payment.paymentMethod]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700 text-xs">
                          {paymentFormLabels[payment.paymentForm]}
                        </td>
                        <td className="px-4 py-3 font-semibold text-green-600">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-700">
                          {payment.numberCycle}
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-xs">
                          {formatDate(payment.dueDate)}
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-xs">
                          {formatDate(payment.paymentDate)}
                        </td>
                        <td className="px-4 py-3 font-medium text-red-600">
                          {formatCurrency(payment.penaltyAmount)}
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-xs">
                          {payment.vnpayCode || "-"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              statusColors[payment.status]
                            }`}
                          >
                            {statusLabels[payment.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-1">
                            {payment.status === "UNPAID" && (
                              <>
                                {payment.paymentMethod === "CASH" ? (
                                  <button
                                    onClick={() =>
                                      handleConfirmCash(payment.paymentId)
                                    }
                                    disabled={loading}
                                    className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200 transition disabled:opacity-50"
                                    title="Xác nhận tiền mặt"
                                  >
                                    <Check size={16} />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      handleCreateVNPAY(payment.paymentId)
                                    }
                                    disabled={loading}
                                    className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition disabled:opacity-50"
                                    title="Tạo link VNPAY"
                                  >
                                    <Eye size={16} />
                                  </button>
                                )}
                              </>
                            )}
                            <button
                              onClick={() =>
                                handleDeletePayment(payment.paymentId)
                              }
                              disabled={loading}
                              className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition disabled:opacity-50"
                              title="Xóa thanh toán"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && filteredPayments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Không có dữ liệu thanh toán
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-8 text-gray-900">
              Tạo thanh toán mới
            </h2>

            {/* Row 1: ID | Số tiền */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID *
                </label>
                <input
                  type="number"
                  value={newPayment.orderId}
                  onChange={(e) =>
                    setNewPayment({ ...newPayment, orderId: e.target.value })
                  }
                  placeholder="Nhập Order ID"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số tiền *
                </label>
                <input
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) =>
                    setNewPayment({ ...newPayment, amount: e.target.value })
                  }
                  placeholder="Nhập số tiền (VND)"
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Row 2: Phương thức thanh toán | Hình thức thanh toán */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phương thức thanh toán *
                </label>
                <select
                  value={newPayment.paymentMethod}
                  onChange={(e) =>
                    setNewPayment({
                      ...newPayment,
                      paymentMethod: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="">-- Chọn phương thức --</option>
                  <option value="VNPAY">VNPAY</option>
                  <option value="CASH">Tiền mặt</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình thức thanh toán *
                </label>
                <select
                  value={newPayment.paymentForm}
                  onChange={(e) =>
                    setNewPayment({
                      ...newPayment,
                      paymentForm: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="">-- Chọn hình thức --</option>
                  <option value="Full Payment">Thanh toán toàn bộ</option>
                  <option value="Installment">Thanh toán trả góp</option>
                </select>
              </div>
            </div>

            {/* Row 3: Ngày tạo | Kỳ thanh toán */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày tạo
                </label>
                <input
                  type="text"
                  value={new Date().toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  readOnly
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-700 outline-none cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kỳ thanh toán
                </label>
                <input
                  type="number"
                  value={newPayment.numberCycle || ""}
                  onChange={(e) =>
                    setNewPayment({
                      ...newPayment,
                      numberCycle: e.target.value,
                    })
                  }
                  placeholder="Nhập kỳ thanh toán"
                  min="1"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Row 4: Hạn thanh toán (Full width) */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hạn thanh toán *
              </label>
              <input
                type="datetime-local"
                value={newPayment.dueDate || ""}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, dueDate: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddPayment}
                disabled={loading}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <Loader className="animate-spin" size={18} />}
                Tạo thanh toán
              </button>
              <button
                onClick={() => setActiveTab("list")}
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Tổng thanh toán</p>
            <p className="text-2xl font-bold text-gray-900">
              {payments.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-yellow-600 text-sm">Chưa thanh toán</p>
            <p className="text-2xl font-bold text-yellow-600">
              {payments.filter((p) => p.status === "UNPAID").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-green-600 text-sm">Đã thanh toán</p>
            <p className="text-2xl font-bold text-green-600">
              {payments.filter((p) => p.status === "PAID").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
