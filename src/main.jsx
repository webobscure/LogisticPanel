import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router";
import AdminPage from "./pages/AdminPage/AdminPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route index element={<App />} />
      <Route path='admin' element={<AdminPage />}/>
    </Routes>
    </BrowserRouter>
  </StrictMode>
);
