import { defineConfig } from 'vite'

export default defineConfig({
  base: '/benki/',
  build: {
    outDir: 'dist'
  },
  publicDir: 'public',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts']
  }
})