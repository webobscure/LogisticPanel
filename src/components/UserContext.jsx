import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchCurrentUser } from "./api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Сначала попробуем взять из localStorage
    const stored = localStorage.getItem("userName");
    return stored ? { fullName: stored } : null;
  });

  // Функция загрузки пользователя с сервера
  const loadUser = async () => {
    try {
      const data = await fetchCurrentUser();
      const fullName = `${data.name} ${data.surname}`;
      setUser({ fullName });
      localStorage.setItem("userName", fullName);
    } catch (err) {
      console.error(err);
      setUser(null);
      localStorage.removeItem("userName");
    }
  };

  useEffect(() => {
    loadUser();
  }, []); // при монтировании

  // Можно вызывать при логине/логауте, чтобы обновить user
  const refreshUser = () => loadUser();

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(UserContext);

