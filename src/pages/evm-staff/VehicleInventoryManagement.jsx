import React, { useState, useEffect } from 'react';
import { Eye, Search, Filter, Package, AlertCircle } from 'lucide-react';
import { vehicleApi } from '../../services/api/admin/vehicleApi';

const VehicleInventoryManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    size: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [sortBy, setSortBy] = useState('vehicleId');
  const [sortDir, setSortDir] = useState('asc');

  const statusOptions = [
    { value: 'ALL', label: 'Tất cả', color: 'bg-gray-100 text-gray-700' },
    { value: 'IN_STOCK', label: 'Còn hàng', color: 'bg-green-100 text-green-700' },
    { value: 'SOLD', label: 'Đã bán', color: 'bg-blue-100 text-blue-700' },
    { value: 'IN_TRANSIT', label: 'Đã đặt đang vận chuyển', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'TEST_DRIVE', label: 'Xe mẫu lái thử', color: 'bg-red-100 text-red-700' },
  ];

  useEffect(() => {
    fetchVehicles();
  }, [pagination.currentPage, pagination.size, sortBy, sortDir]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await vehicleApi.getAll(
        pagination.currentPage,
        pagination.size,
        sortBy,
        sortDir
      );

      if (result.success && result.data) {
        setVehicles(result.data.content || []);
        setPagination({
          totalElements: result.data.totalElements || 0,
          totalPages: result.data.totalPages || 0,
          currentPage: result.data.number || 0,
          size: result.data.size || 10,
        });
      }
    } catch (error) {
      setError(error.message || 'Không thể tải danh sách xe');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (vehicleId) => {
    try {
      setLoading(true);
      const result = await vehicleApi.getById(vehicleId);

      if (result.success && result.data) {
        setSelectedVehicle(result.data);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Không thể tải thông tin xe'));
    } finally {
      setLoading(false);
    }
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedVehicle(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = statusOptions.find(s => s.value === status) || statusOptions[0];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
        {statusConfig.label}
      </span>
    );
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination({ ...pagination, currentPage: newPage });
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  // Filter vehicles
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.chassisNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.machineNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.id?.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'ALL' || vehicle.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Count by status
  const statusCounts = vehicles.reduce((acc, vehicle) => {
    acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
    return acc;
  }, {});

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Package className="text-blue-600" size={32} />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Quản Lý Xe Tồn Kho</h1>
              <p className="text-sm text-gray-500">Tổng số: {pagination.totalElements} xe</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="text-red-600" size={20} />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-600 font-medium mb-1">Tổng Số Xe</p>
              <p className="text-2xl font-bold text-blue-700">{pagination.totalElements}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <p className="text-xs text-green-600 font-medium mb-1">Còn Hàng</p>
              <p className="text-2xl font-bold text-green-700">{statusCounts.IN_STOCK || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
              <p className="text-xs text-yellow-600 font-medium mb-1">Đã Đặt</p>
              <p className="text-2xl font-bold text-yellow-700">{statusCounts.RESERVED || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-600 font-medium mb-1">Đã Bán</p>
              <p className="text-2xl font-bold text-blue-700">{statusCounts.SOLD || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
              <p className="text-xs text-red-600 font-medium mb-1">Hư Hỏng</p>
              <p className="text-2xl font-bold text-red-700">{statusCounts.DAMAGED || 0}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo số khung, số máy, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th 
                    onClick={() => handleSort('vehicleId')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-1">
                      ID
                      {sortBy === 'vehicleId' && (
                        <span>{sortDir === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('chassisNumber')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-1">
                      Số Khung
                      {sortBy === 'chassisNumber' && (
                        <span>{sortDir === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số Máy
                  </th>
                  <th 
                    onClick={() => handleSort('status')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-1">
                      Trạng Thái
                      {sortBy === 'status' && (
                        <span>{sortDir === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tình Trạng
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Đang tải...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredVehicles.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{vehicle.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                        {vehicle.chassisNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                        {vehicle.machineNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(vehicle.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {vehicle.vehicleCondition || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewDetail(vehicle.id)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                          <span>Chi tiết</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                Hiển thị {filteredVehicles.length} / {pagination.totalElements} xe
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 0}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trang Trước
              </button>
              <span className="text-sm text-gray-700">
                Trang {pagination.currentPage + 1} / {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages - 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trang Sau
              </button>
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        {isDetailModalOpen && selectedVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Chi Tiết Xe #{selectedVehicle.vehicleId}
                </h2>
                <button onClick={closeDetailModal} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>

              <div className="p-6">
                {/* Thông Tin Cơ Bản */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Package size={20} className="text-blue-600" />
                    Thông Tin Xe
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">ID Xe</p>
                      <p className="text-base font-medium text-gray-900">#{selectedVehicle.vehicleId}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Số Khung</p>
                      <p className="text-base font-medium text-gray-900 font-mono">{selectedVehicle.chassisNumber}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Số Máy</p>
                      <p className="text-base font-medium text-gray-900 font-mono">{selectedVehicle.machineNumber}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Trạng Thái</p>
                      <div className="mt-1">{getStatusBadge(selectedVehicle.status)}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                      <p className="text-sm text-gray-500 mb-1">Tình Trạng Xe</p>
                      <p className="text-base font-medium text-gray-900">{selectedVehicle.vehicleCondition || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                </div>

                {/* Thông Tin Loại Xe */}
                {selectedVehicle.vehicleTypeDetail && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông Tin Loại Xe</h3>
                    
                    {selectedVehicle.vehicleTypeDetail.vehicleImage && (
                      <div className="mb-4">
                        <img 
                          src={selectedVehicle.vehicleTypeDetail.vehicleImage} 
                          alt="Vehicle"
                          className="w-full h-64 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                          }}
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-600 mb-1">Màu Sắc</p>
                        <p className="text-base font-medium text-gray-900">{selectedVehicle.vehicleTypeDetail.color || '-'}</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-600 mb-1">Phiên Bản</p>
                        <p className="text-base font-medium text-gray-900">{selectedVehicle.vehicleTypeDetail.version || '-'}</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg md:col-span-2">
                        <p className="text-sm text-blue-600 mb-1">Giá</p>
                        <p className="text-xl font-bold text-blue-700">
                          {formatCurrency(selectedVehicle.vehicleTypeDetail.price)}
                        </p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg md:col-span-2">
                        <p className="text-sm text-blue-600 mb-1">Cấu Hình</p>
                        <p className="text-base text-gray-900 whitespace-pre-wrap">
                          {selectedVehicle.vehicleTypeDetail.configuration || '-'}
                        </p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg md:col-span-2">
                        <p className="text-sm text-blue-600 mb-1">Tính Năng</p>
                        <p className="text-base text-gray-900 whitespace-pre-wrap">
                          {selectedVehicle.vehicleTypeDetail.features || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Thông Tin Đại Lý */}
                {selectedVehicle.agency && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông Tin Đại Lý</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-600 mb-1">Tên Đại Lý</p>
                        <p className="text-base font-medium text-gray-900">{selectedVehicle.agency.agencyName}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-600 mb-1">Loại</p>
                        <p className="text-base font-medium text-gray-900">{selectedVehicle.agency.type}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg md:col-span-2">
                        <p className="text-sm text-green-600 mb-1">Địa Chỉ</p>
                        <p className="text-base text-gray-900">{selectedVehicle.agency.address}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-600 mb-1">Số Điện Thoại</p>
                        <p className="text-base font-medium text-gray-900">{selectedVehicle.agency.phoneNumber}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-600 mb-1">Email</p>
                        <p className="text-base font-medium text-gray-900">{selectedVehicle.agency.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={closeDetailModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleInventoryManagement;