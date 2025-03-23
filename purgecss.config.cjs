module.exports = {
    content: [
      './index.html',
      './components/**/*.html',
      './assets/js/**/*.js'
    ],
    css: [
      './assets/css/main.css',
      './assets/css/portada.css',
      './assets/css/restaurante.css'
    ],
    output: './assets/css/purged/',
    safelist: {
      standard: [
        /^word-/,
        /^section-/,
        /^returning-/,
        /^social-/,
        /^logo-/,
        /^reset-/,
        /^active$/,
        /^fa-/,
        /^icon/
      ],
      deep: [/hover$/, /active$/]
    }
  }