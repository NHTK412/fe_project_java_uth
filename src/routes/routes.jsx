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

const routes = [
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
