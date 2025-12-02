<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/auth'
import { Loader2 } from 'lucide-vue-next'
import api from '@/lib/api'
import type { LoginResponse } from '@/types/user'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const shake = ref(false)

const isFormValid = computed(() => username.value.length > 0 && password.value.length > 0)

async function handleLogin() {
  if (!isFormValid.value) {
    error.value = '请输入用户名和密码'
    triggerShake()
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await api.post<LoginResponse>('/auth/login', {
      username: username.value,
      password: password.value
    })

    const { access_token, refresh_token, user } = response.data
    authStore.setTokens(access_token, refresh_token)
    authStore.setUser(user)

    router.push('/')
  } catch (err: unknown) {
    const axiosError = err as { response?: { data?: { detail?: string } } }
    error.value = axiosError.response?.data?.detail || '登录失败，请检查用户名和密码'
    triggerShake()
  } finally {
    loading.value = false
  }
}

function triggerShake() {
  shake.value = true
  setTimeout(() => {
    shake.value = false
  }, 500)
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
    <!-- Logo 区域 -->
    <div class="mb-8 text-center">
      <div class="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-[var(--shadow-button)]">
        <span class="text-primary-foreground font-bold text-2xl">S</span>
      </div>
      <h1 class="text-2xl font-bold text-foreground">SmartIce LMS</h1>
      <p class="text-muted-foreground mt-1">员工培训管理系统</p>
    </div>

    <!-- 登录卡片 -->
    <Card
      class="w-full max-w-sm border-border bg-card shadow-[var(--shadow-card)]"
      :class="{ 'animate-shake': shake }"
    >
      <CardContent class="pt-6">
        <form class="flex flex-col gap-5" @submit.prevent="handleLogin">
          <div class="space-y-2">
            <Label for="username" class="text-foreground">用户名</Label>
            <Input
              id="username"
              v-model="username"
              type="text"
              placeholder="请输入用户名"
              class="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
              :class="{ 'border-destructive': error && !username }"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="password" class="text-foreground">密码</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="请输入密码"
              class="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
              :class="{ 'border-destructive': error && !password }"
              required
            />
          </div>

          <!-- 错误提示 -->
          <div
            v-if="error"
            class="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2"
          >
            {{ error }}
          </div>

          <!-- 登录按钮 -->
          <Button
            type="submit"
            class="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-button)] transition-all duration-200 active:scale-[0.98]"
            :disabled="loading"
          >
            <Loader2 v-if="loading" class="w-5 h-5 mr-2 animate-spin" />
            {{ loading ? '登录中...' : '登录' }}
          </Button>
        </form>
      </CardContent>
    </Card>

    <!-- 底部版权 -->
    <p class="mt-8 text-xs text-muted-foreground">
      &copy; 2024 有点东西餐饮集团
    </p>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
</style>
