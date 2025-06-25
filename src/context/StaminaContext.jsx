// src/context/StaminaContext.js
import React, { createContext, useEffect, useState } from "react";

export const StaminaContext = createContext();

export function StaminaProvider({ children }) {
  const maxStamina = 100;
  const [stamina, setStamina] = useState(() => {
    return parseInt(localStorage.getItem("stamina")) || maxStamina;
  });

  const regenSpeed =
    parseInt(localStorage.getItem("staminaRegenSpeed")) || 10000;

  useEffect(() => {
    const interval = setInterval(() => {
      setStamina(prev => {
        const updated = Math.min(maxStamina, prev + 1);
        localStorage.setItem("stamina", updated);
        return updated;
      });
    }, regenSpeed);

    return () => clearInterval(interval);
  }, [regenSpeed]);

  return (
    <StaminaContext.Provider value={{ stamina, setStamina, maxStamina }}>
      {children}
    </StaminaContext.Provider>
  );
}
