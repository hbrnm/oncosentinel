import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    env: { TZ: 'Europe/Bucharest' },
    setupFiles: ['./src/test/setup.ts']
  }
});
