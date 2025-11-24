import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../services/auth/Login";
import AdminLayout from "../layouts/AdminLayout";
import EvmLayout from "../layouts/EvmLayout";
import DealerLayout from "../layouts/DealerLayout";
import DealerManagerLayout from "../layouts/DealerManagerLayout";
import Dashboard from "../pages/admin/Dashboard";
import ImportRequestList from "../pages/dealer-manager/ImportRequestList";
import ImportRequestDetail from "../pages/dealer-manager/ImportRequestDetail";
import CreateImportRequest from "../pages/dealer-manager/CreateImportRequest";
import QuoteList from "../pages/dealer-staff/QuoteList";
import QuoteDetail from "../pages/dealer-staff/QuoteDetail";
import CreateQuote from "../pages/dealer-staff/CreateQuote";
import OrderList from "../pages/dealer-staff/OrderList";
import OrderDetail from "../pages/dealer-staff/OrderDetail";
import CreateOrderFromQuote from "../pages/dealer-staff/CreateOrderFromQuote";
import DealerManagerOrderList from "../pages/dealer-manager/DealerManagerOrderList";
import DealerStaffOrderList from "../pages/dealer-staff/DealerStaffOrderList";
import DealerStaffEmployeeOrderList from "../pages/dealer-staff/DealerStaffEmployeeOrderList";
import DealerOrderDetail from "../pages/shared/DealerOrderDetail";
import DealerCreateOrder from "../pages/shared/DealerCreateOrder";
import DealerDashboard from "../pages/dealer-staff/DealerDashboard";
import DealerManagerDashboard from "../pages/dealer-manager/DealerManagerDashboard";
import UserProfilePage from "../pages/user/UserProfilePage";
import ProfileWrapper from "../pages/user/ProfileWrapper";
import Users from "../pages/admin/UserManagement";
import Inventory from "../pages/admin/InventoryReport";
import Revenue from "../pages/admin/RevenueReport";
import Settings from "../pages/admin/Setting";
import FeedbackManagement from "../pages/admin/FeedbackManagement";
import ProductManagement from "../pages/admin/ProductManagement";
import FeedbackManagementDealerManager from "../pages/dealer-manager/FeedbackManagement";
import Reports from "../pages/dealer-manager/Reports";
import PromotionsManager from "../pages/dealer-manager/PromotionsManager";
import TestDriveSchedule from "../pages/dealer-staff/TestDriveSchedule";
import QuoteManagement from "../pages/dealer-staff/QuoteManagement";
import VehicleInfo from "../pages/dealer-staff/VehicleInfo";
import InventoryManagement from "../pages/dealer-staff/InventoryManagement";
import EvmInventory from "../pages/evm-staff/EvmInventory";
import DealerManagement from "../pages/evm-staff/DealerManagement";
import EvmPromotions from "../pages/evm-staff/EvmPromotions";
import DiscountManagement from "../pages/evm-staff/DiscountManagement";
import WholesalePriceManagement from "../pages/evm-staff/WholesalePriceManagement";
import OrderManagement from "../pages/evm-staff/OrderManagement";
import VehicleOrderList from "../pages/dealer-manager/VehicleOrderList";
import VehicleOrderDetail from "../pages/dealer-manager/VehicleOrderDetail";
import CreateVehicleOrder from "../pages/dealer-manager/CreateVehicleOrder";
import DealerAgencyOrderList from "../pages/dealer-manager/DealerAgencyOrderList";
import VehicleManagement from "../pages/admin/VehicleManagement";
import VehicleDetailPage from "../pages/admin/VehicleDetailPage";
import VehicleTypePage from "../pages/admin/VehicleTypePage";
import VehicleTypeDetailPage from "../pages/admin/VehicleTypeDetailPage";
import OrderOfAgency from "../pages/evm-staff/OrderOfAgency";
import Policy from "../pages/evm-staff/Policy"
// Import các pages evm staff
import WarehouseReceiptManagement from "../pages/evm-staff/WarehouseReceiptManagement";
import WarehouseReceiptDetailPage from "../pages/evm-staff/WarehouseReceiptDetailPage";
import WarehouseReleaseManagement from "../pages/evm-staff/WarehouseReleaseManagement";
import WarehouseReleaseDetailPage from "../pages/evm-staff/WarehouseReleaseDetailPage";
import DashboardEVM from "../pages/evm-staff/DashboardEVM";
import DashboardDM from "../pages/dealer-manager/DashboardDM";
import AgencyOrderManagement from "../pages/dealer-manager/AgencyOrderManagement";
import EmployeeOrderManagement from "../pages/dealer-manager/EmployeeOrderManagement";

