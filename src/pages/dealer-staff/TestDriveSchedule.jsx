import React, { useState } from "react";
import { Plus, Edit2, Trash2, Search, Calendar } from "lucide-react";

/**
 * Trang Quản lý lịch hẹn lái thử - dành cho Dealer Staff
 */
const TestDriveSchedule = () => {
    const [schedules, setSchedules] = useState([
        { id: 1, customer: "Nguyễn Văn A", vehicle: "Honda City", date: "2024-11-25", time: "14:00", status: "Confirmed" },
        { id: 2, customer: "Trần Thị B", vehicle: "Honda Accord", date: "2024-11-26", time: "10:00", status: "Pending" },
        { id: 3, customer: "Lê Văn C", vehicle: "Honda CR-V", date: "2024-11-27", time: "15:30", status: "Completed" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    const filteredSchedules = schedules.filter(
        (schedule) =>
            schedule.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            schedule.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý lịch hẹn lái thử</h1>
                <p className="text-gray-600">Quản lý các lịch hẹn lái thử xe của khách hàng</p>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6 gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm lịch hẹn..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Thêm lịch hẹn
                </button>
            </div>

            {/* Schedules Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Khách hàng</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Xe lái thử</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ngày</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Giờ</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredSchedules.map((schedule) => (
                            <tr key={schedule.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-900">{schedule.customer}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{schedule.vehicle}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{schedule.date}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{schedule.time}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${schedule.status === "Confirmed"
                                                ? "bg-green-100 text-green-800"
                                                : schedule.status === "Pending"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-blue-100 text-blue-800"
                                            }`}
                                    >
                                        {schedule.status}
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

export default TestDriveSchedule;
