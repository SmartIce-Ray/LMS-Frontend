<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Home, BookOpen, User, LogOut, Menu, X } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  collapsed?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:collapsed', value: boolean): void
}>()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/courses', icon: BookOpen, label: '课程' },
  { path: '/profile', icon: User, label: '我的' },
]

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const toggleSidebar = () => {
  emit('update:collapsed', !props.collapsed)
}
</script>

<template>
  <aside
    class="fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out"
    :class="[
      collapsed ? 'w-0 -translate-x-full md:w-16 md:translate-x-0' : 'w-64'
    ]"
  >
    <div class="flex h-full flex-col bg-sidebar border-r border-sidebar-border">
      <!-- Logo 区域 -->
      <div class="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        <div class="flex items-center gap-3" v-show="!collapsed">
          <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span class="text-primary-foreground font-bold text-sm">S</span>
          </div>
          <span class="font-semibold text-sidebar-foreground">SmartIce LMS</span>
        </div>
        <button
          @click="toggleSidebar"
          class="p-2 rounded-lg hover:bg-sidebar-accent transition-colors md:hidden"
        >
          <X v-if="!collapsed" class="w-5 h-5 text-sidebar-foreground" />
          <Menu v-else class="w-5 h-5 text-sidebar-foreground" />
        </button>
      </div>

      <!-- 导航菜单 -->
      <nav class="flex-1 px-3 py-4 space-y-1">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200"
          :class="[
            isActive(item.path)
              ? 'bg-primary text-primary-foreground shadow-[var(--shadow-button)]'
              : 'text-sidebar-foreground hover:bg-sidebar-accent'
          ]"
          @click="collapsed && emit('update:collapsed', true)"
        >
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
          <span v-show="!collapsed" class="font-medium">{{ item.label }}</span>
        </router-link>
      </nav>

      <!-- 退出按钮 -->
      <div class="px-3 py-4 border-t border-sidebar-border">
        <button
          @click="handleLogout"
          class="flex w-full items-center gap-3 px-3 py-3 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200"
        >
          <LogOut class="w-5 h-5 flex-shrink-0" />
          <span v-show="!collapsed" class="font-medium">退出登录</span>
        </button>
      </div>
    </div>
  </aside>

  <!-- 移动端遮罩 -->
  <div
    v-if="!collapsed"
    class="fixed inset-0 z-30 bg-black/50 md:hidden"
    @click="emit('update:collapsed', true)"
  />
</template>
