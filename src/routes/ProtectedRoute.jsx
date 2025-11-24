import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, allowedUsers = [] }) => {

  const role = localStorage.getItem("role") || null;
  const token = localStorage.getItem("token") || null;


  if (!role || !token) {
    console.warn("Missing role or token - redirecting to login", { role, token });
    return <Navigate to="/" replace />;
  }


  if (allowedUsers.length && !allowedUsers.includes(role)) {
    console.warn(" User role not allowed", { role, allowedUsers });
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;
