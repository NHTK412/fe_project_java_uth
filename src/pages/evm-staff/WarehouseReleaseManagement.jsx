import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Archive, UserPlus } from "lucide-react";

import { showSuccess, showError, showInfo } from "../../components/shared/toast";
import WarehouseReleaseTable from "../../components/evm-staff/WarehouseReleaseTable";
import WarehouseReleaseModal from "../../components/evm-staff/WarehouseReleaseModal";
import WarehouseReleaseFilter from "../../components/evm-staff/WarehouseReleaseFilter";
import { warehouseReleaseNoteApi } from "../../services/api/evm-staff/warehouseReleaseNoteApi";

const WarehouseReleaseManagement = () => {
  const navigate = useNavigate();

  // ===== STATE =====
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [modalData, setModalData] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("warehouseReleaseNoteId");

  // ================= FETCH DATA =================
  const fetchReleases = async () => {
    setLoading(true);
    try {
      const res = await warehouseReleaseNoteApi.getAll(
        page,
        size,
        sortBy,
        searchTerm
      );

      if (res.success) {
        const content = res.data?.content || res.data || [];

        setReleases(content);
        setTotalElements(res.data?.totalElements || content.length);
        setTotalPages(res.data?.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
      showError("Không thể tải phiếu xuất kho");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReleases();
  }, [page, size, sortBy, searchTerm]);

  // ================= HANDLE =================

  const handlePageChange = (newPage) => setPage(newPage);

  const handleOpenCreate = () => {
    setModalMode("create");
    setModalData(null);
    setModalOpen(true);
  };

  const handleView = (item) =>
    navigate(`/staff/warehouse-release-notes/${item.warehouseReleaseNoteId}`);

  const handleEdit = (item) => {
    setModalMode("edit");
    setModalData(item);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await warehouseReleaseNoteApi.delete(id);

      if (res.success) {
        showSuccess("Xóa phiếu xuất thành công");
        fetchReleases();
      } else {
        showError(res.message || "Xóa thất bại");
      }

      return res.data;
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || "Xóa thất bại");
      return { success: false };
    }
  };

  const handleSubmit = async (data) => {
    setSubmitLoading(true);
    try {
      let res;

      if (modalMode === "create") {
        res = await warehouseReleaseNoteApi.create(data);
        if (res?.success) {
          showSuccess("Tạo phiếu xuất thành công");
          fetchReleases();
          setModalOpen(false);
        }
      } else if (modalMode === "edit") {
        res = await warehouseReleaseNoteApi.updateStatus(
          modalData.warehouseReleaseNoteId,
          data
        );

        if (res?.success) {
          showSuccess("Cập nhật trạng thái thành công");
          setReleases((prev) =>
            prev.map((r) =>
              r.warehouseReleaseNoteId === modalData.warehouseReleaseNoteId
                ? { ...r, status: res.data.status }
                : r
            )
          );
          setModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || "Thất bại do server");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleExport = () => showInfo("Chức năng xuất CSV chưa được cài đặt");

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setPage(1);
  };

  // ================= RENDER =================
  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Archive className="w-6 h-6 text-green-500" />
          Quản lý phiếu xuất kho
        </h1>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all"
        >
          <UserPlus className="w-4 h-4" /> Thêm mới
        </button>
      </div>

      {/* Filter */}
      <WarehouseReleaseFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        onRefresh={fetchReleases}
        onExport={handleExport}
      />

      {/* Table */}
      <WarehouseReleaseTable
        data={releases}
        loading={loading}
        pagination={{ page, size, totalElements, totalPages }}
        onPageChange={handlePageChange}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal */}
      {modalOpen && (
        <WarehouseReleaseModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          initialData={modalData}
          mode={modalMode}
          loading={submitLoading}
        />
      )}
    </div>
  );
};

export default WarehouseReleaseManagement;
