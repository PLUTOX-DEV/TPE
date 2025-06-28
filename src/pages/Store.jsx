import React, { useEffect, useState } from "react";
import { updateUser } from "../api/userApi";

export default function Store() {
  const [coins, setCoins] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [regenSpeed, setRegenSpeed] = useState(10000);
  const [hasTapBot, setHasTapBot] = useState(false);
  const telegramId = localStorage.getItem("telegramId");

  useEffect(() => {
    const savedCoins = parseInt(localStorage.getItem("tapCoins")) || 0;
    const savedMultiplier = parseInt(localStorage.getItem("tapMultiplier")) || 1;
    const savedRegen = parseInt(localStorage.getItem("staminaRegenSpeed")) || 10000;
    const savedBot = localStorage.getItem("hasTapBot") === "true";

    setCoins(savedCoins);
    setMultiplier(savedMultiplier);
    setRegenSpeed(savedRegen);
    setHasTapBot(savedBot);
  }, []);

  const updateCoins = (amount) => {
    const newBalance = coins - amount;
    setCoins(newBalance);
    localStorage.setItem("tapCoins", newBalance);
    return newBalance;
  };

  const buyMultiplier = async () => {
    if (!telegramId) return alert("Telegram ID not found.");
    if (coins < 50) return alert("Not enough coins.");

    const newMult = multiplier + 1;
    const newBalance = updateCoins(50);

    setMultiplier(newMult);
    localStorage.setItem("tapMultiplier", newMult);

    try {
      await updateUser(telegramId, {
        multiplier: newMult,
        balance: newBalance,
      });
      alert("🔥 Multiplier upgraded!");
    } catch (err) {
      console.error(err);
      alert("Failed to update multiplier on backend.");
    }
  };

  const buyRegen = async () => {
    if (!telegramId) return alert("Telegram ID not found.");
    if (coins < 80) return alert("Not enough coins.");

    const newSpeed = Math.max(2000, regenSpeed - 1000);
    const newBalance = updateCoins(80);

    setRegenSpeed(newSpeed);
    localStorage.setItem("staminaRegenSpeed", newSpeed);

    try {
      await updateUser(telegramId, {
        staminaRegenSpeed: newSpeed,
        balance: newBalance,
      });
      alert("⚡ Regen speed improved!");
    } catch (err) {
      console.error(err);
      alert("Failed to update regen speed on backend.");
    }
  };

  const buyTapBot = async () => {
    if (!telegramId) return alert("Telegram ID not found.");
    if (hasTapBot) return alert("You already own the Tap Bot!");
    if (coins < 100) return alert("Not enough coins.");

    const newBalance = updateCoins(100);

    setHasTapBot(true);
    localStorage.setItem("hasTapBot", "true");

    try {
      await updateUser(telegramId, {
        hasTapBot: true,
        balance: newBalance,
      });
      alert("🤖 Tap Bot purchased successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update Tap Bot on backend.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">🛍 Tapper Store</h1>
      <p className="mb-6 text-lg">
        🪙 Coins: <span className="text-green-400">{coins}</span>
      </p>

      <div className="space-y-6 w-full max-w-sm">
        {/* Multiplier Upgrade */}
        <div className="bg-white/10 p-4 rounded-xl border border-yellow-500/20">
          <p className="text-lg font-bold mb-1">🔥 Tap Multiplier</p>
          <p className="text-sm mb-2">Current: x{multiplier}</p>
          <button
            onClick={buyMultiplier}
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold"
          >
            Buy for 50 🪙
          </button>
        </div>

        {/* Regen Upgrade */}
        <div className="bg-white/10 p-4 rounded-xl border border-yellow-500/20">
          <p className="text-lg font-bold mb-1">⚡ Faster Stamina Regen</p>
          <p className="text-sm mb-2">Current speed: {regenSpeed / 1000}s</p>
          <button
            onClick={buyRegen}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold"
          >
            Buy for 80 🪙
          </button>
        </div>

        {/* Tap Bot */}
        <div className="bg-white/10 p-4 rounded-xl border border-yellow-500/20">
          <p className="text-lg font-bold mb-1">🤖 Auto Tap Bot</p>
          <p className="text-sm mb-2">
            Status:{" "}
            {hasTapBot ? (
              <span className="text-green-400 font-bold">✅ Owned</span>
            ) : (
              <span className="text-red-400 font-bold">❌ Not Owned</span>
            )}
          </p>
          <button
            onClick={buyTapBot}
            disabled={hasTapBot}
            className={`w-full py-2 ${
              hasTapBot
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } rounded-lg font-bold`}
          >
            {hasTapBot ? "Already Owned" : "Buy for 100 🪙"}
          </button>
        </div>
      </div>
    </div>
  );
}
