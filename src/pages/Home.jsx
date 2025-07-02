import React, { useContext, useEffect, useState } from "react";
import coinImg from "../assets/image.jpg";
import { StaminaContext } from "../context/StaminaContext";
import toast from "react-hot-toast";
import { getUser, updateUser } from "../api/userApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faOpencart } from "@fortawesome/free-brands-svg-icons";

// Format number with short display and full value
const formatCoins = (num) => {
  if (num >= 1_000_000) return { display: (num / 1_000_000).toFixed(2) + "M", full: num.toLocaleString() };
  if (num >= 1_000) return { display: (num / 1_000).toFixed(2) + "k", full: num.toLocaleString() };
  return { display: num.toString(), full: num.toLocaleString() };
};

export default function Home() {
  const { stamina, setStamina, maxStamina } = useContext(StaminaContext);

  const [coins, setCoins] = useState(0);
  const [tapping, setTapping] = useState(false);
  const [showEarnPopup, setShowEarnPopup] = useState(false);
  const [regenSpeed, setRegenSpeed] = useState(10000);
  const [multiplier, setMultiplier] = useState(1);
  const [hasTapBot, setHasTapBot] = useState(false);
  const [isVIP, setIsVIP] = useState(false);

  const telegramId = localStorage.getItem("telegramId");

  const fetchUser = async () => {
    if (!telegramId) return;

    try {
      const user = await getUser(telegramId);
      const safeMult = Math.min(user.multiplier || 1, 20);

      setCoins(user.balance || 0);
      setMultiplier(safeMult);
      setRegenSpeed(user.staminaRegenSpeed || 10000);
      setHasTapBot(user.hasTapBot || false);
      setIsVIP(user.isVIP || false);

      localStorage.setItem("tapCoins", user.balance || 0);
      localStorage.setItem("tapMultiplier", safeMult);
      localStorage.setItem("staminaRegenSpeed", user.staminaRegenSpeed || 10000);
      localStorage.setItem("hasTapBot", user.hasTapBot ? "true" : "false");
      localStorage.setItem("isVIP", user.isVIP ? "true" : "false");
    } catch (err) {
      console.error("❌ Failed to fetch user:", err);

      const fallbackMult = Math.min(parseInt(localStorage.getItem("tapMultiplier")) || 1, 20);
      setCoins(parseInt(localStorage.getItem("tapCoins")) || 0);
      setMultiplier(fallbackMult);
      setRegenSpeed(parseInt(localStorage.getItem("staminaRegenSpeed")) || 10000);
      setHasTapBot(localStorage.getItem("hasTapBot") === "true");
      setIsVIP(localStorage.getItem("isVIP") === "true");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const isFirst = localStorage.getItem("isNewUser");
    if (!isFirst) {
      toast.success("👋 Welcome to Nakabozoz Tap & Earn!", { duration: 5000 });
      localStorage.setItem("isNewUser", "false");
    }
  }, []);

  useEffect(() => {
    if (!hasTapBot) return;
    const interval = setInterval(() => {
      if (stamina > 0) handleTap(true);
    }, Math.max(regenSpeed, 1500));
    return () => clearInterval(interval);
  }, [stamina, hasTapBot, regenSpeed]);

  const handleTap = async (isBot = false) => {
    if (tapping || stamina <= 0) {
      if (!isBot) toast.error("⚡ You're out of stamina!");
      return;
    }

    if (!isBot) setTapping(true);
    const earned = multiplier;
    const newTotal = coins + earned;

    setCoins(newTotal);
    setShowEarnPopup(true);
    localStorage.setItem("tapCoins", newTotal);

    setStamina((prev) => {
      const updated = Math.max(0, prev - 1);
      localStorage.setItem("stamina", updated);
      return updated;
    });

    if (!isBot) {
      toast.success(`+${earned} 🪙`);
    }

    if (telegramId) {
      try {
        await updateUser(telegramId, { balance: newTotal, isVIP });
      } catch (err) {
        console.error("❌ Sync failed:", err);
      }
    }

    setTimeout(() => {
      setShowEarnPopup(false);
      if (!isBot) setTapping(false);
    }, 300);
  };

  const { display, full } = formatCoins(coins);

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 bg-gradient-to-b from-black via-gray-900 to-black text-white relative">
      {/* OpenSea Icon */}
      <a
        href="https://opensea.io/collection/nakabozoz-1"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-300 text-2xl"
      >
        <FontAwesomeIcon icon={faOpencart} />
      </a>

      <div className="bg-white/10 border border-yellow-500/40 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center relative">
        <h1 className="text-4xl font-extrabold mb-5 tracking-wider text-yellow-400 drop-shadow-lg">
          🚀 Tap & Earn
        </h1>

        <div className="mb-6 space-y-2 text-lg font-semibold">
          <p className="text-gray-300">Balance</p>
          <div className="text-4xl text-yellow-300 drop-shadow-lg" title={`${full} coins`}>
            {display} 🪙
            {coins >= 1_000_000 && (
              <div className="text-xs text-gray-400 mt-1">(Full: {full})</div>
            )}
          </div>

          <div className="flex justify-center gap-8 mt-3 text-sm font-medium">
            <div className="text-green-400">
              Multiplier: <span className="font-bold">×{multiplier}</span>
              {multiplier >= 20 && (
                <p className="text-yellow-500 text-xs mt-1">Max multiplier reached!</p>
              )}
            </div>
            <div className="text-blue-400">
              Stamina: <span className="font-bold">{stamina} / {maxStamina}</span>
            </div>
          </div>
        </div>

        {/* Stamina Bar */}
        <div className="w-full bg-gray-800 rounded-full h-4 mb-8 overflow-hidden shadow-inner">
          <div
            className="bg-yellow-400 h-full transition-all duration-500 ease-in-out"
            style={{ width: `${(stamina / maxStamina) * 100}%` }}
          />
        </div>

        {/* Tap Button */}
        <div className="relative">
          {showEarnPopup && (
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black text-sm font-bold px-3 py-1 rounded-full shadow-lg animate-bounce z-10">
              +{multiplier} 🪙
            </div>
          )}
          <button
            onClick={() => handleTap(false)}
            disabled={tapping || stamina <= 0}
            aria-label="Tap the coin to earn tokens"
            className={`relative w-44 h-44 rounded-full border-8 border-yellow-400 transition-transform duration-200 
              ${tapping || stamina <= 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-110 active:scale-90 shadow-[0_0_15px_3px_rgba(252,211,77,0.8)]"}`}
          >
            <img
              src={coinImg}
              alt="Tap Coin"
              className="w-full h-full object-cover rounded-full"
            />
            <span className="absolute inset-0 rounded-full bg-yellow-400 opacity-20 animate-pulse" />
          </button>
        </div>

        <p className="mt-5 text-gray-400 tracking-wide select-none">
          Tap the coin to earn tokens!
        </p>
      </div>
    </div>
  );
}
