<!--
  FocusApp - Main Application Component
  
  A modern Pomodoro focus application with advanced features:
  - Pomodoro timer with customizable intervals
  - Dynamic background system (gradients, images, videos)
  - Music integration (YouTube, Spotify, Deezer, local files)
  - Comprehensive task management
  - Modern glassmorphic UI design
  - Responsive and accessible interface
  
  Layout Structure:
  - DynamicBackground: Handles all background types and animations
  - Header: Contains settings toggle button
  - Main: Timer display and controls
  - Footer: Ambient soundscape controls
  - Sidebar: Settings panels (timer, themes, music, background, todo)
-->
<template>
  <div class="app">
    <!-- Dynamic Background Layer -->
    <!-- Supports gradients, solid colors, images, and videos -->
    <DynamicBackground />
    
    <!-- Main Application Layout -->
    <div class="main-layout">
      <!-- Application Header with Settings Access -->
      <header class="app-header">
        <button 
          class="settings-btn"
          @click="store.toggleSidebar()"
          :class="{ active: store.sidebarOpen }"
          aria-label="Open settings panel"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </header>
      
      <!-- Central Timer Interface -->
      <main class="timer-area">
        <div class="timer-container">
          <!-- Pomodoro Mode Selection Tabs -->
          <div class="mode-tabs" role="tablist" aria-label="Timer modes">
            <button 
              v-for="mode in modes" 
              :key="mode.key"
              class="mode-tab"
              :class="{ active: store.timerMode === mode.key }"
              @click="store.switchMode(mode.key)"
              role="tab"
              :aria-selected="store.timerMode === mode.key"
              :aria-label="`Switch to ${mode.label} mode`"
            >
              {{ mode.label }}
            </button>
          </div>
          
          <!-- Timer Display and Controls -->
          <div class="timer-display">
            <!-- Large Time Display -->
            <div class="time" role="timer" :aria-label="`${store.displayTime} remaining`">
              {{ store.displayTime }}
            </div>
            
            <!-- Timer Control Buttons -->
            <div class="timer-controls">
              <button 
                class="control-btn primary"
                @click="store.toggleTimer()"
                :aria-label="store.isRunning ? 'Pause timer' : 'Start timer'"
              >
                {{ store.isRunning ? 'Pause' : 'Start' }}
              </button>
              <button 
                class="control-btn secondary"
                @click="store.resetTimer()"
                aria-label="Reset timer to initial value"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <!-- Footer with Ambient Soundscapes -->
      <footer class="app-footer">
        <SoundscapeControls />
      </footer>
    </div>
    
    <!-- Settings Sidebar Panel -->
    <!-- Slides in from the left with backdrop blur -->
    <Transition name="slide">
      <div v-if="store.sidebarOpen" class="sidebar" role="dialog" aria-labelledby="settings-title">
        <SidePanel />
      </div>
    </Transition>
    
    <!-- Sidebar Backdrop Overlay -->
    <Transition name="fade">
      <div 
        v-if="store.sidebarOpen" 
        class="sidebar-overlay"
        @click="store.toggleSidebar()"
        aria-label="Close settings panel"
      ></div>
    </Transition>
  </div>
</template>

<script setup>
/**
 * FocusApp - Main Application Setup
 * 
 * This is the main entry point for the FocusApp Vue.js application.
 * It sets up the core components and manages the overall application state
 * through the Pinia store system.
 * 
 * Features integrated:
 * - Pomodoro timer with multiple modes (work, short break, long break)
 * - Dynamic background system with support for gradients, images, videos
 * - Music integration with YouTube, Spotify, Deezer, and local files
 * - Task management system with priorities and pomodoro estimates  
 * - Modern glassmorphic UI with responsive design
 * - Ambient soundscape controls for focus enhancement
 */

import { useAppStore } from './stores/appStore'
import DynamicBackground from './components/DynamicBackground.vue'
import SidePanel from './components/SidePanel.vue'
import SoundscapeControls from './components/SoundscapeControls.vue'

// Initialize the main application store
const store = useAppStore()

/**
 * Pomodoro timer mode definitions
 * Each mode has a key for state management and a user-friendly label
 */
const modes = [
  { key: 'pomodoro', label: 'Pomodoro' },      // 25-minute work session
  { key: 'shortBreak', label: 'Short Break' }, // 5-minute break
  { key: 'longBreak', label: 'Long Break' }    // 15-minute extended break
]

/**
 * TODO: Future enhancements to consider:
 * 
 * 1. Notification System:
 *    - Browser notifications when timer completes
 *    - Custom notification sounds
 *    - Desktop integration
 * 
 * 2. Analytics & Statistics:
 *    - Track completed pomodoros per day/week/month
 *    - Productivity insights and charts
 *    - Task completion rates
 * 
 * 3. Advanced Integrations:
 *    - Calendar integration (Google Calendar, Outlook)
 *    - Productivity app sync (Todoist, Trello, Notion)
 *    - Time tracking exports
 * 
 * 4. Customization:
 *    - Custom timer durations
 *    - Personalized themes beyond color schemes
 *    - UI layout preferences
 * 
 * 5. Collaboration Features:
 *    - Shared pomodoro sessions
 *    - Team productivity tracking
 *    - Focus room creation
 */
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