import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Layers, Grid, UserPlus, Trash2 } from "lucide-react";
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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, size: 10, totalElements: 0, totalPages: 0 });
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedItem, setSelectedItem] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // state popup xóa
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, item: null });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      if (activeTab === "vehicle") {
        response = await vehicleApi.getAll(pagination.page, pagination.size, sortBy, sortDir);
      } else if (activeTab === "vehicleType") {
        response = await vehicleTypeApi.getAll(pagination.page, pagination.size, sortBy, sortDir);
      } else {
        response = await vehicleTypeDetailApi.getAll(pagination.page, pagination.size, sortBy, sortDir);
      }

      if (response.success) {
        const pageData = response.data;
        setData(pageData.content || []);
        setPagination((prev) => ({
          ...prev,
          totalElements: pageData.totalElements || 0,
          totalPages: pageData.totalPages || 0,
        }));
      }
    } catch (error) {
      console.error(error);
      showError("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [activeTab, pagination.page, pagination.size, sortBy, sortDir]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handlePageChange = (newPage) => setPagination((prev) => ({ ...prev, page: newPage }));
  const handleSortChange = (newSort) => { setSortBy(newSort); setPagination((prev) => ({ ...prev, page: 0 })); };

  const handleOpenCreate = () => { setModalMode("create"); setSelectedItem(null); setModalOpen(true); };
  const handleView = (item) => navigate(`/admin/vehicle/${item.id}`);
  const handleEdit = (item) => { setModalMode("edit"); setSelectedItem(item); setModalOpen(true); };

  // ---- Xử lý Xóa ----
  const handleDelete = (item) => {
    setDeleteConfirm({ open: true, item });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.item) return;
    try {
      let res;
      if (activeTab === "vehicle") {
        res = await vehicleApi.delete(deleteConfirm.item.id);
      } else if (activeTab === "vehicleType") {
        res = await vehicleTypeApi.delete(deleteConfirm.item.id);
      } else {
        res = await vehicleTypeDetailApi.delete(deleteConfirm.item.id);
      }

      if (res.success) {
        showSuccess("Xóa thành công");
        fetchData();
      } else {
        showError(res.message || "Xóa thất bại");
      }
    } catch (error) {
      showError("Có lỗi khi xóa");
    } finally {
      setDeleteConfirm({ open: false, item: null });
    }
  };

  // Filter + sort
  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return Object.values(item).some(val => val && String(val).toLowerCase().includes(search));
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];
    if (valA == null) return 1;
    if (valB == null) return -1;
    if (typeof valA === "number") return sortDir === "asc" ? valA - valB : valB - valA;
    return sortDir === "asc" ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
  });

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

      <div className="flex gap-2 border-b border-gray-200 mb-4">
        {TABS.map((tab) => {
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

      {/* Filters */}
      {activeTab === "vehicle" && (
        <VehicleFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          onRefresh={fetchData}
        />
      )}
      {activeTab === "vehicleType" && (
        <VehicleTypeFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          onRefresh={fetchData}
        />
      )}
      {activeTab === "vehicleTypeDetail" && (
        <VehicleTypeDetailFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          onRefresh={fetchData}
        />
      )}

      {/* Tables */}
      {activeTab === "vehicle" && (
        <VehicleTable
          data={sortedData}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete} // thêm handleDelete
        />
      )}
      {activeTab === "vehicleType" && (
        <VehicleTypeTable
          data={sortedData}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {activeTab === "vehicleTypeDetail" && (
        <VehicleTypeDetailTable
          data={sortedData}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal */}
      {activeTab === "vehicle" && (
        <VehicleModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={() => {}}
          mode={modalMode}
          initialData={selectedItem}
          loading={submitLoading}
        />
      )}
      {activeTab === "vehicleType" && (
        <VehicleTypeModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={() => {}}
          mode={modalMode}
          initialData={selectedItem}
          loading={submitLoading}
        />
      )}
      {activeTab === "vehicleTypeDetail" && (
        <VehicleTypeDetailModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={() => {}}
          mode={modalMode}
          initialData={selectedItem}
          loading={submitLoading}
        />
      )}

      {/* Xác nhận xóa */}
      {deleteConfirm.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setDeleteConfirm({ open: false, item: null })}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Xác nhận xóa</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa <strong>{deleteConfirm.item?.name || deleteConfirm.item?.vehicleName || deleteConfirm.item?.vehicleTypeName}</strong>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm({ open: false, item: null })}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
