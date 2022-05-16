import { createApp } from "vue";
import App from "./App.vue";
import "./assets/tailwind.css";

import axios from 'axios'
import VueAxios from 'vue-axios'

import router from "./router";
// import store from './store'

const app = createApp(App)


import { library } from "@fortawesome/fontawesome-svg-core";
import {faCarSide, faLocationArrow} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faCarSide, faLocationArrow);
app.component("font-awesome-icon", FontAwesomeIcon)


app.use(router);
app.use(VueAxios, axios);
app.provide('axios', app.config.globalProperties.axios)
app.config.globalProperties.$map = null
app.mount('#app');
