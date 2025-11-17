import { useState, useEffect } from "react";
import { X, Loader } from "lucide-react";
import { getVehicleTypes, getVehicleTypeDetails } from "../../services/api/importRequestService";

// NOTE: Modal 2 bước: Chọn loại xe chính (vehicle type) -> Chọn chi tiết loại xe (vehicle type detail)
const VehicleTypeSelectorModal = ({ onSelect, onClose }) => {
    const [step, setStep] = useState(1); // Step 1: Chọn loại xe, Step 2: Chọn chi tiết
    const [vehicleTypes, setVehicleTypes] = useState([]); // Danh sách loại xe chính
    const [vehicleDetails, setVehicleDetails] = useState([]); // Danh sách chi tiết của loại xe đã chọn
    const [selectedVehicleType, setSelectedVehicleType] = useState(null); // Loại xe đã chọn
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // NOTE: Load danh sách loại xe chính khi component mount
    useEffect(() => {
        const fetchVehicleTypes = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getVehicleTypes(1, 100);
                setVehicleTypes(data || []);
            } catch (err) {
                setError("Không thể tải danh sách loại xe");
                console.error("Lỗi tải loại xe:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicleTypes();
    }, []);

    // NOTE: Load danh sách chi tiết xe khi chọn loại xe
    const handleSelectVehicleType = async (vehicleType) => {
        try {
            setLoading(true);
            setError(null);
            setSelectedVehicleType(vehicleType);

            // NOTE: Gọi API để lấy chi tiết của loại xe đã chọn
            const details = await getVehicleTypeDetails(1, 100, vehicleType.vehicleTypeId);
            setVehicleDetails(details || []);

            // Chuyển sang step 2
            setStep(2);
        } catch (err) {
            setError("Không thể tải chi tiết loại xe");
            console.error("Lỗi tải chi tiết xe:", err);
        } finally {
            setLoading(false);
        }
    };

    // NOTE: Xử lý chọn chi tiết xe và gọi callback
    const handleSelectDetail = (detail) => {
        const result = {
            vehicleTypeId: selectedVehicleType.vehicleTypeId,
            vehicleTypeName: selectedVehicleType.vehicleTypeName,
            vehicleTypeDetailId: detail.vehicleTypeDetailId,
            version: detail.version,
            vehicleImage: detail.vehicleImage,
        };
        onSelect(result);
        onClose();
    };

    // NOTE: Quay lại step 1
    const handleBackToStep1 = () => {
        setStep(1);
        setSelectedVehicleType(null);
        setVehicleDetails([]);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-30 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* NOTE: Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {step === 1 ? "Chọn loại xe" : "Chọn phiên bản xe"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* NOTE: Content */}
                <div className="p-6">
                    {/* NOTE: Step 1 - Chọn loại xe chính */}
                    {step === 1 && (
                        <>
                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                                    <span className="ml-2 text-gray-600">Đang tải danh sách xe...</span>
                                </div>
                            ) : error ? (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                    <p>{error}</p>
                                </div>
                            ) : vehicleTypes.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {vehicleTypes.map((vehicle) => (
                                        <button
                                            key={vehicle.vehicleTypeId}
                                            onClick={() => handleSelectVehicleType(vehicle)}
                                            className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                                        >
                                            <p className="text-lg font-semibold text-gray-900">
                                                {vehicle.vehicleTypeName}
                                            </p>
                                            <p className="text-sm text-gray-600">ID: {vehicle.vehicleTypeId}</p>
                                            <div className="mt-2 text-blue-600 font-medium">Chọn →</div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p className="text-lg font-medium">Không có loại xe nào</p>
                                </div>
                            )}
                        </>
                    )}

                    {/* NOTE: Step 2 - Chọn chi tiết loại xe */}
                    {step === 2 && (
                        <>
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    Loại xe đã chọn: <span className="font-semibold text-blue-900">{selectedVehicleType?.vehicleTypeName}</span>
                                </p>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                                    <span className="ml-2 text-gray-600">Đang tải chi tiết xe...</span>
                                </div>
                            ) : error ? (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                    <p>{error}</p>
                                </div>
                            ) : vehicleDetails.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {vehicleDetails.map((detail) => (
                                        <button
                                            key={detail.vehicleTypeDetailId}
                                            onClick={() => handleSelectDetail(detail)}
                                            className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                                        >
                                            {/* NOTE: Hình ảnh xe nếu có - Sử dụng đường dẫn API: http://localhost:8080/api/images/{imageName} */}
                                            {detail.vehicleImage && (
                                                <div className="mb-3 bg-gray-100 rounded h-32 flex items-center justify-center overflow-hidden">
                                                    <img
                                                        src={`http://localhost:8080/api/images/${detail.vehicleImage}`}
                                                        alt={detail.version}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.style.display = "none";
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            <p className="text-lg font-semibold text-gray-900">
                                                {detail.version}
                                            </p>
                                            <p className="text-sm text-gray-600">ID: {detail.vehicleTypeDetailId}</p>
                                            <div className="mt-2 text-blue-600 font-medium">Chọn →</div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p className="text-lg font-medium">Không có chi tiết nào cho loại xe này</p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* NOTE: Footer với nút quay lại */}
                {step === 2 && (
                    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-4">
                        <button
                            onClick={handleBackToStep1}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            ← Quay lại
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VehicleTypeSelectorModal;
