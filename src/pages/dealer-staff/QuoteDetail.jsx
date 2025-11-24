import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader } from "lucide-react";
import { getQuoteById, updateQuoteStatus, deleteQuote } from "../../services/api/quoteService";
import ConvertQuoteToOrderModal from "../../components/shared/ConvertQuoteToOrderModal";
import { toast } from "react-toastify";

const QuoteDetail = () => {
    const { quoteId } = useParams();
    const navigate = useNavigate();
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [statusLoading, setStatusLoading] = useState(false);
    const [showConvertModal, setShowConvertModal] = useState(false);

    // NOTE: Gọi API để lấy chi tiết báo giá
    useEffect(() => {
        const fetchQuote = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getQuoteById(quoteId);
                setQuote(data);
            } catch (err) {
                setError(err.message || "Có lỗi khi tải chi tiết báo giá");
                toast.error(err.message || "Không thể tải chi tiết báo giá");
                console.error("Lỗi tải chi tiết báo giá:", err);
            } finally {
                setLoading(false);
            }
        };

        if (quoteId) {
            fetchQuote();
        }
    }, [quoteId]);

    // NOTE: Map trạng thái thành màu sắc
    const getStatusBadge = (status) => {
        const statusMap = {
            CREATE: {
                label: "Tạo mới",
                bgColor: "bg-blue-100",
                textColor: "text-blue-800",
            },
            PROCESSING: {
                label: "Đang xử lý",
                bgColor: "bg-yellow-100",
                textColor: "text-yellow-800",
            },
            REJECTED: {
                label: "Bị từ chối",
                bgColor: "bg-red-100",
                textColor: "text-red-800",
            },
            ORDERED: {
                label: "Đã đặt hàng",
                bgColor: "bg-green-100",
                textColor: "text-green-800",
            },
        };

        const config = statusMap[status] || {
            label: status,
            bgColor: "bg-gray-100",
            textColor: "text-gray-800",
        };

        return (
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.textColor} whitespace-nowrap`}>
                {config.label}
            </span>
        );
    };

    // NOTE: Xử lý thay đổi trạng thái
    const handleStatusChange = async (newStatus) => {
        try {
            setStatusLoading(true);
            await updateQuoteStatus(quoteId, newStatus);
            setQuote((prev) => ({ ...prev, status: newStatus }));
            toast.success("Cập nhật trạng thái thành công");
        } catch (err) {
            toast.error(err.message || "Không thể cập nhật trạng thái");
            console.error("Lỗi cập nhật trạng thái:", err);
        } finally {
            setStatusLoading(false);
        }
    };

    // NOTE: Xử lý xóa báo giá
    const handleDelete = async () => {
        if (window.confirm("Bạn chắc chắn muốn xóa báo giá này?")) {
            try {
                await deleteQuote(quoteId);
                toast.success("Xóa báo giá thành công");
                navigate("/admin/quote");
            } catch (err) {
                toast.error(err.message || "Không thể xóa báo giá");
                console.error("Lỗi xóa báo giá:", err);
            }
        }
    };

    // NOTE: Xử lý chuyển sang đơn hàng
    const handleConvertSuccess = (orderData) => {
        toast.success("Đơn hàng đã được tạo thành công!");
        // Reload page hoặc điều hướng
        navigate(`/admin/order/${orderData.orderId}`);
    };

    // NOTE: Format tiền tệ
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value || 0);
    };

    // NOTE: Hiển thị loading
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                <span className="ml-2 text-gray-600">Đang tải chi tiết...</span>
            </div>
        );
    }

    // NOTE: Hiển thị lỗi
    if (error) {
        return (
            <div className="space-y-6">
                <button
                    onClick={() => navigate("/admin/quote")}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Quay lại
                </button>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <p className="font-semibold">Lỗi:</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    // NOTE: Không tìm thấy dữ liệu
    if (!quote) {
        return (
            <div className="space-y-6">
                <button
                    onClick={() => navigate("/admin/quote")}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Quay lại
                </button>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
                    <p>Không tìm thấy báo giá</p>
                </div>
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

            {/* NOTE: Thông tin chính */}
            <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Báo giá #{quote.quoteId}
                        </h1>
                        <p className="text-gray-600">
                            Khách hàng: {quote.customerName}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {getStatusBadge(quote.status)}
                    </div>
                </div>

                {/* NOTE: Grid thông tin 2 cột */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Cột 1 - Thông tin khách hàng */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Thông tin khách hàng
                        </h2>
                        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Tên khách hàng</label>
                                <p className="text-gray-900">{quote.customerName || "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Email</label>
                                <p className="text-gray-900">{quote.customerEmail || "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
                                <p className="text-gray-900">{quote.customerPhone || "-"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Cột 2 - Thông tin nhân viên */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Thông tin nhân viên
                        </h2>
                        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Tên nhân viên</label>
                                <p className="text-gray-900">{quote.employeeName || "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Email</label>
                                <p className="text-gray-900">{quote.employeeEmail || "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
                                <p className="text-gray-900">{quote.employeePhoneNumber || "-"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* NOTE: Danh sách chi tiết báo giá */}
                {quote.quotationDetails && quote.quotationDetails.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết báo giá</h2>
                        <div className="space-y-6">
                            {quote.quotationDetails.map((detail, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-6 bg-white">
                                    {/* Thông tin xe */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                            {detail.vehicleTypeName || "-"}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <label className="text-xs font-semibold text-gray-600 uppercase">Cấu hình</label>
                                                <p className="text-gray-900 font-medium">{detail.vehicleConfiguration || "-"}</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <label className="text-xs font-semibold text-gray-600 uppercase">Phiên bản</label>
                                                <p className="text-gray-900 font-medium">{detail.vehicleVersion || "-"}</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <label className="text-xs font-semibold text-gray-600 uppercase">Màu sắc</label>
                                                <p className="text-gray-900 font-medium">{detail.vehicleColor || "-"}</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <label className="text-xs font-semibold text-gray-600 uppercase">Tính năng</label>
                                                <p className="text-gray-900 font-medium">{detail.vehicleFeatures || "-"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bảng giá chi tiết */}
                                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-blue-50 border-b border-gray-200">
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Hạng mục</th>
                                                    <th className="px-4 py-3 text-right font-semibold text-gray-900">Đơn giá</th>
                                                    <th className="px-4 py-3 text-center font-semibold text-gray-900">SL</th>
                                                    <th className="px-4 py-3 text-right font-semibold text-gray-900">Thành tiền</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Giá xe */}
                                                <tr className="border-b border-gray-200 hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-gray-900 font-medium">Giá xe</td>
                                                    <td className="px-4 py-3 text-right text-gray-900">
                                                        {formatCurrency(detail.vehiclePrice || 0)}
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-gray-900">
                                                        {detail.quantity || 0}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                                                        {formatCurrency((detail.vehiclePrice || 0) * (detail.quantity || 0))}
                                                    </td>
                                                </tr>

                                                {/* Giảm giá */}
                                                {(detail.discount || 0) > 0 && (
                                                    <tr className="border-b border-gray-200 bg-red-50 hover:bg-red-100">
                                                        <td className="px-4 py-3 text-red-900 font-medium">
                                                            Giảm giá ({detail.discountPercentage || 0}%)
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-red-900">
                                                            {formatCurrency(detail.discount || 0)}
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-red-900">
                                                            {detail.quantity || 0}
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-semibold text-red-900">
                                                            -{formatCurrency((detail.discount || 0) * (detail.quantity || 0))}
                                                        </td>
                                                    </tr>
                                                )}

                                                {/* Thuế đăng ký */}
                                                {(detail.registrationTax || 0) > 0 && (
                                                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-gray-900">Thuế đăng ký</td>
                                                        <td className="px-4 py-3 text-right text-gray-900">
                                                            {formatCurrency(detail.registrationTax || 0)}
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-gray-900">
                                                            {detail.quantity || 0}
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-gray-900">
                                                            {formatCurrency((detail.registrationTax || 0) * (detail.quantity || 0))}
                                                        </td>
                                                    </tr>
                                                )}

                                                {/* Phí biển số */}
                                                {(detail.licensePlateFee || 0) > 0 && (
                                                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-gray-900">Phí biển số</td>
                                                        <td className="px-4 py-3 text-right text-gray-900">
                                                            {formatCurrency(detail.licensePlateFee || 0)}
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-gray-900">
                                                            {detail.quantity || 0}
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-gray-900">
                                                            {formatCurrency((detail.licensePlateFee || 0) * (detail.quantity || 0))}
                                                        </td>
                                                    </tr>
                                                )}

                                                {/* Phí đăng ký */}
                                                {(detail.registrartionFee || 0) > 0 && (
                                                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-gray-900">Phí đăng ký</td>
                                                        <td className="px-4 py-3 text-right text-gray-900">
                                                            {formatCurrency(detail.registrartionFee || 0)}
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-gray-900">
                                                            {detail.quantity || 0}
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-gray-900">
                                                            {formatCurrency((detail.registrartionFee || 0) * (detail.quantity || 0))}
                                                        </td>
                                                    </tr>
                                                )}

                                                {/* Bảo hiểm bắt buộc */}
                                                {(detail.compulsoryInsurance || 0) > 0 && (
                                                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-gray-900">Bảo hiểm bắt buộc</td>
                                                        <td className="px-4 py-3 text-right text-gray-900">
                                                            {formatCurrency(detail.compulsoryInsurance || 0)}
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-gray-900">
                                                            {detail.quantity || 0}
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-gray-900">
                                                            {formatCurrency((detail.compulsoryInsurance || 0) * (detail.quantity || 0))}
                                                        </td>
                                                    </tr>
                                                )}

                                                {/* Bảo hiểm vật chất */}
                                                {(detail.materialInsurance || 0) > 0 && (
                                                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-gray-900">Bảo hiểm vật chất</td>
                                                        <td className="px-4 py-3 text-right text-gray-900">
                                                            {formatCurrency(detail.materialInsurance || 0)}
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-gray-900">
                                                            {detail.quantity || 0}
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-gray-900">
                                                            {formatCurrency((detail.materialInsurance || 0) * (detail.quantity || 0))}
                                                        </td>
                                                    </tr>
                                                )}

                                                {/* Phí bảo dưỡng đường bộ */}
                                                {(detail.roadMaintenanceMees || 0) > 0 && (
                                                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-gray-900">Phí bảo dưỡng đường bộ</td>
                                                        <td className="px-4 py-3 text-right text-gray-900">
                                                            {formatCurrency(detail.roadMaintenanceMees || 0)}
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-gray-900">
                                                            {detail.quantity || 0}
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-gray-900">
                                                            {formatCurrency((detail.roadMaintenanceMees || 0) * (detail.quantity || 0))}
                                                        </td>
                                                    </tr>
                                                )}

                                                {/* Phí dịch vụ đăng ký xe */}
                                                {(detail.vehicleRegistrationServiceFee || 0) > 0 && (
                                                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-gray-900">Phí dịch vụ đăng ký xe</td>
                                                        <td className="px-4 py-3 text-right text-gray-900">
                                                            {formatCurrency(detail.vehicleRegistrationServiceFee || 0)}
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-gray-900">
                                                            {detail.quantity || 0}
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-gray-900">
                                                            {formatCurrency((detail.vehicleRegistrationServiceFee || 0) * (detail.quantity || 0))}
                                                        </td>
                                                    </tr>
                                                )}

                                                {/* Tổng tiền */}
                                                <tr className="bg-blue-50 font-bold">
                                                    <td className="px-4 py-3 text-blue-900">TỔNG TIỀN</td>
                                                    <td className="px-4 py-3 text-right"></td>
                                                    <td className="px-4 py-3 text-center"></td>
                                                    <td className="px-4 py-3 text-right text-blue-900 text-lg">
                                                        {formatCurrency(detail.totalAmount || 0)}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* NOTE: Tổng giá trị */}
                {quote.quotationDetails && quote.quotationDetails.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-semibold text-gray-900">Tổng giá trị báo giá:</span>
                            <span className="text-4xl font-bold text-blue-600">
                                {formatCurrency(quote.quotationDetails.reduce((sum, detail) => sum + (detail.totalAmount || 0), 0))}
                            </span>
                        </div>
                    </div>
                )}

                {/* NOTE: Nút hành động thay đổi trạng thái */}
                <div className="flex gap-3 justify-end items-center pt-6 border-t border-gray-200">
                    {quote.status === "CREATE" && (
                        <button
                            onClick={() => handleStatusChange("PROCESSING")}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                            Chuyển sang xử lý
                        </button>
                    )}
                    {quote.status === "PROCESSING" && (
                        <>
                            <button
                                onClick={() => setShowConvertModal(true)}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                            >
                                📦 Chuyển sang Đơn hàng
                            </button>
                            <button
                                onClick={() => handleStatusChange("REJECTED")}
                                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                            >
                                Từ chối
                            </button>
                        </>
                    )}
                    {quote.status !== "ORDERED" && quote.status !== "REJECTED" && (
                        <button
                            onClick={handleDelete}
                            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
                        >
                            Xoá
                        </button>
                    )}
                </div>

                {/* Convert Modal */}
                <ConvertQuoteToOrderModal
                    quoteId={quoteId}
                    isOpen={showConvertModal}
                    onClose={() => setShowConvertModal(false)}
                    onSuccess={handleConvertSuccess}
                />
            </div>
        </div>
    );
};

export default QuoteDetail;
