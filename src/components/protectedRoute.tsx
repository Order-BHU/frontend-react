import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "@/stores/useAuthStore"; // Adjust the path

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[]; // List of roles allowed to access the route
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isLoggedIn, role } = useAuthStore(); // Get `isLoggedIn` and `role`

  // Redirect if the user is not logged in or doesn't have the correct role
  if (!isLoggedIn || !allowedRoles.includes(role!)) {
    return <Navigate to="/login" replace />;
  }

  // If the user is authorized, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
