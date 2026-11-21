/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useCallback, useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {registerSW} from 'virtual:pwa-register';
import {IntroSplash} from './components/IntroSplash';
import {KioskControls} from './components/KioskControls';
import {OfflineOverlay} from './components/OfflineOverlay';
import {useFullscreenKiosk} from './hooks/useFullscreenKiosk';
import {useOnlineStatus} from './hooks/useOnlineStatus';

const PORTAL_URL = '/login';
const INTRO_VIDEO_SRC = '/assets/aistudio/app_logo_intro_db0af7f4.mp4';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [introKey, setIntroKey] = useState(0);
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const isOnline = useOnlineStatus();
  const {
    isFullscreen,
    isStandalone,
    isKioskActive,
    fullscreenSupported,
    enterFullscreen,
    toggleFullscreen,
  } = useFullscreenKiosk();

  // Register PWA service worker in production; clean up any stale dev SW in dev mode
  useEffect(() => {
    if (import.meta.env.PROD) {
      registerSW({immediate: true});
    } else if ('serviceWorker' in navigator) {
      void navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          if (registration.active?.scriptURL.includes('dev-sw.js')) {
            void registration.unregister();
          }
        }
      });
    }
  }, []);

  // Safety reveal if cross-origin onload event is delayed after intro finishes
  useEffect(() => {
    if (showIntro || iframeLoaded) return;
    const safetyTimer = window.setTimeout(() => {
      setIframeLoaded(true);
    }, 4500);
    return () => window.clearTimeout(safetyTimer);
  }, [showIntro, iframeLoaded, iframeKey]);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  const handleReloadPortal = useCallback(() => {
    setIframeLoaded(false);
    setIframeKey((prev) => prev + 1);
  }, []);

  const handleReplayIntro = useCallback(() => {
    setIntroKey((prev) => prev + 1);
    setShowIntro(true);
  }, []);

  return (
    <main className="fixed inset-0 w-screen h-[100dvh] bg-white overflow-hidden overscroll-none">
      {/* Full-bleed edge-to-edge web portal viewport — zero address bar, preloads behind intro */}
      <iframe
        key={iframeKey}
        src={PORTAL_URL}
        title="Sync Holidays Portal"
        onLoad={() => setIframeLoaded(true)}
        allow="fullscreen; clipboard-read; clipboard-write; geolocation; camera; microphone; payment"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="fixed inset-0 w-full h-full border-0 bg-white"
      />

      {/* Minimal loading veil shown only if intro finishes before portal finishes loading */}
      <AnimatePresence>
        {!showIntro && !iframeLoaded && isOnline && (
          <motion.div
            key="portal-loader"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.25}}
            className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-white"
            aria-live="polite"
          >
            <div className="h-9 w-9 rounded-full border-[3px] border-violet-100 border-t-violet-600 animate-spin" />
            <p className="text-sm font-medium text-slate-600">
              Loading Sync Holidays...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Opening Intro Video Splash */}
      <AnimatePresence>
        {showIntro && (
          <IntroSplash
            key={introKey}
            videoSrc={INTRO_VIDEO_SRC}
            onComplete={handleIntroComplete}
            onRequestFullscreen={() => {
              void enterFullscreen();
            }}
            fullscreenSupported={fullscreenSupported}
            isKioskActive={isKioskActive}
          />
        )}
      </AnimatePresence>

      {/* Offline state overlay */}
      {!isOnline && <OfflineOverlay onRetry={handleReloadPortal} />}

      {/* Discreet corner kiosk utility menu (hidden during intro splash) */}
      {!showIntro && (
        <KioskControls
          isFullscreen={isFullscreen}
          isStandalone={isStandalone}
          fullscreenSupported={fullscreenSupported}
          onToggleFullscreen={() => {
            void toggleFullscreen();
          }}
          onReloadPortal={handleReloadPortal}
          onReplayIntro={handleReplayIntro}
        />
      )}
    </main>
  );
}
