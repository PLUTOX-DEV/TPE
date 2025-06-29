import React, { useContext, useEffect, useState } from 'react';
import coinImg from '../assets/image.jpg';
import { StaminaContext } from '../context/StaminaContext';
import toast from 'react-hot-toast';
import { getUser, updateUser } from '../api/userApi';

export default function Home() {
  const { stamina, setStamina, maxStamina } = useContext(StaminaContext);

  const [coins, setCoins] = useState(0);
  const [tapping, setTapping] = useState(false);
  const [regenSpeed, setRegenSpeed] = useState(10000);
  const [multiplier, setMultiplier] = useState(1);
  const [hasTapBot, setHasTapBot] = useState(false);
  const [isVIP, setIsVIP] = useState(false);

  const telegramId = localStorage.getItem('telegramId');

  useEffect(() => {
    const loadUser = async () => {
      if (!telegramId) return;

      try {
        const user = await getUser(telegramId);

        setCoins(user.balance || 0);
        setMultiplier(user.multiplier || 1);
        setRegenSpeed(user.staminaRegenSpeed || 10000);
        setHasTapBot(user.hasTapBot || false);
        setIsVIP(user.isVIP || false);

        localStorage.setItem('tapCoins', user.balance || 0);
        localStorage.setItem('tapMultiplier', user.multiplier || 1);
        localStorage.setItem('staminaRegenSpeed', user.staminaRegenSpeed || 10000);
        localStorage.setItem('hasTapBot', user.hasTapBot ? 'true' : 'false');
        localStorage.setItem('isVIP', user.isVIP || false);
      } catch (err) {
        console.error('❌ Failed to fetch user from backend:', err);

        setCoins(parseInt(localStorage.getItem('tapCoins')) || 0);
        setRegenSpeed(parseInt(localStorage.getItem('staminaRegenSpeed')) || 10000);
        setMultiplier(parseInt(localStorage.getItem('tapMultiplier')) || 1);
        setHasTapBot(localStorage.getItem('hasTapBot') === 'true');
      }
    };

    loadUser();
  }, [telegramId]);

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
      localStorage.setItem('tapCoins', newTotal);

      setStamina(prev => {
        const updated = Math.max(0, prev - 1);
        localStorage.setItem("stamina", updated);
        return updated;
      });

      if (telegramId) {
        try {
          await updateUser(telegramId, { balance: newTotal, isVIP });
        } catch (err) {
          console.error('❌ Backend sync failed:', err);
        }
      }

      if (!isBot) toast.success(`+${earned} 🪙`);
      if (!isBot) setTapping(false);
    }, 200);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="bg-white/5 border border-yellow-500/20 backdrop-blur-lg p-6 rounded-2xl shadow-xl w-full max-w-sm text-center relative">
        <h1 className="text-3xl font-bold mb-3 tracking-wide text-yellow-300">🚀 Tap & Earn</h1>

        <div className="mb-3 text-lg">
          <p className="text-gray-300">Balance:</p>
          <p className="text-2xl font-bold text-yellow-400">{coins} 🪙</p>
          <p className="text-sm text-green-400">Multiplier: ×{multiplier}</p>
          <p className="text-sm text-blue-400">Stamina: {stamina}/{maxStamina}</p>
        </div>

        <div className="w-full bg-gray-800 rounded-full h-3 mb-6 overflow-hidden">
          <div
            className="bg-yellow-400 h-full transition-all duration-300"
            style={{ width: `${(stamina / maxStamina) * 100}%` }}
          />
        </div>

        <button
          onClick={() => handleTap(false)}
          disabled={tapping || stamina <= 0}
          className={`w-40 h-40 rounded-full border-4 border-yellow-400 relative transition-all duration-200 ${
            tapping || stamina <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95 shadow-yellow-400 shadow-xl'
          }`}
        >
          <img
            src={coinImg}
            alt="Tap Coin"
            className={`w-full h-full object-cover rounded-full ${
              tapping ? 'animate-pingOnce' : ''
            }`}
          />
          <div className="absolute inset-0 rounded-full animate-pulse bg-yellow-400/10" />
        </button>

        <p className="mt-4 text-sm text-gray-400">Tap the coin to earn tokens!</p>
      </div>
    </div>
  );
}
