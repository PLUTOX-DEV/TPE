import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserFriends,
  faCheckCircle,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faTelegram } from "@fortawesome/free-brands-svg-icons";
import toast from "react-hot-toast";
import { getUser, updateUser } from "../api/userApi";

// Format number to show "k" for thousands
const formatReward = (amount) => {
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)}k`;
  return amount;
};

// Task definitions
const TASKS = [
  {
    id: 1,
    action: "Follow us on Twitter",
    reward: 500000,
    icon: faTwitter,
    link: "https://x.com/Nakabozoz_base?t=OH7zyvR1Yu12kReFRCKqdg&s=09",
  },
  {
    id: 3,
    action: "Join Telegram Channel",
    reward: 500000,
    icon: faTelegram,
    link: "https://t.me/nakabozozanounce",
  },
  {
    id: 4,
    action: "Join Telegram Chat Group",
    reward: 100000,
    icon: faTelegram,
    link: "https://t.me/+4pBxOFMdzbFhYTY0",
  },
  {
    id: 5,
    action: "Refer a Friend",
    reward: 20,
    icon: faUserFriends,
    isReferral: true,
  },
];

export default function Tasks() {
  const [visitedTasks, setVisitedTasks] = useState(() => {
    const saved = localStorage.getItem("visitedTasks");
    return saved ? JSON.parse(saved) : {};
  });

  const [claimedTasks, setClaimedTasks] = useState({});
  const telegramId = localStorage.getItem("telegramId");

  useEffect(() => {
    const fetchUser = async () => {
      if (!telegramId) return;
      try {
        const user = await getUser(telegramId);
        const claimed = user.claimedTasks || {};
        setClaimedTasks(claimed);
        localStorage.setItem("claimedTasks", JSON.stringify(claimed));
      } catch (err) {
        console.error("❌ Failed to fetch claimed tasks:", err);
      }
    };
    fetchUser();
  }, [telegramId]);

  const handleVisit = (taskId, link, isReferral = false) => {
    if (isReferral) {
      const user = JSON.parse(localStorage.getItem("telegramUser"));
      const username = user?.username || "yourrefcode";
      const referralLink = `https://t.me/Nakabozoz_bot/SpinTPE?start=${username}`;
      navigator.clipboard
        .writeText(referralLink)
        .then(() => toast.success("📋 Referral link copied!"))
        .catch(() => toast.error("❌ Failed to copy link."));
    } else {
      window.open(link, "_blank");
    }

    const updated = { ...visitedTasks, [taskId]: true };
    setVisitedTasks(updated);
    localStorage.setItem("visitedTasks", JSON.stringify(updated));
  };

  const handleClaim = async (task) => {
    if (!visitedTasks[task.id] || claimedTasks[task.id]) return;

    const updated = { ...claimedTasks, [task.id]: true };
    setClaimedTasks(updated);
    localStorage.setItem("claimedTasks", JSON.stringify(updated));

    const current = parseInt(localStorage.getItem("tapCoins")) || 0;
    const newBalance = current + task.reward;
    localStorage.setItem("tapCoins", newBalance);

    toast.success(`+${formatReward(task.reward)} 🪙 Claimed!`);

    if (telegramId) {
      try {
        await updateUser(telegramId, {
          claimedTasks: updated,
          balance: newBalance,
        });
      } catch (err) {
        console.error("❌ Failed to sync task to backend:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black px-4 py-12 text-white">
      <h1 className="text-4xl font-bold text-yellow-400 mb-10 text-center drop-shadow-lg">
        🧾 Complete Tasks — Earn Rewards
      </h1>

      <div className="space-y-6 max-w-3xl mx-auto">
        {TASKS.map((task) => {
          const isVisited = visitedTasks[task.id];
          const isClaimed = claimedTasks[task.id];

          return (
            <div
              key={task.id}
              className="bg-white/5 border border-yellow-500/20 hover:border-yellow-400 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between shadow-md backdrop-blur-lg transition-all duration-200"
            >
              {/* Task Info */}
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <FontAwesomeIcon
                  icon={task.icon}
                  className="text-yellow-300 text-3xl bg-white/10 p-3 rounded-full"
                />
                <div>
                  <h2 className="text-lg font-semibold mb-1">{task.action}</h2>
                  <span className="text-sm bg-yellow-400 text-black font-bold px-3 py-1 rounded-full">
                    +{formatReward(task.reward)} 🪙
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() =>
                    handleVisit(task.id, task.link, task.isReferral)
                  }
                  disabled={isVisited}
                  className={`px-5 py-2 rounded-full font-semibold text-sm shadow-md transition-transform duration-150 transform active:scale-95 flex items-center gap-2 ${
                    isVisited
                      ? "bg-green-600 opacity-60 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isVisited ? (
                    <>
                      <FontAwesomeIcon icon={faCheck} /> Visited
                    </>
                  ) : task.isReferral ? (
                    "Copy Link"
                  ) : (
                    "Visit"
                  )}
                </button>

                <button
                  onClick={() => handleClaim(task)}
                  disabled={!isVisited || isClaimed}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-transform duration-150 transform active:scale-95 ${
                    isClaimed
                      ? "bg-green-500 opacity-60 cursor-not-allowed"
                      : isVisited
                      ? "bg-yellow-400 text-black hover:bg-yellow-300"
                      : "bg-gray-600 cursor-not-allowed"
                  }`}
                >
                  {isClaimed ? (
                    <span className="flex items-center">
                      <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                      Claimed
                    </span>
                  ) : (
                    `Claim +${formatReward(task.reward)}`
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
