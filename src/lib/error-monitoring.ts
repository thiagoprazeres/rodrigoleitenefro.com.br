/// <reference types="vite/client" />

const BEACON_URL = import.meta.env['VITE_ERROR_BEACON_URL'] as string | undefined;

type ErrorPayload = {
  type: 'error' | 'unhandledrejection';
  message: string;
  source?: string | undefined;
  line?: number | undefined;
  col?: number | undefined;
  stack?: string | undefined;
};

export function initErrorMonitoring(): void {
  if (!BEACON_URL) return;
  if (typeof navigator === 'undefined' || typeof navigator.sendBeacon !== 'function') return;

  const send = (payload: ErrorPayload): void => {
    try {
      const body = JSON.stringify({
        ...payload,
        ts: new Date().toISOString(),
        url: location.href,
        referrer: document.referrer || undefined,
        ua: navigator.userAgent,
      });
      navigator.sendBeacon(BEACON_URL, body);
    } catch {
      /* noop */
    }
  };

  window.addEventListener('error', (event) => {
    send({
      type: 'error',
      message: event.message,
      source: event.filename,
      line: event.lineno,
      col: event.colno,
      stack: event.error instanceof Error ? event.error.stack : undefined,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    send({
      type: 'unhandledrejection',
      message: reason instanceof Error ? reason.message : String(reason),
      stack: reason instanceof Error ? reason.stack : undefined,
    });
  });
}
