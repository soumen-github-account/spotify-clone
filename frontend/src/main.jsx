import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import PlayContextProvider from './contexts/PlayerContext.jsx'
import { registerSW } from 'virtual:pwa-register';

// Automatically register & update the service worker
registerSW();

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <PlayContextProvider>
      <App />
    </PlayContextProvider>
  </BrowserRouter>
)
