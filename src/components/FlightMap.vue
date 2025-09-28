<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface Props {
  fromLocation: string
}

const props = defineProps<Props>()

const isAnimating = ref(false)
const animationProgress = ref(0)
const showClickButton = ref(false)

const handlePlaneClick = () => {
  // You can add your click handler logic here
  console.log('Airplane clicked!')
  // For example, you could emit an event or navigate somewhere
}

// Coordinates for each location (adjusted for spacing)
const coordinates = {
  'Italy': { x: 46, y: 22 },
  'Japan': { x: 90, y: 22 },
  'USA': { x: 18, y: 22 },
  'India': { x: 62, y: 32 },
  'Cebu': { x: 82.5, y: 38.5 }
}

const fromCoords = computed(
  () => coordinates[props.fromLocation as keyof typeof coordinates] || coordinates.USA,
)
const toCoords = computed(() => coordinates.Cebu)

// Calculate airplane position during animation
const airplanePosition = computed(() => {
  const progress = animationProgress.value
  const x = fromCoords.value.x + (toCoords.value.x - fromCoords.value.x) * progress
  const y = fromCoords.value.y + (toCoords.value.y - fromCoords.value.y) * progress
  return { x, y }
})

// Calculate airplane rotation based on direction
const airplaneRotation = computed(() => {
  const deltaX = toCoords.value.x - fromCoords.value.x
  const deltaY = toCoords.value.y - fromCoords.value.y
  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
  // Add 90 degrees because the airplane.png nose points up (top), but we need it to point right (0 degrees)
  return angle + 90
})

const startAnimation = () => {
  isAnimating.value = true
  animationProgress.value = 0

  const duration = 3000 // 3 seconds
  const startTime = Date.now()

  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Easing function for smooth animation
    animationProgress.value =
      progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      isAnimating.value = false
      showClickButton.value = true
    }
  }

  requestAnimationFrame(animate)
}

onMounted(() => {
  setTimeout(startAnimation, 500)
})
</script>

