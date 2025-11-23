import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, allowedUsers = [] }) => {

  const role = localStorage.getItem("role") || null;
  console.log("role:", role, "allowedUsers:", allowedUsers);

  if (!role) return <Navigate to="/" replace />;

  if (allowedUsers.length && !allowedUsers.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;
