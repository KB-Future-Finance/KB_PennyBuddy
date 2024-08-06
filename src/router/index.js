import { createRouter, createWebHistory } from 'vue-router'
import TitleView from '../views/IntroView.vue'
import ExpenseList from '../components/ExpenseList/ExpenseList.vue';
import ChartMonth from '@/components/Main/ChartMonth.vue';
import ChartName from '@/components/Main/ChartName.vue';
import input from '@/components/Input/InputFormComponent.vue'
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
    },
    {
      path: '/chartmonth',
      name: 'chartmonth',
      component: ChartMonth
    },
    {
      path: '/chartName',
      name: 'chartName',
      component: ChartName
    },
    {
      path: '/input',
      name: 'input',
      component: input
    }
  ]
})

export default router
