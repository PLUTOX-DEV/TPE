import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Directly import Admin panel (don't lazy load)
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
    <div className="animate-spin border-4 border-white border-t-transparent rounded-full w-12 h-12 mr-3"></div>
    Loading...
  </div>
);

export default function App() {
  const location = useLocation();
  const hideBottomNav = location.pathname.startsWith("/admin");

  return (
    <div className="bg-black text-white min-h-screen">
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* User-facing pages */}
          <Route path="/" element={<Home />} />
          <Route path="/spin" element={<Spin />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/store" element={<Store />} />
          <Route path="/daily-reward" element={<DailyReward />} />
          <Route path="/leaderboard" element={<Leaderboard />} />

          {/* Admin dashboard */}
          <Route path="/admin" element={<AdminUsers />} />
        </Routes>
      </Suspense>

      {/* Insights */}
      <Analytics />
      <SpeedInsights />

      {/* Navigation bar (hidden on admin page) */}
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}
