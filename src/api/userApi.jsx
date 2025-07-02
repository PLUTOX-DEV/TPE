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

// ✅ Login or register user with optional referral
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
        referrer,
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
};

// ✅ Refill stamina (up to 4 times per day)
export const refillStamina = async (telegramId) => {
  const res = await fetch(`${BASE_URL}/refill-stamina`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to refill stamina");
  }
  return await res.json();
};

// ✅ Toggle Tap Bot activation (limit 4 times per day)
export const toggleTapBot = async (telegramId) => {
  const res = await fetch(`${BASE_URL}/toggle-tap-bot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to toggle Tap Bot");
  }
  return await res.json();
};

// ✅ Claim referral manually via username
export const claimReferral = async ({ telegramId, referrerUsername }) => {
  const res = await fetch(`${BASE_URL}/claim-referral`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId, referrerUsername }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to claim referral");
  }

  return await res.json(); // returns updated user
};
