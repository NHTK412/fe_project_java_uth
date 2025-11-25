import React, { useState, useEffect } from "react";
import { Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { showError } from "../shared/toast";
import ImportRequestDetailModal from "./ImportRequestDetailModal";

const ImportRequestTable = ({ onView, onDelete }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalPages: 0,
        totalElements: 0,
    });

    const [selectedRows, setSelectedRows] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState(null);

    const fetchData = async (page = 0, size = 10) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const url = `http://localhost:8080/api/import-request?page=${page + 1}&size=${size}`;

            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}`, Accept: "*/*" },
            });

            if (res.data.success && res.data.data) {
                setData(res.data.data || []);
                setPagination({
                    page: page,
                    size: size,
                    totalPages: Math.ceil((res.data.data?.length || 0) / size),
                    totalElements: res.data.data?.length || 0,
                });
                setSelectedRows([]);
            } else {
                showError(res.data.message || "Lỗi khi tải dữ liệu");
            }
        } catch (err) {
            showError(err.response?.data?.message || err.message || "Lỗi API");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(0, 10);
    }, []);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(data.map((item) => item.importRequestId));
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
        if (!deleteTarget?.importRequestId) {
            showError("Không xác định được yêu cầu cần xoá");
            return;
        }
        setDeleting(true);
        try {
            if (onDelete) await onDelete(deleteTarget);
            setDeleteTarget(null);
            fetchData(pagination.page, pagination.size);
        } finally {
            setDeleting(false);
        }
    };

    const handlePageChange = (page) => {
        if (page < 0 || page >= pagination.totalPages) return;
        fetchData(page, pagination.size);
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
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Nhân viên</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Đại lý</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Ghi chú</th>
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
                                <tr key={item.importRequestId} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(item.importRequestId)}
                                            onChange={() => handleSelectRow(item.importRequestId)}
                                            className="rounded border-gray-300"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-gray-700 text-sm">{item.importRequestId}</td>
                                    <td className="px-4 py-3 text-gray-700 text-sm">
                                        <div>
                                            <p className="font-medium">{item.employeeName}</p>
                                            <p className="text-xs text-gray-500">{item.employeePosition}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-700 text-sm">{item.agencyName}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${item.status === "REQUESTED"
                                                ? "bg-blue-100 text-blue-800"
                                                : item.status === "APPROVED"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {item.status === "REQUESTED" && "Chờ xử lý"}
                                            {item.status === "APPROVED" && "Đã duyệt"}
                                            {item.status !== "REQUESTED" && item.status !== "APPROVED" && item.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-700 text-sm truncate max-w-xs">
                                        {item.note || "-"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                onClick={() => setSelectedDetail(item.importRequestId)}
                                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(item)}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                        Hiển thị {pagination.size * pagination.page + 1} –{" "}
                        {Math.min(pagination.size * (pagination.page + 1), pagination.totalElements)} /{" "}
                        {pagination.totalElements} kết quả
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 0}
                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i)}
                                className={`w-8 h-8 rounded-lg text-sm font-medium ${pagination.page === i ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-600"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages - 1}
                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <div
                        className="bg-white rounded-xl p-6 w-full max-w-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold mb-4">Xác nhận xóa</h3>
                        <p className="text-gray-600 mb-6">
                            Bạn có chắc muốn xóa yêu cầu từ <strong>{deleteTarget.agencyName}</strong> không?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                            >
                                {deleting ? "Đang xóa..." : "Xóa"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            <ImportRequestDetailModal
                isOpen={!!selectedDetail}
                importRequestId={selectedDetail}
                onClose={() => setSelectedDetail(null)}
                onStatusChange={() => fetchData(pagination.page, pagination.size)}
            />
        </div>
    );
};

export default ImportRequestTable;
