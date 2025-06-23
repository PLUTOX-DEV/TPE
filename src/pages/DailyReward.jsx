import React, { useEffect, useState } from "react";

export default function DailyReward() {
  const [canClaim, setCanClaim] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    const savedCoins = parseInt(localStorage.getItem("tapCoins")) || 0;
    setCoins(savedCoins);
    checkRewardStatus();
  }, []);

  const checkRewardStatus = () => {
    const lastClaim = localStorage.getItem("lastDailyClaim");
    const now = new Date();

    if (!lastClaim) {
      setCanClaim(true);
      return;
    }

    const diff = now - new Date(lastClaim);
    const hours = 24 - Math.floor(diff / (1000 * 60 * 60));
    const minutes = 60 - Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = 60 - Math.floor((diff % (1000 * 60)) / 1000);

    if (diff >= 24 * 60 * 60 * 1000) {
      setCanClaim(true);
    } else {
      setCanClaim(false);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }
  };

  const handleClaim = () => {
    const newCoins = coins + 100;
    setCoins(newCoins);
    localStorage.setItem("tapCoins", newCoins);
    localStorage.setItem("lastDailyClaim", new Date().toISOString());
    alert("🎉 You claimed 100 coins!");
    setCanClaim(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <div className="bg-white/10 p-6 rounded-xl max-w-sm w-full text-center shadow">
        <h1 className="text-2xl font-bold text-yellow-400 mb-4">🎁 Daily Reward</h1>
        <p className="text-lg mb-4">🪙 Current Balance: <span className="text-green-400">{coins}</span></p>
        {canClaim ? (
          <button
            onClick={handleClaim}
            className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-full"
          >
            Claim 100 Coins
          </button>
        ) : (
          <p className="text-gray-300">⏳ Come back in: <span className="text-yellow-300">{timeLeft}</span></p>
        )}
      </div>
    </div>
  );
}
