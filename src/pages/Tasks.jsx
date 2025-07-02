import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserFriends,
  faCheckCircle,
  faCheck,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faTelegram } from "@fortawesome/free-brands-svg-icons";
import toast from "react-hot-toast";
import { getUser, updateUser } from "../api/userApi";

// Format numbers like 500k, 1M
const formatReward = (amount) => {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)}k`;
  return amount;
};

const TASKS = [
  {
    id: 1,
    action: "Follow us on Twitter",
    reward: 500000,
    icon: faTwitter,
    link: "https://x.com/Nakabozoz_base?t=OH7zyvR1Yu12kReFRCKqdg&s=09",
  },
  {
    id: 6,
    action: "Follow ALI on X",
    reward: 500000,
    icon: faTwitter,
    link: "https://x.com/ali_inweb3?s=21",
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
    try {
      return JSON.parse(localStorage.getItem("visitedTasks")) || {};
    } catch {
      return {};
    }
  });

  const [claimedTasks, setClaimedTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("claimedTasks")) || {};
    } catch {
      return {};
    }
  });

  const [user, setUser] = useState(null);
  const telegramId = localStorage.getItem("telegramId");

  useEffect(() => {
    async function fetchUser() {
      if (!telegramId) return;
      try {
        const userData = await getUser(telegramId);
        setUser(userData);

        if (userData.claimedTasks) {
          setClaimedTasks(userData.claimedTasks);
          localStorage.setItem("claimedTasks", JSON.stringify(userData.claimedTasks));
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    }

    fetchUser();
  }, [telegramId]);

  const handleVisit = (taskId, link, isReferral = false) => {
    if (isReferral) {
      const refCode = user?.username || telegramId || "your_code";
      const referralLink = `https://t.me/Nakabozoz_bot?start=${refCode}`;

      navigator.clipboard
        .writeText(referralLink)
        .then(() => toast.success("📋 Referral link copied!"))
        .catch(() => toast.error("❌ Failed to copy referral link."));
    } else {
      window.open(link, "_blank");
    }

    const updatedVisited = { ...visitedTasks, [taskId]: true };
    setVisitedTasks(updatedVisited);
    localStorage.setItem("visitedTasks", JSON.stringify(updatedVisited));
  };

  const handleClaim = async (task) => {
    if (!visitedTasks[task.id]) {
      toast.error("Please visit or complete the task first.");
      return;
    }
    if (claimedTasks[task.id]) {
      toast("Task already claimed.");
      return;
    }

    const updatedClaims = { ...claimedTasks, [task.id]: true };
    setClaimedTasks(updatedClaims);
    localStorage.setItem("claimedTasks", JSON.stringify(updatedClaims));

    const currentBalance = parseInt(localStorage.getItem("tapCoins")) || 0;
    const newBalance = currentBalance + task.reward;
    localStorage.setItem("tapCoins", newBalance);

    toast.success(`+${formatReward(task.reward)} 🪙 Claimed!`);

    if (telegramId) {
      try {
        await updateUser(telegramId, {
          claimedTasks: updatedClaims,
          balance: newBalance,
        });
      } catch (err) {
        console.error("Failed to sync claimed tasks to backend:", err);
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

              {/* Buttons */}
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => handleVisit(task.id, task.link, task.isReferral)}
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
                    <>
                      <FontAwesomeIcon icon={faCopy} /> Copy Link
                    </>
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
