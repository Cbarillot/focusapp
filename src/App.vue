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
      
      <!-- Central Timer Area - Focus Mode -->
      <main v-if="store.timerDisplayMode === 'focus'" class="timer-area focus-mode">
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

      <!-- Ambiance Mode - Timer in top-right corner -->
      <div v-else-if="store.timerDisplayMode === 'ambiance'" class="ambiance-timer">
        <div class="mini-timer-container">
          <div class="mini-mode-indicator">{{ store.timerMode.charAt(0).toUpperCase() }}</div>
          <div class="mini-time">{{ store.displayTime }}</div>
          <div class="mini-controls">
            <button 
              class="mini-control-btn"
              @click="store.toggleTimer()"
              :title="store.isRunning ? 'Pause' : 'Start'"
            >
              <svg v-if="!store.isRunning" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
              </svg>
              <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Home Mode - Clock display at top -->
      <div v-else-if="store.timerDisplayMode === 'home'" class="home-clock">
        <div class="clock-container">
          <div class="current-time">{{ currentTime }}</div>
          <div class="session-info">
            <span class="session-type">{{ modes.find(m => m.key === store.timerMode)?.label }}</span>
            <span class="session-time">{{ store.displayTime }}</span>
            <div class="session-controls">
              <button 
                class="session-control-btn"
                @click="store.toggleTimer()"
              >
                {{ store.isRunning ? '⏸️' : '▶️' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Content area for ambiance and home modes -->
      <main v-if="store.timerDisplayMode !== 'focus'" class="content-area">
        <div class="content-placeholder">
          <h2>Focus Content Area</h2>
          <p>This space is available when using Ambiance or Home timer modes.</p>
        </div>
      </main>
      
      <!-- Corner Navigation - replaces footer for cleaner layout -->
      <CornerNavigation />
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from './stores/appStore'
import DynamicBackground from './components/DynamicBackground.vue'
import SidePanel from './components/SidePanel.vue'
import CornerNavigation from './components/CornerNavigation.vue'

const store = useAppStore()

// Current time for home mode
const currentTimeString = ref('')

const currentTime = computed(() => currentTimeString.value)

// Update current time every second
let timeInterval = null

onMounted(() => {
  updateCurrentTime()
  timeInterval = setInterval(updateCurrentTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

function updateCurrentTime() {
  const now = new Date()
  currentTimeString.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

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
  /* Timer display inspired by flocus/app.flocus.com for optimal readability */
  font-family: 'Be Vietnam Pro', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: clamp(5rem, 15vw, 140px);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.04em;
  margin-bottom: 40px;
  color: #fff;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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

/* Footer - No longer needed as navigation is in corners */
/* Removed .app-footer styles as they're replaced by corner navigation */

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

/* Timer Display Modes */

/* Ambiance Mode - Small timer in top-right corner */
.ambiance-timer {
  position: fixed;
  top: 20px;
  right: 80px;
  z-index: 50;
}

.mini-timer-container {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-full);
  border: 1px solid var(--color-border);
}

.mini-mode-indicator {
  width: 20px;
  height: 20px;
  background: var(--color-primary);
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.mini-time {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  font-family: 'Be Vietnam Pro', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  letter-spacing: -0.02em;
}

.mini-control-btn {
  width: 24px;
  height: 24px;
  border-radius: var(--border-radius-full);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mini-control-btn:hover {
  background: var(--color-primary);
  transform: scale(1.1);
}

/* Home Mode - Clock display at top */
.home-clock {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
}

.clock-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--color-border);
}

.current-time {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  font-family: 'Be Vietnam Pro', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  letter-spacing: -0.02em;
}

.session-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.session-type {
  color: var(--color-text-secondary);
  font-weight: 500;
}

.session-time {
  color: var(--color-primary);
  font-weight: 600;
}

.session-control-btn {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.session-control-btn:hover {
  transform: scale(1.2);
}

/* Content Area for non-focus modes */
.content-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 20px 80px;
}

.content-placeholder {
  text-align: center;
  max-width: 600px;
  padding: 40px;
  border-radius: var(--border-radius-lg);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
}

.content-placeholder h2 {
  margin: 0 0 16px 0;
  color: var(--color-text-primary);
  font-size: 24px;
}

.content-placeholder p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 16px;
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

  /* Mobile responsive for new timer modes */
  .ambiance-timer {
    top: 15px;
    right: 70px;
  }

  .mini-timer-container {
    padding: 6px 10px;
    gap: 6px;
  }

  .mini-time {
    font-size: 14px;
  }

  .mini-control-btn {
    width: 20px;
    height: 20px;
  }

  .home-clock {
    top: 15px;
  }

  .clock-container {
    padding: 12px 20px;
    gap: 6px;
  }

  .current-time {
    font-size: 20px;
  }

  .session-info {
    gap: 8px;
    font-size: 12px;
  }

  .content-area {
    padding: 100px 15px 80px;
  }

  .content-placeholder {
    padding: 30px 20px;
  }

  .content-placeholder h2 {
    font-size: 20px;
  }

  .content-placeholder p {
    font-size: 14px;
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