import React from "react";
import { useUser } from "../../UserContext";
import "./Header.css";

export const Header = ({ title = "Панель управления" }) => {
  const { user, loading } = useUser();

  return (
    <section className="header">
      <h1>{title}</h1>
      <span className="header_user-name">
        {loading ? "Загрузка..." : user?.fullName || "Гость"}
      </span>
    </section>
  );
};
