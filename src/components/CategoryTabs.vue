<script setup lang="ts">
interface Category {
  id: string
  name: string
  count?: number
}

interface Props {
  categories: Category[]
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function selectCategory(id: string) {
  emit('update:modelValue', id)
}
</script>

<template>
  <div class="relative -mx-4 px-4">
    <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        v-for="category in categories"
        :key="category.id"
        class="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
        :class="[
          modelValue === category.id
            ? 'bg-primary text-primary-foreground shadow-[var(--shadow-button)]'
            : 'bg-card text-muted-foreground border border-border hover:bg-muted hover:text-foreground'
        ]"
        @click="selectCategory(category.id)"
      >
        {{ category.name }}
        <span
          v-if="category.count !== undefined"
          class="ml-1 opacity-70"
        >
          {{ category.count }}
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
