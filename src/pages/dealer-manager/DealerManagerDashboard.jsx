import React from 'react';

const DealerManagerDashboard = () => {
    return (
        <div className="p-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Chào mừng, Quản lý bán hàng!
                </h1>
                <p className="text-gray-600 text-lg mb-8">
                    Bạn có thể quản lý toàn bộ đơn hàng của đại lý từ menu bên trái.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                        <div className="text-3xl font-bold text-blue-600 mb-2">📋</div>
                        <h3 className="text-lg font-semibold text-gray-900">Quản lý đơn hàng</h3>
                        <p className="text-gray-600 mt-2">Xem và quản lý tất cả đơn hàng của khách hàng</p>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                        <div className="text-3xl font-bold text-green-600 mb-2">✅</div>
                        <h3 className="text-lg font-semibold text-gray-900">Theo dõi</h3>
                        <p className="text-gray-600 mt-2">Giám sát tiến độ các đơn hàng của nhân viên</p>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                        <div className="text-3xl font-bold text-purple-600 mb-2">👤</div>
                        <h3 className="text-lg font-semibold text-gray-900">Hồ sơ</h3>
                        <p className="text-gray-600 mt-2">Quản lý thông tin cá nhân của bạn</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DealerManagerDashboard;
