// src/api/adminApi.js

const BASE_URL = "https://nakabozoz.onrender.com/api";

export async function fetchAdminUsers() {
  try {
    const response = await fetch(`${BASE_URL}/admin/users`, {
      headers: {
        "x-admin-key": process.env.REACT_APP_ADMIN_KEY, // Make sure this is set in your .env file
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch admin users:", error);
    throw error;
  }
}
