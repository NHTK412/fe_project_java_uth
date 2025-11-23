import { useState } from "react";
import {
  Edit,
  Trash2,
  Eye,
  Star,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";

const ROLE_LABELS = {
  ROLE_ADMIN: {
    label: "Quản trị viên",
    color: "bg-purple-100 text-purple-700",
  },
  ROLE_DEALER_MANAGER: { label: "Quản lý", color: "bg-blue-100 text-blue-700" },
  ROLE_DEALER_STAFF: {
    label: "NV Kinh doanh",
    color: "bg-green-100 text-green-700",
  },
  ROLE_EVM_STAFF: {
    label: "NV Giao hàng",
    color: "bg-orange-100 text-orange-700",
  },
};

const MEMBERSHIP_LABELS = {
  COPPER: { label: "Đồng", color: "bg-amber-100 text-amber-700" },
  SILVER: { label: "Bạc", color: "bg-gray-100 text-gray-700" },
  GOLD: { label: "Vàng", color: "bg-yellow-100 text-yellow-700" },
  DIAMOND: { label: "Kim cương", color: "bg-indigo-100 text-indigo-700" },
};

const UserTable = ({
  data = [],
  type = "employee",
  loading = false,
  pagination = {},
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(
        data.map((item) => item.id || item.employeeId || item.customerId)
      );
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const getId = (item) => item.employeeId || item.customerId || item.id;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading...</p>
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
                  checked={
                    selectedRows.length === data.length && data.length > 0
                  }
                  className="rounded border-gray-300"
                />
              </th>
              <th className="w-12 px-2 py-3"></th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-600">
                Họ tên
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Điện thoại
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                {type === "employee" ? "Chức vụ" : "Hạng thành viên"}
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                {type === "employee" ? "Đại lý" : "Điểm tích lũy"}
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Ngày tạo
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const id = getId(item);
                const name =
                  item.employeeName || item.customerName || item.name;
                const roleOrLevel =
                  type === "employee"
                    ? ROLE_LABELS[item.role] || ROLE_LABELS[item.position]
                    : MEMBERSHIP_LABELS[item.membershipLevel];

                return (
                  <tr key={id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(id)}
                        onChange={() => handleSelectRow(id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-2 py-3">
                      <button
                        onClick={() => onToggleFavorite?.(id)}
                        className="text-gray-300 hover:text-yellow-400 transition-colors"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            item.isFavorite
                              ? "fill-yellow-400 text-yellow-400"
                              : ""
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium"
                          style={{
                            background:
                              "linear-gradient(135deg, #8b5cf6, #2563eb)",
                          }}
                        >
                          {getInitials(name)}
                        </div>
                        <span className="font-medium text-gray-900">
                          {name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">
                      {item.email || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">
                      {item.phone || item.phoneNumber || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {roleOrLevel ? (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${roleOrLevel.color}`}
                        >
                          {roleOrLevel.label}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">
                      {type === "employee"
                        ? item.agencyName || item.agency?.name || "-"
                        : item.loyaltyPoints || 0}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">
                      {formatDate(item.createdAt || item.createDate)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onView?.(item)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit?.(item)}
                          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete?.(item)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {pagination.totalPages > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Hiển thị {pagination.size * pagination.page + 1} -{" "}
            {Math.min(
              pagination.size * (pagination.page + 1),
              pagination.totalElements
            )}{" "}
            / {pagination.totalElements} kết quả
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page === 0}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[...Array(pagination.totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => onPageChange?.(i)}
                className={`w-8 h-8 rounded-lg text-sm font-medium ${
                  pagination.page === i
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => onPageChange?.(pagination.page + 1)}
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

export default UserTable;
