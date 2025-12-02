<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Bell } from 'lucide-vue-next'
import StatsCard from '@/components/StatsCard.vue'
import StreakBadge from '@/components/StreakBadge.vue'
import NoticeBanner from '@/components/NoticeBanner.vue'
import RecentCourse from '@/components/RecentCourse.vue'
import PendingCourses from '@/components/PendingCourses.vue'

const router = useRouter()
const authStore = useAuthStore()

// Mock 数据 - 后续从 API 获取
const userStats = ref({
  completedCourses: 12,
  passedExams: 8,
  learningHours: 24
})

const streakDays = ref(7)

const notices = ref([
  { id: 1, title: '新员工入职培训将于本周五开始，请准时参加' }
])

const recentCourse = ref({
  id: 1,
  title: '食品安全与卫生操作规范',
  coverUrl: '',
  progress: 60,
  currentLesson: '第3节 · 食材储存要点'
})

const pendingCourses = ref([
  { id: 2, title: '客户服务技巧', coverUrl: '', totalLessons: 8, category: '服务' },
  { id: 3, title: '收银系统操作', coverUrl: '', totalLessons: 5, category: '技能' },
  { id: 4, title: '门店清洁标准', coverUrl: '', totalLessons: 6, category: '卫生' },
  { id: 5, title: '团队协作培训', coverUrl: '', totalLessons: 4, category: '管理' }
])

function handleContinueLearning(courseId: number) {
  router.push(`/courses/${courseId}/learn`)
}

function handleCourseClick(courseId: number) {
  router.push(`/courses/${courseId}`)
}

function handleMoreCourses() {
  router.push('/courses')
}

function handleNoticeClick(notice: { id: number; title: string }) {
  router.push('/messages')
}

function goToMessages() {
  router.push('/messages')
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- 页面内容 -->
    <div class="p-4 pb-8 space-y-6">
      <!-- 顶部欢迎栏 -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-foreground">
            你好，{{ authStore.user?.full_name || authStore.user?.username || '学员' }}
          </h1>
          <p class="text-sm text-muted-foreground mt-0.5">今天继续学习吧</p>
        </div>
        <button
          class="relative p-2 rounded-full hover:bg-muted transition-colors"
          @click="goToMessages"
        >
          <Bell class="w-6 h-6 text-foreground" />
          <span class="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </button>
      </div>

      <!-- 连胜徽章 -->
      <StreakBadge :days="streakDays" />

      <!-- 数据统计 -->
      <StatsCard
        :completed-courses="userStats.completedCourses"
        :passed-exams="userStats.passedExams"
        :learning-hours="userStats.learningHours"
      />

      <!-- 公告通知 -->
      <NoticeBanner
        :notices="notices"
        @click="handleNoticeClick"
      />

      <!-- 继续学习 -->
      <div class="space-y-3">
        <h2 class="text-lg font-bold text-foreground">继续学习</h2>
        <RecentCourse
          v-bind="recentCourse"
          @continue="handleContinueLearning"
        />
      </div>

      <!-- 待学课程 -->
      <PendingCourses
        :courses="pendingCourses"
        @more="handleMoreCourses"
        @course-click="handleCourseClick"
      />
    </div>
  </div>
</template>
