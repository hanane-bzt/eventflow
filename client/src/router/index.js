
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import CreateEvent from "../views/CreateEvent.vue"

const routes = [
  { path:'/', redirect:'/dashboard'},
  { path:'/login', component:Login},
  { path:'/dashboard', component:Dashboard},
  { path: "/create-event", component:CreateEvent}
]

const router = createRouter({
  history:createWebHistory(),
  routes
})

router.beforeEach((to)=>{
 const auth = useAuthStore()
 if(!auth.isAuthenticated && to.path!='/login') return '/login'
})

export default router
