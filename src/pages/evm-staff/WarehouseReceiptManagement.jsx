import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Archive, UserPlus } from "lucide-react";
import { showSuccess, showError, showInfo } from "../../components/shared/toast";
import WarehouseReceiptTable from "../../components/evm-staff/WarehouseReceiptTable";
import WarehouseReceiptModal from "../../components/evm-staff/WarehouseReceiptModal";
import WarehouseReceiptFilter from "../../components/evm-staff/WarehouseReceiptFilter";
import { warehouseReceiptApi } from "../../services/api/evm-staff/warehouseReceiptApi";

// Hỗ trợ debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const WarehouseReceiptManagement = () => {
  const navigate = useNavigate();

  // ===== STATE =====
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // 1-based
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); 
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("warehouseReceiptId");

  const debouncedSearchTerm = useDebounce(searchTerm, 500); // debounce 500ms

  // ================= FETCH DATA =================
  const fetchReceipts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await warehouseReceiptApi.getAll(page, size, sortBy, debouncedSearchTerm);

      if (res.success) {
        const content = res.data?.content || res.data || [];
        setReceipts(content);

        setPage(res.data?.page || page);
        setSize(res.data?.size || size);
        setTotalElements(res.data?.totalElements || content.length);
        setTotalPages(res.data?.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
      showError("Không thể tải phiếu nhập kho");
    } finally {
      setLoading(false);
    }
  }, [page, size, sortBy, debouncedSearchTerm]);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  // ================= HANDLE =================
  const handlePageChange = (newPage) => setPage(newPage);

  const handleOpenCreate = () => {
    setModalMode("create");
    setModalData(null);
    setModalOpen(true);
  };

  const handleView = (item) => navigate(`/staff/warehouse-receipt/${item.warehouseReceiptId}`);

  const handleEdit = (item) => {
    setModalMode("edit");
    setModalData(item);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
  try {
    const res = await warehouseReceiptApi.delete(id);
    return res.data; // ⚠ trả về data
  } catch (err) {
    console.error(err);
    return { success: false, message: err.response?.data?.message || "Xóa thất bại" };
  }
};


  const handleSubmit = async (data) => {
    setSubmitLoading(true);
    try {
      let res;
      if (modalMode === "create") {
        res = await warehouseReceiptApi.create(data);
        if (res?.success) {
          showSuccess("Nhập kho thành công");
          fetchReceipts();
          setModalOpen(false);
        }
      } else if (modalMode === "edit") {
        res = await warehouseReceiptApi.updateStatus(modalData.warehouseReceiptId, data);
        if (res?.success) {
          showSuccess("Cập nhật trạng thái thành công");
          setReceipts(prev =>
            prev.map(r =>
              r.warehouseReceiptId === modalData.warehouseReceiptId
          ? { ...r, status: res.data.status } // ✅ chỉ update status
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

  const handleExport = () => {
    showInfo("Chức năng xuất CSV chưa được cài đặt");
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setPage(1); // reset page khi đổi sort
  };

  // ================= RENDER =================
  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Archive className="w-6 h-6 text-blue-500" /> Quản lý phiếu nhập kho
        </h1>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all"
        >
          <UserPlus className="w-4 h-4" /> Thêm mới
        </button>
      </div>

      {/* Filter */}
      <WarehouseReceiptFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        onRefresh={fetchReceipts}
        onExport={handleExport}
      />

      {/* Table */}
      <WarehouseReceiptTable
        data={receipts}
        loading={loading}
        pagination={{ page, size, totalElements, totalPages }}
        onPageChange={handlePageChange}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal */}
      {modalOpen && (
        <WarehouseReceiptModal
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

export default WarehouseReceiptManagement;
