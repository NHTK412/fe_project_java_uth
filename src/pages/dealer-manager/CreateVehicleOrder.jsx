import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Loader } from "lucide-react";
import { toast } from "react-toastify";
import VehicleTypeSelectorModal from "../../components/admin/VehicleTypeSelectorModal";

const CreateVehicleOrder = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [showVehicleSelector, setShowVehicleSelector] = useState(false);

    // NOTE: State cho form tạo đơn đặt xe
    const [formData, setFormData] = useState({
        note: "",
        employeeId: 1,
        status: "REQUESTED",
        vehicleOrderDetails: [],
    });

    // NOTE: State cho form thêm chi tiết sản phẩm
    const [detailForm, setDetailForm] = useState({
        vehicleTypeDetailId: "",
        vehicleTypeName: "",
        version: "",
        quantity: "",
    });

    // NOTE: Xử lý thay đổi input chính
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // NOTE: Xử lý thêm xe vào danh sách
    const handleAddVehicle = (selectedVehicle) => {
        if (!selectedVehicle.vehicleTypeDetailId) {
            toast.error("Vui lòng chọn xe");
            return;
        }

        if (!detailForm.quantity || parseInt(detailForm.quantity) <= 0) {
            toast.error("Vui lòng nhập số lượng > 0");
            return;
        }

        const newDetail = {
            vehicleTypeDetailId: selectedVehicle.vehicleTypeDetailId,
            vehicleTypeName: selectedVehicle.vehicleTypeName,
            version: selectedVehicle.version,
            quantity: parseInt(detailForm.quantity),
        };

        setFormData((prev) => ({
            ...prev,
            vehicleOrderDetails: [...prev.vehicleOrderDetails, newDetail],
        }));

        // Reset form thêm xe
        setDetailForm({
            vehicleTypeDetailId: "",
            vehicleTypeName: "",
            version: "",
            quantity: "",
        });

        setShowVehicleSelector(false);
        toast.success("Thêm xe thành công");
    };

    // NOTE: Xử lý xóa xe khỏi danh sách
    const handleRemoveVehicle = (index) => {
        setFormData((prev) => ({
            ...prev,
            vehicleOrderDetails: prev.vehicleOrderDetails.filter((_, i) => i !== index),
        }));
        toast.success("Xóa xe thành công");
    };

    // NOTE: Tính tổng số xe
    const totalQuantity = formData.vehicleOrderDetails.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
    );

    // NOTE: Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.note.trim()) {
            toast.error("Vui lòng nhập ghi chú");
            return;
        }

        if (formData.vehicleOrderDetails.length === 0) {
            toast.error("Vui lòng thêm ít nhất 1 xe");
            return;
        }

        // Prepare data for API
        const payload = {
            status: formData.status,
            note: formData.note,
            employeeId: formData.employeeId,
            vehicleOrderDetails: formData.vehicleOrderDetails.map(detail => ({
                vehicleTypeDetailId: detail.vehicleTypeDetailId,
                quantity: detail.quantity,
            })),
        };

        setLoading(true);
        try {
            // TODO: Replace với API call thực tế
            // await createVehicleOrder(payload);

            // Mock - giả lập delay API
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast.success("Tạo đơn đặt xe thành công");
            setSuccessMessage("Tạo đơn đặt xe thành công!");

            setTimeout(() => {
                navigate("/dealerManager/vehicle-order");
            }, 1500);
        } catch (err) {
            console.error("Lỗi tạo đơn:", err);
            setError(err.message || "Lỗi tạo đơn đặt xe");
            toast.error("Tạo đơn thất bại: " + (err.message || "Lỗi không xác định"));
        } finally {
            setLoading(false);
        }
    }; return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <button
                            onClick={() => navigate("/dealerManager/vehicle-order")}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Quay lại
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Tạo đơn đặt xe từ hãng</h1>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                        {successMessage}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Ghi chú */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ghi chú <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="note"
                            value={formData.note}
                            onChange={handleFormChange}
                            rows={4}
                            placeholder="Nhập ghi chú về đơn đặt xe..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Danh sách xe */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Danh sách xe ({formData.vehicleOrderDetails.length})
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowVehicleSelector(true)}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                <Plus className="w-4 h-4" />
                                Thêm xe
                            </button>
                        </div>

                        {formData.vehicleOrderDetails.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Tên xe</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Phiên bản</th>
                                            <th className="px-4 py-3 text-right font-semibold text-gray-700">Số lượng</th>
                                            <th className="px-4 py-3 text-center font-semibold text-gray-700">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.vehicleOrderDetails.map((item, index) => (
                                            <tr key={index} className="border-t border-gray-200">
                                                <td className="px-4 py-3">{item.vehicleTypeName}</td>
                                                <td className="px-4 py-3">{item.version}</td>
                                                <td className="px-4 py-3 text-right">{item.quantity}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveVehicle(index)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                Chưa có xe nào. Vui lòng thêm xe vào danh sách.
                            </div>
                        )}
                    </div>

                    {/* Tóm tắt */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Số loại xe:</span>
                                <span className="font-semibold">
                                    {formData.vehicleOrderDetails.length}
                                </span>
                            </div>
                            <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
                                <span>Tổng số xe:</span>
                                <span className="text-blue-600">{totalQuantity}</span>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/dealerManager/vehicle-order")}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && <Loader className="w-4 h-4 animate-spin" />}
                            {loading ? "Đang tạo..." : "Tạo đơn"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Vehicle Selector Modal */}
            {showVehicleSelector && (
                <VehicleTypeSelectorModal
                    onSelect={handleAddVehicle}
                    onClose={() => setShowVehicleSelector(false)}
                />
            )}
        </div>
    );
};

export default CreateVehicleOrder;
