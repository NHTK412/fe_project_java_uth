import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  RefreshCw,
  DollarSign,
  Eye,
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  Package,
  Building2,
  Hash,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info,
  Car,
  Mail,
  Phone,
  MapPin,
  Palette,
  Settings,
} from "lucide-react";
import {
  fetchWholesalePrices,
  fetchWholesalePriceById,
  createWholesalePrice,
  updateWholesalePrice,
  deleteWholesalePrice,
} from "../../services/api/agencyWholesalePriceApi";
import { fetchAgencies } from "../../services/api/agencyApi";
import { showSuccess, showError } from "../../components/shared/toast";
import VehicleSelectorModal from "../../components/shared/VehicleSelectorModal";

function WholesaleManagement() {
  const [wholesales, setWholesales] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedWholesale, setSelectedWholesale] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);
  const [selectedVehicleInfo, setSelectedVehicleInfo] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [formData, setFormData] = useState({
    wholesalePrice: "",
    minimumQuantity: "",
    startDate: "",
    endDate: "",
    status: "NOT_ACTIVE",
    agencyId: "",
    vehicleTypeDetailId: "",
    vehicleTypeName: "",
    version: "",
    color: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadWholesales();
    loadAgencies();
  }, [currentPage, pageSize]);

  const loadWholesales = async () => {
    setLoading(true);
    try {
      const result = await fetchWholesalePrices(currentPage, pageSize);
      if (result.success) {
        setWholesales(result.data || []);
      } else {
        showError(result.message || "Không thể tải danh sách giá sỉ!");
      }
    } catch (error) {
      console.error(error);
      showError("Lỗi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  const loadAgencies = async () => {
    try {
      const result = await fetchAgencies(1, 100);
      if (result.success) {
        setAgencies(result.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadWholesaleDetail = async (id) => {
    setLoading(true);
    try {
      const result = await fetchWholesalePriceById(id);
      if (result.success) {
        const data = result.data;
        setSelectedWholesale(data);
        setFormData({
          wholesalePrice: data.wholesalePrice || "",
          minimumQuantity: data.minimumQuantity || "",
          startDate: data.startDate ? new Date(data.startDate).toISOString().slice(0, 16) : "",
          endDate: data.endDate ? new Date(data.endDate).toISOString().slice(0, 16) : "",
          status: data.status || "NOT_ACTIVE",
          agencyId: data.agency?.agencyId || "",
          vehicleTypeDetailId: data.vehicleTypeDetail?.vehicleTypeDetailId || "",
          vehicleTypeName: data.vehicleTypeDetail?.vehicleType?.vehicleTypeName || "",
          version: data.vehicleTypeDetail?.version || "",
          color: data.vehicleTypeDetail?.color || "",
        });
        setShowModal(true);
      } else {
        showError(result.message || "Không thể tải chi tiết!");
      }
    } catch (error) {
      console.error(error);
      showError("Lỗi tải chi tiết!");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.wholesalePrice || formData.wholesalePrice <= 0) {
      newErrors.wholesalePrice = "Vui lòng nhập giá sỉ hợp lệ";
    }
    if (!formData.minimumQuantity || formData.minimumQuantity <= 0) {
      newErrors.minimumQuantity = "Vui lòng nhập số lượng tối thiểu hợp lệ";
    }
    if (!formData.startDate) newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
    if (!formData.endDate) newErrors.endDate = "Vui lòng chọn ngày kết thúc";
    if (!formData.agencyId) newErrors.agencyId = "Vui lòng chọn đại lý";
    if (!formData.vehicleTypeDetailId) {
      newErrors.vehicleTypeDetailId = "Vui lòng nhập ID chi tiết xe";
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const payload = {
        ...formData,
        wholesalePrice: Number(formData.wholesalePrice),
        minimumQuantity: Number(formData.minimumQuantity),
        agencyId: Number(formData.agencyId),
        vehicleTypeDetailId: Number(formData.vehicleTypeDetailId),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };
      const result = await createWholesalePrice(payload);
      if (result.success) {
        showSuccess("Thêm giá sỉ thành công!");
        setShowModal(false);
        resetForm();
        await loadWholesales(); // Force reload
      } else {
        showError(result.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error(error);
      showError("Không thể thêm giá sỉ!");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const payload = {
        ...formData,
        wholesalePrice: Number(formData.wholesalePrice),
        minimumQuantity: Number(formData.minimumQuantity),
        agencyId: Number(formData.agencyId),
        vehicleTypeDetailId: Number(formData.vehicleTypeDetailId),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };
      const result = await updateWholesalePrice(
        selectedWholesale.agencyWholesalePriceId,
        payload
      );
      if (result.success) {
        showSuccess("Cập nhật giá sỉ thành công!");
        setShowModal(false);
        resetForm();
        await loadWholesales(); // FIX: Force reload data
      } else {
        showError(result.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error(error);
      showError("Không thể cập nhật giá sỉ!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await deleteWholesalePrice(
        deleteTarget.agencyWholesalePriceId
      );
      if (result.success) {
        showSuccess("Xóa giá sỉ thành công!");
        setShowDeleteConfirm(false);
        setDeleteTarget(null);
        await loadWholesales(); // Force reload
      } else {
        showError(result.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error(error);
      showError("Không thể xóa giá sỉ!");
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleSelect = (vehicleInfo) => {
    setSelectedVehicleInfo(vehicleInfo);
    setFormData({
      ...formData,
      vehicleTypeDetailId: vehicleInfo.vehicleTypeDetailId,
      vehicleTypeName: vehicleInfo.vehicleTypeName,
      version: vehicleInfo.version,
      color: vehicleInfo.color,
    });
    setShowVehicleSelector(false);
  };

  const openCreateModal = () => {
    setModalMode("create");
    resetForm();
    setShowModal(true);
  };

  const openEditModal = async (id) => {
    setModalMode("edit");
    await loadWholesaleDetail(id);
  };

  const openViewModal = async (id) => {
    setModalMode("view");
    await loadWholesaleDetail(id);
  };

  const openDeleteConfirm = (wholesale) => {
    setDeleteTarget(wholesale);
    setShowDeleteConfirm(true);
  };

  const resetForm = () => {
    setFormData({
      wholesalePrice: "",
      minimumQuantity: "",
      startDate: "",
      endDate: "",
      status: "NOT_ACTIVE",
      agencyId: "",
      vehicleTypeDetailId: "",
      vehicleTypeName: "",
      version: "",
      color: "",
    });
    setErrors({});
    setSelectedWholesale(null);
    setSelectedVehicleInfo(null);
  };

  const filteredData = wholesales.filter((w) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      w.agencyWholesalePriceId?.toString().includes(searchLower) ||
      w.wholesalePrice?.toString().includes(searchLower) ||
      w.minimumQuantity?.toString().includes(searchLower) ||
      w.agency?.agencyName?.toLowerCase().includes(searchLower)
    );
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      NOT_ACTIVE: {
        label: "Chưa Hoạt Động",
        className: "bg-gray-100 text-gray-700 border border-gray-300",
        icon: AlertCircle
      },
      ACTIVE: {
        label: "Đang Hoạt Động",
        className: "bg-green-100 text-green-700 border border-green-300",
        icon: CheckCircle2
      },
      INACTIVE: {
        label: "Dừng Hoạt Động",
        className: "bg-red-100 text-red-700 border border-red-300",
        icon: XCircle
      },
    };
    const config = statusMap[status] || statusMap.NOT_ACTIVE;
    const IconComponent = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${config.className}`}>
        <IconComponent className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };
  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-blue-600" />
              Quản lý Giá Sỉ
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Quản lý giá sỉ cho đại lý và chi tiết phương tiện
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <Plus className="w-5 h-5" /> Thêm giá sỉ
            </button>
            <button
              onClick={loadWholesales}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-gray-700 font-medium"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
              Làm mới
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo ID, giá, số lượng, tên đại lý..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-600" />
              Danh sách giá sỉ
            </h3>
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Tổng: {filteredData.length} bản ghi
            </span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-20 text-center">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-semibold text-lg">Không tìm thấy dữ liệu</p>
            <p className="text-gray-400 text-sm mt-2">
              Thử thay đổi tìm kiếm hoặc thêm giá sỉ mới
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      STT
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      ID
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Đại lý
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Giá sỉ
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      SL tối thiểu
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Ngày bắt đầu
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Ngày kết thúc
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Trạng thái
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((wholesale, idx) => (
                  <tr
                    key={wholesale.agencyWholesalePriceId}
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-semibold">
                        #{wholesale.agencyWholesalePriceId}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-purple-500" />
                        <span className="font-medium text-gray-800">
                          {wholesale.agency?.agencyName || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-1 text-green-600 font-bold">
                        <DollarSign className="w-4 h-4" />
                        {formatCurrency(wholesale.wholesalePrice)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg font-semibold">
                        {wholesale.minimumQuantity} xe
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        {formatDateTime(wholesale.startDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-red-500" />
                        {formatDateTime(wholesale.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(wholesale.status)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openViewModal(wholesale.agencyWholesalePriceId)}
                          className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all hover:scale-110"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => openEditModal(wholesale.agencyWholesalePriceId)}
                          className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-all hover:scale-110"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(wholesale)}
                          className="p-2.5 text-red-600 hover:bg-red-100 rounded-lg transition-all hover:scale-110"
                          title="Xóa"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredData.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
            <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
              <Info className="w-4 h-4" />
              Hiển thị {filteredData.length} bản ghi
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2.5 rounded-lg border-2 border-gray-200 hover:bg-white hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-4 py-2 text-sm font-bold bg-blue-100 text-blue-700 rounded-lg">
                Trang {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={filteredData.length < pageSize}
                className="p-2.5 rounded-lg border-2 border-gray-200 hover:bg-white hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Create/Edit/View Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm p-4"
          onClick={() => {
            setShowModal(false);
            resetForm();
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  {modalMode === "create" && (
                    <>
                      <Plus className="w-7 h-7" />
                      Thêm giá sỉ mới
                    </>
                  )}
                  {modalMode === "edit" && (
                    <>
                      <Edit2 className="w-7 h-7" />
                      Chỉnh sửa giá sỉ
                    </>
                  )}
                  {modalMode === "view" && (
                    <>
                      <Eye className="w-7 h-7" />
                      Chi tiết giá sỉ
                    </>
                  )}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Agency Select */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-500" />
                  Đại lý <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.agencyId}
                  onChange={(e) =>
                    setFormData({ ...formData, agencyId: e.target.value })
                  }
                  disabled={modalMode === "view"}
                  className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-600 transition-all ${errors.agencyId ? "border-red-500" : "border-gray-200"
                    }`}
                >
                  <option value="">-- Chọn đại lý --</option>
                  {agencies.map((agency) => (
                    <option key={agency.agencyId} value={agency.agencyId}>
                      {agency.agencyName}
                    </option>
                  ))}
                </select>
                {errors.agencyId && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.agencyId}
                  </p>
                )}
              </div>

              {/* Vehicle Type Detail ID */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Car className="w-4 h-4 text-blue-500" />
                  Chi tiết xe <span className="text-red-500">*</span>
                </label>
                {modalMode === "view" ? (
                  <div className="w-full border-2 rounded-xl px-4 py-3 bg-gray-100 text-gray-600">
                    {formData.vehicleTypeName && formData.version && formData.color
                      ? `${formData.vehicleTypeName} - ${formData.version} - ${formData.color}`
                      : formData.vehicleTypeDetailId
                        ? `ID: ${formData.vehicleTypeDetailId}`
                        : "Chưa chọn"}
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowVehicleSelector(true)}
                      className={`w-full border-2 rounded-xl px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.vehicleTypeDetailId ? "border-red-500" : "border-gray-200"
                        } ${formData.vehicleTypeDetailId
                          ? "bg-blue-50 text-blue-900 font-medium"
                          : "bg-white text-gray-500"
                        }`}
                    >
                      {formData.vehicleTypeName && formData.version && formData.color
                        ? `${formData.vehicleTypeName} - ${formData.version} - ${formData.color}`
                        : "Nhấn để chọn xe"}
                    </button>
                    {errors.vehicleTypeDetailId && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.vehicleTypeDetailId}
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Wholesale Price */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    Giá sỉ (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.wholesalePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, wholesalePrice: e.target.value })
                    }
                    disabled={modalMode === "view"}
                    className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-600 transition-all ${errors.wholesalePrice ? "border-red-500" : "border-gray-200"
                      }`}
                    placeholder="Nhập giá sỉ"
                    min="0"
                  />
                  {errors.wholesalePrice && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.wholesalePrice}
                    </p>
                  )}
                </div>

                {/* Minimum Quantity */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Package className="w-4 h-4 text-orange-500" />
                    Số lượng tối thiểu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.minimumQuantity}
                    onChange={(e) =>
                      setFormData({ ...formData, minimumQuantity: e.target.value })
                    }
                    disabled={modalMode === "view"}
                    className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-600 transition-all ${errors.minimumQuantity ? "border-red-500" : "border-gray-200"
                      }`}
                    placeholder="Nhập số lượng tối thiểu"
                    min="1"
                  />
                  {errors.minimumQuantity && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.minimumQuantity}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    Ngày bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    disabled={modalMode === "view"}
                    className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-600 transition-all ${errors.startDate ? "border-red-500" : "border-gray-200"
                      }`}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.startDate}
                    </p>
                  )}
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-500" />
                    Ngày kết thúc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    disabled={modalMode === "view"}
                    className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-600 transition-all ${errors.endDate ? "border-red-500" : "border-gray-200"
                      }`}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-indigo-500" />
                  Trạng thái <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  disabled={modalMode === "view"}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-600 transition-all"
                >
                  <option value="NOT_ACTIVE">Chưa Hoạt Động</option>
                  <option value="ACTIVE">Đang Hoạt Động</option>
                  <option value="INACTIVE">Dừng Hoạt Động</option>
                </select>
              </div>

              {/* View Mode - Additional Info */}
              {modalMode === "view" && selectedWholesale && (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-lg border-b-2 border-blue-200 pb-2">
                    <Info className="w-5 h-5" />
                    Thông tin chi tiết
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-gray-700 flex items-center gap-2">
                      <Hash className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold">ID:</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg font-bold">
                        #{selectedWholesale.agencyWholesalePriceId}
                      </span>
                    </p>

                    {selectedWholesale.agency && (
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                        <div className="flex items-center gap-2 text-purple-600 font-bold mb-3 border-b border-gray-200 pb-2">
                          <Building2 className="w-5 h-5" />
                          Thông tin đại lý
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold">Tên:</span>
                            <span className="text-gray-700">{selectedWholesale.agency.agencyName}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold">Địa chỉ:</span>
                            <span className="text-gray-700">{selectedWholesale.agency.address}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold">SĐT:</span>
                            <span className="text-gray-700">{selectedWholesale.agency.phoneNumber}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold">Email:</span>
                            <span className="text-gray-700">{selectedWholesale.agency.email}</span>
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedWholesale.vehicleTypeDetail && (
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                        <div className="flex items-center gap-2 text-blue-600 font-bold mb-3 border-b border-gray-200 pb-2">
                          <Car className="w-5 h-5" />
                          Thông tin xe
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="flex items-center gap-2">
                            <Palette className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold">Màu:</span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg">
                              {selectedWholesale.vehicleTypeDetail.color}
                            </span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Info className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold">Phiên bản:</span>
                            <span className="text-gray-700">{selectedWholesale.vehicleTypeDetail.version}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Settings className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold">Cấu hình:</span>
                            <span className="text-gray-700">{selectedWholesale.vehicleTypeDetail.configuration}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold">Giá niêm yết:</span>
                            <span className="text-green-600 font-bold">
                              {formatCurrency(selectedWholesale.vehicleTypeDetail.price)}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl border-t-2 border-gray-200">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-6 py-3 rounded-xl border-2 border-gray-300 hover:bg-gray-100 transition-all font-medium text-gray-700"
                >
                  {modalMode === "view" ? "Đóng" : "Hủy"}
                </button>
                {modalMode !== "view" && (
                  <button
                    onClick={modalMode === "create" ? handleCreate : handleUpdate}
                    disabled={loading}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
                  >
                    {loading
                      ? "Đang xử lý..."
                      : modalMode === "create"
                        ? "Thêm mới"
                        : "Cập nhật"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-t-2xl">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <AlertCircle className="w-6 h-6" />
                Xác nhận xóa
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 text-lg mb-2">
                Bạn có chắc muốn xóa giá sỉ này không?
              </p>
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mt-4">
                <p className="text-red-700 font-semibold flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  ID: #{deleteTarget?.agencyWholesalePriceId}
                </p>
                <p className="text-red-600 text-sm mt-1 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Hành động này không thể hoàn tác!
                </p>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t-2 border-gray-200">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteTarget(null);
                  }}
                  className="px-6 py-3 rounded-xl border-2 border-gray-300 hover:bg-gray-100 transition-all font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
                >
                  {loading ? "Đang xóa..." : "Xóa ngay"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Selector Modal */}
      <VehicleSelectorModal
        isOpen={showVehicleSelector}
        onClose={() => setShowVehicleSelector(false)}
        onSelect={handleVehicleSelect}
      />
    </div>
  );
}

export default WholesaleManagement;

