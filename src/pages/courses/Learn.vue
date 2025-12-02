<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Check,
  Video,
  FileText,
  CheckSquare,
  List
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

interface Lesson {
  id: number
  title: string
  type: 'video' | 'text' | 'checklist'
  duration: number
  completed: boolean
  content?: string
  videoUrl?: string
  checklistItems?: { id: number; text: string; checked: boolean }[]
}

const route = useRoute()
const router = useRouter()

// Mock 课程数据
const lessons = ref<Lesson[]>([
  {
    id: 1,
    title: '食品安全法规概述',
    type: 'video',
    duration: 15,
    completed: true,
    videoUrl: ''
  },
  {
    id: 2,
    title: '食品安全的重要性',
    type: 'text',
    duration: 10,
    completed: true,
    content: `
## 食品安全的重要性

食品安全是餐饮行业的生命线，直接关系到消费者的健康和企业的声誉。

### 为什么食品安全如此重要？

1. **保护消费者健康**
   - 防止食源性疾病
   - 避免食物中毒事件
   - 确保营养价值

2. **维护企业声誉**
   - 建立消费者信任
   - 避免负面舆论
   - 长期经营保障

3. **法律合规要求**
   - 遵守食品安全法
   - 通过卫生检查
   - 避免法律风险

### 我们的责任

每位员工都是食品安全的守护者，从食材采购、储存、加工到上桌，每个环节都需要严格把控。
    `
  },
  {
    id: 3,
    title: '基础知识测验',
    type: 'checklist',
    duration: 5,
    completed: true,
    checklistItems: [
      { id: 1, text: '我已了解食品安全的基本概念', checked: true },
      { id: 2, text: '我知道食品安全对企业的重要性', checked: true },
      { id: 3, text: '我承诺遵守所有食品安全规定', checked: true }
    ]
  },
  {
    id: 8,
    title: '冷藏食材管理',
    type: 'video',
    duration: 20,
    completed: false,
    videoUrl: ''
  },
  {
    id: 9,
    title: '常温食材存放',
    type: 'video',
    duration: 15,
    completed: false,
    videoUrl: ''
  }
])

const currentLessonIndex = ref(0)
const showLessonList = ref(false)
const isPlaying = ref(false)
const videoProgress = ref(0)

const currentLesson = computed(() => lessons.value[currentLessonIndex.value])
const courseId = computed(() => route.params.id)
const totalLessons = computed(() => lessons.value.length)
const completedCount = computed(() => lessons.value.filter(l => l.completed).length)

const canGoPrev = computed(() => currentLessonIndex.value > 0)
const canGoNext = computed(() => currentLessonIndex.value < lessons.value.length - 1)

function goBack() {
  router.push(`/courses/${courseId.value}`)
}

function goToPrevLesson() {
  if (canGoPrev.value) {
    currentLessonIndex.value--
  }
}

function goToNextLesson() {
  if (canGoNext.value) {
    currentLessonIndex.value++
  }
}

function selectLesson(index: number) {
  currentLessonIndex.value = index
  showLessonList.value = false
}

function togglePlay() {
  isPlaying.value = !isPlaying.value
}

function toggleChecklistItem(itemId: number) {
  if (currentLesson.value.checklistItems) {
    const item = currentLesson.value.checklistItems.find(i => i.id === itemId)
    if (item) {
      item.checked = !item.checked
    }
  }
}

function markAsCompleted() {
  currentLesson.value.completed = true
  if (canGoNext.value) {
    goToNextLesson()
  }
}

function getLessonIcon(type: string) {
  switch (type) {
    case 'video': return Video
    case 'checklist': return CheckSquare
    default: return FileText
  }
}

