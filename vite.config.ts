import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    rolldownOptions: {
      output: {
        // React într-o bucată separată: se schimbă rar, deci telefonul o păstrează în cache
        // la actualizările aplicației și descarcă din nou doar codul OncoSentinel
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ }
          ]
        }
      }
    }
  },
  server: {
    port: 5173,
    open: false,
    host: true
  }
});
