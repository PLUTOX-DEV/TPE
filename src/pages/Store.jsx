import React, { useEffect, useState } from "react";
import { getUser, updateUser, buyTapBot, toggleTapBot, refillStamina } from "../api/userApi";
import toast from "react-hot-toast";

const formatNumber = (num) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "k";
  return num.toString();
};

export default function Store() {
  const telegramId = localStorage.getItem("telegramId");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMultiplier, setLoadingMultiplier] = useState(false);
  const [loadingRegen, setLoadingRegen] = useState(false);
  const [loadingTapBot, setLoadingTapBot] = useState(false);
  const [loadingRefill, setLoadingRefill] = useState(false);
  const [loadingToggle, setLoadingToggle] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const u = await getUser(telegramId);
      setUser(u);
    } catch {
      toast.error("❌ Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const updateAndRefresh = async (data) => {
    await updateUser(telegramId, data);
    fetchUser();
  };

  const handleBuyMultiplier = async () => {
    if (user.multiplier >= 20) return toast("Max multiplier reached");
    if (user.balance < 50) return toast.error("Not enough coins");
    try {
      setLoadingMultiplier(true);
      await updateAndRefresh({ multiplier: user.multiplier + 1, balance: user.balance - 50 });
      toast.success("🔥 Tap Multiplier upgraded!");
    } catch (err) {
      toast.error(err.message || "Failed to upgrade multiplier.");
    } finally {
      setLoadingMultiplier(false);
    }
  };

  const handleBuyRegen = async () => {
    if (user.staminaRegenSpeed <= 2000) return toast("Fastest regen reached!");
    if (user.balance < 80) return toast.error("Not enough coins");
    try {
      setLoadingRegen(true);
      await updateAndRefresh({
        staminaRegenSpeed: Math.max(2000, user.staminaRegenSpeed - 1000),
        balance: user.balance - 80,
      });
      toast.success("⚡ Regen Speed improved!");
    } catch (err) {
      toast.error(err.message || "Failed to improve regen speed.");
    } finally {
      setLoadingRegen(false);
    }
  };

  const handleBuyTapBot = async () => {
    if (user.hasTapBot) return toast("Already owned");
    if (user.balance < 100) return toast.error("Not enough coins");
    try {
      setLoadingTapBot(true);
      await buyTapBot(telegramId);
      toast.success("🤖 Tap Bot purchased!");
      fetchUser();
    } catch (err) {
      toast.error(err.message || "Failed to purchase Tap Bot.");
    } finally {
      setLoadingTapBot(false);
    }
  };

  const handleRefillStamina = async () => {
    try {
      setLoadingRefill(true);
      const response = await refillStamina(telegramId);
      toast.success(response.message);
      fetchUser();
    } catch (err) {
      toast.error(err.message || "Refill failed.");
    } finally {
      setLoadingRefill(false);
    }
  };

  const handleToggleBot = async () => {
    try {
      setLoadingToggle(true);
      const response = await toggleTapBot(telegramId);
      toast.success(response.message);
      fetchUser();
    } catch (err) {
      toast.error(err.message || "Toggle failed.");
    } finally {
      setLoadingToggle(false);
    }
  };

  if (loading || !user) {
    return <div className="text-white text-center mt-10">Loading store...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-10">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">🛍 Tapper Store</h1>
      <p className="mb-6 text-lg">
        🪙 Coins: <span className="text-green-400">{formatNumber(user.balance)}</span>
      </p>

      <div className="space-y-6 w-full max-w-sm">
        <UpgradeCard
          title="🔥 Tap Multiplier"
          subtitle={`Current: x${user.multiplier}`}
          onClick={handleBuyMultiplier}
          cost={50}
          loading={loadingMultiplier}
          disabled={user.balance < 50 || user.multiplier >= 20}
          note={user.multiplier >= 20 ? "Max level reached" : null}
        />

        <UpgradeCard
          title="⚡ Faster Stamina Regen"
          subtitle={`Current: ${(user.staminaRegenSpeed / 1000).toFixed(1)}s`}
          onClick={handleBuyRegen}
          cost={80}
          loading={loadingRegen}
          disabled={user.balance < 80 || user.staminaRegenSpeed <= 2000}
          note={user.staminaRegenSpeed <= 2000 ? "Fastest regen reached" : null}
        />

        <UpgradeCard
          title="💧 Refill Stamina"
          subtitle={`Used Today: ${user.staminaRefillsToday || 0} / 4`}
          onClick={handleRefillStamina}
          cost={20}
          loading={loadingRefill}
          disabled={(user.staminaRefillsToday || 0) >= 4 || user.balance < 20}
          note={(user.staminaRefillsToday || 0) >= 4 ? "Daily limit reached" : null}
        />

        <div className="bg-white/10 p-4 rounded-xl border border-yellow-500/20">
          <p className="text-lg font-bold mb-1">🤖 Auto Tap Bot</p>
          <p className="text-sm mb-2">
            Status:{" "}
            {user.hasTapBot ? (
              <span className="text-green-400 font-bold">✅ Owned</span>
            ) : (
              <span className="text-red-400 font-bold">❌ Not Owned</span>
            )}
          </p>

          {user.hasTapBot ? (
            <button
              onClick={handleToggleBot}
              className={`w-full py-2 rounded-lg font-bold ${
                loadingToggle ? "bg-gray-500" : user.isTapBotActive ? "bg-red-600" : "bg-green-600"
              }`}
            >
              {loadingToggle
                ? "Switching..."
                : user.isTapBotActive
                ? "Deactivate Tap Bot"
                : "Activate Tap Bot"}
            </button>
          ) : (
            <button
              onClick={handleBuyTapBot}
              disabled={user.balance < 100 || loadingTapBot}
              className={`w-full py-2 rounded-lg font-bold ${
                user.balance < 100 ? "bg-gray-600" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loadingTapBot ? "Purchasing..." : "Buy for 100 🪙"}
            </button>
          )}
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
          disabled ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Processing..." : `Buy for ${cost} 🪙`}
      </button>
    </div>
  );
}
