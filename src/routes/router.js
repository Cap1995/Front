
// export default router;
// src/router/index.js
import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "hash",              // seguimos en hash mode (no requiere rewrites del server)
  base: "/Cap/",             // prefijo base: las URLs quedan /Cap/#/...
  routes,
  linkExactActiveClass: "nav-item active",
});

// Guards de navegación
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  // 🔐 Rutas que requieren auth (usa meta.requiresAuth en cada route)
  if (to.matched.some((r) => r.meta.requiresAuth)) {
    if (!token) {
      return next({ path: "/login", query: { redirect: to.fullPath } });
    }
  }

  // 🚫 Evita ir a /login si ya hay sesión
  if (to.matched.some((r) => r.meta.guest) && token) {
    return next("/dashboard");
  }

  // 🏠 Redirección desde raíz según sesión
  if (to.path === "/") {
    return next(token ? "/dashboard" : "/login");
  }

  next();
});

export default router;
