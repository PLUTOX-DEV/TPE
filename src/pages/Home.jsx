import React, { useContext, useEffect, useState } from "react";
import coinImg from "../assets/image.jpg";
import { StaminaContext } from "../context/StaminaContext";
import toast from "react-hot-toast";
import { getUser, updateUser } from "../api/userApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faOpensea } from "@fortawesome/free-brands-svg-icons";

// Format number
const formatCoins = (num) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "k";
  return num.toString();
};

export default function Home() {
  const { stamina, setStamina, maxStamina } = useContext(StaminaContext);

  const [coins, setCoins] = useState(0);
  const [tapping, setTapping] = useState(false);
  const [regenSpeed, setRegenSpeed] = useState(10000);
  const [multiplier, setMultiplier] = useState(1);
  const [hasTapBot, setHasTapBot] = useState(false);
  const [isVIP, setIsVIP] = useState(false);

  const telegramId = localStorage.getItem("telegramId");

  const fetchUser = async () => {
    if (!telegramId) return;

    try {
      const user = await getUser(telegramId);

      setCoins(user.balance || 0);
      setMultiplier(user.multiplier || 1);
      setRegenSpeed(user.staminaRegenSpeed || 10000);
      setHasTapBot(user.hasTapBot || false);
      setIsVIP(user.isVIP || false);

      // sync to local storage
      localStorage.setItem("tapCoins", user.balance || 0);
      localStorage.setItem("tapMultiplier", user.multiplier || 1);
      localStorage.setItem("staminaRegenSpeed", user.staminaRegenSpeed || 10000);
      localStorage.setItem("hasTapBot", user.hasTapBot ? "true" : "false");
      localStorage.setItem("isVIP", user.isVIP ? "true" : "false");
    } catch (err) {
      console.error("❌ Failed to fetch user:", err);

      // fallback from localStorage
      setCoins(parseInt(localStorage.getItem("tapCoins")) || 0);
      setMultiplier(parseInt(localStorage.getItem("tapMultiplier")) || 1);
      setRegenSpeed(parseInt(localStorage.getItem("staminaRegenSpeed")) || 10000);
      setHasTapBot(localStorage.getItem("hasTapBot") === "true");
      setIsVIP(localStorage.getItem("isVIP") === "true");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Welcome message (only first visit)
  useEffect(() => {
    const isFirst = localStorage.getItem("isNewUser");
    if (!isFirst) {
      toast.success("👋 Welcome to Nakabozoz Tap & Earn!", { duration: 5000 });
      localStorage.setItem("isNewUser", "false");
    }
  }, []);

  // Auto Tap Bot effect
  useEffect(() => {
    if (!hasTapBot) return;
    const interval = setInterval(() => {
      if (stamina > 0) handleTap(true);
    }, 3000);
    return () => clearInterval(interval);
  }, [stamina, hasTapBot]);

  const handleTap = async (isBot = false) => {
    if (tapping || stamina <= 0) {
      if (!isBot) toast.error("⚡ You're out of stamina!");
      return;
    }

    if (!isBot) setTapping(true);
    const earned = multiplier;
    const newTotal = coins + earned;

    setTimeout(async () => {
      setCoins(newTotal);
      localStorage.setItem("tapCoins", newTotal);

      // Reduce stamina
      setStamina((prev) => {
        const updated = Math.max(0, prev - 1);
        localStorage.setItem("stamina", updated);
        return updated;
      });

      // Update backend
      if (telegramId) {
        try {
          await updateUser(telegramId, { balance: newTotal, isVIP });
        } catch (err) {
          console.error("❌ Sync failed:", err);
        }
      }

      if (!isBot) {
        toast.success(`+${earned} 🪙`);
        setTapping(false);
      }
    }, 200);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 bg-gradient-to-b from-black via-gray-900 to-black text-white relative">
      
      {/* Top-right OpenSea icon with hover and tooltip */}
      <a
        href="https://opensea.io/collection/nakabozoz-1"
        target="_blank"
        rel="noopener noreferrer"
        title="View on OpenSea"
        className="absolute top-4 right-4 z-50 bg-white/10 p-3 rounded-full hover:bg-yellow-500 hover:text-black transition duration-300"
      >
        <FontAwesomeIcon icon={faOpensea} className="text-2xl drop-shadow-lg" />
      </a>

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
              Stamina:{" "}
              <span className="font-bold">
                {stamina} / {maxStamina}
              </span>
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
          <img
            src={coinImg}
            alt="Tap Coin"
            className={`w-full h-full object-cover rounded-full ${
              tapping ? "animate-pingOnce" : ""
            }`}
          />
          <span className="absolute inset-0 rounded-full bg-yellow-400 opacity-20 animate-pulse" />
        </button>

        <p className="mt-5 text-gray-400 tracking-wide select-none">
          Tap the coin to earn tokens!
        </p>
      </div>
    </div>
  );
}
