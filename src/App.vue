<template>
  <div class="app">
    <!-- Dynamic Background -->
    <DynamicBackground />
    
    <!-- Main Layout -->
    <div class="main-layout">
      <!-- Header with Timer Mode Switcher and Settings Button -->
      <header class="app-header">
        <!-- Timer Mode Switcher (left side) -->
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
        
        <!-- Settings Button (right side) -->
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
          <!-- Mini Todo Widget -->
          <div class="mini-todo-widget">
            <div class="widget-header">
              <h3>Quick Tasks</h3>
              <button class="add-task-btn" @click="showAddTask = !showAddTask">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            
            <!-- Add task input -->
            <div v-if="showAddTask" class="add-task-form">
              <input 
                v-model="newTaskText"
                @keyup.enter="addQuickTask"
                @keyup.escape="showAddTask = false"
                type="text" 
                placeholder="Add a quick task..."
                class="task-input"
                ref="taskInput"
              />
              <div class="task-actions">
                <button @click="addQuickTask" class="task-action-btn primary">Add</button>
                <button @click="showAddTask = false" class="task-action-btn">Cancel</button>
              </div>
            </div>
            
            <!-- Todo list -->
            <div class="mini-todo-list">
              <div 
                v-for="task in recentTasks"
                :key="task.id"
                class="mini-task-item"
                :class="{ completed: task.completed }"
              >
                <button 
                  @click="store.toggleTodo(task.id)"
                  class="task-check"
                >
                  <svg v-if="task.completed" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <span class="task-text">{{ task.text }}</span>
                <button @click="store.deleteTodo(task.id)" class="task-delete">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <div v-if="recentTasks.length === 0" class="empty-state">
                <p>No tasks yet. Add one to get started!</p>
              </div>
            </div>
            
            <div class="widget-footer">
              <button @click="store.setActiveTab('todo')" class="view-all-btn">
                View All Tasks
              </button>
            </div>
          </div>
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
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useAppStore } from './stores/appStore'
import DynamicBackground from './components/DynamicBackground.vue'
import SidePanel from './components/SidePanel.vue'
import CornerNavigation from './components/CornerNavigation.vue'

const store = useAppStore()

// Mini todo widget state
const showAddTask = ref(false)
const newTaskText = ref('')
const taskInput = ref(null)

// Current time for home mode
const currentTimeString = ref('')

const currentTime = computed(() => currentTimeString.value)

// Recent tasks for mini widget (show latest 5 tasks)
const recentTasks = computed(() => {
  return store.todos.slice(-5).reverse()
})

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

function addQuickTask() {
  if (newTaskText.value.trim()) {
    store.addTodo({
      text: newTaskText.value.trim(),
      priority: 'medium',
      urgency: 'medium'
    })
    newTaskText.value = ''
    showAddTask.value = false
  }
}

// Auto-focus the input when showing add task form
watch(showAddTask, (newVal) => {
  if (newVal) {
    nextTick(() => {
      taskInput.value?.focus()
    })
  }
})

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
      <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const FocusIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
      <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const AmbianceIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 16.92V12C22 6.48 17.52 2 12 2S2 6.48 2 12V16.92C2 18.07 2.93 19 4.08 19H5C5.55 19 6 18.55 6 18V14C6 13.45 5.55 13 5 13H4V12C4 7.58 7.58 4 12 4S20 7.58 20 12V13H19C18.45 13 18 13.45 18 14V18C18 18.55 18.45 19 19 19H19.92C21.07 19 22 18.07 22 16.92Z" fill="currentColor"/>
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
  left: 20px;
  right: 20px;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timer-mode-switcher {
  display: flex;
  gap: 8px;
  padding: 8px;
  border-radius: var(--border-radius-full);
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid var(--color-border);
}

.mode-switcher-btn {
  width: 44px;
  height: 44px;
  border-radius: var(--border-radius-full);
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.mode-switcher-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
  transform: scale(1.05);
}

.mode-switcher-btn.active {
  background: var(--color-primary);
  color: var(--color-text-primary);
  transform: scale(1.1);
}

.settings-btn {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-full);
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
}

.settings-btn:hover {
  background: rgba(255, 255, 255, 0.1);
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
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-full);
  border: 1px solid var(--color-border);
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

/* Home Mode - Digital clock display at top with reduced opacity */
.home-clock {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  opacity: 0.7; /* Reduced opacity as requested */
}

.clock-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--color-border);
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

/* Mini Todo Widget */
.mini-todo-widget {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--color-border);
  padding: 20px;
  margin-bottom: 20px;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.widget-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.add-task-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-full);
  background: var(--color-primary);
  border: none;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-task-btn:hover {
  background: var(--color-primary-dark);
  transform: scale(1.1);
}

.add-task-form {
  margin-bottom: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-border);
}

.task-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
  font-size: 14px;
  margin-bottom: 12px;
}

.task-input:focus {
  border-color: var(--color-primary);
  background: rgba(255, 255, 255, 0.1);
}

.task-input::placeholder {
  color: var(--color-text-muted);
}

.task-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.task-action-btn {
  padding: 8px 16px;
  border-radius: var(--border-radius-sm);
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.task-action-btn.primary {
  background: var(--color-primary);
  color: var(--color-text-primary);
}

.task-action-btn.primary:hover {
  background: var(--color-primary-dark);
}

.task-action-btn:not(.primary) {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.task-action-btn:not(.primary):hover {
  background: rgba(255, 255, 255, 0.2);
  color: var(--color-text-primary);
}

.mini-todo-list {
  max-height: 300px;
  overflow-y: auto;
}

.mini-task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mini-task-item:last-child {
  border-bottom: none;
}

.mini-task-item.completed {
  opacity: 0.6;
}

.task-check {
  width: 20px;
  height: 20px;
  border-radius: var(--border-radius-sm);
  border: 2px solid var(--color-border);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.task-check:hover {
  border-color: var(--color-primary);
}

.mini-task-item.completed .task-check {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-primary);
}

.task-text {
  flex: 1;
  font-size: 14px;
  color: var(--color-text-primary);
}

.mini-task-item.completed .task-text {
  text-decoration: line-through;
  color: var(--color-text-secondary);
}

.task-delete {
  width: 24px;
  height: 24px;
  border-radius: var(--border-radius-sm);
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  opacity: 0;
}

.mini-task-item:hover .task-delete {
  opacity: 1;
}

.task-delete:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-secondary);
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--color-text-secondary);
}

.empty-state p {
  margin: 0;
  font-size: 14px;
  opacity: 0.7;
}

.widget-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.view-all-btn {
  padding: 8px 16px;
  border-radius: var(--border-radius-sm);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-all-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
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

  .mini-todo-widget {
    padding: 16px;
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
  
  .mini-todo-widget {
    padding: 12px;
  }
  
  .widget-header h3 {
    font-size: 16px;
  }
  
  .add-task-btn {
    width: 28px;
    height: 28px;
  }
}
</style>