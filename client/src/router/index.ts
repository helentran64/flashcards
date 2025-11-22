import HomePage from '@/views/HomePage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/sign-up',
      name: 'signup',
      component: () => import('@/views/SignUp.vue'),
    },
    {
      path: '/log-in',
      name: 'login',
      component: () => import('@/views/LogIn.vue'),
    },
  ],
})

export default router
