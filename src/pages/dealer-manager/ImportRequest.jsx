import React, { useState } from "react";
import { Search, Plus, Eye } from "lucide-react";

/**
 * Trang Đặt xe từ hãng - dành cho Dealer Manager
 */
const ImportRequest = () => {
    const [requests, setRequests] = useState([
        { id: "IMP001", vehicle: "Honda City", quantity: 10, date: "2024-11-20", deliveryDate: "2024-12-15", status: "Confirmed" },
        { id: "IMP002", vehicle: "Honda Accord", quantity: 5, date: "2024-11-19", deliveryDate: "2024-12-10", status: "Processing" },
        { id: "IMP003", vehicle: "Honda CR-V", quantity: 3, date: "2024-11-18", deliveryDate: "2024-12-05", status: "Delivered" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    const filteredRequests = requests.filter(
        (request) =>
            request.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt xe từ hãng</h1>
                <p className="text-gray-600">Quản lý các yêu cầu đặt xe từ hãng sản xuất</p>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6 gap-4">
                <div className="flex-1 relative max-w-md">
                    <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm yêu cầu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                </div>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Tạo yêu cầu
                </button>
            </div>

            {/* Requests Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Mã yêu cầu</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Xe</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Số lượng</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ngày đặt</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ngày giao dự kiến</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredRequests.map((request) => (
                            <tr key={request.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{request.id}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{request.vehicle}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 font-semibold">{request.quantity}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{request.date}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{request.deliveryDate}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${request.status === "Confirmed"
                                                ? "bg-green-100 text-green-800"
                                                : request.status === "Processing"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-blue-100 text-blue-800"
                                            }`}
                                    >
                                        {request.status}
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

export default ImportRequest;
