import {
  defineConfig,
  minimal2023Preset,
} from '@vite-pwa/assets-generator/config';

// Icons for the installable app, from public/logo.svg. Regenerate after
// changing the logo with `yarn generate-pwa-assets` (writes into public/).
const BRAND = '#008767';

export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...minimal2023Preset,
    // Maskable (Android, ChromeOS) and Apple icons are drawn on a full tile
    // of the same green, so the OS's own rounding never shows a seam.
    maskable: {
      ...minimal2023Preset.maskable,
      resizeOptions: { background: BRAND, fit: 'contain' },
    },
    // iOS rounds the corners itself and needs no safe zone: less padding
    apple: {
      ...minimal2023Preset.apple,
      padding: 0.12,
      resizeOptions: { background: BRAND, fit: 'contain' },
    },
  },
  images: ['public/logo.svg'],
});
