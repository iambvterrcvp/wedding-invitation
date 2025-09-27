<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
const props = defineProps()

class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}



const mod = (n, m) => ((n % m) + m) % m


const keys = {};
window.addEventListener("keydown", (e) => { keys[e.key] = true; });
window.addEventListener("keyup", (e) => { keys[e.key] = false; });

let canvasSize = new Vec2(100, 60)
let brideSize = new Vec2(16, 16)

let frameIdx = 0
const timestep = 1000 / 60
let lastTime = performance.now()
let accumulator = 0

let bridePos = reactive(new Vec2(brideSize.x/2, canvasSize.y - brideSize.y/2 - 5))
let brideScale = reactive(new Vec2(1,1))

let windows = []
const windowsCount = 5
for (let i = 0; i < windowsCount; i++) {
  windows.push(new Vec2())
}
update_windows()

function update_windows() {
  for (let i = 0; i < windowsCount; i++) {
    windows[i].x = -canvasSize.x*1/3 + mod(canvasSize.x * (i+1)/3 -bridePos.x, canvasSize.x*5/3)
    windows[i].y = canvasSize.y /2 - 16 - 7
  }
}

const update = (delta) => {

  let speed = .02
  let dir = new Vec2(0,0)
  if (keys["ArrowLeft"]) dir.x = -1; else if (keys["ArrowRight"]) dir.x = 1
  
  if (dir.x != 0) {
    brideScale.x = dir.x > 0 ? 1 : -1
  } 
  bridePos.x = bridePos.x + dir.x * delta * speed

  update_windows()
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
        <pattern
          id="wallPattern"
          patternUnits="userSpaceOnUse"
          :x="-bridePos.x"
          :width="5"
          :height="5">
          <image
          href="/wall_dark2.jpg"
          :x="0"
          :y="0"
          :width="5"
          :height="5"
          />
        </pattern>
        <pattern
          id="floorPattern"
          patternUnits="userSpaceOnUse"
          :x="-bridePos.x"
          :width="5"
          :height="5">
          <image
          href="/dark_wood.jpg"
          :x="0"
          :y="0"
          :width="5"
          :height="5"
          />
        </pattern>
    <rect
      x="0"
      y="0"
      :width="canvasSize.x"
      :height="canvasSize.y * 3/4"
      fill="url(#wallPattern)"
    />
    <rect
      :x="0"
      :y="canvasSize.y * 3/4"
      :width="canvasSize.x"
      :height="canvasSize.y * 1/4"
      fill="url(#floorPattern)"
    />
        <image
          v-for="(window, i) in windows"
          :key="i"
          href="/window.png"
          :x="window.x"
          :y="window.y"
          :width="32"
          :height="32"
        />
      
        <g
          :transform="`translate(10, ${bridePos.y})`"
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
