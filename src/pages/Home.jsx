import React, { useState } from 'react';
import coinImg from '../assets/coin.png'; // ✅ Place a coin.gif in src/assets/

export default function Home() {
  const [coins, setCoins] = useState(0);
  const [tapping, setTapping] = useState(false);

  const handleTap = () => {
    if (tapping) return;
    setTapping(true);
    setTimeout(() => {
      setCoins(prev => prev + 1);
      setTapping(false);
    }, 300);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[85vh] px-4 bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="bg-white/5 border border-yellow-500/10 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-2 tracking-wide">🚀 Tap & Earn</h1>
        <p className="text-yellow-400 text-xl font-semibold mb-6">
          Balance: <span className="text-white">{coins}</span> 🪙
        </p>

        <button
          onClick={handleTap}
          className={`w-40 h-40 rounded-full overflow-hidden border-4 border-yellow-400 shadow-yellow-400 shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200 bg-black`}
        >
          <img
            src={coinImg}
            alt="Tap Coin"
            className={`w-full h-full object-cover ${tapping ? 'animate-ping' : ''}`}
          />
        </button>

        <p className="mt-4 text-sm text-gray-400">
          Tap the coin above to earn more!
        </p>
      </div>
    </div>
  );
}
