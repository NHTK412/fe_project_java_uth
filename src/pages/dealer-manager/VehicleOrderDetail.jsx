import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader, Edit2 } from "lucide-react";

const VehicleOrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // NOTE: Gọi API để lấy chi tiết đơn đặt xe
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setLoading(true);
                setError(null);

                // TODO: Replace với API call thực tế
                // const data = await getVehicleOrderDetail(id);

                // Mock data tạm thời
                const mockDetail = {
                    vehicleOrderId: 1,
                    vehicleOrderCode: "VO-2024-001",
                    status: "REQUESTED",
                    createdAt: "2024-11-20T10:00:00Z",
                    updatedAt: "2024-11-20T10:00:00Z",
                    agencyName: "Honda Việt Nam",
                    agencyAddress: "Hà Nội",
                    employeeName: "Nguyễn Văn A",
                    employeePosition: "Quản lý kinh doanh",
                    employeeEmail: "nguyena@example.com",
                    employeePhoneNumber: "0901-234-567",
                    note: "Ghi chú về đơn hàng",
                    vehicleOrderDetails: [
                        {
                            vehicleTypeDetailId: 1,
                            vehicleTypeName: "Honda City",
                            version: "Base",
                            color: "Trắng",
                            configuration: "Tự động",
                            features: "Gương chỉnh điện, điều hòa tự động",
                            quantity: 2,
                            unitPrice: "500000000",
                            totalPrice: "1000000000"
                        },
                        {
                            vehicleTypeDetailId: 2,
                            vehicleTypeName: "Honda Accord",
                            version: "Premium",
                            color: "Đen",
                            configuration: "Tự động",
                            features: "Tất cả trang bị",
                            quantity: 3,
                            unitPrice: "500000000",
                            totalPrice: "1500000000"
                        }
                    ]
                };

                setDetail(mockDetail);
            } catch (err) {
                setError(err.message || "Có lỗi khi tải chi tiết đơn");
                console.error("Lỗi tải chi tiết:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDetail();
        }
    }, [id]);

    // NOTE: Map trạng thái thành màu sắc
    const getStatusBadge = (status) => {
        const statusMap = {
            REQUESTED: {
                label: "Đã Yêu Cầu",
                bgColor: "bg-blue-100",
                textColor: "text-blue-800",
            },
            APPROVED: {
                label: "Đã Duyệt",
                bgColor: "bg-green-100",
                textColor: "text-green-800",
            },
            REJECTED: {
                label: "Đã Từ Chối",
                bgColor: "bg-red-100",
                textColor: "text-red-800",
            },
        };

        const config = statusMap[status] || {
            label: status,
            bgColor: "bg-gray-100",
            textColor: "text-gray-800",
        };

        return (
            <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.textColor} whitespace-nowrap`}
            >
                {config.label}
            </span>
        );
    };

    // NOTE: Format tiền tệ
    const formatCurrency = (value) => {
        if (!value) return "0 ₫";
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);
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
                    onClick={() => navigate("/dealerManager/vehicle-order")}
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
    if (!detail) {
        return (
            <div className="space-y-6">
                <button
                    onClick={() => navigate("/dealerManager/vehicle-order")}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Quay lại
                </button>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
                    <p className="font-semibold">Thông báo:</p>
                    <p>Không tìm thấy đơn đặt xe này</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* NOTE: Header với nút quay lại */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/dealerManager/vehicle-order")}
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Quay lại
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Chi tiết đơn #{detail.vehicleOrderCode}
                    </h1>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Edit2 className="w-5 h-5" />
                        Chỉnh sửa
                    </button>
                </div>
            </div>

            {/* NOTE: Thông tin chính về đơn */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* NOTE: Thông tin đơn */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">Thông tin đơn</h2>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">
                            Mã đơn
                        </label>
                        <p className="text-lg font-medium text-gray-900 mt-1">
                            {detail.vehicleOrderCode}
                        </p>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">
                            Trạng thái
                        </label>
                        <div className="mt-1">{getStatusBadge(detail.status)}</div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">
                            Ghi chú
                        </label>
                        <p className="text-gray-700 mt-1">{detail.note || "-"}</p>
                    </div>
                </div>

                {/* NOTE: Thông tin nhân viên */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">Thông tin nhân viên</h2>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">
                            Tên nhân viên
                        </label>
                        <p className="text-lg font-medium text-gray-900 mt-1">
                            {detail.employeeName || "-"}
                        </p>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">
                            Chức vụ
                        </label>
                        <p className="text-gray-700 mt-1">{detail.employeePosition || "-"}</p>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">
                            Email
                        </label>
                        <p className="text-gray-700 mt-1">{detail.employeeEmail || "-"}</p>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">
                            Số điện thoại
                        </label>
                        <p className="text-gray-700 mt-1">{detail.employeePhoneNumber || "-"}</p>
                    </div>
                </div>
            </div>

            {/* NOTE: Thông tin hãng */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Thông tin hãng</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">
                            Tên hãng
                        </label>
                        <p className="text-lg font-medium text-gray-900 mt-1">
                            {detail.agencyName || "-"}
                        </p>
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase">
                            Địa chỉ
                        </label>
                        <p className="text-gray-700 mt-1">{detail.agencyAddress || "-"}</p>
                    </div>
                </div>
            </div>

            {/* NOTE: Chi tiết sản phẩm đặt xe */}
            {detail.vehicleOrderDetails && detail.vehicleOrderDetails.length > 0 && (
                <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Chi tiết sản phẩm ({detail.vehicleOrderDetails.length})
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                        ID Loại xe
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                        Tên loại xe
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                        Phiên bản
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                        Màu sắc
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                        Cấu hình
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                        Tính năng
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                        Số lượng
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                        Đơn giá
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                        Tổng cộng
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {detail.vehicleOrderDetails.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            #{item.vehicleTypeDetailId}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                            {item.vehicleTypeName || "-"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {item.version || "-"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {item.color || "-"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {item.configuration || "-"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            <span className="line-clamp-2">{item.features || "-"}</span>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {item.quantity} chiếc
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {formatCurrency(item.unitPrice)}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-bold text-green-600">
                                            {formatCurrency(item.totalPrice)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* NOTE: Tóm tắt số lượng */}
                    <div className="pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">Tổng cộng:</span>{" "}
                            {detail.vehicleOrderDetails.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                            chiếc
                        </p>
                    </div>
                </div>
            )}

            {/* NOTE: Không có chi tiết sản phẩm */}
            {(!detail.vehicleOrderDetails || detail.vehicleOrderDetails.length === 0) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
                    <p className="font-semibold">Thông báo:</p>
                    <p>Đơn này chưa có chi tiết sản phẩm nào</p>
                </div>
            )}
        </div>
    );
};

export default VehicleOrderDetail;
