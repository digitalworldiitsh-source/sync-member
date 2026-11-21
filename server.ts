import express from 'express';
import type {Request, Response, NextFunction} from 'express';
import {createServer as createHttpServer} from 'http';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';
const UPSTREAM_ORIGIN = 'https://www.sgcpvt.ltd';

const KIOSK_CSS_INJECTION = `<style id="kiosk-portal-overrides">
/* Hide top-left back-to-home arrow on login screen */
a[href="/home"].top-10.left-10,
a[href="/home"].absolute.top-10.left-10 {
  display: none !important;
  visibility: hidden !important;
  pointer-events: none !important;
}

/* Frosted Liquid-Glass White & Purple Theme — Initial pre-mount loading splash */
#root > div[style*="#0a0314"] {
  background: linear-gradient(155deg, #ffffff 0%, #f5eeff 55%, #e9dcff 100%) !important;
}

/* Frosted Liquid-Glass White & Purple Theme — Login & Reset Password Root Canvas */
div[class*="bg-[#030108]"] {
  background:
    radial-gradient(circle at 16% 18%, rgba(168, 85, 247, 0.24) 0%, rgba(255, 255, 255, 0) 48%),
    radial-gradient(circle at 86% 82%, rgba(124, 58, 237, 0.22) 0%, rgba(255, 255, 255, 0) 52%),
    radial-gradient(circle at 82% 16%, rgba(196, 181, 253, 0.32) 0%, rgba(255, 255, 255, 0) 45%),
    linear-gradient(160deg, #ffffff 0%, #f6f0ff 52%, #ebe1ff 100%) !important;
  color: #1e1033 !important;
}

/* Soft daylight glass refraction behind the card from destination photography */
div[class*="bg-[#030108]"] img[alt="Destination Background"] {
  opacity: 0.20 !important;
  filter: blur(8px) saturate(0.85) brightness(1.16) !important;
  mix-blend-mode: multiply !important;
}

/* Luminous white-lavender glass atmosphere overlay */
div[class*="bg-[#030108]"] div[class*="from-[#030108]"] {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.84) 0%,
    rgba(246, 240, 255, 0.68) 52%,
    rgba(232, 220, 255, 0.56) 100%
  ) !important;
}

/* Soft floating violet liquid-glass blooms */
div[class*="bg-[#030108]"] div[class*="radial-gradient"] {
  background: radial-gradient(
    circle,
    rgba(147, 51, 234, 0.22) 0%,
    rgba(196, 181, 253, 0.08) 42%,
    rgba(255, 255, 255, 0) 70%
  ) !important;
}

/* Subtle purple flight-route schematic */
div[class*="bg-[#030108]"] svg[viewBox="0 0 1000 500"] {
  stroke: #7c3aed !important;
  opacity: 0.14 !important;
}

/* Desktop left hero typography & brand lockup */
div[class*="bg-[#030108]"] h1 span {
  background-image: linear-gradient(180deg, #2e1065 0%, #7c3aed 100%) !important;
  -webkit-background-clip: text !important;
  color: transparent !important;
  filter: none !important;
}

div[class*="bg-[#030108]"] span[class*="tracking-[0.4em]"] {
  color: #4c1d95 !important;
}

div[class*="bg-[#030108]"] p[class*="tracking-[0.5em]"] {
  color: #7c3aed !important;
}

/* Main Login / Reset / OTP Card — True Frosted Crystal Liquid-Glass Surface */
div[class*="bg-[#030108]"] div[class*="rounded-[32px]"] {
  background: linear-gradient(
    155deg,
    rgba(255, 255, 255, 0.74) 0%,
    rgba(248, 243, 255, 0.56) 55%,
    rgba(255, 255, 255, 0.68) 100%
  ) !important;
  backdrop-filter: blur(28px) saturate(185%) !important;
  -webkit-backdrop-filter: blur(28px) saturate(185%) !important;
  border: 1.5px solid rgba(255, 255, 255, 0.88) !important;
  box-shadow:
    inset 0 1.5px 1px rgba(255, 255, 255, 0.96),
    inset 0 -1.5px 3px rgba(124, 58, 237, 0.08),
    0 28px 64px -16px rgba(109, 40, 217, 0.22),
    0 0 0 1px rgba(124, 58, 237, 0.12) !important;
}

/* Card Headings & Subtitles */
div[class*="bg-[#030108]"] h2,
div[class*="bg-[#030108]"] h3 {
  color: #1e1033 !important;
}

div[class*="bg-[#030108]"] form p {
  color: #6d28d9 !important;
}

div[class*="bg-[#030108]"] form p strong {
  color: #2e1065 !important;
}

/* Input Containers — Translucent Frosted Glass Wells */
div[class*="bg-[#030108]"] div[class*="bg-[#0A0514]"] {
  background: rgba(255, 255, 255, 0.62) !important;
  backdrop-filter: blur(14px) !important;
  -webkit-backdrop-filter: blur(14px) !important;
  border: 1.5px solid rgba(255, 255, 255, 0.88) !important;
  box-shadow:
    inset 0 2px 6px rgba(109, 40, 217, 0.06),
    0 0 0 1px rgba(124, 58, 237, 0.14) !important;
  transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease !important;
}

div[class*="bg-[#030108]"] .group\\/input:focus-within div[class*="bg-[#0A0514]"] {
  background: rgba(255, 255, 255, 0.90) !important;
  border-color: rgba(124, 58, 237, 0.72) !important;
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.9),
    0 0 0 4px rgba(124, 58, 237, 0.14) !important;
}

/* Input Text & Autofill Contrast */
div[class*="bg-[#030108]"] input {
  color: #1e1033 !important;
  caret-color: #7c3aed !important;
}

div[class*="bg-[#030108]"] input:-webkit-autofill,
div[class*="bg-[#030108]"] input:-webkit-autofill:hover,
div[class*="bg-[#030108]"] input:-webkit-autofill:focus {
  -webkit-text-fill-color: #1e1033 !important;
  -webkit-box-shadow: 0 0 0px 1000px #f6f1ff inset !important;
  transition: background-color 5000s ease-in-out 0s;
}

/* Input Floating Labels */
div[class*="bg-[#030108]"] label {
  color: #746494 !important;
}

div[class*="bg-[#030108]"] label[class*="text-[#A78BFA]"] {
  color: #7c3aed !important;
}

/* Input Left Icons & Password Visibility Toggle */
div[class*="bg-[#030108]"] div[class*="bg-[#0A0514]"] > div[class*="left-0"] {
  color: #826fa6 !important;
}

div[class*="bg-[#030108]"] .group\\/input:focus-within div[class*="bg-[#0A0514]"] > div[class*="left-0"] {
  color: #7c3aed !important;
}

div[class*="bg-[#030108]"] div[class*="bg-[#0A0514]"] button[type="button"] {
  color: #826fa6 !important;
}

div[class*="bg-[#030108]"] div[class*="bg-[#0A0514]"] button[type="button"]:hover {
  color: #5b21b6 !important;
}

/* Primary CTA Button — Glossy Liquid-Purple Glass */
div[class*="bg-[#030108]"] button[type="submit"] {
  background: linear-gradient(
    135deg,
    rgba(124, 58, 237, 0.92) 0%,
    rgba(147, 51, 234, 0.94) 100%
  ) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.36) !important;
  box-shadow:
    inset 0 1.5px 1px rgba(255, 255, 255, 0.42),
    0 14px 32px -6px rgba(124, 58, 237, 0.46) !important;
}

div[class*="bg-[#030108]"] button[type="submit"]:hover {
  background: linear-gradient(
    135deg,
    rgba(109, 40, 217, 0.96) 0%,
    rgba(126, 34, 206, 0.98) 100%
  ) !important;
  box-shadow:
    inset 0 1.5px 1px rgba(255, 255, 255, 0.48),
    0 18px 36px -6px rgba(109, 40, 217, 0.52) !important;
}

div[class*="bg-[#030108]"] button[type="submit"] > div[class*="via-white"] {
  opacity: 0.32 !important;
}

/* Secondary Form Buttons (Back to Login, Resend Code) */
div[class*="bg-[#030108]"] form button[type="button"]:not([class*="right-4"]) {
  color: #7c3aed !important;
}

div[class*="bg-[#030108]"] form button[type="button"]:not([class*="right-4"]):hover {
  color: #4c1d95 !important;
}

div[class*="bg-[#030108]"] form button[type="button"]:disabled {
  color: #a799c2 !important;
}

/* Authentication Progress & Welcome Back States */
div[class*="bg-[#030108]"] div[class*="animate-spin"] {
  border-color: rgba(124, 58, 237, 0.18) !important;
  border-top-color: #7c3aed !important;
}

div[class*="bg-[#030108]"] div[class*="w-20"][class*="h-20"][class*="rounded-full"] {
  background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%) !important;
  border: 1.5px solid rgba(255, 255, 255, 0.45) !important;
  box-shadow:
    inset 0 2px 2px rgba(255, 255, 255, 0.4),
    0 16px 38px rgba(124, 58, 237, 0.38) !important;
}

div[class*="bg-[#030108]"] div[class*="w-20"][class*="h-20"][class*="rounded-full"] svg {
  color: #ffffff !important;
}

/* Toast Notifications — Frosted Glass Cards */
div[class*="bg-[#030108]"] div[class*="bg-[#0c1a14]"],
div[class*="bg-[#030108]"] div[class*="bg-[#1a0a0c]"],
div[class*="bg-[#030108]"] div[class*="bg-[#0e071e]"] {
  background: rgba(255, 255, 255, 0.80) !important;
  backdrop-filter: blur(22px) saturate(170%) !important;
  -webkit-backdrop-filter: blur(22px) saturate(170%) !important;
  border: 1px solid rgba(255, 255, 255, 0.88) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    0 14px 36px rgba(109, 40, 217, 0.18) !important;
}

div[class*="bg-[#030108]"] div[class*="bg-[#0c1a14]"] p,
div[class*="bg-[#030108]"] div[class*="bg-[#1a0a0c]"] p,
div[class*="bg-[#030108]"] div[class*="bg-[#0e071e]"] p {
  color: #1e1033 !important;
}

div[class*="bg-[#030108]"] div[class*="bg-[#0c1a14]"] button,
div[class*="bg-[#030108]"] div[class*="bg-[#1a0a0c]"] button,
div[class*="bg-[#030108]"] div[class*="bg-[#0e071e]"] button {
  color: #6b5b8a !important;
}

/* Floating Desktop Info Cards — Frosted Glass Pills */
div[class*="bg-[#030108]"] div[class*="backdrop-blur-md"][class*="border-white"] {
  background: rgba(255, 255, 255, 0.68) !important;
  backdrop-filter: blur(22px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(22px) saturate(180%) !important;
  border-color: rgba(255, 255, 255, 0.88) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    0 14px 34px -8px rgba(109, 40, 217, 0.16),
    0 0 0 1px rgba(124, 58, 237, 0.10) !important;
}

div[class*="bg-[#030108]"] div[class*="backdrop-blur-md"][class*="border-white"] * {
  color: #2e1065 !important;
}

/* Bottom Footer Metadata Strip — Subtle Purple-Slate & Safe Right Clearance */
div[class*="bg-[#030108]"] > div[class*="bottom-8"] {
  color: rgba(76, 29, 149, 0.62) !important;
  padding-right: 4.5rem !important;
}

@media (max-width: 640px) {
  div[class*="bg-[#030108]"] > div[class*="bottom-8"] {
    padding-left: 1.25rem !important;
    padding-right: 4.25rem !important;
    gap: 0.75rem !important;
  }
  div[class*="bg-[#030108]"] > div[class*="bottom-8"] > div {
    gap: 0.75rem !important;
  }
}
</style>`;

