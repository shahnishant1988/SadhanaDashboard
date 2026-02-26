import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For GitHub Pages: use repo name as base path if deploying to username.github.io/repo-name
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === 'true' ? '/SadhanaDashboard/' : '/',
})
