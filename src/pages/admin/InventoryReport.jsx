import { useState, useEffect } from "react";
import {
  Package,
  Download,
  Filter,
  RefreshCw,
  Search,
  RotateCcw,
  Eye,
} from "lucide-react";
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

  const [showFilters, setShowFilters] = useState(false);

  const statusOptions = [
    { value: "", label: "Tất cả" },
    { value: "IN_STOCK", label: "Tồn Kho" },
    { value: "SOLD", label: "Đã Bán" },
    { value: "IN_TRANSIT", label: "Đang Trung Chuyển" },
    { value: "TEST_DRIVE", label: "Xe Lái Thử" },
  ];

  useEffect(() => {
    fetchReport(); 
  }, []);


  const fetchReport = async (params = {}) => {
    setLoading(true);
    try {
      const result = await inventoryApi.getInventoryReport(params);

      if (result.success && result.data) {
        setData(result.data);

        const hasFilters = Object.keys(params).length > 0;
        if (hasFilters) {
          if (result.data.length === 0) {
            showInfo("Not found any matching results");
          } else {
            showSuccess(`Found ${result.data.length} results`);
          }
        }
      } else {
        showError("Failed to fetch data");
        setData([]);
      }
    } catch (err) {
      showError("Failed to connect to server");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const hasActiveFilters = () => {
    return (
      filters.agencyId ||
      filters.vehicleTypeId ||
      filters.status ||
      filters.fromDate ||
      filters.toDate
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!hasActiveFilters()) {
      showInfo("Please enter at least one filter condition");
      return;
    }

    const params = {};
    if (filters.agencyId) params.agencyId = filters.agencyId;
    if (filters.vehicleTypeId) params.vehicleTypeId = filters.vehicleTypeId;
    if (filters.status) params.status = filters.status;
    if (filters.fromDate) params.fromDate = filters.fromDate;
    if (filters.toDate) params.toDate = filters.toDate;

    setIsFiltered(true);
    fetchReport(params);
  };

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
    showInfo("Filters cleared");
  };

  const handleLoadAll = () => {
    setIsFiltered(false);
    fetchReport();
  };

  // Export Excel
  const handleExport = async () => {
    try {
      showInfo("Exporting report...");

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

      showSuccess("Export report successfully");
    } catch (err) {
      showError("Export report failed");
    }
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num || 0);
  };

  const formatQuantity = (num) => {
    return new Intl.NumberFormat("vi-VN").format(num || 0);
  };

  const totalValue = data.reduce(
    (sum, item) => sum + (item.totalValue || 0),
    0
  );
  const totalQuantity = data.reduce(
    (sum, item) => sum + (item.totalQuantity || 0),
    0
  );

  return (
    <div className="space-y-6 p-1">
      {/* Header - Đồng bộ với RevenueReport */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="w-7 h-7 text-blue-500" />
            Báo cáo tồn kho
          </h1>
          <p className="text-gray-500 mt-1">
            Theo dõi tình trạng xe điện trong kho
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-all duration-200 ${
              showFilters
                ? "bg-blue-50 border-blue-200 text-blue-600"
                : "border-gray-200 hover:bg-gray-50 text-gray-700"
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="font-medium">Bộ lọc</span>
          </button>
          <button
            onClick={handleLoadAll}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 text-gray-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="font-medium">Làm mới</span>
          </button>
          <button
            onClick={handleExport}
            disabled={loading || data.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 disabled:opacity-50 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span className="font-medium">Xuất Excel</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Bộ lọc tìm kiếm</h3>
            <button
              onClick={handleReset}
              className="text-sm text-blue-500 hover:text-blue-600 font-medium"
            >
              Đặt lại
            </button>
          </div>
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
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
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
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
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Trạng thái
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Từ ngày
                </label>
                <input
                  type="datetime-local"
                  value={filters.fromDate}
                  onChange={(e) =>
                    setFilters({ ...filters, fromDate: e.target.value })
                  }
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Đến ngày
                </label>
                <input
                  type="datetime-local"
                  value={filters.toDate}
                  onChange={(e) =>
                    setFilters({ ...filters, toDate: e.target.value })
                  }
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                <span className="font-medium">
                  {loading ? "Đang tìm..." : "Tìm kiếm"}
                </span>
              </button>
              <button
                type="button"
                onClick={handleLoadAll}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all duration-200 disabled:opacity-50"
              >
                <Eye className="w-4 h-4" />
                <span className="font-medium">Xem tất cả</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 border border-blue-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-blue-50">
                <Package className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500 font-medium">
                Tổng xe trong kho
              </p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {formatQuantity(totalQuantity)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-green-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-green-50">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500 font-medium">Tổng giá trị</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {formatCurrency(totalValue)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-purple-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-purple-50">
                <svg
                  className="w-5 h-5 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500 font-medium">Số loại xe</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {data.length}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Chi tiết tồn kho
          </h3>
          <span className="text-sm text-gray-500">
            Tổng: {data.length} bản ghi
          </span>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">
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
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Tên xe
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Phiên bản
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Màu sắc
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">
                    Năm SX
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">
                    Giá
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">
                    SL tồn
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">
                    Tổng giá trị
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Đại lý
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((item, idx) => (
                  <tr
                    key={item.vehicleTypeDetailId || idx}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {item.vehicleTypeName || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.version || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
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
                    <td className="px-6 py-4 text-sm text-center text-gray-600">
                      {item.manufactureYear || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-gray-800">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.totalQuantity === 0
                            ? "bg-red-50 text-red-700"
                            : item.totalQuantity < 5
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-green-50 text-green-700"
                        }`}
                      >
                        {formatQuantity(item.totalQuantity)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-semibold text-green-600">
                      {formatCurrency(item.totalValue)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
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
