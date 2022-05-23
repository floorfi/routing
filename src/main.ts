import "./assets/tailwind.css";

import { createApp } from "vue";
import App from "./App.vue"
const app = createApp(App)


import axios from 'axios'
import VueAxios from 'vue-axios'
app.use(VueAxios, axios);
app.provide('axios', app.config.globalProperties.axios)


import router from "./router";
app.use(router);


import { library } from "@fortawesome/fontawesome-svg-core";
import {faCarSide, faGear, faLocationArrow, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faCarSide, faLocationArrow, faTimesCircle, faGear);
app.component("font-awesome-icon", FontAwesomeIcon)


import vfmPlugin from 'vue-final-modal'
app.use(vfmPlugin)


app.config.globalProperties.$map = null
app.mount('#app');
