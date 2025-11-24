import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Layers, Grid, UserPlus } from "lucide-react";
import VehicleTable from "../../components/admin/vehicle/VehicleTable";
import VehicleModal from "../../components/admin/vehicle/VehicleModal";
import VehicleFilters from "../../components/admin/vehicle/VehicleFilter";
import VehicleTypeTable from "../../components/admin/vehicle/VehicleTypeTable";
import VehicleTypeModal from "../../components/admin/vehicle/VehicleTypeModal";
import VehicleTypeFilter from "../../components/admin/vehicle/VehicleTypeFilter";
import VehicleTypeDetailTable from "../../components/admin/vehicle/VehicleTypeDetailTable";
import VehicleTypeDetailModal from "../../components/admin/vehicle/VehicleTypeDetailModal";
import VehicleTypeDetailFilter from "../../components/admin/vehicle/VehicleTypeDetailFilter";

import { vehicleApi } from "../../services/api/admin/vehicleApi";
import { vehicleTypeApi } from "../../services/api/admin/vehicleTypeApi";
import { vehicleTypeDetailApi } from "../../services/api/admin/vehicleTypeDetailApi";
import { showSuccess, showError, showInfo } from "../../components/shared/toast";

const TABS = [
  { id: "vehicle", label: "Xe", icon: Truck },
  { id: "vehicleType", label: "Loại xe", icon: Layers },
  { id: "vehicleTypeDetail", label: "Chi tiết loại xe", icon: Grid },
];

