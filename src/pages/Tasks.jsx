import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faTelegram } from "@fortawesome/free-brands-svg-icons";

const TASKS = [
  {
    id: 1,
    action: "Follow us on Twitter",
    reward: 10,
    icon: faTwitter,
    link: "https://twitter.com/yourproject",
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
    link: "https://t.me/yourbot?start=yourrefcode",
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

  const handleVisit = (taskId, link) => {
    window.open(link, "_blank");
    const updated = { ...visitedTasks, [taskId]: true };
    setVisitedTasks(updated);
    localStorage.setItem("visitedTasks", JSON.stringify(updated));
  };

  const handleClaim = (task) => {
    if (!visitedTasks[task.id] || claimedTasks[task.id]) return;

    const updated = { ...claimedTasks, [task.id]: true };
    setClaimedTasks(updated);
    localStorage.setItem("claimedTasks", JSON.stringify(updated));

    const current = parseInt(localStorage.getItem("tapCoins")) || 0;
    localStorage.setItem("tapCoins", current + task.reward);

    alert(`✅ You earned ${task.reward} coins!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black px-4 py-10 text-white">
      <h1 className="text-3xl font-bold text-yellow-400 mb-8 text-center">📋 Tasks & Rewards</h1>

      <div className="space-y-5">
        {TASKS.map((task) => (
          <div
            key={task.id}
            className="bg-white/5 border border-yellow-500/20 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between backdrop-blur-md shadow-xl"
          >
            {/* Task info */}
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <FontAwesomeIcon
                icon={task.icon}
                className="text-yellow-400 text-3xl bg-white/10 p-2 rounded-full"
              />
              <div>
                <h2 className="text-lg font-semibold">{task.action}</h2>
                <p className="text-gray-400 text-sm">Reward: {task.reward} 🪙</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => handleVisit(task.id, task.link)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm rounded-lg font-bold"
              >
                {visitedTasks[task.id] ? "✅ Visited" : "Visit"}
              </button>

              <button
                onClick={() => handleClaim(task)}
                disabled={!visitedTasks[task.id] || claimedTasks[task.id]}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                  claimedTasks[task.id]
                    ? "bg-green-600 cursor-not-allowed"
                    : visitedTasks[task.id]
                    ? "bg-yellow-400 hover:bg-yellow-300 text-black"
                    : "bg-gray-600 cursor-not-allowed"
                }`}
              >
                {claimedTasks[task.id] ? (
                  <>
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-1" /> Claimed
                  </>
                ) : (
                  `Claim +${task.reward}`
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
