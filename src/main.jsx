import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

import { StaminaProvider } from './context/StaminaContext.jsx';
import { CoinProvider } from './context/CoinContext.jsx'; // ✅ Coin context
import { Toaster } from 'react-hot-toast';

import { TonConnectUIProvider } from '@tonconnect/ui-react'; // ✅ TonConnect

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl="https://tpe-plutoxs-projects-1800c7ee.vercel.app/tonconnect-manifest.json"> {/* ✅ Replace with your actual hosted manifest URL */}
      <BrowserRouter>
        <StaminaProvider>
          <CoinProvider> {/* ✅ Wrap App with Coin context */}
            <App />
            <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
          </CoinProvider>
        </StaminaProvider>
      </BrowserRouter>
    </TonConnectUIProvider>
  </React.StrictMode>
);
