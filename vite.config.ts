import { defineConfig, type Plugin } from 'vite';
import { resolve } from 'node:path';

const gscVerificationPlugin = (): Plugin => ({
  name: 'gsc-verification',
  transformIndexHtml: {
    order: 'pre',
    handler(html, ctx) {
      const token = ctx.server?.config.env['VITE_GSC_VERIFICATION'] ?? process.env['VITE_GSC_VERIFICATION'];
      if (!token) return html;
      return html.replace(
        /<head>/,
        `<head>\n    <meta name="google-site-verification" content="${token}" />`,
      );
    },
  },
});

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  plugins: [gscVerificationPlugin()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        privacidade: resolve(__dirname, 'src/privacidade.html'),
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: { api: 'modern-compiler' },
    },
  },
});
