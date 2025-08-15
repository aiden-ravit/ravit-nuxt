// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // 클라우드플레어 워커 호환성 설정
  nitro: {
    preset: 'cloudflare'
  }
})
