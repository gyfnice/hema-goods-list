import { createRouter, createWebHistory } from "vue-router";

import List from "@/pages/List.vue";
import Address from "@/pages/Address.vue";
import AuthToken from "@/pages/AuthToken.vue";

const routes = [
  {
    path: "/",
    name: "List",
    component: List
  },
  {
    path: "/address",
    name: "address",
    component: Address
  },
  {
    path: "/auth",
    name: "authToken",
    component: AuthToken
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
