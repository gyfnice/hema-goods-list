import { createApp } from 'vue'

import { Card, List, NavBar, Cell } from "vant";

import "vant/lib/index.css";

import router from './router/index.js';
import App from "./App.vue";


import './reset.css'

const app = createApp(App)

app.use(router).use(NavBar).use(Card).use(List).use(Cell);

app.mount("#app");
