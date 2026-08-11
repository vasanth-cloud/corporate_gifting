import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const token = localStorage.getItem("token");
  const { user, isLoading } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return null;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    // Role-based auto redirect to default dashboard
    switch (user.role) {
      case "SUPER_ADMIN":
        return <Navigate to="/super-admin/dashboard" replace />;
      case "COMPANY_ADMIN":
        return <Navigate to="/company/dashboard" replace />;
      case "HR_MANAGER":
        return <Navigate to="/hr/dashboard" replace />;
      case "EMPLOYEE":
        return <Navigate to="/employee/dashboard" replace />;
      case "VENDOR":
        return <Navigate to="/vendor/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}