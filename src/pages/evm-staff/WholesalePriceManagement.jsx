import React, { useState } from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";

/**
 * Trang Quản lý giá sĩ - dành cho EVM Staff
 */
const WholesalePriceManagement = () => {
    const [wholesalePrices, setWholesalePrices] = useState([
        { id: 1, vehicle: "Honda City", standardPrice: "500M", wholesalePrice: "450M", discount: "10%", status: "Active" },
        { id: 2, vehicle: "Honda Accord", standardPrice: "800M", wholesalePrice: "720M", discount: "10%", status: "Active" },
        { id: 3, vehicle: "Honda CR-V", standardPrice: "1B", wholesalePrice: "880M", discount: "12%", status: "Active" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    const filteredPrices = wholesalePrices.filter((price) =>
        price.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý giá sĩ</h1>
                <p className="text-gray-600">Quản lý giá sĩ cho các sản phẩm</p>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6 gap-4">
                <div className="flex-1 relative max-w-md">
                    <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm xe..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Thêm giá sĩ
                </button>
            </div>

            {/* Wholesale Prices Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Xe</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Giá tiêu chuẩn</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Giá sĩ</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Chiết khấu</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredPrices.map((price) => (
                            <tr key={price.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{price.vehicle}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{price.standardPrice}</td>
                                <td className="px-6 py-4 text-sm font-bold text-green-600">{price.wholesalePrice}</td>
                                <td className="px-6 py-4 text-sm font-bold text-blue-600">{price.discount}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {price.status}
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

export default WholesalePriceManagement;
