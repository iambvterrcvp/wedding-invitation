<script setup>
import { ref, onMounted, reactive } from 'vue'
const props = defineProps()

class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}
class Explosion {
  life = 0
  pos = new Vec2(0, 0);
}
class Blood {
  life = 0
  pos = new Vec2(0, 0);
}
class Bullet {
  life = 0
  pos = new Vec2(0, 0);
  dir = new Vec2(0, 0);
}
class Nun {
  life = 0
  pos = new Vec2(0, 0);
  index = 0
}
class Priest {
  life = 0
  pos = new Vec2(0, 0);
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
const brideSize = new Vec2(16, 16)
const nunSize = new Vec2(22, 22)
const priestSize = new Vec2(18, 18)
const bridePos = new Vec2(2, canvasSize.y - brideSize.y - 5)
const rifleSize = new Vec2(12, 12)
const riflePos = new Vec2(bridePos.x + 3, bridePos.y + 2.5)
const rifleRotPivot = new Vec2(riflePos.x + 5, riflePos.y + 5)
const rifleRange = new Vec2(30, -40)
const bulletSize = new Vec2(12, 12)
const explosionSize = new Vec2(30,30)


let frameIdx = 0
const timestep = 1000 / 60
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

let bullets = ref([])
function update_bullets(delta) {
  bullets.value.forEach(bullet => {
    bullet.life += delta
    bullet.pos.x += bullet.dir.x * .07 * delta;
    bullet.pos.y += bullet.dir.y * .07 * delta;
  });
  bullets.value = bullets.value.filter(bullet => bullet.life < 1500);
}

let nuns = ref([])
function spawn_nun() {
  let nun = new Nun()
    nun.pos = new Vec2(bridePos.x + 100, 0)
    nuns.value.push(nun)
}
function update_nuns(delta) {
  nuns.value.forEach(nun => {
    nun.life += delta
    nun.pos.x -= .02 * delta;
    nun.pos.y = Math.sin(nun.life / 200) * 3 + 1;
    nun.index = nun.life % 200 > 100 ? 1 : 0
  });
  nuns.value = nuns.value.filter(nun => nun.life < 6000);
}

let explosions = ref([])
function spawn_explosion(pos) {
  let explosion = new Explosion()
  explosion.pos = new Vec2(pos.x, pos.y - 5)
  explosions.value.push(explosion)
}
function update_explosions(delta) {
  explosions.value.forEach(explosion => {
    explosion.life += delta
    explosion.pos.x -= .02 * delta
  });
  explosions.value = explosions.value.filter(explosion => explosion.life < 1000);
}

let bloods = ref([])
function spawn_blood(pos) {
  let blood = new Blood()
  blood.pos = new Vec2(pos.x, pos.y)
  bloods.value.push(blood)
}
function update_bloods(delta) {
  bloods.value.forEach(blood => {
    blood.life += delta
    blood.pos.x -= .02 * delta
  });
  bloods.value = bloods.value.filter(blood => blood.life < 6000);
}

let priests = ref([])
function spawn_priest() {
  let priest = new Priest()
    priest.pos = new Vec2(bridePos.x + 100, bridePos.y - 2)
    priests.value.push(priest)
}
function update_priests(delta) {
  priests.value.forEach(priest => {
    priest.life += delta
    priest.pos.x -= .04 * delta;
  });
  priests.value = priests.value.filter(priest => priest.life < 6000);
}

function check_collision(a, b) {
  let diff = new Vec2(a.pos.x - b.pos.x, a.pos.y - b.pos.y)
  if (Math.abs(diff.x) < 5 && Math.abs(diff.y) < 10) {
    b.life = 100000
    a.life = 100000
    return true
  }
  return false
}

function resolve_collisions() {
  bullets.value.forEach(bullet => {
    priests.value.forEach(priest => {
      if (check_collision(bullet, priest)) spawn_explosion(priest.pos)
    })
    nuns.value.forEach(nun => {
      if (check_collision(bullet, nun)) spawn_blood(nun.pos)
    })
  })
  priests.value = priests.value.filter(priest => priest.life < 6000);
}



let rifleDir = reactive(new Vec2(0,0))
let rifleAngle = ref(0)

function normalize(vec) {
  const len = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
  if (len === 0) return { x: 0, y: 0 };
  return { x: vec.x / len, y: vec.y / len };
}

function dir_to_angle(dir) {
  return Math.atan2(dir.y, dir.x) * 180 / Math.PI
}

let bulletDelay = 1000000
let nunDelay = 1000000
let priestDelay = 1000000

let brideLife = ref(0)

const update = (delta) => {
  const walkSpeed = .02

  bulletDelay += delta
  if (keys[" "] && bulletDelay > 200) {
    bulletDelay = 0
    let bullet = new Bullet()
    bullet.pos = new Vec2(riflePos.x + rifleDir.x * 8.5, riflePos.y  + rifleDir.y * 8.5)
    bullet.dir = new Vec2(rifleDir.x, rifleDir.y)
    bullets.value.push(bullet)
  }

  nunDelay += delta
  if (nunDelay > 1000) {
    nunDelay = 0
    spawn_nun()
  }

  priestDelay += delta
  if (priestDelay > 1300) {
    priestDelay = 0
    spawn_priest()
  }

  brideLife.value += delta
  walkedDistance.x = walkedDistance.x + delta * walkSpeed

  rifleDir = normalize(new Vec2(mouse.x - 2, mouse.y - (canvasSize.y - brideSize.y - 5)))
  let angle = dir_to_angle(rifleDir)
  angle = Math.min(Math.max(angle, rifleRange.y), rifleRange.x)
  rifleAngle.value = angle
  update_windows()
  resolve_collisions()
  update_explosions(delta)
  update_bloods(delta)
  update_nuns(delta)
  update_priests(delta)
  update_bullets(delta)
}

let time = performance.now()

function loop() {
  let now =  performance.now()
  let delta = now - time;
  time = now;
  accumulator += delta;

  while (accumulator >= timestep) {
    update(delta);
    frameIdx++
    accumulator -= timestep;
  }

  requestAnimationFrame(loop);
}

const nunImages = ["/nun_up.png", "/nun_down.png"];


onMounted(() => {
  requestAnimationFrame(loop);
  window.addEventListener("mousemove", updateMouse);
})
</script>

<template>
  <div class="flex flex-col items-center gap-4 p-8">
    <div class="relative h-fit w-full max-w-4xl overflow-hidden border-4 border-black bg-blue-200 sm:h-96">
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
            v-for="(blood, i) in bloods"
            :key="i"
            href="/blood.png"
            :x="blood.pos.x"
            :y="blood.pos.y"
            :width="24"
            :height="24"
          />
          <image
            v-for="(explosion, i) in explosions"
            :key="i"
            href="/explosion.png"
            :width="explosionSize.x"
            :height="explosionSize.y"
            :opacity="1-Math.max(0,Math.min(1, (explosion.life-200) / 100))"
            :transform="`translate(${explosion.pos.x + explosionSize.x/2}, ${explosion.pos.y + explosionSize.y/2}) scale(${Math.min(1, explosion.life / 100)}) translate(${-explosionSize.x/2}, ${-explosionSize.y/2})`"
          />
        <image
          v-for="(nun, i) in nuns"
          :key="i"
          :href="nunImages[nun.index]"
          :x="nun.pos.x"
          :y="nun.pos.y"
          :width="nunSize.x"
          :height="nunSize.y"
        />
        <image
          v-for="(priest, i) in priests"
          :key="i"
          href="/priest.png"
          :x="priest.pos.x"
          :y="priest.pos.y"
          :width="priestSize.x"
          :height="priestSize.y"
          :transform="`rotate(${priest.life % 200 > 100 ? 2 : -2} ${priest.pos.x + priestSize.x * 2/3} ${priest.pos.y + priestSize.y})` "
        />
        <image
        v-for="(bullet, i) in bullets"
          :key="i"
          href="/bouquet.png"
          :x="bullet.pos.x"
          :y="bullet.pos.y"
          :width="bulletSize.x"
          :height="bulletSize.y"
          :transform="`rotate(${dir_to_angle(bullet.dir) + 90} ${bullet.pos.x + bulletSize.x/2} ${bullet.pos.y + bulletSize.y / 2})` "
          />
          <image
            href="/bride2.png"
            :x="bridePos.x"
            :y="bridePos.y"
            :width="brideSize.x"
            :height="brideSize.y"
            :transform="`rotate(${brideLife % 300 > 150 ? .5 : -.5} ${bridePos.x + brideSize.x /2} ${bridePos.y + brideSize.y})` "
          />
          <image
            href="/bazooka.png"
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
