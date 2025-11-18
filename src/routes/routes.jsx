
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import EvmLayout from "../layouts/EvmLayout";
import DealerLayout from "../layouts/DealerLayout";
import DealerManagerLayout from "../layouts/DealerManagerLayout";

const routes = [
  {
    path: "/admin",
    element: (
      <ProtectedRoute
        element={<AdminLayout />}
        allowedUsers={["ROLE_ADMIN"]}
      />
    ),
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
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

export default routes;
