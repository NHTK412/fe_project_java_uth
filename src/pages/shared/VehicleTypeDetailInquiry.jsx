import { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import vehicleTypeApi from '../../services/api/vehicleTypeApi';
import { toast } from 'react-toastify';
import CompareVehicleModal from '../../components/shared/CompareVehicleModal';
import { ArrowLeft, GitCompare, CheckSquare, Square } from 'lucide-react';

const VehicleTypeDetailInquiry = () => {
    const { vehicleTypeId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const vehicleTypeName = location.state?.vehicleTypeName || 'Loại xe';

    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedForCompare, setSelectedForCompare] = useState([]);
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

    // Lấy danh sách chi tiết loại xe
    const loadVehicleTypeDetails = useCallback(async (page, size) => {
        setLoading(true);
        try {
            const response = await vehicleTypeApi.getVehicleTypeDetails(vehicleTypeId, page, size);
            console.log('=== Vehicle Type Details Response ===', response);

            if (response.success && response.data) {
                setDetails(response.data.content || []);
                setTotalElements(response.data.totalElements || 0);
                setTotalPages(response.data.totalPages || 0);
            } else {
                setDetails([]);
                setTotalElements(0);
                setTotalPages(0);
            }
        } catch (error) {
            console.error('Error loading vehicle type details:', error);
            toast.error('Không thể tải danh sách chi tiết loại xe');
            setDetails([]);
        } finally {
            setLoading(false);
        }
    }, [vehicleTypeId]);

    useEffect(() => {
        loadVehicleTypeDetails(currentPage, pageSize);
    }, [currentPage, pageSize, loadVehicleTypeDetails]);

    const handleSelectForCompare = (detail) => {
        setSelectedForCompare(prev => {
            const exists = prev.find(item => item.vehicleTypeDetailId === detail.vehicleTypeDetailId);
            if (exists) {
                return prev.filter(item => item.vehicleTypeDetailId !== detail.vehicleTypeDetailId);
            } else {
                if (prev.length >= 2) {
                    toast.warning('Chỉ có thể chọn tối đa 2 chi tiết để so sánh');
                    return prev;
                }
                return [...prev, detail];
            }
        });
    };

    const isSelected = (detailId) => {
        return selectedForCompare.some(item => item.vehicleTypeDetailId === detailId);
    };

    const handleCompare = () => {
        if (selectedForCompare.length !== 2) {
            toast.warning('Vui lòng chọn đúng 2 chi tiết để so sánh');
            return;
        }
        setIsCompareModalOpen(true);
    };

    const handleBackToList = () => {
        const role = localStorage.getItem('role');
        const basePath = role === 'ROLE_DEALER_MANAGER' ? '/Dealer-Manager' : '/Dealer-Staff';
        navigate(`${basePath}/vehicle-inquiry`);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={handleBackToList}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
                >
                    <ArrowLeft size={20} />
                    Quay lại danh sách loại xe
                </button>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{vehicleTypeName}</h1>
                        <p className="text-gray-600 mt-1">Danh sách các phiên bản chi tiết</p>
                    </div>
                    {selectedForCompare.length === 2 && (
                        <button
                            onClick={handleCompare}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                            <GitCompare size={20} />
                            So sánh ({selectedForCompare.length})
                        </button>
                    )}
                </div>
            </div>

            {/* Selection Info */}
            {selectedForCompare.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckSquare className="text-blue-600" size={20} />
                            <span className="text-blue-900 font-medium">
                                Đã chọn {selectedForCompare.length}/2 phiên bản để so sánh
                            </span>
                        </div>
                        <button
                            onClick={() => setSelectedForCompare([])}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                            Bỏ chọn tất cả
                        </button>
                    </div>
                    {selectedForCompare.length > 0 && (
                        <div className="mt-2 flex gap-2">
                            {selectedForCompare.map(item => (
                                <span key={item.vehicleTypeDetailId} className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    {item.version}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Page Size Selector */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Tổng số: {totalElements} phiên bản
                    </p>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">
                            Số phiên bản/trang:
                        </label>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={6}>6</option>
                            <option value={12}>12</option>
                            <option value={24}>24</option>
                            <option value={48}>48</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : details.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Không có phiên bản nào</p>
                    </div>
                ) : (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {details.map((detail) => (
                                <div
                                    key={detail.vehicleTypeDetailId}
                                    className={`bg-white border-2 rounded-lg overflow-hidden transition-all ${isSelected(detail.vehicleTypeDetailId)
                                            ? 'border-blue-500 shadow-lg'
                                            : 'border-gray-200 hover:shadow-md'
                                        }`}
                                >
                                    {/* Image */}
                                    <div className="aspect-video bg-gray-100 relative">
                                        {detail.vehicleImage ? (
                                            <img
                                                src={`http://localhost:8080/api/images/${detail.vehicleImage}`}
                                                alt={detail.version}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div className="w-full h-full flex items-center justify-center" style={{ display: detail.vehicleImage ? 'none' : 'flex' }}>
                                            <div className="text-center">
                                                <div className="text-5xl mb-2">🚗</div>
                                                <p className="text-gray-400 text-sm">Không có ảnh</p>
                                            </div>
                                        </div>

                                        {/* Checkbox overlay */}
                                        <div className="absolute top-2 right-2">
                                            <button
                                                onClick={() => handleSelectForCompare(detail)}
                                                className={`p-2 rounded-lg transition-colors ${isSelected(detail.vehicleTypeDetailId)
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white text-gray-600 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {isSelected(detail.vehicleTypeDetailId) ? (
                                                    <CheckSquare size={20} />
                                                ) : (
                                                    <Square size={20} />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg text-gray-900 mb-2">
                                            {detail.version}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Mã: #{detail.vehicleTypeDetailId}
                                        </p>
                                        {isSelected(detail.vehicleTypeDetailId) && (
                                            <div className="mt-3 pt-3 border-t border-blue-200">
                                                <span className="text-xs font-semibold text-blue-600">
                                                    ✓ Đã chọn để so sánh
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!loading && details.length > 0 && (
                <div className="flex justify-between items-center mt-6">
                    <p className="text-sm text-gray-600">
                        Hiển thị {details.length} / {totalElements} phiên bản
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

            {/* Compare Modal */}
            {isCompareModalOpen && selectedForCompare.length === 2 && (
                <CompareVehicleModal
                    vehicle1Id={selectedForCompare[0].vehicleTypeDetailId}
                    vehicle2Id={selectedForCompare[1].vehicleTypeDetailId}
                    onClose={() => setIsCompareModalOpen(false)}
                />
            )}
        </div>
    );
};

export default VehicleTypeDetailInquiry;
