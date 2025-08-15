<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{
  text: string
}>()

const emits = defineEmits(['click'])
</script>

<template>
  <button
    @click="() => emits('click')"
    class="cursor-pointer border-4 border-black bg-pink-500 px-6 py-3 text-white shadow-[inset_-2px_-2px_0px_theme(colors.pink.700),inset_2px_2px_0px_theme(colors.pink.300)] transition-all duration-100 hover:bg-purple-500 hover:shadow-[inset_-2px_-2px_0px_theme(colors.purple.700),inset_2px_2px_0px_theme(colors.purple.300)] active:bg-purple-600 active:shadow-[inset_2px_2px_0px_theme(colors.purple.800),inset_-2px_-2px_0px_theme(colors.purple.400)]"
  >
    {{ text }}
  </button>
</template>
