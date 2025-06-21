import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Spin from './pages/Spin';
import Tasks from './pages/Tasks';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';

export default function App() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/spin" element={<Spin />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <BottomNav />
    </div>
  );
}
