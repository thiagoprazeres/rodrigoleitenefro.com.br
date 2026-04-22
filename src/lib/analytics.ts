declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

const GA_ID = import.meta.env['VITE_GA_MEASUREMENT_ID'] as string | undefined;
const ADS_ID = import.meta.env['VITE_GOOGLE_ADS_ID'] as string | undefined;
const ADS_CONV = import.meta.env['VITE_GOOGLE_ADS_CONVERSION'] as string | undefined;
const PIXEL_ID = import.meta.env['VITE_META_PIXEL_ID'] as string | undefined;

export function initAnalytics(): void {
  if (GA_ID) loadGtag(GA_ID);
  if (PIXEL_ID) loadMetaPixel(PIXEL_ID);
}

function loadGtag(measurementId: string): void {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { anonymize_ip: true });

  if (ADS_ID) window.gtag('config', ADS_ID);
}

function loadMetaPixel(pixelId: string): void {
  // Meta Pixel base code
  window.fbq = function (...args: unknown[]) {
    if (window.fbq.callMethod) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      (window.fbq as unknown as { callMethod: (...a: unknown[]) => void }).callMethod(...args);
    } else {
      (window.fbq as unknown as { queue: unknown[] }).queue.push(args);
    }
  };
  if (!window._fbq) window._fbq = window.fbq;
  (window.fbq as unknown as { push: unknown; loaded: boolean; version: string; queue: unknown[] }).push = window.fbq;
  (window.fbq as unknown as { loaded: boolean }).loaded = true;
  (window.fbq as unknown as { version: string }).version = '2.0';
  (window.fbq as unknown as { queue: unknown[] }).queue = [];

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);

  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');
}

export function trackWhatsAppCTA(): void {
  if (GA_ID) {
    window.gtag('event', 'conversion', {
      send_to: ADS_ID && ADS_CONV ? `${ADS_ID}/${ADS_CONV}` : undefined,
      event_category: 'CTA',
      event_label: 'whatsapp_click',
    });
  }
  if (PIXEL_ID) {
    window.fbq('track', 'Contact');
    window.fbq('track', 'Lead');
  }
}
