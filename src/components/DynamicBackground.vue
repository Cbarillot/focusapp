<template>
  <div class="dynamic-background">
    <!-- Background Layer -->
    <div 
      class="background-layer"
      :style="backgroundStyle"
    ></div>
    
    <!-- Overlay Layer -->
    <div 
      class="overlay-layer"
      :style="overlayStyle"
    ></div>
    
    <!-- Video Background (if video type) -->
    <video 
      v-if="store.backgroundType === 'video' && store.backgroundValue"
      class="background-video"
      :src="store.backgroundValue"
      autoplay
      loop
      muted
      playsinline
    ></video>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../stores/appStore'

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
    case 'image':
      return {
        backgroundImage: `url(${store.backgroundValue})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    case 'video':
      return {
        background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F59E0B 100%)'
      }
    default:
      return {
        background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F59E0B 100%)'
      }
  }
})

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
