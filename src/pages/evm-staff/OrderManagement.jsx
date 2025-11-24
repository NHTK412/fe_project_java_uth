import React, { useState } from "react";
import { Search, Plus, Eye } from "lucide-react";

/**
 * Trang Quản lý đơn hàng order - dành cho EVM Staff
 */
const OrderManagement = () => {
    const [orders, setOrders] = useState([
        { id: "ORD001", dealer: "Đại lý HCM 1", vehicle: "Honda City", quantity: 5, amount: "2.5B", date: "2024-11-20", status: "Confirmed" },
        { id: "ORD002", dealer: "Đại lý HCM 2", vehicle: "Honda Accord", quantity: 3, amount: "2.4B", date: "2024-11-19", status: "Pending" },
        { id: "ORD003", dealer: "Đại lý Hà Nội", vehicle: "Honda CR-V", quantity: 2, amount: "2B", date: "2024-11-18", status: "Shipped" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    const filteredOrders = orders.filter(
        (order) =>
            order.dealer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý đơn hàng order</h1>
                <p className="text-gray-600">Quản lý đơn hàng từ các đại lý</p>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6 gap-4">
                <div className="flex-1 relative max-w-md">
                    <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm đơn hàng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Tạo đơn hàng
                </button>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Mã đơn</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Đại lý</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Xe</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Số lượng</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tổng tiền</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ngày</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{order.id}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{order.dealer}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{order.vehicle}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 font-semibold">{order.quantity}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 font-bold">{order.amount}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === "Confirmed"
                                                ? "bg-green-100 text-green-800"
                                                : order.status === "Pending"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-blue-100 text-blue-800"
                                            }`}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <button className="text-blue-600 hover:bg-blue-50 p-2 rounded">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManagement;
