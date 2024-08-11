import { createRouter, createWebHistory } from 'vue-router'
import TitleView from '../views/IntroView.vue'

import ChartMonth from '@/components/Main/ChartMonth.vue';
import ChartName from '@/components/Main/ChartName.vue';
import DetailComponent from '@/components/ExpenseList/DetailComponent.vue'
import InputFormComponent from '@/components/Input/InputFormComponent.vue';

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
      path: '/filter',
      name: 'filter',
      component: () => import('@/components/ExpenseList/FilterComponent.vue')
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
      path: '/detail/:recordIdx/:memberId', 
      component: DetailComponent, 
      name: 'Detail' 
    },
    {
      path: '/style',
      name: 'style',
      component: () => import('../views/StyleView.vue')
    },
    {
      path: '/inputFormComponent',
      name: 'inputFormComponent',
      component: InputFormComponent
    },
    {
      path: '/expense-list',
      name: 'expense-list',
      component: () => import('../views/ListView.vue')
    }

    
  ]
})

export default router
