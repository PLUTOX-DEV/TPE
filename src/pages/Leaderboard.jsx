import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faUser, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { getReferralLeaderboard } from "../api/leaderboardApi";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const data = await getReferralLeaderboard();
        setLeaders(data || []);
      } catch (err) {
        console.error("Error loading leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-4">
      <h1 className="text-center text-3xl font-bold text-yellow-400 mb-6 tracking-wide flex justify-center items-center gap-2">
        <FontAwesomeIcon icon={faTrophy} />
        Top Referrers
      </h1>

      {loading ? (
        <div className="flex justify-center items-center mt-10 text-gray-400">
          <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
          Loading leaderboard...
        </div>
      ) : leaders.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">No referrals yet. Be the first!</p>
      ) : (
        <ul className="space-y-4 max-w-md mx-auto">
          {leaders.map((user, index) => (
            <li
              key={user._id || user.username || index}
              className="bg-white/10 backdrop-blur-lg p-4 rounded-lg flex justify-between items-center shadow border border-yellow-400/20"
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
                  <div className="w-10 h-10 rounded-full bg-yellow-800 flex items-center justify-center text-yellow-300 text-sm font-bold">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                )}
                <div>
                  <p className="text-white font-semibold text-sm">
                    {user.fullName || "Anonymous"}
                  </p>
                  <p className="text-gray-400 text-xs">@{user.username || "unknown"}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-yellow-300 font-bold text-sm">
                  {user.referralCount} referrals
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
