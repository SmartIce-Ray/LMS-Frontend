<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const courseId = route.params.id
</script>

<template>
  <div class="p-4 md:p-6">
    <h1 class="text-2xl font-bold text-foreground mb-4">学习页面</h1>
    <p class="text-muted-foreground">课程 ID: {{ courseId }}</p>
    <p class="text-muted-foreground mt-2">（开发中...）</p>
  </div>
</template>
