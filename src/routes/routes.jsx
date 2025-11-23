import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import EvmLayout from "../layouts/EvmLayout";
import DealerLayout from "../layouts/DealerLayout";
import DealerManagerLayout from "../layouts/DealerManagerLayout";
import Dashboard from "../pages/admin/Dashboard";
import ImportRequestList from "../pages/admin/ImportRequestList";
import ImportRequestDetail from "../pages/admin/ImportRequestDetail";
import CreateImportRequest from "../pages/admin/CreateImportRequest";
import QuoteList from "../pages/admin/QuoteList";
import QuoteDetail from "../pages/admin/QuoteDetail";
import CreateQuote from "../pages/admin/CreateQuote";
import OrderList from "../pages/admin/OrderList";
import OrderDetail from "../pages/admin/OrderDetail";
import CreateOrderFromQuote from "../pages/admin/CreateOrderFromQuote";
import DealerManagerOrderList from "../pages/dealer-manager/DealerManagerOrderList";
import DealerStaffOrderList from "../pages/dealer-staff/DealerStaffOrderList";
import DealerOrderDetail from "../pages/shared/DealerOrderDetail";
import DealerCreateOrder from "../pages/shared/DealerCreateOrder";
import DealerDashboard from "../pages/dealer-staff/DealerDashboard";
import DealerManagerDashboard from "../pages/dealer-manager/DealerManagerDashboard";
import UserProfilePage from "../pages/user/UserProfilePage";
import Users from "../pages/admin/UserManagement";
import Inventory from "../pages/admin/InventoryReport";
import Revenue from "../pages/admin/RevenueReport";
import Settings from "../pages/admin/Setting";
import FeedbackManagement from "../pages/admin/FeedbackManagement";
import ProductManagement from "../pages/admin/ProductManagement";
import FeedbackManagementDealerManager from "../pages/dealer-manager/FeedbackManagement";
import Reports from "../pages/dealer-manager/Reports";
import PromotionsManager from "../pages/dealer-manager/PromotionsManager";
import ImportRequest from "../pages/dealer-manager/ImportRequest";
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

const routes = [
  // ========== ADMIN ROUTES ==========
  {
    path: "/admin",
    element: (
      <ProtectedRoute element={<AdminLayout />} allowedUsers={["ROLE_ADMIN"]} />
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <Users />,
      },
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
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  // NOTE: Import Request Routes - List
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

  // NOTE: Admin Product Management
  {
    path: "/admin/products",
    element: (
      <ProtectedRoute
        element={
          <AdminLayout>
            <ProductManagement />
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
  {
    path: "/dealerManager/import-request",
    element: (
      <ProtectedRoute
        element={
          <DealerManagerLayout>
            <ImportRequest />
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

  // ========== DEFAULT ROUTE ==========
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

export default routes;
