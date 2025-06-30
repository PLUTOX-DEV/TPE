import React, { useContext, useEffect, useState } from "react";
import coinImg from "../assets/image.jpg";
import { StaminaContext } from "../context/StaminaContext";
import { UserContext } from "../context/UserContext";
import toast from "react-hot-toast";
import { updateUser } from "../api/userApi";

const formatCoins = (num) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "k";
  return num.toString();
};

export default function Home() {
  const { stamina, setStamina, maxStamina } = useContext(StaminaContext);
  const { user, setUser, loadingUser } = useContext(UserContext);

  const [tapping, setTapping] = useState(false);
  const [coins, setCoins] = useState(0);

  const multiplier = user?.multiplier || 1;
  const hasTapBot = user?.hasTapBot || false;
  const isVIP = user?.isVIP || false;
  const telegramId = localStorage.getItem("telegramId");

  useEffect(() => {
    if (user) {
      setCoins(user.balance || 0);
    }
  }, [user]);

  // First time welcome
  useEffect(() => {
    const isNew = localStorage.getItem("isNewUser");
    if (!isNew) {
      toast.success("👋 Welcome to Nakabozoz Tap & Earn!", { duration: 5000 });
      localStorage.setItem("isNewUser", "false");
    }
  }, []);

  // Auto tap bot
  useEffect(() => {
    if (!hasTapBot || loadingUser) return;
    const interval = setInterval(() => {
      if (stamina > 0) handleTap(true);
    }, 3000);
    return () => clearInterval(interval);
  }, [stamina, hasTapBot, loadingUser]);

  const handleTap = async (isBot = false) => {
    if (tapping || stamina <= 0 || loadingUser) {
      if (!isBot) toast.error("⚡ You're out of stamina!");
      return;
    }

    if (!isBot) setTapping(true);
    const earned = multiplier;
    const newTotal = coins + earned;

    setTimeout(async () => {
      setCoins(newTotal);
      setStamina((prev) => {
        const updated = Math.max(0, prev - 1);
        localStorage.setItem("stamina", updated);
        return updated;
      });

      if (telegramId) {
        try {
          await updateUser(telegramId, { balance: newTotal, isVIP });
          setUser((prev) => ({ ...prev, balance: newTotal }));
        } catch (err) {
          console.error("Failed to sync:", err);
        }
      }

      if (!isBot) toast.success(`+${earned} 🪙`);
      if (!isBot) setTapping(false);
    }, 200);
  };

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white text-xl">
        <div className="animate-spin border-4 border-yellow-400 border-t-transparent rounded-full w-12 h-12 mr-3"></div>
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="bg-white/10 border border-yellow-500/40 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center relative">
        <h1 className="text-4xl font-extrabold mb-5 tracking-wider text-yellow-400 drop-shadow-lg">
          🚀 Tap & Earn
        </h1>

        <div className="mb-6 space-y-2 text-lg font-semibold">
          <p className="text-gray-300">Balance</p>
          <p className="text-4xl text-yellow-300 drop-shadow-lg">{formatCoins(coins)} 🪙</p>

          <div className="flex justify-center gap-8 mt-3 text-sm font-medium">
            <div className="text-green-400">
              Multiplier: <span className="font-bold">×{multiplier}</span>
            </div>
            <div className="text-blue-400">
              Stamina: <span className="font-bold">{stamina} / {maxStamina}</span>
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-800 rounded-full h-4 mb-8 overflow-hidden shadow-inner">
          <div
            className="bg-yellow-400 h-full transition-all duration-500 ease-in-out"
            style={{ width: `${(stamina / maxStamina) * 100}%` }}
          />
        </div>

        <button
          onClick={() => handleTap(false)}
          disabled={tapping || stamina <= 0}
          aria-label="Tap the coin to earn tokens"
          className={`relative w-44 h-44 rounded-full border-8 border-yellow-400 shadow-[0_0_15px_3px_rgba(252,211,77,0.8)] transition-transform duration-200 ${
            tapping || stamina <= 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:scale-110 active:scale-90 shadow-yellow-400"
          }`}
        >
          <img src={coinImg} alt="Tap Coin" className="w-full h-full object-cover rounded-full" />
          <span className="absolute inset-0 rounded-full bg-yellow-400 opacity-20 animate-pulse" />
        </button>

        <p className="mt-5 text-gray-400 tracking-wide select-none">Tap the coin to earn tokens!</p>
      </div>
    </div>
  );
}
