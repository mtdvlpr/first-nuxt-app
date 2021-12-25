import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Movies For You',
    title: 'first-nuxt-app',
    meta: [{ name: 'format-detection', content: 'telephone=no' }],
  },

  modern: process.env.NODE_ENV === 'production' ? 'client' : false,

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~plugins/axios',
    '~plugins/common',
    '~plugins/console',
    '~plugins/constants',
    '~plugins/flash',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/onesignal',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    '@nuxtjs/auth-next',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true,
    debug: process.env.NODE_ENV === 'development',
  },

  proxy: {
    '/onesignal': {
      target: 'https://onesignal.com/api/v1/notifications',
      pathRewrite: { '^/onesignal': '' },
    },
  },

  oneSignal: {
    init: {
      appId: process.env.ONESIGNAL_APP_ID,
      allowLocalhostAsSecureOrigin: true,
    },
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    meta: {
      name: 'Movies For You',
      description: 'A simple movie collection application.',
      theme_color: colors.blue.darken2,
      ogHost:
        process.env.NODE_ENV === 'production'
          ? 'http://643622.infhaarlem.nl/'
          : 'http://localhost:3000/',
    },
    manifest: {
      lang: 'en',
      name: 'Movies For You',
      short_name: 'M4Y',
    },
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/auth/login',
            method: 'post',
            propertyName: 'token',
          },
          logout: false,
          user: {
            url: '/auth/user',
            method: 'get',
            propertyName: false,
          },
        },
      },
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        light: {
          primary: colors.blue.darken2,
          accent: colors.blue.accent1,
          secondary: colors.grey.darken3,
          info: colors.blue,
          warning: colors.amber,
          error: colors.red.accent2,
          success: colors.green,
        },
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.blue,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  serverMiddleware: {
    '/api': '~/api',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    watch: ['api', 'static'],
    extend(config, { isClient }) {
      if (isClient) {
        config.devtool = 'source-map'
      }
    },
  },

  publicRuntimeConfig: {
    oneSignalAppId: process.env.ONESIGNAL_APP_ID,
    oneSignalApiKey: process.env.ONESIGNAL_API_KEY,
  },

  privateRuntimeConfig: {
    movieApiKey: process.env.MOVIE_API_KEY,
  },
}
