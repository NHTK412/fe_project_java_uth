import React, { useState } from "react";
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { showError, showSuccess } from "../../components/shared/toast";

const WarehouseReleaseTable = ({
  data = [],
  setData,
  loading = false,
  pagination = {},
  onPageChange,
  onView,
  onEdit,
  onDelete,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(data.map((item) => item.warehouseReleaseNoteId));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.warehouseReleaseNoteId) {
      showError("Không xác định được phiếu cần xoá");
      return;
    }

    if (deleteTarget.status !== "PENDING_APPROVAL") {
      showError("Không thể xoá phiếu này do trạng thái không hợp lệ!");
      return;
    }

    setDeleting(true);
    const id = deleteTarget.warehouseReleaseNoteId;

    try {
      const res = await onDelete(id);
      if (res && res.warehouseReleaseNoteId) {
        showSuccess("Xoá thành công!");
        setData?.((prev) =>
          prev.filter((item) => item.warehouseReleaseNoteId !== id)
        );
        setDeleteTarget(null);
      } else {
        showError("Xoá thất bại");
      }
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || "Lỗi server khi xoá");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-500">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden relative">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedRows.length === data.length && data.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Ngày xuất</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Ghi chú</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Tổng tiền</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Hành động</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.warehouseReleaseNoteId} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(item.warehouseReleaseNoteId)}
                      onChange={() => handleSelectRow(item.warehouseReleaseNoteId)}
                      className="rounded border-gray-300"
                    />
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-700">
                    {item.warehouseReleaseNoteId}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-700">
                    {item.warehouseReleaseNoteDate
                      ? new Date(item.warehouseReleaseNoteDate).toLocaleString()
                      : "-"}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-700">
                    {item.note || "-"}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-700">
                    {item.totalAmount ?? "-"}
                  </td>

                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                      {item.status || "N/A"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onView(item)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {pagination.totalPages > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Hiển thị {pagination.size * (pagination.page - 1) + 1} –{" "}
            {Math.min(pagination.size * pagination.page, pagination.totalElements)} /{" "}
            {pagination.totalElements} kết quả
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {[...Array(pagination.totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => onPageChange(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm font-medium ${
                  pagination.page === i + 1
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* DELETE POPUP */}
      {deleteTarget && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setDeleteTarget(null)}
        >
          <div className="bg-white rounded-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Xác nhận xóa</h3>

            <p className="text-gray-600 mb-6">
              Bạn có chắc muốn xóa phiếu xuất kho{" "}
              <strong>{deleteTarget?.warehouseReleaseNoteId}</strong> không?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Hủy
              </button>

              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                {deleting ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseReleaseTable;
