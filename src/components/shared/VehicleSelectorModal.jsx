import React, { useState, useEffect } from 'react';
import { X, Loader, ChevronLeft } from 'lucide-react';
import { getVehicleTypes, getVehicleTypeDetails } from '../../services/api/importRequestService';
import { showError } from './toast';

const VehicleSelectorModal = ({ isOpen, onClose, onSelect }) => {
    const [modalStep, setModalStep] = useState(1); // 1: select vehicle type, 2: select vehicle detail
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [vehicleDetails, setVehicleDetails] = useState([]);
    const [selectedVehicleType, setSelectedVehicleType] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadVehicleTypes();
            setModalStep(1);
            setSelectedVehicleType(null);
            setVehicleDetails([]);
        }
    }, [isOpen]);

    const loadVehicleTypes = async () => {
        setLoading(true);
        try {
            const data = await getVehicleTypes(1, 100);
            setVehicleTypes(data || []);
        } catch (err) {
            showError('Lỗi khi tải danh sách loại xe');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectVehicleType = async (vehicleType) => {
        setLoading(true);
        try {
            setSelectedVehicleType(vehicleType);
            const details = await getVehicleTypeDetails(1, 100, vehicleType.vehicleTypeId);
            setVehicleDetails(details || []);
            setModalStep(2);
        } catch (err) {
            showError('Lỗi khi tải chi tiết loại xe');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectVehicleDetail = (detail) => {
        onSelect({
            vehicleTypeId: selectedVehicleType.vehicleTypeId,
            vehicleTypeName: selectedVehicleType.vehicleTypeName,
            vehicleTypeDetailId: detail.vehicleTypeDetailId,
            version: detail.version,
            color: detail.color,
            configuration: detail.configuration,
            features: detail.features,
        });
        handleClose();
    };

    const handleBack = () => {
        setModalStep(1);
        setSelectedVehicleType(null);
        setVehicleDetails([]);
    };

    const handleClose = () => {
        onClose();
        setModalStep(1);
        setSelectedVehicleType(null);
        setVehicleDetails([]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {modalStep === 2 && (
                            <button
                                onClick={handleBack}
                                className="text-white hover:bg-blue-800 rounded-lg p-2 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        )}
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {modalStep === 1 ? 'Chọn loại xe' : 'Chọn chi tiết xe'}
                            </h2>
                            {modalStep === 2 && selectedVehicleType && (
                                <p className="text-blue-100 text-sm mt-1">
                                    Loại xe: {selectedVehicleType.vehicleTypeName}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-white hover:bg-blue-800 rounded-lg p-2 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                        </div>
                    ) : (
                        <>
                            {/* Step 1: Vehicle Types */}
                            {modalStep === 1 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {vehicleTypes.length === 0 ? (
                                        <div className="col-span-full text-center py-12 text-gray-500">
                                            Không có loại xe nào
                                        </div>
                                    ) : (
                                        vehicleTypes.map((type) => (
                                            <button
                                                key={type.vehicleTypeId}
                                                onClick={() => handleSelectVehicleType(type)}
                                                className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-lg transition-all text-left"
                                            >
                                                <div className="flex items-start gap-3">
                                                    {type.image && (
                                                        <img
                                                            src={type.image}
                                                            alt={type.vehicleTypeName}
                                                            className="w-16 h-16 object-cover rounded-lg"
                                                        />
                                                    )}
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900">
                                                            {type.vehicleTypeName}
                                                        </h3>
                                                        {type.description && (
                                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                                {type.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Step 2: Vehicle Details */}
                            {modalStep === 2 && (
                                <div className="space-y-3">
                                    {vehicleDetails.length === 0 ? (
                                        <div className="text-center py-12 text-gray-500">
                                            Không có chi tiết xe nào cho loại xe này
                                        </div>
                                    ) : (
                                        vehicleDetails.map((detail) => (
                                            <button
                                                key={detail.vehicleTypeDetailId}
                                                onClick={() => handleSelectVehicleDetail(detail)}
                                                className="w-full bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-lg transition-all text-left"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900 text-lg">
                                                            {detail.version}
                                                        </h3>
                                                        <div className="mt-2 space-y-1">
                                                            <p className="text-sm text-gray-600">
                                                                <span className="font-medium">Màu sắc:</span> {detail.color}
                                                            </p>
                                                            {detail.configuration && (
                                                                <p className="text-sm text-gray-600">
                                                                    <span className="font-medium">Cấu hình:</span> {detail.configuration}
                                                                </p>
                                                            )}
                                                            {detail.features && (
                                                                <p className="text-sm text-gray-600">
                                                                    <span className="font-medium">Tính năng:</span> {detail.features}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {detail.image && (
                                                        <img
                                                            src={detail.image}
                                                            alt={detail.version}
                                                            className="w-24 h-24 object-cover rounded-lg"
                                                        />
                                                    )}
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VehicleSelectorModal;
