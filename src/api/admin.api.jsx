const BASE_URL = "https://nakabozoz.onrender.com/api/admin"; // Your backend admin base URL
const ADMIN_KEY = process.env.REACT_APP_ADMIN_KEY; // Set this in your .env file

// 🔐 Common headers with admin key
const getHeaders = () => ({
  "Content-Type": "application/json",
  "x-admin-key": ADMIN_KEY,
});

// 🌐 Helper to handle fetch + standard error checks
const handleRequest = async (url, options = {}) => {
  try {
    const res = await fetch(url, { ...options, headers: getHeaders() });

    const data = await res.json();

    if (!res.ok || !data.success) {
      const message = data.message || "Unknown error";
      throw new Error(message);
    }

    return data;
  } catch (err) {
    console.error("❌ API Request Failed:", err.message);
    throw err;
  }
};

// ✅ Get all users
export async function fetchUsers() {
  const data = await handleRequest(`${BASE_URL}/users`);
  return data.users;
}

// ✅ Get single user
export async function fetchUserById(userId) {
  const data = await handleRequest(`${BASE_URL}/users/${userId}`);
  return data.user;
}

// ✅ Update user
export async function updateUser(userId, updates) {
  const data = await handleRequest(`${BASE_URL}/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return data.user;
}

// ✅ Delete user
export async function deleteUser(userId) {
  const data = await handleRequest(`${BASE_URL}/users/${userId}`, {
    method: "DELETE",
  });
  return data.message;
}
