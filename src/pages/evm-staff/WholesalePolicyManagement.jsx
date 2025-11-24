import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Search, Eye } from 'lucide-react';
import { policyAPI } from '../../services/api/policyApi';

const WholesalePolicyManagement = () => {
  const [policies, setPolicies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewData, setViewData] = useState(null);
  
  const [formData, setFormData] = useState({
    policyId: null,
    policyType: 'QUANTITY',
    policyValue: 0,
    policyCondition: '',
    startDate: '',
    endDate: '',
    status: 'NOT_ACTIVE',
    agencyId: 0,
    quantityDiscountLevels: [],
    salesDiscountLevels: []
  });

  const policyTypeOptions = [
    { value: 'QUANTITY', label: 'Chiết Khấu Theo Số Lượng' },
    { value: 'SALES', label: 'Chiết Khấu Theo Doanh Số' }
  ];

  const statusOptions = [
    { value: 'NOT_ACTIVE', label: 'Chưa Hoạt Động' },
    { value: 'ACTIVE', label: 'Đang Hoạt Động' },
    { value: 'INACTIVE', label: 'Dừng Hoạt Động' }
  ];

  useEffect(() => {
    fetchPolicies();
  }, [currentPage]);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await policyAPI.getAll(currentPage, pageSize);
      if (result.success) {
        setPolicies(result.data || []);
      }
    } catch (error) {
      setError(error.message || 'Không thể tải danh sách chính sách');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const payload = {
        policyType: formData.policyType,
        policyValue: parseFloat(formData.policyValue),
        policyCondition: formData.policyCondition,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
        agencyId: parseInt(formData.agencyId),
        quantityDiscountLevels: formData.policyType === 'QUANTITY' ? formData.quantityDiscountLevels : [],
        salesDiscountLevels: formData.policyType === 'SALES' ? formData.salesDiscountLevels : []
      };

      const result = isEdit 
        ? await policyAPI.update(formData.policyId, payload)
        : await policyAPI.create(payload);
      
      if (result.success) {
        alert(isEdit ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
        fetchPolicies();
        closeModal();
      } else {
        alert('Có lỗi xảy ra: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Không thể lưu dữ liệu'));
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (policyId) => {
    try {
      setLoading(true);
      const result = await policyAPI.getById(policyId);
      
      if (result.success) {
        setFormData({
          ...result.data,
          startDate: result.data.startDate?.substring(0, 16) || '',
          endDate: result.data.endDate?.substring(0, 16) || ''
        });
        setIsEdit(true);
        setIsModalOpen(true);
      }
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Không thể tải thông tin chính sách'));
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (policyId) => {
    try {
      setLoading(true);
      const result = await policyAPI.getById(policyId);
      
      if (result.success) {
        setViewData(result.data);
        setIsViewModalOpen(true);
      }
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Không thể tải thông tin chính sách'));
    } finally {
      setLoading(false);
    }
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewData(null);
  };

  const handleDelete = async (policyId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa chính sách này?')) return;

    try {
      setLoading(true);
      const result = await policyAPI.delete(policyId);
      
      if (result.success) {
        alert('Xóa thành công!');
        fetchPolicies();
      }
    } catch (error) {
      alert('Lỗi: ' + (error.message || 'Không thể xóa chính sách'));
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormData({
      policyId: null,
      policyType: 'QUANTITY',
      policyValue: 0,
      policyCondition: '',
      startDate: '',
      endDate: '',
      status: 'NOT_ACTIVE',
      agencyId: 0,
      quantityDiscountLevels: [],
      salesDiscountLevels: []
    });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEdit(false);
  };

  const addDiscountLevel = () => {
    if (formData.policyType === 'QUANTITY') {
      setFormData({
        ...formData,
        quantityDiscountLevels: [
          ...formData.quantityDiscountLevels,
          { quantityFrom: 0, quantityTo: 0, discountPercentage: 0 }
        ]
      });
    } else {
      setFormData({
        ...formData,
        salesDiscountLevels: [
          ...formData.salesDiscountLevels,
          { salesFrom: 0, salesTo: 0, discountPercentage: 0 }
        ]
      });
    }
  };

  const removeDiscountLevel = (index) => {
    if (formData.policyType === 'QUANTITY') {
      setFormData({
        ...formData,
        quantityDiscountLevels: formData.quantityDiscountLevels.filter((_, i) => i !== index)
      });
    } else {
      setFormData({
        ...formData,
        salesDiscountLevels: formData.salesDiscountLevels.filter((_, i) => i !== index)
      });
    }
  };

  const updateDiscountLevel = (index, field, value) => {
    if (formData.policyType === 'QUANTITY') {
      const updated = [...formData.quantityDiscountLevels];
      updated[index][field] = parseFloat(value) || 0;
      setFormData({ ...formData, quantityDiscountLevels: updated });
    } else {
      const updated = [...formData.salesDiscountLevels];
      updated[index][field] = parseFloat(value) || 0;
      setFormData({ ...formData, salesDiscountLevels: updated });
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      NOT_ACTIVE: 'bg-gray-100 text-gray-700',
      ACTIVE: 'bg-green-100 text-green-700',
      INACTIVE: 'bg-red-100 text-red-700'
    };
    const labels = {
      NOT_ACTIVE: 'Chưa Hoạt Động',
      ACTIVE: 'Đang Hoạt Động',
      INACTIVE: 'Dừng Hoạt Động'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const label = type === 'QUANTITY' ? 'Theo Số Lượng' : 'Theo Doanh Số';
    const color = type === 'QUANTITY' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700';
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };

  const filteredPolicies = policies.filter(policy => 
    policy.policyCondition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.policyId?.toString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Quản Lý Chính Sách Giá Sỉ</h1>
            <button
              onClick={openCreateModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Tạo Chính Sách Mới
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo điều kiện hoặc ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điều Kiện</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá Trị</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Bắt Đầu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Kết Thúc</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Đang tải...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredPolicies.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  filteredPolicies.map((policy) => (
                    <tr key={policy.policyId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{policy.policyId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTypeBadge(policy.policyType)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {policy.policyCondition || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {policy.policyValue}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {policy.startDate ? new Date(policy.startDate).toLocaleDateString('vi-VN') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {policy.endDate ? new Date(policy.endDate).toLocaleDateString('vi-VN') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(policy.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleView(policy.policyId)}
                          className="text-green-600 hover:text-green-900 mr-3"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(policy.policyId)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="Chỉnh sửa"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(policy.policyId)}
                          className="text-red-600 hover:text-red-900"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
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
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trang Trước
            </button>
            <span className="text-sm text-gray-700">
              Trang {currentPage + 1}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={filteredPolicies.length < pageSize}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trang Sau
            </button>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  {isEdit ? 'Cập Nhật Chính Sách' : 'Tạo Chính Sách Mới'}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Loại Chính Sách */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại Chính Sách <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.policyType}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          policyType: e.target.value,
                          quantityDiscountLevels: [],
                          salesDiscountLevels: []
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {policyTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Trạng Thái */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng Thái <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Giá Trị */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá Trị
                    </label>
                    <input
                      type="number"
                      value={formData.policyValue}
                      onChange={(e) => setFormData({ ...formData, policyValue: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      step="0.01"
                    />
                  </div>

                  {/* Agency ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Agency ID
                    </label>
                    <input
                      type="number"
                      value={formData.agencyId}
                      onChange={(e) => setFormData({ ...formData, agencyId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Ngày Bắt Đầu */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày Bắt Đầu
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Ngày Kết Thúc */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày Kết Thúc
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Điều Kiện */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Điều Kiện
                  </label>
                  <textarea
                    value={formData.policyCondition}
                    onChange={(e) => setFormData({ ...formData, policyCondition: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                </div>

                {/* Discount Levels */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {formData.policyType === 'QUANTITY' ? 'Mức Chiết Khấu Theo Số Lượng' : 'Mức Chiết Khấu Theo Doanh Số'}
                    </h3>
                    <button
                      type="button"
                      onClick={addDiscountLevel}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm"
                    >
                      <Plus size={16} />
                      Thêm Mức
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.policyType === 'QUANTITY' && formData.quantityDiscountLevels.map((level, index) => (
                      <div key={index} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg">
                        <input
                          type="number"
                          placeholder="Từ số lượng"
                          value={level.quantityFrom}
                          onChange={(e) => updateDiscountLevel(index, 'quantityFrom', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="number"
                          placeholder="Đến số lượng"
                          value={level.quantityTo}
                          onChange={(e) => updateDiscountLevel(index, 'quantityTo', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="number"
                          placeholder="% Chiết khấu"
                          value={level.discountPercentage}
                          onChange={(e) => updateDiscountLevel(index, 'discountPercentage', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                          step="0.01"
                        />
                        <button
                          type="button"
                          onClick={() => removeDiscountLevel(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}

                    {formData.policyType === 'SALES' && formData.salesDiscountLevels.map((level, index) => (
                      <div key={index} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg">
                        <input
                          type="number"
                          placeholder="Từ doanh số"
                          value={level.salesFrom}
                          onChange={(e) => updateDiscountLevel(index, 'salesFrom', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="number"
                          placeholder="Đến doanh số"
                          value={level.salesTo}
                          onChange={(e) => updateDiscountLevel(index, 'salesTo', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="number"
                          placeholder="% Chiết khấu"
                          value={level.discountPercentage}
                          onChange={(e) => updateDiscountLevel(index, 'discountPercentage', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                          step="0.01"
                        />
                        <button
                          type="button"
                          onClick={() => removeDiscountLevel(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Đang xử lý...' : (isEdit ? 'Cập Nhật' : 'Tạo Mới')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Detail Modal */}
        {isViewModalOpen && viewData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Chi Tiết Chính Sách #{viewData.policyId}</h2>
                <button onClick={closeViewModal} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                {/* Thông tin cơ bản */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông Tin Cơ Bản</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">ID Chính Sách</p>
                      <p className="text-base font-medium text-gray-900">#{viewData.policyId}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Loại Chính Sách</p>
                      <div className="mt-1">{getTypeBadge(viewData.policyType)}</div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Trạng Thái</p>
                      <div className="mt-1">{getStatusBadge(viewData.status)}</div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Giá Trị</p>
                      <p className="text-base font-medium text-gray-900">{viewData.policyValue}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Agency ID</p>
                      <p className="text-base font-medium text-gray-900">{viewData.agencyId || '-'}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Ngày Bắt Đầu</p>
                      <p className="text-base font-medium text-gray-900">
                        {viewData.startDate ? new Date(viewData.startDate).toLocaleString('vi-VN') : '-'}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Ngày Kết Thúc</p>
                      <p className="text-base font-medium text-gray-900">
                        {viewData.endDate ? new Date(viewData.endDate).toLocaleString('vi-VN') : '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Điều kiện */}
                {viewData.policyCondition && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Điều Kiện</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap">{viewData.policyCondition}</p>
                    </div>
                  </div>
                )}

                {/* Mức Chiết Khấu Theo Số Lượng */}
                {viewData.policyType === 'QUANTITY' && viewData.quantityDiscountLevels && viewData.quantityDiscountLevels.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Mức Chiết Khấu Theo Số Lượng</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-200 rounded-lg">
                        <thead className="bg-blue-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">STT</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Từ Số Lượng</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Đến Số Lượng</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">% Chiết Khấu</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {viewData.quantityDiscountLevels.map((level, index) => (
                            <tr key={level.quantityDiscountLevelId || index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{level.quantityFrom.toLocaleString()}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{level.quantityTo.toLocaleString()}</td>
                              <td className="px-4 py-3 text-sm font-medium text-green-600">{level.discountPercentage}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Mức Chiết Khấu Theo Doanh Số */}
                {viewData.policyType === 'SALES' && viewData.salesDiscountLevels && viewData.salesDiscountLevels.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Mức Chiết Khấu Theo Doanh Số</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-200 rounded-lg">
                        <thead className="bg-purple-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">STT</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Từ Doanh Số</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Đến Doanh Số</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">% Chiết Khấu</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {viewData.salesDiscountLevels.map((level, index) => (
                            <tr key={level.salesDiscountLevelId || index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{level.salesFrom.toLocaleString()} VNĐ</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{level.salesTo.toLocaleString()} VNĐ</td>
                              <td className="px-4 py-3 text-sm font-medium text-green-600">{level.discountPercentage}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={closeViewModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={() => {
                      closeViewModal();
                      handleEdit(viewData.policyId);
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Chỉnh Sửa
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

export default WholesalePolicyManagement;