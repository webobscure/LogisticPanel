import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminPage from "./pages/AdminPage/AdminPage.jsx";
import UserPage from "./pages/UserPage/UserPage.jsx";
import MechanicPage from "./pages/MechanicPage/MechanicPage.jsx";
import LogistPage from "./pages/LogistPage/LogistPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route index element={<App />} />
      <Route path='admin' element={<AdminPage />}/>
      <Route path='logist' element={<LogistPage />}/>
      <Route path='mechanic' element={<MechanicPage />}/>
      <Route path='user' element={<UserPage />}/>

    </Routes>
    </BrowserRouter>
  </StrictMode>
);
