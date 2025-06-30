// Polyfill Buffer for browser
import { Buffer } from "buffer";
window.Buffer = Buffer;

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useTonConnectUI, TonConnectButton } from "@tonconnect/ui-react";
import { Wheel } from "react-custom-roulette";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins, faStar, faGem, faWallet,
  faClock, faSpinner, faMedal,
  faRepeat, faCheckCircle, faCircleXmark
} from "@fortawesome/free-solid-svg-icons";
import { updateUser } from "../api/userApi";
import { Address } from "@ton/core"; // TON address parser

const formatCoins = (num) => {
  if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "k";
  return num.toString();
};

const data = [
  { option: "+0", style: { backgroundColor: "#7c3aed", textColor: "white" } },
  { option: "+10", style: { backgroundColor: "#9333ea", textColor: "white" } },
  { option: "+1000", style: { backgroundColor: "#a855f7", textColor: "white" } },
  { option: "+5000", style: { backgroundColor: "#c084fc", textColor: "white" } },
  { option: "ZERO", style: { backgroundColor: "#facc15", textColor: "#000" } },
  { option: "+10000", style: { backgroundColor: "#f472b6", textColor: "white" } },
  { option: "+15", style: { backgroundColor: "#34d399", textColor: "white" } },
  { option: "+5", style: { backgroundColor: "#60a5fa", textColor: "white" } }
];

const PACKAGE_SPINS = { free: 1, bronze: 3, silver: 5, gold: 7 };
const PACKAGES = {
  bronze: { label: "Bronze", priceTON: "10", spins: 4 },
  silver: { label: "Silver", priceTON: "25", spins: 10 },
  gold: { label: "Gold", priceTON: "40", spins: 20 }
};
const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 30 * 6;

