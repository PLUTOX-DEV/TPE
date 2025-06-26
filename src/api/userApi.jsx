const BASE_URL = 'http://localhost:5000/api/users'; // or your production URL

// Get user by telegramId

export const getUser = async (telegramId) => {
  const res = await fetch(`${BASE_URL}/${telegramId}`);
  if (!res.ok) throw new Error("Failed to get user");
  return await res.json();
};

export const updateUser = async (telegramId, updates) => {
  const res = await fetch(`${BASE_URL}/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId, ...updates }),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return await res.json();
};


// Login user
export async function loginUser(userData) {
  try {
    const { telegramId, username, fullName, referrer = "" } = userData;

    const res = await fetch(`${BASE_URL}/login?ref=${referrer}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, username, fullName }),
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
