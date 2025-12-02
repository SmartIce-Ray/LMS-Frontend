<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Play, Clock, BookOpen, ChevronDown, Check, Video, FileText, CheckSquare } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

interface Lesson {
  id: number
  title: string
  type: 'video' | 'text' | 'checklist'
  duration: number
  completed: boolean
}

interface Chapter {
  id: number
  title: string
  lessons: Lesson[]
}

interface CourseDetail {
  id: number
  title: string
  description: string
  coverUrl: string
  category: string
  totalLessons: number
  completedLessons: number
  progress: number
  totalDuration: number
  chapters: Chapter[]
}

const route = useRoute()
const router = useRouter()

// Mock 数据
const course = ref<CourseDetail>({
  id: Number(route.params.id) || 1,
  title: '食品安全与卫生操作规范',
  description: '本课程涵盖食品安全法规、卫生标准、操作规范等核心内容，帮助员工掌握门店日常运营中的食品安全要点。',
  coverUrl: '',
  category: '食品安全',
  totalLessons: 12,
  completedLessons: 7,
  progress: 58,
  totalDuration: 180,
  chapters: [
    {
      id: 1,
      title: '第一章：食品安全基础',
      lessons: [
        { id: 1, title: '食品安全法规概述', type: 'video', duration: 15, completed: true },
        { id: 2, title: '食品安全的重要性', type: 'text', duration: 10, completed: true },
        { id: 3, title: '基础知识测验', type: 'checklist', duration: 5, completed: true }
      ]
    },
    {
      id: 2,
      title: '第二章：卫生操作规范',
      lessons: [
        { id: 4, title: '个人卫生标准', type: 'video', duration: 20, completed: true },
        { id: 5, title: '工作区域清洁流程', type: 'video', duration: 25, completed: true },
        { id: 6, title: '清洁工具使用指南', type: 'text', duration: 10, completed: true },
        { id: 7, title: '卫生检查清单', type: 'checklist', duration: 10, completed: true }
      ]
    },
    {
      id: 3,
      title: '第三章：食材储存要点',
      lessons: [
        { id: 8, title: '冷藏食材管理', type: 'video', duration: 20, completed: false },
        { id: 9, title: '常温食材存放', type: 'video', duration: 15, completed: false },
        { id: 10, title: '保质期管理', type: 'text', duration: 10, completed: false }
      ]
    },
    {
      id: 4,
      title: '第四章：应急处理',
      lessons: [
        { id: 11, title: '食品安全事故处理', type: 'video', duration: 25, completed: false },
        { id: 12, title: '综合考核', type: 'checklist', duration: 15, completed: false }
      ]
    }
  ]
})

const expandedChapters = ref<number[]>([1, 2, 3])

const formattedDuration = computed(() => {
  const hours = Math.floor(course.value.totalDuration / 60)
  const minutes = course.value.totalDuration % 60
  if (hours > 0) {
    return `${hours}小时${minutes > 0 ? minutes + '分钟' : ''}`
  }
  return `${minutes}分钟`
})

function toggleChapter(chapterId: number) {
  const index = expandedChapters.value.indexOf(chapterId)
  if (index > -1) {
    expandedChapters.value.splice(index, 1)
  } else {
    expandedChapters.value.push(chapterId)
  }
}

function isChapterExpanded(chapterId: number): boolean {
  return expandedChapters.value.includes(chapterId)
}

function getChapterProgress(chapter: Chapter): number {
  const completed = chapter.lessons.filter(l => l.completed).length
  return Math.round((completed / chapter.lessons.length) * 100)
}

function getLessonIcon(type: string) {
  switch (type) {
    case 'video': return Video
    case 'checklist': return CheckSquare
    default: return FileText
  }
}

function goBack() {
  router.push('/courses')
}

