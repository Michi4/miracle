import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    // legacy bundle + core-js polyfills so the site also runs on older
    // browsers/devices (old iOS Safari etc.) instead of a blank page.
    legacy({
      targets: ['defaults', 'iOS >= 12', 'Safari >= 12'],
      modernPolyfills: true,
    }),
  ],
  server: { host: true, port: 5173 },
  test: { exclude: ['**/node_modules/**', '**/dist/**', 'server/**'] },
})
