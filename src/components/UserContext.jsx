import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchCurrentUser } from "./api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    setLoading(true);
    try {
      const data = await fetchCurrentUser();
      const fullName = `${data.name} ${data.surname}`;
      setUser({ fullName });
      localStorage.setItem("userName", fullName);
    } catch (err) {
      console.error(err);
      setUser(null);
      localStorage.removeItem("userName");
    } finally {
      setLoading(false);
    }
  };

  const setUserFromLogin = (fullName) => {
    setUser({ fullName });
    localStorage.setItem("userName", fullName);
  };

  useEffect(() => {
    const stored = localStorage.getItem("userName");
    if (stored) {
      setUser({ fullName: stored });
      setLoading(false);
    } else if (localStorage.getItem("accessToken")) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser, setUserFromLogin, loadUser }}>
      {children}
    </UserContext.Provider>
  );
};

// **Экспорт хука useUser**
export const useUser = () => useContext(UserContext);
