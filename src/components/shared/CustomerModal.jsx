import { useState, useEffect } from 'react';
import customerApi from '../../services/api/customerApi';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

const CustomerModal = ({ mode, customer, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        customerName: '',
        gender: 'MALE',
        birthDate: '',
        phoneNumber: '',
        email: '',
        address: '',
        membershipLevel: 'COPPER'
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (mode === 'edit' && customer) {
            setFormData({
                customerName: customer.customerName || '',
                gender: customer.gender || 'MALE',
                birthDate: customer.birthDate || '',
                phoneNumber: customer.phoneNumber || '',
                email: customer.email || '',
                address: customer.address || '',
                membershipLevel: customer.membershipLevel || 'COPPER'
            });
        }
    }, [mode, customer]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.customerName.trim()) {
            newErrors.customerName = 'Vui lòng nhập họ tên';
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Vui lòng nhập số điện thoại';
        } else if (!/^(\+84|0)[0-9]{9,10}$/.test(formData.phoneNumber.replace(/[\s.-]/g, ''))) {
            newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.birthDate) {
            newErrors.birthDate = 'Vui lòng chọn ngày sinh';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Vui lòng nhập địa chỉ';
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
        // Clear error for this field
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
            let response;
            if (mode === 'create') {
                response = await customerApi.createCustomer(formData);
            } else {
                response = await customerApi.updateCustomer(customer.customerId, formData);
            }

            if (response.success) {
                toast.success(mode === 'create' ? 'Thêm khách hàng thành công' : 'Cập nhật khách hàng thành công');
                onSuccess();
            } else {
                toast.error(response.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error saving customer:', error);
            toast.error(error.response?.data?.message || 'Không thể lưu thông tin khách hàng');
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
                        {mode === 'create' ? 'Thêm khách hàng mới' : 'Chỉnh sửa khách hàng'}
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
                        {/* Họ tên */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Họ tên <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.customerName ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Nhập họ tên khách hàng"
                            />
                            {errors.customerName && (
                                <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
                            )}
                        </div>

                        {/* Giới tính */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Giới tính <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="MALE">Nam</option>
                                <option value="FEMALE">Nữ</option>
                                <option value="OTHER">Khác</option>
                            </select>
                        </div>

                        {/* Ngày sinh */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ngày sinh <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.birthDate ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.birthDate && (
                                <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
                            )}
                        </div>

                        {/* Số điện thoại */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số điện thoại <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="+84 hoặc 0xxxxxxxxx"
                            />
                            {errors.phoneNumber && (
                                <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="example@email.com"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Hạng thành viên */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hạng thành viên <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="membershipLevel"
                                value={formData.membershipLevel}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="COPPER">Đồng</option>
                                <option value="SILVER">Bạc</option>
                                <option value="GOLD">Vàng</option>
                                <option value="PLATINUM">Bạch kim</option>
                                <option value="DIAMOND">Kim cương</option>
                            </select>
                        </div>

                        {/* Địa chỉ */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Địa chỉ <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={3}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Nhập địa chỉ đầy đủ"
                            />
                            {errors.address && (
                                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                            )}
                        </div>
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
                            {loading ? 'Đang lưu...' : (mode === 'create' ? 'Thêm mới' : 'Cập nhật')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerModal;
