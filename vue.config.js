// vue.config.js
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/Cap/' : '/',
  // opcional
  // outputDir: 'dist',          // por defecto
  // assetsDir: 'static',        // si quieres mover js/css/img a /Cap/static/
  productionSourceMap: false
}
