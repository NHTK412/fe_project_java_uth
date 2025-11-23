import React, { useState } from "react";
import { Search, Edit2, Trash2 } from "lucide-react";

/**
 * Trang Quản lý tồn kho - dành cho EVM Staff
 */
const EvmInventory = () => {
    const [inventory, setInventory] = useState([
        { id: 1, vehicle: "Honda City", totalStock: 150, reserved: 30, available: 120, lastUpdate: "2024-11-20" },
        { id: 2, vehicle: "Honda Accord", totalStock: 80, reserved: 15, available: 65, lastUpdate: "2024-11-19" },
        { id: 3, vehicle: "Honda CR-V", totalStock: 100, reserved: 25, available: 75, lastUpdate: "2024-11-18" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    const filteredInventory = inventory.filter((item) =>
        item.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý tồn kho</h1>
                <p className="text-gray-600">Quản lý tồn kho tổng thể hệ thống</p>
            </div>

            {/* Search */}
            <div className="flex-1 relative mb-6 max-w-md">
                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Tìm kiếm xe..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Xe</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tổng tồn kho</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Đã đặt hàng</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Có sẵn</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Cập nhật cuối</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredInventory.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.vehicle}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <span className="text-lg font-bold">{item.totalStock}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-yellow-600 font-semibold">{item.reserved}</td>
                                <td className="px-6 py-4 text-sm text-green-600 font-semibold">{item.available}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{item.lastUpdate}</td>
                                <td className="px-6 py-4 text-sm flex gap-2">
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

export default EvmInventory;
