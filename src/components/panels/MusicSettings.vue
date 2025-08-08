<template>
  <div class="music-settings">
    <!-- Universal Music Player -->
    <UniversalMusicPlayer />
  </div>
</template>

<script setup>
import UniversalMusicPlayer from '../UniversalMusicPlayer.vue'
</script>

<style scoped>
.music-settings {
  color: var(--color-text-primary);
}
</style>