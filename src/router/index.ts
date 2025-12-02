import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const routes: RouteRecordRaw[] = [
  // 登录页（无布局）
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/Login.vue'),
    meta: { requiresAuth: false }
  },

  // 需要认证的页面（使用主布局）
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/Home.vue')
      },
      {
        path: 'courses',
        name: 'courses',
        component: () => import('@/pages/courses/CourseList.vue')
      },
      {
        path: 'courses/:id',
        name: 'course-detail',
        component: () => import('@/pages/courses/CourseDetail.vue')
      },
      {
        path: 'courses/:id/learn',
        name: 'course-learn',
        component: () => import('@/pages/courses/Learn.vue')
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/pages/Profile.vue')
      },
      {
        path: 'messages',
        name: 'messages',
        component: () => import('@/pages/Messages.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫（开发模式下禁用认证）
const DEV_SKIP_AUTH = true // TODO: 上线前改为 false

router.beforeEach((to, _from, next) => {
  if (DEV_SKIP_AUTH) {
    next()
    return
  }

  const token = localStorage.getItem('access_token')
  if (to.meta.requiresAuth && !token) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
