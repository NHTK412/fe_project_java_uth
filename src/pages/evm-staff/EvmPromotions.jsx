import React, { useState } from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";

/**
 * Trang Quản lý khuyến mãi - dành cho EVM Staff
 */
const EvmPromotions = () => {
    const [promotions, setPromotions] = useState([
        { id: 1, name: "Khuyến mãi mùa hè", discount: "5%", startDate: "2024-06-01", endDate: "2024-08-31", status: "Ended" },
        { id: 2, name: "Khuyến mãi cuối năm", discount: "10%", startDate: "2024-11-01", endDate: "2024-12-31", status: "Active" },
        { id: 3, name: "Khuyến mãi khách VIP", discount: "15%", startDate: "2024-11-15", endDate: "2024-12-15", status: "Active" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    const filteredPromotions = promotions.filter((promo) =>
        promo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý khuyến mãi</h1>
                <p className="text-gray-600">Quản lý các chương trình khuyến mãi toàn hệ thống</p>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6 gap-4">
                <div className="flex-1 relative max-w-md">
                    <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm khuyến mãi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Thêm khuyến mãi
                </button>
            </div>

            {/* Promotions Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tên khuyến mãi</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Mức giảm</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ngày bắt đầu</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ngày kết thúc</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredPromotions.map((promo) => (
                            <tr key={promo.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{promo.name}</td>
                                <td className="px-6 py-4 text-sm font-bold text-green-600">{promo.discount}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{promo.startDate}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{promo.endDate}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${promo.status === "Active"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
                                            }`}
                                    >
                                        {promo.status}
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

export default EvmPromotions;
