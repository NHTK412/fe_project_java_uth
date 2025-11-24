import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Loader, X } from "lucide-react";
import { createQuote, getCustomers, createCustomer } from "../../services/api/quoteService";
import VehicleTypeSelectorModal from "../../components/admin/VehicleTypeSelectorModal";
import { toast } from "react-toastify";

const CreateQuote = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState(null);

    // NOTE: State cho khách hàng
    const [customers, setCustomers] = useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState("");
    const [showCreateCustomer, setShowCreateCustomer] = useState(false);

    // NOTE: State cho form tạo khách hàng mới
    const [newCustomerForm, setNewCustomerForm] = useState({
        customerName: "",
        gender: "MALE",
        birthDate: "",
        phoneNumber: "",
        email: "",
        address: "",
        membershipLevel: "COPPER",
    });

    // NOTE: State cho form thêm chi tiết báo giá
    const [quotationDetails, setQuotationDetails] = useState([]);
    const [showVehicleSelector, setShowVehicleSelector] = useState(false); // NOTE: Show/hide modal chọn xe
    const [detailForm, setDetailForm] = useState({
        vehicleTypeDetailId: "",
        vehicleTypeName: "",
        version: "",
        quantity: "",
        registrationTax: "",
        licensePlateFee: "",
        registrartionFee: "",
        compulsoryInsurance: "",
        materialInsurance: "",
        roadMaintenanceMees: "",
        vehicleRegistrationServiceFee: "",
    });

    // NOTE: Load danh sách khách hàng khi component mount
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setPageLoading(true);
                const data = await getCustomers(0, 100);
                setCustomers(data);
            } catch (err) {
                setError(err.message || "Không thể tải danh sách khách hàng");
                toast.error(err.message || "Không thể tải danh sách khách hàng");
            } finally {
                setPageLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    // NOTE: Xử lý thay đổi form tạo khách hàng mới
    const handleNewCustomerChange = (e) => {
        const { name, value } = e.target;
        setNewCustomerForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // NOTE: Xử lý tạo khách hàng mới
    const handleCreateNewCustomer = async (e) => {
        e.preventDefault();

        if (!newCustomerForm.customerName || !newCustomerForm.email || !newCustomerForm.phoneNumber) {
            setError("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }

        try {
            setLoading(true);
            const result = await createCustomer(newCustomerForm);
            setCustomers((prev) => [...prev, result]);
            setSelectedCustomerId(result.customerId);
            setShowCreateCustomer(false);
            setNewCustomerForm({
                customerName: "",
                gender: "MALE",
                birthDate: "",
                phoneNumber: "",
                email: "",
                address: "",
                membershipLevel: "COPPER",
            });
            toast.success("Tạo khách hàng thành công");
            setError(null);
        } catch (err) {
            setError(err.message || "Không thể tạo khách hàng");
            toast.error(err.message || "Không thể tạo khách hàng");
        } finally {
            setLoading(false);
        }
    };

    // NOTE: Xử lý chọn loại xe từ modal 2 bước
    const handleSelectVehicle = (selectedVehicle) => {
        setDetailForm((prev) => ({
            ...prev,
            vehicleTypeDetailId: selectedVehicle.vehicleTypeDetailId,
            vehicleTypeName: selectedVehicle.vehicleTypeName,
            version: selectedVehicle.version,
        }));
        setShowVehicleSelector(false);
    };

    // NOTE: Xử lý thay đổi input chi tiết báo giá
    const handleDetailInputChange = (e) => {
        const { name, value } = e.target;
        setDetailForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // NOTE: Xử lý thêm chi tiết báo giá
    const handleAddDetail = () => {
        if (!detailForm.vehicleTypeDetailId || !detailForm.quantity) {
            setError("Vui lòng chọn loại xe và điền số lượng");
            return;
        }

        const newDetail = {
            vehicleTypeDetailId: parseInt(detailForm.vehicleTypeDetailId),
            quantity: parseInt(detailForm.quantity),
            registrationTax: parseFloat(detailForm.registrationTax) || 0,
            licensePlateFee: parseFloat(detailForm.licensePlateFee) || 0,
            registrartionFee: parseFloat(detailForm.registrartionFee) || 0,
            compulsoryInsurance: parseFloat(detailForm.compulsoryInsurance) || 0,
            materialInsurance: parseFloat(detailForm.materialInsurance) || 0,
            roadMaintenanceMees: parseFloat(detailForm.roadMaintenanceMees) || 0,
            vehicleRegistrationServiceFee: parseFloat(detailForm.vehicleRegistrationServiceFee) || 0,
        };

        setQuotationDetails((prev) => [...prev, newDetail]);
        setDetailForm({
            vehicleTypeDetailId: "",
            vehicleTypeName: "",
            version: "",
            quantity: "",
            registrationTax: "",
            licensePlateFee: "",
            registrartionFee: "",
            compulsoryInsurance: "",
            materialInsurance: "",
            roadMaintenanceMees: "",
            vehicleRegistrationServiceFee: "",
        });
        setError(null);
    };

    // NOTE: Xử lý xóa chi tiết báo giá
    const handleRemoveDetail = (index) => {
        setQuotationDetails((prev) => prev.filter((_, i) => i !== index));
    };

    // NOTE: Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCustomerId) {
            setError("Vui lòng chọn khách hàng");
            return;
        }

        if (!quotationDetails.length) {
            setError("Vui lòng thêm ít nhất một chi tiết báo giá");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const submitData = {
                customerId: parseInt(selectedCustomerId),
                status: "CREATE",
                quotationDetailRequestDTOs: quotationDetails,
            };

            const result = await createQuote(submitData);
            toast.success("Tạo báo giá thành công");
            navigate(`/admin/quote/${result.quoteId}`);
        } catch (err) {
            setError(err.message || "Có lỗi khi tạo báo giá");
            toast.error(err.message || "Không thể tạo báo giá");
            console.error("Lỗi tạo báo giá:", err);
        } finally {
            setLoading(false);
        }
    };

    // NOTE: Format tiền tệ
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value || 0);
    };

    if (pageLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* NOTE: Header với nút quay lại */}
            <button
                onClick={() => navigate("/admin/quote")}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                Quay lại
            </button>

            {/* NOTE: Form chính */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8 space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Tạo báo giá mới</h1>

                {/* NOTE: Hiển thị lỗi */}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        <p className="font-semibold">Lỗi:</p>
                        <p>{error}</p>
                    </div>
                )}

                {/* NOTE: Section - Chọn khách hàng */}
                <div className="border-t border-gray-200 pt-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Chọn khách hàng</h2>

                    {!showCreateCustomer ? (
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Khách hàng *
                                </label>
                                <select
                                    value={selectedCustomerId}
                                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">-- Chọn khách hàng --</option>
                                    {customers.map((customer) => (
                                        <option key={customer.customerId} value={customer.customerId}>
                                            {customer.customerName} - {customer.phoneNumber}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowCreateCustomer(true)}
                                className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                            >
                                + Tạo khách hàng mới
                            </button>
                        </div>
                    ) : (
                        <div className="bg-blue-50 p-6 rounded-lg space-y-4 border border-blue-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Tạo khách hàng mới</h3>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateCustomer(false)}
                                    className="p-1 hover:bg-blue-200 rounded transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>

                            {/* Form tạo khách hàng */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tên khách hàng *
                                    </label>
                                    <input
                                        type="text"
                                        name="customerName"
                                        value={newCustomerForm.customerName}
                                        onChange={handleNewCustomerChange}
                                        placeholder="Nhập tên"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={newCustomerForm.email}
                                        onChange={handleNewCustomerChange}
                                        placeholder="Nhập email"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Số điện thoại *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={newCustomerForm.phoneNumber}
                                        onChange={handleNewCustomerChange}
                                        placeholder="Nhập số điện thoại"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Giới tính
                                    </label>
                                    <select
                                        name="gender"
                                        value={newCustomerForm.gender}
                                        onChange={handleNewCustomerChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="MALE">Nam</option>
                                        <option value="FEMALE">Nữ</option>
                                        <option value="OTHER">Khác</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Ngày sinh
                                    </label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={newCustomerForm.birthDate}
                                        onChange={handleNewCustomerChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Địa chỉ
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={newCustomerForm.address}
                                        onChange={handleNewCustomerChange}
                                        placeholder="Nhập địa chỉ"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cấp độ thành viên
                                    </label>
                                    <select
                                        name="membershipLevel"
                                        value={newCustomerForm.membershipLevel}
                                        onChange={handleNewCustomerChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="COPPER">COPPER</option>
                                        <option value="SILVER">SILVER</option>
                                        <option value="GOLD">GOLD</option>
                                        <option value="PLATINUM">PLATINUM</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCreateNewCustomer}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                                >
                                    {loading ? "Đang tạo..." : "Tạo khách hàng"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateCustomer(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* NOTE: Section - Chi tiết báo giá */}
                <div className="border-t border-gray-200 pt-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết báo giá</h2>

                    {/* NOTE: Form thêm chi tiết */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
                        {/* Chọn loại xe */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại xe *
                            </label>
                            {detailForm.vehicleTypeName ? (
                                <div className="p-3 bg-white border border-blue-300 rounded-lg flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-900">{detailForm.vehicleTypeName}</p>
                                        <p className="text-sm text-gray-600">{detailForm.version}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowVehicleSelector(true)}
                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                                    >
                                        Thay đổi
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setShowVehicleSelector(true)}
                                    className="w-full px-4 py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors font-medium"
                                >
                                    + Chọn loại xe
                                </button>
                            )}
                        </div>

                        {/* Số lượng */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Số lượng *
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                value={detailForm.quantity}
                                onChange={handleDetailInputChange}
                                placeholder="Nhập SL"
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Các phí */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Thuế đăng ký
                                </label>
                                <input
                                    type="number"
                                    name="registrationTax"
                                    value={detailForm.registrationTax}
                                    onChange={handleDetailInputChange}
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Phí biển số
                                </label>
                                <input
                                    type="number"
                                    name="licensePlateFee"
                                    value={detailForm.licensePlateFee}
                                    onChange={handleDetailInputChange}
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Phí đăng ký
                                </label>
                                <input
                                    type="number"
                                    name="registrartionFee"
                                    value={detailForm.registrartionFee}
                                    onChange={handleDetailInputChange}
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Bảo hiểm bắt buộc
                                </label>
                                <input
                                    type="number"
                                    name="compulsoryInsurance"
                                    value={detailForm.compulsoryInsurance}
                                    onChange={handleDetailInputChange}
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Bảo hiểm vật chất
                                </label>
                                <input
                                    type="number"
                                    name="materialInsurance"
                                    value={detailForm.materialInsurance}
                                    onChange={handleDetailInputChange}
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Phí bảo dưỡng đường bộ
                                </label>
                                <input
                                    type="number"
                                    name="roadMaintenanceMees"
                                    value={detailForm.roadMaintenanceMees}
                                    onChange={handleDetailInputChange}
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Phí dịch vụ đăng ký xe
                                </label>
                                <input
                                    type="number"
                                    name="vehicleRegistrationServiceFee"
                                    value={detailForm.vehicleRegistrationServiceFee}
                                    onChange={handleDetailInputChange}
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleAddDetail}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Thêm chi tiết
                        </button>
                    </div>

                    {/* NOTE: Bảng danh sách chi tiết */}
                    {quotationDetails.length > 0 && (
                        <div className="overflow-x-auto border border-gray-200 rounded-lg mb-4">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-4 py-3 text-left font-semibold text-gray-900">ID Xe</th>
                                        <th className="px-4 py-3 text-center font-semibold text-gray-900">SL</th>
                                        <th className="px-4 py-3 text-right font-semibold text-gray-900">Thuế/Phí</th>
                                        <th className="px-4 py-3 text-right font-semibold text-gray-900">Bảo hiểm</th>
                                        <th className="px-4 py-3 text-center font-semibold text-gray-900">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {quotationDetails.map((detail, index) => {
                                        const totalFees =
                                            (detail.registrationTax || 0) +
                                            (detail.licensePlateFee || 0) +
                                            (detail.registrartionFee || 0) +
                                            (detail.roadMaintenanceMees || 0) +
                                            (detail.vehicleRegistrationServiceFee || 0);
                                        const totalInsurance =
                                            (detail.compulsoryInsurance || 0) + (detail.materialInsurance || 0);

                                        return (
                                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="px-4 py-3 text-gray-900 font-medium">
                                                    {detail.vehicleTypeDetailId}
                                                </td>
                                                <td className="px-4 py-3 text-center text-gray-900">
                                                    {detail.quantity}
                                                </td>
                                                <td className="px-4 py-3 text-right text-gray-900">
                                                    {formatCurrency(totalFees)}
                                                </td>
                                                <td className="px-4 py-3 text-right text-gray-900">
                                                    {formatCurrency(totalInsurance)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveDetail(index)}
                                                        className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors inline-flex items-center gap-1"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* NOTE: Nút action */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                Đang tạo...
                            </>
                        ) : (
                            "Tạo báo giá"
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/admin/quote")}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Hủy
                    </button>
                </div>
            </form>

            {/* NOTE: Modal chọn loại xe */}
            {showVehicleSelector && (
                <VehicleTypeSelectorModal
                    onSelect={handleSelectVehicle}
                    onClose={() => setShowVehicleSelector(false)}
                />
            )}
        </div>
    );
};

export default CreateQuote;