<template>
  <div class="flex flex-col items-center gap-4 p-8">
    <h2>Your Journey to Cebu</h2>

    <!-- World Map Container -->
    <div
      class="relative h-fit w-full max-w-4xl overflow-hidden border-4 border-black bg-blue-200 sm:h-96"
    >
      <!-- Detailed world map background -->
      <svg class="h-full w-full" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet">
        <!-- Ocean background -->
        <rect x="0" y="0" width="100" height="60" fill="#4682B4" />

        <!-- North America -->
        <path
          d="M5,15 L8,12 L15,10 L20,12 L25,14 L28,16 L30,20 L28,25 L25,28 L22,30 L18,32 L15,30 L12,28 L10,25 L8,22 L6,18 Z"
          fill="#228B22"
        />
        <!-- Alaska -->
        <path d="M2,8 L6,6 L8,8 L6,12 L4,10 Z" fill="#228B22" />
        <!-- Central America -->
        <path d="M18,30 L22,30 L24,32 L22,34 L20,32 Z" fill="#228B22" />

        <!-- South America -->
        <path
          d="M20,34 L24,32 L26,35 L28,40 L30,45 L28,50 L25,52 L22,50 L20,48 L18,45 L16,40 L18,36 Z"
          fill="#32CD32"
        />

        <!-- Europe -->
        <path d="M42,18 L48,16 L52,18 L54,22 L52,25 L48,26 L44,24 L42,22 Z" fill="#90EE90" />
        <!-- Scandinavia -->
        <path d="M48,12 L52,10 L54,14 L52,16 L48,16 Z" fill="#90EE90" />
        <!-- British Isles -->
        <path d="M40,18 L42,16 L44,18 L42,22 L40,20 Z" fill="#90EE90" />

        <!-- Africa -->
        <path
          d="M42,26 L48,26 L52,28 L54,32 L56,38 L54,45 L50,48 L46,46 L42,44 L40,40 L38,35 L40,30 Z"
          fill="#9ACD32"
        />
        <!-- Madagascar -->
        <path d="M56,42 L58,40 L60,44 L58,46 Z" fill="#9ACD32" />

        <!-- Asia -->
        <!-- Russia/Siberia -->
        <path
          d="M56,8 L75,6 L85,8 L88,12 L86,16 L82,18 L78,16 L72,18 L68,16 L64,18 L60,16 L56,14 Z"
          fill="#228B22"
        />
        <!-- China/Mongolia -->
        <path d="M64,18 L76,16 L80,20 L78,26 L74,28 L68,26 L64,24 L62,20 Z" fill="#32CD32" />
        <!-- India -->
        <path d="M58,28 L64,26 L68,30 L66,36 L62,38 L58,36 L56,32 Z" fill="#90EE90" />
        <!-- Southeast Asia -->
        <path d="M68,30 L74,28 L76,32 L74,36 L70,38 L68,34 Z" fill="#9ACD32" />
        <!-- Japan -->
        <path d="M88,20 L92,18 L94,22 L92,26 L88,24 Z" fill="#228B22" />
        <!-- Philippines Archipelago -->
        <!-- Luzon (main northern island) -->
        <path d="M80,34 L82,32 L84,34 L83,37 L81,38 L79,36 Z" fill="#32CD32" />
        <!-- Mindoro -->
        <ellipse cx="80.5" cy="37.5" rx="0.8" ry="1.2" fill="#32CD32" />
        <!-- Palawan (long western island) -->
        <path d="M78,36 L78.5,34 L79,38 L78.5,40 L78,38.5 Z" fill="#32CD32" />
        <!-- Visayas (central islands including Cebu) -->
        <ellipse cx="81" cy="39" rx="1" ry="0.8" fill="#32CD32" />
        <ellipse cx="82.5" cy="38.5" rx="0.7" ry="0.6" fill="#32CD32" />
        <ellipse cx="83" cy="39.5" rx="0.6" ry="0.5" fill="#32CD32" />
        <!-- Mindanao (large southern island) -->
        <path d="M81,41 L84,40 L85,42 L84,44 L81,43 L80,42 Z" fill="#32CD32" />
        <!-- Smaller islands -->
        <ellipse cx="79.5" cy="41" rx="0.4" ry="0.3" fill="#32CD32" />
        <ellipse cx="85" cy="40" rx="0.3" ry="0.4" fill="#32CD32" />

        <!-- Australia -->
        <path d="M74,48 L84,46 L88,48 L90,52 L86,54 L80,52 L76,50 Z" fill="#90EE90" />
        <!-- New Zealand -->
        <path d="M88,54 L92,52 L94,56 L90,58 Z" fill="#90EE90" />

        <!-- Greenland -->
        <path d="M35,5 L42,3 L45,7 L42,12 L38,10 L35,8 Z" fill="#F0F8FF" />

        <!-- Antarctica (bottom edge) -->
        <rect x="0" y="56" width="100" height="4" fill="#F0F8FF" />

        <!-- Major islands -->
        <!-- Iceland -->
        <ellipse cx="38" cy="15" rx="2" ry="1" fill="#90EE90" />
        <!-- Sri Lanka -->
        <ellipse cx="66" cy="38" rx="1" ry="2" fill="#90EE90" />
        <!-- Taiwan -->
        <ellipse cx="82" cy="30" rx="1" ry="2" fill="#32CD32" />

        <!-- Flight path line -->
        <line
          :x1="fromCoords.x"
          :y1="fromCoords.y"
          :x2="toCoords.x"
          :y2="toCoords.y"
          stroke="#ff4444"
          stroke-width="0.5"
          stroke-dasharray="1,1"
          class="animate-pulse"
        />

        <!-- Starting point -->
        <circle
          :cx="fromCoords.x"
          :cy="fromCoords.y"
          r="1.5"
          fill="#ff4444"
          stroke="#fff"
          stroke-width="0.3"
          class="animate-pulse"
        />

        <!-- Destination point (Cebu) -->
        <circle
          :cx="toCoords.x"
          :cy="toCoords.y"
          r="1.5"
          fill="#ff0000"
          stroke="#fff"
          stroke-width="0.3"
          class="animate-pulse"
        />

        <!-- Airplane -->
        <g
          :transform="`translate(${airplanePosition.x}, ${airplanePosition.y}) rotate(${airplaneRotation})`"
          class="transition-all duration-100"
        >
          <!-- Airplane image -->
          <image
            href="/airplane.png"
            x="-4.5"
            y="-4.5"
            width="9"
            height="9"
          />
        </g>

        <!-- Click Me Button (appears when animation completes) -->
        <g v-if="showClickButton" class="cursor-pointer group" @click="handlePlaneClick">
          <!-- Speech bubble background positioned at airplane nose -->
          <g :transform="`translate(${airplanePosition.x}, ${airplanePosition.y})`">
            <!-- Bubble with integrated pointer (single path to avoid stroke separation) -->
            <path
              d="M -11,-12 L 11,-12 Q 12,-12 12,-11 L 12,-7 Q 12,-6 11,-6 L 1,-6 L 0,-2 L -1,-6 L -11,-6 Q -12,-6 -12,-7 L -12,-11 Q -12,-12 -11,-12 Z"
              fill="#fff"
              stroke="#2c3e50"
              stroke-width="0.3"
              stroke-linejoin="round"
              class="transition-all duration-200 group-hover:fill-pink-50 group-hover:stroke-pink-500"
            />
            <!-- Button text -->
            <text
              x="0"
              y="-8"
              text-anchor="middle"
              class="fill-pink-500 text-[3px] font-semibold transition-all duration-200 group-hover:fill-purple-500"
            >
              Click Me!
            </text>
          </g>
        </g>

        <!-- Location labels -->
        <text
          :x="fromCoords.x"
          :y="fromCoords.y - 3"
          text-anchor="middle"
          class="fill-purple-800 text-[2px] font-semibold"
        >
          {{ fromLocation }}
        </text>

        <text
          :x="toCoords.x"
          :y="toCoords.y - 3"
          text-anchor="middle"
          class="fill-pink-800 text-[2px] font-semibold"
        >
          Cebu, Philippines
        </text>
      </svg>
    </div>

    <!-- Progress bar -->
    <div class="w-full max-w-md">
      <div class="h-4 border-2 border-black bg-white">
        <div
          class="h-full bg-green-500 transition-all duration-100"
          :style="{ width: `${animationProgress * 100}%` }"
        ></div>
      </div>
      <p class="mt-2 text-center font-mono text-sm">
        {{ animationProgress === 1 ? 'Arrived!' : 'Flying...' }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Smooth rendering for better visual quality */
svg {
  shape-rendering: geometricPrecision;
}

svg path,
svg rect,
svg ellipse {
  shape-rendering: geometricPrecision;
}
</style>
