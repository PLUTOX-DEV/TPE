import React, { useEffect, useState } from "react";
import { fetchUsers, deleteUser, updateUser } from "../api/adminApi";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faCrown,
  faTimes,
  faEye,
  faSave,
  faDownload,
  faCoins,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

// ✅ Format coin values to "k"/"M"
const formatCoins = (num) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "k";
  return num;
};

// ✅ Export users as CSV
const exportToCSV = (users) => {
  const headers = ["Telegram ID", "Username", "Full Name", "Balance", "VIP"];
  const rows = users.map((u) => [
    u.telegramId,
    u.username || "—",
    u.fullName || "—",
    u.balance ?? 0,
    u.isVIP ? "Yes" : "No",
  ]);
  const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "users.csv";
  link.click();
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editBalance, setEditBalance] = useState(0);
  const [editIsVIP, setEditIsVIP] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUsers()
      .then((res) => {
        const sorted = res.sort((a, b) => (b.balance || 0) - (a.balance || 0));
        setUsers(sorted);
      })
      .catch((err) => toast.error(err.message));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setEditBalance(user.balance ?? 0);
    setEditIsVIP(user.isVIP ?? false);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    setUpdating(true);
    try {
      const updatedUser = await updateUser(selectedUser._id, {
        balance: Number(editBalance),
        isVIP: editIsVIP,
      });
      toast.success("User updated");
      setUsers((prev) =>
        [...prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))].sort(
          (a, b) => (b.balance || 0) - (a.balance || 0)
        )
      );
      setSelectedUser(updatedUser);
    } catch (err) {
      toast.error("Failed to update: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-4 md:p-10">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-yellow-400">
          <FontAwesomeIcon icon={faUser} className="mr-2" />
          Admin - User Management
        </h1>
        <button
          onClick={() => exportToCSV(users)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white text-sm rounded"
        >
          <FontAwesomeIcon icon={faDownload} className="mr-2" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-800 rounded-lg">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-900 text-gray-300">
            <tr>
              <th className="p-3 text-left">Telegram ID</th>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Balance</th>
              <th className="p-3 text-center">VIP</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u._id}
                className="hover:bg-gray-800 transition cursor-pointer"
                onClick={() => openModal(u)}
              >
                <td className="p-2">{u.telegramId}</td>
                <td className="p-2">{u.username || "—"}</td>
                <td className="p-2 text-yellow-300 font-semibold">
                  <FontAwesomeIcon icon={faCoins} className="mr-1 text-yellow-400" />
                  {formatCoins(u.balance ?? 0)}
                </td>
                <td className="p-2 text-center">
                  {u.isVIP ? (
                    <FontAwesomeIcon icon={faCrown} className="text-yellow-400" />
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(u._id);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-xs px-3 py-1 rounded"
                  >
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full text-white relative shadow-xl">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              aria-label="Close modal"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>

            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-yellow-400">
              <FontAwesomeIcon icon={faEye} />
              Edit User Info
            </h2>

            <div className="space-y-4 text-sm">
              <p>
                <strong>Telegram ID:</strong> {selectedUser.telegramId}
              </p>
              <p>
                <strong>Username:</strong> {selectedUser.username || "—"}
              </p>
              <p>
                <strong>Full Name:</strong> {selectedUser.fullName || "—"}
              </p>

              <div>
                <label className="block mb-1 font-semibold">Balance</label>
                <input
                  type="number"
                  className="w-full rounded bg-gray-800 border border-gray-600 p-2 text-white"
                  value={editBalance}
                  onChange={(e) => setEditBalance(e.target.value)}
                  min={0}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="vipCheckbox"
                  checked={editIsVIP}
                  onChange={(e) => setEditIsVIP(e.target.checked)}
                  className="w-5 h-5 text-yellow-400 focus:ring-yellow-400 border-gray-600 rounded"
                />
                <label htmlFor="vipCheckbox" className="font-semibold">
                  VIP Status
                </label>
              </div>

              <button
                onClick={handleSave}
                disabled={updating}
                className="mt-4 w-full flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 rounded py-2 font-semibold transition disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faSave} />
                {updating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
