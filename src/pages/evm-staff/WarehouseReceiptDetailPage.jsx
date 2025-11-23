import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { warehouseReceiptApi } from "../../services/api/evm-staff/warehouseReceiptApi";
import { showError } from "../../components/shared/toast";

const WarehouseReceiptDetailPage = () => {
  const { warehouseReceiptId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const fetchReceipt = async () => {
    if (!warehouseReceiptId) return; // tránh fetch khi id null
    setLoading(true);
    try {
      const res = await warehouseReceiptApi.getById(warehouseReceiptId);
      if (res?.success) setReceipt(res.data); // lấy data từ ApiResponse
      else showError(res?.message || "Không thể tải dữ liệu");
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || "Lỗi server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipt();
  }, [warehouseReceiptId]);

  if (loading) return <div>Đang tải...</div>;
  if (!receipt) return <div>Không có dữ liệu phiếu nhập</div>;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 border rounded hover:bg-gray-50"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">
          Chi tiết phiếu nhập #{receipt.warehouseReceiptId || "Mới"}
        </h1>
      </div>

      {/* Thông tin phiếu nhập */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white shadow rounded-lg p-4">
        <div>
          <p>
            <span className="font-semibold">Ngày nhập:</span>{" "}
            {receipt.warehouseReceiptDate
              ? new Date(receipt.warehouseReceiptDate).toLocaleString()
              : "-"}
          </p>
          <p>
            <span className="font-semibold">Lý do:</span> {receipt.reason || "-"}
          </p>
          <p>
            <span className="font-semibold">Tổng tiền:</span>{" "}
            {receipt.totalAmount ?? "-"}
          </p>
          <p>
            <span className="font-semibold">Ghi chú:</span> {receipt.note || "-"}
          </p>
          <p>
            <span className="font-semibold">Trạng thái:</span> {receipt.status || "-"}
          </p>
        </div>
        <div>
          <p className="font-semibold mb-1">Nhân viên phụ trách:</p>
          <p>{receipt.employee?.employeeName || "-"}</p>
          <p>{receipt.employee?.username || "-"}</p>
          <p>{receipt.employee?.phoneNumber || "-"}</p>
          <p>{receipt.employee?.email || "-"}</p>

          <p className="font-semibold mt-4 mb-1">Đại lý:</p>
          <p>{receipt.agency?.agencyName || "-"}</p>
          <p>{receipt.agency?.address || "-"}</p>
          <p>{receipt.agency?.phoneNumber || "-"}</p>
          <p>{receipt.agency?.email || "-"}</p>
        </div>
      </div>

      {/* Danh sách xe */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Danh sách xe</h2>
        <table className="min-w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Số khung</th>
              <th className="px-4 py-2 border">Số máy</th>
              <th className="px-4 py-2 border">Tình trạng</th>
              <th className="px-4 py-2 border">Trạng thái</th>
              <th className="px-4 py-2 border">Loại xe</th>
            </tr>
          </thead>
          <tbody>
            {receipt.vehicles?.length > 0 ? (
              receipt.vehicles.map((v) => (
                <tr key={v.vehicleId} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{v.vehicleId}</td>
                  <td className="px-4 py-2 border">{v.chassisNumber}</td>
                  <td className="px-4 py-2 border">{v.machineNumber}</td>
                  <td className="px-4 py-2 border">{v.vehicleCondition}</td>
                  <td className="px-4 py-2 border">{v.status}</td>
                  <td className="px-4 py-2 border">
                    {v.vehicleTypeDetail
                      ? `${v.vehicleTypeDetail.version} - ${v.vehicleTypeDetail.color}`
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Không có xe
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WarehouseReceiptDetailPage;