const VehicleManagement = () => {
  const navigate = useNavigate(); 
  const [activeTab, setActiveTab] = useState("vehicle");

  // ===== STATE =====
  const [vehicleData, setVehicleData] = useState([]);
  const [vehicleLoading, setVehicleLoading] = useState(false);
  const [vehiclePagination, setVehiclePagination] = useState({ page: 0, size: 10, totalElements: 0, totalPages: 0 });

  const [vehicleTypeData, setVehicleTypeData] = useState([]);
  const [vehicleTypeLoading, setVehicleTypeLoading] = useState(false);
  const [vehicleTypePagination, setVehicleTypePagination] = useState({ page: 0, size: 10, totalElements: 0, totalPages: 0 });

  const [vehicleTypeDetailData, setVehicleTypeDetailData] = useState([]);
  const [vehicleTypeDetailLoading, setVehicleTypeDetailLoading] = useState(false);
  const [vehicleTypeDetailPagination, setVehicleTypeDetailPagination] = useState({ page: 0, size: 10, totalElements: 0, totalPages: 0 });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("asc");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedItem, setSelectedItem] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // ================= FETCH DATA =================
  const fetchData = useCallback(async () => {
    try {
      if (activeTab === "vehicle") {
        setVehicleLoading(true);
        const res = await vehicleApi.getAll(vehiclePagination.page, vehiclePagination.size, sortBy, sortDir);
        if (res.success) {
          setVehicleData(res.data.content || []);
          setVehiclePagination(prev => ({
            ...prev,
            totalElements: res.data.totalElements || 0,
            totalPages: res.data.totalPages || 0,
          }));
        }
      } else if (activeTab === "vehicleType") {
        setVehicleTypeLoading(true);
        const res = await vehicleTypeApi.getAll(vehicleTypePagination.page, vehicleTypePagination.size, sortBy, sortDir);
        if (res.success) {
          setVehicleTypeData(res.data.content || []);
          setVehicleTypePagination(prev => ({
            ...prev,
            totalElements: res.data.totalElements || 0,
            totalPages: res.data.totalPages || 0,
          }));
        }
      } else if (activeTab === "vehicleTypeDetail") {
        setVehicleTypeDetailLoading(true);
        const res = await vehicleTypeDetailApi.getAll(vehicleTypeDetailPagination.page, vehicleTypeDetailPagination.size, sortBy, sortDir);
        if (res.success) {
          setVehicleTypeDetailData(res.data.content || []);
          setVehicleTypeDetailPagination(prev => ({
            ...prev,
            totalElements: res.data.totalElements || 0,
            totalPages: res.data.totalPages || 0,
          }));
        }
      }
    } catch (err) {
      console.error(err);
      showError("Không thể tải dữ liệu");
    } finally {
      setVehicleLoading(false);
      setVehicleTypeLoading(false);
      setVehicleTypeDetailLoading(false);
    }
  }, [
    activeTab,
    vehiclePagination.page, vehiclePagination.size,
    vehicleTypePagination.page, vehicleTypePagination.size,
    vehicleTypeDetailPagination.page, vehicleTypeDetailPagination.size,
    sortBy, sortDir
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ================= HANDLE =================
  const handlePageChange = (newPage) => {
    if (activeTab === "vehicle") setVehiclePagination(prev => ({ ...prev, page: newPage }));
    else if (activeTab === "vehicleType") setVehicleTypePagination(prev => ({ ...prev, page: newPage }));
    else setVehicleTypeDetailPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    if (activeTab === "vehicle") setVehiclePagination(prev => ({ ...prev, page: 0 }));
    else if (activeTab === "vehicleType") setVehicleTypePagination(prev => ({ ...prev, page: 0 }));
    else setVehicleTypeDetailPagination(prev => ({ ...prev, page: 0 }));
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedItem(null);
    setModalOpen(true);
  };

  const handleViewVehicle = (item) => navigate(`/admin/vehicle/${item.id}`);
  const handleViewVehicleType = (item) => navigate(`/admin/vehicle-type/${item.vehicleTypeId}`);
  const handleViewVehicleTypeDetail = (item) => navigate(`/admin/vehicle/type/detail/${item.vehicleTypeDetailId || item.id}`);
  const handleEdit = (item) => { setModalMode("edit"); setSelectedItem(item); setModalOpen(true); };

  // ================= HANDLE =================
const handleDelete = async (item) => {
  if (!item) {
    showError("Không xác định được mục cần xoá");
    return;
  }

  try {
    let res;
    if (activeTab === "vehicle") {
      if (!item.id) { showError("Không xác định được mục cần xoá"); return; }
      res = await vehicleApi.delete(item.id);
    } else if (activeTab === "vehicleType") {
      if (!item.vehicleTypeId) { showError("Không xác định được loại xe"); return; }
      res = await vehicleTypeApi.delete(item.vehicleTypeId);
    } else {
      if (!item.id) { showError("Không xác định được mục cần xoá"); return; }
      res = await vehicleTypeDetailApi.delete(item.id);
    }

    if (res?.success) {
      showSuccess("Xoá thành công");
      fetchData();
    } else {
      showError(res?.message || "Xoá thất bại");
    }
  } catch (err) {
    console.error(err);
    showError(err.response?.data?.message || "Xoá thất bại do server");
  }
};

const handleView = (item) => {
  if (activeTab === "vehicle") {
    navigate(`/admin/vehicle/${item.id}`);
  } else if (activeTab === "vehicleType") {
    navigate(`/admin/vehicle-type/${item.vehicleTypeId}`);
  } else {
    navigate(`/admin/vehicle/type/detail/${item.vehicleTypeDetailId || item.id}`);
  }
};


  // ================= HANDLE SUBMIT MODAL =================
  const handleSubmitVehicleType = async (data) => {
    setSubmitLoading(true);
    try {
      let res;
      if (modalMode === "create") res = await vehicleTypeApi.create(data);
      else if (modalMode === "edit") res = await vehicleTypeApi.update(selectedItem.vehicleTypeId, data);

      if (res?.success) {
        showSuccess(modalMode === "create" ? "Tạo loại xe thành công" : "Cập nhật thành công");
        fetchData();
        setModalOpen(false);
      } else showError(res?.message || "Thất bại");
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || "Thất bại do server");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSubmitVehicleTypeDetail = async (data) => {
  setSubmitLoading(true);
  try {
    let res;
    if (modalMode === "create") {
      res = await vehicleTypeDetailApi.create(data); // data có vehicleImage
    } else if (modalMode === "edit") {
      res = await vehicleTypeDetailApi.update(selectedItem.id, data);
    }

    if (res?.success) {
      showSuccess(modalMode === "create" ? "Thêm chi tiết xe thành công" : "Cập nhật thành công");
      fetchData();
      setModalOpen(false);
    } else {
      showError(res?.message || "Thất bại");
    }
  } catch (err) {
    console.error(err);
    showError(err.response?.data?.message || "Thất bại do server");
  } finally {
    setSubmitLoading(false);
  }
};

  // ================= RENDER =================
  const renderTableAndFilter = () => {
    if (activeTab === "vehicle") {
      return (
        <>
          <VehicleFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            onRefresh={fetchData}
          />
          <VehicleTable
            data={vehicleData}
            loading={vehicleLoading}
            pagination={vehiclePagination}
            onPageChange={handlePageChange}
            onView={handleViewVehicle}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      );
    } else if (activeTab === "vehicleType") {
      return (
        <>
          <VehicleTypeFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            onRefresh={fetchData}
          />
          <VehicleTypeTable
            data={vehicleTypeData}
            loading={vehicleTypeLoading}
            pagination={vehicleTypePagination}
            onPageChange={handlePageChange}
            onView={handleViewVehicleType} 
            onEdit={handleEdit}
            onDelete={handleDelete}xx
          />
        </>
      );
    } else {
      return (
        <>
          <VehicleTypeDetailFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            onRefresh={fetchData}
          />
          <VehicleTypeDetailTable
            data={vehicleTypeDetailData}
            loading={vehicleTypeDetailLoading}
            pagination={vehicleTypeDetailPagination}
            onPageChange={handlePageChange}
            onEdit={handleEdit}
            onView={handleViewVehicleTypeDetail}
            onDelete={handleDelete}
          />
        </>
      );
    }
  };

  const renderModal = () => {
    if (!modalOpen) return null;
    if (activeTab === "vehicle") return (
      <VehicleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={() => {}}
        initialData={selectedItem}
        mode={modalMode}
        loading={submitLoading}
      />
    );
    if (activeTab === "vehicleType") return (
      <VehicleTypeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitVehicleType} // đảm bảo submit hoạt động
        initialData={selectedItem}
        mode={modalMode}
        loading={submitLoading}
      />
    );
    if (activeTab === "vehicleTypeDetail") return (
      <VehicleTypeDetailModal
        isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      onSubmit={handleSubmitVehicleTypeDetail} // <-- sửa đây
      initialData={selectedItem}
      mode={modalMode}
      loading={submitLoading}
      />
    );
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header + Tabs */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Truck className="w-6 h-6 text-blue-500" /> Quản lý xe
        </h1>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all"
        >
          <UserPlus className="w-4 h-4" /> Thêm mới
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 mb-4">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filter + Table */}
      {renderTableAndFilter()}

      {/* Modal */}
      {renderModal()}
    </div>
  );
};

export default VehicleManagement;