// Import Agency page
import AgencyManagement from "../pages/AgencyManagement";
import { Import } from "lucide-react";

const routes = [
  { path: "/login", element: <Login /> }, 
  {
    path: "/Evm-Staff",
    element: (
      <ProtectedRoute element={<EvmLayout />} allowedUsers={["ROLE_EVM_STAFF"]} />
    ),
    children: [
      { index: true, element:<DashboardEVM />},
      { path: "order-of-agency", element: <OrderOfAgency />},
      { path: "management-inventory", element:<InventoryManagement />},
      { path: "agencies", element: <AgencyManagement /> }, 
      { path: "promotion", element:<PromotionsManager />},
      { path: "policy", element:<Policy />},
      { path: "wholesale", element:<WholesalePriceManagement />},
      { path: "settings", element: <Settings /> },
      { path: "*", element: <EvmLayout />},
    ],
  },
  {path: "/admin",
    element: (
      <ProtectedRoute element={<AdminLayout />} allowedUsers={["ROLE_ADMIN"]} />
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "inventory", element: <Inventory />,},
      { path: "revenue", element: <Revenue />,},
      { path: "users", element: <Users /> },
      { path: "vehicles", element: <VehicleManagement /> },
      { path: "vehicle/:vehicleId", element: <VehicleDetailPage /> },
      { path: "vehicle-type/:vehicleTypeId", element: <VehicleTypePage /> },
      { path: "vehicle/type/detail/:vehicleTypeDetailId", element: <VehicleTypeDetailPage /> },
      { path: "order-of-agency", element: <OrderOfAgency />},
      { path: "management-inventory", element:<InventoryManagement />},
      { path: "agencies", element: <AgencyManagement /> }, 
      { path: "promotion", element:<PromotionsManager />},
      { path: "policy", element:<Policy />},
      { path: "wholesale", element:<WholesalePriceManagement />},
      { path: "settings", element: <Settings /> },
      {path: "*", element: <AdminLayout />},
    ],
  },
   {
  path: "/Dealer-Manager",
  element: <ProtectedRoute element={<DealerManagerLayout />} allowedUsers={["ROLE_DEALER_MANAGER"]} />,
  children:[
    { index: true, element: <DealerManagerLayout /> }, 
    { path: "feedback", element: <FeedbackManagement />},
    { path: "inventory", element: <Inventory />,},
    { path: "revenue", element: <Revenue />,},
    { path: "import-request", element: <ImportRequestList />}, 
    { path: "import-request/importRequestId", element:<ImportRequestDetail /> },
    { path: "promotion", element:<PromotionsManager />},
    { path: "users", element: <Users /> },
    { path: "order", element:<OrderList />},
    { path: "vehicles", element: <VehicleManagement /> },
    { path: "vehicle/:vehicleId", element: <VehicleDetailPage /> },
    { path: "vehicle-type/:vehicleTypeId", element: <VehicleTypePage /> },
    { path: "vehicle/type/detail/:vehicleTypeDetailId", element: <VehicleTypeDetailPage /> },
    { path: "test-drive", element: <TestDriveSchedule /> },
    { path: "inventory-management", element: <InventoryManagement />},
    { path: "agency-oder-management", element: <AgencyOrderManagement />},
    { path: "employee-oder-management", element: <EmployeeOrderManagement />},
    { path: "*", element: <DealerManagerLayout />},
  ]

  },
  
    {
  path: "/Dealer-Staff",
  element: <ProtectedRoute element={<DealerLayout />} allowedUsers={["ROLE_DEALER_STAFF"]} />,
  children:[
    { index: true, element: <DealerDashboard /> },
    { path: "order", element:<OrderList />},
    { path: "vehicles", element: <VehicleManagement /> },
    { path: "vehicle/:vehicleId", element: <VehicleDetailPage /> },
    { path: "vehicle-type/:vehicleTypeId", element: <VehicleTypePage /> },
    { path: "vehicle/type/detail/:vehicleTypeDetailId", element: <VehicleTypeDetailPage /> },
    { path: "test-drive", element: <TestDriveSchedule /> },
    { path: "inventory-management", element: <InventoryManagement />},
    { path: "agency-oder-management", element: <AgencyOrderManagement />},
    { path: "employee-oder-management", element: <EmployeeOrderManagement />},
    { path: "*", element: <DealerLayout />},
  ]
  },

  
  {
    path: "/profile",
    element: (
      <ProtectedRoute
        element={<ProfileWrapper />}
        allowedUsers={["ROLE_ADMIN", "ROLE_EVM_STAFF", "ROLE_DEALER_STAFF", "ROLE_DEALER_MANAGER"]}
      />
    ),
  },

  // ========== DEFAULT ROUTE ==========
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

export default routes;
