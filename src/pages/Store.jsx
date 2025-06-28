import React, { useEffect, useState } from "react";
import { getUser, updateUser, buyTapBot } from "../api/userApi";

export default function Store() {
  const [coins, setCoins] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [regenSpeed, setRegenSpeed] = useState(10000);
  const [hasTapBot, setHasTapBot] = useState(false);
  const [loading, setLoading] = useState(false);

  const telegramId = localStorage.getItem("telegramId");

  useEffect(() => {
    if (!telegramId) return;

    getUser(telegramId)
      .then(data => {
        setCoins(data.balance);
        setMultiplier(data.multiplier || 1);
        setRegenSpeed(data.staminaRegenSpeed || 10000);
        setHasTapBot(data.hasTapBot || false);
      })
      .catch(err => console.error("Failed to load user", err));
  }, []);

  const updateBalance = async (newBalance, updatedFields = {}) => {
    await updateUser(telegramId, { balance: newBalance, ...updatedFields });
    setCoins(newBalance);
  };

  const handleBuyMultiplier = async () => {
    if (coins < 50) return alert("Not enough coins.");
    const newMult = multiplier + 1;
    const newBalance = coins - 50;

    try {
      setLoading(true);
      await updateBalance(newBalance, { multiplier: newMult });
      setMultiplier(newMult);
      alert("🔥 Tap Multiplier upgraded!");
    } catch (err) {
      alert("Failed to upgrade multiplier.");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyRegen = async () => {
    if (coins < 80) return alert("Not enough coins.");
    const newSpeed = Math.max(2000, regenSpeed - 1000);
    const newBalance = coins - 80;

    try {
      setLoading(true);
      await updateBalance(newBalance, { staminaRegenSpeed: newSpeed });
      setRegenSpeed(newSpeed);
      alert("⚡ Regen Speed improved!");
    } catch (err) {
      alert("Failed to upgrade regen speed.");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyTapBot = async () => {
    if (hasTapBot) return alert("You already own the Tap Bot!");
    if (coins < 100) return alert("Not enough coins.");

    try {
      setLoading(true);
      const response = await buyTapBot(telegramId);
      const updatedUser = response.user;
      setCoins(updatedUser.balance);
      setHasTapBot(true);
      alert("🤖 Tap Bot purchased!");
    } catch (err) {
      alert(err.message || "Failed to buy Tap Bot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">🛍 Tapper Store</h1>
      <p className="mb-6 text-lg">
        🪙 Coins: <span className="text-green-400">{coins}</span>
      </p>

      <div className="space-y-6 w-full max-w-sm">
        {/* Tap Multiplier */}
        <UpgradeCard
          title="🔥 Tap Multiplier"
          subtitle={`Current: x${multiplier}`}
          onClick={handleBuyMultiplier}
          cost={50}
          loading={loading}
        />

        {/* Regen Speed */}
        <UpgradeCard
          title="⚡ Faster Stamina Regen"
          subtitle={`Current: ${regenSpeed / 1000}s`}
          onClick={handleBuyRegen}
          cost={80}
          loading={loading}
        />

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
            onClick={handleBuyTapBot}
            disabled={hasTapBot || loading}
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

function UpgradeCard({ title, subtitle, onClick, cost, loading }) {
  return (
    <div className="bg-white/10 p-4 rounded-xl border border-yellow-500/20">
      <p className="text-lg font-bold mb-1">{title}</p>
      <p className="text-sm mb-2">{subtitle}</p>
      <button
        onClick={onClick}
        disabled={loading}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold"
      >
        Buy for {cost} 🪙
      </button>
    </div>
  );
}
