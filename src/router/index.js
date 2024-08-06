import { createRouter, createWebHistory } from 'vue-router'
import TitleView from '../views/IntroView.vue'
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
      component: () => import('../views/MainView.vue')
    },
    {
      path: '/style',
      name: 'style',
      component: () => import('../views/StyleView.vue')
    },
    {
      path: '/expense-list',
      name: 'expense-list',
      component: ExpenseList
    }
  ]
})

export default router
