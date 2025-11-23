import React, { useState } from "react";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VehicleTypeDetailTable = ({
  data = [],
  loading = false,
  pagination = {},
  onPageChange,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(data.map((item) => item.vehicleTypeDetailId));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
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
    <div className="bg-white rounded-lg shadow overflow-hidden">
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
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Ảnh</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Phiên bản</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Màu sắc</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Cấu hình</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Giá</th>
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
                <tr key={item.vehicleTypeDetailId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(item.vehicleTypeDetailId)}
                      onChange={() => handleSelectRow(item.vehicleTypeDetailId)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-sm">{item.vehicleTypeDetailId}</td>
                  <td className="px-4 py-3">
                    <img src={`/images/${item.vehicleImage}`} alt="vehicle" className="w-16 h-10 object-cover rounded" />
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-sm">{item.version}</td>
                  <td className="px-4 py-3 text-gray-700 text-sm">{item.color}</td>
                  <td className="px-4 py-3 text-gray-700 text-sm">{item.configuration}</td>
                  <td className="px-4 py-3 text-gray-700 text-sm">{item.price}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => navigate(`/vehicle-type/detail/${item.vehicleTypeDetailId}`)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Hiển thị {pagination.size * pagination.page + 1} –{" "}
            {Math.min(pagination.size * (pagination.page + 1), pagination.totalElements)} /{" "}
            {pagination.totalElements} kết quả
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 0}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {[...Array(pagination.totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => onPageChange(i)}
                className={`w-8 h-8 rounded-lg text-sm font-medium ${
                  pagination.page === i ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages - 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleTypeDetailTable;
