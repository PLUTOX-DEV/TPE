import React, { useState } from 'react';

const prizes = [5, 10, 15, 20, 50, 100];

export default function SpinWheel() {
  const [spinning, setSpinning] = useState(false);
  const [reward, setReward] = useState(null);
  const [angle, setAngle] = useState(0);

  const spin = () => {
    if (spinning) return;

    setSpinning(true);
    const randomIndex = Math.floor(Math.random() * prizes.length);
    const prize = prizes[randomIndex];
    const newAngle = 360 * 5 + randomIndex * (360 / prizes.length);

    setAngle(newAngle);
    setTimeout(() => {
      setReward(prize);
      setSpinning(false);
    }, 4000); // match CSS transition
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <div className="relative w-40 h-40 border-[10px] border-yellow-500 rounded-full overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-[4s] ease-out"
          style={{
            transform: `rotate(${angle}deg)`,
            background:
              'conic-gradient(#facc15 0% 16.6%, #eab308 16.6% 33.3%, #facc15 33.3% 50%, #eab308 50% 66.6%, #facc15 66.6% 83.3%, #eab308 83.3% 100%)'
          }}
        />
        <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-[20px] border-transparent border-b-red-600 z-10"></div>
      </div>

      <button
        onClick={spin}
        className="mt-6 px-6 py-2 text-lg bg-yellow-400 text-black rounded-full shadow hover:scale-105 transition-transform"
        disabled={spinning}
      >
        {spinning ? 'Spinning...' : 'Spin 🎯'}
      </button>

      {reward && !spinning && (
        <p className="mt-4 text-lg font-semibold text-green-400">You won {reward} coins! 🥳</p>
      )}
    </div>
  );
}
