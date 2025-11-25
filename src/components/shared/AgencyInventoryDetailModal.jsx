import { useState, useEffect } from "react";
import { X, Loader, AlertCircle, Package, Car, Eye, ChevronDown, ChevronUp } from "lucide-react";
import inventoryApi from "../../services/api/inventory/inventoryApi";

const AgencyInventoryDetailModal = ({ isOpen, onClose, agencyId, agencyName }) => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [expandedRows, setExpandedRows] = useState({});
    const [vehicleDetails, setVehicleDetails] = useState({});
    const [loadingDetails, setLoadingDetails] = useState({});

    useEffect(() => {
        if (isOpen && agencyId) {
            fetchInventory();
        }
    }, [isOpen, agencyId, page, size]);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await inventoryApi.getInventoryList(agencyId, page, size);
            if (res.success) {
                setInventory(res.data || []);
            } else {
                setError(res.message || "Không thể tải danh sách tồn kho");
            }
        } catch (err) {
            setError(err.message || "Lỗi khi tải dữ liệu");
            console.error("Error fetching inventory:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchVehicleDetails = async (vehicleTypeDetailId) => {
        try {
            setLoadingDetails({ ...loadingDetails, [vehicleTypeDetailId]: true });
            const res = await inventoryApi.getVehiclesByTypeDetail(agencyId, vehicleTypeDetailId);
            if (res.success) {
                setVehicleDetails({
                    ...vehicleDetails,
                    [vehicleTypeDetailId]: res.data || [],
                });
            }
        } catch (err) {
            console.error("Error fetching vehicle details:", err);
        } finally {
            setLoadingDetails({ ...loadingDetails, [vehicleTypeDetailId]: false });
        }
    };

    const toggleRow = (vehicleTypeDetailId) => {
        const isExpanded = expandedRows[vehicleTypeDetailId];
        setExpandedRows({
            ...expandedRows,
            [vehicleTypeDetailId]: !isExpanded,
        });

        // Fetch details if not already loaded
        if (!isExpanded && !vehicleDetails[vehicleTypeDetailId]) {
            fetchVehicleDetails(vehicleTypeDetailId);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden relative z-10 border border-gray-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white">Tồn kho đại lý</h2>
                        <p className="text-blue-100 text-sm mt-1">{agencyName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-blue-800 rounded-lg p-2 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                            <p className="mt-4 text-gray-600">Đang tải tồn kho...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-red-800 font-medium">Lỗi</p>
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        </div>
                    ) : inventory.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 font-medium">Chưa có xe trong kho</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {inventory.map((item) => (
                                <div key={item.vehicleTypeDetailId} className="border border-gray-200 rounded-lg overflow-hidden">
                                    {/* Main Row */}
                                    <div className="bg-white p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="bg-blue-100 p-3 rounded-lg">
                                                <Car className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900">
                                                    {item.vehicleTypeName} - {item.version}
                                                </h3>
                                                <p className="text-sm text-gray-600">Màu: {item.color}</p>
                                                {item.configuration && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Cấu hình: {item.configuration}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {item.totalQuantity}
                                                </div>
                                                <div className="text-xs text-gray-500">xe trong kho</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleRow(item.vehicleTypeDetailId)}
                                            className="ml-4 p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                        >
                                            {expandedRows[item.vehicleTypeDetailId] ? (
                                                <ChevronUp className="w-5 h-5 text-gray-600" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-600" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedRows[item.vehicleTypeDetailId] && (
                                        <div className="bg-gray-50 border-t border-gray-200 p-4">
                                            {loadingDetails[item.vehicleTypeDetailId] ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <Loader className="w-6 h-6 text-blue-600 animate-spin" />
                                                    <p className="ml-3 text-gray-600">Đang tải chi tiết...</p>
                                                </div>
                                            ) : vehicleDetails[item.vehicleTypeDetailId]?.length === 0 ? (
                                                <p className="text-center text-gray-500 py-4">Không có chi tiết xe</p>
                                            ) : (
                                                <div className="overflow-x-auto">
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr className="bg-gray-100">
                                                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                                                    Mã xe
                                                                </th>
                                                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                                                    Biển số
                                                                </th>
                                                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                                                    Số khung
                                                                </th>
                                                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                                                    Số máy
                                                                </th>
                                                                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                                                                    Trạng thái
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {vehicleDetails[item.vehicleTypeDetailId]?.map((vehicle) => (
                                                                <tr
                                                                    key={vehicle.vehicleId}
                                                                    className="border-t border-gray-200 hover:bg-white"
                                                                >
                                                                    <td className="px-4 py-3 text-sm text-gray-900">
                                                                        #{vehicle.vehicleId}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-sm text-gray-900">
                                                                        {vehicle.licensePlate || "-"}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-sm text-gray-900">
                                                                        {vehicle.chassisNumber || "-"}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-sm text-gray-900">
                                                                        {vehicle.engineNumber || "-"}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-center">
                                                                        <span
                                                                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${vehicle.status === "AVAILABLE"
                                                                                    ? "bg-green-100 text-green-800"
                                                                                    : vehicle.status === "SOLD"
                                                                                        ? "bg-gray-100 text-gray-800"
                                                                                        : "bg-yellow-100 text-yellow-800"
                                                                                }`}
                                                                        >
                                                                            {vehicle.status === "AVAILABLE"
                                                                                ? "Sẵn sàng"
                                                                                : vehicle.status === "SOLD"
                                                                                    ? "Đã bán"
                                                                                    : vehicle.status}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                        Tổng: <span className="font-medium">{inventory.length}</span> loại xe
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            Trước
                        </button>
                        <span className="px-3 py-1 text-sm text-gray-700">Trang {page}</span>
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={inventory.length < size}
                            className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgencyInventoryDetailModal;
