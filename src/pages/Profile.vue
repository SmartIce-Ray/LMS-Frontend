<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="p-4 md:p-6">
    <h1 class="text-2xl font-bold text-foreground mb-4">个人中心</h1>
    <div class="bg-card rounded-xl p-4 border border-border">
      <p class="text-muted-foreground">用户信息</p>
      <p class="text-foreground mt-2">{{ authStore.user?.username || '未登录' }}</p>
    </div>
    <p class="text-muted-foreground mt-4">（开发中...）</p>
  </div>
</template>
