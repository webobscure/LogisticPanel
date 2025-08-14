import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchCurrentUser } from "./api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userName");
    if (storedUser) {
      setUser({ fullName: storedUser });
      return;
    }

    const loadUser = async () => {
      try {
        const data = await fetchCurrentUser();
        const fullName = `${data.name} ${data.surname}`;
        setUser({ fullName });
        localStorage.setItem("userName", fullName);
      } catch (err) {
        console.error(err);
      }
    };

    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
