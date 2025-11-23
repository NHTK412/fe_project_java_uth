import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Loader, Edit2, Trash2, Eye } from "lucide-react";
import { toast } from "react-toastify";

const InventoryManagement = () => {
    const navigate = useNavigate();
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);

    // NOTE: Mock data - Replace with actual API call
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                setLoading(true);
                setError(null);
                // TODO: Replace with actual API call
                // const data = await getInventory(page, size);

                // Mock data tạm thời
                setInventory([]);
            } catch (err) {
                setError(err.message || "Có lỗi khi tải dữ liệu");
                toast.error(err.message || "Không thể tải danh sách kho xe");
                console.error("Lỗi tải danh sách kho xe:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, [page, size]);

    const handleAddVehicle = () => {
        // TODO: Implement add vehicle logic
        navigate("/dealer/inventory/create");
    };

    const handleEditVehicle = (vehicleId) => {
        navigate(`/dealer/inventory/${vehicleId}/edit`);
    };

    const handleDeleteVehicle = (vehicleId) => {
        // TODO: Implement delete vehicle logic
        if (window.confirm("Bạn chắc chắn muốn xóa xe này?")) {
            toast.success("Xóa xe thành công");
        }
    };

    const handleViewDetail = (vehicleId) => {
        navigate(`/dealer/inventory/${vehicleId}`);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Quản lý Kho Xe</h1>
                <button
                    onClick={handleAddVehicle}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Thêm Xe
                </button>
            </div>

            {/* Search & Filter */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo mã xe, tên loại xe..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : inventory.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Không có xe nào trong kho</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Mã Xe</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Loại Xe</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Số Lượng</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Giá</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Mock table rows */}
                                <tr className="border-b border-gray-200 hover:bg-gray-50">
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        Chưa có dữ liệu
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryManagement;
