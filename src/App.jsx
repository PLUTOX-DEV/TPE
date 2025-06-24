import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Spin from "./pages/Spin";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import Store from "./pages/Store";
import DailyReward from "./pages/DailyReward";

import BottomNav from "./components/BottomNav";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

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
        localStorage.setItem("telegramUser", JSON.stringify(userInfo));
        console.log("Telegram User:", userInfo);

        // ✅ Referral tracking + reward
        const startParam = tg.initDataUnsafe?.start_param;
        const hasVisited = localStorage.getItem("hasVisited");

        if (startParam && !hasVisited && startParam !== user.username) {
          localStorage.setItem("referrer", startParam);
          localStorage.setItem("hasVisited", "true");

          // Count referral
          const referrals = JSON.parse(localStorage.getItem("referrals") || "{}");
          referrals[startParam] = (referrals[startParam] || 0) + 1;
          localStorage.setItem("referrals", JSON.stringify(referrals));

          // Reward referrer (store under wallet_username)
          const walletKey = `wallet_${startParam}`;
          const currentReward = parseInt(localStorage.getItem(walletKey)) || 0;
          const newReward = currentReward + 20; // Reward amount
          localStorage.setItem(walletKey, newReward);

          console.log(`✅ ${startParam} referred a user and earned 20 coins.`);
        }
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
      </Routes>

      <Analytics />
      <SpeedInsights />
      <BottomNav />
    </div>
  );
}
