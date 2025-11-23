import React, { useState } from "react";
import { Search, Edit2, Eye } from "lucide-react";

/**
 * Trang Quản lý báo giá - dành cho Dealer Staff
 */
const QuoteManagement = () => {
    const [quotes, setQuotes] = useState([
        { id: 1, customer: "Nguyễn Văn A", vehicle: "Honda City", amount: "500M", date: "2024-11-20", status: "Draft" },
        { id: 2, customer: "Trần Thị B", vehicle: "Honda Accord", amount: "800M", date: "2024-11-19", status: "Sent" },
        { id: 3, customer: "Lê Văn C", vehicle: "Honda CR-V", amount: "1B", date: "2024-11-18", status: "Accepted" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    const filteredQuotes = quotes.filter(
        (quote) =>
            quote.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quote.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý báo giá</h1>
                <p className="text-gray-600">Quản lý các báo giá gửi cho khách hàng</p>
            </div>

            {/* Search */}
            <div className="flex justify-between items-center mb-6 gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm báo giá..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
            </div>

            {/* Quotes Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Khách hàng</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Xe</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Giá báo giá</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ngày tạo</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredQuotes.map((quote) => (
                            <tr key={quote.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-900">{quote.customer}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{quote.vehicle}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{quote.amount}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{quote.date}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${quote.status === "Draft"
                                                ? "bg-gray-100 text-gray-800"
                                                : quote.status === "Sent"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-green-100 text-green-800"
                                            }`}
                                    >
                                        {quote.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm flex gap-2">
                                    <button className="text-blue-600 hover:bg-blue-50 p-2 rounded">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button className="text-blue-600 hover:bg-blue-50 p-2 rounded">
                                        <Edit2 className="w-4 h-4" />
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

export default QuoteManagement;
