import { createRouter, createWebHistory } from 'vue-router'
import TitleView from '../views/IntroView.vue'
import MainView from '../views/MainView.vue'
import ExpenseList from '../components/ExpenseList/ExpenseList.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'intro',
      component: TitleView
    },
    {
      path: '/main',
      name: 'main',
      component: MainView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/expense-list',
      name: 'expense-list',
      component: ExpenseList
    }
  ]
})

export default router
