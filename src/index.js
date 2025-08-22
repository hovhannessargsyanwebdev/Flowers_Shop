import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import App from './App'
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <HelmetProvider>
     <div className="App">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </div>
  </HelmetProvider>
  // </React.StrictMode>
);

reportWebVitals();
