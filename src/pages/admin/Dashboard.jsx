// import React, { useState, useEffect } from "react";
// import {
//   Users,
//   MapPin,
//   TrendingUp,
//   DollarSign,
//   Package,
//   RefreshCw,
// } from "lucide-react";
// import StatCard from "../../components/admin/StatCard";
// import RevenueChart from "../../components/admin/RevenueChart";
// import InventoryChart from "../../components/admin/InventoryChart";
// import QuickLinkCard from "../../components/admin/QuickLinkCard";
// import VietnamMap from "./VietnamMap";
// import { useNavigate } from "react-router-dom";

// import {
//   fetchRevenueData,
//   fetchInventoryData,
//   fetchTotalUsers,
//   fetchTotalDealers,
//   fetchTotalEmployees,
//   fetchTotalRevenue,
//   fetchDealersByCity,
// } from "../../services/api/admin/dashboardApi";

// const Dashboard = () => {
//   const [revenueData, setRevenueData] = useState([]);
//   const [inventoryData, setInventoryData] = useState([]);
//   const [dealersByCity, setDealersByCity] = useState([]);
//   const [totalStats, setTotalStats] = useState({
//     users: 0,
//     dealers: 0,
//     employees: 0,
//     revenue: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [selectedPeriod, setSelectedPeriod] = useState("7days");

//   useEffect(() => {
//     loadDashboardData();
//   }, [selectedPeriod]);

//   const loadDashboardData = async () => {
//     try {
//       setLoading(true);
//       const [
//         revenue,
//         inventory,
//         usersRes,
//         dealersRes,
//         employeesRes,
//         revenueRes,
//         dealersCity,
//       ] = await Promise.all([
//         fetchRevenueData(selectedPeriod),
//         fetchInventoryData(selectedPeriod, 4),
//         fetchTotalUsers(),
//         fetchTotalDealers(),
//         fetchTotalEmployees(),
//         fetchTotalRevenue(),
//         fetchDealersByCity(),
//       ]);

//       setRevenueData(revenue);
//       setInventoryData(inventory);
//       setDealersByCity(dealersCity.data || []);
//       setTotalStats({
//         users: usersRes.data,
//         dealers: dealersRes.data,
//         employees: employeesRes.data,
//         revenue: revenueRes.data,
//       });
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const navigate = useNavigate();

//   return (
//     <div className="space-y-6 w-full p-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//             <TrendingUp className="w-7 h-7 text-blue-500" />
//             Dashboard
//           </h1>
//           <p className="text-gray-500 mt-1">Tổng quan hệ thống</p>
//         </div>
//         <button
//           onClick={loadDashboardData}
//           className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-sm"
//         >
//           <RefreshCw className="w-4 h-4" />
//           <span className="font-medium">Làm mới</span>
//         </button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-gray-800">
//               Doanh thu theo nguồn
//             </h3>
//             <select
//               value={selectedPeriod}
//               onChange={(e) => setSelectedPeriod(e.target.value)}
//               className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="7days">7 ngày qua</option>
//               <option value="30days">30 ngày qua</option>
//               <option value="90days">90 ngày qua</option>
//             </select>
//           </div>
//           <RevenueChart data={revenueData} loading={loading} />
//         </div>

//         <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-gray-800">
//               Tồn kho - Top đại lý
//             </h3>
//             <button
//               className="text-blue-500 text-sm hover:underline font-medium"
//               onClick={() => navigate("/admin/inventory")}
//             >
//               Xem tất cả
//             </button>
//           </div>
//           <InventoryChart data={inventoryData} loading={loading} />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {loading ? (
//           <p className="col-span-4 text-center text-gray-500">
//             Đang tải dữ liệu...
//           </p>
//         ) : (
//           <>
//             <StatCard
//               icon={Users}
//               label="Tổng người dùng"
//               value={totalStats.users}
//               color="blue"
//             />
//             <StatCard
//               icon={MapPin}
//               label="Tổng đại lý"
//               value={totalStats.dealers}
//               color="purple"
//             />
//             <StatCard
//               icon={TrendingUp}
//               label="Tổng nhân viên"
//               value={totalStats.employees}
//               color="pink"
//             />
//             <StatCard
//               icon={DollarSign}
//               label="Tổng doanh thu"
//               value={totalStats.revenue}
//               color="green"
//             />
//           </>
//         )}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 bg-gray-50 rounded-lg p-6 border border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">
//             Đại lý trên toàn quốc
//           </h3>
//           <VietnamMap dealers={dealersByCity} />
//         </div>

//         <div className="space-y-4">
//           <QuickLinkCard
//             icon={Users}
//             title="Quản lý người dùng"
//             description="Xem và quản lý tất cả người dùng"
//             onClick={() => navigate("/admin/users")}
//             gradient="blue"
//           />
//           <QuickLinkCard
//             icon={DollarSign}
//             title="Báo cáo doanh thu"
//             description="Chi tiết doanh thu theo thời gian"
//             onClick={() => navigate("/admin/revenue")}
//             gradient="purple"
//           />
//           <QuickLinkCard
//             icon={Package}
//             title="Quản lý tồn kho"
//             description="Theo dõi tình trạng hàng hóa"
//             onClick={() => navigate("/admin/inventory")}
//             gradient="pink"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from "react";
import {
  Users,
  MapPin,
  TrendingUp,
  DollarSign,
  Package,
  RefreshCw,
} from "lucide-react";
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
  const navigate = useNavigate();

  // State
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

  // Load data khi mount hoặc period thay đổi
  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  // Load tất cả dữ liệu
  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Gọi tất cả API song song
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

      console.log("📊 Dashboard API Responses:");
      console.log("  - Revenue data:", revenue);
      console.log("  - Inventory data:", inventory);
      console.log("  - Total users:", usersRes);
      console.log("  - Total dealers:", dealersRes);
      console.log("  - Total employees:", employeesRes);
      console.log("  - Total revenue:", revenueRes);
      console.log("  - Dealers by city:", dealersCity);

      // Set state
      setRevenueData(revenue);
      setInventoryData(inventory);
      setDealersByCity(dealersCity.data || []);
      setTotalStats({
        users: usersRes.data || 0,
        dealers: dealersRes.data || 0,
        employees: employeesRes.data || 0,
        revenue: revenueRes.data || 0,
      });
    } catch (error) {
      console.error("❌ Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-blue-500" />
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Tổng quan hệ thống</p>
        </div>
        <button
          onClick={loadDashboardData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span className="font-medium">Làm mới</span>
        </button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Doanh thu theo nguồn
            </h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              disabled={loading}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="90days">90 ngày qua</option>
            </select>
          </div>
          <RevenueChart data={revenueData} loading={loading} />
        </div>

        {/* Inventory Chart */}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-4 flex items-center justify-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          </div>
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

      {/* Bottom Grid - Map + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vietnam Map */}
        <div className="lg:col-span-2 bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Đại lý trên toàn quốc
          </h3>
          <VietnamMap dealers={dealersByCity} />
        </div>

        {/* Quick Links */}
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
