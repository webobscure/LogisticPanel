import React from "react";
import { useUser } from "../../UserContext";
import "./Header.css";

export const Header = ({ title = "Панель управления" }) => {
  const { user } = useUser();

  return (
    <section className="header">
      <h1>{title}</h1>
      <span className="header_user-name">
        {user?.fullName || "Загружается..."}
      </span>
    </section>
  );
};
