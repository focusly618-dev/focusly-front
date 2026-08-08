import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  cacheDir:
    '/private/tmp/claude-501/-Users-alexis-Developer/dbdddb4c-286f-49d3-ae01-601a4e94f3cb/scratchpad/vitecache1',
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
    fileParallelism: false,
  },
});
