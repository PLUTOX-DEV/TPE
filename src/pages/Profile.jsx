import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faCoins,
  faBolt,
  faRobot,
  faLink,
  faRocket,
  faUserFriends,
  faCheckCircle,
  faTimesCircle,
  // faCopy,
} from '@fortawesome/free-solid-svg-icons';

export default function Profile() {
  const [coins, setCoins] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [regenSpeed, setRegenSpeed] = useState(10000);
  const [hasTapBot, setHasTapBot] = useState(false);
  const [user, setUser] = useState(null);
  const [refCount, setRefCount] = useState(0);
  const [refEarnings, setRefEarnings] = useState(0);

  useEffect(() => {
    setCoins(parseInt(localStorage.getItem("tapCoins")) || 0);
    setMultiplier(parseInt(localStorage.getItem("tapMultiplier")) || 1);
    setRegenSpeed(parseInt(localStorage.getItem("staminaRegenSpeed")) || 10000);
    setHasTapBot(localStorage.getItem("hasTapBot") === "true");

    const savedUser = JSON.parse(localStorage.getItem("telegramUser"));
    if (savedUser) {
      setUser(savedUser);

      const referrals = JSON.parse(localStorage.getItem("referrals") || "{}");
      const count = referrals[savedUser.username] || 0;
      setRefCount(count);

      const walletKey = `wallet_${savedUser.username}`;
      const earnings = parseInt(localStorage.getItem(walletKey)) || 0;
      setRefEarnings(earnings);
    }
  }, []);

  const referralLink = `https://t.me/Djangotestxr_bot?start=${user?.username || 'your_ref_code'}`;

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

        <div className="space-y-4 text-sm">
          <InfoRow icon={faCoins} label="Coin Balance:" value={`${coins} 🪙`} color="text-green-400" />
          <InfoRow icon={faRocket} label="Tap Multiplier:" value={`x${multiplier}`} color="text-purple-300" />
          <InfoRow icon={faBolt} label="Regen Speed:" value={`${regenSpeed / 1000}s`} color="text-blue-300" />
          <InfoRow
            icon={faRobot}
            label="Tap Bot:"
            value={
              <span className={`flex items-center gap-1 font-bold ${hasTapBot ? 'text-green-400' : 'text-red-400'}`}>
                <FontAwesomeIcon icon={hasTapBot ? faCheckCircle : faTimesCircle} />
                {hasTapBot ? "Owned" : "Not Owned"}
              </span>
            }
          />
          <InfoRow icon={faUserFriends} label="Referred Users:" value={refCount} color="text-yellow-300" />
          <InfoRow icon={faCoins} label="Referral Earnings:" value={`${refEarnings} 🪙`} color="text-yellow-300" />
        </div>

        <div className="mt-6">
          <p className="text-gray-300 mb-1 flex items-center">
            <FontAwesomeIcon icon={faLink} className="text-yellow-400 mr-2" />
            Referral Link:
          </p>
          <code className="bg-gray-800 px-2 py-1 rounded text-sm block text-white break-all">
            {referralLink}
          </code>

          {/* Optional Copy Button
          <button
            className="mt-2 text-xs text-blue-400 hover:underline"
            onClick={() => {
              navigator.clipboard.writeText(referralLink);
              alert("Referral link copied!");
            }}
          >
            <FontAwesomeIcon icon={faCopy} className="mr-1" />
            Copy
          </button> */}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, color = "text-white" }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-300 flex items-center gap-2">
        <FontAwesomeIcon icon={icon} className="text-yellow-400" />
        {label}
      </span>
      <span className={`font-bold ${color}`}>{value}</span>
    </div>
  );
}
