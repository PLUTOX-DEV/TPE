import React, { useContext, useEffect, useState } from 'react';
import coinImg from '../assets/coin.jpg';
import { StaminaContext } from '../context/StaminaContext';
import toast from 'react-hot-toast';
import { getUser, updateUser } from '../api/userApi.jsx';

export default function Home() {
  const { stamina, setStamina, maxStamina } = useContext(StaminaContext);

  const [coins, setCoins] = useState(0);
  const [tapping, setTapping] = useState(false);
  const [regenSpeed, setRegenSpeed] = useState(10000);
  const [multiplier, setMultiplier] = useState(1);
  const [hasTapBot, setHasTapBot] = useState(false);
  const [isVIP, setIsVIP] = useState(false);

  const telegramId = localStorage.getItem('telegramId'); // Must be set after Telegram login

  // 🔁 Load user from backend
  useEffect(() => {
    const init = async () => {
      if (!telegramId) return;

      try {
        const user = await getUser(telegramId);
        setCoins(user.balance || 0);
        setIsVIP(user.isVIP || false);

        // Save to localStorage for offline use
        localStorage.setItem('tapCoins', user.balance);
        localStorage.setItem('isVIP', user.isVIP);
      } catch (err) {
        console.error('Failed to load user', err);
      }
    };

    const localCoins = parseInt(localStorage.getItem('tapCoins')) || 0;
    const localRegen = parseInt(localStorage.getItem('staminaRegenSpeed')) || 10000;
    const localMult = parseInt(localStorage.getItem('tapMultiplier')) || 1;
    const localBot = localStorage.getItem('hasTapBot') === 'true';

    setCoins(localCoins);
    setRegenSpeed(localRegen);
    setMultiplier(localMult);
    setHasTapBot(localBot);

    init();
  }, [telegramId]);

  // 🤖 Auto Tap Bot
  useEffect(() => {
    if (!hasTapBot) return;
    const botInterval = setInterval(() => {
      if (stamina > 0) handleTap(true);
    }, 3000);
    return () => clearInterval(botInterval);
  }, [stamina, hasTapBot]);

  const handleTap = (isBot = false) => {
    if (tapping || stamina <= 0) {
      if (!isBot) toast.error("You're out of stamina!");
      return;
    }

    if (!isBot) setTapping(true);

    setTimeout(() => {
      const earned = multiplier;
      const newTotal = coins + earned;
      setCoins(newTotal);

      setStamina(prev => {
        const updated = Math.max(0, prev - 1);
        localStorage.setItem("stamina", updated);
        return updated;
      });

      localStorage.setItem('tapCoins', newTotal);

      if (telegramId) {
        updateUser(telegramId, {
          balance: newTotal,
          isVIP,
          vipExpiresAt: null
        }).catch(err => console.error("Failed to sync:", err));
      }

      if (!isBot) toast.success(`+${earned} 🪙`);
      if (!isBot) setTapping(false);
    }, 200);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[85vh] px-4 bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="bg-white/5 border border-yellow-500/10 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-2 tracking-wide">🚀 Tap & Earn</h1>

        <p className="text-yellow-400 text-xl font-semibold">
          Balance: <span className="text-white">{coins}</span> 🪙
        </p>

        <p className="text-sm mt-1 text-green-400">Multiplier: ×{multiplier}</p>
        <p className="text-sm text-blue-400 mb-2">Stamina: {stamina}/{maxStamina}</p>

        <div className="w-full bg-gray-700 rounded-full h-3 mb-6 overflow-hidden">
          <div
            className="bg-yellow-400 h-full"
            style={{ width: `${(stamina / maxStamina) * 100}%`, transition: 'width 0.3s' }}
          ></div>
        </div>

        <button
          onClick={() => handleTap(false)}
          disabled={tapping || stamina <= 0}
          className={`w-40 h-40 rounded-full overflow-hidden border-4 border-yellow-400 shadow-yellow-400 shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200 bg-black ${
            tapping || stamina <= 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <img
            src={coinImg}
            alt="Tap Coin"
            className={`w-full h-full object-cover ${tapping ? 'animate-ping' : ''}`}
          />
        </button>

        <p className="mt-4 text-sm text-gray-400">
          Tap the coin above to earn more!
        </p>
      </div>
    </div>
  );
}
