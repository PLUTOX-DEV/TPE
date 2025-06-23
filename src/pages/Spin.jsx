import React, { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";

const data = [
  { option: "+0", style: { backgroundColor: "#7c3aed", textColor: "white" } },
  { option: "+10", style: { backgroundColor: "#9333ea", textColor: "white" } },
  { option: "+1000", style: { backgroundColor: "#a855f7", textColor: "white" } },
  { option: "+5000", style: { backgroundColor: "#c084fc", textColor: "white" } },
  { option: "ZERO", style: { backgroundColor: "#facc15", textColor: "#000" } },
  { option: "+10000", style: { backgroundColor: "#f472b6", textColor: "white" } },
  { option: "+15", style: { backgroundColor: "#34d399", textColor: "white" } },
  { option: "+5", style: { backgroundColor: "#60a5fa", textColor: "white" } },
];

export default function Spin() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [result, setResult] = useState(null);
  const [balance, setBalance] = useState(0);
  const [isVIP, setIsVIP] = useState(false);

  // Load balance and VIP status from localStorage
  useEffect(() => {
    const savedBalance = localStorage.getItem("spinCoins");
    if (savedBalance) setBalance(parseInt(savedBalance));

    const vip = localStorage.getItem("vipTime");
    if (vip) {
      const hoursPassed = (new Date() - new Date(vip)) / (1000 * 60 * 60);
      if (hoursPassed <= 24) {
        setIsVIP(true);
      } else {
        localStorage.removeItem("vipTime");
      }
    }
  }, []);

  // Save balance when it changes
  useEffect(() => {
    localStorage.setItem("spinCoins", balance);
  }, [balance]);

  const handleSpinClick = () => {
    if (!isVIP) {
      const lastSpin = localStorage.getItem("lastSpin");
      const now = new Date();
      if (lastSpin && now - new Date(lastSpin) < 4 * 60 * 60 * 1000) {
        alert("⏳ Come back in 4 hours or become VIP with Telegram Stars.");
        return;
      }
      localStorage.setItem("lastSpin", now.toISOString());
    }

    const randomIndex = Math.floor(Math.random() * data.length);
    setPrizeNumber(randomIndex);
    setMustSpin(true);
    setResult(null);
  };

  const becomeVIP = () => {
    const confirmVIP = window.confirm("💎 Buy VIP with Telegram Stars?\n10 Stars = 1 Day Access");
    if (confirmVIP) {
      const now = new Date();
      localStorage.setItem("vipTime", now.toISOString());
      setIsVIP(true);
      alert("✅ You're now VIP! Unlimited spins for 24 hours.");
    }
  };

  const handleReward = (rewardText) => {
    const rewardAmount = parseInt(rewardText.replace(/\D/g, "")) || 0;
    const newBalance = balance + rewardAmount;
    setBalance(newBalance);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2 text-center">
        🎡 Spin & Earn
      </h1>

      <div className="text-lg font-semibold mb-4 text-white">
        🪙 Balance: <span className="text-yellow-400">{balance} Coins</span>
      </div>

      {isVIP && (
        <div className="mb-3 text-sm px-4 py-1 bg-yellow-400 text-black rounded-full font-semibold animate-pulse">
          💎 VIP Active – Unlimited Spins
        </div>
      )}

      <div className="w-full flex justify-center">
        <div className="w-[280px] sm:w-[320px] md:w-[360px] lg:w-[420px]" style={{ maxWidth: "90vw" }}>
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={data}
            backgroundColors={["#7c3aed", "#9333ea"]}
            textColors={["#ffffff"]}
            onStopSpinning={() => {
              setMustSpin(false);
              const reward = data[prizeNumber].option;
              setResult(reward);
              handleReward(reward);
            }}
            radiusLineWidth={1}
            innerRadius={15}
            outerBorderColor={"#facc15"}
            outerBorderWidth={10}
            radiusLineColor={"#000"}
            fontSize={16}
          />
        </div>
      </div>

      <button
        onClick={handleSpinClick}
        disabled={mustSpin}
        className={`mt-6 px-8 py-3 bg-purple-700 hover:bg-purple-800 rounded-full text-lg font-bold transition-all ${
          mustSpin ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {mustSpin ? "Spinning..." : "Spin Now"}
      </button>

      {!isVIP && (
        <button
          onClick={becomeVIP}
          className="mt-3 px-6 py-2 bg-yellow-400 hover:bg-yellow-300 text-black rounded-full font-bold text-sm"
        >
          🚀 Become VIP with Telegram Stars
        </button>
      )}

      {result && (
        <div className="mt-6 text-2xl font-bold text-green-300 animate-pulse text-center">
          🎉 You got: <span className="text-yellow-400">{result}</span>
        </div>
      )}
    </div>
  );
}
