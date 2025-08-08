<template>
  <AnimatedBackground />
  <div class="container">
    <h1>Flocus Clone (Vue 3)</h1>
    <PomodoroTimer />
    <MusicPlayer />
  </div>
</template>

<script setup>
import AnimatedBackground from './components/AnimatedBackground.vue'
import PomodoroTimer from './components/PomodoroTimer.vue'
import MusicPlayer from './components/MusicPlayer.vue'
</script>

<style>
.container {
  position: relative;
  z-index: 1;
  max-width: 400px;
  margin: auto;
  background: rgba(255,255,255,0.8);
  border-radius: 10px;
  padding: 2em;
  margin-top: 3em;
  box-shadow: 0 2px 12px rgba(0,0,0,0.2);
}
</style>