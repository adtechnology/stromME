import { defineConfig } from 'vite'

export default defineConfig({
  base: '/stromME/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  server: {
    port: 3000,
    open: true
  },
  define: {
    'process.env': {}
  }
})