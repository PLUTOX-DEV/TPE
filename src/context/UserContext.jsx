import React, { createContext, useEffect, useState } from "react";
import { getUser } from "../api/userApi";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const id = localStorage.getItem("telegramId");
      if (!id) return;

      try {
        const fetched = await getUser(id);
        setUser(fetched);
      } catch (err) {
        console.error("Failed to load user:", err);
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
}
