import { createApp } from 'vue';

import {
    Area,
    Search,
    Button,
    Slider,
    Badge,
    Tabbar,
    TabbarItem,
    Loading,
    Card,
    Space,
    Col,
    Tag,
    Row,
    Field,
    Collapse,
    CollapseItem,
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
    Switch,
    Sticky,
    Swipe,
    Form,
    CellGroup,
    SwipeItem,
    TreeSelect,
    Divider,
    FloatingPanel,
    FloatingBubble,
    Checkbox,
    SubmitBar
} from 'vant';
import _ from 'lodash';
import 'vant/lib/index.css';

import { recordCollectStore } from '@/api/index.js';
import '@/utils/x_check.js';

import router from './router/index.js';
import App from './App.vue';
import { store } from './store/index.js';

import './reset.css';
import './style.css';

recordCollectStore().then((list) => {
    store.commit('set_collect_all_goods_list', list);
});

const app = createApp(App);
window._ = _;
app.use(store)
    .use(router)
    .use(Icon)
    .use(FloatingPanel)
    .use(Divider)
    .use(Sticky)
    .use(Switch)
    .use(FloatingBubble)
    .use(Loading)
    .use(Badge)
    .use(Button)
    .use(Slider)
    .use(Tabbar)
    .use(TabbarItem)
    .use(Collapse)
    .use(CollapseItem)
    .use(Col)
    .use(Toast)
    .use(Dialog)
    .use(Swipe)
    .use(SwipeItem)
    .use(Form)
    .use(Checkbox)
    .use(CellGroup)
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

app.mount('#app');
