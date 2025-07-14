import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes"; // o desde donde definas tus rutas

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  mode: "hash", // 👈 ya estás usando hash, esto lo confirma
  linkExactActiveClass: "nav-item active",
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  // 🔐 Rutas protegidas
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) {
      next("/login");
    } else {
      next();
    }
  } else if (to.path === "/") {
    // 👇 Al acceder a raíz, decidir a dónde redirigir
    if (token) {
      next("/dashboard");
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
