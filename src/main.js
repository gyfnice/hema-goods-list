import { createApp } from 'vue'

import {
  Area,
  Search,
  Button,
  Card,
  Space,
  Col,
  Tag,
  Row,
  Field,
  Picker,
  Image,
  Popup,
  List,
  Toast,
  Icon,
  Stepper,
  ActionSheet,
  NavBar,
  Cell,
  Dialog,
  Swipe,
  SwipeItem,
  TreeSelect,
  SubmitBar
} from "vant";
import _ from 'lodash';
import "vant/lib/index.css";

import router from './router/index.js';
import App from "./App.vue";
import { store } from "./store/index.js";


import './reset.css'
import './style.css'

const app = createApp(App)
window._ = _;
app
  .use(store)
  .use(router)
  .use(Icon)
  .use(Button)
  .use(Col)
  .use(Toast)
  .use(Dialog)
  .use(Swipe)
  .use(SwipeItem)
  .use(Image)
  .use(Tag)
  .use(Space)
  .use(Row)
  .use(Field)
  .use(Popup)
  .use(Search)
  .use(Area)
  .use(Picker)
  .use(SubmitBar)
  .use(ActionSheet)
  .use(NavBar)
  .use(Stepper)
  .use(Card)
  .use(List)
  .use(TreeSelect)
  .use(Cell);

app.mount("#app");
