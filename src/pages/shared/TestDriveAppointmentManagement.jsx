import { useEffect, useState, useCallback } from 'react';
import testDriveApi from '../../services/api/testDriveApi';
import { toast } from 'react-toastify';
import TestDriveAppointmentModal from '../../components/shared/TestDriveAppointmentModal';
import TestDriveDetailModal from '../../components/shared/TestDriveDetailModal';
import { Trash2, Edit, Eye, CalendarPlus, CheckCircle, XCircle, Clock } from 'lucide-react';

const TestDriveAppointmentManagement = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    const [modalMode, setModalMode] = useState('create');

    const statusMap = {
        'SCHEDULED': { label: 'Đã đặt lịch', color: 'bg-blue-100 text-blue-800', icon: Clock },
        'ARRIVED': { label: 'Đã đến', color: 'bg-green-100 text-green-800', icon: CheckCircle },
        'CANCELLED': { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: XCircle }
    };

    const loadAppointments = useCallback(async () => {
        setLoading(true);
        try {
            const response = await testDriveApi.getAppointments();
            console.log('=== Appointments Response ===', response);

            if (response.success && response.data) {
                setAppointments(response.data);
            } else {
                setAppointments([]);
            }
        } catch (error) {
            console.error('Error loading appointments:', error);
            toast.error('Không thể tải danh sách lịch hẹn');
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAppointments();
    }, [loadAppointments]);

    const filteredAppointments = appointments.filter(apt => {
        const matchSearch = searchTerm === '' ||
            apt.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.vehicleTypeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.phoneNumber?.includes(searchTerm);

        const matchStatus = filterStatus === '' || apt.status === filterStatus;

        return matchSearch && matchStatus;
    });

    const handleCreateAppointment = () => {
        setModalMode('create');
        setSelectedAppointment(null);
        setIsModalOpen(true);
    };

    const handleEditAppointment = (appointment) => {
        setModalMode('edit');
        setSelectedAppointment(appointment);
        setIsModalOpen(true);
    };

    const handleViewDetail = (appointmentId) => {
        setSelectedAppointmentId(appointmentId);
        setIsDetailModalOpen(true);
    };

    const handleDeleteAppointment = async (id, customerName) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa lịch hẹn của "${customerName}"?`)) {
            try {
                const response = await testDriveApi.deleteAppointment(id);
                if (response.success) {
                    toast.success('Xóa lịch hẹn thành công');
                    loadAppointments();
                } else {
                    toast.error(response.message || 'Xóa lịch hẹn thất bại');
                }
            } catch (error) {
                console.error('Error deleting appointment:', error);
                toast.error('Không thể xóa lịch hẹn');
            }
        }
    };

    const handleUpdateStatus = async (id, newStatus, customerName) => {
        try {
            const response = await testDriveApi.updateAppointmentStatus(id, newStatus);
            if (response.success) {
                toast.success(`Cập nhật trạng thái lịch hẹn của "${customerName}" thành công`);
                loadAppointments();
            } else {
                toast.error(response.message || 'Cập nhật trạng thái thất bại');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Không thể cập nhật trạng thái');
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedAppointment(null);
    };

    const handleModalSuccess = () => {
        setIsModalOpen(false);
        setSelectedAppointment(null);
        loadAppointments();
    };

    const handleDetailModalClose = () => {
        setIsDetailModalOpen(false);
        setSelectedAppointmentId(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý lịch hẹn lái thử</h1>
                    <p className="text-gray-600 mt-1">Quản lý các lịch hẹn lái thử xe của khách hàng</p>
                </div>
                <button
                    onClick={handleCreateAppointment}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                    <CalendarPlus size={20} />
                    Tạo lịch hẹn
                </button>
            </div>

            {/* Search và Filter */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tìm kiếm (Khách hàng, SĐT, Loại xe)
                        </label>
                        <input
                            type="text"
                            placeholder="Nhập từ khóa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trạng thái
                        </label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Tất cả</option>
                            {Object.entries(statusMap).map(([key, value]) => (
                                <option key={key} value={key}>{value.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredAppointments.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Không có lịch hẹn</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Mã lịch hẹn</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Khách hàng</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">SĐT</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Loại xe</th>
                                    <th className="px-6 py-3 text-center font-semibold text-gray-700">Ngày hẹn</th>
                                    <th className="px-6 py-3 text-center font-semibold text-gray-700">Giờ hẹn</th>
                                    <th className="px-6 py-3 text-center font-semibold text-gray-700">Trạng thái</th>
                                    <th className="px-6 py-3 text-center font-semibold text-gray-700">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredAppointments.map((appointment) => {
                                    const StatusIcon = statusMap[appointment.status]?.icon || Clock;
                                    return (
                                        <tr key={appointment.testDriveAppointmentId} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-blue-600">
                                                #{appointment.testDriveAppointmentId}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900">{appointment.customerName}</p>
                                            </td>
                                            <td className="px-6 py-4 text-gray-900">
                                                {appointment.phoneNumber}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {appointment.vehicleTypeName}
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-900">
                                                {formatDate(appointment.dateOfAppointment)}
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-900">
                                                {appointment.timeOfAppointment}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded ${statusMap[appointment.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                                                        <StatusIcon size={14} />
                                                        {statusMap[appointment.status]?.label || appointment.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleViewDetail(appointment.testDriveAppointmentId)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    {appointment.status === 'SCHEDULED' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleEditAppointment(appointment)}
                                                                className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                                title="Chỉnh sửa"
                                                            >
                                                                <Edit size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateStatus(appointment.testDriveAppointmentId, 'ARRIVED', appointment.customerName)}
                                                                className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                                title="Đánh dấu đã đến"
                                                            >
                                                                <CheckCircle size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateStatus(appointment.testDriveAppointmentId, 'CANCELLED', appointment.customerName)}
                                                                className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                                                                title="Hủy lịch hẹn"
                                                            >
                                                                <XCircle size={18} />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteAppointment(appointment.testDriveAppointmentId, appointment.customerName)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Summary */}
            {!loading && filteredAppointments.length > 0 && (
                <div className="mt-6 flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                        Tổng số: {filteredAppointments.length} lịch hẹn
                    </p>
                </div>
            )}

            {/* Appointment Modal (Create/Edit) */}
            {isModalOpen && (
                <TestDriveAppointmentModal
                    mode={modalMode}
                    appointment={selectedAppointment}
                    onClose={handleModalClose}
                    onSuccess={handleModalSuccess}
                />
            )}

            {/* Appointment Detail Modal */}
            {isDetailModalOpen && selectedAppointmentId && (
                <TestDriveDetailModal
                    testDriveAppointmentId={selectedAppointmentId}
                    onClose={handleDetailModalClose}
                />
            )}
        </div>
    );
};

export default TestDriveAppointmentManagement;
