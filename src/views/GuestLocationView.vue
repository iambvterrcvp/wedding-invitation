<script setup lang="ts">
import { ref } from 'vue'
import CustomButton from '@/components/CustomButton.vue'
import FlightMap from '@/components/FlightMap.vue'

const location = ref('')
const isOpen = ref(false)
const showFlightMap = ref(false)

const handleBlur = () => {
  isOpen.value = false
}

const handleClick = () => {
  isOpen.value = !isOpen.value
}

const handleSubmit = () => {
  if (location.value) {
    showFlightMap.value = true
  }
}
</script>

<template>
  <!-- Show form if flight map is not displayed -->
  <div v-if="!showFlightMap" class="flex flex-col items-center justify-center gap-6 p-8">
    <h1>Where are you coming from?</h1>
    <div class="relative w-full max-w-md">
      <select
        v-model="location"
        @blur="handleBlur"
        @click="handleClick"
        class="w-full cursor-pointer appearance-none border-4 border-black bg-white px-4 py-3 pr-10 text-black shadow-[inset_-2px_-2px_0px_theme(colors.gray.300),inset_2px_2px_0px_theme(colors.gray.600)] transition-all duration-100 focus:border-blue-600 focus:shadow-[inset_-2px_-2px_0px_theme(colors.blue.600),inset_2px_2px_0px_theme(colors.blue.800),0_0_0_2px_theme(colors.blue.600)] focus:ring-4 focus:ring-blue-200 focus:outline-none"
      >
        <option value="" disabled>Select your location...</option>
        <option value="Italy">Italy</option>
        <option value="Japan">Japan</option>
        <option value="USA">USA</option>
        <option value="India">India</option>
      </select>
      <!-- Custom chevron with rotation animation -->
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg
          class="h-5 w-5 text-gray-700 transition-all"
          :class="{ '-rotate-180': isOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>

    <custom-button text="Submit" @click="handleSubmit" :disabled="!location" />
  </div>

  <!-- Show flight map after submission -->
  <flight-map v-if="showFlightMap" :from-location="location" />
</template>
