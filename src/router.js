import Vue from 'vue'
import Router from 'vue-router'
import Tool from './views/tool/index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'tool',
      component: Tool
    },
    {
      path: '/config',
      name: 'config',
      component: () => import('./views/config/index.vue')
    }
  ]
})
