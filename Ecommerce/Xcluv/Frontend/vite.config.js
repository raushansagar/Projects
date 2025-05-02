import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/lonin': 'http://localhost:9000',
    }
  },
  plugins: [react()],
})
