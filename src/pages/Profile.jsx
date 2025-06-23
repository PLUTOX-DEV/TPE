import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faCoins,
  faBolt,
  faRobot,
  faLink,
  faRocket,
} from '@fortawesome/free-solid-svg-icons';

export default function Profile() {
  const [coins, setCoins] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [regenSpeed, setRegenSpeed] = useState(10000);
  const [hasTapBot, setHasTapBot] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setCoins(parseInt(localStorage.getItem("tapCoins")) || 0);
    setMultiplier(parseInt(localStorage.getItem("tapMultiplier")) || 1);
    setRegenSpeed(parseInt(localStorage.getItem("staminaRegenSpeed")) || 10000);
    setHasTapBot(localStorage.getItem("hasTapBot") === "true");

    const savedUser = JSON.parse(localStorage.getItem("telegramUser"));
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl w-full max-w-sm shadow-lg border border-yellow-400/20">
        <div className="flex flex-col items-center mb-4">
          {user?.photo_url && (
            <img
              src={user.photo_url}
              alt="User"
              className="w-20 h-20 rounded-full border-2 border-yellow-400 mb-2"
            />
          )}
          <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
            <FontAwesomeIcon icon={faUser} />
            {user?.first_name} {user?.last_name}
          </h2>
          <p className="text-gray-400">@{user?.username || 'unknown'}</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">
              <FontAwesomeIcon icon={faCoins} className="text-yellow-400 mr-2" />
              Coin Balance:
            </span>
            <span className="text-green-400 font-bold">{coins} 🪙</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-300">
              <FontAwesomeIcon icon={faRocket} className="text-purple-400 mr-2" />
              Tap Multiplier:
            </span>
            <span className="text-purple-300 font-bold">x{multiplier}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-300">
              <FontAwesomeIcon icon={faBolt} className="text-blue-400 mr-2" />
              Regen Speed:
            </span>
            <span className="text-blue-300 font-bold">{regenSpeed / 1000}s</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-300">
              <FontAwesomeIcon icon={faRobot} className="text-green-300 mr-2" />
              Tap Bot:
            </span>
            <span className={hasTapBot ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
              {hasTapBot ? "✅ Owned" : "❌ Not Owned"}
            </span>
          </div>

          <div className="mt-6">
            <p className="text-gray-300 mb-1 flex items-center">
              <FontAwesomeIcon icon={faLink} className="text-yellow-400 mr-2" />
              Referral Link:
            </p>
            <code className="bg-gray-800 px-2 py-1 rounded text-sm block text-white break-all">
              https://t.me/yourapp?start={user?.username || 'your_ref_code'}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
