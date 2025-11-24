import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import vehicleTypeApi from '../../services/api/vehicleTypeApi';
import { toast } from 'react-toastify';
import { ChevronRight, Search } from 'lucide-react';

const VehicleTypeInquiry = () => {
    const navigate = useNavigate();
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    // Lấy danh sách loại xe
    const loadVehicleTypes = useCallback(async (page, size) => {
        setLoading(true);
        try {
            const response = await vehicleTypeApi.getVehicleTypes(page, size);
            console.log('=== Vehicle Types Response ===', response);

            if (response.success && response.data) {
                setVehicleTypes(response.data.content || []);
                setTotalElements(response.data.totalElements || 0);
                setTotalPages(response.data.totalPages || 0);
            } else {
                setVehicleTypes([]);
                setTotalElements(0);
                setTotalPages(0);
            }
        } catch (error) {
            console.error('Error loading vehicle types:', error);
            toast.error('Không thể tải danh sách loại xe');
            setVehicleTypes([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadVehicleTypes(currentPage, pageSize);
    }, [currentPage, pageSize, loadVehicleTypes]);

    // Filter theo search
    const filteredVehicleTypes = vehicleTypes.filter(vt => {
        return searchTerm === '' ||
            vt.vehicleTypeName?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleViewDetails = (vehicleTypeId, vehicleTypeName) => {
        // Chuyển đến trang chi tiết loại xe
        const role = localStorage.getItem('role');
        const basePath = role === 'ROLE_DEALER_MANAGER' ? '/Dealer-Manager' : '/Dealer-Staff';
        navigate(`${basePath}/vehicle-inquiry/${vehicleTypeId}`, {
            state: { vehicleTypeName }
        });
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Truy vấn thông tin xe</h1>
                <p className="text-gray-600 mt-1">Xem thông tin các loại xe và so sánh chi tiết</p>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tìm kiếm loại xe
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Nhập tên loại xe..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số xe/trang
                        </label>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={6}>6</option>
                            <option value={12}>12</option>
                            <option value={24}>24</option>
                            <option value={48}>48</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Vehicle Types Grid */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredVehicleTypes.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Không có loại xe nào</p>
                    </div>
                ) : (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredVehicleTypes.map((vehicleType) => (
                                <div
                                    key={vehicleType.vehicleTypeId}
                                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                                    onClick={() => handleViewDetails(vehicleType.vehicleTypeId, vehicleType.vehicleTypeName)}
                                >
                                    <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                                        <div className="text-center p-4">
                                            <div className="text-4xl mb-2">🚗</div>
                                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {vehicleType.vehicleTypeName}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="p-4 border-t border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                                Mã: #{vehicleType.vehicleTypeId}
                                            </span>
                                            <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm group-hover:gap-2 transition-all">
                                                Xem chi tiết
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!loading && filteredVehicleTypes.length > 0 && (
                <div className="flex justify-between items-center mt-6">
                    <p className="text-sm text-gray-600">
                        Hiển thị {filteredVehicleTypes.length} / {totalElements} loại xe
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            Trước
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages > 0 ? totalPages : 1 }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-2 rounded-lg font-medium ${currentPage === i + 1
                                        ? 'bg-blue-600 text-white'
                                        : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleTypeInquiry;
