<template>
  <div class="app">
    <!-- Dynamic Background -->
    <DynamicBackground />
    
    <!-- Main Layout -->
    <div class="main-layout">
      <!-- Header with Navigation Buttons -->
      <header class="app-header">
        <div class="header-left">
          <button
            class="nav-btn menu-btn"
            @click="store.toggleSidebar()"
            :class="{ active: store.sidebarOpen }"
          >
            <svg width="20" height="20" viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 8h24v3H6zM6 16.5h24v3H6zM6 25h24v3H6z"/>
            </svg>
          </button>
          <button class="nav-btn stats-btn" @click="store.setActiveTab('stats')">
            <svg width="18" height="18" viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 30H6V6h2v22h22v2z"/>
              <path d="M8 26h4V16H8v10zm6 0h4V12h-4v14zm6 0h4V8h-4v18zm6 0h4V20h-4v6z"/>
            </svg>
          </button>
        </div>

        <div class="header-right">
          <button class="nav-btn fullscreen-btn" @click="toggleFullscreen()">
            <svg width="18" height="18" viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4h8v2H6v6H4V4zM24 4h8v8h-2V6h-6V4zM32 24v8h-8v-2h6v-6h2zM12 32H4v-8h2v6h6v2z"/>
            </svg>
          </button>
          <button class="nav-btn settings-btn" @click="store.setActiveTab('themes')">
            <svg width="18" height="18" viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="m34.6 23.3-3.2-2.9c.1-.9.1-1.8 0-2.7l3.2-2.9c.3-.3.4-.8.1-1.2l-3-5.2c-.2-.4-.7-.5-1.1-.4l-3.8 1.5c-.7-.5-1.5-1-2.3-1.3L23.8 4c-.1-.4-.4-.7-.8-.7h-6c-.4 0-.7.3-.8.7l-.7 4.2c-.8.3-1.6.8-2.3 1.3L9.4 7.9c-.4-.1-.9 0-1.1.4l-3 5.2c-.3.4-.2.9.1 1.2l3.2 2.9c-.1.9-.1 1.8 0 2.7l-3.2 2.9c-.3.3-.4.8-.1 1.2l3 5.2c.2.4.7.5 1.1.4l3.8-1.5c.7.5 1.5 1 2.3 1.3l.7 4.2c.1.4.4.7.8.7h6c.4 0 .7-.3.8-.7l.7-4.2c.8-.3 1.6-.8 2.3-1.3l3.8 1.5c.4.1.9 0 1.1-.4l3-5.2c.3-.4.2-.9-.1-1.2zM20 23c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z"/>
            </svg>
          </button>
          <button class="nav-btn help-btn" @click="openHelp()">
            <svg width="18" height="18" viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 2C9.2 2 2 9.2 2 18s7.2 16 16 16 16-7.2 16-16S26.8 2 18 2zm0 28c-6.6 0-12-5.4-12-12S11.4 6 18 6s12 5.4 12 12-5.4 12-12 12z"/>
              <path d="M18 26c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM18 20c-1.1 0-2-.9-2-2 0-3.3 2.7-4 2.7-4 .8-.4 1.3-1.2 1.3-2.1 0-1.3-1.1-2.4-2.4-2.4s-2.4 1.1-2.4 2.4c0 1.1-.9 2-2 2s-2-.9-2-2c0-3.5 2.9-6.4 6.4-6.4s6.4 2.9 6.4 6.4c0 2.8-1.6 4.1-3.6 5.1-.4.2-.4.6-.4 1 0 1.1-.9 2-2 2z"/>
            </svg>
          </button>
        </div>
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
      
      <!-- Footer with Soundscapes -->
      <footer class="app-footer">
        <SoundscapeControls />
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
import { useAppStore } from './stores/appStore'
import DynamicBackground from './components/DynamicBackground.vue'
import SidePanel from './components/SidePanel.vue'
import SoundscapeControls from './components/SoundscapeControls.vue'

const store = useAppStore()

const modes = [
  { key: 'pomodoro', label: 'Pomodoro' },
  { key: 'shortBreak', label: 'Short Break' },
  { key: 'longBreak', label: 'Long Break' }
]

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

function openHelp() {
  window.open('https://help.flocus.com', '_blank')
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
  left: 20px;
  right: 20px;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-btn {
  width: 44px;
  height: 44px;
  border-radius: var(--border-radius-full);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.nav-btn.active {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 255, 255, 0.9);
  color: #6B46C1;
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.3);
}

/* Timer Area */
.timer-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 20px 100px;
  min-height: 100vh;
}

.timer-container {
  text-align: center;
  max-width: 700px;
  width: 100%;
}

.mode-tabs {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 80px;
  flex-wrap: wrap;
}

.mode-tab {
  padding: 14px 28px;
  border-radius: var(--border-radius-full);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.4;
  transition: all 0.2s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.mode-tab:hover {
  background: rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.95);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.mode-tab.active {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.95);
  color: #6B46C1;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.3);
}

.timer-display {
  margin-bottom: 60px;
}

.time {
  margin-bottom: 50px;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
  font-family: 'Be Vietnam Pro', system-ui, -apple-system, sans-serif;
  font-size: clamp(5rem, 15vw, 140px);
  font-weight: 200;
  line-height: 0.9;
  letter-spacing: -0.02em;
}

.timer-controls {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.control-btn {
  padding: 18px 36px;
  border-radius: var(--border-radius-full);
  font-size: 16px;
  font-weight: 600;
  min-width: 140px;
  transition: all 0.2s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border: 1px solid transparent;
}

.control-btn.primary {
  background: rgba(255, 255, 255, 0.95);
  color: #6B46C1;
  border: 1px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.3);
}

.control-btn.primary:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.4);
}

.control-btn.secondary {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
}

.control-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Footer */
.app-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
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
  .app-header {
    top: 15px;
    left: 15px;
    right: 15px;
  }

  .nav-btn {
    width: 40px;
    height: 40px;
  }

  .header-left,
  .header-right {
    gap: 6px;
  }

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
    top: 12px;
    left: 12px;
    right: 12px;
  }

  .nav-btn {
    width: 36px;
    height: 36px;
  }

  .header-right .nav-btn:not(.menu-btn):not(.stats-btn) {
    display: none;
  }

  .timer-area {
    padding: 70px 15px 50px;
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
