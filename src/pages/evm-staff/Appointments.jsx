import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Car,
  User,
  Phone,
  Mail,
  Edit2,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserCheck,
  Eye,
  X,
} from "lucide-react";

import { appointmentApi } from "../../services/api/evm_staff/appointmentApi";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const statusOptions = [
    {
      value: "SCHEDULED",
      label: "Đã hẹn",
      color: "bg-blue-100 text-blue-800",
      icon: CheckCircle,
    },
    {
      value: "ARRIVED",
      label: "Đã đến",
      color: "bg-green-100 text-green-800",
      icon: UserCheck,
    },
    {
      value: "CANCELLED",
      label: "Đã hủy",
      color: "bg-red-100 text-red-800",
      icon: XCircle,
    },
  ];

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentApi.getAllAppointments();
      setAppointments(data);
      setFilteredAppointments(data);
    } catch (err) {
      showToast(err.message || "Lỗi khi tải dữ liệu", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleStatusFilter = async (status) => {
    try {
      setSelectedStatus(status);
      setLoading(true);

      if (status === "ALL") {
        const data = await appointmentApi.getAllAppointments();
        setFilteredAppointments(data);
      } else {
        const data = await appointmentApi.getAppointmentsByStatus(status);
        setFilteredAppointments(data);
      }
    } catch (err) {
      showToast(err.message || "Lỗi khi lọc dữ liệu", "error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    return statusOptions.find((s) => s.value === status) || statusOptions[0];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa xác định";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.substring(0, 5);
  };

  const handleViewDetail = async (appointment) => {
    setCurrentAppointment(appointment);
    setShowDetailModal(true);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setLoading(true);
      await appointmentApi.updateAppointmentStatus(id, newStatus);
      await loadAppointments();

      if (selectedStatus !== "ALL") {
        await handleStatusFilter(selectedStatus);
      }

      showToast("Cập nhật trạng thái thành công!", "success");
    } catch (err) {
      showToast(err.message || "Lỗi khi cập nhật trạng thái", "error");
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
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500 rounded-lg">
              <Car className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Quản lý lịch hẹn lái thử
              </h1>
            </div>
          </div>
        </div>

        {/* Filter Section */}
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
              Tất cả ({appointments.length})
            </button>
            {statusOptions.map((status) => {
              const count = appointments.filter(
                (apt) => apt.status === status.value
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-500">Đang tải dữ liệu...</p>
          </div>
        )}

        {/* Appointments Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.testDriveAppointmentId}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Car className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Mã lịch hẹn</p>
                        <p className="font-bold text-slate-800">
                          #{appointment.testDriveAppointmentId}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={appointment.status} />
                  </div>

                  {/* Appointment Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="text-slate-400" size={16} />
                      <span className="text-slate-600">Khách hàng:</span>
                      <span className="font-semibold text-slate-800">
                        {appointment.customerName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="text-slate-400" size={16} />
                      <span className="text-slate-600">Ngày hẹn:</span>
                      <span className="font-semibold text-slate-800">
                        {formatDate(appointment.dateOfAppointment)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="text-slate-400" size={16} />
                      <span className="text-slate-600">Giờ hẹn:</span>
                      <span className="font-semibold text-slate-800">
                        {formatTime(appointment.timeOfAppointment)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Car className="text-slate-400" size={16} />
                      <span className="text-slate-600">Xe:</span>
                      <span className="font-semibold text-slate-800">
                        #{appointment.vehicleId}
                      </span>
                    </div>
                  </div>

                  {/* View Detail Button */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetail(appointment)}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      <Eye size={16} />
                      Chi tiết
                    </button>
                  </div>

                  {/* Quick Status Actions for SCHEDULED */}
                  {appointment.status === "SCHEDULED" && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <p className="text-xs text-slate-500 mb-2">
                        Chuyển trạng thái:
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleUpdateStatus(
                              appointment.testDriveAppointmentId,
                              "ARRIVED"
                            )
                          }
                          disabled={loading}
                          className="flex-1 text-xs px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                        >
                          <UserCheck size={14} />
                          Đã đến
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(
                              appointment.testDriveAppointmentId,
                              "CANCELLED"
                            )
                          }
                          disabled={loading}
                          className="flex-1 text-xs px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                        >
                          <XCircle size={14} />
                          Hủy
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Status Message for Final States */}
                  {(appointment.status === "ARRIVED" ||
                    appointment.status === "CANCELLED") && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <p className="text-xs text-slate-500 text-center italic">
                        {appointment.status === "ARRIVED" &&
                          "Khách hàng đã đến - Hoàn tất"}
                        {appointment.status === "CANCELLED" &&
                          "Lịch hẹn đã bị hủy"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredAppointments.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Car className="mx-auto text-slate-300 mb-4" size={64} />
            <p className="text-slate-500 text-lg">Không có lịch hẹn nào</p>
          </div>
        )}
      </div>

      {/* Detail Modal - Giống VehicleDelivery */}
      {showDetailModal && currentAppointment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">
                Chi tiết lịch hẹn #{currentAppointment.testDriveAppointmentId}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Khách hàng
                </label>
                <p className="text-base text-slate-800">
                  {currentAppointment.customerName}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ngày hẹn
                </label>
                <p className="text-base text-slate-800">
                  {formatDate(currentAppointment.dateOfAppointment)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Giờ hẹn
                </label>
                <p className="text-base text-slate-800">
                  {formatTime(currentAppointment.timeOfAppointment)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mã xe
                </label>
                <p className="text-base text-slate-800">
                  #{currentAppointment.vehicleId}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Trạng thái
                </label>
                <StatusBadge status={currentAppointment.status} />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
