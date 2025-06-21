import React from 'react';

export default function Profile() {
  return (
    <div className="flex flex-col items-center justify-center h-[85vh] px-4">
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl w-full max-w-sm shadow">
        <h2 className="text-xl font-bold mb-2">👤 My Profile</h2>
        <div className="mb-3">
          <p className="text-gray-300">Username:</p>
          <p className="text-yellow-400 font-semibold">Hakeem</p>
        </div>
        <div className="mb-3">
          <p className="text-gray-300">Coin Balance:</p>
          <p className="text-green-400 font-bold text-lg">350 </p>
        </div>
        <div className="mt-4">
          <p className="text-gray-300">Referral Link:</p>
          <code className="text-white bg-gray-800 px-2 py-1 rounded">https://t.me/yourapp?start=hakeem123</code>
        </div>
      </div>
    </div>
  );
}
