import React, { useEffect, useState } from "react";
import { getUser, updateUser, buyTapBot } from "../api/userApi";
import toast from "react-hot-toast";

// Format coins with k/M suffixes
const formatNumber = (num) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "k";
  return num.toString();
};

export default function Store() {
  const [coins, setCoins] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [regenSpeed, setRegenSpeed] = useState(10000);
  const [hasTapBot, setHasTapBot] = useState(false);
  // loading states per upgrade button
  const [loadingMultiplier, setLoadingMultiplier] = useState(false);
  const [loadingRegen, setLoadingRegen] = useState(false);
  const [loadingTapBot, setLoadingTapBot] = useState(false);

  const telegramId = localStorage.getItem("telegramId");

  useEffect(() => {
    if (!telegramId) return;

    getUser(telegramId)
      .then((data) => {
        setCoins(data.balance);
        setMultiplier(data.multiplier || 1);
        setRegenSpeed(data.staminaRegenSpeed || 10000);
        setHasTapBot(data.hasTapBot || false);
      })
      .catch((err) => console.error("Failed to load user", err));
  }, [telegramId]);

  const updateBalance = async (newBalance, updatedFields = {}) => {
    await updateUser(telegramId, { balance: newBalance, ...updatedFields });
    setCoins(newBalance);
  };

  const handleBuyMultiplier = async () => {
    if (coins < 50) return toast.error("Not enough coins.");
    const newMult = multiplier + 1;
    const newBalance = coins - 50;

    try {
      setLoadingMultiplier(true);
      await updateBalance(newBalance, { multiplier: newMult });
      setMultiplier(newMult);
      toast.success("🔥 Tap Multiplier upgraded!");
    } catch (err) {
      toast.error("Failed to upgrade multiplier.");
    } finally {
      setLoadingMultiplier(false);
    }
  };

  const handleBuyRegen = async () => {
    if (coins < 80) return toast.error("Not enough coins.");
    const newSpeed = Math.max(2000, regenSpeed - 1000);
    const newBalance = coins - 80;

    try {
      setLoadingRegen(true);
      await updateBalance(newBalance, { staminaRegenSpeed: newSpeed });
      setRegenSpeed(newSpeed);
      toast.success("⚡ Regen Speed improved!");
    } catch (err) {
      toast.error("Failed to upgrade regen speed.");
    } finally {
      setLoadingRegen(false);
    }
  };

  const handleBuyTapBot = async () => {
    if (hasTapBot) return toast.error("You already own the Tap Bot!");
    if (coins < 100) return toast.error("Not enough coins.");

    try {
      setLoadingTapBot(true);
      const response = await buyTapBot(telegramId);
      const updatedUser = response.user;
      setCoins(updatedUser.balance);
      setHasTapBot(true);
      toast.success("🤖 Tap Bot purchased!");
    } catch (err) {
      toast.error(err.message || "Failed to buy Tap Bot.");
    } finally {
      setLoadingTapBot(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">🛍 Tapper Store</h1>
      <p className="mb-6 text-lg">
        🪙 Coins: <span className="text-green-400">{formatNumber(coins)}</span>
      </p>

      <div className="space-y-6 w-full max-w-sm">
        {/* Tap Multiplier */}
        <UpgradeCard
          title="🔥 Tap Multiplier"
          subtitle={`Current: x${multiplier}`}
          onClick={handleBuyMultiplier}
          cost={50}
          loading={loadingMultiplier}
          disabled={coins < 50}
        />

        {/* Regen Speed */}
        <UpgradeCard
          title="⚡ Faster Stamina Regen"
          subtitle={`Current: ${(regenSpeed / 1000).toFixed(1)}s`}
          onClick={handleBuyRegen}
          cost={80}
          loading={loadingRegen}
          disabled={coins < 80}
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
            disabled={hasTapBot || loadingTapBot || coins < 100}
            className={`w-full py-2 rounded-lg font-bold ${
              hasTapBot || coins < 100
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loadingTapBot
              ? "Purchasing..."
              : hasTapBot
              ? "Already Owned"
              : "Buy for 100 🪙"}
          </button>
        </div>
      </div>
    </div>
  );
}

function UpgradeCard({ title, subtitle, onClick, cost, loading, disabled }) {
  return (
    <div className="bg-white/10 p-4 rounded-xl border border-yellow-500/20">
      <p className="text-lg font-bold mb-1">{title}</p>
      <p className="text-sm mb-2">{subtitle}</p>
      <button
        onClick={onClick}
        disabled={loading || disabled}
        className={`w-full py-2 rounded-lg font-bold text-white ${
          disabled
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Purchasing..." : `Buy for ${cost} 🪙`}
      </button>
    </div>
  );
}
