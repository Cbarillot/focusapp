<template>
  <div class="app">
    <!-- Dynamic Background -->
    <DynamicBackground />
    
    <!-- Main Layout -->
    <div class="main-layout">
      <!-- Header with Timer Mode Switcher -->
      <header class="app-header">
        <!-- Timer Mode Switcher (centered) -->
        <div class="timer-mode-switcher">
          <button 
            v-for="mode in timerModes" 
            :key="mode.key"
            class="mode-switcher-btn"
            :class="{ active: store.timerDisplayMode === mode.key }"
            @click="store.setTimerDisplayMode(mode.key)"
            :title="mode.name"
          >
            <component :is="mode.icon" />
          </button>
        </div>
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

      <!-- Home Mode - Digital clock display at top -->
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
        <div class="content-container">
          <!-- Content area is now available for other uses -->
        </div>
      </main>
      
      <!-- Todo Sidebar - Available in all modes -->
      <TodoSidebar />
      
      <!-- Corner Navigation - replaces footer for cleaner layout -->
      <CornerNavigation />
    </div>
    
    <!-- Side Panel -->
    <Transition name="slide">
      <div v-if="store.sidebarOpen" class="sidebar" :style="{ width: sidebarWidth + 'px' }">
        <div 
          class="sidebar-resize-handle"
          @mousedown="startResize"
        ></div>
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
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useAppStore } from './stores/appStore'
import DynamicBackground from './components/DynamicBackground.vue'
import SidePanel from './components/SidePanel.vue'
import CornerNavigation from './components/CornerNavigation.vue'
import TodoSidebar from './components/TodoSidebar.vue'

const store = useAppStore()

// Sidebar resize functionality
const sidebarWidth = ref(400)
const isResizing = ref(false)

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

// Sidebar resize functionality
function startResize(e) {
  isResizing.value = true
  const startX = e.clientX
  const startWidth = sidebarWidth.value

  function doResize(e) {
    if (!isResizing.value) return
    const deltaX = startX - e.clientX
    const newWidth = Math.max(320, Math.min(800, startWidth + deltaX))
    sidebarWidth.value = newWidth
  }

  function stopResize() {
    isResizing.value = false
    document.removeEventListener('mousemove', doResize)
    document.removeEventListener('mouseup', stopResize)
  }

  document.addEventListener('mousemove', doResize)
  document.addEventListener('mouseup', stopResize)
  e.preventDefault()
}

const modes = [
  { key: 'pomodoro', label: 'Pomodoro' },
  { key: 'shortBreak', label: 'Short Break' },
  { key: 'longBreak', label: 'Long Break' }
]

const timerModes = [
  { 
    key: 'home', 
    name: 'Home', 
    icon: 'HomeIcon' 
  },
  { 
    key: 'focus', 
    name: 'Focus', 
    icon: 'FocusIcon' 
  },
  { 
    key: 'ambiance', 
    name: 'Ambiance', 
    icon: 'AmbianceIcon' 
  }
]
</script>

