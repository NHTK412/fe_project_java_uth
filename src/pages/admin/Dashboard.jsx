import React, { useState, useEffect } from "react";
import { Users, MapPin, TrendingUp, DollarSign, Package } from "lucide-react";
import StatCard from "../../components/admin/StatCard";
import RevenueChart from "../../components/admin/RevenueChart";
import InventoryChart from "../../components/admin/InventoryChart";
import QuickLinkCard from "../../components/admin/QuickLinkCard";
import VietnamMap from "./VietnamMap";
import { useNavigate } from "react-router-dom";

import {
  fetchRevenueData,
  fetchInventoryData,
  fetchTotalUsers,
  fetchTotalDealers,
  fetchTotalEmployees,
  fetchTotalRevenue,
  fetchDealersByCity,
} from "../../services/api/admin/dashboardApi";

const Dashboard = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [dealersByCity, setDealersByCity] = useState([]);
  const [totalStats, setTotalStats] = useState({
    users: 0,
    dealers: 0,
    employees: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("7days");

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [
        revenue,
        inventory,
        usersRes,
        dealersRes,
        employeesRes,
        revenueRes,
        dealersCity,
      ] = await Promise.all([
        fetchRevenueData(selectedPeriod),
        fetchInventoryData(selectedPeriod, 4),
        fetchTotalUsers(),
        fetchTotalDealers(),
        fetchTotalEmployees(),
        fetchTotalRevenue(),
        fetchDealersByCity(),
      ]);

      setRevenueData(revenue);
      setInventoryData(inventory);
      setDealersByCity(dealersCity.data || []);
      setTotalStats({
        users: usersRes.data,
        dealers: dealersRes.data,
        employees: employeesRes.data,
        revenue: revenueRes.data,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="space-y-6 w-full p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Tổng quan hệ thống</p>
        </div>
        <button
          onClick={loadDashboardData}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Làm mới
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Doanh thu theo nguồn
            </h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="90days">90 ngày qua</option>
            </select>
          </div>
          <RevenueChart data={revenueData} loading={loading} />
        </div>

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Tồn kho - Top đại lý
            </h3>
            <button
              className="text-blue-500 text-sm hover:underline font-medium"
              onClick={() => navigate("/admin/inventory")}
            >
              Xem tất cả
            </button>
          </div>
          <InventoryChart data={inventoryData} loading={loading} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <p className="col-span-4 text-center text-gray-500">
            Đang tải dữ liệu...
          </p>
        ) : (
          <>
            <StatCard
              icon={Users}
              label="Tổng người dùng"
              value={totalStats.users}
              color="blue"
            />
            <StatCard
              icon={MapPin}
              label="Tổng đại lý"
              value={totalStats.dealers}
              color="purple"
            />
            <StatCard
              icon={TrendingUp}
              label="Tổng nhân viên"
              value={totalStats.employees}
              color="pink"
            />
            <StatCard
              icon={DollarSign}
              label="Tổng doanh thu"
              value={totalStats.revenue}
              color="green"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Đại lý trên toàn quốc
          </h3>
          <VietnamMap dealers={dealersByCity} />
        </div>

        <div className="space-y-4">
          <QuickLinkCard
            icon={Users}
            title="Quản lý người dùng"
            description="Xem và quản lý tất cả người dùng"
            onClick={() => navigate("/admin/users")}
            gradient="blue"
          />
          <QuickLinkCard
            icon={DollarSign}
            title="Báo cáo doanh thu"
            description="Chi tiết doanh thu theo thời gian"
            onClick={() => navigate("/admin/revenue")}
            gradient="purple"
          />
          <QuickLinkCard
            icon={Package}
            title="Quản lý tồn kho"
            description="Theo dõi tình trạng hàng hóa"
            onClick={() => navigate("/admin/inventory")}
            gradient="pink"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
