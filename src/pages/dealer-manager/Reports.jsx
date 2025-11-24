import React from "react";
import { BarChart3 } from "lucide-react";

/**
 * Trang Báo cáo - dành cho Dealer Manager
 */
const Reports = () => {
    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Báo cáo</h1>
                <p className="text-gray-600">Xem báo cáo chi tiết về hoạt động bán hàng</p>
            </div>

            {/* Report Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Tổng đơn hàng</p>
                            <p className="text-3xl font-bold text-blue-600 mt-2">156</p>
                        </div>
                        <BarChart3 className="w-12 h-12 text-blue-300" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Doanh thu</p>
                            <p className="text-3xl font-bold text-green-600 mt-2">2.5B</p>
                        </div>
                        <BarChart3 className="w-12 h-12 text-green-300" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Đơn hàng này tháng</p>
                            <p className="text-3xl font-bold text-yellow-600 mt-2">45</p>
                        </div>
                        <BarChart3 className="w-12 h-12 text-yellow-300" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Tỷ lệ thành công</p>
                            <p className="text-3xl font-bold text-purple-600 mt-2">85%</p>
                        </div>
                        <BarChart3 className="w-12 h-12 text-purple-300" />
                    </div>
                </div>
            </div>

            {/* Detail Report Table */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Báo cáo chi tiết</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold">Tháng</th>
                                <th className="text-left py-3 px-4 font-semibold">Đơn hàng</th>
                                <th className="text-left py-3 px-4 font-semibold">Doanh thu</th>
                                <th className="text-left py-3 px-4 font-semibold">Chiết khấu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { month: "Tháng 11", orders: 45, revenue: "750M", discount: "50M" },
                                { month: "Tháng 10", orders: 38, revenue: "620M", discount: "40M" },
                                { month: "Tháng 9", orders: 42, revenue: "680M", discount: "45M" },
                            ].map((row, idx) => (
                                <tr key={idx} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">{row.month}</td>
                                    <td className="py-3 px-4">{row.orders}</td>
                                    <td className="py-3 px-4">{row.revenue}</td>
                                    <td className="py-3 px-4">{row.discount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;
