const BASE_URL = "https://nakabozoz.onrender.com/api/admin";
const ADMIN_KEY = process.env.REACT_APP_ADMIN_KEY;

// Helper to build fetch options
const getFetchOptions = (method = "GET", body = null) => {
  const headers = {
    "Content-Type": "application/json",
    "x-admin-key": ADMIN_KEY,
  };

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  return options;
};

// Fetch all users
export async function fetchUsers() {
  const res = await fetch(`${BASE_URL}/users`, getFetchOptions());
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch users");
  return data.users;
}

// Fetch a user by ID
export async function fetchUserById(id) {
  const res = await fetch(`${BASE_URL}/users/${id}`, getFetchOptions());
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch user");
  return data.user;
}

// Update user
export async function updateUser(id, updates) {
  const res = await fetch(`${BASE_URL}/users/${id}`, getFetchOptions("PUT", updates));
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to update user");
  return data.user;
}

// Delete user
export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/users/${id}`, getFetchOptions("DELETE"));
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete user");
  return data.message;
}
console.log("Admin Key:", ADMIN_KEY); // 👈 Check this shows the correct key
