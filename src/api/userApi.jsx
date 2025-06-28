const BASE_URL = 'https://nakabozoz.onrender.com/api/users';

// ✅ Get user by Telegram ID
export const getUser = async (telegramId) => {
  const res = await fetch(`${BASE_URL}/${telegramId}`);
  if (!res.ok) throw new Error("Failed to get user");
  return await res.json();
};

// ✅ Update user data
export const updateUser = async (telegramId, updates) => {
  const res = await fetch(`${BASE_URL}/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId, ...updates }),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return await res.json();
};
// ✅ Buy Tap Bot
export const buyTapBot = async (telegramId) => {
  const res = await fetch(`${BASE_URL}/buy-tap-bot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to buy Tap Bot");
  }

  return await res.json(); // returns updated user object
};


// ✅ Login or register user with referral
export async function loginUser(userData) {
  try {
    const { telegramId, username, fullName, referrer = "" } = userData;

    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telegramId,
        username,
        fullName,
        referrer, // ✅ match backend key
      }),
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    return await res.json();
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
}
