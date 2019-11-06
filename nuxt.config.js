export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: 'Open Market Demo',
    // title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
      // { name: 'msapplication-TileColor', content: '#ffffff' },
      // { name: 'msapplication-TileImage', content: '/ms-icon-144x144.png' },
      // { name: 'theme-color', content: '#ffffff' },
    ],
    link: [
      // { rel: 'manifest', href: '/manifest.json' },
      // { rel: 'apple-touch-icon', size: '57x57', href: '/apple-icon-57x57.png' },
      // { rel: 'apple-touch-icon', size: '60x60', href: '/apple-icon-60x60.png' },
      // { rel: 'apple-touch-icon', size: '72x72', href: '/apple-icon-72x72.png' },
      // { rel: 'apple-touch-icon', size: '76x76', href: '/apple-icon-76x76.png' },
      // { rel: 'apple-touch-icon', size: '114x114', href: '/apple-icon-114x114.png' },
      // { rel: 'apple-touch-icon', size: '120x120', href: '/apple-icon-120x120.png' },
      // { rel: 'apple-touch-icon', size: '144x144', href: '/apple-icon-144x144.png' },
      // { rel: 'apple-touch-icon', size: '152x152', href: '/apple-icon-152x152.png' },
      // { rel: 'apple-touch-icon', size: '180x180', href: '/apple-icon-180x180.png' },
      // { rel: 'icon', type: 'image/png', size: '192x192', href: '/android-icon-192x192.png' },
      // { rel: 'icon', type: 'image/png', size: '32x32', href: '/favicon-32x32.png' },
      // { rel: 'icon', type: 'image/png', size: '96x96', href: '/favicon-96x96.png' },
      // { rel: 'icon', type: 'image/png', size: '16x16', href: '/favicon-16x16.png' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      // { rel: 'stylesheet', href: 'http://code.highcharts.com/css/themes/dark-unica.css' }
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#555' },
  /*
   ** Global CSS
   */
  css: ['@/assets/app.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/directives' },
    { src: '~/plugins/filters' },
    { src: '~/plugins/methods' },
    { src: '~/plugins/clipboard', mode: 'client' },
    { src: '~plugins/vue-api-query' },
    { src: '~/plugins/market', mode: 'client' },
    // { src: '~/plugins/cosmos' },
    // { src: '~/plugins/identicon', mode: 'client' },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org/docs/
    ['bootstrap-vue/nuxt', { css: false, bvCSS: false }],
    // Doc: https://axios.nuxtjs.org/usage
    ['@nuxtjs/axios', { baseURL: '/' }],
    '@nuxtjs/proxy',
    'cookie-universal-nuxt',
    [
      'nuxt-fontawesome',
      {
        component: 'fa',
        imports: [
          {
            set: '@fortawesome/free-solid-svg-icons',
            // import whole set
            icons: ['fas'],
          },
        ],
      },
    ],
    ['@nuxtjs/moment', { defaultLocale: 'en' }],
  ],
  router: {
    linkExactActiveClass: 'active',
    linkActiveClass: 'active',
  },
  serverMiddleware: [
    // API middleware
    '~/api',
  ],
  proxy: {
    '/_lcd': {
      pathRewrite: { '^/_lcd': '' },
      target: process.env.REST_URL || 'http://localhost:1317',
      ws: false,
    },
    '/_gql': {
      pathRewrite: { '^/_gql': '' },
      target: process.env.GQL_URL || 'http://localhost:8080/v1/graphql',
      ws: true,
    },
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
}
