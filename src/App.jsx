import React, { useEffect, useState, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import BottomNav from "./components/BottomNav";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { loginUser } from "./api/userApi";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Spin = lazy(() => import("./pages/Spin"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Profile = lazy(() => import("./pages/Profile"));
const Store = lazy(() => import("./pages/Store"));
const DailyReward = lazy(() => import("./pages/DailyReward"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));

// Optional: a simple loading component
const Loading = () => (
  <div className="flex justify-center items-center h-screen bg-black text-white text-xl">
    <div className="animate-spin border-4 border-white border-t-transparent rounded-full w-12 h-12 mr-3"></div>
    Loading...
  </div>
);

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();

        const user = tg.initDataUnsafe.user;
        if (!user) return setLoading(false);

        const userInfo = {
          id: user.id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          photo_url: user.photo_url,
        };

        localStorage.setItem("telegramUser", JSON.stringify(userInfo));
        localStorage.setItem("telegramId", user.id.toString());

        const startParam = tg.initDataUnsafe?.start_param;
        const hasVisited = localStorage.getItem("hasVisited");
        const referrer = localStorage.getItem("referrer") || "";

        if (startParam && !hasVisited && startParam !== user.username) {
          localStorage.setItem("referrer", startParam);
          localStorage.setItem("hasVisited", "true");

          const referrals = JSON.parse(localStorage.getItem("referrals") || "{}");
          referrals[startParam] = (referrals[startParam] || 0) + 1;
          localStorage.setItem("referrals", JSON.stringify(referrals));

          const walletKey = `wallet_${startParam}`;
          const currentReward = parseInt(localStorage.getItem(walletKey)) || 0;
          localStorage.setItem(walletKey, currentReward + 20);

          console.log(`🎁 ${startParam} earned 20 coins for referring ${user.username}`);
        }

        try {
          const data = await loginUser({
            telegramId: user.id.toString(),
            username: user.username,
            fullName: `${user.first_name || ""} ${user.last_name || ""}`,
            referrer,
          });

          localStorage.setItem("tapCoins", data.balance || 0);
          if (data.isVIP) {
            localStorage.setItem("vipTime", data.vipExpiresAt);
          } else {
            localStorage.removeItem("vipTime");
          }
        } catch (err) {
          console.error("❌ Login failed:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="bg-black text-white min-h-screen">
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/spin" element={<Spin />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/store" element={<Store />} />
          <Route path="/daily-reward" element={<DailyReward />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </Suspense>

      <Analytics />
      <SpeedInsights />
      <BottomNav />
    </div>
  );
}
