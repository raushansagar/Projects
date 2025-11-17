import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // frontend port
    cors: {
      origin: "http://localhost:8080", // backend URL
      credentials: true,                // allow cookies
    },
  },
})
