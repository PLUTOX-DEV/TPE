import { Buffer } from 'buffer'; // <-- add this line
window.Buffer = Buffer;        // <-- and this

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

import { StaminaProvider } from './context/StaminaContext.jsx';
import { CoinProvider } from './context/CoinContext.jsx';
import { Toaster } from 'react-hot-toast';

import { TonConnectUIProvider } from '@tonconnect/ui-react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl="https://tpe-plutoxs-projects-1800c7ee.vercel.app/tonconnect-manifest.json">
      <BrowserRouter>
        <StaminaProvider>
          <CoinProvider>
            <App />
            <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
          </CoinProvider>
        </StaminaProvider>
      </BrowserRouter>
    </TonConnectUIProvider>
  </React.StrictMode>
);
