// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const RevenueChart = ({ data, loading }) => {
//   if (loading) {
//     return (
//       <div className="h-80 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <ResponsiveContainer width="100%" height={320}>
//         <BarChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//           <XAxis dataKey="date" tick={{ fontSize: 12 }} />
//           <YAxis tick={{ fontSize: 12 }} />
//           <Tooltip />
//           <Legend />
//           <Bar
//             dataKey="direct"
//             fill="#3B82F6"
//             name="TP HCM"
//             radius={[4, 4, 0, 0]}
//           />
//           <Bar
//             dataKey="organic"
//             fill="#8B5CF6"
//             name="Hà Nội"
//             radius={[4, 4, 0, 0]}
//           />
//           <Bar
//             dataKey="referral"
//             fill="#EC4899"
//             name="Đà nẵng"
//             radius={[4, 4, 0, 0]}
//           />
//         </BarChart>
//       </ResponsiveContainer>

//       <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
//         <MiniStat
//           label="Tổng doanh thu"
//           value="186.5M"
//           change="+7.2%"
//           positive
//         />
//         <MiniStat label="Đơn hàng" value="1,247" change="+12.5%" positive />
//         <MiniStat label="Tỷ lệ chuyển đổi" value="3.2%" change="-0.8%" />
//       </div>
//     </>
//   );
// };

// const MiniStat = ({ label, value, change, positive = false }) => (
//   <div>
//     <p className="text-xs text-gray-500">{label}</p>
//     <p className="text-lg font-bold text-gray-800">{value}</p>
//     {change && (
//       <p className={`text-xs ${positive ? "text-green-500" : "text-red-500"}`}>
//         {change}
//       </p>
//     )}
//   </div>
// );

// export default RevenueChart;

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const RevenueChart = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-sm">Không có dữ liệu</p>
        </div>
      </div>
    );
  }

  // Format currency for tooltip
  const formatCurrency = (value) => {
    if (!value) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-blue-600">
              Doanh thu: {formatCurrency(payload[0]?.value)}
            </p>
            <p className="text-sm text-gray-600">
              Đơn hàng: {payload[0]?.payload?.totalOrders || 0}
            </p>
            <p className="text-sm text-gray-600">
              TB/đơn: {formatCurrency(payload[0]?.payload?.avgOrderValue)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Tính tổng cho mini stats
  const totalRevenue = data.reduce(
    (sum, item) => sum + (item.totalRevenue || 0),
    0
  );
  const totalOrders = data.reduce(
    (sum, item) => sum + (item.totalOrders || 0),
    0
  );
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="agencyName"
            tick={{ fontSize: 12 }}
            angle={-15}
            textAnchor="end"
            height={80}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              if (value >= 1000000000)
                return `${(value / 1000000000).toFixed(1)}B`;
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
              return value;
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="totalRevenue"
            fill="#3B82F6"
            name="Doanh thu"
            radius={[8, 8, 0, 0]}
            maxBarSize={100}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
        <MiniStat
          label="Tổng doanh thu"
          value={formatCurrency(totalRevenue)}
          positive
        />
        <MiniStat
          label="Tổng đơn hàng"
          value={totalOrders.toLocaleString()}
          positive
        />
        <MiniStat label="TB/Đơn" value={formatCurrency(avgOrderValue)} />
      </div>
    </>
  );
};

const MiniStat = ({ label, value, change, positive = false }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-lg font-bold text-gray-800">{value}</p>
    {change && (
      <p className={`text-xs ${positive ? "text-green-500" : "text-red-500"}`}>
        {change}
      </p>
    )}
  </div>
);

export default RevenueChart;
