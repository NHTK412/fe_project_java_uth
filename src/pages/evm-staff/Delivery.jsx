import React, { useState, useEffect } from "react";
import {
  Calendar,
  Truck,
  User,
  Package,
  Plus,
  Edit2,
  Filter,
  CheckCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  X,
} from "lucide-react";
import { deliveryApi } from "../../services/api/evm_staff/vehicleDeliveryApi";

const VehicleDeliveryManager = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDelivery, setCurrentDelivery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    orderId: "",
    employeeId: "",
    expectedDeliveryDate: "",
    status: "PREPARING",
  });

  const statusOptions = [
    {
      value: "PREPARING",
      label: "Đang chuẩn bị",
      color: "bg-blue-100 text-blue-800",
      icon: Clock,
    },
    {
      value: "DELIVERING",
      label: "Đang giao",
      color: "bg-yellow-100 text-yellow-800",
      icon: Truck,
    },
    {
      value: "DELIVERED",
      label: "Đã giao",
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
    },
    {
      value: "RESCHEDULED",
      label: "Đã dời lịch",
      color: "bg-purple-100 text-purple-800",
      icon: RefreshCw,
    },
  ];

  // Danh sách trạng thái cho form edit (bỏ CANCELLED)
  const editStatusOptions = statusOptions.filter(
    (s) => s.value !== "CANCELLED"
  );

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load data from API
  const loadDeliveries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await deliveryApi.getAllDeliveries();
      setDeliveries(data);
      setFilteredDeliveries(data);
    } catch (err) {
      setError(err.message);
      console.error("Error loading deliveries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  // Filter by status
  const handleStatusFilter = async (status) => {
    setSelectedStatus(status);

    try {
      setLoading(true);
      setError(null);

      if (status === "ALL") {
        const data = await deliveryApi.getAllDeliveries();
        setFilteredDeliveries(data);
      } else {
        const data = await deliveryApi.getDeliveriesByStatus(status);
        setFilteredDeliveries(data);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error filtering deliveries:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    return statusOptions.find((s) => s.value === status) || statusOptions[0];
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Chưa xác định";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("vi-VN") +
      " " +
      date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    );
  };

  const handleCreate = () => {
    setEditMode(false);
    setCurrentDelivery(null);
    setFormData({
      orderId: "",
      employeeId: "",
      expectedDeliveryDate: "",
      status: "PREPARING",
    });
    setShowModal(true);
  };

  const handleEdit = (delivery) => {
    setEditMode(true);
    setCurrentDelivery(delivery);
    const date = new Date(delivery.expectedDeliveryDate);
    const formattedDate = date.toISOString().split("T")[0];

    setFormData({
      orderId: delivery.orderId,
      employeeId: delivery.employeeId,
      expectedDeliveryDate: formattedDate,
      status: delivery.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const submitData = {
        orderId: parseInt(formData.orderId),
        employeeId: parseInt(formData.employeeId),
        expectedDeliveryDate: formData.expectedDeliveryDate,
        status: formData.status,
      };

      if (editMode && currentDelivery) {
        // Nếu trạng thái mới là DELIVERED và trước đó chưa DELIVERED
        if (
          formData.status === "DELIVERED" &&
          currentDelivery.status !== "DELIVERED"
        ) {
          submitData.deliveryDate = new Date().toISOString().split("T")[0];
        }

        // Update existing delivery
        await deliveryApi.updateDelivery(
          currentDelivery.vehicleDeliveryId,
          submitData
        );
        showToast("Cập nhật lịch giao xe thành công!", "success");
      } else {
        // Create new delivery
        await deliveryApi.createDelivery(submitData);
        showToast("Tạo lịch giao xe mới thành công!", "success");
      }

      setShowModal(false);
      await loadDeliveries();

      // Re-apply filter if needed
      if (selectedStatus !== "ALL") {
        handleStatusFilter(selectedStatus);
      }
    } catch (err) {
      showToast(err.message || "Có lỗi xảy ra", "error");
      console.error("Error submitting delivery:", err);
    } finally {
      setLoading(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const statusInfo = getStatusInfo(status);
    const Icon = statusInfo.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
      >
        <Icon size={14} />
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span className="font-medium">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 hover:bg-white/20 rounded p-1"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Truck className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Theo dõi tình trạng giao hàng
                </h1>
              </div>
            </div>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} />
              Tạo lịch giao xe
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={18} className="text-slate-500" />
            <button
              onClick={() => handleStatusFilter("ALL")}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                selectedStatus === "ALL"
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Tất cả ({deliveries.length})
            </button>
            {statusOptions.map((status) => {
              const count = deliveries.filter(
                (d) => d.status === status.value
              ).length;
              const Icon = status.icon;
              return (
                <button
                  key={status.value}
                  onClick={() => handleStatusFilter(status.value)}
                  disabled={loading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                    selectedStatus === status.value
                      ? status.color
                          .replace("100", "500")
                          .replace("800", "white")
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Icon size={16} />
                  {status.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-slate-500">Đang tải dữ liệu...</p>
          </div>
        )}

        {/* Deliveries Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeliveries.map((delivery) => (
              <div
                key={delivery.vehicleDeliveryId}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <Package className="text-green-600" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Mã giao xe</p>
                        <p className="font-bold text-slate-800">
                          #{delivery.vehicleDeliveryId}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={delivery.status} />
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="text-slate-400" size={16} />
                      <span className="text-slate-600">Đơn hàng:</span>
                      <span className="font-semibold text-slate-800">
                        #{delivery.orderId}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <User className="text-slate-400" size={16} />
                      <span className="text-slate-600">Nhân viên:</span>
                      <span className="font-semibold text-slate-800">
                        #{delivery.employeeId}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <Calendar className="text-slate-400 mt-0.5" size={16} />
                      <div>
                        <p className="text-slate-600">Ngày dự kiến:</p>
                        <p className="font-semibold text-slate-800">
                          {formatDateTime(delivery.expectedDeliveryDate)}
                        </p>
                      </div>
                    </div>

                    {delivery.deliveryDate && (
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle
                          className="text-green-500 mt-0.5"
                          size={16}
                        />
                        <div>
                          <p className="text-slate-600">Đã giao:</p>
                          <p className="font-semibold text-green-600">
                            {formatDateTime(delivery.deliveryDate)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleEdit(delivery)}
                    disabled={loading || delivery.status === "DELIVERED"}
                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-colors ${
                      delivery.status === "DELIVERED"
                        ? "bg-slate-50 text-slate-400 cursor-not-allowed"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Edit2 size={16} />
                    {delivery.status === "DELIVERED"
                      ? "Đã giao - Không thể sửa"
                      : "Chỉnh sửa"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredDeliveries.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Truck className="mx-auto text-slate-300 mb-4" size={64} />
            <p className="text-slate-500 text-lg">Không có lịch giao xe nào</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">
                {editMode ? "Cập nhật lịch giao xe" : "Tạo lịch giao xe mới"}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mã đơn hàng *
                </label>
                <input
                  type="number"
                  required
                  value={formData.orderId}
                  onChange={(e) =>
                    setFormData({ ...formData, orderId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Nhập mã đơn hàng"
                  disabled={editMode || loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mã nhân viên *
                </label>
                <input
                  type="number"
                  required
                  value={formData.employeeId}
                  onChange={(e) =>
                    setFormData({ ...formData, employeeId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Nhập mã nhân viên"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ngày giao dự kiến *
                </label>
                <input
                  type="date"
                  required
                  value={formData.expectedDeliveryDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expectedDeliveryDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              {/* Chỉ hiển thị chọn trạng thái khi EDIT, không hiển thị khi CREATE */}
              {editMode && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Trạng thái *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={loading}
                  >
                    {editStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {formData.status === "DELIVERED" &&
                    currentDelivery?.status !== "DELIVERED" && (
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <CheckCircle size={12} />
                        Ngày giao sẽ được tự động cập nhật
                      </p>
                    )}
                </div>
              )}

              {/* Thông báo trạng thái khi tạo mới */}
              {!editMode && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-blue-600" />
                    <p className="text-sm text-blue-700">
                      Trạng thái mặc định: <strong>Đang chuẩn bị</strong>
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Đang xử lý..."
                    : editMode
                    ? "Cập nhật"
                    : "Tạo mới"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default VehicleDeliveryManager;
