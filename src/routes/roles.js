// role.js

export const ROLES = {
  ADMIN: "admin",
  EVM: "evm",
  STAFF: "staff",
};

export const MENU_GROUPS = {
  ADMIN: [
    { label: "Dashboard", icon: "🏠", path: "/dashboard" },
    { label: "Quản lý người dùng", icon: "👥", path: "/users" },
    { label: "Thống kê", icon: "📊", path: "/statistics" },
    { label: "Báo cáo tồn kho", icon: "📋", path: "/reports" },
    { label: "Doanh thu", icon: "💰", path: "/revenue" },
  ],
  EVM_STAFF: [
    { label: "Dashboard", icon: "🏠", path: "/dashboard" },
    { label: "Quản lý phương tiện", icon: "🚓", path: "/vehicles" },
    { label: "Thông tin xe", icon: "🚗", path: "/vehicle-info" },
    { label: "Lịch làm việc", icon: "🗓️", path: "/schedule" },
  ],
};

// Hàm mapping role => nhóm menu
export const getRoleGroup = (role) => {
  if (role === ROLES.ADMIN) return "ADMIN";
  if (role === ROLES.EVM || role === ROLES.STAFF) return "EVM_STAFF";
  return null;
};
