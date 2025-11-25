import React, { useState } from "react";
import ImportRequestTable from "../../components/admin/ImportRequestTable";

export default function ImportRequestListPage() {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleDelete = async (item) => {
        // Để trống cho sau
    };

    return (
        <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">
                    Đơn đặt hàng từ đại lý
                </h1>
                <p className="text-gray-600 mt-2">
                    Quản lý các yêu cầu nhập hàng từ đại lý
                </p>
            </div>

            <ImportRequestTable
                key={refreshKey}
                onDelete={handleDelete}
            />
        </div>
    );
}
