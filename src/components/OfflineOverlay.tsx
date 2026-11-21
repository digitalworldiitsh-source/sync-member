import {RotateCw, WifiOff} from 'lucide-react';

interface OfflineOverlayProps {
  onRetry: () => void;
}

export function OfflineOverlay({onRetry}: OfflineOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-[45] flex items-center justify-center bg-white/95 backdrop-blur-md p-6"
      role="alert"
    >
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <WifiOff className="w-6 h-6" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-slate-900">
          Connection Unavailable
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
          Sync Holidays requires an active internet connection to load the
          portal. Please check your network and try again.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
        >
          <RotateCw className="w-4 h-4" aria-hidden="true" />
          Retry Connection
        </button>
      </div>
    </div>
  );
}
