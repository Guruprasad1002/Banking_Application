import { Navigate } from "react-router-dom";
import { useAuth } from "../authContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return allowedRoles.includes(user.role) ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
