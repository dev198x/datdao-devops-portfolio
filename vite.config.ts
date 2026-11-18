import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // GitHub Pages serves under /<repo>/; Vercel and local dev serve from root.
  base: process.env.GITHUB_ACTIONS ? '/datdao-devops-portfolio/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
