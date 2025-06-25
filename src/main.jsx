import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { StaminaProvider } from './context/StaminaContext.jsx'; // must match filename exactly

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <StaminaProvider> {/* ✅ Wrap the App here */}
        <App />
      </StaminaProvider>
    </BrowserRouter>
  </React.StrictMode>
);
