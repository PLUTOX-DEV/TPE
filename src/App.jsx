import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Spin from "./pages/Spin";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import Store from "./pages/Store";
import DailyReward from "./pages/DailyReward";
import Leaderboard from "./pages/Leaderboard";

import BottomNav from "./components/BottomNav";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { loginUser } from "./api/userApi";

export default function App() {
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      const user = tg.initDataUnsafe.user;

      if (user) {
        const userInfo = {
          id: user.id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          photo_url: user.photo_url,
        };

        // Save to localStorage
        localStorage.setItem("telegramUser", JSON.stringify(userInfo));
        localStorage.setItem("telegramId", user.id.toString());

        // Referral logic
        const startParam = tg.initDataUnsafe?.start_param;
        const hasVisited = localStorage.getItem("hasVisited");

        if (startParam && !hasVisited && startParam !== user.username) {
          localStorage.setItem("referrer", startParam);
          localStorage.setItem("hasVisited", "true");

          // Local referral count
          const referrals = JSON.parse(localStorage.getItem("referrals") || "{}");
          referrals[startParam] = (referrals[startParam] || 0) + 1;
          localStorage.setItem("referrals", JSON.stringify(referrals));

          // Optional: reward tracking
          const walletKey = `wallet_${startParam}`;
          const currentReward = parseInt(localStorage.getItem(walletKey)) || 0;
          const newReward = currentReward + 20;
          localStorage.setItem(walletKey, newReward);

          console.log(`✅ ${startParam} referred a user and earned 20 coins.`);
        }

        // Get referrer from localStorage
        const referrer = localStorage.getItem("referrer") || "";

        // Sync with backend
        loginUser({
          telegramId: user.id.toString(),
          username: user.username,
          fullName: `${user.first_name || ""} ${user.last_name || ""}`,
          referrer,
        })
          .then((data) => {
            console.log("✅ User synced with backend:", data);
            localStorage.setItem("tapCoins", data.balance || 0);

            if (data.isVIP) {
              localStorage.setItem("vipTime", data.vipExpiresAt);
            } else {
              localStorage.removeItem("vipTime");
            }
          })
          .catch((err) => {
            console.error("Backend login failed:", err);
          });
      }
    }
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/spin" element={<Spin />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/store" element={<Store />} />
        <Route path="/daily-reward" element={<DailyReward />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>

      <Analytics />
      <SpeedInsights />
      <BottomNav />
    </div>
  );
}
