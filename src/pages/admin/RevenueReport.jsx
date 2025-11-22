import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Download,
  Filter,
  RefreshCw,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Package,
  Truck,
  CreditCard,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { showSuccess, showError } from "../../components/shared/toast";
import {
  fetchRevenueReport,
  exportRevenueExcel,
  fetchTotalRevenueAll,
  fetchAgencies,
  fetchRevenueByAllStatuses,
} from "../../services/api/admin/revenueApi";

const ORDER_STATUS = {
  PENDING: {
    label: "Chờ xử lý",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  PAID: {
    label: "Đã thanh toán",
    color: "bg-blue-100 text-blue-800",
    icon: CreditCard,
  },
  PENDING_DELIVERY: {
    label: "Chờ giao hàng",
    color: "bg-purple-100 text-purple-800",
    icon: Package,
  },
  DELIVERED: {
    label: "Đã giao",
    color: "bg-green-100 text-green-800",
    icon: Truck,
  },
  INSTALLMENT: {
    label: "Trả góp",
    color: "bg-indigo-100 text-indigo-800",
    icon: CreditCard,
  },
};

const COLORS = ["#f59e0b", "#3b82f6", "#8b5cf6", "#10b981", "#6366f1"];

const formatCurrency = (value) => {
  if (!value && value !== 0) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const formatShortCurrency = (value) => {
  if (!value) return "0";
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("vi-VN");
};

const StatCard = ({ icon: Icon, label, value, subValue, color, loading }) => {
  const colorStyles = {
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-500",
      border: "border-blue-100",
    },
    green: {
      bg: "bg-green-50",
      icon: "text-green-500",
      border: "border-green-100",
    },
    yellow: {
      bg: "bg-yellow-50",
      icon: "text-yellow-500",
      border: "border-yellow-100",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-500",
      border: "border-purple-100",
    },
    indigo: {
      bg: "bg-indigo-50",
      icon: "text-indigo-500",
      border: "border-indigo-100",
    },
  };
  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div
      className={`bg-white rounded-xl p-5 border ${style.border} hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${style.bg}`}>
          <Icon className={`w-5 h-5 ${style.icon}`} />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        {loading ? (
          <div className="h-8 bg-gray-100 rounded animate-pulse mt-1" />
        ) : (
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        )}
        {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
        <p className="font-medium text-gray-800 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}:{" "}
            {entry.name === "Doanh thu"
              ? formatCurrency(entry.value)
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const RevenueReport = () => {
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [agencies, setAgencies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  const [filters, setFilters] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 6))
      .toISOString()
      .split("T")[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 6))
      .toISOString()
      .split("T")[0],
    agencyId: "",
    status: "",
    groupBy: "DAY",
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadAgencies();
  }, []);

  useEffect(() => {
    loadReportData();
  }, [filters, currentPage]);

  const loadAgencies = async () => {
    try {
      const res = await fetchAgencies();
      let agencyList = [];
      if (Array.isArray(res)) agencyList = res;
      else if (res?.data && Array.isArray(res.data)) agencyList = res.data;
      else if (res?.content && Array.isArray(res.content))
        agencyList = res.content;
      setAgencies(agencyList);
    } catch (err) {
      console.error("Failed to load agencies:", err);
    }
  };

  const loadReportData = async () => {
    try {
      setLoading(true);
      const request = {
        startDate: filters.startDate,
        endDate: filters.endDate,
        agencyId: filters.agencyId || null,
        status: filters.status || null,
        groupBy: filters.groupBy,
        page: currentPage - 1,
        size: pageSize,
      };

      // Gọi 3 API song song
      const [reportRes, summaryRes, statusBreakdown] = await Promise.all([
        fetchRevenueReport(request),
        fetchTotalRevenueAll(request),
        fetchRevenueByAllStatuses(),
      ]);

      console.log(" Report response:", reportRes);
      console.log(" Summary response:", summaryRes);
      console.log(" Status breakdown:", statusBreakdown);

      // Xử lý report data
      let reportList = [];
      let total = 0;
      if (Array.isArray(reportRes)) {
        reportList = reportRes;
        total = reportRes.length;
      } else if (reportRes?.data && Array.isArray(reportRes.data)) {
        reportList = reportRes.data;
        total = reportRes.totalElements || reportRes.data.length;
      } else if (reportRes?.content && Array.isArray(reportRes.content)) {
        reportList = reportRes.content;
        total = reportRes.totalElements || reportRes.content.length;
      }

      setReportData(reportList);
      setTotalElements(total);
      setTotalPages(Math.ceil(total / pageSize) || 1);

      // Xử lý summary data - kết hợp tổng + breakdown theo status
      const summaryTotal = summaryRes?.data || summaryRes;

      const mappedSummary = {
        // Tổng từ API /summary/all
        totalRevenue: summaryTotal?.totalRevenue || 0,
        totalOrders: summaryTotal?.totalOrders || 0,
        totalDiscount: summaryTotal?.totalDiscount || 0,
        netRevenue: summaryTotal?.netRevenue || 0,

        // Theo status - từ API /summary/status/{status}
        deliveredOrders: statusBreakdown?.DELIVERED?.totalOrders || 0,
        deliveredRevenue: statusBreakdown?.DELIVERED?.totalRevenue || 0,

        pendingOrders: statusBreakdown?.PENDING?.totalOrders || 0,
        pendingRevenue: statusBreakdown?.PENDING?.totalRevenue || 0,

        installmentOrders: statusBreakdown?.INSTALLMENT?.totalOrders || 0,
        installmentRevenue: statusBreakdown?.INSTALLMENT?.totalRevenue || 0,

        paidOrders: statusBreakdown?.PAID?.totalOrders || 0,
        paidRevenue: statusBreakdown?.PAID?.totalRevenue || 0,

        pendingDeliveryOrders:
          statusBreakdown?.PENDING_DELIVERY?.totalOrders || 0,
        pendingDeliveryRevenue:
          statusBreakdown?.PENDING_DELIVERY?.totalRevenue || 0,

        // Cho pie chart
        revenueByStatus: {
          PENDING: statusBreakdown?.PENDING?.totalRevenue || 0,
          PAID: statusBreakdown?.PAID?.totalRevenue || 0,
          PENDING_DELIVERY:
            statusBreakdown?.PENDING_DELIVERY?.totalRevenue || 0,
          DELIVERED: statusBreakdown?.DELIVERED?.totalRevenue || 0,
          INSTALLMENT: statusBreakdown?.INSTALLMENT?.totalRevenue || 0,
        },
      };

      setSummaryData(mappedSummary);
    } catch (err) {
      showError("Không thể tải dữ liệu báo cáo");
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const request = {
        startDate: filters.startDate,
        endDate: filters.endDate,
        agencyId: filters.agencyId || null,
        status: filters.status || null,
        groupBy: filters.groupBy,
      };

      const blob = await exportRevenueExcel(request);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `BaoCaoDoanhThu_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      showSuccess("Xuất báo cáo thành công!");
    } catch (err) {
      showError("Không thể xuất báo cáo");
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 6))
        .toISOString()
        .split("T")[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 6))
        .toISOString()
        .split("T")[0],
      agencyId: "",
      status: "",
      groupBy: "DAY",
    });
    setCurrentPage(1);
  };

  // Prepare chart data
  const chartData = reportData.map((item) => ({
    name: item.period || item.agencyName || "N/A",
    revenue: item.totalRevenue || 0,
    orders: item.totalOrders || 0,
  }));

  const statusChartData = summaryData?.revenueByStatus
    ? Object.entries(summaryData.revenueByStatus)
        .filter(([_, value]) => value > 0)
        .map(([key, value], idx) => ({
          name: ORDER_STATUS[key]?.label || key,
          value: value,
          color: COLORS[idx % COLORS.length],
        }))
    : [];

  const totalOrders = summaryData?.totalOrders || 0;

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-blue-500" />
            Báo cáo doanh thu
          </h1>
          <p className="text-gray-500 mt-1">
            Thống kê từ {formatDate(filters.startDate)} đến{" "}
            {formatDate(filters.endDate)}
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
            onClick={loadReportData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 text-gray-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="font-medium">Làm mới</span>
          </button>
          <button
            onClick={handleExport}
            disabled={exporting || loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 disabled:opacity-50 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span className="font-medium">
              {exporting ? "Đang xuất..." : "Xuất Excel"}
            </span>
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Bộ lọc tìm kiếm</h3>
            <button
              onClick={resetFilters}
              className="text-sm text-blue-500 hover:text-blue-600 font-medium"
            >
              Đặt lại
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Từ ngày
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Đến ngày
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Đại lý
              </label>
              <select
                value={filters.agencyId}
                onChange={(e) => handleFilterChange("agencyId", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Tất cả đại lý</option>
                {agencies.map((agency) => (
                  <option
                    key={agency.agency_id || agency.id}
                    value={agency.agency_id || agency.id}
                  >
                    {agency.agencyname ||
                      agency.name ||
                      `Agency ${agency.agency_id || agency.id}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Trạng thái
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Tất cả trạng thái</option>
                {Object.entries(ORDER_STATUS).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Nhóm theo
              </label>
              <select
                value={filters.groupBy}
                onChange={(e) => handleFilterChange("groupBy", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="DAY">Theo ngày</option>
                <option value="WEEK">Theo tuần</option>
                <option value="MONTH">Theo tháng</option>
                <option value="AGENCY">Theo đại lý</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          label="Tổng doanh thu"
          value={formatCurrency(summaryData?.totalRevenue)}
          subValue={`${totalOrders} đơn hàng`}
          color="blue"
          loading={loading}
        />
        <StatCard
          icon={CheckCircle}
          label="Đã giao hàng"
          value={summaryData?.deliveredOrders || 0}
          subValue={formatCurrency(summaryData?.deliveredRevenue)}
          color="green"
          loading={loading}
        />
        <StatCard
          icon={Clock}
          label="Chờ xử lý"
          value={summaryData?.pendingOrders || 0}
          subValue={formatCurrency(summaryData?.pendingRevenue)}
          color="yellow"
          loading={loading}
        />
        <StatCard
          icon={CreditCard}
          label="Trả góp"
          value={summaryData?.installmentOrders || 0}
          subValue={formatCurrency(summaryData?.installmentRevenue)}
          color="indigo"
          loading={loading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Biểu đồ doanh thu
          </h3>
          {loading ? (
            <div className="h-80 flex items-center justify-center">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Không có dữ liệu</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis
                  tickFormatter={formatShortCurrency}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="revenue"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                  name="Doanh thu"
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status Pie Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Phân bổ theo trạng thái
          </h3>
          {loading ? (
            <div className="h-72 flex items-center justify-center">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : statusChartData.length === 0 ? (
            <div className="h-72 flex items-center justify-center">
              <div className="text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Chưa có dữ liệu</p>
              </div>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {statusChartData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {statusChartData.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-medium">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Chi tiết doanh thu
          </h3>
          <span className="text-sm text-gray-500">
            Tổng: {totalElements} bản ghi
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  STT
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  {filters.groupBy === "AGENCY" ? "Đại lý" : "Thời gian"}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Số đơn
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Doanh thu
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  TB/Đơn
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td colSpan={5} className="px-6 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : reportData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                      Không có dữ liệu
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Thử thay đổi bộ lọc để xem kết quả khác
                    </p>
                  </td>
                </tr>
              ) : (
                reportData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {item.period || item.agencyName || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {item.totalOrders || 0} đơn
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                      {formatCurrency(item.totalRevenue)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.totalOrders
                        ? formatCurrency(item.totalRevenue / item.totalOrders)
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <p className="text-sm text-gray-500">
              Trang {currentPage} / {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueReport;