<script>
// Timer Mode Icons
const HomeIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 22V12H15V22" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const FocusIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2"/>
      <path d="M12 6V12L16 14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const AmbianceIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 16.92V12C22 6.48 17.52 2 12 2S2 6.48 2 12V16.92C2 18.07 2.93 19 4.08 19H5C5.55 19 6 18.55 6 18V14C6 13.45 5.55 13 5 13H4V12C4 7.58 7.58 4 12 4S20 7.58 20 12V13H19C18.45 13 18 13.45 18 14V18C18 18.55 18.45 19 19 19H19.92C21.07 19 22 18.07 22 16.92Z" fill="white"/>
    </svg>
  `
}

export default {
  components: {
    HomeIcon,
    FocusIcon,
    AmbianceIcon
  }
}
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
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}

.timer-mode-switcher {
  display: flex;
  gap: 8px;
  padding: 8px;
  border-radius: var(--border-radius-full);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.mode-switcher-btn {
  width: 44px;
  height: 44px;
  border-radius: var(--border-radius-full);
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.mode-switcher-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
  transform: scale(1.05);
}

.mode-switcher-btn.active {
  background: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 1);
  transform: scale(1.1);
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
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.mode-tab:hover {
  background: rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 1);
}

.mode-tab.active {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  color: rgba(255, 255, 255, 1);
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
  background: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 1);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.control-btn.primary:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.control-btn.secondary {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.8);
}

.control-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
}

/* Footer - No longer needed as navigation is in corners */
/* Removed .app-footer styles as they're replaced by corner navigation */

/* Sidebar - Resizable panel on right side */
.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px; /* Default width */
  min-width: 320px;
  max-width: 800px;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  z-index: 200;
  overflow-y: auto;
}

.sidebar-resize-handle {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: transparent;
  cursor: ew-resize;
  z-index: 201;
  transition: background-color 0.2s ease;
}

.sidebar-resize-handle:hover,
.sidebar:hover .sidebar-resize-handle {
  background: var(--color-primary);
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

/* Ambiance Mode - Smaller timer in top-right corner */
.ambiance-timer {
  position: fixed;
  top: 20px;
  right: 200px; /* Move further left to accommodate settings button */
  z-index: 50;
}

.mini-timer-container {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-full);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.mini-mode-indicator {
  width: 16px;
  height: 16px;
  background: var(--color-primary);
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.mini-time {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  font-family: 'Be Vietnam Pro', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', monospace;
  letter-spacing: 0.02em;
}

.mini-control-btn {
  width: 20px;
  height: 20px;
  border-radius: var(--border-radius-full);
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mini-control-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* Home Mode - Digital clock display at top with reduced opacity */
.home-clock {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  opacity: 0.8; /* Slightly increased for better readability */
}

.clock-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.current-time {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-primary);
  font-family: 'Be Vietnam Pro', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', monospace;
  letter-spacing: 0.05em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.session-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  opacity: 0.8;
}

.session-type {
  color: var(--color-text-secondary);
  font-weight: 500;
}

.session-time {
  color: var(--color-primary);
  font-weight: 600;
  font-family: 'Be Vietnam Pro', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', monospace;
}

.session-control-btn {
  background: none;
  border: none;
  font-size: 12px;
  cursor: pointer;
  transition: transform 0.2s ease;
  opacity: 0.7;
}

.session-control-btn:hover {
  transform: scale(1.2);
  opacity: 1;
}

/* Content Area for non-focus modes */
.content-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 20px 80px;
}

.content-container {
  max-width: 600px;
  width: 100%;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 100vw;
  }
  
  .app-header {
    top: 15px;
    left: 15px;
    right: 15px;
  }
  
  .timer-mode-switcher {
    padding: 6px;
    gap: 6px;
  }
  
  .mode-switcher-btn {
    width: 40px;
    height: 40px;
  }
  
  .settings-btn {
    width: 44px;
    height: 44px;
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
    padding: 4px 8px;
    gap: 4px;
  }

  .mini-time {
    font-size: 12px;
  }

  .mini-control-btn {
    width: 18px;
    height: 18px;
  }

  .home-clock {
    top: 15px;
  }

  .clock-container {
    padding: 10px 16px;
    gap: 4px;
  }

  .current-time {
    font-size: 24px;
  }

  .session-info {
    gap: 6px;
    font-size: 11px;
  }

  .content-area {
    padding: 100px 15px 80px;
  }
}

@media (max-width: 480px) {
  .app-header {
    top: 12px;
    left: 12px;
    right: 12px;
  }
  
  .timer-mode-switcher {
    padding: 4px;
    gap: 4px;
  }
  
  .mode-switcher-btn {
    width: 36px;
    height: 36px;
  }
  
  .settings-btn {
    width: 40px;
    height: 40px;
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
  
  .ambiance-timer {
    top: 12px;
    right: 58px;
  }
  
  .home-clock {
    top: 12px;
  }
  
  .current-time {
    font-size: 20px;
  }
  
  .content-area {
    padding: 80px 12px 80px;
  }
}
</style>