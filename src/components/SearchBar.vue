<script setup lang="ts">
import { Search, X } from 'lucide-vue-next'

interface Props {
  modelValue?: string
  placeholder?: string
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '搜索课程...'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function clearSearch() {
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="relative">
    <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
    <input
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      class="w-full h-11 pl-10 pr-10 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
      @input="handleInput"
    />
    <button
      v-if="modelValue"
      class="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
      @click="clearSearch"
    >
      <X class="w-4 h-4 text-muted-foreground" />
    </button>
  </div>
</template>
