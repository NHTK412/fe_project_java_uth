// src/pages/admin/AgencyManagement.jsx
import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight, Search, RefreshCw, Building2, Eye } from "lucide-react";
import { showSuccess, showError } from "../components/shared/toast";
import { 
  fetchAgencies, 
  fetchAgencyById, 
  createAgency, 
  updateAgency, 
  deleteAgency 
} from "../services/api/agencyApi";

const AgencyManagement = () => {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create, edit, view
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Form state
  const [formData, setFormData] = useState({
    agencyName: "",
    address: "",
    phoneNumber: "",
    email: "",
    type: "DEALER",
    status: "ACTIVE",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadAgencies();
  }, [currentPage, pageSize]);

  // Load danh sách agencies
  const loadAgencies = async () => {
    setLoading(true);
    try {
      // API mới sử dụng page và size thay vì currentPage và pageSize
      const result = await fetchAgencies(currentPage, pageSize);
      if (result.success) {
        setAgencies(result.data || []);
      } else {
        showError(result.message || "Không thể tải danh sách đại lý!");
      }
    } catch (error) {
      console.error(error);
      showError("Lỗi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  // Load chi tiết agency
  const loadAgencyDetail = async (agencyId) => {
    setLoading(true);
    try {
      const result = await fetchAgencyById(agencyId);
      if (result.success) {
        setSelectedAgency(result.data);
        setFormData({
          agencyName: result.data.agencyName || "",
          address: result.data.address || "",
          phoneNumber: result.data.phoneNumber || "",
          email: result.data.email || "",
          type: result.data.type || "DEALER",
          status: result.data.status || "ACTIVE",
        });
        setShowModal(true);
      } else {
        showError(result.message || "Không thể tải chi tiết đại lý!");
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
    if (!formData.agencyName?.trim()) newErrors.agencyName = "Vui lòng nhập tên đại lý";
    if (!formData.address?.trim()) newErrors.address = "Vui lòng nhập địa chỉ";
    if (!formData.phoneNumber?.trim()) newErrors.phoneNumber = "Vui lòng nhập số điện thoại";
    if (!formData.email?.trim()) newErrors.email = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const result = await createAgency(formData);
      if (result.success) {
        showSuccess("Thêm đại lý thành công!");
        setShowModal(false);
        resetForm();
        loadAgencies();
      } else {
        showError(result.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error(error);
      showError("Không thể thêm đại lý!");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const result = await updateAgency(selectedAgency.agencyId, formData);
      if (result.success) {
        showSuccess("Cập nhật đại lý thành công!");
        setShowModal(false);
        resetForm();
        loadAgencies();
      } else {
        showError(result.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error(error);
      showError("Không thể cập nhật đại lý!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await deleteAgency(deleteTarget.agencyId);
      if (result.success) {
        showSuccess("Xóa đại lý thành công!");
        setShowDeleteConfirm(false);
        setDeleteTarget(null);
        loadAgencies();
      } else {
        showError(result.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error(error);
      showError("Không thể xóa đại lý!");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    resetForm();
    setShowModal(true);
  };

  const openEditModal = async (agencyId) => {
    setModalMode("edit");
    await loadAgencyDetail(agencyId);
  };

  const openViewModal = async (agencyId) => {
    setModalMode("view");
    await loadAgencyDetail(agencyId);
  };

  const openDeleteConfirm = (agency) => {
    setDeleteTarget(agency);
    setShowDeleteConfirm(true);
  };

  const resetForm = () => {
    setFormData({
      agencyName: "",
      address: "",
      phoneNumber: "",
      email: "",
      type: "DEALER",
      status: "ACTIVE",
    });
    setErrors({});
    setSelectedAgency(null);
  };

  const filteredData = agencies.filter((a) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      a.agencyName?.toLowerCase().includes(searchLower) ||
      a.agencyId?.toString().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-blue-500" /> Quản lý Đại lý
          </h1>
          <p className="text-gray-500 mt-1">Quản lý thông tin đại lý</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Thêm đại lý
          </button>
          <button
            onClick={loadAgencies}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 text-gray-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Danh sách đại lý</h3>
          <span className="text-sm text-gray-500">
            Tổng: {filteredData.length} bản ghi
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-16 text-center">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Không tìm thấy dữ liệu</p>
            <p className="text-gray-400 text-sm mt-1">Thử thay đổi tìm kiếm hoặc thêm đại lý mới</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">STT</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Tên đại lý</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((agency, idx) => (
                  <tr key={agency.agencyId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">#{agency.agencyId}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">{agency.agencyName}</td>
                    <td className="px-6 py-4">
                      {agency.status === "ACTIVE" || agency.status === "Đang Hoạt Động" ? (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          Đang Hoạt Động
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                          Dừng Hoạt Động
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => openViewModal(agency.agencyId)} 
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" 
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openEditModal(agency.agencyId)} 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteConfirm(agency)} 
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
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
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <p className="text-sm text-gray-500">
              Hiển thị {filteredData.length} đại lý
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 text-sm font-medium">Trang {currentPage}</span>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={filteredData.length < pageSize}
                className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm" onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {modalMode === "create" && "Thêm đại lý mới"}
                {modalMode === "edit" && "Chỉnh sửa đại lý"}
                {modalMode === "view" && "Chi tiết đại lý"}
              </h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên đại lý <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.agencyName} 
                  onChange={(e) => setFormData({...formData, agencyName: e.target.value})}
                  disabled={modalMode === "view"}
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600 ${errors.agencyName ? "border-red-500" : "border-gray-200"}`}
                  placeholder="Nhập tên đại lý"
                />
                {errors.agencyName && <p className="text-sm text-red-500 mt-1">{errors.agencyName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.address} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  disabled={modalMode === "view"}
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600 ${errors.address ? "border-red-500" : "border-gray-200"}`}
                  placeholder="Nhập địa chỉ"
                />
                {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.phoneNumber} 
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  disabled={modalMode === "view"}
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600 ${errors.phoneNumber ? "border-red-500" : "border-gray-200"}`}
                  placeholder="Nhập số điện thoại"
                />
                {errors.phoneNumber && <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={modalMode === "view"}
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600 ${errors.email ? "border-red-500" : "border-gray-200"}`}
                  placeholder="Nhập email"
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại đại lý <span className="text-red-500">*</span>
                </label>
                <select 
                  value={formData.type} 
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  disabled={modalMode === "view"}
                  className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                >
                  <option value="DEALER">Đại lý (DEALER)</option>
                  <option value="MANUFACTURER">Hãng phân phối (MANUFACTURER) </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select 
                  value={formData.status} 
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  disabled={modalMode === "view"}
                  className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                >
                  <option value="ACTIVE">Đang Hoạt Động</option>
                  <option value="INACTIVE">Dừng Hoạt Động</option>
                </select>
              </div>

              {modalMode === "view" && selectedAgency && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">ID:</span> {selectedAgency.agencyId}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Loại:</span> {selectedAgency.type}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => { setShowModal(false); resetForm(); }} 
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {modalMode === "view" ? "Đóng" : "Hủy"}
              </button>
              {modalMode !== "view" && (
                <button
                  onClick={modalMode === "create" ? handleCreate : handleUpdate}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Đang xử lý..." : (modalMode === "create" ? "Thêm" : "Lưu")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Xác nhận xóa</h2>
            <p className="text-gray-600 mb-6">
              Bạn có chắc muốn xóa đại lý <span className="font-semibold">{deleteTarget?.agencyName}</span> không?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => { setShowDeleteConfirm(false); setDeleteTarget(null); }} 
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={handleDelete} 
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyManagement;