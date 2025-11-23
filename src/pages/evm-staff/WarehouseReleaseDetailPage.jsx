import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { warehouseReleaseNoteApi } from "../../services/api/evm-staff/warehouseReleaseNoteApi";
import { showError } from "../../components/shared/toast";

const WarehouseReleaseDetailPage = () => {
  const { warehouseReleaseNoteId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [release, setRelease] = useState(null);

  const fetchRelease = async () => {
    if (!warehouseReleaseNoteId) return; // tránh fetch khi id null/undefined
    setLoading(true);
    try {
      const res = await warehouseReleaseNoteApi.getById(warehouseReleaseNoteId);
      if (res?.success) setRelease(res.data);
      else showError(res?.message || "Không thể tải dữ liệu");
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || "Lỗi server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelease();
  }, [warehouseReleaseNoteId]);

  if (!warehouseReleaseNoteId) return <div>ID phiếu xuất không hợp lệ</div>;
  if (loading) return <div>Đang tải...</div>;
  if (!release) return <div>Không có dữ liệu phiếu xuất</div>;

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
          Chi tiết phiếu xuất #{release.warehouseReleaseNoteId || "Mới"}
        </h1>
      </div>

      {/* Thông tin phiếu xuất */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white shadow rounded-lg p-4">
        <div>
          <p><span className="font-semibold">Ngày xuất:</span>{" "}
            {release.warehouseReleaseNoteDate
              ? new Date(release.warehouseReleaseNoteDate).toLocaleString()
              : "-"}
          </p>
          <p><span className="font-semibold">Lý do:</span> {release.reason || "-"}</p>
          <p><span className="font-semibold">Tổng tiền:</span> {release.totalAmount ?? "-"}</p>
          <p><span className="font-semibold">Ghi chú:</span> {release.note || "-"}</p>
          <p><span className="font-semibold">Trạng thái:</span> {release.status || "-"}</p>
        </div>
        <div>
          <p className="font-semibold mb-1">Nhân viên phụ trách:</p>
          <p>{release.employee?.employeeName || "-"}</p>
          <p>{release.employee?.username || "-"}</p>
          <p>{release.employee?.phoneNumber || "-"}</p>
          <p>{release.employee?.email || "-"}</p>

          <p className="font-semibold mt-4 mb-1">Đại lý:</p>
          <p>{release.agency?.agencyName || "-"}</p>
          <p>{release.agency?.address || "-"}</p>
          <p>{release.agency?.phoneNumber || "-"}</p>
          <p>{release.agency?.email || "-"}</p>
        </div>
      </div>

      {/* Danh sách xe */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Danh sách xe xuất</h2>
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
            {release.vehicles?.length > 0 ? (
              release.vehicles.map((v) => (
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
                <td colSpan={6} className="text-center py-4">Không có xe xuất</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WarehouseReleaseDetailPage;
