import {useCallback, useEffect, useRef, useState} from 'react';
import {motion} from 'motion/react';
import {Maximize2, Play} from 'lucide-react';

interface IntroSplashProps {
  videoSrc: string;
  onComplete: () => void;
  onRequestFullscreen?: () => void;
  fullscreenSupported?: boolean;
  isKioskActive?: boolean;
}

export function IntroSplash({
  videoSrc,
  onComplete,
  onRequestFullscreen,
  fullscreenSupported = false,
  isKioskActive = false,
}: IntroSplashProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const completedRef = useRef(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  const finishIntro = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    completedRef.current = false;

    const skipTimer = window.setTimeout(() => {
      setShowSkip(true);
    }, 650);

    // Safety timeout: intro video is ~2.28s, guarantee transition if playback stalls
    const fallbackTimer = window.setTimeout(() => {
      finishIntro();
    }, 5500);

    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.currentTime = 0;
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Rare strict autoplay policy fallback
          setNeedsInteraction(true);
          window.clearTimeout(fallbackTimer);
        });
      }
    }

    return () => {
      window.clearTimeout(skipTimer);
      window.clearTimeout(fallbackTimer);
    };
  }, [finishIntro, videoSrc]);

  const handleManualStart = () => {
    if (onRequestFullscreen && fullscreenSupported && !isKioskActive) {
      onRequestFullscreen();
    }
    const videoEl = videoRef.current;
    if (videoEl) {
      setNeedsInteraction(false);
      videoEl.play().catch(() => {
        finishIntro();
      });
    } else {
      finishIntro();
    }
  };

  const handleSurfaceClick = () => {
    // Allow first tap during intro to engage fullscreen kiosk mode seamlessly
    if (
      !needsInteraction &&
      onRequestFullscreen &&
      fullscreenSupported &&
      !isKioskActive
    ) {
      onRequestFullscreen();
    }
  };

  return (
    <motion.div
      key="intro-splash"
      initial={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.35, ease: [0.16, 1, 0.3, 1]}}
      onClick={handleSurfaceClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white select-none overflow-hidden"
      role="region"
      aria-label="Sync Holidays opening intro"
    >
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={finishIntro}
        onError={finishIntro}
        className="w-full h-full object-cover md:object-contain bg-white"
      />

      {needsInteraction && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm p-6">
          <div className="flex flex-col items-center gap-5 text-center max-w-xs">
            <img
              src="/pwa-192x192.png"
              alt="Sync Holidays"
              className="w-24 h-24 rounded-3xl shadow-[0_14px_34px_-8px_rgba(124,58,237,0.28)]"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-1">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Sync Holidays
              </h1>
              <p className="text-sm text-slate-600">
                Tap below to launch full-screen portal access.
              </p>
            </div>
            <button
              type="button"
              onClick={handleManualStart}
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white text-sm font-semibold shadow-sm transition-all whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            >
              <Play className="w-4 h-4 fill-current" aria-hidden="true" />
              Enter Portal
            </button>
          </div>
        </div>
      )}

      {!needsInteraction && showSkip && (
        <div className="fixed bottom-5 right-5 pb-safe flex items-center gap-2 z-10">
          {fullscreenSupported && !isKioskActive && onRequestFullscreen && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRequestFullscreen();
              }}
              aria-label="Enter full-screen kiosk mode"
              className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900/5 hover:bg-slate-900/10 text-slate-700 text-xs font-medium backdrop-blur-sm transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            >
              <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
              Full Screen
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              finishIntro();
            }}
            className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-4 py-2 rounded-xl bg-slate-900/5 hover:bg-slate-900/10 text-slate-700 text-xs font-medium backdrop-blur-sm transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            Skip
          </button>
        </div>
      )}
    </motion.div>
  );
}
