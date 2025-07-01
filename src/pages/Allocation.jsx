// import React, { useState } from "react";
// import toast from "react-hot-toast";
// import { FaWallet, FaCheckCircle, FaSpinner } from "react-icons/fa";

// export default function Allocation() {
//   const [wallet, setWallet] = useState("");
//   const [submitted, setSubmitted] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const isValidBaseAddress = (addr) =>
//     /^0x[a-fA-F0-9]{40}$/.test(addr);

//   const handleSubmit = () => {
//     if (!isValidBaseAddress(wallet)) {
//       toast.error("❌ Invalid Base address");
//       return;
//     }

//     setLoading(true);
//     setTimeout(() => {
//       setSubmitted(true);
//       setLoading(false);
//       toast.success("✅ Address submitted. Allocation will be revealed after launch.");
//     }, 1000);
//   };

//   return (
//     <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-10">
//       <div className="bg-white/10 border border-blue-500/30 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center">
//         <div className="flex justify-center mb-6">
//           <div className="w-16 h-16 rounded-full bg-blue-500 animate-pulse shadow-lg flex items-center justify-center">
//             <FaWallet className="text-white text-2xl" />
//           </div>
//         </div>

//         <h1 className="text-3xl font-bold text-blue-400 mb-2">Base Wallet Submission</h1>
//         <p className="text-gray-400 text-sm mb-6">
//           Submit your Base wallet address. Allocation will be announced closer to airdrop launch.
//         </p>

//         {!submitted ? (
//           <>
//             <input
//               type="text"
//               placeholder="Enter Base address"
//               value={wallet}
//               onChange={(e) => setWallet(e.target.value)}
//               className="w-full p-3 rounded-lg bg-gray-900 border border-blue-500/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-white transition"
//             >
//               {loading ? (
//                 <div className="flex items-center justify-center gap-2">
//                   <FaSpinner className="animate-spin" />
//                   Submitting...
//                 </div>
//               ) : (
//                 "Submit Wallet"
//               )}
//             </button>
//           </>
//         ) : (
//           <div className="flex flex-col items-center mt-4">
//             <FaCheckCircle className="text-green-400 text-4xl animate-bounce mb-2" />
//             <p className="text-lg text-green-400 font-semibold mb-1">
//               Wallet Received!
//             </p>
//             <p className="text-sm text-gray-400">
//               Allocation details will be revealed closer to launch.
//             </p>
//             <p className="mt-2 text-xs text-yellow-300 break-all">{wallet}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
