import React, { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import toast from "react-hot-toast";
import { TonConnectButton } from "@tonconnect/ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faStar,
  faGem,
  faCheckCircle,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

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
  const [showPremium, setShowPremium] = useState(false);

  useEffect(() => {
    const savedTapBalance = parseInt(localStorage.getItem("tapCoins")) || 0;
    setBalance(savedTapBalance);

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

  useEffect(() => {
    localStorage.setItem("tapCoins", balance);
  }, [balance]);

  const handleSpinClick = () => {
    if (!isVIP) {
      const lastSpin = localStorage.getItem("lastSpin");
      const now = new Date();
      if (lastSpin && now - new Date(lastSpin) < 4 * 60 * 60 * 1000) {
        toast.error("⏳ Wait 4 hrs or get Premium with TON.");
        return;
      }
      localStorage.setItem("lastSpin", now.toISOString());
    }

    const randomIndex = Math.floor(Math.random() * data.length);
    setPrizeNumber(randomIndex);
    setMustSpin(true);
    setResult(null);
  };

  const handleReward = (rewardText) => {
    const rewardAmount = parseInt(rewardText.replace(/\D/g, "")) || 0;
    const newBalance = balance + rewardAmount;
    setBalance(newBalance);
    toast.success(`🎉 +${rewardAmount} Coins added to your balance!`);
  };

  const simulateTONPayment = () => {
    const now = new Date();
    localStorage.setItem("vipTime", now.toISOString());
    setIsVIP(true);
    setShowPremium(false);
    toast.success("✅ VIP activated (simulated TON payment)");
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col items-center justify-center py-10">
        <h1 className="text-3xl font-bold text-yellow-400 mb-4 text-center">
          🎡 Spin & Earn
        </h1>

        <div className="text-lg mb-4">
          <FontAwesomeIcon icon={faCoins} className="text-yellow-400 mr-2" />
          Balance: <span className="text-yellow-400">{balance}</span>
        </div>

        {isVIP && (
          <div className="mb-3 text-sm px-4 py-1 bg-yellow-400 text-black rounded-full font-semibold animate-pulse">
            <FontAwesomeIcon icon={faGem} className="mr-1" />
            VIP Active – Unlimited Spins
          </div>
        )}

        <div className="w-full flex justify-center mb-6">
          <div className="w-[300px] max-w-[90vw]">
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
          className={`mb-4 px-8 py-3 bg-purple-700 hover:bg-purple-800 rounded-full text-lg font-bold ${
            mustSpin ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {mustSpin ? "Spinning..." : "Spin Now"}
        </button>

        {!isVIP && (
          <button
            onClick={() => setShowPremium(true)}
            className="mb-2 px-6 py-2 bg-yellow-400 text-black rounded-full font-bold"
          >
            <FontAwesomeIcon icon={faStar} className="mr-2" />
            Get Premium with TON
          </button>
        )}

        {result && (
          <div className="mt-4 text-2xl font-bold text-green-300 animate-pulse text-center">
            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
            You got: <span className="text-yellow-400">{result}</span>
          </div>
        )}
      </div>

      {showPremium && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#111] p-6 rounded-xl text-white max-w-sm w-full text-center">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">
              <FontAwesomeIcon icon={faGem} className="mr-2" />
              Premium Benefits
            </h2>
            <ul className="text-sm space-y-2 mb-4 text-left">
              <li><FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-green-400" /> Unlimited Spins for 24 hrs</li>
              <li><FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-green-400" /> +1000 Bonus Coins</li>
              <li><FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-green-400" /> Future VIP tasks access</li>
            </ul>

            <TonConnectButton className="mb-4" />

            <button
              onClick={simulateTONPayment}
              className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-full font-bold"
            >
              ✅ Simulate Pay 0.1 TON
            </button>

            <button
              onClick={() => setShowPremium(false)}
              className="mt-3 text-center text-gray-400 hover:text-white text-sm flex justify-center items-center w-full"
            >
              <FontAwesomeIcon icon={faCircleXmark} className="mr-1" />
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
