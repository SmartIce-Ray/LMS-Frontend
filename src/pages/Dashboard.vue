<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

function goToCourses() {
  router.push('/courses')
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- 顶部导航 -->
    <header class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div class="container flex h-14 items-center justify-between px-4">
        <h1 class="text-lg font-semibold">SmartIce LMS</h1>
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground">
            {{ authStore.user?.full_name || '用户' }}
          </span>
          <Button variant="ghost" size="sm" @click="handleLogout">
            退出
          </Button>
        </div>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="container px-4 py-6">
      <h2 class="mb-6 text-2xl font-bold">学习中心</h2>

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <!-- 我的课程 -->
        <Card class="cursor-pointer transition-shadow hover:shadow-md" @click="goToCourses">
          <CardHeader>
            <CardTitle class="text-lg">我的课程</CardTitle>
            <CardDescription>查看和学习已报名的课程</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-3xl font-bold text-primary">0</p>
            <p class="text-sm text-muted-foreground">门进行中</p>
          </CardContent>
        </Card>

        <!-- 考试中心 -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">考试中心</CardTitle>
            <CardDescription>待完成的考试和成绩查询</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-3xl font-bold text-primary">0</p>
            <p class="text-sm text-muted-foreground">场待考试</p>
          </CardContent>
        </Card>

        <!-- 学习记录 -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">学习记录</CardTitle>
            <CardDescription>查看学习历史和统计</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-3xl font-bold text-primary">0</p>
            <p class="text-sm text-muted-foreground">小时学习时长</p>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>
