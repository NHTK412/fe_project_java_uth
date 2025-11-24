import React, { useState, useEffect } from 'react';
import { X, Loader, Plus, Trash2 } from 'lucide-react';
import policyApi from '../../services/api/policyApi';
import { fetchAgencies } from '../../services/api/agencyApi';
import { showError, showSuccess } from './toast';

const PolicyModal = ({ isOpen, onClose, policyId, onPolicySaved }) => {
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [agencies, setAgencies] = useState([]);

    const [formData, setFormData] = useState({
        policyType: 'QUANTITY',
        policyValue: 0,
        policyCondition: '',
        startDate: '',
        endDate: '',
        status: 'NOT_ACTIVE',
        agencyId: '',
        quantityDiscountLevels: [],
        salesDiscountLevels: []
    });

    useEffect(() => {
        if (isOpen) {
            fetchAgenciesData();
            if (policyId) {
                fetchPolicyData();
            } else {
                resetForm();
            }
        }
    }, [isOpen, policyId]);

    const fetchAgenciesData = async () => {
        try {
            const response = await fetchAgencies(1, 100);
            if (response?.success && response?.data) {
                setAgencies(Array.isArray(response.data) ? response.data : []);
            }
        } catch (err) {
            showError('Lỗi khi tải danh sách đại lý');
        }
    };

    const fetchPolicyData = async () => {
        setLoadingData(true);
        try {
            const response = await policyApi.getPolicyById(policyId);
            if (response?.success && response?.data) {
                const data = response.data;
                setFormData({
                    policyType: data.policyType || 'QUANTITY',
                    policyValue: data.policyValue || 0,
                    policyCondition: data.policyCondition || '',
                    startDate: data.startDate ? data.startDate.substring(0, 16) : '',
                    endDate: data.endDate ? data.endDate.substring(0, 16) : '',
                    status: data.status || 'NOT_ACTIVE',
                    agencyId: data.agencyId || '',
                    quantityDiscountLevels: data.quantityDiscountLevels || [],
                    salesDiscountLevels: data.salesDiscountLevels || []
                });
            }
        } catch (err) {
            showError('Lỗi khi tải thông tin chính sách');
        } finally {
            setLoadingData(false);
        }
    };

    const resetForm = () => {
        setFormData({
            policyType: 'QUANTITY',
            policyValue: 0,
            policyCondition: '',
            startDate: '',
            endDate: '',
            status: 'NOT_ACTIVE',
            agencyId: '',
            quantityDiscountLevels: [],
            salesDiscountLevels: []
        });
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.startDate || !formData.endDate) {
            showError('Vui lòng nhập ngày bắt đầu và kết thúc');
            return;
        }

        setLoading(true);
        try {
            const submitData = {
                ...formData,
                policyValue: parseFloat(formData.policyValue) || 0,
                agencyId: formData.agencyId ? parseInt(formData.agencyId) : null,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString()
            };

            let response;
            if (policyId) {
                response = await policyApi.updatePolicy(policyId, submitData);
            } else {
                response = await policyApi.createPolicy(submitData);
            }

            if (response?.success) {
                showSuccess(policyId ? 'Cập nhật chính sách thành công' : 'Tạo chính sách thành công');
                onPolicySaved?.();
                onClose();
            } else {
                showError(response?.message || 'Lỗi khi lưu chính sách');
            }
        } catch (err) {
            showError(err.response?.data?.message || 'Lỗi khi lưu chính sách');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const currentLevels = formData.policyType === 'QUANTITY'
        ? formData.quantityDiscountLevels
        : formData.salesDiscountLevels;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {policyId ? 'Cập nhật chính sách chiết khấu' : 'Tạo chính sách chiết khấu'}
                        </h2>
                        <p className="text-gray-500 mt-1">Cấu hình chính sách chiết khấu cho đại lý</p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {loadingData ? (
                    <div className="p-12 flex justify-center items-center">
                        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                        <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Policy Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Loại chính sách <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.policyType}
                                    onChange={(e) => setFormData({ ...formData, policyType: e.target.value })}
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                >
                                    <option value="QUANTITY">Theo số lượng</option>
                                    <option value="SALES">Theo doanh số</option>
                                </select>
                            </div>

                            {/* Agency */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Đại lý áp dụng
                                </label>
                                <select
                                    value={formData.agencyId}
                                    onChange={(e) => setFormData({ ...formData, agencyId: e.target.value })}
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                >
                                    <option value="">Tất cả đại lý</option>
                                    {agencies.map((agency) => (
                                        <option key={agency.agencyId} value={agency.agencyId}>
                                            {agency.agencyName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Policy Value */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Giá trị {formData.policyType === 'QUANTITY' ? '(số lượng)' : '(VNĐ)'}
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.policyValue}
                                    onChange={(e) => setFormData({ ...formData, policyValue: e.target.value })}
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Trạng thái <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                >
                                    <option value="ACTIVE">Hoạt động</option>
                                    <option value="NOT_ACTIVE">Không hoạt động</option>
                                </select>
                            </div>

                            {/* Start Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ngày bắt đầu <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                />
                            </div>

                            {/* End Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ngày kết thúc <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                />
                            </div>
                        </div>

                        {/* Policy Condition */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Điều kiện áp dụng
                            </label>
                            <textarea
                                value={formData.policyCondition}
                                onChange={(e) => setFormData({ ...formData, policyCondition: e.target.value })}
                                disabled={loading}
                                placeholder="Nhập điều kiện áp dụng chính sách..."
                                rows="2"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 resize-none"
                            />
                        </div>

                        {/* Discount Levels */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-gray-900">
                                    Mức chiết khấu {formData.policyType === 'QUANTITY' ? '(theo số lượng)' : '(theo doanh số)'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={addDiscountLevel}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
                                >
                                    <Plus className="w-4 h-4" />
                                    Thêm mức
                                </button>
                            </div>

                            {currentLevels.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">Chưa có mức chiết khấu. Nhấn "Thêm mức" để bắt đầu.</p>
                            ) : (
                                <div className="space-y-3">
                                    {currentLevels.map((level, index) => (
                                        <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        {formData.policyType === 'QUANTITY' ? 'Từ (số lượng)' : 'Từ (VNĐ)'}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={formData.policyType === 'QUANTITY' ? level.quantityFrom : level.salesFrom}
                                                        onChange={(e) => updateDiscountLevel(
                                                            index,
                                                            formData.policyType === 'QUANTITY' ? 'quantityFrom' : 'salesFrom',
                                                            e.target.value
                                                        )}
                                                        disabled={loading}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        {formData.policyType === 'QUANTITY' ? 'Đến (số lượng)' : 'Đến (VNĐ)'}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={formData.policyType === 'QUANTITY' ? level.quantityTo : level.salesTo}
                                                        onChange={(e) => updateDiscountLevel(
                                                            index,
                                                            formData.policyType === 'QUANTITY' ? 'quantityTo' : 'salesTo',
                                                            e.target.value
                                                        )}
                                                        disabled={loading}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="flex-1">
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Chiết khấu (%)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            step="0.1"
                                                            value={level.discountPercentage}
                                                            onChange={(e) => updateDiscountLevel(index, 'discountPercentage', e.target.value)}
                                                            disabled={loading}
                                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeDiscountLevel(index)}
                                                        disabled={loading}
                                                        className="mt-5 text-red-600 hover:text-red-800 disabled:opacity-50"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 font-medium"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center gap-2"
                            >
                                {loading && <Loader className="w-4 h-4 animate-spin" />}
                                {loading ? 'Đang lưu...' : (policyId ? 'Cập nhật' : 'Tạo mới')}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PolicyModal;
