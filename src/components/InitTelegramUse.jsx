import React, { useEffect, useState } from "react";
import { loginUser } from "./api/userApi";  // adjust the import path if needed
import toast from "react-hot-toast";

function InitTelegramUser() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tg = window?.Telegram?.WebApp;
    if (!tg) {
      console.warn("❌ Telegram WebApp not found.");
      setLoading(false);
      toast.error("Telegram WebApp not found.");
      return;
    }

    const tgUser = tg.initDataUnsafe?.user;
    const startParam = tg.initDataUnsafe?.start_param || null;

    if (!tgUser || !tgUser.id) {
      console.warn("❌ Telegram user info missing.");
      setLoading(false);
      toast.error("Telegram user info missing.");
      return;
    }

    const telegramId = tgUser.id.toString();
    const username = tgUser.username || "no_username";
    const fullName = `${tgUser.first_name || ""} ${tgUser.last_name || ""}`.trim();

    localStorage.setItem("telegramId", telegramId);
    localStorage.setItem("username", username);
    localStorage.setItem("fullName", fullName);

    loginUser({
      telegramId,
      username,
      fullName,
      referrer: startParam,
    })
      .then((user) => {
        toast.success(`Welcome, ${user.fullName || user.username || "User"}!`);
      })
      .catch((err) => {
        console.error("❌ Failed to login or create user:", err);
        toast.error("Login failed. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white text-xl">
        Logging in...
      </div>
    );
  }

  return null;
}

export default InitTelegramUser;