const allChecklistCompleted = computed(() => {
  if (currentLesson.value.type !== 'checklist') return true
  return currentLesson.value.checklistItems?.every(item => item.checked) ?? false
})
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col">
    <!-- 顶部导航 -->
    <header class="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
      <div class="flex items-center justify-between px-4 h-14">
        <button
          class="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
          @click="goBack"
        >
          <ArrowLeft class="w-5 h-5 text-foreground" />
        </button>
        <div class="text-center">
          <p class="text-sm font-medium text-foreground line-clamp-1">{{ currentLesson.title }}</p>
          <p class="text-xs text-muted-foreground">{{ currentLessonIndex + 1 }}/{{ totalLessons }}</p>
        </div>
        <button
          class="p-2 -mr-2 rounded-lg hover:bg-muted transition-colors"
          @click="showLessonList = true"
        >
          <List class="w-5 h-5 text-foreground" />
        </button>
      </div>
    </header>

    <!-- 内容区域 -->
    <main class="flex-1 overflow-auto">
      <!-- 视频内容 -->
      <div v-if="currentLesson.type === 'video'" class="flex flex-col">
        <!-- 视频播放器 -->
        <div class="relative aspect-video bg-black flex items-center justify-center">
          <div class="text-center">
            <button
              class="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4 mx-auto hover:bg-primary/30 transition-colors"
              @click="togglePlay"
            >
              <Play v-if="!isPlaying" class="w-10 h-10 text-primary ml-1" />
              <Pause v-else class="w-10 h-10 text-primary" />
            </button>
            <p class="text-white/60 text-sm">视频播放器（开发中）</p>
          </div>

          <!-- 进度条 -->
          <div class="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              class="h-full bg-primary transition-all"
              :style="{ width: `${videoProgress}%` }"
            />
          </div>
        </div>

        <!-- 视频信息 -->
        <div class="p-4">
          <h2 class="text-lg font-bold text-foreground mb-2">{{ currentLesson.title }}</h2>
          <p class="text-sm text-muted-foreground">时长：{{ currentLesson.duration }} 分钟</p>
        </div>
      </div>

      <!-- 图文内容 -->
      <div v-else-if="currentLesson.type === 'text'" class="p-4">
        <div class="prose prose-invert max-w-none">
          <div class="text-foreground leading-relaxed whitespace-pre-line">
            {{ currentLesson.content }}
          </div>
        </div>
      </div>

      <!-- 检查清单 -->
      <div v-else-if="currentLesson.type === 'checklist'" class="p-4">
        <h2 class="text-lg font-bold text-foreground mb-4">{{ currentLesson.title }}</h2>
        <div class="space-y-3">
          <div
            v-for="item in currentLesson.checklistItems"
            :key="item.id"
            class="flex items-start gap-3 p-4 rounded-xl border transition-colors cursor-pointer"
            :class="item.checked ? 'bg-success/10 border-success/30' : 'bg-card border-border hover:bg-muted/50'"
            @click="toggleChecklistItem(item.id)"
          >
            <div
              class="w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors"
              :class="item.checked ? 'bg-success border-success' : 'border-muted-foreground'"
            >
              <Check v-if="item.checked" class="w-4 h-4 text-white" />
            </div>
            <span
              class="text-sm leading-relaxed"
              :class="item.checked ? 'text-foreground' : 'text-muted-foreground'"
            >
              {{ item.text }}
            </span>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部导航 -->
    <footer class="sticky bottom-0 bg-background border-t border-border p-4">
      <div class="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          class="flex-shrink-0"
          :disabled="!canGoPrev"
          @click="goToPrevLesson"
        >
          <ChevronLeft class="w-5 h-5" />
        </Button>

        <Button
          v-if="!currentLesson.completed"
          class="flex-1 h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-button)] transition-all duration-200 active:scale-[0.98]"
          :disabled="currentLesson.type === 'checklist' && !allChecklistCompleted"
          @click="markAsCompleted"
        >
          <Check class="w-5 h-5 mr-2" />
          完成本节
        </Button>
        <Button
          v-else
          class="flex-1 h-12 text-base font-semibold"
          variant="secondary"
          @click="goToNextLesson"
          :disabled="!canGoNext"
        >
          {{ canGoNext ? '下一节' : '已完成' }}
        </Button>

        <Button
          variant="outline"
          size="icon"
          class="flex-shrink-0"
          :disabled="!canGoNext"
          @click="goToNextLesson"
        >
          <ChevronRight class="w-5 h-5" />
        </Button>
      </div>
    </footer>

    <!-- 课时列表抽屉 -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showLessonList"
          class="fixed inset-0 bg-black/60 z-40"
          @click="showLessonList = false"
        />
      </Transition>
      <Transition name="slide">
        <div
          v-if="showLessonList"
          class="fixed bottom-0 left-0 right-0 bg-background rounded-t-2xl z-50 max-h-[70vh] flex flex-col"
        >
          <div class="flex items-center justify-between p-4 border-b border-border">
            <h3 class="font-bold text-foreground">课程目录</h3>
            <p class="text-sm text-muted-foreground">{{ completedCount }}/{{ totalLessons }} 已完成</p>
          </div>
          <div class="flex-1 overflow-auto p-4">
            <div class="space-y-2">
              <button
                v-for="(lesson, index) in lessons"
                :key="lesson.id"
                class="w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left"
                :class="[
                  index === currentLessonIndex ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted'
                ]"
                @click="selectLesson(index)"
              >
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  :class="lesson.completed ? 'bg-success/20' : 'bg-muted'"
                >
                  <Check v-if="lesson.completed" class="w-4 h-4 text-success" />
                  <component
                    v-else
                    :is="getLessonIcon(lesson.type)"
                    class="w-4 h-4 text-muted-foreground"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p
                    class="text-sm font-medium truncate"
                    :class="index === currentLessonIndex ? 'text-primary' : 'text-foreground'"
                  >
                    {{ lesson.title }}
                  </p>
                  <p class="text-xs text-muted-foreground">{{ lesson.duration }} 分钟</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateY(100%);
}
</style>
