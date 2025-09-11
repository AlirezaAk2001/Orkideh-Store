import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // همون رو نگه دار
import { CircularProgress } from "@mui/material";

const adminEmails = ["alireza.akhoondi1@gmail.com"]; // ایمیل‌های ادمین

const ProtectedAdminRoute = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 md:p-8"
        dir="rtl"
      >
        <CircularProgress size={40} className="text-blue-600" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = adminEmails.some(
    (email) => email.toLowerCase() === currentUser.email.toLowerCase()
  );
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;