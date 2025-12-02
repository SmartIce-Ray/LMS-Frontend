<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

function goToLogin() {
  router.push('/login')
}

function goToDashboard() {
  router.push('/dashboard')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
    <Card class="w-full max-w-md">
      <CardHeader class="text-center">
        <CardTitle class="text-2xl font-bold">SmartIce LMS</CardTitle>
        <CardDescription>有点东西餐饮集团培训管理系统</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <template v-if="authStore.isLoggedIn">
          <Button class="w-full" @click="goToDashboard">
            进入学习中心
          </Button>
        </template>
        <template v-else>
          <Button class="w-full" @click="goToLogin">
            登录
          </Button>
        </template>
      </CardContent>
    </Card>
  </div>
</template>
