// src/components/InitTelegramUser.jsx
import { useEffect } from "react";
import { loginUser } from "../api/userApi";

export default function InitTelegramUser() {
  useEffect(() => {
    const tgUser = window?.Telegram?.WebApp?.initDataUnsafe?.user;

    if (!tgUser) {
      console.warn("❌ Telegram WebApp user not found.");
      return;
    }

    const telegramId = tgUser.id.toString();
    const username = tgUser.username || "no_username";
    const fullName = `${tgUser.first_name} ${tgUser.last_name || ""}`.trim();

    // Save to localStorage
    localStorage.setItem("telegramId", telegramId);
    localStorage.setItem("username", username);
    localStorage.setItem("fullName", fullName);

    // Auto-login or register user
    loginUser({ telegramId, username, fullName }).catch((err) =>
      console.error("❌ Failed to login/create user:", err)
    );
  }, []);

  return null;
}
