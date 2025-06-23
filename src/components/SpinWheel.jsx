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
  const [isVIP, setIsVIP] = useState(false);

  useEffect(() => {
    checkVIPStatus();
  }, []);

  const checkVIPStatus = () => {
    const vipTime = localStorage.getItem("vipTime");
    if (!vipTime) {
      setIsVIP(false);
      return;
    }

    const now = new Date();
    const vipDate = new Date(vipTime);
    const hoursPassed = (now - vipDate) / (1000 * 60 * 60);

    if (hoursPassed > 24) {
      localStorage.removeItem("vipTime");
      setIsVIP(false);
    } else {
      setIsVIP(true);
    }
  };

  const handleSpinClick = () => {
    const lastSpin = localStorage.getItem("lastSpin");
    const now = new Date();

    if (!isVIP) {
      if (lastSpin && now - new Date(lastSpin) < 4 * 60 * 60 * 1000) {
        alert("⏳ Come back after 4 hours or become VIP with Telegram Stars.");
        return;
      }
    }

    localStorage.setItem("lastSpin", now.toISOString());
    const randomIndex = Math.floor(Math.random() * data.length);
    setPrizeNumber(randomIndex);
    setMustSpin(true);
    setResult(null);
  };

  const becomeVIP = () => {
    const confirmVIP = confirm("💎 Buy VIP with Telegram Stars?\n10 Stars = 1 Day Access");
    if (confirmVIP) {
      const now = new Date();
      localStorage.setItem("vipTime", now.toISOString());
      setIsVIP(true);
      alert("✅ You're now VIP! Unlimited spins for 24 hours.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-4">🎡 Spin & Earn</h1>

      {/* VIP Badge */}
      {isVIP && (
        <div className="mb-3 text-sm px-4 py-1 bg-yellow-400 text-black rounded-full font-semibold animate-pulse">
          💎 VIP Active – Unlimited Spins
        </div>
      )}

      {/* Wheel */}
      <div className="w-full flex justify-center">
        <div
          className="w-[280px] sm:w-[320px] md:w-[360px] lg:w-[420px]"
          style={{ maxWidth: "90vw" }}
        >
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={data}
            backgroundColors={["#7c3aed", "#9333ea"]}
            textColors={["#ffffff"]}
            onStopSpinning={() => {
              setMustSpin(false);
              setResult(data[prizeNumber].option);
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

      {/* Spin Button */}
      <button
        onClick={handleSpinClick}
        disabled={mustSpin}
        className={`mt-6 px-8 py-3 bg-purple-700 hover:bg-purple-800 rounded-full text-lg font-bold transition-all ${
          mustSpin ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {mustSpin ? "Spinning..." : "Spin Now"}
      </button>

      {/* Become VIP Button */}
      {!isVIP && (
        <button
          onClick={becomeVIP}
          className="mt-3 px-6 py-2 bg-yellow-400 hover:bg-yellow-300 text-black rounded-full font-bold text-sm"
        >
          🚀 Become VIP with Telegram Stars
        </button>
      )}

      {/* Result */}
      {result && (
        <div className="mt-6 text-2xl font-bold text-green-300 animate-pulse text-center">
          🎉 You got: <span className="text-yellow-400">{result}</span>
        </div>
      )}
    </div>
  );
}
