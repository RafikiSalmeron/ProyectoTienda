import Vue from 'vue'
import App from './App.vue'

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { firestorePlugin } from 'vuefire'
Vue.use(firestorePlugin)

import VueConfirmDialog from 'vue-confirm-dialog'
Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Notifications from 'vue-notification'
Vue.use(Notifications)

import Login from './components/login.vue'
Vue.component(Login)

import Home from './components/home.vue'
Vue.component(Home)

import Chart from './components/chart.vue'
Vue.component(Chart)

import Admin from './components/admin.vue'
Vue.component(Admin)

import AboutUs from './components/aboutUs.vue'
Vue.component(AboutUs)

import Profile from './components/profile.vue'
Vue.component(Profile)

import Register from './components/register.vue'
Vue.component(Register)

import ProductsList from './components/productsList.vue'
Vue.component(ProductsList)

import ProductDetail from './components/productDetail.vue'
Vue.component(ProductDetail)

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  { path: '/chart', name: 'chart', component: Chart },
  { path: '/admin', name: 'admin', component: Admin },
  { path: '/aboutUs', name: 'aboutUs', component: AboutUs },
  { path: '/profile', name: 'profile', component: Profile },
  { path: '/register', name: 'register', component: Register },
  { path: '/productsList', name: 'productList', component: ProductsList },
  { path: '/productDetail/:id', name: 'productDetail', component: ProductDetail },
]

const router = new VueRouter({
  routes // short for `routes: routes`
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
