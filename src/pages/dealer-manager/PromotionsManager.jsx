import React from "react";
import { TrendingUp } from "lucide-react";

/**
 * Trang Quản lý khuyến mãi - dành cho Dealer Manager
 */
const PromotionsManager = () => {
    const [promotions] = React.useState([
        { id: 1, name: "Khuyến mãi mùa hè", discount: "5%", startDate: "2024-06-01", endDate: "2024-08-31", status: "Ended" },
        { id: 2, name: "Khuyến mãi cuối năm", discount: "10%", startDate: "2024-11-01", endDate: "2024-12-31", status: "Active" },
        { id: 3, name: "Khuyến mãi khách VIP", discount: "15%", startDate: "2024-11-15", endDate: "2024-12-15", status: "Active" },
    ]);

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý khuyến mãi</h1>
                <p className="text-gray-600">Quản lý các chương trình khuyến mãi cho đại lý</p>
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
                        {promotions.map((promo) => (
                            <tr key={promo.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{promo.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <span className="font-semibold text-green-600">{promo.discount}</span>
                                </td>
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
                                <td className="px-6 py-4 text-sm">
                                    <button className="text-blue-600 hover:text-blue-800 font-medium">Chi tiết</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PromotionsManager;
