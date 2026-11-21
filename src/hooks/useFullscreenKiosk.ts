import {useCallback, useEffect, useRef, useState} from 'react';

interface FullscreenDocument extends Document {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
  webkitFullscreenEnabled?: boolean;
}

interface FullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
}

interface WakeLockSentinel {
  released: boolean;
  release: () => Promise<void>;
}

export function useFullscreenKiosk() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [fullscreenSupported, setFullscreenSupported] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const checkFullscreen = useCallback(() => {
    const doc = document as FullscreenDocument;
    return Boolean(doc.fullscreenElement || doc.webkitFullscreenElement);
  }, []);

  const requestWakeLock = useCallback(async () => {
    try {
      const nav = navigator as Navigator & {
        wakeLock?: {request: (type: 'screen') => Promise<WakeLockSentinel>};
      };
      if (nav.wakeLock && document.visibilityState === 'visible') {
        wakeLockRef.current = await nav.wakeLock.request('screen');
      }
    } catch {
      // Wake Lock API may be unavailable or denied in embedded preview; fail silently
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    try {
      if (wakeLockRef.current && !wakeLockRef.current.released) {
        await wakeLockRef.current.release();
      }
    } catch {
      // Ignore release failures
    } finally {
      wakeLockRef.current = null;
    }
  }, []);

  useEffect(() => {
    const doc = document as FullscreenDocument;
    const el = document.documentElement as FullscreenElement;

    const supported = Boolean(
      (doc.fullscreenEnabled || doc.webkitFullscreenEnabled) &&
        (el.requestFullscreen || el.webkitRequestFullscreen),
    );
    setFullscreenSupported(supported);

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      (window.navigator as unknown as {standalone?: boolean}).standalone ===
        true;
    setIsStandalone(standalone);
    setIsFullscreen(checkFullscreen());

    const handleFullscreenChange = () => {
      const active = checkFullscreen();
      setIsFullscreen(active);
      if (active) {
        void requestWakeLock();
      } else {
        void releaseWakeLock();
      }
    };

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        (checkFullscreen() || standalone)
      ) {
        void requestWakeLock();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (standalone) {
      void requestWakeLock();
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange,
      );
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      void releaseWakeLock();
    };
  }, [checkFullscreen, requestWakeLock, releaseWakeLock]);

  const enterFullscreen = useCallback(async () => {
    const el = document.documentElement as FullscreenElement;
    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen({navigationUI: 'hide'});
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      }
      setIsFullscreen(true);
      await requestWakeLock();
      return true;
    } catch {
      return false;
    }
  }, [requestWakeLock]);

  const exitFullscreen = useCallback(async () => {
    const doc = document as FullscreenDocument;
    try {
      if (doc.exitFullscreen && doc.fullscreenElement) {
        await doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen && doc.webkitFullscreenElement) {
        await doc.webkitExitFullscreen();
      }
      setIsFullscreen(false);
      await releaseWakeLock();
      return true;
    } catch {
      return false;
    }
  }, [releaseWakeLock]);

  const toggleFullscreen = useCallback(async () => {
    if (checkFullscreen()) {
      return exitFullscreen();
    }
    return enterFullscreen();
  }, [checkFullscreen, enterFullscreen, exitFullscreen]);

  return {
    isFullscreen,
    isStandalone,
    isKioskActive: isFullscreen || isStandalone,
    fullscreenSupported,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  };
}
