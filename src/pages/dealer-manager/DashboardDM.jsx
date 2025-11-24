import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Car,
  DollarSign,
  ShoppingCart,
  Users,
  ArrowUpRight,
  Calendar,
  Truck,
  Package,
  Gift,
  Bell,
  Search,
  MessageSquare,
  BarChart3,
  Clipboard,
  Building,
  Briefcase,
  Home,
  ChevronRight,
  Star,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardDM = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Quick stats
  const quickStats = [
    {
      title: 'Doanh thu hôm nay',
      value: '₫2.4B',
      change: '+15.3%',
      icon: DollarSign,
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Đơn hàng mới',
      value: '28',
      change: '+8.2%',
      icon: ShoppingCart,
      gradient: 'from-green-500 to-green-600',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Xe tồn kho',
      value: '342',
      change: '-12',
      icon: Car,
      gradient: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Khách hàng mới',
      value: '156',
      change: '+24.5%',
      icon: Users,
      gradient: 'from-orange-500 to-orange-600',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  // Quick actions - Main features
  const quickActions = [
    {
      id: 'feedback',
      title: 'Phản hồi khách hàng',
      description: 'Xem và trả lời phản hồi',
      icon: MessageSquare,
      color: 'from-pink-500 to-rose-500',
      path: '/Dealer-Manager/feedback',
      count: '12 mới'
    },
    {
      id: 'inventory',
      title: 'Kho xe',
      description: 'Quản lý tồn kho xe',
      icon: Home,
      color: 'from-blue-500 to-cyan-500',
      path: '/Dealer-Manager/inventory',
      count: '342 xe'
    },
    {
      id: 'revenue',
      title: 'Doanh thu',
      description: 'Theo dõi doanh thu',
      icon: BarChart3,
      color: 'from-green-500 to-emerald-500',
      path: '/Dealer-Manager/revenue',
      count: '₫45.2B'
    },
    {
      id: 'import-request',
      title: 'Yêu cầu nhập hàng',
      description: 'Tạo yêu cầu nhập xe mới',
      icon: Truck,
      color: 'from-orange-500 to-amber-500',
      path: '/Dealer-Manager/import-request',
      count: '5 chờ duyệt'
    },
    {
      id: 'promotion',
      title: 'Khuyến mãi',
      description: 'Quản lý chương trình KM',
      icon: Gift,
      color: 'from-purple-500 to-violet-500',
      path: '/Dealer-Manager/promotion',
      count: '8 đang chạy'
    },
    {
      id: 'users',
      title: 'Người dùng',
      description: 'Quản lý tài khoản',
      icon: Users,
      color: 'from-indigo-500 to-blue-500',
      path: '/Dealer-Manager/users',
      count: '248 user'
    },
    {
      id: 'orders',
      title: 'Quản lý đơn hàng',
      description: 'Xem và xử lý đơn hàng',
      icon: ShoppingCart,
      color: 'from-teal-500 to-cyan-500',
      path: '/Dealer-Manager/order',
      count: '1,284 đơn'
    },
    {
      id: 'vehicles',
      title: 'Danh mục xe',
      description: 'Quản lý thông tin xe',
      icon: Car,
      color: 'from-red-500 to-pink-500',
      path: '/Dealer-Manager/vehicles',
      count: '24 dòng xe'
    },
    {
      id: 'test-drive',
      title: 'Lịch lái thử',
      description: 'Quản lý lịch hẹn',
      icon: Calendar,
      color: 'from-yellow-500 to-orange-500',
      path: '/Dealer-Manager/test-drive',
      count: '18 lịch'
    },
    {
      id: 'inventory-management',
      title: 'Quản lý tồn kho',
      description: 'Theo dõi nhập xuất',
      icon: Clipboard,
      color: 'from-cyan-500 to-blue-500',
      path: '/Dealer-Manager/inventory-management',
      count: 'Cập nhật'
    },
    {
      id: 'agency-order',
      title: 'Đơn hàng đại lý',
      description: 'Đơn từ các đại lý',
      icon: Building,
      color: 'from-emerald-500 to-green-500',
      path: '/Dealer-Manager/agency-oder-management',
      count: '45 đơn'
    },
    {
      id: 'employee-order',
      title: 'Đơn hàng nhân viên',
      description: 'Đơn của nhân viên',
      icon: Briefcase,
      color: 'from-violet-500 to-purple-500',
      path: '/Dealer-Manager/employee-oder-management',
      count: '67 đơn'
    }
  ];

  // Recent activities
  const recentActivities = [
    { id: 1, type: 'order', message: 'Đơn hàng #1234 đã được xác nhận', time: '5 phút trước', icon: CheckCircle2, color: 'text-green-600' },
    { id: 2, type: 'vehicle', message: 'VinFast VF5 Plus đã nhập kho', time: '15 phút trước', icon: Package, color: 'text-blue-600' },
    { id: 3, type: 'customer', message: 'Khách hàng mới đăng ký tài khoản', time: '1 giờ trước', icon: Users, color: 'text-purple-600' },
    { id: 4, type: 'testdrive', message: 'Lịch lái thử VF8 đã được đặt', time: '2 giờ trước', icon: Calendar, color: 'text-orange-600' }
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Chào mừng trở lại! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                {currentTime.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                {' • '}
                {currentTime.toLocaleTimeString('vi-VN')}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm nhanh..."
                  className="pl-12 pr-6 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80 bg-white/80 backdrop-blur"
                />
              </div>

              <button className="relative p-3 hover:bg-gray-100 rounded-xl transition-all hover:scale-110">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:scale-105 cursor-pointer group relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgLight} group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-7 h-7 ${stat.textColor}`} />
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                      <TrendingUp className="w-4 h-4" />
                      {stat.change}
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-2">{stat.title}</h3>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Chức năng chính</h2>
            <span className="text-sm text-gray-500">Nhấn vào để truy cập</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.id}
                  onClick={() => handleNavigate(action.path)}
                  className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${action.color} shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {action.count}
                      </span>
                      <span className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Xem ngay →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Hoạt động gần đây</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Xem tất cả
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <div className={`p-3 rounded-xl bg-gray-100 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">{activity.message}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Links Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer">
            <Star className="w-10 h-10 mb-4 opacity-80" />
            <h3 className="text-xl font-bold mb-2">Hiệu suất tốt</h3>
            <p className="text-blue-100 text-sm mb-4">Doanh thu tăng 15.3% so với tuần trước</p>
            <button className="text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Xem báo cáo <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer">
            <Gift className="w-10 h-10 mb-4 opacity-80" />
            <h3 className="text-xl font-bold mb-2">Khuyến mãi hot</h3>
            <p className="text-purple-100 text-sm mb-4">8 chương trình đang chạy, tạo ngay!</p>
            <button className="text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Quản lý KM <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer">
            <MessageSquare className="w-10 h-10 mb-4 opacity-80" />
            <h3 className="text-xl font-bold mb-2">Phản hồi mới</h3>
            <p className="text-green-100 text-sm mb-4">12 phản hồi chưa trả lời từ khách hàng</p>
            <button className="text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Trả lời ngay <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDM;