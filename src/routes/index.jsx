import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/UserManagement";
import Inventory from "../pages/admin/InventoryReport";
import Revenue from "../pages/admin/RevenueReport";
import Settings from "../pages/admin/Setting";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/admin" replace />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
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
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);

export default router;
