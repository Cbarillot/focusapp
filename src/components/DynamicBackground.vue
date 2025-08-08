<template>
  <div id="bg-wrapper" class="dynamic-background">
    <!-- Background Layer for gradients and colors -->
    <div
      v-if="store.backgroundType === 'gradient' || store.backgroundType === 'color'"
      class="background-layer"
      :style="backgroundStyle"
    ></div>

    <!-- Image Background -->
    <img
      v-if="store.backgroundType === 'image' && store.backgroundValue"
      class="background-image"
      :src="store.backgroundValue"
      alt="Background"
    />

    <!-- Video Background -->
    <video
      id="bg-video"
      v-if="store.backgroundType === 'video' && store.backgroundValue"
      class="background-video"
      :src="store.backgroundValue"
      autoplay
      loop
      muted
      playsinline
    ></video>

    <!-- Canvas Background for animated effects -->
    <AnimatedCanvas
      v-if="store.backgroundType === 'canvas'"
      :animation-type="store.backgroundValue"
      :colors="getCurrentThemeColors()"
    />

    <!-- Overlay Layer -->
    <div
      class="overlay-layer"
      :style="overlayStyle"
    ></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../stores/appStore'
import AnimatedCanvas from './AnimatedCanvas.vue'

const store = useAppStore()

const backgroundStyle = computed(() => {
  switch (store.backgroundType) {
    case 'gradient':
      return {
        background: store.backgroundValue
      }
    case 'color':
      return {
        backgroundColor: store.backgroundValue
      }
    default:
      return {
        background: 'transparent'
      }
  }
})

function getCurrentThemeColors() {
  const currentTheme = store.themes[store.currentTheme]
  return currentTheme?.colors || ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981']
}

const overlayStyle = computed(() => ({
  backgroundColor: `rgba(0, 0, 0, ${store.overlayOpacity})`
}))
</script>

<style scoped>
.dynamic-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
}

.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: all var(--transition-slow);
  animation: gradientShift 20s ease-in-out infinite;
}

.background-video {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
  object-fit: cover;
}

.overlay-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: background-color var(--transition-normal);
  backdrop-filter: blur(1px);
}

@keyframes gradientShift {
  0%, 100% {
    filter: hue-rotate(0deg) brightness(1);
  }
  25% {
    filter: hue-rotate(30deg) brightness(1.1);
  }
  50% {
    filter: hue-rotate(60deg) brightness(1);
  }
  75% {
    filter: hue-rotate(30deg) brightness(0.9);
  }
}
</style>
