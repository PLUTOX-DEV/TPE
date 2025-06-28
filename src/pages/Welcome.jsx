import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/home'); // 👈 go to main app after welcome
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black text-white px-4">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">🎉 Welcome to Nakabozoz!</h1>
      <p className="text-gray-300 text-center mb-6 max-w-md">
        You're now part of Nakabozoz – tap, earn, and climb the leaderboard! Let's get started. 🚀
      </p>
      <button
        onClick={handleContinue}
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg"
      >
        Start Tapping
      </button>
    </div>
  );
}
