import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Save the attempted URL they tried to visit for later redirect
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}
