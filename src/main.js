import { createApp } from "vue";
import App from "./App.vue";
import "./assets/tailwind.css";

import axios from 'axios'
import VueAxios from 'vue-axios'

import router from "./router";
import store from './store'

const app = createApp(App)

app.use(store);
app.use(router);
app.use(VueAxios, axios);

app.mount('#app');
