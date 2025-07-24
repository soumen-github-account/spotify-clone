import React, { useEffect, useState } from 'react';
import './AppDownload.css';
import app_store from '../assets/app_store.png';
import play_store from '../assets/play_store.png';

// Global listener to capture beforeinstallprompt early
if (typeof window !== 'undefined') {
  window.deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredPrompt = e;
    console.log('beforeinstallprompt event saved');
  });
}

const AppDownload = () => {
    const [showInstallButton, setShowInstallButton] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
    const checkInstalled = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;
      setIsInstalled(isStandalone);
    };

    checkInstalled();

    const handleAppInstalled = () => {
      console.log('App installed');
      setIsInstalled(true);
      window.deferredPrompt = null;
      setShowInstallButton(false);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if the install prompt is already saved
    if (window.deferredPrompt && !isInstalled) {
      setShowInstallButton(true);
    }

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstallClick = () => {
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) return;

    promptEvent.prompt();

    promptEvent.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      window.deferredPrompt = null;
      setShowInstallButton(false);
    });
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
