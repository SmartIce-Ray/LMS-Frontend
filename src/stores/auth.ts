import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types/user'

// 开发模式 Mock 用户数据
const DEV_SKIP_AUTH = true // TODO: 上线前改为 false
const MOCK_USER: User = {
  id: '1',
  username: 'dev_user',
  email: 'dev@example.com',
  full_name: '张三',
  roles: ['employee'],
  store_id: '1',
  status: 'active',
  created_at: '2024-01-01',
  updated_at: '2024-01-01'
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(DEV_SKIP_AUTH ? MOCK_USER : null)
  const accessToken = ref<string | null>(DEV_SKIP_AUTH ? 'dev_token' : localStorage.getItem('access_token'))
  const refreshToken = ref<string | null>(DEV_SKIP_AUTH ? 'dev_refresh' : localStorage.getItem('refresh_token'))

  const isLoggedIn = computed(() => !!accessToken.value)
  const userRoles = computed(() => user.value?.roles || [])

  function setTokens(access: string, refresh: string) {
    accessToken.value = access
    refreshToken.value = refresh
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
  }

  function setUser(userData: User) {
    user.value = userData
  }

  function logout() {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  function hasRole(role: string): boolean {
    return userRoles.value.includes(role)
  }

  return {
    user,
    accessToken,
    refreshToken,
    isLoggedIn,
    userRoles,
    setTokens,
    setUser,
    logout,
    hasRole
  }
})
