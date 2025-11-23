import React, { useState, useEffect } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import VehicleTypeModal from "../../components/admin/vehicle/VehicleTypeModal";
import VehicleTypeTable from "../../components/admin/vehicle/VehicleTypeTable";
import { vehicleTypeApi } from "../../services/api/admin/vehicleTypeApi";
import { showError, showSuccess } from "../../components/shared/toast";

export default function VehicleTypeManagementPage() {
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchTypes = async () => {
    setLoading(true);
    try {
      const res = await vehicleTypeApi.getAll(page, size);
      if (res.success && res.data) {
        const content = res.data.content || res.data;
        setTypes(content);
        setTotalElements(res.data.totalElements || content.length);
        setTotalPages(res.data.totalPages || Math.ceil(content.length / size));
      } else showError(res.message);
    } catch {
      showError("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, [page]);

  const handleCreate = async (data) => {
    try {
      const res = await vehicleTypeApi.create(data);
      if (res.success) {
        showSuccess("Tạo mới thành công");
        fetchTypes();
        setModalOpen(false);
      } else showError(res.message);
    } catch {
      showError("Có lỗi khi tạo loại xe");
    }
  };

  const handleUpdate = async (data) => {
    try {
      const res = await vehicleTypeApi.update(editing.vehicleTypeId, data);
      if (res.success) {
        showSuccess("Cập nhật thành công");
        fetchTypes();
        setModalOpen(false);
        setEditing(null);
      } else showError(res.message);
    } catch {
      showError("Có lỗi khi cập nhật loại xe");
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm("Bạn có chắc muốn xóa loại xe này?")) return;
    try {
      const res = await vehicleTypeApi.delete(item.vehicleTypeId);
      if (res.success) showSuccess("Xóa thành công");
      else showError(res.message);
      fetchTypes();
    } catch {
      showError("Có lỗi khi xóa loại xe");
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold">Quản lý loại xe</h1>
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => { setEditing(null); setModalOpen(true); }}
        >
          <Plus className="w-4 h-4" /> Thêm mới
        </button>
      </div>

      <VehicleTypeTable
        data={types}
        loading={loading}
        pagination={{ page, size, totalElements, totalPages }}
        onPageChange={setPage}
        onView={(row) => navigate(`/admin/vehicle-type/${row.vehicleTypeId}`)}
        onEdit={(row) => { setEditing(row); setModalOpen(true); }}
        onDelete={handleDelete}
      />

      <VehicleTypeModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSubmit={editing ? handleUpdate : handleCreate}
        initialData={editing}
      />
    </div>
  );
}
