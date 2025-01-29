import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',  // Empty so that is the default
      name: 'info',
      component: () => import('../views/InfoView.vue'),
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('../views/CreateView.vue'),
    },
    {
      path: '/change',
      name: 'change',
      component: () => import('../views/ChangeView.vue'),
    },
    {
      path: '/sensor',
      name: 'sensor',
      component: () => import('../views/SensorView.vue'),
    },
    {
      path: '/location',
      name: 'location',
      component: () => import('../views/LocationView.vue'),
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/HistoryView.vue'),
    },
    {
      path: '/description',
      name: 'description',
      component: () => import('../views/DescriptionView.vue'),
    },
  ],
})

export default router
