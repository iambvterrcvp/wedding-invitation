<script setup>
import { ref, onMounted, reactive } from 'vue'
const props = defineProps()

class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

let mouse = reactive(new Vec2(0, 0))
const canvasRef = ref(null);

function updateMouse(e) {
  const svg = canvasRef.value;
  const pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
  mouse.x = svgP.x;
  mouse.y = svgP.y;
}




const mod = (n, m) => ((n % m) + m) % m


const keys = {};
window.addEventListener("keydown", (e) => { keys[e.key] = true; });
window.addEventListener("keyup", (e) => { keys[e.key] = false; });

let canvasSize = new Vec2(100, 60)
let brideSize = new Vec2(16, 16)
const bridePos = new Vec2(2, canvasSize.y - brideSize.y - 5)
const rifleSize = new Vec2(12, 12)
const riflePos = new Vec2(bridePos.x + 5, bridePos.y + 3.5)
const rifleRotPivot = new Vec2(riflePos.x + 3, riflePos.y + 5)
const rifleRange = new Vec2(30, -40)

let frameIdx = 0
const timestep = 1000 / 60
let lastTime = performance.now()
let accumulator = 0

let walkedDistance = reactive(new Vec2(0,0))
let brideScale = reactive(new Vec2(1,1))

let windows = []
const windowsCount = 5
for (let i = 0; i < windowsCount; i++) {
  windows.push(new Vec2())
}
update_windows()

function update_windows() {
  for (let i = 0; i < windowsCount; i++) {
    windows[i].x = -canvasSize.x*1/3 + mod(canvasSize.x * (i+1)/3 -walkedDistance.x, canvasSize.x*5/3)
    windows[i].y = canvasSize.y /2 - 16 - 7
  }
}

let rifleAngle = ref(0)

const update = (delta) => {
  let speed = .02
  let dir = new Vec2(0,0)
  if (keys["ArrowLeft"]) dir.x = -1; else if (keys["ArrowRight"]) dir.x = 1
  
  if (dir.x != 0) {
    brideScale.x = dir.x > 0 ? 1 : -1
  } 
  walkedDistance.x = walkedDistance.x + dir.x * delta * speed

  let diffMouseBride = new Vec2(mouse.x - 2, mouse.y - (canvasSize.y - brideSize.y - 5))
  let angle = Math.atan2(diffMouseBride.y, diffMouseBride.x) * 180 / Math.PI
  angle = Math.min(Math.max(angle, rifleRange.y), rifleRange.x)
  rifleAngle.value = angle
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
  window.addEventListener("mousemove", updateMouse);
})
</script>

<template>
  <div class="flex flex-col items-center gap-4 p-8">
    <div
      class="relative h-fit w-full max-w-4xl overflow-hidden border-4 border-black bg-blue-200 sm:h-96"
    >
      <svg ref="canvasRef" class="h-full w-full" :viewBox="`0 0 ${canvasSize.x} ${canvasSize.y}`" preserveAspectRatio="xMidYMid meet">
        <pattern
          id="wallPattern"
          patternUnits="userSpaceOnUse"
          :x="-walkedDistance.x"
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
          :x="-walkedDistance.x"
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
      
        <image
          href="/bride2.png"
          :x="bridePos.x"
          :y="bridePos.y"
          :width="brideSize.x"
          :height="brideSize.y"
        />
        <image
          href="/rifle.png"
          :x="riflePos.x"
          :y="riflePos.y"
          :width="rifleSize.x"
          :height="rifleSize.y"
          :transform="`rotate(${rifleAngle} ${rifleRotPivot.x} ${rifleRotPivot.y})` "
        />
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
