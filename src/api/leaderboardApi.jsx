// api/leaderboardApi.js
export const getReferralLeaderboard = async () => {
  const res = await fetch("https://nakabozoz.onrender.com/api/users/referral-leaderboard");

  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return await res.json();
};
