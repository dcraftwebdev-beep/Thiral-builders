import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
    css: {
    devSourcemap: true,
  },

  build: {
    target: 'es2018',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion', 'gsap', 'lenis'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  }
});
