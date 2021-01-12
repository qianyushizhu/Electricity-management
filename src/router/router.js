import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../components/home/home'
import login from '../components/login/login'
import welcome from '../components/home/welcome.vue'
import user from '../components/user/users.vue'
import right from '../components/right/right.vue'
import roles from '../components/roles/roles.vue'
import category from '../components/category/category.vue'
import params from '../components/params/params.vue'
import goods from '../components/goods/goods.vue'
import add from '../components/goods/children/add.vue'
import order from '../components/order/order.vue'
import reports from '../components/reports/reports.vue'

Vue.use(VueRouter)

const routes = [
    {path:'/',redirect:'/login'},
  { path: '/login', component: login },
  {
    path: '/home',
    component: home,
    redirect:'/welcome',
    children: [
      { path:'/welcome',component: welcome},
      { path:'/users',component: user},
      { path:'/rights',component: right},
      { path:'/roles',component: roles},
      { path:'/categories',component: category},
      { path:'/params',component: params},
      { path: '/goods', component: goods },
       {path:'/goods/add',component:add},
       {path:'/orders',component:order},
       {path:'/reports',component:reports}
    ]
  }
    
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')

  next()
   
})

export default router
