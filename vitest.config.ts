import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    css: false,
    // The heavier component suites (ActionPlan, EditorAskAI) pass in 1–3 s
    // alone but go past the 5 s default on a loaded machine or CI runner.
    testTimeout: 20_000,
  },
});
