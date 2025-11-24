// VehicleTable.jsx
import React, { useState } from "react";
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { showSuccess, showError } from "../../shared/toast";
const STATUS =
  {
    IN_STOCK:{
      label:"Tồn kho",
      color: "bg-purple-100 text-purple-700",
    },
    SOLD:{
      label:"Đã bán",
      color: "bg-blue-100 text-blue-700",
    },
    
    IN_TRANSIT:{
      label:"Đamg vận chuyển",
      color: "bg-green-100 text-green-700",
    },
    TEST_DRIVE:{
      label:"Xe lái thử",
      color: "bg-orange-100 text-orange-700",
    },
  };

const VehicleTable = ({
  data = [],
  loading = false,
  pagination = {},
  onPageChange,
  onView,
  onEdit,
  onDelete, // async function
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(data.map((item) => item.id)); // sửa thành id
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
    if (!deleteTarget?.id) { // sửa thành id
      showError("Không xác định được xe cần xoá");
      return;
    }
    setDeleting(true);
    try {
      const res = await onDelete(deleteTarget); // FE gọi API
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
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
                  onChange={handleSelectAll}
                  checked={selectedRows.length === data.length && data.length > 0}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Mã khung</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Mã máy</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Tình trạng</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Hành động</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors"> {/* sửa key */}
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(item.id)} // sửa id
                      onChange={() => handleSelectRow(item.id)} // sửa id
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-sm">0{item.id}</td>
                  <td className="px-4 py-3 text-gray-700 text-sm">{item.chassisNumber}</td>
                  <td className="px-4 py-3 text-gray-700 text-sm">{item.machineNumber}</td>
                  <td className="px-4 py-3">
                    {STATUS[item.status] ? (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS[item.status].color}`}
                      >
                        {STATUS[item.status].label}
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                        Không xác định
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-sm">{item.vehicleCondition}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => onView(item)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => onEdit(item)} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteTarget(item)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
            Hiển thị {pagination.size * pagination.page + 1} –{" "}
            {Math.min(pagination.size * (pagination.page + 1), pagination.totalElements)}{" "}
            / {pagination.totalElements} kết quả
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => onPageChange(pagination.page - 1)} disabled={pagination.page === 0} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
            </button>

            {[...Array(pagination.totalPages)].map((_, i) => (
              <button key={i} onClick={() => onPageChange(i)} className={`w-8 h-8 rounded-lg text-sm font-medium ${pagination.page === i ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-600"}`}>
                {i + 1}
              </button>
            ))}

            <button onClick={() => onPageChange(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages - 1} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
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
              Bạn có chắc muốn xóa xe <strong>{deleteTarget.chassisNumber}</strong> không?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Hủy</button>
              <button onClick={handleConfirmDelete} disabled={deleting} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">
                {deleting ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleTable;