const KIOSK_LOCAL_EXACT_PATHS = new Set([
  '/',
  '/index.html',
  '/favicon.png',
  '/icon.svg',
  '/apple-touch-icon.png',
  '/manifest.webmanifest',
  '/sw.js',
  '/dev-sw.js',
  '/registerSW.js',
]);

const KIOSK_LOCAL_PREFIXES = [
  '/kiosk-assets/',
  '/assets/aistudio/',
  '/src/',
  '/@',
  '/node_modules/',
  '/pwa-',
  '/workbox-',
];

const PORTAL_EXACT_OR_PREFIX_ROUTES = [
  '/login',
  '/resetpassword',
  '/unauthorized',
  '/api',
  '/admin',
  '/sales',
  '/crm',
  '/tele',
  '/member',
  '/home',
  '/membership',
  '/destinations',
  '/about',
  '/terms-conditions',
  '/privacy-policy',
  '/refund-policy',
  '/assets',
  '/domestic',
  '/international',
  '/images',
  '/favicon.svg',
];

function isPortalPath(pathname: string): boolean {
  if (KIOSK_LOCAL_EXACT_PATHS.has(pathname)) {
    return false;
  }
  for (const prefix of KIOSK_LOCAL_PREFIXES) {
    if (pathname.startsWith(prefix)) {
      return false;
    }
  }
  return PORTAL_EXACT_OR_PREFIX_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

const HOP_BY_HOP_REQUEST_HEADERS = new Set([
  'host',
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'content-length',
  'accept-encoding',
  'origin',
  'referer',
]);

const STRIPPED_RESPONSE_HEADERS = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'content-encoding',
  'content-length',
  'x-frame-options',
  'set-cookie',
]);

