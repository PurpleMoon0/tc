import { createRouter, createWebHistory } from 'vue-router'

export const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/classification',
  },
  {
    path: '/classification',
    name: 'Classification',
    component: () =>
      import('../views/WordClassification/WordClassification.vue'),
    meta: { label: '分类' },
  },
  {
    path: '/modelCompare',
    name: 'ModelCompare',
    component: () => import('../views/ModelCompare/ModelCompare.vue'),
    meta: { label: '模型对比' },
  },
  // {
  //   path: '/:catchAll(.*)',
  //   name: '404',
  //   component: () => import('../views/404Page.vue'),
  // },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

export default router
