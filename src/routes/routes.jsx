// src/routes/routes.jsx
import { Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import EvmLayout from "../layouts/EvmLayout";
import ProtectedRoute from "./ProtectedRoute";

const routes = [
  {
    path: "/admin",
    element: <ProtectedRoute element={<AdminLayout />} allowedUsers={["admin"]} />,
  },
  {
    path: "/staff",
    element: <ProtectedRoute element={<EvmLayout />} allowedUsers={["staff"]} />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

export default routes;
