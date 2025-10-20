import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App";

// router setup
// import routes from "./routes/routes";
import router from "./routes/router";

// Plugins
import GlobalComponents from "./globalComponents";
import GlobalDirectives from "./globalDirectives";
import Notifications from "./components/NotificationPlugin";

// MaterialDashboard plugin
import MaterialDashboard from "./material-dashboard";

import Chartist from "chartist";
import '@fortawesome/fontawesome-free/css/all.min.css'


// configure router
// const router = new VueRouter({
//   routes, // short for routes: routes
//   linkExactActiveClass: "nav-item active",
// });

Vue.prototype.$Chartist = Chartist;

Vue.use(VueRouter);
Vue.use(MaterialDashboard);
Vue.use(GlobalComponents);
Vue.use(GlobalDirectives);
Vue.use(Notifications);

Vue.material.config = {
  validation: false,
};

Vue.prototype.$toast = {
  open(message) {
    if (Vue.prototype.$notify) {
      Vue.prototype.$notify({ message, type: "info" });
    } else {
      console.warn("❌ $notify no está disponible.");
    }
  },
  success(message) {
    if (Vue.prototype.$notify) {
      Vue.prototype.$notify({ message, type: "success" });
    }
  },
  error(message) {
    if (Vue.prototype.$notify) {
      Vue.prototype.$notify({ message, type: "danger" });
    }
  },
};

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: (h) => h(App),
  router,
  data: {
    Chartist: Chartist,
  },
});
