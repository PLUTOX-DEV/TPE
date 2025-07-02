import React, { useEffect, useState } from "react";
import { getUser, updateUser, buyTapBot } from "../api/userApi";
import toast from "react-hot-toast";

// Format number with suffix
const formatNumber = (num) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "k";
  return num.toString();
};

export default function Store() {
  const telegramId = localStorage.getItem("telegramId");

  const [coins, setCoins] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [regenSpeed, setRegenSpeed] = useState(10000);
  const [hasTapBot, setHasTapBot] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadingMultiplier, setLoadingMultiplier] = useState(false);
  const [loadingRegen, setLoadingRegen] = useState(false);
  const [loadingTapBot, setLoadingTapBot] = useState(false);

  const fetchUser = async () => {
    if (!telegramId) return;

    try {
      setLoading(true);
      const user = await getUser(telegramId);
      setCoins(user.balance || 0);
      setMultiplier(Math.min(user.multiplier || 1, 20)); // Enforce max 20
      setRegenSpeed(user.staminaRegenSpeed || 10000);
      setHasTapBot(user.hasTapBot || false);
    } catch (err) {
      toast.error("❌ Failed to fetch user data");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const updateBalance = async (newBalance, extraUpdates = {}) => {
    await updateUser(telegramId, { balance: newBalance, ...extraUpdates });
    fetchUser();
  };

  const handleBuyMultiplier = async () => {
    if (multiplier >= 20) return toast("Max multiplier reached");
    if (coins < 50) return toast.error("Not enough coins");
    const newMult = multiplier + 1;
    const newBalance = coins - 50;

    try {
      setLoadingMultiplier(true);
      await updateBalance(newBalance, { multiplier: newMult });
      toast.success("🔥 Tap Multiplier upgraded!");
    } catch (err) {
      toast.error("Failed to upgrade multiplier.");
    } finally {
      setLoadingMultiplier(false);
    }
  };

  const handleBuyRegen = async () => {
    if (regenSpeed <= 2000) return toast("Already at fastest regen speed!");
    if (coins < 80) return toast.error("Not enough coins");
    const newSpeed = Math.max(2000, regenSpeed - 1000);
    const newBalance = coins - 80;

    try {
      setLoadingRegen(true);
      await updateBalance(newBalance, { staminaRegenSpeed: newSpeed });
      toast.success("⚡ Regen Speed improved!");
    } catch (err) {
      toast.error("Failed to upgrade regen speed.");
    } finally {
      setLoadingRegen(false);
    }
  };

  const handleBuyTapBot = async () => {
    if (hasTapBot) return toast("Already owned");
    if (coins < 100) return toast.error("Not enough coins");

    try {
      setLoadingTapBot(true);
      await buyTapBot(telegramId);
      toast.success("🤖 Tap Bot purchased!");
      fetchUser();
    } catch (err) {
      toast.error(err.message || "Failed to buy Tap Bot.");
    } finally {
      setLoadingTapBot(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-10">
        <div className="animate-pulse space-y-6 w-full max-w-sm">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/10 rounded-xl border border-yellow-500/20 h-24 w-full"
            ></div>
          ))}
          <div className="h-4 w-24 bg-yellow-400 rounded-full animate-pulse mt-8 mx-auto" />
          <p className="text-gray-400 text-sm text-center mt-4">Loading Store...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">🛍 Tapper Store</h1>
      <p className="mb-6 text-lg">
        🪙 Coins: <span className="text-green-400">{formatNumber(coins)}</span>
      </p>

      <div className="space-y-6 w-full max-w-sm">
        <UpgradeCard
          title="🔥 Tap Multiplier"
          subtitle={`Current: x${multiplier}`}
          onClick={handleBuyMultiplier}
          cost={50}
          loading={loadingMultiplier}
          disabled={coins < 50 || multiplier >= 20}
          note={multiplier >= 20 ? "Max level reached" : null}
        />

        <UpgradeCard
          title="⚡ Faster Stamina Regen"
          subtitle={`Current: ${(regenSpeed / 1000).toFixed(1)}s`}
          onClick={handleBuyRegen}
          cost={80}
          loading={loadingRegen}
          disabled={coins < 80 || regenSpeed <= 2000}
          note={regenSpeed <= 2000 ? "Fastest regen reached" : null}
        />

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

function UpgradeCard({ title, subtitle, onClick, cost, loading, disabled, note }) {
  return (
    <div className="bg-white/10 p-4 rounded-xl border border-yellow-500/20">
      <p className="text-lg font-bold mb-1">{title}</p>
      <p className="text-sm mb-2">{subtitle}</p>
      {note && <p className="text-yellow-400 text-xs mb-2">{note}</p>}
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
