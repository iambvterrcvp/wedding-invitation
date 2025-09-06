<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
const props = defineProps()

class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

const keys = {};
window.addEventListener("keydown", (e) => { keys[e.key] = true; });
window.addEventListener("keyup", (e) => { keys[e.key] = false; });

let canvasSize = new Vec2(100, 60)
let brideSize = new Vec2(16, 16)

let frameIdx = 0
const timestep = 1000 / 60
let lastTime = performance.now()
let accumulator = 0

let planePos = reactive(new Vec2(brideSize.x/2, canvasSize.y - brideSize.y/2))
let planeScale = reactive(new Vec2(1,1))

const update = (delta) => {
  let speed = .02
  let dir = new Vec2(0,0)
  if (keys["ArrowLeft"]) dir.x = -1; else if (keys["ArrowRight"]) dir.x = 1
  
  if (dir.x != 0) {
    planeScale.x = dir.x > 0 ? 1 : -1
  } 
  planePos.x = planePos.x + dir.x * timestep * speed
}

function loop() {
  let now =  performance.now()
  let delta = now - lastTime;
  lastTime = now;
  accumulator += delta;

  while (accumulator >= timestep) {
    update(delta);
    frameIdx++
    accumulator -= timestep;
  }

  requestAnimationFrame(loop);
}


onMounted(() => {
  requestAnimationFrame(loop);
})
</script>

<template>
  <div class="flex flex-col items-center gap-4 p-8">
    <div
      class="relative h-fit w-full max-w-4xl overflow-hidden border-4 border-black bg-blue-200 sm:h-96"
    >
      <svg class="h-full w-full" :viewBox="`0 0 ${canvasSize.x} ${canvasSize.y}`" preserveAspectRatio="xMidYMid meet">

        <g
          :transform="`translate(${planePos.x}, ${planePos.y}) scale(${planeScale.x}, ${planeScale.y})`"
          class="none"
        >
          <image
            href="/bride2.png"
            :x="-brideSize.x/2"
            :y="-brideSize.y/2"
            :width="brideSize.x"
            :height="brideSize.y"
          />
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped>

svg {
  shape-rendering: geometricPrecision;
}

svg path,
svg rect,
svg ellipse {
  shape-rendering: geometricPrecision;
}
</style>
