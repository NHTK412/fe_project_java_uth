import { X } from 'lucide-react';

const CustomerDetailModal = ({ customer, onClose }) => {
    const genderMap = {
        'MALE': 'Nam',
        'FEMALE': 'Nữ',
        'OTHER': 'Khác'
    };

    const membershipLevelMap = {
        'COPPER': { label: 'Đồng', color: 'bg-orange-100 text-orange-800' },
        'SILVER': { label: 'Bạc', color: 'bg-gray-100 text-gray-800' },
        'GOLD': { label: 'Vàng', color: 'bg-yellow-100 text-yellow-800' },
        'PLATINUM': { label: 'Bạch kim', color: 'bg-purple-100 text-purple-800' },
        'DIAMOND': { label: 'Kim cương', color: 'bg-blue-100 text-blue-800' }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Chi tiết khách hàng
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Thông tin cơ bản */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                    {customer.customerName}
                                </h3>
                                <p className="text-gray-600">Mã khách hàng: #{customer.customerId}</p>
                            </div>
                            <span className={`inline-block px-4 py-2 text-sm font-semibold rounded-lg ${membershipLevelMap[customer.membershipLevel]?.color || 'bg-gray-100 text-gray-800'}`}>
                                {membershipLevelMap[customer.membershipLevel]?.label || customer.membershipLevel}
                            </span>
                        </div>
                    </div>

                    {/* Thông tin chi tiết */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Thông tin cá nhân */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold text-lg mb-4 text-gray-900 border-b border-gray-200 pb-2">
                                Thông tin cá nhân
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm text-gray-600">Giới tính:</span>
                                    <p className="font-medium text-gray-900 mt-1">
                                        {genderMap[customer.gender] || customer.gender}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Ngày sinh:</span>
                                    <p className="font-medium text-gray-900 mt-1">
                                        {formatDate(customer.birthDate)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Thông tin liên hệ */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold text-lg mb-4 text-gray-900 border-b border-gray-200 pb-2">
                                Thông tin liên hệ
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm text-gray-600">Số điện thoại:</span>
                                    <p className="font-medium text-gray-900 mt-1">
                                        {customer.phoneNumber}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Email:</span>
                                    <p className="font-medium text-gray-900 mt-1 break-all">
                                        {customer.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Địa chỉ */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-3 text-gray-900 border-b border-gray-200 pb-2">
                            Địa chỉ
                        </h3>
                        <p className="text-gray-900">
                            {customer.address || 'N/A'}
                        </p>
                    </div>

                    {/* Thông tin hệ thống */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-4 text-gray-900 border-b border-gray-200 pb-2">
                            Thông tin hệ thống
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm text-gray-600">Ngày tạo:</span>
                                <p className="font-medium text-gray-900 mt-1">
                                    {formatDateTime(customer.createdAt)}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600">Cập nhật lần cuối:</span>
                                <p className="font-medium text-gray-900 mt-1">
                                    {formatDateTime(customer.updatedAt)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
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

export default CustomerDetailModal;
