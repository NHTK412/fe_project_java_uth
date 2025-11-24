import { useState, useEffect } from "react";
import { Eye, Loader, AlertCircle } from "lucide-react";
import inventoryApi from "../../services/api/inventory/inventoryApi";
import InventoryDetailModal from "../../components/shared/InventoryDetailModal";

const SharedInventoryManagement = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [detailVehicles, setDetailVehicles] = useState([]);
    const [vehiclesLoading, setVehiclesLoading] = useState(false);

    // Get agencyId from localStorage
    const agencyId = localStorage.getItem("agencyId") || 1;

    // Fetch inventory list
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await inventoryApi.getInventoryList(agencyId, page, size);
                if (res.success) {
                    setInventory(res.data || []);
                } else {
                    setError(res.message || "Không thể tải danh sách kho");
                    setInventory([]);
                }
            } catch (err) {
                setError(err.message || "Lỗi khi tải dữ liệu");
                setInventory([]);
                console.error("Error fetching inventory:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, [page, size, agencyId]);

    // Fetch vehicles by type detail when modal opens
    useEffect(() => {
        if (!selectedDetail) return;

        const fetchVehicles = async () => {
            try {
                setVehiclesLoading(true);
                const res = await inventoryApi.getVehiclesByTypeDetail(agencyId, selectedDetail.vehicleTypeDetailId);
                if (res.success) {
                    setDetailVehicles(res.data || []);
                } else {
                    setDetailVehicles([]);
                }
            } catch (err) {
                console.error("Error fetching vehicles:", err);
                setDetailVehicles([]);
            } finally {
                setVehiclesLoading(false);
            }
        };

        fetchVehicles();
    }, [selectedDetail, agencyId]);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Quản lý Tồn Kho</h1>
                <p className="text-gray-600 mt-1">Xem danh sách xe trong kho và chi tiết từng loại</p>
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

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="flex flex-col items-center gap-3">
                            <Loader className="w-8 h-8 animate-spin text-blue-500" />
                            <p className="text-gray-600">Đang tải dữ liệu...</p>
                        </div>
                    </div>
                ) : inventory.length === 0 ? (
                    <div className="text-center py-12">
                        <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-gray-500">Không có xe nào trong kho</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Loại Xe</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Chi Tiết Loại</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Phiên Bản</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Màu Sắc</th>
                                    <th className="px-6 py-3 text-center font-semibold text-gray-700">Số Lượng</th>
                                    <th className="px-6 py-3 text-center font-semibold text-gray-700">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory.map((item) => (
                                    <tr key={item.vehicleTypeDetailId} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{item.vehicleTypeName}</td>
                                        <td className="px-6 py-4 text-gray-700">{item.vehicleTypeDetailName}</td>
                                        <td className="px-6 py-4 text-gray-700">{item.version}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                                {item.color}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                                                {item.totalQuantity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => setSelectedDetail(item)}
                                                className="inline-flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Xem chi tiết"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span className="text-xs font-medium hidden sm:inline">Xem</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {inventory.length > 0 && (
                <div className="flex justify-between items-center bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-600">
                        Trang <span className="font-semibold">{page}</span> | Kích thước: <span className="font-semibold">{size}</span> mục
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Trước
                        </button>
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={inventory.length < size}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            <InventoryDetailModal
                isOpen={!!selectedDetail}
                onClose={() => setSelectedDetail(null)}
                detail={selectedDetail}
                vehicles={detailVehicles}
                loading={vehiclesLoading}
            />
        </div>
    );
};

export default SharedInventoryManagement;
