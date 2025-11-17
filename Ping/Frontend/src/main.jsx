import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ContextProvider } from './StoreContext/StoreContext.jsx';
import { SocketProvider } from './Providers/Socket.jsx';
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <ContextProvider>
    <SocketProvider>
        <App />
    </SocketProvider>
    </ContextProvider>
    </BrowserRouter>
  </StrictMode>,
);
