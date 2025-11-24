import { useState, useEffect } from "react";
import { X, Plus, Trash2, Loader } from "lucide-react";
import { updateQuote, getQuoteById } from "../../services/api/quoteService";
import { showError, showSuccess } from "../shared/toast";
import VehicleSelectorModal from "../shared/VehicleSelectorModal";

const EditQuoteModal = ({ isOpen, onClose, quoteId, onQuoteUpdated }) => {
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [customerId, setCustomerId] = useState("");
    const [status, setStatus] = useState("CREATE");
    const [quotationDetails, setQuotationDetails] = useState([]);
    const [showVehicleSelector, setShowVehicleSelector] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);

    useEffect(() => {
        if (isOpen && quoteId) {
            loadQuoteData();
        }
    }, [isOpen, quoteId]);

    const loadQuoteData = async () => {
        try {
            setLoadingData(true);
            const data = await getQuoteById(quoteId);

            setCustomerId(data.customerId || "");
            setStatus(data.status || "CREATE");

            // Convert quotationDetails to editable format
            const details = (data.quotationDetails || []).map(detail => ({
                vehicleTypeDetailId: detail.vehicleTypeDetailId,
                vehicleTypeName: detail.vehicleTypeName,
                version: detail.vehicleVersion,
                color: detail.vehicleColor,
                configuration: detail.vehicleConfiguration,
                features: detail.vehicleFeatures,
                quantity: detail.quantity,
                registrationTax: detail.registrationTax || 0,
                licensePlateFee: detail.licensePlateFee || 0,
                registrartionFee: detail.registrartionFee || 0,
                compulsoryInsurance: detail.compulsoryInsurance || 0,
                materialInsurance: detail.materialInsurance || 0,
                roadMaintenanceMees: detail.roadMaintenanceMees || 0,
                vehicleRegistrationServiceFee: detail.vehicleRegistrationServiceFee || 0,
            }));

            setQuotationDetails(details);
        } catch (err) {
            showError(err.message || "Không thể tải dữ liệu báo giá");
            console.error("Error loading quote:", err);
        } finally {
            setLoadingData(false);
        }
    };

    const resetForm = () => {
        setCustomerId("");
        setStatus("CREATE");
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
        setShowVehicleSelector(false);
        setEditingIndex(null);
    };

    const handleRemoveVehicle = (index) => {
        setQuotationDetails(quotationDetails.filter((_, i) => i !== index));
    };

    const handleDetailChange = (index, field, value) => {
        const updated = [...quotationDetails];
        updated[index][field] = value;
        setQuotationDetails(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!customerId) {
            showError("Vui lòng nhập ID khách hàng");
            return;
        }

        if (quotationDetails.length === 0) {
            showError("Vui lòng thêm ít nhất một xe vào báo giá");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                customerId: parseInt(customerId),
                status: status,
                quotationDetailRequestDTOs: quotationDetails.map((detail) => ({
                    vehicleTypeDetailId: detail.vehicleTypeDetailId,
                    quantity: parseInt(detail.quantity) || 1,
                    registrationTax: parseFloat(detail.registrationTax) || 0,
                    licensePlateFee: parseFloat(detail.licensePlateFee) || 0,
                    registrartionFee: parseFloat(detail.registrartionFee) || 0,
                    compulsoryInsurance: parseFloat(detail.compulsoryInsurance) || 0,
                    materialInsurance: parseFloat(detail.materialInsurance) || 0,
                    roadMaintenanceMees: parseFloat(detail.roadMaintenanceMees) || 0,
                    vehicleRegistrationServiceFee: parseFloat(detail.vehicleRegistrationServiceFee) || 0,
                })),
            };

            await updateQuote(quoteId, payload);
            showSuccess("Cập nhật báo giá thành công");
            onQuoteUpdated?.();
            onClose();
            resetForm();
        } catch (err) {
            showError(err.message || "Không thể cập nhật báo giá");
            console.error("Error updating quote:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Cập nhật báo giá #{quoteId}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {loadingData ? (
                    <div className="p-12 flex flex-col items-center justify-center">
                        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                        <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {/* Body */}
                        <div className="p-6 space-y-6">
                            {/* Customer Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ID Khách hàng <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={customerId}
                                        onChange={(e) => setCustomerId(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Nhập ID khách hàng"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Trạng thái <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="CREATE">Tạo mới</option>
                                        <option value="PROCESSING">Đang xử lý</option>
                                        <option value="REJECTED">Bị từ chối</option>
                                        <option value="ORDERED">Đã đặt hàng</option>
                                    </select>
                                </div>
                            </div>

                            {/* Vehicle Details */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Chi tiết xe ({quotationDetails.length})
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={handleAddVehicle}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Thêm xe
                                    </button>
                                </div>

                                {quotationDetails.length === 0 ? (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                        <p className="text-gray-500">Chưa có xe nào được thêm</p>
                                        <button
                                            type="button"
                                            onClick={handleAddVehicle}
                                            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            Thêm xe đầu tiên
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {quotationDetails.map((detail, index) => (
                                            <div
                                                key={index}
                                                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">
                                                            {detail.vehicleTypeName}
                                                        </h4>
                                                        <p className="text-sm text-gray-600">
                                                            {detail.version} - {detail.color} - {detail.configuration}
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveVehicle(index)}
                                                        className="text-red-600 hover:text-red-700 p-1"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Số lượng
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={detail.quantity}
                                                            onChange={(e) =>
                                                                handleDetailChange(index, "quantity", e.target.value)
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Thuế trước bạ
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={detail.registrationTax}
                                                            onChange={(e) =>
                                                                handleDetailChange(index, "registrationTax", e.target.value)
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Phí biển số
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={detail.licensePlateFee}
                                                            onChange={(e) =>
                                                                handleDetailChange(index, "licensePlateFee", e.target.value)
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Phí đăng ký
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={detail.registrartionFee}
                                                            onChange={(e) =>
                                                                handleDetailChange(index, "registrartionFee", e.target.value)
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Bảo hiểm bắt buộc
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={detail.compulsoryInsurance}
                                                            onChange={(e) =>
                                                                handleDetailChange(index, "compulsoryInsurance", e.target.value)
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Bảo hiểm vật chất
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={detail.materialInsurance}
                                                            onChange={(e) =>
                                                                handleDetailChange(index, "materialInsurance", e.target.value)
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Phí bảo trì đường bộ
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={detail.roadMaintenanceMees}
                                                            onChange={(e) =>
                                                                handleDetailChange(index, "roadMaintenanceMees", e.target.value)
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Phí dịch vụ đăng ký
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={detail.vehicleRegistrationServiceFee}
                                                            onChange={(e) =>
                                                                handleDetailChange(
                                                                    index,
                                                                    "vehicleRegistrationServiceFee",
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading && <Loader className="w-4 h-4 animate-spin" />}
                                {loading ? "Đang cập nhật..." : "Cập nhật báo giá"}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Vehicle Selector Modal */}
            {showVehicleSelector && (
                <VehicleSelectorModal
                    isOpen={showVehicleSelector}
                    onClose={() => {
                        setShowVehicleSelector(false);
                        setEditingIndex(null);
                    }}
                    onSelect={handleVehicleSelect}
                />
            )}
        </div>
    );
};

export default EditQuoteModal;
