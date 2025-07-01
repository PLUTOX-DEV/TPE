import React, { useContext, useEffect, useState } from "react";
import coinImg from "../assets/image.jpg";
import { StaminaContext } from "../context/StaminaContext";
import toast from "react-hot-toast";
import { getUser, updateUser } from "../api/userApi";

// Format number with k/M
const formatCoins = (num) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "k";
  return num.toString();
};

// OpenSea icon SVG
const OpenSeaIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 512 512"
    fill="currentColor"
    className="text-white hover:text-blue-400 transition duration-300"
  >
    <path d="M256 0C114.836 0 0 114.837 0 256s114.836 256 256 256c141.163 0 256-114.837 256-256S397.163 0 256 0zm2.406 82.656c96.136-.555 174.594 77.301 174.063 172.469-.531 95.167-78.536 173.687-173.703 173.156-95.167-.531-173.687-78.536-173.156-173.703.531-95.167 78.536-173.687 173.797-171.922zm9.688 71.875-9.938 13.5c7.385 5.078 14.146 10.844 20.063 17.188 22.667 24.073 34.146 55.589 34.375 93.25l39.219.313-48.531 46.875-47.781-47.594 32.25-.25c-.208-30.918-8.578-55.291-25.063-73.344-6.094-6.469-13.333-12.042-21.625-16.5l-17.531 23.344-31.594-38.281z" />
  </svg>
);

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

      localStorage.setItem("tapCoins", user.balance || 0);
      localStorage.setItem("tapMultiplier", user.multiplier || 1);
      localStorage.setItem("staminaRegenSpeed", user.staminaRegenSpeed || 10000);
      localStorage.setItem("hasTapBot", user.hasTapBot ? "true" : "false");
      localStorage.setItem("isVIP", user.isVIP ? "true" : "false");
    } catch (err) {
      console.error("❌ Failed to fetch user:", err);

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

  // Welcome message (once per user)
  useEffect(() => {
    const isFirst = localStorage.getItem("isNewUser");
    if (!isFirst) {
      toast.success("👋 Welcome to Nakabozoz Tap & Earn!", { duration: 5000 });
      localStorage.setItem("isNewUser", "false");
    }
  }, []);

  // Auto Tap Bot
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

      setStamina((prev) => {
        const updated = Math.max(0, prev - 1);
        localStorage.setItem("stamina", updated);
        return updated;
      });

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
    <div className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 bg-gradient-to-b from-black via-gray-900 to-black text-white">
      
      {/* OpenSea Icon Top-Left */}
      <a
        href="https://opensea.io/collection/nakabozoz-1"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 left-4 z-50"
        aria-label="View on OpenSea"
      >
        <OpenSeaIcon />
      </a>

      <div className="bg-white/10 border border-yellow-500/40 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center relative">
        <h1 className="text-4xl font-extrabold mb-5 tracking-wider text-yellow-400 drop-shadow-lg">
          🚀 Tap & Earn
        </h1>

        <div className="mb-6 space-y-2 text-lg font-semibold">
          <p className="text-gray-300">Balance</p>
          <p className="text-4xl text-yellow-300 drop-shadow-lg">
            {formatCoins(coins)} 🪙
          </p>

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
