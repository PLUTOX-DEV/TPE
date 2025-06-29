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

// Import AdminUsers (not lazy loaded so it loads immediately)
import AdminUsers from "./pages/AdminUsers";

const Loading = () => (
  <div className="flex justify-center items-center h-screen bg-black text-white text-xl">
    <div className="animate-spin border-4 border-white border-t-transparent rounded-full w-12 h-12 mr-3"></div>
    Loading...
  </div>
);

export default function App() {
  // ... your existing state and useEffect

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

          {/* Admin route */}
          <Route path="/admin" element={<AdminUsers />} />
        </Routes>
      </Suspense>

      <Analytics />
      <SpeedInsights />
      <BottomNav />
    </div>
  );
}
