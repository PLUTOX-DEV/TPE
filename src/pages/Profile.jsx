import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faCoins, faBolt, faRobot, faLink,
  faRocket, faUserFriends, faCheckCircle, faTimesCircle, faCopy
} from '@fortawesome/free-solid-svg-icons';
import { getUser } from "../api/userApi";
import toast from 'react-hot-toast'; // ✅ Import toast

export default function Profile() {
  const [user, setUser] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [coins, setCoins] = useState(0);
  const [refEarnings, setRefEarnings] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [regenSpeed, setRegenSpeed] = useState(10000);
  const [hasTapBot, setHasTapBot] = useState(false);

  useEffect(() => {
    const telegramId = localStorage.getItem("telegramId");
    if (!telegramId) return;

    getUser(telegramId)
      .then(data => {
        setUser(data);
        setCoins(data.balance);
        setRefEarnings(data.referralEarnings || 0);
        setReferrals(data.referrals || []);
        setMultiplier(data.multiplier || 1);
        setRegenSpeed(data.staminaRegenSpeed || 10000);
        setHasTapBot(data.hasTapBot || false);
      })
      .catch(err => console.error("Failed to fetch user", err));
  }, []);

  const referralLink = `https://t.me/Djangotestxr_bot?start=${user?.username || "your_ref_code"}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
  };

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
            {user?.fullName}
          </h2>
          <p className="text-gray-400">@{user?.username}</p>
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
          <InfoRow icon={faUserFriends} label="Referrals:" value={referrals.length} color="text-yellow-300" />
          <InfoRow icon={faCoins} label="Referral Earnings:" value={`${refEarnings} 🪙`} color="text-yellow-300" />
        </div>

        {/* Referral Link with Copy Button */}
        <div className="mt-6">
          <p className="text-gray-300 mb-1 flex items-center">
            <FontAwesomeIcon icon={faLink} className="text-yellow-400 mr-2" />
            Referral Link:
          </p>
          <div className="flex items-center gap-2 bg-gray-800 px-2 py-1 rounded text-sm text-white">
            <code className="flex-1 break-all">{referralLink}</code>
            <button onClick={handleCopy} title="Copy link">
              <FontAwesomeIcon icon={faCopy} className="text-yellow-400 hover:text-yellow-300" />
            </button>
          </div>
        </div>

        {referrals.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold text-yellow-300 mb-2">Referred Users:</h3>
            <ul className="text-sm space-y-1">
              {referrals.map((r, idx) => (
                <li key={idx} className="text-gray-300">👤 {r.username}</li>
              ))}
            </ul>
          </div>
        )}
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
