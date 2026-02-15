import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // console.log("ProtectedRoute Debug:", {
  //   user,
  //   role: user?.role,
  //   allowedRoles,
  //   hasAccess: allowedRoles ? allowedRoles.includes(user?.role) : "No roles restricted",
  // });

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
