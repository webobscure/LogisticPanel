// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    // Если токена нет — перенаправляем на страницу логина
    return <Navigate to="/" replace />;
  }

  return children;
}
