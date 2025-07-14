import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";

import Dashboard from "@/pages/Dashboard.vue";
import UserProfile from "@/pages/UserProfile.vue";
import TableList from "@/pages/TableList.vue";
import Notifications from "@/pages/Notifications.vue";

const routes = [
  {
    path: "/",
    redirect: () => {
      const token = localStorage.getItem("token");
      return token ? "/dashboard" : "/login";
    },
  },
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
  {
    path: "/login",
    name: "Login",
    component: () => import("@/components/Login.vue"),
  },
];

export default routes;
