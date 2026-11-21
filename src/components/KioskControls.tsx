import {useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {
  Download,
  EyeOff,
  Maximize2,
  Minimize2,
  Play,
  RotateCw,
  Share,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {usePWAInstall} from '../hooks/usePWAInstall';

interface KioskControlsProps {
  isFullscreen: boolean;
  isStandalone: boolean;
  fullscreenSupported: boolean;
  onToggleFullscreen: () => void;
  onReloadPortal: () => void;
  onReplayIntro: () => void;
}

export function KioskControls({
  isFullscreen,
  isStandalone,
  fullscreenSupported,
  onToggleFullscreen,
  onReloadPortal,
  onReplayIntro,
}: KioskControlsProps) {
  const {isInstallable, isInstalled, isIOS, install} = usePWAInstall();
  const [menuOpen, setMenuOpen] = useState(false);
  const [controlsHidden, setControlsHidden] = useState(false);
  const [showHiddenHint, setShowHiddenHint] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const tapTimestampsRef = useRef<number[]>([]);

  // Keyboard shortcut (Alt+K or Ctrl+Shift+K) to restore or toggle kiosk controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.altKey && e.key.toLowerCase() === 'k') ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'k')
      ) {
        e.preventDefault();
        setControlsHidden(false);
        setMenuOpen((prev) => !prev);
      } else if (e.key === 'Escape' && (menuOpen || showInstallGuide)) {
        setMenuOpen(false);
        setShowInstallGuide(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen, showInstallGuide]);

  // Auto-dismiss the "controls hidden" toast after 3.5s
  useEffect(() => {
    if (!showHiddenHint) return;
    const timer = window.setTimeout(() => setShowHiddenHint(false), 3500);
    return () => window.clearTimeout(timer);
  }, [showHiddenHint]);

  const handleCornerRestoreTap = () => {
    const now = Date.now();
    tapTimestampsRef.current = tapTimestampsRef.current
      .filter((t) => now - t < 900)
      .concat(now);

    if (tapTimestampsRef.current.length >= 3) {
      tapTimestampsRef.current = [];
      setControlsHidden(false);
      setMenuOpen(true);
    }
  };

  const handleHideControls = () => {
    setMenuOpen(false);
    setControlsHidden(true);
    setShowHiddenHint(true);
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
      setMenuOpen(false);
      return;
    }
    setMenuOpen(false);
    setShowInstallGuide(true);
  };

  const canShowInstall = !isInstalled && !isStandalone;

  return (
    <>
      {/* Invisible top-right triple-tap restore zone when in pure hidden kiosk mode */}
      {controlsHidden && (
        <button
          type="button"
          onClick={handleCornerRestoreTap}
          aria-label="Triple tap to restore kiosk controls"
          className="fixed top-0 right-0 z-40 w-16 h-16 bg-transparent border-0 cursor-default focus:outline-none"
        />
      )}

      {/* Brief non-intrusive toast when controls are hidden */}
      <AnimatePresence>
        {showHiddenHint && (
          <motion.div
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: 8}}
            transition={{duration: 0.2, ease: [0.16, 1, 0.3, 1]}}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 px-4 py-2.5 rounded-xl bg-slate-900/90 text-white text-xs font-medium shadow-lg backdrop-blur-md whitespace-nowrap pointer-events-none"
            role="status"
          >
            Controls hidden · Triple-tap top-right or press Alt+K to restore
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop when menu is open */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.16}}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-30 bg-slate-950/15 backdrop-blur-[1px]"
          />
        )}
      </AnimatePresence>

      {/* Corner Kiosk Handle & Expandable Utility Sheet */}
      {!controlsHidden && (
        <div className="fixed bottom-4 right-4 pb-safe z-40 flex flex-col items-end gap-2.5">
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{opacity: 0, scale: 0.96, y: 8}}
                animate={{opacity: 1, scale: 1, y: 0}}
                exit={{opacity: 0, scale: 0.96, y: 8}}
                transition={{duration: 0.18, ease: [0.16, 1, 0.3, 1]}}
                className="w-64 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl overflow-hidden"
                role="dialog"
                aria-label="Kiosk controls"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <span className="text-sm font-semibold text-slate-900 truncate">
                    Sync Holidays
                  </span>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    aria-label="Close kiosk menu"
                    className="inline-flex items-center justify-center w-8 h-8 -mr-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-violet-600"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="p-2 flex flex-col gap-0.5">
                  {fullscreenSupported && !isStandalone && (
                    <button
                      type="button"
                      onClick={() => {
                        onToggleFullscreen();
                        setMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full min-h-[44px] px-3 py-2 rounded-xl text-left text-sm font-medium text-slate-800 hover:bg-violet-50 hover:text-violet-700 transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-violet-600"
                    >
                      {isFullscreen ? (
                        <>
                          <Minimize2
                            className="w-4 h-4 shrink-0 text-violet-600"
                            aria-hidden="true"
                          />
                          <span>Exit Full Screen</span>
                        </>
                      ) : (
                        <>
                          <Maximize2
                            className="w-4 h-4 shrink-0 text-violet-600"
                            aria-hidden="true"
                          />
                          <span>Full-Screen Kiosk</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onReloadPortal();
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full min-h-[44px] px-3 py-2 rounded-xl text-left text-sm font-medium text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-violet-600"
                  >
                    <RotateCw
                      className="w-4 h-4 shrink-0 text-slate-500"
                      aria-hidden="true"
                    />
                    <span>Reload Portal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onReplayIntro();
                    }}
                    className="flex items-center gap-3 w-full min-h-[44px] px-3 py-2 rounded-xl text-left text-sm font-medium text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-violet-600"
                  >
                    <Play
                      className="w-4 h-4 shrink-0 text-slate-500"
                      aria-hidden="true"
                    />
                    <span>Replay Intro Video</span>
                  </button>

                  {canShowInstall && (
                    <button
                      type="button"
                      onClick={handleInstallClick}
                      className="flex items-center gap-3 w-full min-h-[44px] px-3 py-2 rounded-xl text-left text-sm font-medium text-violet-700 bg-violet-50/70 hover:bg-violet-100/80 transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-violet-600"
                    >
                      <Download
                        className="w-4 h-4 shrink-0 text-violet-600"
                        aria-hidden="true"
                      />
                      <span>
                        {isIOS ? 'Add to Home Screen' : 'Install Kiosk App'}
                      </span>
                    </button>
                  )}

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    type="button"
                    onClick={handleHideControls}
                    className="flex items-center gap-3 w-full min-h-[44px] px-3 py-2 rounded-xl text-left text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-violet-600"
                  >
                    <EyeOff
                      className="w-4 h-4 shrink-0 text-slate-400"
                      aria-hidden="true"
                    />
                    <span>Hide Controls</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Discreet corner trigger — low opacity when idle so portal remains unobstructed */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={
              menuOpen ? 'Close kiosk controls' : 'Open kiosk controls'
            }
            aria-expanded={menuOpen}
            className={`inline-flex items-center justify-center w-11 h-11 rounded-full border shadow-md backdrop-blur-md transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 ${
              menuOpen
                ? 'bg-violet-600 border-violet-600 text-white opacity-100 scale-100'
                : 'bg-white/90 border-violet-200/90 text-violet-700 opacity-65 hover:opacity-100 hover:border-violet-400 active:scale-95'
            }`}
          >
            {menuOpen ? (
              <X className="w-4 h-4" aria-hidden="true" />
            ) : (
              <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
      )}

      {/* Install / Home Screen Guide Modal (iOS Safari or browsers without native prompt) */}
      <AnimatePresence>
        {showInstallGuide && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.18}}
            onClick={() => setShowInstallGuide(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{opacity: 0, scale: 0.96, y: 10}}
              animate={{opacity: 1, scale: 1, y: 0}}
              exit={{opacity: 0, scale: 0.96, y: 10}}
              transition={{duration: 0.2, ease: [0.16, 1, 0.3, 1]}}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200"
              role="dialog"
              aria-labelledby="install-guide-title"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/icon.svg"
                    alt="Sync Holidays"
                    className="w-11 h-11 rounded-xl shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h2
                      id="install-guide-title"
                      className="text-base font-semibold text-slate-900"
                    >
                      Install Sync Holidays
                    </h2>
                    <p className="text-xs text-slate-500">
                      Runs full-screen with no address bar
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInstallGuide(false)}
                  aria-label="Close installation guide"
                  className="inline-flex items-center justify-center w-9 h-9 -mr-1 -mt-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              {isIOS ? (
                <ol className="mt-5 space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <span className="font-semibold text-violet-600 tabular-nums">
                      1.
                    </span>
                    <span>
                      Tap the{' '}
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-900">
                        <Share
                          className="w-3.5 h-3.5 text-violet-600"
                          aria-hidden="true"
                        />
                        Share
                      </span>{' '}
                      button in Safari&apos;s toolbar.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-semibold text-violet-600 tabular-nums">
                      2.
                    </span>
                    <span>
                      Scroll down and tap{' '}
                      <strong className="font-semibold text-slate-900">
                        Add to Home Screen
                      </strong>
                      .
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-semibold text-violet-600 tabular-nums">
                      3.
                    </span>
                    <span>
                      Launch from your home screen for address-bar-free
                      full-screen access.
                    </span>
                  </li>
                </ol>
              ) : (
                <ol className="mt-5 space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <span className="font-semibold text-violet-600 tabular-nums">
                      1.
                    </span>
                    <span>
                      Open your browser menu (⋮) or click the install icon in
                      the browser toolbar.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-semibold text-violet-600 tabular-nums">
                      2.
                    </span>
                    <span>
                      Select{' '}
                      <strong className="font-semibold text-slate-900">
                        Install Sync Holidays
                      </strong>{' '}
                      or{' '}
                      <strong className="font-semibold text-slate-900">
                        Add to Home Screen
                      </strong>
                      .
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-semibold text-violet-600 tabular-nums">
                      3.
                    </span>
                    <span>
                      The app opens directly in full-screen standalone mode
                      without an address bar.
                    </span>
                  </li>
                </ol>
              )}

              <button
                type="button"
                onClick={() => setShowInstallGuide(false)}
                className="mt-6 w-full min-h-[44px] rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
