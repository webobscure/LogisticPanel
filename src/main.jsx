import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminPage from "./pages/AdminPage/AdminPage.jsx";
import UserPage from "./pages/UserPage/UserPage.jsx";
import MechanicPage from "./pages/MechanicPage/MechanicPage.jsx";
import LogistPage from "./pages/LogistPage/LogistPage.jsx";
import AuthPage from "./pages/FormPage/FormPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<AuthPage />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="logist"
          element={
            <ProtectedRoute>
              <LogistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="mechanic"
          element={
            <ProtectedRoute>
              <MechanicPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="user"
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
