import React, { useState } from "react";
import { Search, Eye } from "lucide-react";

/**
 * Trang Xem thông tin xe - dành cho Dealer Staff
 */
const VehicleInfo = () => {
    const [vehicles, setVehicles] = useState([
        { id: 1, name: "Honda City", color: "Trắng", year: 2024, price: "500M", fuel: "Xăng", status: "Available" },
        { id: 2, name: "Honda Accord", color: "Đen", year: 2024, price: "800M", fuel: "Xăng", status: "Available" },
        { id: 3, name: "Honda CR-V", color: "Bạc", year: 2023, price: "1B", fuel: "Xăng", status: "Unavailable" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    const filteredVehicles = vehicles.filter(
        (vehicle) =>
            vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.color.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Xem thông tin xe</h1>
                <p className="text-gray-600">Xem chi tiết thông tin các mẫu xe</p>
            </div>

            {/* Search */}
            <div className="flex-1 relative mb-6 max-w-md">
                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Tìm kiếm xe..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>

            {/* Vehicles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                            <div className="text-6xl">🚗</div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{vehicle.name}</h3>
                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <p>
                                    <span className="font-medium">Màu:</span> {vehicle.color}
                                </p>
                                <p>
                                    <span className="font-medium">Năm:</span> {vehicle.year}
                                </p>
                                <p>
                                    <span className="font-medium">Giá:</span> <span className="text-gray-900 font-semibold">{vehicle.price}</span>
                                </p>
                                <p>
                                    <span className="font-medium">Nhiên liệu:</span> {vehicle.fuel}
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${vehicle.status === "Available"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                >
                                    {vehicle.status}
                                </span>
                                <button className="text-blue-600 hover:text-blue-800">
                                    <Eye className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VehicleInfo;
