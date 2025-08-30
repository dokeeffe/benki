import { defineConfig } from 'vite'

export default defineConfig({
  base: '/benki/',
  build: {
    outDir: 'dist'
  },
  publicDir: 'public'
})