export default function Spin() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [result, setResult] = useState(null);
  const [balance, setBalance] = useState(0);
  const [packageType, setPackageType] = useState("free");
  const [spinsUsed, setSpinsUsed] = useState(0);
  const [showPremium, setShowPremium] = useState(false);
  const [tonConnectUI] = useTonConnectUI();

  const todayStr = () => new Date().toISOString().split("T")[0];

  useEffect(() => {
    const savedBal = parseInt(localStorage.getItem("tapCoins")) || 0;
    setBalance(savedBal);

    const pkg = localStorage.getItem("packageType") || "free";
    const used = parseInt(localStorage.getItem("spinsUsed")) || 0;
    const lastDay = localStorage.getItem("spinsDate");
    const expiry = localStorage.getItem("packageExpiresAt");

    if (pkg !== "free" && expiry && Date.now() > +expiry) {
      toast("🎫 Premium package expired, reverting to free.");
      setPackageType("free");
      localStorage.setItem("packageType", "free");
      localStorage.removeItem("packageExpiresAt");
    } else {
      setPackageType(pkg);
    }

    if (lastDay !== todayStr()) {
      setSpinsUsed(0);
      localStorage.setItem("spinsUsed", "0");
      localStorage.setItem("spinsDate", todayStr());
    } else setSpinsUsed(used);
  }, []);

  useEffect(() => {
    localStorage.setItem("tapCoins", balance.toString());
  }, [balance]);

  const incrementSpinUsed = () => {
    const newCount = spinsUsed + 1;
    setSpinsUsed(newCount);
    localStorage.setItem("spinsUsed", newCount.toString());
    localStorage.setItem("spinsDate", todayStr());
  };

  const handleSpinClick = () => {
    const limit = PACKAGE_SPINS[packageType] || 1;
    if (spinsUsed >= limit) {
      toast.error(
        <>
          <FontAwesomeIcon icon={faClock} className="mr-2" />
          {packageType === "free"
            ? "Free: 1 spin/day. Upgrade for more!"
            : `You've used all ${limit} spins.`}
        </>
      );
      return;
    }

    const idx = Math.floor(Math.random() * data.length);
    setPrizeNumber(idx);
    setMustSpin(true);
    setResult(null);
    incrementSpinUsed();
  };

  const handleReward = async (rewardText) => {
    const amount = parseInt(rewardText.replace(/\D/g, "")) || 0;
    const newBal = balance + amount;
    setBalance(newBal);

    const id = localStorage.getItem("telegramId");
    if (id) await updateUser(id, { balance: newBal });

    toast.success(
      <><FontAwesomeIcon icon={faCoins} className="mr-2" />+{formatCoins(amount)} Coins!</>
    );
  };

  const handleBuyPackage = async (pack) => {
    if (!tonConnectUI.connected) {
      return toast.error("Connect your TON wallet!");
    }

    const currentIdx = Object.keys(PACKAGES).indexOf(packageType);
    const packIdx = Object.keys(PACKAGES).indexOf(pack);
    if (packIdx <= currentIdx && packageType !== "free") {
      return toast.error("Cannot downgrade your package.");
    }

    const price = PACKAGES[pack].priceTON;
    const nanoTON = BigInt(Math.round(parseFloat(price) * 1e9)).toString();
    const rawRecipient = "UQAMHY5HLY1d5825GNGRD7_KwufvunFH27zIklPvzbao8D5M"; // could start with U or E

    let recipient;
    try {
      const parsed = Address.parseFriendly(rawRecipient).address;
      recipient = parsed.toString(); // always bounceable EQ...
    } catch (err) {
      console.error(err);
      toast.error("❌ Invalid recipient wallet address.");
      return;
    }

    try {
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [{ address: recipient, amount: nanoTON }]
      });

      const expiry = Date.now() + SIX_MONTHS_MS;
      setPackageType(pack);
      setSpinsUsed(0);
      localStorage.setItem("packageType", pack);
      localStorage.setItem("spinsUsed", "0");
      localStorage.setItem("spinsDate", todayStr());
      localStorage.setItem("packageExpiresAt", expiry.toString());

      const id = localStorage.getItem("telegramId");
      if (id) await updateUser(id, { packageType: pack, packageExpiresAt: new Date(expiry) });

      toast.success(
        <><FontAwesomeIcon icon={faGem} className="mr-2" />{PACKAGES[pack].label} activated!</>
      );
      setShowPremium(false);
    } catch (e) {
      console.error(e);
      toast.error("❌ Transaction failed or cancelled.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center py-10">
        <div className="flex justify-end mb-4"><TonConnectButton /></div>
        <h1 className="text-3xl font-bold text-yellow-400 mb-4">🎡 Spin & Earn</h1>
        <p className="text-lg mb-4">
          <FontAwesomeIcon icon={faCoins} className="mr-2 text-yellow-400" />
          Balance: <b className="text-yellow-400">{formatCoins(balance)}</b>
        </p>
        <p className="mb-2">
          Package: <b className="text-yellow-400">{packageType}</b> |
          Spins: {spinsUsed} / {PACKAGE_SPINS[packageType] || 1}
        </p>

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

        <button
          onClick={handleSpinClick}
          disabled={mustSpin}
          className={`mb-4 px-8 py-3 bg-purple-700 hover:bg-purple-800 rounded-full text-lg font-bold flex items-center justify-center ${mustSpin ? "opacity-50 cursor-not-allowed" : ""}`}>
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
            className="mb-2 px-6 py-2 bg-yellow-400 text-black rounded-full font-bold flex items-center justify-center">
            <FontAwesomeIcon icon={faStar} className="mr-2" />Get Premium
          </button>
        )}

        {result && (
          <div className="mt-4 text-2xl font-bold text-green-300 animate-pulse">
            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
            You got: <span className="text-yellow-400">{result}</span>
          </div>
        )}
      </div>

      {showPremium && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#111] p-6 rounded-xl text-white max-w-sm w-full text-center">
            <h2 className="text-xl font-bold text-yellow-400 mb-4 flex justify-center items-center">
              <FontAwesomeIcon icon={faGem} className="mr-2" /> Premium Packages
            </h2>
            {!tonConnectUI.connected && <p className="text-yellow-400 mb-4">Connect your TON wallet.</p>}
            <ul className="space-y-4 text-left text-sm">
              {Object.entries(PACKAGES).map(([key, pkg]) => {
                const currentIdx = Object.keys(PACKAGES).indexOf(packageType);
                const isDisabled = !tonConnectUI.connected || Object.keys(PACKAGES).indexOf(key) <= currentIdx;
                return (
                  <li key={key} className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon icon={faMedal} size="lg" style={{
                        color: key === "gold" ? "#ffd700" : key === "silver" ? "#c0c0c0" : "#cd7f32"
                      }} />
                      <span className="font-semibold">{pkg.label}</span>
                      <span className="ml-4 text-yellow-400">
                        <FontAwesomeIcon icon={faRepeat} className="mr-1" />
                        {pkg.spins} spins/day
                      </span>
                      <span className="ml-4 text-green-400">
                        <FontAwesomeIcon icon={faWallet} className="mr-1" />
                        {pkg.priceTON} TON
                      </span>
                    </div>
                    <button
                      onClick={() => handleBuyPackage(key)}
                      disabled={isDisabled}
                      className={`px-4 py-1 rounded-full text-sm font-bold ${
                        !isDisabled ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 cursor-not-allowed"
                      }`}>
                      Buy
                    </button>
                  </li>
                );
              })}
            </ul>
            <button
              onClick={() => setShowPremium(false)}
              className="mt-3 text-gray-400 hover:text-white text-sm flex items-center justify-center w-full">
              <FontAwesomeIcon icon={faCircleXmark} className="mr-2" />
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
