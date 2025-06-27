import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faUser } from "@fortawesome/free-solid-svg-icons";
import { getReferralLeaderboard } from "../api/leaderboardApi";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const data = await getReferralLeaderboard();
        setLeaders(data);
      } catch (err) {
        console.error("Error loading leaderboard:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaders();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-4">
      <h1 className="text-center text-2xl font-bold text-yellow-400 mb-6">
        <FontAwesomeIcon icon={faTrophy} className="mr-2" />
        Top Referrers
      </h1>

      {loading ? (
        <p className="text-center text-gray-400">Loading leaderboard...</p>
      ) : leaders.length === 0 ? (
        <p className="text-center text-gray-400">No referrals yet.</p>
      ) : (
        <ul className="space-y-3 max-w-md mx-auto">
  {leaders.map((user, index) => (
    <li
      key={user._id || user.username}
      className="bg-white/10 backdrop-blur-md p-4 rounded-lg flex justify-between items-center shadow border border-yellow-500/10"
    >
      <div className="flex items-center gap-3">
        <span className="text-yellow-300 font-bold text-lg">#{index + 1}</span>
        {user.photo_url ? (
          <img
            src={user.photo_url}
            alt="avatar"
            className="w-10 h-10 rounded-full border border-yellow-400"
          />
        ) : (
          <FontAwesomeIcon icon={faUser} className="text-white" />
        )}
        <div>
          <p className="text-white font-semibold">{user.fullName || "Anonymous"}</p>
          <p className="text-gray-400 text-sm">@{user.username}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-yellow-300 font-bold">{user.referralCount} referrals</p>
      </div>
    </li>
  ))}
</ul>

      )}
    </div>
  );
}
