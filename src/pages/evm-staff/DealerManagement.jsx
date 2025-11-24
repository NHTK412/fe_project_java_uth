import React, { useState } from "react";
import { Search, Edit2, Eye } from "lucide-react";

/**
 * Trang Quản lý đại lý - dành cho EVM Staff
 */
const DealerManagement = () => {
    const [dealers, setDealers] = useState([
        { id: 1, name: "Đại lý Honda HCM 1", location: "TP.HCM", contact: "0931234567", status: "Active" },
        { id: 2, name: "Đại lý Honda HCM 2", location: "TP.HCM", contact: "0932345678", status: "Active" },
        { id: 3, name: "Đại lý Honda Hà Nội", location: "Hà Nội", contact: "0933456789", status: "Inactive" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    const filteredDealers = dealers.filter(
        (dealer) =>
            dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dealer.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý đại lý</h1>
                <p className="text-gray-600">Quản lý danh sách các đại lý trong hệ thống</p>
            </div>

            {/* Search */}
            <div className="flex-1 relative mb-6 max-w-md">
                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Tìm kiếm đại lý..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Dealers Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tên đại lý</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Địa điểm</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Liên hệ</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredDealers.map((dealer) => (
                            <tr key={dealer.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{dealer.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{dealer.location}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{dealer.contact}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${dealer.status === "Active"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
                                            }`}
                                    >
                                        {dealer.status}
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

export default DealerManagement;
