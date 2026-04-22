/// <reference types="vite/client" />

interface FbqFn {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: FbqFn;
  loaded: boolean;
  version: string;
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
    fbq: FbqFn;
    _fbq?: FbqFn;
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
  const fbq: FbqFn = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as FbqFn;

  fbq.queue = [];
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';

  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;

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
