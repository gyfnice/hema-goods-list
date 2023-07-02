import { createRouter, createWebHistory } from "vue-router";

import List from "@/pages/List.vue";
import About from "@/pages/About.vue";

const routes = [
  {
    path: "/",
    name: "List",
    component: List
  },
  {
    path: "/about",
    name: "About",
    component: About
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
