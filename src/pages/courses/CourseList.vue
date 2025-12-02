<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import api from '@/lib/api'

interface Course {
  id: string
  title: string
  description: string
  thumbnail_url?: string
  duration_minutes?: number
  status: string
}

const router = useRouter()
const courses = ref<Course[]>([])
const loading = ref(true)
const error = ref('')

async function fetchCourses() {
  try {
    const response = await api.get<{ data: Course[] }>('/courses')
    courses.value = response.data.data || []
  } catch (err) {
    error.value = '获取课程列表失败'
    console.error(err)
  } finally {
    loading.value = false
  }
}

function goToCourse(id: string) {
  router.push(`/courses/${id}`)
}

function goBack() {
  router.push('/dashboard')
}

onMounted(() => {
  fetchCourses()
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- 顶部导航 -->
    <header class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div class="container flex h-14 items-center gap-4 px-4">
        <Button variant="ghost" size="sm" @click="goBack">
          返回
        </Button>
        <h1 class="text-lg font-semibold">课程列表</h1>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="container px-4 py-6">
      <div v-if="loading" class="flex justify-center py-12">
        <p class="text-muted-foreground">加载中...</p>
      </div>

      <div v-else-if="error" class="flex justify-center py-12">
        <p class="text-destructive">{{ error }}</p>
      </div>

      <div v-else-if="courses.length === 0" class="flex justify-center py-12">
        <p class="text-muted-foreground">暂无课程</p>
      </div>

      <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card
          v-for="course in courses"
          :key="course.id"
          class="cursor-pointer transition-shadow hover:shadow-md"
          @click="goToCourse(course.id)"
        >
          <CardHeader>
            <CardTitle class="text-lg line-clamp-1">{{ course.title }}</CardTitle>
            <CardDescription class="line-clamp-2">
              {{ course.description || '暂无描述' }}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between text-sm text-muted-foreground">
              <span v-if="course.duration_minutes">
                {{ Math.floor(course.duration_minutes / 60) }}小时{{ course.duration_minutes % 60 }}分钟
              </span>
              <span v-else>时长未知</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>
