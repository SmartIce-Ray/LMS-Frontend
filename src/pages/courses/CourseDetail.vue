<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import api from '@/lib/api'

interface Content {
  id: string
  title: string
  content_type: 'text' | 'video' | 'image' | 'pdf' | 'checklist'
  duration_minutes?: number
  sort_order: number
}

interface Chapter {
  id: string
  title: string
  description?: string
  sort_order: number
  contents: Content[]
}

interface CourseDetail {
  id: string
  title: string
  description: string
  thumbnail_url?: string
  duration_minutes?: number
  status: string
  chapters: Chapter[]
}

const route = useRoute()
const router = useRouter()
const course = ref<CourseDetail | null>(null)
const loading = ref(true)
const error = ref('')

async function fetchCourse() {
  try {
    const response = await api.get<{ data: CourseDetail }>(`/courses/${route.params.id}`)
    course.value = response.data.data
  } catch (err) {
    error.value = '获取课程详情失败'
    console.error(err)
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/courses')
}

function getContentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    text: '文档',
    video: '视频',
    image: '图片',
    pdf: 'PDF',
    checklist: '检查清单'
  }
  return labels[type] || type
}

onMounted(() => {
  fetchCourse()
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
        <h1 class="text-lg font-semibold line-clamp-1">
          {{ course?.title || '课程详情' }}
        </h1>
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

      <div v-else-if="course" class="space-y-6">
        <!-- 课程信息 -->
        <Card>
          <CardHeader>
            <CardTitle>{{ course.title }}</CardTitle>
            <CardDescription>{{ course.description || '暂无描述' }}</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex items-center gap-4 text-sm text-muted-foreground">
              <span v-if="course.duration_minutes">
                总时长: {{ Math.floor(course.duration_minutes / 60) }}小时{{ course.duration_minutes % 60 }}分钟
              </span>
              <span>{{ course.chapters?.length || 0 }} 个章节</span>
            </div>
          </CardContent>
        </Card>

        <!-- 章节列表 -->
        <div class="space-y-4">
          <h2 class="text-xl font-semibold">课程目录</h2>

          <div v-if="!course.chapters || course.chapters.length === 0" class="py-8 text-center text-muted-foreground">
            暂无章节内容
          </div>

          <Card v-for="chapter in course.chapters" :key="chapter.id">
            <CardHeader>
              <CardTitle class="text-base">{{ chapter.title }}</CardTitle>
              <CardDescription v-if="chapter.description">
                {{ chapter.description }}
              </CardDescription>
            </CardHeader>
            <CardContent v-if="chapter.contents && chapter.contents.length > 0">
              <ul class="space-y-2">
                <li
                  v-for="content in chapter.contents"
                  :key="content.id"
                  class="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50"
                >
                  <div class="flex items-center gap-2">
                    <span class="text-xs rounded bg-muted px-2 py-1">
                      {{ getContentTypeLabel(content.content_type) }}
                    </span>
                    <span>{{ content.title }}</span>
                  </div>
                  <span v-if="content.duration_minutes" class="text-sm text-muted-foreground">
                    {{ content.duration_minutes }}分钟
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  </div>
</template>
