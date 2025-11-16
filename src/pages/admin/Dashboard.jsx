/**
 * Trang Dashboard chính
 */
const Dashboard = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

            {/* Placeholder content */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <h2 className="text-sm font-semibold text-gray-600 mb-2">Tổng nhân viên</h2>
                    <p className="text-3xl font-bold text-blue-600">12</p>
                </div>
                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <h2 className="text-sm font-semibold text-gray-600 mb-2">Hoạt động</h2>
                    <p className="text-3xl font-bold text-green-600">8</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                    <h2 className="text-sm font-semibold text-gray-600 mb-2">Đơn hàng</h2>
                    <p className="text-3xl font-bold text-yellow-600">24</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                    <h2 className="text-sm font-semibold text-gray-600 mb-2">Doanh thu</h2>
                    <p className="text-3xl font-bold text-purple-600">15M</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
