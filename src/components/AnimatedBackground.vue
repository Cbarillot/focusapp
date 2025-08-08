<template>
  <div class="dynamic-background">
    <!-- Gradient background -->
    <div 
      v-if="theme.type === 'gradient'"
      class="gradient-bg"
      :style="{ background: theme.background }"
    ></div>
    
    <!-- Image background -->
    <div 
      v-else-if="theme.type === 'image'"
      class="image-bg"
      :style="{ backgroundImage: theme.background }"
    ></div>
    
    <!-- Video background -->
    <video 
      v-else-if="theme.type === 'video'"
      class="video-bg"
      :src="theme.backgroundSrc"
      autoplay 
      muted 
      loop
      playsinline
    ></video>

    <!-- Overlay for better text readability -->
    <div class="bg-overlay" :style="{ opacity: overlayOpacity }"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  theme: {
    type: Object,
    default: () => ({
      id: 'default',
      background: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
      type: 'gradient',
      primaryColor: '#4b6cb7'
    })
  }
})

// Adjust overlay opacity based on theme type for better readability
const overlayOpacity = computed(() => {
  switch (props.theme.type) {
    case 'image': return 0.3
    case 'video': return 0.4
    default: return 0
  }
})
</script>

<style scoped>
.dynamic-background {
  position: fixed;
  top: 0; 
  left: 0; 
  right: 0; 
  bottom: 0;
  z-index: 0;
}

.gradient-bg {
  width: 100%;
  height: 100%;
  animation: gradientMove 10s ease-in-out infinite alternate;
}

.image-bg {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.video-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0);
  transition: opacity 0.3s ease;
}

@keyframes gradientMove {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(90deg); }
}
</style>