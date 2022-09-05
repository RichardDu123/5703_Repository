import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/',
        name: 'layout',
        component: () => import('@/views/layout/index.vue'),
        children: [
          {
            path: '/',
            name: 'welcome',
            component: () => import('@/views/welcome/index.vue'),
          },
          {
            path: '/buy',
            name: 'buy',
            component: () => import('@/views/buyElec/index.vue'),
          },
          {
            path: '/sell',
            name: 'sell',
            component: () => import('@/views/sellElec/index.vue'),
          },
        ],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
