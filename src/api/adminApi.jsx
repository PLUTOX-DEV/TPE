const BASE_URL = "https://nakabozoz.onrender.com/api/admin"; // Your backend admin base URL

// ✅ Use import.meta.env for Vite
const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY;

// 🔐 Build headers with admin key
const getHeaders = () => ({
  "Content-Type": "application/json",
  "x-admin-key": ADMIN_KEY,
});

// 🔁 Reusable request function with error handling
const handleRequest = async (url, options = {}) => {
  try {
    const res = await fetch(url, {
      ...options,
      headers: getHeaders(),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      const msg = data.message || `Request failed: ${res.status}`;
      throw new Error(msg);
    }

    return data;
  } catch (err) {
    console.error("❌ Admin API Error:", err.message);
    throw err;
  }
};

// ✅ Fetch all users
export async function fetchUsers() {
  const data = await handleRequest(`${BASE_URL}/users`);
  return data.users;
}

// ✅ Fetch single user
export async function fetchUserById(userId) {
  const data = await handleRequest(`${BASE_URL}/users/${userId}`);
  return data.user;
}

// ✅ Update a user
export async function updateUser(userId, updates) {
  const data = await handleRequest(`${BASE_URL}/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return data.user;
}

// ✅ Delete a user
export async function deleteUser(userId) {
  const data = await handleRequest(`${BASE_URL}/users/${userId}`, {
    method: "DELETE",
  });
  return data.message;
}
