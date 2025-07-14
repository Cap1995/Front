module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    "@vue/prettier", // para aplicar reglas de Prettier
    "prettier" // 👈 importante: desactiva reglas conflictivas con Prettier
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "vue/multi-word-component-names": "off"
  },
};