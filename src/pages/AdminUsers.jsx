import React, { useEffect, useState } from "react";
import { fetchUsers, deleteUser } from "../api/adminApi";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    try {
      const usersData = await fetchUsers();
      setUsers(usersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId);
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading)
    return <p className="text-white text-center mt-10">Loading users...</p>;

  if (error)
    return <p className="text-red-500 text-center mt-10">{error}</p>;

  if (users.length === 0)
    return <p className="text-yellow-400 text-center mt-10">No users found.</p>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard - Users</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-3 border border-gray-700">Telegram ID</th>
              <th className="p-3 border border-gray-700">Username</th>
              <th className="p-3 border border-gray-700">Full Name</th>
              <th className="p-3 border border-gray-700 text-right">Balance</th>
              <th className="p-3 border border-gray-700 text-right">Referrals</th>
              <th className="p-3 border border-gray-700 text-center">VIP</th>
              <th className="p-3 border border-gray-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-gray-700 transition duration-150"
              >
                <td className="p-2 border border-gray-600 break-all">{user.telegramId}</td>
                <td className="p-2 border border-gray-600">{user.username || "—"}</td>
                <td className="p-2 border border-gray-600">{user.fullName || "—"}</td>
                <td className="p-2 border border-gray-600 text-right">{user.balance || 0}</td>
                <td className="p-2 border border-gray-600 text-right">{user.referralCount || 0}</td>
                <td
                  className={`p-2 border border-gray-600 text-center font-bold ${
                    user.isVIP ? "text-green-400" : "text-gray-400"
                  }`}
                >
                  {user.isVIP ? "Yes" : "No"}
                </td>
                <td className="p-2 border border-gray-600 text-center">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
