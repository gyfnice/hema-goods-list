import { createRouter, createWebHistory } from "vue-router";

import List from "@/pages/List.vue";
import Address from "@/pages/Address.vue";

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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
