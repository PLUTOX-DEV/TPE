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
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
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

  if (loading)
    return (
      <p className="text-white text-center mt-10" role="status" aria-live="polite">
        Loading users...
      </p>
    );

  if (error)
    return (
      <p className="text-red-500 text-center mt-10" role="alert" aria-live="assertive">
        {error}
      </p>
    );

  if (users.length === 0)
    return (
      <p className="text-yellow-400 text-center mt-10" role="status" aria-live="polite">
        No users found.
      </p>
    );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard - Users</h1>

      <div className="overflow-x-auto">
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
            {users.map(({ _id, telegramId, username, fullName, balance, referralCount, isVIP }) => (
              <tr
                key={_id}
                className="hover:bg-gray-700 transition-colors duration-150"
                tabIndex={0} // Make rows focusable for keyboard users
              >
                <td className="border border-gray-600 p-2 break-words">{telegramId}</td>
                <td className="border border-gray-600 p-2">{username || "—"}</td>
                <td className="border border-gray-600 p-2">{fullName || "—"}</td>
                <td className="border border-gray-600 p-2 text-right">{balance ?? 0}</td>
                <td className="border border-gray-600 p-2 text-right">{referralCount ?? 0}</td>
                <td
                  className={`border border-gray-600 p-2 text-center font-semibold ${
                    isVIP ? "text-green-400" : "text-gray-500"
                  }`}
                >
                  {isVIP ? "Active" : "None"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
  