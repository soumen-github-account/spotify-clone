import React, { useEffect, useState } from 'react';
import './AppDownload.css';
import app_store from '../assets/app_store.png';
import play_store from '../assets/play_store.png';

const AppDownload = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Detect if app is already installed
    const checkInstalled = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;
      setIsInstalled(isStandalone);
    };

    checkInstalled();

    // 2. Listen for beforeinstallprompt to show custom button
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      if (!isInstalled) {
        setShowInstallButton(true);
      }
    };

    // 3. Listen for appinstalled event
    const handleAppInstalled = () => {
      console.log('App installed');
      setIsInstalled(true);
      setInstallPrompt(null);
      setShowInstallButton(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setInstallPrompt(null);
        setShowInstallButton(false);
      });
    }
  };

  return (
    <div className="app-download" id="app-download">
      <p>For a Better Experience<br />Install Our App</p>

      <div className="app-download-platforms">
        <img src={play_store} alt="Play Store" />
        <img src={app_store} alt="App Store" />
      </div>

      {!isInstalled && showInstallButton && (
        <button className="install-btn" onClick={handleInstallClick}>
          Install Now
        </button>
      )}
    </div>
  );
};

export default AppDownload;
