import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { loginUser } from "./api/userApi";
import toast from "react-hot-toast";

// Admin - eagerly loaded
import AdminUsers from "./pages/AdminUsers";

// Lazy-loaded user-facing pages
const Home = lazy(() => import("./pages/Home"));
const Spin = lazy(() => import("./pages/Spin"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Profile = lazy(() => import("./pages/Profile"));
const Store = lazy(() => import("./pages/Store"));
const DailyReward = lazy(() => import("./pages/DailyReward"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));

const Loading = () => (
  <div className="flex justify-center items-center h-screen bg-black text-white text-xl">
    <div className="animate-spin border-4 border-yellow-400 border-t-transparent rounded-full w-12 h-12 mr-3"></div>
    Loading...
  </div>
);

const NotFound = () => (
  <div className="flex flex-col justify-center items-center h-screen text-center text-white">
    <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
    <p className="text-lg text-gray-400">The page you are looking for does not exist.</p>
  </div>
);

// InitTelegramUser Component
function InitTelegramUser() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tg = window?.Telegram?.WebApp;
    if (!tg) {
      console.warn("❌ Telegram WebApp not found.");
      toast.error("Telegram WebApp not found.");
      setLoading(false);
      return;
    }

    const tgUser = tg.initDataUnsafe?.user;
    const startParam = tg.initDataUnsafe?.start_param || null; // referral code

    if (!tgUser || !tgUser.id) {
      console.warn("❌ Telegram user info missing.");
      toast.error("Telegram user info missing.");
      setLoading(false);
      return;
    }

    const telegramId = tgUser.id.toString();
    const username = tgUser.username || "no_username";
    const fullName = `${tgUser.first_name || ""} ${tgUser.last_name || ""}`.trim();

    // Save user info locally
    localStorage.setItem("telegramId", telegramId);
    localStorage.setItem("username", username);
    localStorage.setItem("fullName", fullName);

    // Call backend login or registration with referral
    loginUser({
      telegramId,
      username,
      fullName,
      referrer: startParam, // pass referral code here
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

export default function App() {
  const location = useLocation();
  const hideBottomNav = location.pathname.startsWith("/admin");

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Initialize Telegram user and process referral */}
      <InitTelegramUser />

      <Suspense fallback={<Loading />}>
        <Routes>
          {/* User Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/spin" element={<Spin />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/store" element={<Store />} />
          <Route path="/daily-reward" element={<DailyReward />} />
          <Route path="/leaderboard" element={<Leaderboard />} />

          {/* Admin Page */}
          <Route path="/admin" element={<AdminUsers />} />

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {/* Analytics */}
      <Analytics />
      <SpeedInsights />

      {/* Bottom nav only for user pages */}
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}
