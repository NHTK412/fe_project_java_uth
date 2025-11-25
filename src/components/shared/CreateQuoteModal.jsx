import { useState, useEffect } from "react";
import { X, Plus, Trash2, Loader } from "lucide-react";
import { createQuote } from "../../services/api/quoteService";
import { showError, showSuccess } from "../shared/toast";
import VehicleSelectorModal from "../shared/VehicleSelectorModal";

const CreateQuoteModal = ({ isOpen, onClose, onQuoteCreated }) => {
    const [loading, setLoading] = useState(false);
    const [customerId, setCustomerId] = useState("");
    const [quotationDetails, setQuotationDetails] = useState([]);
    const [showVehicleSelector, setShowVehicleSelector] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);

    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen]);

    const resetForm = () => {
        setCustomerId("");
        setQuotationDetails([]);
    };

    const handleAddVehicle = () => {
        setEditingIndex(null);
        setShowVehicleSelector(true);
    };

    const handleVehicleSelect = (vehicleInfo) => {
        const newDetail = {
            vehicleTypeDetailId: vehicleInfo.vehicleTypeDetailId,
            vehicleTypeName: vehicleInfo.vehicleTypeName,
            version: vehicleInfo.version,
            color: vehicleInfo.color,
            configuration: vehicleInfo.configuration,
            features: vehicleInfo.features,
            quantity: 1,
            registrationTax: 0,
            licensePlateFee: 0,
            registrartionFee: 0,
            compulsoryInsurance: 0,
            materialInsurance: 0,
            roadMaintenanceMees: 0,
            vehicleRegistrationServiceFee: 0,
        };

        if (editingIndex !== null) {
            const updated = [...quotationDetails];
            updated[editingIndex] = { ...updated[editingIndex], ...newDetail };
            setQuotationDetails(updated);
        } else {
            setQuotationDetails([...quotationDetails, newDetail]);
        }
    };

    const handleRemoveDetail = (index) => {
        setQuotationDetails(quotationDetails.filter((_, i) => i !== index));
    };

    const handleUpdateDetail = (index, field, value) => {
        const updated = [...quotationDetails];
        updated[index][field] = parseFloat(value) || 0;
        setQuotationDetails(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!customerId) {
            showError("Vui lòng nhập ID khách hàng");
            return;
        }

        if (quotationDetails.length === 0) {
            showError("Vui lòng thêm ít nhất một chi tiết xe");
            return;
        }

        setLoading(true);
        try {
            const data = {
                customerId: parseInt(customerId),
                status: "CREATE",
                quotationDetailRequestDTOs: quotationDetails.map((detail) => ({
                    vehicleTypeDetailId: detail.vehicleTypeDetailId,
                    quantity: detail.quantity,
                    registrationTax: detail.registrationTax,
                    licensePlateFee: detail.licensePlateFee,
                    registrartionFee: detail.registrartionFee,
                    compulsoryInsurance: detail.compulsoryInsurance,
                    materialInsurance: detail.materialInsurance,
                    roadMaintenanceMees: detail.roadMaintenanceMees,
                    vehicleRegistrationServiceFee: detail.vehicleRegistrationServiceFee,
                })),
            };

            await createQuote(data);
            showSuccess("Tạo báo giá thành công!");
            onQuoteCreated?.();
            onClose();
            resetForm();
        } catch (err) {
            showError(err.message || "Lỗi khi tạo báo giá");
            console.error("Error creating quote:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
                <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden relative z-10">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Tạo báo giá mới</h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-blue-800 rounded-lg p-2 transition-colors"
                            disabled={loading}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                        <div className="space-y-6">
                            {/* Customer ID */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ID Khách hàng <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={customerId}
                                    onChange={(e) => setCustomerId(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập ID khách hàng"
                                    required
                                />
                            </div>

                            {/* Quotation Details */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Chi tiết báo giá <span className="text-red-500">*</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleAddVehicle}
                                        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Thêm xe
                                    </button>
                                </div>

                                {quotationDetails.length === 0 ? (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                                        Chưa có chi tiết xe nào. Nhấn "Thêm xe" để bắt đầu.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {quotationDetails.map((detail, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">
                                                            {detail.vehicleTypeName} - {detail.version}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">Màu: {detail.color}</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveDetail(index)}
                                                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">Số lượng</label>
                                                        <input
                                                            type="number"
                                                            value={detail.quantity}
                                                            onChange={(e) => handleUpdateDetail(index, "quantity", e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                            min="1"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">Thuế trước bạ</label>
                                                        <input
                                                            type="number"
                                                            value={detail.registrationTax}
                                                            onChange={(e) => handleUpdateDetail(index, "registrationTax", e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                            min="0"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">Phí biển số</label>
                                                        <input
                                                            type="number"
                                                            value={detail.licensePlateFee}
                                                            onChange={(e) => handleUpdateDetail(index, "licensePlateFee", e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                            min="0"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">Phí đăng ký</label>
                                                        <input
                                                            type="number"
                                                            value={detail.registrartionFee}
                                                            onChange={(e) => handleUpdateDetail(index, "registrartionFee", e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                            min="0"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">Bảo hiểm bắt buộc</label>
                                                        <input
                                                            type="number"
                                                            value={detail.compulsoryInsurance}
                                                            onChange={(e) => handleUpdateDetail(index, "compulsoryInsurance", e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                            min="0"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">Bảo hiểm vật chất</label>
                                                        <input
                                                            type="number"
                                                            value={detail.materialInsurance}
                                                            onChange={(e) => handleUpdateDetail(index, "materialInsurance", e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                            min="0"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">Phí bảo trì đường</label>
                                                        <input
                                                            type="number"
                                                            value={detail.roadMaintenanceMees}
                                                            onChange={(e) => handleUpdateDetail(index, "roadMaintenanceMees", e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                            min="0"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">Phí dịch vụ đăng ký</label>
                                                        <input
                                                            type="number"
                                                            value={detail.vehicleRegistrationServiceFee}
                                                            onChange={(e) => handleUpdateDetail(index, "vehicleRegistrationServiceFee", e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                            min="0"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading && <Loader className="w-4 h-4 animate-spin" />}
                            {loading ? "Đang tạo..." : "Tạo báo giá"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Vehicle Selector Modal */}
            <VehicleSelectorModal
                isOpen={showVehicleSelector}
                onClose={() => setShowVehicleSelector(false)}
                onSelect={handleVehicleSelect}
            />
        </>
    );
};

export default CreateQuoteModal;
