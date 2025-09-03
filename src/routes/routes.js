import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";

import Dashboard from "@/pages/Dashboard.vue";
import UserProfile from "@/pages/UserProfile.vue";
import TableList from "@/pages/TableList.vue";
import Notifications from "@/pages/Notifications.vue";

const routes = [
  // 👇 raíz siempre al login; la lógica de token la maneja el beforeEach
  { path: "/", redirect: "/login" },

  // 👤 Login público
  {
    path: "/login",
    name: "Login",
    meta: { guest: true }, // 👈 importante
    component: () => import("@/components/Login.vue"),
  },

  // 🔒 Rutas protegidas bajo el layout
  {
    path: "/",
    component: DashboardLayout,
    children: [
      {
        path: "dashboard",
        name: "Panel Principal",
        component: Dashboard,
        meta: { requiresAuth: true },
      },
      {
        path: "user",
        name: "User Profile",
        component: UserProfile,
        meta: { requiresAuth: true },
      },
      {
        path: "table",
        name: "Table List",
        component: TableList,
        meta: { requiresAuth: true },
      },
      {
        path: "notifications",
        name: "Notifications",
        component: Notifications,
        meta: { requiresAuth: true },
      },
    ],
  },

  // 🧯 catch-all
  { path: "*", redirect: "/login" },
];

export default routes;
