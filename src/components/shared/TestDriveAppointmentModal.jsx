import { useState, useEffect } from 'react';
import testDriveApi from '../../services/api/testDriveApi';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

const TestDriveAppointmentModal = ({ mode, appointment, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        customerId: '',
        vehicleId: '',
        dateOfAppointment: '',
        timeOfAppointment: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (mode === 'edit' && appointment) {
            setFormData({
                customerId: appointment.customerId || '',
                vehicleId: appointment.vehicleId || '',
                dateOfAppointment: appointment.dateOfAppointment || '',
                timeOfAppointment: appointment.timeOfAppointment || ''
            });
        }
    }, [mode, appointment]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.customerId) {
            newErrors.customerId = 'Vui lòng nhập mã khách hàng';
        }

        if (!formData.vehicleId) {
            newErrors.vehicleId = 'Vui lòng nhập mã xe';
        }

        if (!formData.dateOfAppointment) {
            newErrors.dateOfAppointment = 'Vui lòng chọn ngày hẹn';
        }

        if (!formData.timeOfAppointment) {
            newErrors.timeOfAppointment = 'Vui lòng chọn giờ hẹn';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Vui lòng kiểm tra lại thông tin');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                customerId: Number(formData.customerId),
                vehicleId: Number(formData.vehicleId),
                dateOfAppointment: formData.dateOfAppointment,
                timeOfAppointment: formData.timeOfAppointment
            };

            let response;
            if (mode === 'create') {
                response = await testDriveApi.createAppointment(payload);
            } else {
                response = await testDriveApi.updateAppointment(appointment.testDriveAppointmentId, payload);
            }

            if (response.success) {
                toast.success(mode === 'create' ? 'Tạo lịch hẹn thành công' : 'Cập nhật lịch hẹn thành công');
                onSuccess();
            } else {
                toast.error(response.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error saving appointment:', error);
            toast.error(error.response?.data?.message || 'Không thể lưu lịch hẹn');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {mode === 'create' ? 'Tạo lịch hẹn lái thử' : 'Chỉnh sửa lịch hẹn'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Mã khách hàng */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mã khách hàng <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="customerId"
                                value={formData.customerId}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.customerId ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Nhập mã khách hàng"
                            />
                            {errors.customerId && (
                                <p className="text-red-500 text-sm mt-1">{errors.customerId}</p>
                            )}
                        </div>

                        {/* Mã xe */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mã xe <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="vehicleId"
                                value={formData.vehicleId}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.vehicleId ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Nhập mã xe"
                            />
                            {errors.vehicleId && (
                                <p className="text-red-500 text-sm mt-1">{errors.vehicleId}</p>
                            )}
                        </div>

                        {/* Ngày hẹn */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ngày hẹn <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="dateOfAppointment"
                                value={formData.dateOfAppointment}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.dateOfAppointment ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.dateOfAppointment && (
                                <p className="text-red-500 text-sm mt-1">{errors.dateOfAppointment}</p>
                            )}
                        </div>

                        {/* Giờ hẹn */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Giờ hẹn <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                name="timeOfAppointment"
                                value={formData.timeOfAppointment}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.timeOfAppointment ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.timeOfAppointment && (
                                <p className="text-red-500 text-sm mt-1">{errors.timeOfAppointment}</p>
                            )}
                        </div>
                    </div>

                    {/* Note */}
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <span className="font-semibold">💡 Lưu ý:</span> Vui lòng nhập đúng mã khách hàng và mã xe có trong hệ thống.
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Đang lưu...' : (mode === 'create' ? 'Tạo lịch hẹn' : 'Cập nhật')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TestDriveAppointmentModal;
