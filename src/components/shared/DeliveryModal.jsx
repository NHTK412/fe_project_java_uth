import { useState } from 'react';
import { toast } from 'react-toastify';
import { createDelivery } from '../../services/api/orderService';

const DeliveryModal = ({ orderId, isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        employeeId: '',
        name: '',
        phoneNumber: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.employeeId || !formData.name || !formData.phoneNumber || !formData.address) {
            toast.warning('Vui lòng điền đầy đủ thông tin');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                employeeId: Number(formData.employeeId),
                name: formData.name,
                phoneNumber: formData.phoneNumber,
                address: formData.address
            };

            console.log('Delivery data:', payload);
            const result = await createDelivery(orderId, payload);

            toast.success('Tạo phiếu giao hàng thành công!');
            onSuccess();
            onClose();

            // Reset form
            setFormData({
                employeeId: '',
                name: '',
                phoneNumber: '',
                address: ''
            });
        } catch (error) {
            console.error('Error creating delivery:', error);
            toast.error(error.message || 'Lỗi khi tạo phiếu giao hàng');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900">Tạo Phiếu Giao Hàng</h2>
                    <p className="text-sm text-gray-600 mt-1">Mã đơn hàng: #{orderId}</p>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                    {/* Employee ID */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ID Nhân viên giao hàng <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="employeeId"
                            value={formData.employeeId}
                            onChange={handleChange}
                            placeholder="Nhập ID nhân viên"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên người nhận <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nhập tên người nhận"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="Nhập số điện thoại"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Địa chỉ giao hàng <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Nhập địa chỉ giao hàng"
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 justify-end pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>}
                            {loading ? 'Đang xử lý...' : '🚚 Tạo Phiếu Giao'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DeliveryModal;
