import React, { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import toast from "react-hot-toast";
import { useTonConnectUI, TonConnectButton } from "@tonconnect/ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faStar,
  faGem,
  faCheckCircle,
  faCircleXmark,
  faWallet,
  faClock,
  faSpinner,
  faMedal,
  faRepeat,
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

// Map packages to spins per day
const PACKAGE_SPINS = {
  free: 1,
  bronze: 3,
  silver: 5,
  gold: 7,
};

export default function Spin() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [result, setResult] = useState(null);
  const [balance, setBalance] = useState(0);

  // package: 'free' | 'bronze' | 'silver' | 'gold'
  const [packageType, setPackageType] = useState("free");

  // spins used today
  const [spinsUsed, setSpinsUsed] = useState(0);

  const [showPremium, setShowPremium] = useState(false);
  const [tonConnectUI] = useTonConnectUI();

  // Helper: get today's date string (yyyy-mm-dd)
  const todayStr = () => new Date().toISOString().split("T")[0];

  useEffect(() => {
    const savedTapBalance = parseInt(localStorage.getItem("tapCoins")) || 0;
    setBalance(savedTapBalance);

    // Load package info and spins used
    const savedPackage = localStorage.getItem("packageType") || "free";
    const savedSpinsUsed = parseInt(localStorage.getItem("spinsUsed")) || 0;
    const savedSpinsDate = localStorage.getItem("spinsDate");

    // Reset spins if date changed
    if (savedSpinsDate !== todayStr()) {
      setSpinsUsed(0);
      localStorage.setItem("spinsUsed", "0");
      localStorage.setItem("spinsDate", todayStr());
    } else {
      setSpinsUsed(savedSpinsUsed);
    }

    setPackageType(savedPackage);
  }, []);

  useEffect(() => {
    localStorage.setItem("tapCoins", balance);
  }, [balance]);

  // Call this when a spin is used
  const incrementSpinUsed = () => {
    const newCount = spinsUsed + 1;
    setSpinsUsed(newCount);
    localStorage.setItem("spinsUsed", newCount.toString());
    localStorage.setItem("spinsDate", todayStr());
  };

  const handleSpinClick = () => {
    // Check spins left
    const maxSpins = PACKAGE_SPINS[packageType] || 1;
    if (spinsUsed >= maxSpins) {
      if (packageType === "free") {
        toast.error(
          <>
            <FontAwesomeIcon icon={faClock} className="mr-2" />
            Free users get 1 spin per day. Get Premium for more spins.
          </>
        );
      } else {
        toast.error(
          <>
            <FontAwesomeIcon icon={faClock} className="mr-2" />
            You've used all your {maxSpins} spins today.
          </>
        );
      }
      return;
    }

    const randomIndex = Math.floor(Math.random() * data.length);
    setPrizeNumber(randomIndex);
    setMustSpin(true);
    setResult(null);

    // Count spin usage
    incrementSpinUsed();
  };

  const handleReward = (rewardText) => {
    const rewardAmount = parseInt(rewardText.replace(/\D/g, "")) || 0;
    const newBalance = balance + rewardAmount;
    setBalance(newBalance);
    toast.success(
      <>
        <FontAwesomeIcon icon={faCoins} className="mr-2" />
        +{rewardAmount} Coins added!
      </>
    );
  };

  // Payment packages config
  const PACKAGES = {
    bronze: { label: "Bronze", priceTON: "0.02", spins: 3 },
    silver: { label: "Silver", priceTON: "0.035", spins: 5 },
    gold: { label: "Gold", priceTON: "0.05", spins: 7 },
  };

  // Handle purchase via TON payment
  const handleBuyPackage = async (pack) => {
    try {
      const recipientAddress = "UQABNds6e6LqY3ogKL7MbwHozMPIQBy347g3_0Q-t9WPdZXo"; // Replace with your TON wallet
      const nanoTON = (parseFloat(PACKAGES[pack].priceTON) * 1e9).toString();

      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: recipientAddress,
            amount: nanoTON,
          },
        ],
      });

      // On success, update package & reset spins used
      setPackageType(pack);
      setSpinsUsed(0);
      localStorage.setItem("packageType", pack);
      localStorage.setItem("spinsUsed", "0");
      localStorage.setItem("spinsDate", todayStr());

      toast.success(
        <>
          <FontAwesomeIcon icon={faGem} className="mr-2" />
          {PACKAGES[pack].label} package activated – {PACKAGES[pack].spins} spins/day!
        </>
      );
      setShowPremium(false);
    } catch (err) {
      console.error(err);
      toast.error("❌ TON payment failed or cancelled.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col items-center py-10 text-center">
        <h1 className="text-3xl font-bold text-yellow-400 mb-4">🎡 Spin & Earn</h1>

        <div className="text-lg mb-4">
          <FontAwesomeIcon icon={faCoins} className="text-yellow-400 mr-2" />
          Balance: <span className="text-yellow-400">{balance}</span>
        </div>

        <div className="mb-2">
          Package:{" "}
          <span className="text-yellow-400 font-semibold capitalize">{packageType}</span> |{" "}
          Spins used today: {spinsUsed} / {PACKAGE_SPINS[packageType] || 1}
        </div>

        <div className="w-[300px] sm:w-[320px] max-w-[90vw] mb-6">
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

        <button
          onClick={handleSpinClick}
          disabled={mustSpin}
          className={`mb-4 px-8 py-3 bg-purple-700 hover:bg-purple-800 rounded-full text-lg font-bold flex items-center justify-center ${
            mustSpin ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {mustSpin ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
              Spinning...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faCoins} className="mr-2" />
              Spin Now
            </>
          )}
        </button>

        {packageType === "free" && (
          <button
            onClick={() => setShowPremium(true)}
            className="mb-2 px-6 py-2 bg-yellow-400 text-black rounded-full font-bold flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faStar} className="mr-2" />
            Get Premium with TON
          </button>
        )}

        {result && (
          <div className="mt-4 text-2xl font-bold text-green-300 animate-pulse">
            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
            You got: <span className="text-yellow-400">{result}</span>
          </div>
        )}
      </div>

      {/* Modal */}
      {showPremium && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#111] p-6 rounded-xl text-white max-w-sm w-full text-center">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">
              <FontAwesomeIcon icon={faGem} className="mr-2" />
              Premium Packages
            </h2>
            <ul className="text-sm space-y-4 mb-4 text-left">
              {Object.entries(PACKAGES).map(([key, pack]) => {
                const medalColors = {
                  bronze: "#cd7f32",
                  silver: "#c0c0c0",
                  gold: "#ffd700",
                };
                return (
                  <li key={key} className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon
                        icon={faMedal}
                        style={{ color: medalColors[key] }}
                        size="lg"
                      />
                      <span className="font-semibold">{pack.label}</span>
                      <span className="flex items-center ml-4 text-yellow-400">
                        <FontAwesomeIcon icon={faRepeat} className="mr-1" />
                        {pack.spins} spins/day
                      </span>
                      <span className="flex items-center ml-4 text-green-400">
                        <FontAwesomeIcon icon={faWallet} className="mr-1" />
                        {pack.priceTON} TON
                      </span>
                    </div>

                    <button
                      onClick={() => handleBuyPackage(key)}
                      className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded-full font-bold text-sm flex items-center"
                    >
                      Buy
                    </button>
                  </li>
                );
              })}
            </ul>

            <button
              onClick={() => setShowPremium(false)}
              className="mt-3 text-gray-400 hover:text-white text-sm flex justify-center items-center w-full"
            >
              <FontAwesomeIcon icon={faCircleXmark} className="mr-2" />
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
