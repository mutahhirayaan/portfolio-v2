import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('@mui') || id.includes('@emotion')) return 'mui';
          if (id.includes('framer-motion')) return 'motion';
          if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/')) return 'react-vendor';
        },
      },
    },
  },
});
