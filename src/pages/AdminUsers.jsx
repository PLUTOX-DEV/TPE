import React, { useEffect, useState } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users", {
          headers: {
            "x-admin-key": process.env.REACT_APP_ADMIN_KEY,
          },
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p className="text-white text-center mt-10">Loading users...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard - Users</h1>
      <table className="w-full border-collapse border border-gray-700">
        <thead>
          <tr className="bg-gray-800">
            <th className="border border-gray-600 p-3 text-left">Telegram ID</th>
            <th className="border border-gray-600 p-3 text-left">Username</th>
            <th className="border border-gray-600 p-3 text-left">Full Name</th>
            <th className="border border-gray-600 p-3 text-right">Balance</th>
            <th className="border border-gray-600 p-3 text-right">Referrals</th>
            <th className="border border-gray-600 p-3 text-center">VIP Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-700">
              <td className="border border-gray-600 p-2">{user.telegramId}</td>
              <td className="border border-gray-600 p-2">{user.username || "—"}</td>
              <td className="border border-gray-600 p-2">{user.fullName || "—"}</td>
              <td className="border border-gray-600 p-2 text-right">{user.balance || 0}</td>
              <td className="border border-gray-600 p-2 text-right">{user.referralCount || 0}</td>
              <td className="border border-gray-600 p-2 text-center">{user.isVIP ? "Active" : "None"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
