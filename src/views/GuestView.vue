<script setup lang="ts">
import CustomButton from '@/components/CustomButton.vue'
import { useTypingAnimation } from '@/composables/useTypingAnimation'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isCompleteTyping = ref(false)

const guestName = computed(() => {
  const plusOne = '-plus-one'
  const id = route.params.id as string
  const hasPlusOne = id.endsWith(plusOne)
  return hasPlusOne
    ? `${id.slice(0, -plusOne.length).split('-').join(' ')} +1`
    : id.split('-').join(' ')
})

const { displayedText, isTyping } = useTypingAnimation(guestName.value, {
  typeSpeed: 80,
  startDelay: 500,
  onComplete: () => {
    setTimeout(() => {
      isCompleteTyping.value = true
    }, 1000)
  },
})
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4">
    <h1>Greetings,</h1>
    <p>
      <span>{{ displayedText }}</span>
      <span class="cursor" v-if="isTyping">|</span>
    </p>
    <h1>You are invited!!!</h1>
    <custom-button
      v-show="isCompleteTyping"
      text="Next"
      @click="$router.push({ path: `/guest/${route.params.id}/location` })"
    />
  </div>
</template>
