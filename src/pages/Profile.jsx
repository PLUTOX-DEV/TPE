import React, { useEffect, useState } from "react";
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
} from "@fortawesome/free-solid-svg-icons";
import { getUser, claimReferral } from "../api/userApi";
import toast from "react-hot-toast";

// Format numbers like 1.5k or 2.1M
const formatNumber = (num) => {
  if (!num) return "0";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "k";
  return num.toString();
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [referralUsername, setReferralUsername] = useState("");
  const [hasClaimed, setHasClaimed] = useState(false);

  const telegramId = localStorage.getItem("telegramId");

  const fetchUser = async () => {
    if (!telegramId) {
      toast.error("Telegram ID not found.");
      setLoading(false);
      return;
    }
    try {
      const data = await getUser(telegramId);
      setUser(data);
      setHasClaimed(!!data.referredBy);
    } catch {
      toast.error("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [telegramId]);

  const shareMessage = `🔥 Join the bot: https://t.me/Nakabozoz_bot\nUse my username: @${user?.username || "your_username"}\nSend it as /start @${user?.username || "your_username"} 🚀`;

  const handleCopy = () => {
    navigator.clipboard
      .writeText(shareMessage)
      .then(() => toast.success("Referral message copied!"))
      .catch(() => toast.error("Failed to copy message."));
  };

  const handleReferralClaim = async (e) => {
    e.preventDefault();
    if (!referralUsername.trim()) {
      toast.error("Please enter a valid username.");
      return;
    }

    try {
      await claimReferral({
        telegramId,
        referrerUsername: referralUsername.trim(),
      });

      setReferralUsername("");
      toast.success("🎉 Referral claimed! You received 500,000 coins.");
      fetchUser(); // Refresh user info
    } catch (err) {
      toast.error(err.message || "Failed to claim referral.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        <p>User not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="bg-yellow-900/30 backdrop-blur-lg p-8 rounded-xl max-w-md w-full border border-yellow-400/40 shadow-xl">
        {/* Avatar & Name */}
        <div className="flex flex-col items-center mb-6">
          {user?.photo_url ? (
            <img
              src={user.photo_url}
              alt="User"
              className="w-24 h-24 rounded-full border-4 border-yellow-400 mb-3"
            />
          ) : (
            <div className="w-24 h-24 rounded-full flex items-center justify-center bg-yellow-900 text-yellow-400 text-4xl font-bold">
              {user?.fullName?.[0] || "?"}
            </div>
          )}
          <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
            <FontAwesomeIcon icon={faUser} />
            {user?.fullName || "Guest User"}
          </h2>
          <p className="text-sm text-gray-400">ID: {user?.telegramId}</p>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <InfoRow icon={faCoins} label="Coin Balance" value={`${formatNumber(user.balance)} 🪙`} color="text-green-400" />
          <InfoRow icon={faRocket} label="Tap Multiplier" value={`x${user.multiplier || 1}`} color="text-purple-300" />
          <InfoRow icon={faBolt} label="Regen Speed" value={`${(user.staminaRegenSpeed || 10000) / 1000}s`} color="text-blue-300" />
          <InfoRow
            icon={faRobot}
            label="Tap Bot"
            value={
              <span className={`flex items-center gap-1 ${user.hasTapBot ? "text-green-400" : "text-red-400"}`}>
                <FontAwesomeIcon icon={user.hasTapBot ? faCheckCircle : faTimesCircle} />
                {user.hasTapBot ? "Owned" : "Not Owned"}
              </span>
            }
          />
          <InfoRow icon={faUserFriends} label="Referrals" value={user.referrals?.length || 0} color="text-yellow-300" />
          <InfoRow icon={faCoins} label="Referral Earnings" value={`${formatNumber(user.referralEarnings || 0)} 🪙`} color="text-yellow-300" />
        </div>

        {/* Invite & Copy */}
        <div className="mt-6">
          <h3 className="text-yellow-300 font-bold mb-2 flex items-center gap-2">
            <FontAwesomeIcon icon={faLink} /> Invite Friends & Earn
          </h3>
          <div className="bg-gray-800 p-3 rounded text-sm text-white">
            <p>Send friends this link 👇</p>
            <p className="text-yellow-300 font-bold">https://t.me/Nakabozoz_bot</p>
            <p className="mt-2">Then tell them to use:</p>
            <p className="text-yellow-300 font-bold">/start @{user?.username || "your_username"}</p>
            <button
              onClick={handleCopy}
              className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faCopy} /> Copy Invite Message
            </button>
          </div>
        </div>

        {/* Claim Referral */}
        {!hasClaimed && (
          <form onSubmit={handleReferralClaim} className="mt-6">
            <h3 className="text-yellow-300 font-bold mb-2">Claim Referral Reward</h3>
            <input
              type="text"
              placeholder="Enter referrer's username"
              value={referralUsername}
              onChange={(e) => setReferralUsername(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 border border-yellow-500 text-white placeholder-gray-400"
            />
            <button
              type="submit"
              className="w-full mt-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded"
            >
              Claim 500,000 Coins 🎁
            </button>
          </form>
        )}

        {/* Referred Users */}
        <div className="mt-6">
          <h3 className="text-yellow-300 font-bold mb-2">Referred Users</h3>
          {user.referrals?.length > 0 ? (
            <ul className="space-y-1 text-sm">
              {user.referrals.map((r, idx) => (
                <li key={idx} className="flex gap-1 text-gray-300">
                  👤 ID:{" "}
                  <span className="text-yellow-300">
                    {r.telegramId || r.username || r.id || "(unknown)"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm italic">No referrals yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, color = "text-white" }) {
  return (
    <div className="flex justify-between items-center border-b border-yellow-600/30 pb-1">
      <span className="flex gap-2 items-center text-yellow-400 font-medium">
        <FontAwesomeIcon icon={icon} /> {label}
      </span>
      <span className={`font-bold ${color}`}>{value}</span>
    </div>
  );
}
