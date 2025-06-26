const BASE_URL = 'http://localhost:5000/api/users'; // or your production URL

// Get user by telegramId
export async function getUser(telegramId) {
  try {
    const response = await fetch(`${BASE_URL}/${telegramId}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return await response.json();
  } catch (err) {
    console.error('Failed to get user:', err);
    throw err;
  }
}

// Update user data
export async function updateUser(telegramId, updates) {
  try {
    const response = await fetch(`${BASE_URL}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ telegramId, ...updates }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to update user:", err);
    throw err;
  }
}

// Login user
export async function loginUser(userData) {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
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
