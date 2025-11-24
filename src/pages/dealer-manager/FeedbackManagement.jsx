import React, { useState } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";

/**
 * Trang Quản lý phản hồi - dành cho Dealer Manager
 */
const FeedbackManagementDealerManager = () => {
    const [feedbacks, setFeedbacks] = useState([
        { id: 1, customer: "Nguyễn Văn A", date: "2024-11-20", rating: 5, message: "Sản phẩm tốt", status: "Resolved" },
        { id: 2, customer: "Trần Thị B", date: "2024-11-19", rating: 4, message: "Chất lượng dịch vụ tốt", status: "Pending" },
        { id: 3, customer: "Lê Văn C", date: "2024-11-18", rating: 3, message: "Cần cải thiện", status: "Resolved" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    const filteredFeedbacks = feedbacks.filter(
        (feedback) =>
            feedback.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            feedback.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Ghi nhận và xử lý phản hồi</h1>
                <p className="text-gray-600">Quản lý phản hồi từ khách hàng</p>
            </div>

            {/* Search */}
            <div className="flex justify-between items-center mb-6 gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm phản hồi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                </div>
            </div>

            {/* Feedbacks Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Khách hàng</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ngày</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Đánh giá</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nội dung</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredFeedbacks.map((feedback) => (
                            <tr key={feedback.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-900">{feedback.customer}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{feedback.date}</td>
                                <td className="px-6 py-4 text-sm text-yellow-600">{"⭐".repeat(feedback.rating)}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{feedback.message}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${feedback.status === "Resolved"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-yellow-100 text-yellow-800"
                                            }`}
                                    >
                                        {feedback.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Xử lý</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FeedbackManagementDealerManager;
