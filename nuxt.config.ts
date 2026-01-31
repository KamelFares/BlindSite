import { defineNuxtConfig } from 'nuxt/config'

// Nuxt 3 configuration for the BlindSite empathy experience
// We use the `app/` directory as the source directory (app.vue, pages, components, composables).
export default defineNuxtConfig({
  srcDir: 'app',
  modules: ['@nuxtjs/i18n'],
  // Recommended by Nuxt/Nitro to lock feature behavior.
  compatibilityDate: '2026-01-30',
  experimental: {
    // Workaround: appManifest currently triggers Vite resolution errors for
    // "#app-manifest" on some setups.
    appManifest: false,
    // Also disable the outdated-build checker which relies on the manifest.
    checkOutdatedBuildInterval: false,
  },
  vite: {
    // Avoid HMR websocket port collisions on Windows.
    server: {
      hmr: {
        port: 24679,
      },
    },
  },
  i18n: {
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    locales: [
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' },
      { code: 'de', iso: 'de-DE', name: 'Deutsch', file: 'de.json' },
    ],
    // nuxt-i18n loads locales from within `srcDir` by default.
    // With `srcDir: 'app'`, this points at `BlindSite/app/locales/*`.
    langDir: 'locales',
  },
} as any)









