// import react from '@vitejs/plugin-react'
// import { defineConfig } from 'vite'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(),tailwindcss()],
// })
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
<<<<<<< HEAD
})
=======
  server: {
    proxy: {
      "/api": {
        target: "https://e-commerce-api-3wara.vercel.app",
        changeOrigin: true,
        secure: true,
        rewrite: path => path.replace(/^\/api/, "")
      }
    }
  }
})

>>>>>>> bea2942cca817471a2d0b8fbfd0ca66fb8142fc3