function sanitizeSetCookie(cookieHeader: string, isSecure: boolean): string {
  // Remove upstream Domain restriction so session cookies bind cleanly to the kiosk host
  let updated = cookieHeader.replace(/;\s*Domain=[^;]*/gi, '');
  if (isSecure) {
    if (/;\s*SameSite=Lax/i.test(updated)) {
      updated = updated.replace(/;\s*SameSite=Lax/gi, '; SameSite=None');
    }
    if (!/;\s*Secure\b/i.test(updated)) {
      updated += '; Secure';
    }
    if (!/;\s*Partitioned\b/i.test(updated)) {
      updated += '; Partitioned';
    }
  } else {
    updated = updated.replace(/;\s*Secure\b/gi, '');
  }
  return updated;
}

async function proxyPortalRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!isPortalPath(req.path)) {
    next();
    return;
  }

  if (
    !req.originalUrl.startsWith('/') ||
    req.originalUrl.startsWith('//') ||
    req.originalUrl.includes('\\')
  ) {
    res.status(400).send('Invalid portal path');
    return;
  }

  let upstreamUrl: URL;
  try {
    upstreamUrl = new URL(req.originalUrl, UPSTREAM_ORIGIN);
    // Strict fixed-origin validation to block open proxy or protocol-relative redirects
    if (
      upstreamUrl.origin !== UPSTREAM_ORIGIN ||
      (upstreamUrl.protocol !== 'https:' && upstreamUrl.protocol !== 'http:')
    ) {
      res.status(400).send('Invalid portal path');
      return;
    }
  } catch {
    res.status(400).send('Invalid portal path');
    return;
  }

  try {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      const lowerKey = key.toLowerCase();
      if (HOP_BY_HOP_REQUEST_HEADERS.has(lowerKey) || value === undefined) {
        continue;
      }
      if (Array.isArray(value)) {
        headers.set(key, value.join(', '));
      } else {
        headers.set(key, value);
      }
    }
    headers.set('origin', UPSTREAM_ORIGIN);
    headers.set('referer', `${UPSTREAM_ORIGIN}/login`);
    headers.set('accept-encoding', 'identity');

    const method = req.method.toUpperCase();
    const hasBody = method !== 'GET' && method !== 'HEAD';
    const body =
      hasBody && Buffer.isBuffer(req.body) && req.body.length > 0
        ? new Uint8Array(req.body)
        : undefined;

    const upstreamRes = await fetch(upstreamUrl.toString(), {
      method,
      headers,
      body,
      redirect: 'manual',
    });

    res.status(upstreamRes.status);

    upstreamRes.headers.forEach((val, key) => {
      const lowerKey = key.toLowerCase();
      if (STRIPPED_RESPONSE_HEADERS.has(lowerKey)) {
        return;
      }
      if (lowerKey === 'location' && val.startsWith(UPSTREAM_ORIGIN)) {
        res.setHeader(key, val.slice(UPSTREAM_ORIGIN.length) || '/login');
        return;
      }
      res.setHeader(key, val);
    });

    const isSecure =
      req.secure || req.headers['x-forwarded-proto'] === 'https';
    const setCookies =
      typeof upstreamRes.headers.getSetCookie === 'function'
        ? upstreamRes.headers.getSetCookie()
        : [];
    if (setCookies.length > 0) {
      res.setHeader(
        'Set-Cookie',
        setCookies.map((c) => sanitizeSetCookie(c, isSecure)),
      );
    }

    const contentType = upstreamRes.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      const html = await upstreamRes.text();
      const modifiedHtml = html.includes('</head>')
        ? html.replace('</head>', `${KIOSK_CSS_INJECTION}</head>`)
        : `${KIOSK_CSS_INJECTION}${html}`;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      res.send(modifiedHtml);
      return;
    }

    const arrayBuf = await upstreamRes.arrayBuffer();
    res.send(Buffer.from(arrayBuf));
  } catch (err) {
    console.error('Portal proxy error:', err);
    res.status(502).send('Unable to reach Sync Holidays portal');
  }
}

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);

  const rawBodyParser = express.raw({type: '*/*', limit: '20mb'});

  // Mount portal reverse proxy before Vite / static middleware
  app.use((req, res, next) => {
    if (!isPortalPath(req.path)) {
      next();
      return;
    }
    rawBodyParser(req, res, (parseErr) => {
      if (parseErr) {
        next(parseErr);
        return;
      }
      void proxyPortalRequest(req, res, next);
    });
  });

  const httpServer = createHttpServer(app);

  if (!IS_PROD) {
    // Clean up any previously registered dev-sw.js from earlier sessions so stale HTML is never cached
    app.get('/dev-sw.js', (_req, res) => {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      res.send(
        `self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
  );
});`,
      );
    });

    app.get('/manifest.webmanifest', (_req, res) => {
      res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
      res.json({
        id: '/',
        name: 'Sync Holidays',
        short_name: 'SyncHolidays',
        description:
          'Full-screen kiosk web app for seamless access to Sync Holidays portal.',
        theme_color: '#7C3AED',
        background_color: '#FFFFFF',
        display: 'standalone',
        display_override: ['fullscreen', 'standalone'],
        orientation: 'any',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      });
    });

    app.use((req, res, next) => {
      if (req.path === '/' || req.path === '/index.html') {
        res.setHeader('Cache-Control', 'no-store');
      }
      next();
    });

    const disableHmr = process.env.DISABLE_HMR === 'true';
    const {createServer: createViteServer} = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: disableHmr ? false : {server: httpServer},
        ws: {server: httpServer},
        watch: disableHmr ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir, {index: 'index.html'}));
    app.get('/', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Sync Holidays Kiosk server running on http://0.0.0.0:${PORT}`);
  });
}

void startServer();
