import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  faCopy,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../context/UserContext";
import toast from "react-hot-toast";

// Format numbers like 1.2k, 3.5M
const formatNumber = (num) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "k";
  return num.toString();
};

export default function Profile() {
  const { user, loadingUser } = useContext(UserContext);

  const referralLink = `https://t.me/Nakabozoz_bot/SpinTPE?start=${
    user?.username || "your_ref_code"
  }`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
  };

  if (loadingUser || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <FontAwesomeIcon icon={faSpinner} spin className="mr-2 text-xl" />
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-6 py-10 bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="bg-gradient-to-tr from-yellow-900/30 to-yellow-700/40 backdrop-blur-lg p-8 rounded-2xl w-full max-w-md shadow-xl border border-yellow-400/40">
        <div className="flex flex-col items-center mb-6">
          {user.photo_url ? (
            <img
              src={user.photo_url}
              alt="User"
              className="w-24 h-24 rounded-full border-4 border-yellow-400 mb-3 shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-yellow-400 mb-3 flex items-center justify-center bg-yellow-900 text-yellow-400 text-5xl font-bold shadow-lg">
              {user.fullName?.[0] || "?"}
            </div>
          )}

          <h2 className="text-2xl font-extrabold text-yellow-400 flex items-center gap-3">
            <FontAwesomeIcon icon={faUser} />
            {user.fullName || "Guest User"}
          </h2>
          <p className="text-gray-400 text-sm italic">@{user.username || "unknown"}</p>
        </div>

        <div className="space-y-5 text-base md:text-lg">
          <InfoRow
            icon={faCoins}
            label="Coin Balance"
            value={`${formatNumber(user.balance)} 🪙`}
            color="text-green-400"
          />
          <InfoRow
            icon={faRocket}
            label="Tap Multiplier"
            value={`x${user.multiplier || 1}`}
            color="text-purple-300"
          />
          <InfoRow
            icon={faBolt}
            label="Regen Speed"
            value={`${((user.staminaRegenSpeed || 10000) / 1000).toFixed(1)}s`}
            color="text-blue-300"
          />
          <InfoRow
            icon={faRobot}
            label="Tap Bot"
            value={
              <span
                className={`flex items-center gap-2 font-semibold ${
                  user.hasTapBot ? "text-green-400" : "text-red-400"
                }`}
              >
                <FontAwesomeIcon icon={user.hasTapBot ? faCheckCircle : faTimesCircle} />
                {user.hasTapBot ? "Owned" : "Not Owned"}
              </span>
            }
          />
          <InfoRow
            icon={faUserFriends}
            label="Referrals"
            value={user.referrals?.length || 0}
            color="text-yellow-300"
          />
          <InfoRow
            icon={faCoins}
            label="Referral Earnings"
            value={`${formatNumber(user.referralEarnings || 0)} 🪙`}
            color="text-yellow-300"
          />
        </div>

        {/* Referral Link Section */}
        <div className="mt-8">
          <p className="text-yellow-400 mb-2 flex items-center font-semibold">
            <FontAwesomeIcon icon={faLink} className="mr-2" />
            Referral Link
          </p>
          <div className="flex items-center gap-3 bg-gray-800 px-3 py-2 rounded-md text-white text-sm break-all select-all shadow-inner">
            <code className="flex-1">{referralLink}</code>
            <button
              onClick={handleCopy}
              title="Copy referral link"
              className="p-1 rounded-md hover:bg-yellow-500/70 transition"
            >
              <FontAwesomeIcon
                icon={faCopy}
                className="text-yellow-400 hover:text-yellow-300"
              />
            </button>
          </div>
        </div>

        {/* Referrals List */}
        {user.referrals?.length > 0 && (
          <div className="mt-8 max-h-40 overflow-y-auto">
            <h3 className="text-yellow-300 text-lg font-bold mb-3">Referred Users</h3>
            <ul className="text-gray-300 space-y-1 text-sm">
              {user.referrals.map((r, idx) => (
                <li key={idx} className="flex items-center gap-2 hover:text-yellow-400 transition">
                  <span>👤</span> <span>{r.username}</span>
                </li>
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
    <div className="flex justify-between items-center border-b border-yellow-600/30 pb-2">
      <span className="text-yellow-400 flex items-center gap-3 font-semibold text-sm md:text-base">
        <FontAwesomeIcon icon={icon} />
        {label}
      </span>
      <span className={`font-extrabold text-lg md:text-xl ${color}`}>{value}</span>
    </div>
  );
}
