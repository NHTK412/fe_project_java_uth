import { Navigate } from "react-router-dom";

const getRole = () => sessionStorage.getItem("username") || null;

const ProtectedRoute = ({ element, allowedUsers }) => {
  const role = getRole();

  if (!role) return <Navigate to="/" replace />;
  if (allowedUsers && !allowedUsers.includes(role)) return <Navigate to="/" replace />;

  return element;
};

export default ProtectedRoute;
