<script setup lang="ts">
import { ref } from 'vue'
import { Menu } from 'lucide-vue-next'
import Sidebar from '@/components/Sidebar.vue'

const sidebarCollapsed = ref(true) // 移动端默认折叠
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- 侧边栏 -->
    <Sidebar v-model:collapsed="sidebarCollapsed" />

    <!-- 主内容区域 -->
    <div
      class="transition-all duration-300 ease-in-out"
      :class="[sidebarCollapsed ? 'md:ml-16' : 'md:ml-64']"
    >
      <!-- 移动端顶部栏 -->
      <header class="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:hidden">
        <button
          @click="sidebarCollapsed = false"
          class="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
        >
          <Menu class="w-5 h-5 text-foreground" />
        </button>
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span class="text-primary-foreground font-bold text-xs">S</span>
          </div>
          <span class="font-semibold text-foreground">SmartIce LMS</span>
        </div>
      </header>

      <!-- 页面内容 -->
      <main class="min-h-[calc(100vh-4rem)] md:min-h-screen">
        <router-view />
      </main>
    </div>
  </div>
</template>