function startLearning() {
  // 找到第一个未完成的课时
  for (const chapter of course.value.chapters) {
    for (const lesson of chapter.lessons) {
      if (!lesson.completed) {
        router.push(`/courses/${course.value.id}/learn?lesson=${lesson.id}`)
        return
      }
    }
  }
  // 如果全部完成，从头开始
  router.push(`/courses/${course.value.id}/learn`)
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- 顶部导航 -->
    <header class="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
      <div class="flex items-center gap-3 px-4 h-14">
        <button
          class="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
          @click="goBack"
        >
          <ArrowLeft class="w-5 h-5 text-foreground" />
        </button>
        <h1 class="text-lg font-semibold text-foreground line-clamp-1">{{ course.title }}</h1>
      </div>
    </header>

    <!-- 课程封面 -->
    <div class="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20">
      <div class="absolute inset-0 flex items-center justify-center">
        <Play class="w-16 h-16 text-primary/50" />
      </div>
      <div class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
        {{ course.category }}
      </div>
    </div>

    <!-- 课程信息 -->
    <div class="p-4 space-y-4 border-b border-border">
      <h2 class="text-xl font-bold text-foreground">{{ course.title }}</h2>
      <p class="text-sm text-muted-foreground leading-relaxed">{{ course.description }}</p>

      <!-- 统计信息 -->
      <div class="flex items-center gap-4 text-sm text-muted-foreground">
        <div class="flex items-center gap-1">
          <BookOpen class="w-4 h-4" />
          <span>{{ course.totalLessons }} 节</span>
        </div>
        <div class="flex items-center gap-1">
          <Clock class="w-4 h-4" />
          <span>{{ formattedDuration }}</span>
        </div>
      </div>

      <!-- 进度条 -->
      <div class="space-y-2">
        <div class="flex items-center justify-between text-sm">
          <span class="text-muted-foreground">学习进度</span>
          <span class="font-semibold text-foreground">{{ course.progress }}%</span>
        </div>
        <div class="h-2 bg-muted rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            :style="{ width: `${course.progress}%` }"
          />
        </div>
      </div>

      <!-- 开始学习按钮 -->
      <Button
        class="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-button)] transition-all duration-200 active:scale-[0.98]"
        @click="startLearning"
      >
        <Play class="w-5 h-5 mr-2" />
        {{ course.progress > 0 ? '继续学习' : '开始学习' }}
      </Button>
    </div>

    <!-- 章节目录 -->
    <div class="p-4">
      <h3 class="text-lg font-bold text-foreground mb-4">课程目录</h3>

      <div class="space-y-3">
        <div
          v-for="chapter in course.chapters"
          :key="chapter.id"
          class="bg-card rounded-xl border border-border overflow-hidden"
        >
          <!-- 章节标题 -->
          <button
            class="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            @click="toggleChapter(chapter.id)"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                :class="getChapterProgress(chapter) === 100 ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'"
              >
                <Check v-if="getChapterProgress(chapter) === 100" class="w-4 h-4" />
                <span v-else>{{ chapter.id }}</span>
              </div>
              <div class="text-left">
                <p class="font-medium text-foreground text-sm">{{ chapter.title }}</p>
                <p class="text-xs text-muted-foreground">
                  {{ chapter.lessons.filter(l => l.completed).length }}/{{ chapter.lessons.length }} 已完成
                </p>
              </div>
            </div>
            <ChevronDown
              class="w-5 h-5 text-muted-foreground transition-transform duration-200"
              :class="{ 'rotate-180': isChapterExpanded(chapter.id) }"
            />
          </button>

          <!-- 课时列表 -->
          <div
            v-show="isChapterExpanded(chapter.id)"
            class="border-t border-border"
          >
            <div
              v-for="lesson in chapter.lessons"
              :key="lesson.id"
              class="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer"
              :class="{ 'opacity-60': lesson.completed }"
            >
              <component
                :is="getLessonIcon(lesson.type)"
                class="w-4 h-4 flex-shrink-0"
                :class="lesson.completed ? 'text-success' : 'text-muted-foreground'"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm text-foreground truncate">{{ lesson.title }}</p>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span class="text-xs text-muted-foreground">{{ lesson.duration }}分钟</span>
                <Check v-if="lesson.completed" class="w-4 h-4 text-success" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
