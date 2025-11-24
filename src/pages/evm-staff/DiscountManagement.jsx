import React, { useState } from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";

/**
 * Trang Quản lý chiết khấu - dành cho EVM Staff
 */
const DiscountManagement = () => {
    const [discounts, setDiscounts] = useState([
        { id: 1, dealerName: "Đại lý HCM 1", discountPercent: 8, startDate: "2024-11-01", endDate: "2024-12-31", status: "Active" },
        { id: 2, dealerName: "Đại lý HCM 2", discountPercent: 5, startDate: "2024-11-15", endDate: "2024-12-15", status: "Active" },
        { id: 3, dealerName: "Đại lý Hà Nội", discountPercent: 10, startDate: "2024-10-01", endDate: "2024-10-31", status: "Ended" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    const filteredDiscounts = discounts.filter((discount) =>
        discount.dealerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý chiết khấu</h1>
                <p className="text-gray-600">Quản lý chiết khấu cho các đại lý</p>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6 gap-4">
                <div className="flex-1 relative max-w-md">
                    <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm đại lý..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Thêm chiết khấu
                </button>
            </div>

            {/* Discounts Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Đại lý</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Chiết khấu</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ngày bắt đầu</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ngày kết thúc</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredDiscounts.map((discount) => (
                            <tr key={discount.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{discount.dealerName}</td>
                                <td className="px-6 py-4 text-sm font-bold text-blue-600">{discount.discountPercent}%</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{discount.startDate}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{discount.endDate}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${discount.status === "Active"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
                                            }`}
                                    >
                                        {discount.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm flex gap-2">
                                    <button className="text-blue-600 hover:bg-blue-50 p-2 rounded">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button className="text-red-600 hover:bg-red-50 p-2 rounded">
                                        <Trash2 className="w-4 h-4" />
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

export default DiscountManagement;
