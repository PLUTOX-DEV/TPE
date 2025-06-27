// api/leaderboardApi.js

const BASE_URL = 'http://localhost:5000/api/users'; // change to production URL when ready

export const getReferralLeaderboard = async () => {
  const res = await fetch(`${BASE_URL}/referral-leaderboard`);
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return await res.json();
};
