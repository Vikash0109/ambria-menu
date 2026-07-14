import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // ── Build output ───────────────────────────────────────────────────────────
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Warn if any chunk exceeds 800 kB (default is 500 kB — raise slightly for
    // large icon / data files already in this project)
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Split vendor libs into a separate cacheable chunk
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor'
          }
          if (id.includes('node_modules/react-hot-toast') || id.includes('node_modules/axios')) {
            return 'ui'
          }
        },
      },
    },
  },

  // ── Dev server proxy ────────────────────────────────────────────────────────
  // Rewrites /api/* → http://localhost:4000/api/* during `vite dev`.
  // In production the VITE_API_URL env var is used by src/lib/api.js instead.
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
