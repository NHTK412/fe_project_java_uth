import React, { useState, useEffect } from 'react';
import { X, Loader, Plus, Trash2 } from 'lucide-react';
import agencyOrderApi from '../../services/api/order/agencyOrderApi.jsx';
import { fetchAgencies } from '../../services/api/agencyApi';
import { getVehicleTypes, getVehicleTypeDetails } from '../../services/api/importRequestService';
import { showError, showSuccess } from './toast';

const CreateAgencyOrderModal = ({ isOpen, onClose, onOrderCreated }) => {
    const [agencyId, setAgencyId] = useState('');
    const [notes, setNotes] = useState('');
    const [orderDetails, setOrderDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [agencies, setAgencies] = useState([]);
    const [loadingAgencies, setLoadingAgencies] = useState(false);

    // Modal state for vehicle selection
    const [showVehicleModal, setShowVehicleModal] = useState(false);
    const [currentEditIndex, setCurrentEditIndex] = useState(null);
    const [modalStep, setModalStep] = useState(1); // 1: select vehicle type, 2: select vehicle detail
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [vehicleDetails, setVehicleDetails] = useState([]);
    const [selectedVehicleType, setSelectedVehicleType] = useState(null);
    const [loadingVehicles, setLoadingVehicles] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchAgenciesData();
        }
    }, [isOpen]);

    const fetchAgenciesData = async () => {
        setLoadingAgencies(true);
        try {
            const response = await fetchAgencies(1, 100);
            if (response?.success && response?.data) {
                setAgencies(Array.isArray(response.data) ? response.data : []);
            }
        } catch (err) {
            showError('Lỗi khi tải danh sách đại lý');
        } finally {
            setLoadingAgencies(false);
        }
    };

    const openVehicleSelector = async (index = null) => {
        setCurrentEditIndex(index);
        setModalStep(1);
        setSelectedVehicleType(null);
        setVehicleDetails([]);
        setShowVehicleModal(true);

        // Load vehicle types
        setLoadingVehicles(true);
        try {
            const data = await getVehicleTypes(1, 100);
            setVehicleTypes(data || []);
        } catch (err) {
            showError('Lỗi khi tải danh sách loại xe');
        } finally {
            setLoadingVehicles(false);
        }
    };

    const handleSelectVehicleType = async (vehicleType) => {
        setLoadingVehicles(true);
        try {
            setSelectedVehicleType(vehicleType);
            const details = await getVehicleTypeDetails(1, 100, vehicleType.vehicleTypeId);
            setVehicleDetails(details || []);
            setModalStep(2);
        } catch (err) {
            showError('Lỗi khi tải chi tiết loại xe');
        } finally {
            setLoadingVehicles(false);
        }
    };

    const handleSelectVehicleDetail = (detail) => {
        const vehicleInfo = {
            vehicleTypeId: selectedVehicleType.vehicleTypeId,
            vehicleTypeName: selectedVehicleType.vehicleTypeName,
            vehicleTypeDetailId: detail.vehicleTypeDetailId,
            version: detail.version,
            color: detail.color,
            configuration: detail.configuration,
            features: detail.features,
            quantity: 1
        };

        if (currentEditIndex !== null) {
            // Update existing item
            const updated = [...orderDetails];
            updated[currentEditIndex] = { ...updated[currentEditIndex], ...vehicleInfo };
            setOrderDetails(updated);
        } else {
            // Add new item
            setOrderDetails([...orderDetails, vehicleInfo]);
        }

        setShowVehicleModal(false);
        setModalStep(1);
        setSelectedVehicleType(null);
        setCurrentEditIndex(null);
    };

    const addOrderDetail = () => {
        openVehicleSelector(null);
    };

    const removeOrderDetail = (index) => {
        setOrderDetails(orderDetails.filter((_, i) => i !== index));
    };

    const updateQuantity = (index, quantity) => {
        const updated = [...orderDetails];
        updated[index].quantity = quantity;
        setOrderDetails(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!agencyId) {
            showError('Vui lòng chọn đại lý');
            return;
        }
        if (orderDetails.length === 0) {
            showError('Vui lòng thêm ít nhất 1 loại xe');
            return;
        }
        for (let i = 0; i < orderDetails.length; i++) {
            if (!orderDetails[i].vehicleTypeDetailId) {
                showError(`Vui lòng chọn loại xe cho dòng ${i + 1}`);
                return;
            }
            if (!orderDetails[i].quantity || orderDetails[i].quantity <= 0) {
                showError(`Vui lòng nhập số lượng hợp lệ cho dòng ${i + 1}`);
                return;
            }
        }

        setLoading(true);
        try {
            const orderData = {
                notes,
                agencyId: parseInt(agencyId),
                orderDetails: orderDetails.map(detail => ({
                    vehicleTypeDetailId: parseInt(detail.vehicleTypeDetailId),
                    quantity: parseInt(detail.quantity),
                })),
            };

            const response = await agencyOrderApi.createOrder(orderData);
            if (response?.success) {
                showSuccess('Tạo đơn hàng thành công');
                onOrderCreated?.();
                onClose();
                resetForm();
            } else {
                showError(response?.message || 'Lỗi khi tạo đơn hàng');
            }
        } catch (err) {
            showError(err.response?.data?.message || 'Lỗi khi tạo đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setAgencyId('');
        setNotes('');
        setOrderDetails([]);
    };

    const handleClose = () => {
        if (!loading) {
            onClose();
            resetForm();
        }
    };

    const getVehicleDetailName = (vehicleTypeDetailId) => {
        const vehicle = vehicleDetails.find(v => v.vehicleTypeDetailId === parseInt(vehicleTypeDetailId));
        if (!vehicle) return '';
        return `${vehicle.vehicleTypeName || ''} - ${vehicle.version || ''} - ${vehicle.color || ''}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && handleClose()}>
            <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Tạo đơn hàng cho đại lý</h2>
                        <p className="text-gray-500 mt-1">Nhập thông tin đơn hàng mới</p>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Agency Selection */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chọn đại lý <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={agencyId}
                            onChange={(e) => setAgencyId(e.target.value)}
                            disabled={loading || loadingAgencies}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        >
                            <option value="">{loadingAgencies ? 'Đang tải...' : '-- Chọn đại lý --'}</option>
                            {agencies.map((agency) => (
                                <option key={agency.agencyId} value={agency.agencyId}>
                                    {agency.agencyName} - {agency.address}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Order Details */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-gray-900">Chi tiết đơn hàng</h3>
                            <button
                                type="button"
                                onClick={addOrderDetail}
                                disabled={loading}
                                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
                            >
                                <Plus className="w-4 h-4" />
                                Thêm xe
                            </button>
                        </div>

                        {orderDetails.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">Chưa có loại xe nào. Nhấn "Thêm xe" để bắt đầu.</p>
                        ) : (
                            <div className="space-y-3">
                                {orderDetails.map((detail, index) => (
                                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">{detail.vehicleTypeName}</h4>
                                                <p className="text-sm text-gray-600">
                                                    {detail.version} - {detail.color}
                                                </p>
                                                {detail.configuration && (
                                                    <p className="text-xs text-gray-500 mt-1">Cấu hình: {detail.configuration}</p>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeOrderDetail(index)}
                                                disabled={loading}
                                                className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex-1">
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Số lượng <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={detail.quantity}
                                                    onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                                                    disabled={loading}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => openVehicleSelector(index)}
                                                disabled={loading}
                                                className="mt-5 px-3 py-2 text-sm border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
                                            >
                                                Đổi xe
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ghi chú
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            disabled={loading}
                            placeholder="Nhập ghi chú cho đơn hàng (nếu có)..."
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 resize-none"
                        />
                    </div>
                </form>

                {/* Footer */}
                <div className="bg-white border-t border-gray-200 p-6 flex justify-end gap-3 sticky bottom-0">
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 font-medium"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center gap-2"
                    >
                        {loading && <Loader className="w-4 h-4 animate-spin" />}
                        {loading ? 'Đang tạo...' : 'Tạo đơn hàng'}
                    </button>
                </div>
            </div>

            {/* Vehicle Selector Modal */}
            {showVehicleModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {modalStep === 1 ? 'Chọn loại xe' : `Chọn phiên bản - ${selectedVehicleType?.vehicleTypeName}`}
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    {modalStep === 1 ? 'Bước 1: Chọn loại xe chính' : 'Bước 2: Chọn chi tiết loại xe'}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowVehicleModal(false);
                                    setModalStep(1);
                                    setSelectedVehicleType(null);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {loadingVehicles ? (
                                <div className="flex justify-center items-center py-12">
                                    <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                                    <span className="ml-2 text-gray-600">Đang tải...</span>
                                </div>
                            ) : modalStep === 1 ? (
                                /* Step 1: Vehicle Types */
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {vehicleTypes.map((type) => (
                                        <button
                                            key={type.vehicleTypeId}
                                            onClick={() => handleSelectVehicleType(type)}
                                            className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                                        >
                                            <h4 className="font-semibold text-gray-900">{type.vehicleTypeName}</h4>
                                            {type.description && (
                                                <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                /* Step 2: Vehicle Details */
                                <div>
                                    <button
                                        onClick={() => setModalStep(1)}
                                        className="mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        ← Quay lại chọn loại xe
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {vehicleDetails.map((detail) => (
                                            <button
                                                key={detail.vehicleTypeDetailId}
                                                onClick={() => handleSelectVehicleDetail(detail)}
                                                className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                                            >
                                                <h4 className="font-semibold text-gray-900">{detail.version}</h4>
                                                <p className="text-sm text-gray-600 mt-1">Màu: {detail.color}</p>
                                                {detail.configuration && (
                                                    <p className="text-xs text-gray-500 mt-1">Cấu hình: {detail.configuration}</p>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateAgencyOrderModal;