import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Spin from "./pages/Spin";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import BottomNav from "./components/BottomNav";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

export default function App() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/spin" element={<Spin />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Analytics />
      <SpeedInsights />
      <BottomNav />
    </div>
  );
}
