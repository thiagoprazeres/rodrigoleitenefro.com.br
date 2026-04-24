import './styles/main.scss';
import { initAnalytics, trackWhatsAppCTA } from './lib/analytics';
import { initErrorMonitoring } from './lib/error-monitoring';
import { initWhatsAppForm } from './whatsapp-form';

initErrorMonitoring();
initAnalytics();
initWhatsAppForm();

const wireWhatsAppTracking = (): void => {
  document.querySelectorAll<HTMLAnchorElement>('a[href*="wa.me/"]').forEach((link) => {
    link.addEventListener('click', () => trackWhatsAppCTA());
  });
  window.addEventListener('whatsapp:submit', () => trackWhatsAppCTA());
};

wireWhatsAppTracking();
