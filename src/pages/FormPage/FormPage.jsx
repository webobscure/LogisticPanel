import React, { useState } from "react";
import "./FormPage.css";
import { useNavigate } from "react-router";
import { useUser } from "../../components/UserContext";
import { fetchCurrentUser } from "../../components/api";

export default function AuthPage() {
  const navigate = useNavigate();
  const { setUserFromLogin } = useUser(); // берём метод из контекста
  const [tab, setTab] = useState("login");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    surname: "",
    phone: "",
    password: "",
  });

  const client_id = "YOUR_CLIENT_ID";
  const client_secret = "YOUR_CLIENT_SECRET";
  const scope = "YOUR_SCOPE";

  const handleChange = (setState) => (e) =>
    setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ----------------- LOGIN -----------------
  const handleLogin = async (username, password) => {
  const body = new URLSearchParams();
  body.append("username", username);
  body.append("password", password);
  body.append("grant_type", "password");
  body.append("scope", scope);
  body.append("client_id", client_id);
  body.append("client_secret", client_secret);

  const res = await fetch("https://dlm-agent.ru/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Ошибка входа");

  localStorage.setItem("accessToken", data.access_token);
  localStorage.setItem("refreshToken", data.refresh_token);
  if (data.expires_in) {
    localStorage.setItem("tokenExpires", Date.now() + data.expires_in * 1000);
  }

  // --------------------------
  // После логина запрашиваем полные данные пользователя
  const userData = await fetchCurrentUser(); // вернёт { name, surname, ... }
  const fullName = `${userData.name} ${userData.surname}`;
  setUserFromLogin(fullName); // обновляем контекст
  // --------------------------

  navigate("/admin");
};


  // ----------------- REGISTER -----------------
  const handleRegister = async (e) => {
    e.preventDefault();

    const params = new URLSearchParams({
      name: registerData.name,
      surname: registerData.surname,
      phone: registerData.phone,
      password: registerData.password,
    });

    const res = await fetch(
      ` https://dlm-agent.ru/api/v1/auth/register?${params.toString()}`,
      {
        method: "POST",
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Ошибка регистрации");

    // Авто-логин после успешной регистрации
    await handleLogin(registerData.phone, registerData.password);
  };

  return (
    <div className="auth-container">
      <div className="tabs">
        <button
          className={tab === "login" ? "active" : ""}
          onClick={() => setTab("login")}
        >
          Вход
        </button>
        <button
          className={tab === "register" ? "active" : ""}
          onClick={() => setTab("register")}
        >
          Регистрация
        </button>
      </div>

      {tab === "login" ? (
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin(loginData.username, loginData.password);
          }}
        >
          <h2>Авторизация</h2>
          <input
            type="text"
            name="username"
            placeholder="Имя пользователя"
            value={loginData.username}
            onChange={handleChange(setLoginData)}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={loginData.password}
            onChange={handleChange(setLoginData)}
            required
          />
          <button type="submit">Войти</button>
        </form>
      ) : (
        <form className="form" onSubmit={handleRegister}>
          <h2>Регистрация</h2>
          <input
            type="text"
            name="name"
            placeholder="Имя"
            value={registerData.name}
            onChange={handleChange(setRegisterData)}
            required
          />
          <input
            type="text"
            name="surname"
            placeholder="Фамилия"
            value={registerData.surname}
            onChange={handleChange(setRegisterData)}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Телефон"
            value={registerData.phone}
            onChange={handleChange(setRegisterData)}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={registerData.password}
            onChange={handleChange(setRegisterData)}
            required
          />
          <button type="submit">Зарегистрироваться</button>
        </form>
      )}
    </div>
  );
}
