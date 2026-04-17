import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/simple-car-rental-2/', // This allows GitHub Pages to find your files
  plugins: [
    react(),
    tailwindcss(), // Keep all your plugins in this one list
  ],
})