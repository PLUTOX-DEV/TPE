import React, { createContext, useEffect, useState } from 'react';

export const CoinContext = createContext();

export const CoinProvider = ({ children }) => {
  const [balance, setBalance] = useState(() => {
    return parseInt(localStorage.getItem("tapCoins")) || 0;
  });

  useEffect(() => {
    localStorage.setItem("tapCoins", balance);
  }, [balance]);

  return (
    <CoinContext.Provider value={{ balance, setBalance }}>
      {children}
    </CoinContext.Provider>
  );
};
