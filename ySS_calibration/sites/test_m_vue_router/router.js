//import { createMemoryHistory, createRouter } from 'vue-router'
//import { VueRouter } from "/yss/libs/vue-router.js";
//let vr = require('/yss/libs/vue-router.js');
//import { createMemoryHistory  } from "/yss/libs/vue-router.esm.browser.min.js";

import HomeView from './res/HomeView.vue'
import AboutView from './res/AboutView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: AboutView },
]

const router = VueRouter.createRouter({
  history: VueRouter.createMemoryHistory(),
  routes,
})

export default router