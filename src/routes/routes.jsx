import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
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
import WholesaleManagement from "../pages/admin/WholesaleManagement";
// Import các pages evm staff
import WarehouseReceiptManagement from "../pages/evm-staff/WarehouseReceiptManagement";
import WarehouseReceiptDetailPage from "../pages/evm-staff/WarehouseReceiptDetailPage";
import WarehouseReleaseManagement from "../pages/evm-staff/WarehouseReleaseManagement";
import WarehouseReleaseDetailPage from "../pages/evm-staff/WarehouseReleaseDetailPage";
import DashboardEVM from "../pages/evm-staff/DashboardEVM";
import Login from "../services/auth/Login";

// Import Agency page
import AgencyManagement from "../pages/AgencyManagement";

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
      { path: "vehicle/:vehicleId", element: <VehicleDetailPage /> },
      { path: "vehicle-type/:vehicleTypeId", element: <VehicleTypePage /> },
      { path: "vehicle/type/detail/:vehicleTypeDetailId", element: <VehicleTypeDetailPage /> },
      { path: "agencies", element: <AgencyManagement /> }, 
      { path: "wholesale",element: <WholesaleManagement/>, },
      { path: "settings", element: <Settings /> },
      {
        path: "inventory",
        element: <Inventory />,
      },
      {
        path: "revenue",
        element: <Revenue />,
      },
      {
        path: "feedback",
        element: <FeedbackManagement />,
      },
    ],
  },
  {
    path: "/admin/import-request",
    element: (
      <ProtectedRoute
        element={
          <AdminLayout>
            <ImportRequestList />
          </AdminLayout>
        }
        allowedUsers={["ROLE_ADMIN"]}
      />
    ),
  },
  // NOTE: Import Request Routes - Create (PHẢI ĐẶT TRƯỚC route /:id)
  {
    path: "/admin/import-request/create",
    element: (
      <ProtectedRoute
        element={
          <AdminLayout>
            <CreateImportRequest />
          </AdminLayout>
        }
        allowedUsers={["ROLE_ADMIN"]}
      />
    ),
  },
  // NOTE: Import Request Routes - Detail (route động với :id)
  {
    path: "/admin/import-request/:id",
    element: (
      <ProtectedRoute
        element={
          <AdminLayout>
            <ImportRequestDetail />
          </AdminLayout>
        }
        allowedUsers={["ROLE_ADMIN"]}
      />
    ),
  },
  // NOTE: Wildcard route cho admin subpaths (để sidebar/navigation hoạt động)
  {
    path: "/admin/*",
    element: (
      <ProtectedRoute
        element={<AdminLayout />}
        allowedUsers={["ROLE_ADMIN"]}
      />
    ),
  },

  // ========== QUOTE ROUTES ==========
  {
    path: "/admin/quote",
    element: (
      <ProtectedRoute
        element={
          <AdminLayout>
            <QuoteList />
          </AdminLayout>
        }
        allowedUsers={["ROLE_ADMIN"]}
      />
    ),
  },
  // NOTE: Quote Routes - Create (PHẢI ĐẶT TRƯỚC route /:id)
  {
    path: "/admin/quote/create",
    element: (
      <ProtectedRoute
        element={
          <AdminLayout>
            <CreateQuote />
          </AdminLayout>
        }
        allowedUsers={["ROLE_ADMIN"]}
      />
    ),
  },
  // NOTE: Quote Routes - Edit
  {
    path: "/admin/quote/:quoteId/edit",
    element: (
      <ProtectedRoute
        element={
          <AdminLayout>
            <CreateQuote />
          </AdminLayout>
        }
        allowedUsers={["ROLE_ADMIN"]}
      />
    ),
  },
  // NOTE: Quote Routes - Detail (route động với :quoteId)
  {
    path: "/admin/quote/:quoteId",
    element: (
      <ProtectedRoute
        element={
          <AdminLayout>
            <QuoteDetail />
          </AdminLayout>
        }
        allowedUsers={["ROLE_ADMIN"]}
      />
    ),
  },

  // ========== ORDER ROUTES ==========
  {
    path: "/admin/order",
    element: (
      <ProtectedRoute
        element={
          <AdminLayout>
            <OrderList />
          </AdminLayout>
        }
        allowedUsers={["ROLE_ADMIN"]}
      />
    ),
  },
  // NOTE: Order Routes - Create from Quote (PHẢI ĐẶT TRƯỚC route /:id)
  {
    path: "/admin/order/create",
    element: (
      <ProtectedRoute
        element={
          <AdminLayout>
            <CreateOrderFromQuote />
          </AdminLayout>
        }
        allowedUsers={["ROLE_ADMIN"]}
      />
    ),
  },
  // NOTE: Order Routes - Detail (route động với :orderId)
  {
    path: "/admin/order/:orderId",
    element: (
      <ProtectedRoute
        element={
          <AdminLayout>
            <OrderDetail />
          </AdminLayout>
        }
        allowedUsers={["ROLE_ADMIN"]}
      />
    ),
  },


  // ========== EVM STAFF ROUTES ==========
  {
    path: "/staff",
    element: (
      <ProtectedRoute
        element={<EvmLayout><Dashboard /></EvmLayout>}
        allowedUsers={["ROLE_EVM_STAFF"]}
      />
    ),
  },
  {
    path: "/staff/inventory",
    element: (
      <ProtectedRoute
        element={
          <EvmLayout>
            <EvmInventory />
          </EvmLayout>
        }
        allowedUsers={["ROLE_EVM_STAFF"]}
      />
    ),
  },
  {
    path: "/staff/dealers",
    element: (
      <ProtectedRoute
        element={
          <EvmLayout>
            <DealerManagement />
          </EvmLayout>
        }
        allowedUsers={["ROLE_EVM_STAFF"]}
      />
    ),
  },
  {
    path: "/staff/promotions",
    element: (
      <ProtectedRoute
        element={
          <EvmLayout>
            <EvmPromotions />
          </EvmLayout>
        }
        allowedUsers={["ROLE_EVM_STAFF"]}
      />
    ),
  },
  {
    path: "/staff/discounts",
    element: (
      <ProtectedRoute
        element={
          <EvmLayout>
            <DiscountManagement />
          </EvmLayout>
        }
        allowedUsers={["ROLE_EVM_STAFF"]}
      />
    ),
  },
  {
    path: "/staff/wholesale",
    element: (
      <ProtectedRoute
        element={
          <EvmLayout>
            <WholesalePriceManagement />
          </EvmLayout>
        }
        allowedUsers={["ROLE_EVM_STAFF"]}
      />
    ),
  },
  {
    path: "/staff/orders",
    element: (
      <ProtectedRoute
        element={
          <EvmLayout>
            <OrderManagement />
          </EvmLayout>
        }
        allowedUsers={["ROLE_EVM_STAFF"]}
      />
    ),
  },
  {
    path: "/staff/*",
    element: (
      <ProtectedRoute
        element={<EvmLayout />}
        allowedUsers={["ROLE_EVM_STAFF"]}
      />
    ),
    children: [
      { path: "warehouse-receipts", element: <WarehouseReceiptManagement /> },
      { path: "warehouse-receipt/:warehouseReceiptId", element: <WarehouseReceiptDetailPage /> },
      { path: "warehouse-release-notes", element: <WarehouseReleaseManagement /> },
      { path: "warehouse-release-notes/:warehouseReleaseNoteId", element: <WarehouseReleaseDetailPage /> },
      { path: "agencies", element: <AgencyManagement /> },
      { path: "settings", element: <Settings /> },
    ],
  },

  // ========== DEALER STAFF ROUTES ==========
  {
    path: "/dealer",
    element: (
      <ProtectedRoute
        element={<DealerLayout><DealerDashboard /></DealerLayout>}
        allowedUsers={["ROLE_DEALER_STAFF"]}
      />
    ),
  },
  {
    path: "/dealer/test-drive",
    element: (
      <ProtectedRoute
        element={
          <DealerLayout>
            <TestDriveSchedule />
          </DealerLayout>
        }
        allowedUsers={["ROLE_DEALER_STAFF"]}
      />
    ),
  },
  {
    path: "/dealer/order",
    element: (
      <ProtectedRoute
        element={
          <DealerLayout>
            <DealerStaffOrderList />
          </DealerLayout>
        }
        allowedUsers={["ROLE_DEALER_STAFF"]}
      />
    ),
  },
  {
    path: "/dealer/employee-order",
    element: (
      <ProtectedRoute
        element={
          <DealerLayout>
            <DealerStaffEmployeeOrderList />
          </DealerLayout>
        }
        allowedUsers={["ROLE_DEALER_STAFF"]}
      />
    ),
  },
  {
    path: "/dealer/order/create",
    element: (
      <ProtectedRoute
        element={
          <DealerLayout>
            <DealerCreateOrder isDealerManager={false} />
          </DealerLayout>
        }
        allowedUsers={["ROLE_DEALER_STAFF"]}
      />
    ),
  },
  {
    path: "/dealer/order/:orderId",
    element: (
      <ProtectedRoute
        element={
          <DealerLayout>
            <DealerOrderDetail isDealerManager={false} />
          </DealerLayout>
        }
        allowedUsers={["ROLE_DEALER_STAFF"]}
      />
    ),
  },
  {
    path: "/dealer/quotes",
    element: (
      <ProtectedRoute
        element={
          <DealerLayout>
            <QuoteManagement />
          </DealerLayout>
        }
        allowedUsers={["ROLE_DEALER_STAFF"]}
      />
    ),
  },
  {
    path: "/dealer/vehicles",
    element: (
      <ProtectedRoute
        element={
          <DealerLayout>
            <VehicleInfo />
          </DealerLayout>
        }
        allowedUsers={["ROLE_DEALER_STAFF"]}
      />
    ),
  },
  {
    path: "/dealer/inventory",
    element: (
      <ProtectedRoute
        element={
          <DealerLayout>
            <InventoryManagement />
          </DealerLayout>
        }
        allowedUsers={["ROLE_DEALER_STAFF"]}
      />
    ),
  },
  {
    path: "/dealer/*",
    element: (
      <ProtectedRoute
        element={<DealerLayout />}
        allowedUsers={["ROLE_DEALER_STAFF"]}
      />
    ),
  },

  // ========== DEALER MANAGER ROUTES ==========
  {
    path: "/dealerManager",
    element: (
      <ProtectedRoute
        element={<DealerManagerLayout><DealerManagerDashboard /></DealerManagerLayout>}
        allowedUsers={["ROLE_DEALER_MANAGER"]}
      />
    ),
  },
  {
    path: "/dealerManager/feedback",
    element: (
      <ProtectedRoute
        element={
          <DealerManagerLayout>
            <FeedbackManagementDealerManager />
          </DealerManagerLayout>
        }
        allowedUsers={["ROLE_DEALER_MANAGER"]}
      />
    ),
  },
  {
    path: "/dealerManager/reports",
    element: (
      <ProtectedRoute
        element={
          <DealerManagerLayout>
            <Reports />
          </DealerManagerLayout>
        }
        allowedUsers={["ROLE_DEALER_MANAGER"]}
      />
    ),
  },
  // NOTE: Import Request Routes - Create (PHẢI ĐẶT TRƯỚC route /:id)
  {
    path: "/dealerManager/import-request/create",
    element: (
      <ProtectedRoute
        element={
          <DealerManagerLayout>
            <CreateImportRequest />
          </DealerManagerLayout>
        }
        allowedUsers={["ROLE_DEALER_MANAGER"]}
      />
    ),
  },
  {
    path: "/dealerManager/import-request",
    element: (
      <ProtectedRoute
        element={
          <DealerManagerLayout>
            <ImportRequestList />
          </DealerManagerLayout>
        }
        allowedUsers={["ROLE_DEALER_MANAGER"]}
      />
    ),
  },
  // NOTE: Import Request Routes - Detail (route động với :id)
  {
    path: "/dealerManager/import-request/:id",
    element: (
      <ProtectedRoute
        element={
          <DealerManagerLayout>
            <ImportRequestDetail />
          </DealerManagerLayout>
        }
        allowedUsers={["ROLE_DEALER_MANAGER"]}
      />
    ),
  },
  {
    path: "/dealerManager/promotions",
    element: (
      <ProtectedRoute
        element={
          <DealerManagerLayout>
            <PromotionsManager />
          </DealerManagerLayout>
        }
        allowedUsers={["ROLE_DEALER_MANAGER"]}
      />
    ),
  },
  {
    path: "/dealerManager/order",
    element: (
      <ProtectedRoute
        element={
          <DealerManagerLayout>
            <DealerManagerOrderList />
          </DealerManagerLayout>
        }
        allowedUsers={["ROLE_DEALER_MANAGER"]}
      />
    ),
  },
  {
    path: "/dealerManager/order/create",
    element: (
      <ProtectedRoute
        element={
          <DealerManagerLayout>
            <DealerCreateOrder isDealerManager={true} />
          </DealerManagerLayout>
        }
        allowedUsers={["ROLE_DEALER_MANAGER"]}
      />
    ),
  },
  {
    path: "/dealerManager/order/:orderId",
    element: (
      <ProtectedRoute
        element={
          <DealerManagerLayout>
            <DealerOrderDetail isDealerManager={true} />
          </DealerManagerLayout>
        }
        allowedUsers={["ROLE_DEALER_MANAGER"]}
      />
    ),
  },
  // NOTE: Agency Order Routes (đơn hàng của đại lý)
  {
    path: "/dealerManager/agency-order",
    element: (
      <ProtectedRoute
        element={
          <DealerManagerLayout>
            <DealerAgencyOrderList />
          </DealerManagerLayout>
        }
        allowedUsers={["ROLE_DEALER_MANAGER"]}
      />
    ),
  },
  // NOTE: Vehicle Order Routes - Create (PHẢI ĐẶT TRƯỚC route /:id)
  {
    path: "/dealerManager/vehicle-order/create",
    element: (
      <ProtectedRoute
        element={
          <DealerManagerLayout>
            <CreateVehicleOrder />
          </DealerManagerLayout>
        }
        allowedUsers={["ROLE_DEALER_MANAGER"]}
      />
    ),
  },
  {
    path: "/dealerManager/vehicle-order",
    element: (
      <ProtectedRoute
        element={
          <DealerManagerLayout>
            <VehicleOrderList />
          </DealerManagerLayout>
        }
        allowedUsers={["ROLE_DEALER_MANAGER"]}
      />
    ),
  },
  {
    path: "/dealerManager/vehicle-order/:id",
    element: (
      <ProtectedRoute
        element={
          <DealerManagerLayout>
            <VehicleOrderDetail />
          </DealerManagerLayout>
        }
        allowedUsers={["ROLE_DEALER_MANAGER"]}
      />
    ),
  },
  {
    path: "/dealerManager/*",
    element: (
      <ProtectedRoute
        element={<DealerManagerLayout />}
        allowedUsers={["ROLE_DEALER_MANAGER"]}
      />
    ),
  },

  // ========== USER PROFILE ROUTE ==========
  {
    path: "/user-profile",
    element: (
      <ProtectedRoute
        element={
          <AdminLayout>
            <UserProfilePage />
          </AdminLayout>
        }
        allowedUsers={["ROLE_ADMIN", "ROLE_EVM_STAFF", "ROLE_DEALER_STAFF", "ROLE_DEALER_MANAGER"]}
      />
    ),
  },

  // ========== USER PROFILE ROUTE ==========
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
