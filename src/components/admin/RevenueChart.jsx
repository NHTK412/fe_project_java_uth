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

  return (
    <>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="direct"
            fill="#3B82F6"
            name="TP HCM"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="organic"
            fill="#8B5CF6"
            name="Hà Nội"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="referral"
            fill="#EC4899"
            name="Đà nẵng"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
        <MiniStat
          label="Tổng doanh thu"
          value="186.5M"
          change="+7.2%"
          positive
        />
        <MiniStat label="Đơn hàng" value="1,247" change="+12.5%" positive />
        <MiniStat label="Tỷ lệ chuyển đổi" value="3.2%" change="-0.8%" />
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
