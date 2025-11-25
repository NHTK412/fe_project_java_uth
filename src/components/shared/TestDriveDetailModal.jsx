import { useState, useEffect } from 'react';
import testDriveApi from '../../services/api/testDriveApi';
import { X, User, Car, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Phone, Mail } from 'lucide-react';
import { toast } from 'react-toastify';

const TestDriveDetailModal = ({ testDriveAppointmentId, onClose }) => {
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAppointmentDetail();
    }, [testDriveAppointmentId]);

    const loadAppointmentDetail = async () => {
        try {
            const response = await testDriveApi.getAppointmentById(testDriveAppointmentId);
            if (response.success) {
                setAppointment(response.data);
            } else {
                toast.error('Không thể tải thông tin lịch hẹn');
            }
        } catch (error) {
            console.error('Error loading appointment detail:', error);
            toast.error('Không thể tải thông tin lịch hẹn');
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            SCHEDULED: {
                label: 'Đã đặt lịch',
                color: 'bg-blue-100 text-blue-800',
                icon: <Clock className="w-4 h-4" />
            },
            ARRIVED: {
                label: 'Đã đến',
                color: 'bg-green-100 text-green-800',
                icon: <CheckCircle className="w-4 h-4" />
            },
            CANCELLED: {
                label: 'Đã hủy',
                color: 'bg-red-100 text-red-800',
                icon: <XCircle className="w-4 h-4" />
            }
        };
        return statusMap[status] || {
            label: status,
            color: 'bg-gray-100 text-gray-800',
            icon: <AlertCircle className="w-4 h-4" />
        };
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (!appointment) {
        return null;
    }

    const statusInfo = getStatusInfo(appointment.status);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Chi tiết lịch hẹn lái thử
                        </h2>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusInfo.color}`}>
                            {statusInfo.icon}
                            {statusInfo.label}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Appointment Information */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            Thông tin lịch hẹn
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Mã lịch hẹn</p>
                                <p className="font-semibold text-gray-900">#{appointment.testDriveAppointmentId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
                                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium items-center gap-1 ${statusInfo.color}`}>
                                    {statusInfo.icon}
                                    {statusInfo.label}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Ngày hẹn</p>
                                <p className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    {appointment.dateOfAppointment}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Giờ hẹn</p>
                                <p className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    {appointment.timeOfAppointment}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-green-600" />
                            Thông tin khách hàng
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Mã khách hàng</p>
                                <p className="font-semibold text-gray-900">#{appointment.customerId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Tên khách hàng</p>
                                <p className="font-semibold text-gray-900">{appointment.customerName || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Số điện thoại</p>
                                <p className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    {appointment.phoneNumber || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Email</p>
                                <p className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    {appointment.email || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Information */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Car className="w-5 h-5 text-purple-600" />
                            Thông tin xe
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Mã xe</p>
                                <p className="font-semibold text-gray-900">#{appointment.vehicleId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Tên xe</p>
                                <p className="font-semibold text-gray-900">{appointment.vehicleTypeName || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Số khung</p>
                                <p className="font-semibold text-gray-900">{appointment.chassicNumber || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Số máy</p>
                                <p className="font-semibold text-gray-900">{appointment.machineNumber || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Màu sắc</p>
                                <p className="font-semibold text-gray-900">{appointment.color || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Phiên bản</p>
                                <p className="font-semibold text-gray-900">{appointment.version || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Năm sản xuất</p>
                                <p className="font-semibold text-gray-900">{appointment.manufactureYear || 'N/A'}</p>
                            </div>
                            {appointment.features && (
                                <div className="md:col-span-2">
                                    <p className="text-sm text-gray-600 mb-1">Tính năng</p>
                                    <p className="font-semibold text-gray-900">{appointment.features}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Metadata */}
                    {(appointment.createdDate || appointment.updatedDate) && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin hệ thống</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {appointment.createdDate && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Ngày tạo</p>
                                        <p className="font-semibold text-gray-900">
                                            {new Date(appointment.createdDate).toLocaleString('vi-VN')}
                                        </p>
                                    </div>
                                )}
                                {appointment.updatedDate && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Ngày cập nhật</p>
                                        <p className="font-semibold text-gray-900">
                                            {new Date(appointment.updatedDate).toLocaleString('vi-VN')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestDriveDetailModal;
