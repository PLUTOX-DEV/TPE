import React, { createContext, useEffect, useState } from "react";
import { getUser, loginUser } from "../api/userApi";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const telegramId = localStorage.getItem("telegramId");
  const username = localStorage.getItem("telegramUsername") || ""; // you might want to store this on login
  const fullName = localStorage.getItem("telegramFullName") || ""; // same here
  const referrer = localStorage.getItem("referrer") || ""; // if you track referrals

  const fetchOrCreateUser = async () => {
    if (!telegramId) {
      setLoadingUser(false);
      return;
    }

    setLoadingUser(true);
    try {
      const fetchedUser = await getUser(telegramId);
      setUser(fetchedUser);
    } catch (error) {
      // If user not found, register via loginUser
      if (error.message.includes("Failed to get user")) {
        try {
          const newUser = await loginUser({ telegramId, username, fullName, referrer });
          setUser(newUser);
        } catch (loginErr) {
          console.error("Failed to register new user:", loginErr);
        }
      } else {
        console.error("Failed to fetch user:", error);
      }
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchOrCreateUser();
  }, [telegramId]);

  const refreshUser = async () => {
    if (!telegramId) return;
    setLoadingUser(true);
    try {
      const freshUser = await getUser(telegramId);
      setUser(freshUser);
    } catch (err) {
      console.error("Failed to refresh user:", err);
    } finally {
      setLoadingUser(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, loadingUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}
