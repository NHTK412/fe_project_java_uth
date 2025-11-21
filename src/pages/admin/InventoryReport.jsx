import { useState, useEffect } from "react";
import {
  showSuccess,
  showError,
  showInfo,
} from "../../components/shared/toast";
import { inventoryApi } from "../../services/api/admin/inventoryApi";

const InventoryReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  const [agencies, setAgencies] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);

  const [filters, setFilters] = useState({
    agencyId: "",
    vehicleTypeId: "",
    status: "",
    fromDate: "",
    toDate: "",
  });

  // VehicleStatusEnums
  const statusOptions = [
    { value: "", label: "Tất cả" },
    { value: "IN_STOCK", label: "Tồn Kho" },
    { value: "SOLD", label: "Đã Bán" },
    { value: "IN_TRANSIT", label: "Đang Trung Chuyển" },
    { value: "TEST_DRIVE", label: "Xe Lái Thử" },
  ];

  // Fetch danh sách agency và vehicleTypes
  useEffect(() => {
    // fetchAgencies();
    // fetchVehicleTypes();
  }, []);

  // Fetch báo cáo tồn kho
  const fetchReport = async (params = {}) => {
    setLoading(true);
    try {
      const result = await inventoryApi.getInventoryReport(params);
      console.log("API Response:", result);

      if (result.success && result.data) {
        setData(result.data);

        const hasFilters = Object.keys(params).length > 0;
        if (hasFilters) {
          if (result.data.length === 0) {
            showInfo("Không tìm thấy kết quả phù hợp");
          } else {
            showSuccess(`Tìm thấy ${result.data.length} kết quả`);
          }
        }
      } else {
        showError("Lấy dữ liệu thất bại");
        setData([]);
      }
    } catch (err) {
      showError("Lỗi khi kết nối server");
      console.error("Fetch error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Kiểm tra  filter có lọc gì không
  const hasActiveFilters = () => {
    return (
      filters.agencyId ||
      filters.vehicleTypeId ||
      filters.status ||
      filters.fromDate ||
      filters.toDate
    );
  };

  // Xử lý tìm kiếm/lọc
  const handleSearch = (e) => {
    e.preventDefault();

    if (!hasActiveFilters()) {
      showInfo("Vui lòng nhập ít nhất một điều kiện lọc");
      return;
    }

    const params = {};
    if (filters.agencyId) params.agencyId = filters.agencyId;
    if (filters.vehicleTypeId) params.vehicleTypeId = filters.vehicleTypeId;
    if (filters.status) params.status = filters.status;
    if (filters.fromDate) params.fromDate = filters.fromDate;
    if (filters.toDate) params.toDate = filters.toDate;

    console.log("Params gửi lên API:", params);
    setIsFiltered(true);
    fetchReport(params);
  };

  // Reset bộ lọc
  const handleReset = () => {
    setFilters({
      agencyId: "",
      vehicleTypeId: "",
      status: "",
      fromDate: "",
      toDate: "",
    });
    setData([]);
    setIsFiltered(false);
    showInfo("Đã xóa bộ lọc");
  };

  // Load toàn bộ data
  const handleLoadAll = () => {
    setIsFiltered(false);
    fetchReport();
  };

  // Export Excel
  const handleExport = async () => {
    try {
      showInfo("Đang xuất báo cáo...");

      const params = {};
      if (filters.agencyId) params.agencyId = filters.agencyId;
      if (filters.vehicleTypeId) params.vehicleTypeId = filters.vehicleTypeId;
      if (filters.status) params.status = filters.status;
      if (filters.fromDate) params.fromDate = filters.fromDate;
      if (filters.toDate) params.toDate = filters.toDate;

      const blob = await inventoryApi.exportInventoryReport(params);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `BaoCaoTonKho_${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showSuccess("Xuất báo cáo thành công");
    } catch (err) {
      showError("Xuất báo cáo thất bại");
      console.error("Export error:", err);
    }
  };

  // Format số tiền
  const formatCurrency = (num) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "USD",
    }).format(num || 0);
  };

  // Format số lượng
  const formatQuantity = (num) => {
    return new Intl.NumberFormat("vi-VN").format(num || 0);
  };

  // Tính tổng
  const totalValue = data.reduce(
    (sum, item) => sum + (item.totalValue || 0),
    0
  );
  const totalQuantity = data.reduce(
    (sum, item) => sum + (item.totalQuantity || 0),
    0
  );

  return (
    <div className="space-y-6 w-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Báo cáo tồn kho</h1>
          <p className="text-gray-500 mt-1">
            Theo dõi tình trạng xe điện trong kho
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={loading || data.length === 0}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Xuất Excel
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Bộ lọc</h3>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Agency ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đại lý (ID)
              </label>
              <input
                type="number"
                min="1"
                value={filters.agencyId}
                onChange={(e) =>
                  setFilters({ ...filters, agencyId: e.target.value })
                }
                placeholder="Nhập ID đại lý"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Vehicle Type ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại xe (ID)
              </label>
              <input
                type="number"
                min="1"
                value={filters.vehicleTypeId}
                onChange={(e) =>
                  setFilters({ ...filters, vehicleTypeId: e.target.value })
                }
                placeholder="Nhập ID loại xe"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* From Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Từ ngày
              </label>
              <input
                type="datetime-local"
                value={filters.fromDate}
                onChange={(e) =>
                  setFilters({ ...filters, fromDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đến ngày
              </label>
              <input
                type="datetime-local"
                value={filters.toDate}
                onChange={(e) =>
                  setFilters({ ...filters, toDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Đang tìm..." : "Tìm kiếm"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Đặt lại
            </button>
            <button
              type="button"
              onClick={handleLoadAll}
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Xem tất cả
            </button>
          </div>
        </form>
      </div>

      {/* Thống kê nhanh */}
      {data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Tổng xe trong kho</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {formatQuantity(totalQuantity)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Tổng giá trị</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {formatCurrency(totalValue)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Số loại xe</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {data.length}
            </p>
          </div>
        </div>
      )}

      {/* Bảng dữ liệu */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-gray-600 mt-4">Đang tải dữ liệu...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-gray-600 mt-4 font-medium">
                {isFiltered
                  ? "Không tìm thấy kết quả phù hợp"
                  : "Chưa có dữ liệu"}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {isFiltered
                  ? "Vui lòng thử lại với điều kiện lọc khác"
                  : "Nhập điều kiện lọc và nhấn Tìm kiếm hoặc nhấn Xem tất cả"}
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên xe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phiên bản
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Màu sắc
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Năm SX
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SL tồn
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng giá trị
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đại lý
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, idx) => (
                  <tr
                    key={item.vehicleTypeDetailId || idx}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.vehicleTypeName || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.version || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{
                            backgroundColor:
                              item.color === "Pearl White"
                                ? "#f8f8f8"
                                : item.color === "Midnight Black"
                                  ? "#1a1a1a"
                                  : "#888",
                          }}
                        ></span>
                        {item.color || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">
                      {item.manufactureYear || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          item.totalQuantity === 0
                            ? "bg-red-100 text-red-800"
                            : item.totalQuantity < 5
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {formatQuantity(item.totalQuantity)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-blue-600">
                      {formatCurrency(item.totalValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.agencyName || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryReport;
