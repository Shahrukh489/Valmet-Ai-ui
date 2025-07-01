import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: [
      '@cloudinary/react',
      '@cloudinary/url-gen'
      // Add any other modules you are importing
    ],
  },
  plugins: [react()],
   resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
