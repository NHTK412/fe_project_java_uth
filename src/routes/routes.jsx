import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import EvmLayout from "../layouts/EvmLayout";
import DealerLayout from "../layouts/DealerLayout";
import DealerManagerLayout from "../layouts/DealerManagerLayout";

// Import các pages admin
import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/UserManagement";
import Settings from "../pages/admin/Setting";
import VehicleManagement from "../pages/admin/VehicleManagement";
import VehicleTypePage from "../pages/admin/VehicleTypePage";
import VehicleDetailPage from "../pages/admin/VehicleDetailPage";
import VehicleTypeDetailPage from "../pages/admin/VehicleTypeDetailPage";

// Import các pages evm staff
import WarehouseReceiptManagement from "../pages/evm-staff/WarehouseReceiptManagement";
import WarehouseReceiptDetailPage from "../pages/evm-staff/WarehouseReceiptDetailPage";
import WarehouseReleaseManagement from "../pages/evm-staff/WarehouseReleaseManagement";
import WarehouseReleaseDetailPage from "../pages/evm-staff/WarehouseReleaseDetailPage";
import DashboardEVM from "../pages/evm-staff/DashboardEVM";
import Login from "../services/auth/Login";
const routes = [
  { path: "/login", element: <Login /> }, 
  {
    path: "/admin",
    element: (
      <ProtectedRoute element={<AdminLayout />} allowedUsers={["ROLE_ADMIN"]} />
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "users", element: <Users /> },
      { path: "vehicles", element: <VehicleManagement /> },

      // Vehicle detail 
      { path: "vehicle/:vehicleId", element: <VehicleDetailPage /> },

      // Vehicle Type detail 
      { path: "vehicle-type/:vehicleTypeId", element: <VehicleTypePage /> },
      // Vehicle Type Detail detail / edit
      {
        path: "vehicle/type/detail/:vehicleTypeDetailId",
        element: <VehicleTypeDetailPage />,
      },
      { path: "settings", element: <Settings /> },
    ],
  },
  {
    path: "/staff",
    element: (
      <ProtectedRoute
        element={<EvmLayout />}
        allowedUsers={["ROLE_EVM_STAFF"]}
      />
    ),
    children: [
      { index: true, element: <DashboardEVM /> },
      {path: "warehouse-receipts", element: <WarehouseReceiptManagement />},
      {path: "warehouse-receipt/:warehouseReceiptId", element: <WarehouseReceiptDetailPage />},
      {path: "warehouse-release-notes", element: <WarehouseReleaseManagement />},
      {path: "warehouse-release-notes/:warehouseReleaseNoteId", element: <WarehouseReleaseDetailPage />},
      {path: "settings", element: <Settings /> },
    ],
  },
  {
    path: "/dealer",
    element: (
      <ProtectedRoute
        element={<DealerLayout />}
        allowedUsers={["ROLE_DEALER_STAFF"]}
      />
    ),
  },
  {
    path: "/dealerManager",
    element: (
      <ProtectedRoute
        element={<DealerManagerLayout />}
        allowedUsers={["ROLE_DEALER_MANAGER"]}
      />
    ),
  },
  { path: "*", element: <Navigate to="/" replace /> },
];

export default routes;
