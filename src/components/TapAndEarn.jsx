import React, { useState } from 'react';

export default function TapAndEarn() {
  const [coins, setCoins] = useState(0);
  const [tapping, setTapping] = useState(false);

  const handleTap = () => {
    setTapping(true);
    setTimeout(() => setTapping(false), 150);
    setCoins(prev => prev + 1);
    // TODO: Send to backend later
  };

  return (
    <div className="text-center">
      <p className="text-lg mb-4">Your Coins: <span className="font-bold">{coins}</span> 🪙</p>
      <button
        onClick={handleTap}
        className={`transition transform ${tapping ? 'scale-95' : 'scale-100'} px-8 py-4 text-lg font-semibold bg-yellow-400 text-black rounded-full shadow-lg hover:scale-105`}
      >
        Tap to Earn 💰
      </button>
    </div>
  );
}
