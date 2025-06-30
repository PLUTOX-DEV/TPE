import React, { useEffect, useState } from "react";
import { getUser, updateUser, buyTapBot } from "../api/userApi";
import toast from "react-hot-toast";

// Format coins like 1.2k or 3.5M
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

  const [loading, setLoading] = useState({
    multiplier: false,
    regen: false,
    tapBot: false,
  });

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
      .catch((err) => {
        console.error("Failed to fetch user:", err);
        toast.error("⚠️ Failed to load user data.");
      });
  }, [telegramId]);

  const updateBalance = async (newBalance, updatedFields = {}) => {
    await updateUser(telegramId, { balance: newBalance, ...updatedFields });
    setCoins(newBalance);
  };

  const handleBuy = async (type) => {
    if (type === "multiplier") {
      if (coins < 50) return toast.error("Not enough coins.");
      const newMult = multiplier + 1;
      const newBal = coins - 50;

      setLoading((prev) => ({ ...prev, multiplier: true }));
      try {
        await updateBalance(newBal, { multiplier: newMult });
        setMultiplier(newMult);
        toast.success("🔥 Multiplier upgraded!");
      } catch {
        toast.error("Upgrade failed.");
      } finally {
        setLoading((prev) => ({ ...prev, multiplier: false }));
      }
    }

    if (type === "regen") {
      if (coins < 80) return toast.error("Not enough coins.");
      const newSpeed = Math.max(2000, regenSpeed - 1000);
      const newBal = coins - 80;

      setLoading((prev) => ({ ...prev, regen: true }));
      try {
        await updateBalance(newBal, { staminaRegenSpeed: newSpeed });
        setRegenSpeed(newSpeed);
        toast.success("⚡ Regeneration speed improved!");
      } catch {
        toast.error("Upgrade failed.");
      } finally {
        setLoading((prev) => ({ ...prev, regen: false }));
      }
    }

    if (type === "tapBot") {
      if (hasTapBot) return toast.error("Already owned.");
      if (coins < 100) return toast.error("Not enough coins.");

      setLoading((prev) => ({ ...prev, tapBot: true }));
      try {
        const res = await buyTapBot(telegramId);
        setCoins(res.user.balance);
        setHasTapBot(true);
        toast.success("🤖 Tap Bot activated!");
      } catch (err) {
        toast.error(err.message || "Failed to buy Tap Bot.");
      } finally {
        setLoading((prev) => ({ ...prev, tapBot: false }));
      }
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
          cost={50}
          loading={loading.multiplier}
          disabled={coins < 50}
          onBuy={() => handleBuy("multiplier")}
        />

        {/* Regen Speed */}
        <UpgradeCard
          title="⚡ Faster Stamina Regen"
          subtitle={`Current: ${(regenSpeed / 1000).toFixed(1)}s`}
          cost={80}
          loading={loading.regen}
          disabled={coins < 80}
          onBuy={() => handleBuy("regen")}
        />

        {/* Tap Bot */}
        <div className="bg-white/10 p-4 rounded-xl border border-yellow-500/20">
          <p className="text-lg font-bold mb-1">🤖 Auto Tap Bot</p>
          <p className="text-sm mb-2">
            Status:{" "}
            <span className={hasTapBot ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
              {hasTapBot ? "✅ Owned" : "❌ Not Owned"}
            </span>
          </p>
          <button
            onClick={() => handleBuy("tapBot")}
            disabled={hasTapBot || coins < 100 || loading.tapBot}
            className={`w-full py-2 rounded-lg font-bold text-white ${
              hasTapBot || coins < 100
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading.tapBot
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

function UpgradeCard({ title, subtitle, cost, loading, disabled, onBuy }) {
  return (
    <div className="bg-white/10 p-4 rounded-xl border border-yellow-500/20">
      <p className="text-lg font-bold mb-1">{title}</p>
      <p className="text-sm mb-2">{subtitle}</p>
      <button
        onClick={onBuy}
        disabled={disabled || loading}
        className={`w-full py-2 rounded-lg font-bold text-white ${
          disabled ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Purchasing..." : `Buy for ${cost} 🪙`}
      </button>
    </div>
  );
}
