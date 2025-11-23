import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Loader } from "lucide-react";
import { createImportRequest } from "../../services/api/importRequestService";
import VehicleTypeSelectorModal from "../../components/admin/VehicleTypeSelectorModal";

const CreateImportRequest = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [showVehicleSelector, setShowVehicleSelector] = useState(false); // NOTE: Show/hide modal chọn xe

    // NOTE: State cho form tạo đơn đặt xe
    const [formData, setFormData] = useState({
        note: "",
        employeeId: 1, // ID nhân viên (mặc định 1, sẽ được cập nhật từ login sau)
        status: "REQUESTED",
        importRequestDetails: [], // Danh sách chi tiết đơn
    });

    // NOTE: State cho form thêm chi tiết sản phẩm
    const [detailForm, setDetailForm] = useState({
        vehicleTypeDetailId: "",
        vehicleTypeName: "",
        version: "",
        quantity: "",
    });

    // NOTE: Xử lý thay đổi input chính
    const handleMainInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // NOTE: Xử lý thay đổi input chi tiết
    const handleDetailInputChange = (e) => {
        const { name, value } = e.target;
        setDetailForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // NOTE: Xử lý chọn loại xe từ modal 2 bước
    const handleSelectVehicle = (selectedVehicle) => {
        setDetailForm((prev) => ({
            ...prev,
            vehicleTypeDetailId: selectedVehicle.vehicleTypeDetailId,
            vehicleTypeName: selectedVehicle.vehicleTypeName,
            version: selectedVehicle.version,
            vehicleImage: selectedVehicle.vehicleImage,
        }));
        setShowVehicleSelector(false);
    };

    // NOTE: Thêm chi tiết sản phẩm vào danh sách
    const handleAddDetail = () => {
        if (!detailForm.vehicleTypeDetailId || !detailForm.quantity) {
            setError("Vui lòng điền đầy đủ thông tin chi tiết");
            return;
        }

        if (parseInt(detailForm.quantity) <= 0) {
            setError("Số lượng phải lớn hơn 0");
            return;
        }

        const newDetail = {
            vehicleTypeDetailId: parseInt(detailForm.vehicleTypeDetailId),
            quantity: parseInt(detailForm.quantity),
        };

        setFormData((prev) => ({
            ...prev,
            importRequestDetails: [...prev.importRequestDetails, newDetail],
        }));

        setDetailForm({ vehicleTypeDetailId: "", vehicleTypeName: "", version: "", quantity: "" });
        setError(null);
    };

    // NOTE: Xóa chi tiết sản phẩm khỏi danh sách
    const handleRemoveDetail = (index) => {
        setFormData((prev) => ({
            ...prev,
            importRequestDetails: prev.importRequestDetails.filter((_, i) => i !== index),
        }));
    };

    // NOTE: Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra dữ liệu
        if (!formData.note.trim()) {
            setError("Vui lòng nhập ghi chú");
            return;
        }

        if (!formData.importRequestDetails.length) {
            setError("Vui lòng thêm ít nhất một sản phẩm");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await createImportRequest(formData);
            setSuccessMessage("Tạo đơn đặt xe thành công!");

            // Chuyển hướng về danh sách sau 2 giây
            setTimeout(() => {
                navigate("/dealerManager/import-request");
            }, 2000);
        } catch (err) {
            setError(err.message || "Có lỗi khi tạo đơn đặt xe");
            console.error("Lỗi tạo đơn:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* NOTE: Header với nút quay lại */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/admin/import-request")}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Quay lại
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Tạo đơn đặt xe từ hãng</h1>
            </div>

            {/* NOTE: Hiển thị thông báo lỗi */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <p className="font-semibold">Lỗi:</p>
                    <p>{error}</p>
                </div>
            )}

            {/* NOTE: Hiển thị thông báo thành công */}
            {successMessage && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    <p className="font-semibold">Thành công:</p>
                    <p>{successMessage}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* NOTE: Phần thông tin chính của đơn */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">Thông tin đơn đặt xe</h2>

                    {/* NOTE: ID Nhân viên */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ID Nhân viên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="employeeId"
                            value={formData.employeeId}
                            onChange={handleMainInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Mặc định: 1 (sẽ được cập nhật từ thông tin đăng nhập)
                        </p>
                    </div>

                    {/* NOTE: Ghi chú */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ghi chú
                        </label>
                        <textarea
                            name="note"
                            value={formData.note}
                            onChange={handleMainInputChange}
                            rows="4"
                            placeholder="Nhập ghi chú cho đơn đặt xe (tùy chọn)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* NOTE: Trạng thái */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trạng thái <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleMainInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="REQUESTED">Đã Yêu Cầu</option>
                            <option value="APPROVED">Đã Duyệt</option>
                            <option value="REJECTED">Đã Từ Chối</option>
                        </select>
                    </div>
                </div>

                {/* NOTE: Phần thêm chi tiết sản phẩm */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">Chi tiết sản phẩm</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* NOTE: Chọn loại xe thông qua modal 2 bước */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại xe <span className="text-red-500">*</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowVehicleSelector(true)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {detailForm.vehicleTypeDetailId ? (
                                    <div>
                                        <p className="font-medium text-gray-900">{detailForm.vehicleTypeName}</p>
                                        <p className="text-sm text-gray-600">Phiên bản: {detailForm.version}</p>
                                        <p className="text-sm text-gray-600">ID: {detailForm.vehicleTypeDetailId}</p>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">-- Nhấn để chọn loại xe --</p>
                                )}
                            </button>
                            <p className="text-xs text-gray-500 mt-1">
                                Chọn loại xe chính rồi chọn phiên bản cụ thể
                            </p>
                        </div>

                        {/* NOTE: Số lượng */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số lượng <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                value={detailForm.quantity}
                                onChange={handleDetailInputChange}
                                placeholder="VD: 5"
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* NOTE: Nút thêm chi tiết */}
                    <button
                        type="button"
                        onClick={handleAddDetail}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Thêm sản phẩm
                    </button>

                    {/* NOTE: Danh sách chi tiết sản phẩm */}
                    {formData.importRequestDetails.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Danh sách sản phẩm ({formData.importRequestDetails.length})
                            </h3>
                            <div className="space-y-2">
                                {formData.importRequestDetails.map((detail, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Loại xe ID: {detail.vehicleTypeDetailId}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Số lượng: {detail.quantity} chiếc
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveDetail(index)}
                                            className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Xóa
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* NOTE: Nút hành động */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                Đang tạo...
                            </>
                        ) : (
                            <>
                                <Plus className="w-5 h-5" />
                                Tạo đơn đặt xe
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/admin/import-request")}
                        disabled={loading}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Hủy
                    </button>
                </div>
            </form>

            {/* NOTE: Modal chọn loại xe 2 bước */}
            {showVehicleSelector && (
                <VehicleTypeSelectorModal
                    onSelect={handleSelectVehicle}
                    onClose={() => setShowVehicleSelector(false)}
                />
            )}
        </div>
    );
};

export default CreateImportRequest;