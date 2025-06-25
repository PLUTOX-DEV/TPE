import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faUser } from '@fortawesome/free-solid-svg-icons';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("leaderboard")) || [];
    const sorted = users.sort((a, b) => b.coins - a.coins);
    setLeaders(sorted.slice(0, 10)); // Top 10
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-4">
      <h1 className="text-center text-2xl font-bold text-yellow-400 mb-6">
        <FontAwesomeIcon icon={faTrophy} className="mr-2" />
        Leaderboard
      </h1>

      {leaders.length === 0 ? (
        <p className="text-center text-gray-400">No leaderboard data yet.</p>
      ) : (
        <ul className="space-y-3 max-w-md mx-auto">
          {leaders.map((user, index) => (
            <li
              key={user.username}
              className="bg-white/10 backdrop-blur-md p-4 rounded-lg flex justify-between items-center shadow border border-yellow-500/10"
            >
              <div className="flex items-center gap-3">
                <span className="text-yellow-300 font-bold text-lg">#{index + 1}</span>
                <FontAwesomeIcon icon={faUser} className="text-white" />
                <div>
                  <p className="text-white font-semibold">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-gray-400 text-sm">@{user.username}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-bold">{user.coins} 🪙</p>
                <p className="text-yellow-300 text-sm">{user.referrals} referrals</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
