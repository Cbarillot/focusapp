<template>
  <div class="app">
    <!-- Dynamic Background -->
    <DynamicBackground />
    
    <!-- Main Layout -->
    <div class="main-layout">
      <!-- Header with Settings Button -->
      <header class="app-header">
        <button 
          class="settings-btn"
          @click="store.toggleSidebar()"
          :class="{ active: store.sidebarOpen }"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </header>
      
      <!-- Central Timer Area -->
      <main class="timer-area">
        <div class="timer-container">
          <!-- Mode Tabs -->
          <div class="mode-tabs">
            <button 
              v-for="mode in modes" 
              :key="mode.key"
              class="mode-tab"
              :class="{ active: store.timerMode === mode.key }"
              @click="store.switchMode(mode.key)"
            >
              {{ mode.label }}
            </button>
          </div>
          
          <!-- Timer Display -->
          <div class="timer-display">
            <div class="time">{{ store.displayTime }}</div>
            <div class="timer-controls">
              <button 
                class="control-btn primary"
                @click="store.toggleTimer()"
              >
                {{ store.isRunning ? 'Pause' : 'Start' }}
              </button>
              <button 
                class="control-btn secondary"
                @click="store.resetTimer()"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <!-- Footer with Bottom Navigation -->
      <footer class="app-footer">
        <SoundscapeControls />
        <BottomNavigation />
      </footer>
    </div>
    
    <!-- Side Panel -->
    <Transition name="slide">
      <div v-if="store.sidebarOpen" class="sidebar">
        <SidePanel />
      </div>
    </Transition>
    
    <!-- Sidebar Overlay -->
    <Transition name="fade">
      <div 
        v-if="store.sidebarOpen" 
        class="sidebar-overlay"
        @click="store.toggleSidebar()"
      ></div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from './stores/appStore'
import DynamicBackground from './components/DynamicBackground.vue'
import SidePanel from './components/SidePanel.vue'
import SoundscapeControls from './components/SoundscapeControls.vue'
import BottomNavigation from './components/BottomNavigation.vue'

// Variables fusionnées pour la gestion des thèmes, du background et du fullscreen
const activeTab = ref('themes') // themes, clock, timer, stats, music, notepad, sounds, quotes, background, todo
const isFullscreen = ref(false) // Fullscreen mode state

// Theme & styling
const currentTheme = ref('toto-forest') // home, ambiance, focus, toto-forest, etc.
const backgroundType = ref('canvas') // gradient, image, video, canvas, color, youtube, animated-gradient
const backgroundValue = ref('lava-lamp') // valeur par défaut selon le backgroundType
const overlayOpacity = ref(0.2) // compromis entre 0.1 et 0.3

// Custom gradient colors (utilisé pour les backgrounds personnalisés)
const customGradientColors = ref(['#DF437A', '#3d57d6', '#a117fd', '#ec634b'])

// Authentic Flocus themes with official assets + custom and canvas/animated themes
const themes = ref({
  // Gradients & Couleurs
  'aura-twilight': {
    name: 'Aura Twilight',
    type: 'image',
    value: 'https://app.flocus.com/resources/images/themes/fc5d2c05dba5c17ea3fa.jpg',
    preview: 'https://app.flocus.com/resources/images/themes/58caf7f5c0a933ebfcf7.jpg'
  },
  // Ajoutez ici les autres thèmes et backgrounds customisés
  'lava-lamp': {
    name: 'Lava Lamp',
    type: 'canvas',
    value: 'lava-lamp',
    colors: ['#DF437A', '#3d57d6', '#a117fd', '#ec634b'],
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojREY0MzdBIiAvPjxzdG9wIG9mZnNldD0iMzMlIiBzdHlsZT0ic3RvcC1jb2xvcjojM2Q1N2Q2IiAvPjxzdG9wIG9mZnNldD0iNjYlIiBzdHlsZT0ic3RvcC1jb2xvcjojYTExN2ZkIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2VjNjM0YiIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0idXJsKCNncmFkKSIgcng9IjgiLz48L3N2Zz4='
  },
  'custom-animated-gradient': {
    name: 'Custom Animated Gradient',
    type: 'animated-gradient',
    value: 'custom',
    colors: ['#DF437A', '#3d57d6', '#a117fd', '#ec634b'],
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhbmltYXRlZCIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojREY0MzdBIiAvPjxzdG9wIG9mZnNldD0iMzMlIiBzdHlsZT0ic3RvcC1jb2xvcjojM2Q1N2Q2IiAvPjxzdG9wIG9mZnNldD0iNjYlIiBzdHlsZT0ic3RvcC1jb2xvcjojYTExN2ZkIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2VjNjM0YiIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0idXJsKCNhbmltYXRlZCkiIHJ4PSI4Ii8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iNjAiIHI9IjMiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjgiPjxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIHZhbHVlcz0iMC44OzAuMzswLjgiIGR1cj0iMnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+PC9jaXJjbGU+PC9zdmc+'
  }
})

const store = useAppStore()

const modes = [
  { key: 'pomodoro', label: 'Pomodoro' },
  { key: 'shortBreak', label: 'Short Break' },
  { key: 'longBreak', label: 'Long Break' }
]
</script>

<style scoped>
.app {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.main-layout {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.app-header {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 100;
}

.settings-btn {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-full);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
}

.settings-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.settings-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

/* Timer Area */
.timer-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 20px 80px;
}

.timer-container {
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.mode-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 60px;
  flex-wrap: wrap;
}

.mode-tab {
  padding: 12px 24px;
  border-radius: var(--border-radius-full);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.mode-tab:hover {
  background: rgba(255, 255, 255, 0.15);
  color: var(--color-text-primary);
}

.mode-tab.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-primary);
}

.timer-display {
  margin-bottom: 40px;
}

.time {
  font-size: clamp(4rem, 12vw, 8rem);
  font-weight: 300;
  line-height: 1;
  margin-bottom: 40px;
  color: var(--color-text-primary);
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

.timer-controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.control-btn {
  padding: 16px 32px;
  border-radius: var(--border-radius-full);
  font-size: 16px;
  font-weight: 600;
  min-width: 120px;
  transition: all var(--transition-fast);
}

.control-btn.primary {
  background: var(--color-primary);
  color: var(--color-text-primary);
}

.control-btn.primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.control-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}

.control-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  color: var(--color-text-primary);
  transform: translateY(-2px);
}

/* Footer */
.app-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

/* Sidebar - Moved to right side with improved tab navigation */
.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  z-index: 200;
  overflow-y: auto;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 150;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 100vw;
  }
  
  .timer-area {
    padding: 80px 20px 60px;
  }
  
  .mode-tabs {
    margin-bottom: 40px;
  }
  
  .mode-tab {
    padding: 10px 20px;
    font-size: 13px;
  }
  
  .control-btn {
    padding: 14px 28px;
    font-size: 15px;
    min-width: 100px;
  }
}

@media (max-width: 480px) {
  .app-header {
    top: 15px;
    left: 15px;
  }
  
  .settings-btn {
    width: 44px;
    height: 44px;
  }
  
  .timer-area {
    padding: 70px 15px 80px; /* Added bottom padding for bottom nav */
  }
  
  .mode-tabs {
    gap: 6px;
    margin-bottom: 30px;
  }
  
  .mode-tab {
    padding: 8px 16px;
    font-size: 12px;
  }
  
  .timer-controls {
    gap: 12px;
  }
  
  .control-btn {
    padding: 12px 24px;
    font-size: 14px;
    min-width: 90px;
  }
}
</style>