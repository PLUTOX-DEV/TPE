const BASE_URL = "https://nakabozoz.onrender.com/api/admin";
const ADMIN_KEY = "my_super_secret_key"; // Same key as in backend

const getHeaders = () => ({
  "Content-Type": "application/json",
  "x-admin-key": ADMIN_KEY,
});

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

export async function fetchUsers() {
  const data = await handleRequest(`${BASE_URL}/users`);
  return data.users;
}

export async function fetchUserById(userId) {
  const data = await handleRequest(`${BASE_URL}/users/${userId}`);
  return data.user;
}

export async function updateUser(userId, updates) {
  const data = await handleRequest(`${BASE_URL}/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return data.user;
}

export async function deleteUser(userId) {
  const data = await handleRequest(`${BASE_URL}/users/${userId}`, {
    method: "DELETE",
  });
  return data.message;
}
