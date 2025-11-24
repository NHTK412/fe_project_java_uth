import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader, AlertCircle, Eye } from "lucide-react";
import policyApi from "../../services/api/policyApi";
import PolicyModal from "../../components/shared/PolicyModal";
import PolicyDetailModal from "../../components/shared/PolicyDetailModal";
import { showError, showSuccess } from "../../components/shared/toast";

const PolicyManagement = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedPolicyId, setSelectedPolicyId] = useState(null);

    useEffect(() => {
        fetchPolicies();
    }, [page, size]);

    const fetchPolicies = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await policyApi.getPolicies(page, size);
            if (res.success) {
                setPolicies(res.data || []);
            } else {
                setError(res.message || "Không thể tải danh sách chính sách");
                setPolicies([]);
            }
        } catch (err) {
            setError(err.message || "Lỗi khi tải dữ liệu");
            setPolicies([]);
            console.error("Error fetching policies:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (policyId) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa chính sách này?")) return;

        try {
            const res = await policyApi.deletePolicy(policyId);
            if (res.success) {
                showSuccess("Xóa chính sách thành công!");
                fetchPolicies();
            } else {
                showError(res.message || "Lỗi khi xóa chính sách");
            }
        } catch (err) {
            showError(err.response?.data?.message || "Lỗi khi xóa chính sách");
        }
    };

    const handleCreate = () => {
        setSelectedPolicyId(null);
        setShowModal(true);
    };

    const handleEdit = (policyId) => {
        setSelectedPolicyId(policyId);
        setShowModal(true);
    };

    const handleView = (policyId) => {
        setSelectedPolicyId(policyId);
        setShowDetailModal(true);
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            ACTIVE: { bg: "bg-green-100", text: "text-green-800", label: "Hoạt động" },
            NOT_ACTIVE: { bg: "bg-gray-100", text: "text-gray-800", label: "Không hoạt động" },
        };
        return statusMap[status] || { bg: "bg-gray-100", text: "text-gray-800", label: status };
    };

    const getPolicyTypeLabel = (type) => {
        return type === 'QUANTITY' ? 'Theo số lượng' : 'Theo doanh số';
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý chính sách chiết khấu</h1>
                    <p className="text-gray-600 mt-1">Quản lý các chính sách chiết khấu cho đại lý</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Tạo chính sách
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-red-800 font-medium">Lỗi</p>
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 flex flex-col items-center justify-center">
                    <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                    <p className="mt-4 text-gray-600">Đang tải danh sách chính sách...</p>
                </div>
            ) : (
                <>
                    {/* Table */}
                    {policies.length === 0 ? (
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 font-medium">Chưa có chính sách nào</p>
                            <p className="text-gray-500 text-sm mt-1">Nhấn "Tạo chính sách" để thêm mới</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-700">ID</th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Loại chính sách</th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Giá trị</th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Điều kiện</th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Thời gian</th>
                                            <th className="px-6 py-3 text-center font-semibold text-gray-700">Trạng thái</th>
                                            <th className="px-6 py-3 text-center font-semibold text-gray-700">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {policies.map((policy) => {
                                            const statusInfo = getStatusBadge(policy.status);
                                            return (
                                                <tr key={policy.policyId} className="border-b border-gray-200 hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-medium text-gray-900">#{policy.policyId}</td>
                                                    <td className="px-6 py-4 text-gray-700">{getPolicyTypeLabel(policy.policyType)}</td>
                                                    <td className="px-6 py-4 text-gray-700">
                                                        {policy.policyType === 'QUANTITY'
                                                            ? `${policy.policyValue} đơn vị`
                                                            : `${policy.policyValue?.toLocaleString('vi-VN')} VNĐ`
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-700 max-w-xs truncate" title={policy.policyCondition}>
                                                        {policy.policyCondition || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-700 text-sm">
                                                        <div>{new Date(policy.startDate).toLocaleDateString('vi-VN')}</div>
                                                        <div className="text-gray-500">→ {new Date(policy.endDate).toLocaleDateString('vi-VN')}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}>
                                                            {statusInfo.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => handleView(policy.policyId)}
                                                                className="inline-flex items-center gap-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                                title="Xem chi tiết"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleEdit(policy.policyId)}
                                                                className="inline-flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="Chỉnh sửa"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(policy.policyId)}
                                                                className="inline-flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Xóa"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <p className="text-sm text-gray-700">
                                    Hiển thị <span className="font-medium">{policies.length}</span> chính sách
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage(Math.max(1, page - 1))}
                                        disabled={page === 1}
                                        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    >
                                        Trước
                                    </button>
                                    <span className="px-3 py-1 text-sm text-gray-700">
                                        Trang {page}
                                    </span>
                                    <button
                                        onClick={() => setPage(page + 1)}
                                        disabled={policies.length < size}
                                        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    >
                                        Sau
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modal */}
            <PolicyModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setSelectedPolicyId(null);
                }}
                policyId={selectedPolicyId}
                onPolicySaved={fetchPolicies}
            />

            {/* Detail Modal */}
            <PolicyDetailModal
                isOpen={showDetailModal}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedPolicyId(null);
                }}
                policyId={selectedPolicyId}
            />
        </div>
    );
};

export default PolicyManagement;
