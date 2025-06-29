import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserFriends,
  faCheckCircle,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faTelegram } from "@fortawesome/free-brands-svg-icons";
import toast from "react-hot-toast";

// Tasks definition
const TASKS = [
  {
    id: 1,
    action: "Follow us on Twitter",
    reward: 10,
    icon: faTwitter,
    link: "https://x.com/Nakabozoz_base?t=OH7zyvR1Yu12kReFRCKqdg&s=09",
  },
  {
    id: 2,
    action: "Join Telegram Group",
    reward: 8,
    icon: faTelegram,
    link: "https://t.me/yourprojectgroup",
  },
  {
    id: 3,
    action: "Refer a Friend",
    reward: 20,
    icon: faUserFriends,
    isReferral: true, // ✅ Flag for referral
  },
];

export default function Tasks() {
  const [visitedTasks, setVisitedTasks] = useState(() => {
    const saved = localStorage.getItem("visitedTasks");
    return saved ? JSON.parse(saved) : {};
  });

  const [claimedTasks, setClaimedTasks] = useState(() => {
    const saved = localStorage.getItem("claimedTasks");
    return saved ? JSON.parse(saved) : {};
  });

  // Handle Visit or Referral Copy
  const handleVisit = (taskId, link, isReferral = false) => {
    if (isReferral) {
      const user = JSON.parse(localStorage.getItem("telegramUser"));
      const username = user?.username || "yourrefcode";
      const referralLink = `https://t.me/Nakabozobot/SpinTPE?start=${username}`;

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

  // Claim reward after task visit
  const handleClaim = (task) => {
    if (!visitedTasks[task.id] || claimedTasks[task.id]) return;

    const updated = { ...claimedTasks, [task.id]: true };
    setClaimedTasks(updated);
    localStorage.setItem("claimedTasks", JSON.stringify(updated));

    const current = parseInt(localStorage.getItem("tapCoins")) || 0;
    localStorage.setItem("tapCoins", current + task.reward);

    toast.success(`+${task.reward} 🪙 Coins Claimed!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black px-4 py-10 text-white">
      <h1 className="text-3xl font-bold text-yellow-400 mb-8 text-center">
        📋 Tasks & Rewards
      </h1>

      <div className="space-y-5">
        {TASKS.map((task) => {
          const isVisited = visitedTasks[task.id];
          const isClaimed = claimedTasks[task.id];

          return (
            <div
              key={task.id}
              className="bg-white/5 border border-yellow-400/30 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between backdrop-blur-sm shadow-md transition-all"
            >
              {/* Left Section */}
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <FontAwesomeIcon
                  icon={task.icon}
                  className="text-yellow-400 text-3xl bg-white/10 p-2 rounded-full"
                />
                <div>
                  <h2 className="text-lg font-semibold">{task.action}</h2>
                  <p className="text-gray-400 text-sm">
                    Reward:{" "}
                    <span className="text-yellow-300">{task.reward} 🪙</span>
                  </p>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleVisit(task.id, task.link, task.isReferral)}
                  disabled={isVisited}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                    isVisited
                      ? "bg-green-600 cursor-not-allowed opacity-60"
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
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                    isClaimed
                      ? "bg-green-500 opacity-60 cursor-not-allowed"
                      : isVisited
                      ? "bg-yellow-400 hover:bg-yellow-300 text-black"
                      : "bg-gray-600 cursor-not-allowed"
                  }`}
                >
                  {isClaimed ? (
                    <>
                      <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                      Claimed
                    </>
                  ) : (
                    `Claim +${task.reward}`
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
