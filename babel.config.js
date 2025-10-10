// babel.config.js
const plugins = []

if (process.env.NODE_ENV === 'production') {
  // elimina console.log / warn / error del bundle de prod
  plugins.push('transform-remove-console')
}

module.exports = {
  presets: ['@vue/app'],
  plugins
}