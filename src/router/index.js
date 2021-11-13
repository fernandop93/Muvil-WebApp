import Vue from 'vue'
import VueRouter from 'vue-router'
//import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/operator',
    name: 'Operator',
    component: () => import(/* webpackChunkName: "operator" */ '../views/Operator.vue')
  },
  {
    path: '/service',
    name: 'Service',
    component: () => import(/* webpackChunkName: "service" */ '../views/Service.vue')
  },
  {
    path: '/school',
    name: 'School',
    component: () => import(/* webpackChunkName: "school" */ '../views/School.vue')
  },
  {
    path: '/child',
    name: 'Child',
    component: () => import(/* webpackChunkName: "child" */ '../views/Child.vue')
  },
  {
    path: '/vehicule',
    name: 'Vehicule',
    component: () => import(/* webpackChunkName: "vehicule" */ '../views/Vehicule.vue')
  },
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
