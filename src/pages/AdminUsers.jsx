import React, { useEffect, useState } from "react";
import { fetchUsers, deleteUser } from "../api/adminApi.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCoins,
  faUserFriends,
  faCheckCircle,
  faTimesCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
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
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );

  if (error)
    return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-8">
        🛠️ Admin Dashboard
      </h1>

      <div className="overflow-x-auto bg-white/5 p-4 rounded-xl shadow-lg border border-gray-800">
        <table className="w-full table-auto text-sm text-white">
          <thead className="bg-gray-800 sticky top-0 z-10">
            <tr>
              <th className="p-3 border-b border-gray-700">
                <FontAwesomeIcon icon={faUser} /> Telegram ID
              </th>
              <th className="p-3 border-b border-gray-700">Username</th>
              <th className="p-3 border-b border-gray-700">Full Name</th>
              <th className="p-3 border-b border-gray-700 text-right">
                <FontAwesomeIcon icon={faCoins} /> Balance
              </th>
              <th className="p-3 border-b border-gray-700 text-right">
                <FontAwesomeIcon icon={faUserFriends} /> Referrals
              </th>
              <th className="p-3 border-b border-gray-700 text-center">VIP</th>
              <th className="p-3 border-b border-gray-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-gray-700 transition duration-150"
              >
                <td className="p-2 border border-gray-700 break-all">
                  {user.telegramId}
                </td>
                <td className="p-2 border border-gray-700">{user.username || "—"}</td>
                <td className="p-2 border border-gray-700">{user.fullName || "—"}</td>
                <td className="p-2 border border-gray-700 text-right">
                  {user.balance || 0}
                </td>
                <td className="p-2 border border-gray-700 text-right">
                  {user.referralCount || 0}
                </td>
                <td className="p-2 border border-gray-700 text-center">
                  {user.isVIP ? (
                    <span className="text-green-400 font-bold">
                      <FontAwesomeIcon icon={faCheckCircle} /> Active
                    </span>
                  ) : (
                    <span className="text-gray-400">
                      <FontAwesomeIcon icon={faTimesCircle} /> None
                    </span>
                  )}
                </td>
                <td className="p-2 border border-gray-700 text-center">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow text-xs"
                  >
                    <FontAwesomeIcon icon={faTrash} /> Delete
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
