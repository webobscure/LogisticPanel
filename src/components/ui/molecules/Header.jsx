import React, { useEffect, useState } from "react";
import { fetchCurrentUser } from "../../api";
import "./Header.css";

export const Header = ({ title = "Панель управления" }) => {
  const [userName, setUserName] = useState("Загружается...");

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await fetchCurrentUser();
        setUserName(`${user.name} ${user.surname}`);
      } catch (err) {
        console.error(err);
      }
    };
    getUser();
  }, []);

  return (
    <section className="header">
      <h1>{title}</h1>
      <span className="header_user-name">{userName}</span>
    </section>
  );
};
