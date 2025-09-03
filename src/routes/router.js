import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  mode: "hash",
  linkExactActiveClass: "nav-item active",
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  // 🔐 Bloquea /dashboard si no hay token
  if (to.matched.some((r) => r.meta.requiresAuth)) {
    if (!token) {
      return next({ path: "/login", query: { redirect: to.fullPath } });
    }
  }

  // 🚫 Evita ir a /login si ya hay token
  if (to.matched.some((r) => r.meta.guest) && token) {
    return next("/dashboard");
  }

  // 🌐 Al entrar a raíz decide según token
  if (to.path === "/") {
    return next(token ? "/dashboard" : "/login");
  }

  next();
});

export default router;
