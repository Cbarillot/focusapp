<template>
  <!-- Dynamic Background -->
  <AnimatedBackground :theme="currentTheme" />
  
  <!-- Retractable Todo List -->
  <TodoList :theme="currentTheme" />
  
  <!-- Main Application Container -->
  <div class="app-container">
    <!-- App Header -->
    <header class="app-header">
      <h1 class="app-title">Focus App</h1>
      <div class="app-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
          :style="{ 
            borderBottomColor: activeTab === tab.id ? currentTheme.primaryColor : 'transparent',
            color: activeTab === tab.id ? currentTheme.primaryColor : '#666'
          }"
        >
          {{ tab.icon }} {{ tab.name }}
        </button>
      </div>
    </header>

    <!-- Tab Content -->
    <main class="tab-content">
      <!-- Focus Tab (Pomodoro) -->
      <div v-if="activeTab === 'focus'" class="focus-tab">
        <PomodoroTimer :theme="currentTheme" />
      </div>

      <!-- Music Tab -->
      <div v-if="activeTab === 'music'" class="music-tab">
        <EnhancedMusicPlayer 
          :theme="currentTheme"
          @youtube-background-change="handleYoutubeBackground"
        />
      </div>

      <!-- Theme Tab -->
      <div v-if="activeTab === 'theme'" class="theme-tab">
        <ThemeManager @theme-changed="handleThemeChange" />
      </div>
    </main>

    <!-- YouTube Background Video (when enabled) -->
    <div v-if="youtubeBackground.enabled" class="youtube-background">
      <iframe
        :src="`https://www.youtube.com/embed/${extractVideoId(youtubeBackground.video?.url)}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
      ></iframe>
      <div class="youtube-overlay" :style="{ backgroundColor: `${currentTheme.primaryColor}20` }"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import AnimatedBackground from './components/AnimatedBackground.vue'
import PomodoroTimer from './components/PomodoroTimer.vue'
import ThemeManager from './components/ThemeManager.vue'
import EnhancedMusicPlayer from './components/EnhancedMusicPlayer.vue'
import TodoList from './components/TodoList.vue'

// Global app state
const activeTab = ref('focus')

// App tabs configuration
const tabs = ref([
  { id: 'focus', name: 'Focus', icon: '⏱️' },
  { id: 'music', name: 'Musique', icon: '🎵' },
  { id: 'theme', name: 'Thème', icon: '🎨' }
])

// Current theme state
const currentTheme = reactive({
  id: 'default',
  name: 'Default',
  background: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
  primaryColor: '#4b6cb7',
  type: 'gradient'
})

// YouTube background state
const youtubeBackground = reactive({
  enabled: false,
  video: null
})

// Theme management
function handleThemeChange(theme) {
  Object.assign(currentTheme, theme)
  updateCSSVariables()
}

function updateCSSVariables() {
  document.documentElement.style.setProperty('--primary-color', currentTheme.primaryColor)
  document.documentElement.style.setProperty('--theme-bg', currentTheme.background)
}

// YouTube background management
function handleYoutubeBackground(config) {
  youtubeBackground.enabled = config.enabled
  youtubeBackground.video = config.video
}

function extractVideoId(url) {
  if (!url) return ''
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
  const match = url.match(regex)
  return match ? match[1] : ''
}

// Keyboard shortcuts
function handleGlobalKeyboard(event) {
  // Tab navigation with Ctrl+1, Ctrl+2, etc.
  if (event.ctrlKey || event.metaKey) {
    const num = parseInt(event.key)
    if (num >= 1 && num <= tabs.value.length) {
      event.preventDefault()
      activeTab.value = tabs.value[num - 1].id
    }
  }
}

// Lifecycle
onMounted(() => {
  updateCSSVariables()
  document.addEventListener('keydown', handleGlobalKeyboard)
})

// Watch for theme changes to update CSS
watch(currentTheme, () => {
  updateCSSVariables()
}, { deep: true })
</script>

<style>
/* Global CSS Variables */
:root {
  --primary-color: #4b6cb7;
  --theme-bg: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow-x: hidden;
}

.app-container {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px 16px 0 0;
  padding: 20px 30px 0;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 0;
}

.app-title {
  margin: 0 0 20px 0;
  font-size: 28px;
  font-weight: 700;
  color: #333;
  text-align: center;
  background: linear-gradient(135deg, var(--primary-color), #667eea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-tabs {
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.app-tabs button {
  flex: 1;
  padding: 15px 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  border-bottom: 3px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.app-tabs button:hover {
  background: rgba(0, 0, 0, 0.03);
  color: var(--primary-color);
}

.app-tabs button.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
  font-weight: 600;
}

.tab-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 0 0 16px 16px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  flex: 1;
  min-height: 400px;
}

.focus-tab,
.music-tab,
.theme-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.youtube-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.youtube-background iframe {
  width: 100vw;
  height: 56.25vw; /* 16:9 aspect ratio */
  min-height: 100vh;
  min-width: 177.78vh; /* 16:9 aspect ratio */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.youtube-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  pointer-events: none;
}

/* Responsive design */
@media (max-width: 768px) {
  .app-container {
    padding: 15px;
  }
  
  .app-header {
    padding: 20px 20px 0;
  }
  
  .app-title {
    font-size: 24px;
  }
  
  .app-tabs button {
    padding: 12px 15px;
    font-size: 14px;
  }
  
  .tab-content {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .app-container {
    padding: 10px;
  }
  
  .app-header {
    padding: 15px 15px 0;
  }
  
  .app-title {
    font-size: 20px;
    margin-bottom: 15px;
  }
  
  .app-tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .app-tabs button {
    min-width: 120px;
    padding: 10px 12px;
    font-size: 13px;
  }
  
  .tab-content {
    padding: 15px;
  }
}

/* Smooth animations */
.tab-content > div {
  animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 4px;
  opacity: 0.7;
}

::-webkit-scrollbar-thumb:hover {
  opacity: 1;
}
</style>