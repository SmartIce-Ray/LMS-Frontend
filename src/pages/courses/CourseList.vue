<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import SearchBar from '@/components/SearchBar.vue'
import CategoryTabs from '@/components/CategoryTabs.vue'
import CourseCard from '@/components/CourseCard.vue'

const router = useRouter()

// Mock 数据 - 开发模式
const categories = ref([
  { id: 'all', name: '全部', count: 12 },
  { id: 'safety', name: '食品安全', count: 4 },
  { id: 'service', name: '服务技能', count: 3 },
  { id: 'operation', name: '门店运营', count: 3 },
  { id: 'management', name: '管理培训', count: 2 }
])

const allCourses = ref([
  {
    id: 1,
    title: '食品安全与卫生操作规范',
    coverUrl: '',
    totalLessons: 12,
    completedLessons: 7,
    progress: 58,
    category: '食品安全'
  },
  {
    id: 2,
    title: '客户服务技巧提升',
    coverUrl: '',
    totalLessons: 8,
    completedLessons: 0,
    progress: 0,
    category: '服务技能'
  },
  {
    id: 3,
    title: '收银系统操作指南',
    coverUrl: '',
    totalLessons: 5,
    completedLessons: 5,
    progress: 100,
    category: '门店运营'
  },
  {
    id: 4,
    title: '门店清洁标准流程',
    coverUrl: '',
    totalLessons: 6,
    completedLessons: 3,
    progress: 50,
    category: '食品安全'
  },
  {
    id: 5,
    title: '团队协作与沟通技巧',
    coverUrl: '',
    totalLessons: 4,
    completedLessons: 0,
    progress: 0,
    category: '管理培训'
  },
  {
    id: 6,
    title: '新员工入职培训',
    coverUrl: '',
    totalLessons: 10,
    completedLessons: 10,
    progress: 100,
    category: '门店运营'
  },
  {
    id: 7,
    title: '食材储存与保鲜技术',
    coverUrl: '',
    totalLessons: 8,
    completedLessons: 2,
    progress: 25,
    category: '食品安全'
  },
  {
    id: 8,
    title: '投诉处理与危机应对',
    coverUrl: '',
    totalLessons: 6,
    completedLessons: 0,
    progress: 0,
    category: '服务技能'
  }
])

const searchQuery = ref('')
const selectedCategory = ref('all')

const filteredCourses = computed(() => {
  let result = allCourses.value

  // 分类筛选
  if (selectedCategory.value !== 'all') {
    const categoryMap: Record<string, string> = {
      safety: '食品安全',
      service: '服务技能',
      operation: '门店运营',
      management: '管理培训'
    }
    const categoryName = categoryMap[selectedCategory.value]
    result = result.filter(c => c.category === categoryName)
  }

  // 搜索筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(c =>
      c.title.toLowerCase().includes(query) ||
      c.category.toLowerCase().includes(query)
    )
  }

  return result
})

function goBack() {
  router.push('/')
}

function handleCourseClick(courseId: number) {
  router.push(`/courses/${courseId}`)
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
        <h1 class="text-lg font-semibold text-foreground">课程列表</h1>
      </div>
    </header>

    <!-- 搜索和筛选 -->
    <div class="px-4 py-4 space-y-4 border-b border-border">
      <SearchBar v-model="searchQuery" placeholder="搜索课程名称..." />
      <CategoryTabs v-model="selectedCategory" :categories="categories" />
    </div>

    <!-- 课程列表 -->
    <div class="p-4">
      <div v-if="filteredCourses.length === 0" class="py-12 text-center">
        <p class="text-muted-foreground">没有找到相关课程</p>
      </div>

      <div v-else class="grid grid-cols-2 gap-3">
        <CourseCard
          v-for="course in filteredCourses"
          :key="course.id"
          v-bind="course"
          @click="handleCourseClick(course.id)"
        />
      </div>
    </div>
  </div>
</template>
