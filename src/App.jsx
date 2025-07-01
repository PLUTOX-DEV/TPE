import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { loginUser } from "./api/userApi";

// Admin - eagerly loaded
import AdminUsers from "./pages/AdminUsers";
// import Allocation from "./pages/Allocation"

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

function InitTelegramUser() {
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

    // Call backend to login or create user
    loginUser({ telegramId, username, fullName }).catch((err) => {
      console.error("❌ Failed to login or create user:", err);
    });
  }, []);

  return null;
}

export default function App() {
  const location = useLocation();
  const hideBottomNav = location.pathname.startsWith("/admin");

  return (
    <div className="bg-black text-white min-h-screen">
      {/* ✅ Initializes Telegram User on Mini App load */}
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
          {/* <Route path="/allocation" element={<Allocation />} /> */}

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
