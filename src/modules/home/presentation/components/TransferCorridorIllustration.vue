<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  tone: 'light' | 'dark'
}>()

const brazilFlag = '/assets/flags/bra.svg'
const peruFlag = '/assets/flags/peru.svg'
const brandMark = computed(() => props.tone === 'light'
  ? '/assets/images/logo/logo-blanco.png'
  : '/assets/images/logo/logo-80.png')
</script>

<template>
  <div
    class="corridor"
    :class="`corridor--${tone}`"
    role="img"
    aria-label="Corredor de transferencias de ida y vuelta entre Brasil y Perú"
  >
    <div class="corridor__route" aria-hidden="true">
      <svg viewBox="0 0 600 150" preserveAspectRatio="none">
        <defs>
          <linearGradient id="corridor-gradient" x1="0" x2="1">
            <stop offset="0" class="corridor__stop corridor__stop--start" />
            <stop offset="0.5" class="corridor__stop corridor__stop--middle" />
            <stop offset="1" class="corridor__stop corridor__stop--end" />
          </linearGradient>
        </defs>
        <path class="corridor__path" d="M54,76 C205,-2 395,154 546,76" />
        <path class="corridor__pulse" d="M54,76 C205,-2 395,154 546,76" />
        <g class="corridor__traveler corridor__traveler--moving">
          <image :href="brandMark" x="-22" y="-18" width="44" height="36" />
          <animateMotion
            dur="7s"
            repeatCount="indefinite"
            path="M54,76 C205,-2 395,154 546,76 C395,154 205,-2 54,76"
          />
        </g>
        <g class="corridor__traveler corridor__traveler--static" transform="translate(300 76)">
          <image :href="brandMark" x="-22" y="-18" width="44" height="36" />
        </g>
      </svg>

      <div class="corridor__node corridor__node--brazil">
        <img :src="brazilFlag" alt="" />
        <strong>BRASIL</strong>
        <small>BRL</small>
      </div>

      <div class="corridor__node corridor__node--peru">
        <img :src="peruFlag" alt="" />
        <strong>PERÚ</strong>
        <small>PEN</small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.corridor {
  --corridor-line: rgb(255 255 255 / 42%);
  --corridor-label: #fff;
  --corridor-muted: rgb(255 255 255 / 72%);
  --corridor-accent-start: #01e8fc;
  --corridor-accent-middle: #fff;
  --corridor-accent-end: #01e8fc;
  min-height: 11rem;
  background: transparent;
  padding-inline: clamp(0rem, 2vw, 0.75rem);
}

.corridor--dark {
  --corridor-line: rgb(30 64 175 / 48%);
  --corridor-label: #172554;
  --corridor-muted: rgb(30 58 138 / 72%);
  --corridor-accent-start: #2563eb;
  --corridor-accent-middle: #4a52d8;
  --corridor-accent-end: #2563eb;
}

.corridor__route {
  position: relative;
  height: 10rem;
}

.corridor__route svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.corridor__path,
.corridor__pulse {
  fill: none;
  stroke-linecap: round;
}

.corridor__path {
  stroke: var(--corridor-line);
  stroke-width: 2;
  stroke-dasharray: 7 9;
}

.corridor__stop--start { stop-color: var(--corridor-accent-start); }
.corridor__stop--middle { stop-color: var(--corridor-accent-middle); }
.corridor__stop--end { stop-color: var(--corridor-accent-end); }

.corridor__pulse {
  stroke: url(#corridor-gradient);
  stroke-width: 3;
  stroke-dasharray: 16 315;
  filter: drop-shadow(0 0 6px rgb(1 232 252 / 85%));
  animation: corridor-flow 3.4s linear infinite alternate;
}

.corridor__node {
  position: absolute;
  top: 50%;
  display: grid;
  justify-items: center;
  transform: translateY(-50%);
}

.corridor__node--brazil { left: 0; }
.corridor__node--peru { right: 0; }

.corridor__node img {
  width: clamp(3rem, 9vw, 3.75rem);
  height: clamp(3rem, 9vw, 3.75rem);
  border: 3px solid var(--corridor-label);
  border-radius: 999px;
  object-fit: cover;
  box-shadow: 0 14px 28px -10px rgb(0 0 0 / 62%);
}

.corridor__node strong {
  margin-top: 0.45rem;
  color: var(--corridor-label);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
}

.corridor__node small {
  color: var(--corridor-muted);
  font-size: 0.65rem;
  font-weight: 700;
}

.corridor__traveler {
  filter: drop-shadow(0 8px 10px rgb(0 0 0 / 55%)) drop-shadow(0 0 8px rgb(1 232 252 / 35%));
}

.corridor__traveler--static { display: none; }

@keyframes corridor-flow {
  to { stroke-dashoffset: -330; }
}

@media (max-width: 480px) {
  .corridor { min-height: 9rem; }
  .corridor__route { height: 8.75rem; }
  .corridor__route svg { height: 8.75rem; }
}

@media (prefers-reduced-motion: reduce) {
  .corridor__pulse {
    animation: none;
  }
  .corridor__traveler--moving { display: none; }
  .corridor__traveler--static { display: block; }
}
</style>
