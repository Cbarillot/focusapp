<template>
  <div class="app">
    <!-- Dynamic Background -->
    <DynamicBackground />
    
    <!-- Main Layout -->
    <div class="main-layout">
      
      <!-- Left Sidebar (All Modes) -->
      <div class="left-sidebar">
        <!-- TODO List Button -->
        <div class="sidebar-section">
          <button 
            class="sidebar-btn todo-btn"
            @mouseenter="showTodoPreviewHandler"
            @mouseleave="hideTodoPreview"
            @click="toggleUnifiedLeft"
            title="To-Do List"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11L12 14L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C13.39 3 14.7 3.28 15.9 3.78" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span v-if="incompleteTasks.length > 0" class="task-count">{{ incompleteTasks.length }}</span>
          </button>
          
          <!-- Task Preview -->
          <div 
            v-if="showTodoPreview"
            class="task-preview"
            @mouseenter="showTodoPreviewHandler"
            @mouseleave="hideTodoPreview"
          >
            <div class="preview-header">Tâches en cours ({{ incompleteTasks.length }})</div>
            <div v-if="previewTasks.length > 0" class="preview-tasks">
              <div 
                v-for="task in previewTasks"
                :key="task.id"
                class="preview-task"
                :class="getTaskPriorityClass(task)"
              >
                <div class="priority-dot"></div>
                <span class="task-text">{{ task.text }}</span>
              </div>
            </div>
            <div v-else class="no-tasks">Aucune tâche</div>
          </div>
        </div>

        <!-- Task Preview Panel (Static) -->
        <div class="sidebar-section task-preview-panel">
          <div class="preview-panel-header">APERÇU DES TÂCHES</div>
          <div v-if="previewTasks.length > 0" class="preview-panel-tasks">
            <div 
              v-for="task in previewTasks"
              :key="task.id"
              class="preview-panel-task"
              :class="getTaskPriorityClass(task)"
            >
              <div class="priority-dot"></div>
              <span class="task-text">{{ task.text }}</span>
            </div>
          </div>
          <div v-else class="no-tasks">Aucune tâche</div>
        </div>

        <!-- Music Button -->
        <div class="sidebar-section">
          <button 
            class="sidebar-btn music-btn"
            @mouseenter="showMusicPreviewHandler"
            @mouseleave="hideMusicPreview"
            @click="toggleMusic"
            title="Musique"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="18" r="4" stroke="currentColor" stroke-width="2"/>
              <path d="M12 18V2L21 4V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="20" cy="16" r="2" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
          
          <!-- Music Preview -->
          <div 
            v-if="showMusicPreview"
            class="music-preview"
            @mouseenter="showMusicPreviewHandler"
            @mouseleave="hideMusicPreview"
          >
            <div class="current-music" v-if="store.currentMusic">
              <div class="music-title">{{ store.currentMusic }}</div>
              <div class="music-status">{{ store.musicPlaying ? '🎵 En lecture' : '⏸️ En pause' }}</div>
            </div>
            <div v-else class="no-music">Aucune musique</div>
          </div>
        </div>

        <!-- Sound Button -->
        <div class="sidebar-section">
          <button 
            class="sidebar-btn sound-btn"
            @mouseenter="showSoundPreviewHandler"
            @mouseleave="hideSoundPreview"
            @click="toggleSound"
            title="Sons"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15.54 8.46C16.4731 9.39309 17.0018 10.6691 17.0018 11.995C17.0018 13.3209 16.4731 14.5969 15.54 15.53" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          <!-- Sound Preview -->
          <div 
            v-if="showSoundPreview"
            class="sound-preview"
            @mouseenter="showSoundPreviewHandler"
            @mouseleave="hideSoundPreview"
          >
            <div class="current-sound" v-if="store.currentSound">
              <div class="sound-title">{{ store.currentSound }}</div>
              <div class="sound-status">{{ store.soundPlaying ? '🔊 Actif' : '🔇 Inactif' }}</div>
            </div>
            <div v-else class="no-sound">Aucun son</div>
          </div>
        </div>
      </div>

      <!-- Central Content Area -->
      <main class="central-content">
        <!-- Home Mode - Digital Clock -->
        <div v-if="store.timerDisplayMode === 'home'" class="home-clock-container">
          <div class="digital-clock">{{ currentTime }}</div>
        </div>

        <!-- Focus Mode - Pomodoro Timer -->
        <div v-else-if="store.timerDisplayMode === 'focus'" class="focus-timer-container">
          <!-- Mode Tabs -->
          <div class="timer-mode-tabs">
            <button 
              v-for="mode in modes" 
              :key="mode.key"
              class="timer-mode-tab"
              :class="{ active: store.timerMode === mode.key }"
              @click="store.switchMode(mode.key)"
            >
              {{ mode.label }}
            </button>
          </div>
          
          <!-- Timer Display -->
          <div class="timer-display">
            <div class="timer-time">{{ store.displayTime }}</div>
            <div class="timer-controls">
              <button 
                class="timer-control-btn primary"
                @click="store.toggleTimer()"
              >
                {{ store.isRunning ? 'Pause' : 'Start' }}
              </button>
              <button 
                class="timer-control-btn secondary"
                @click="store.resetTimer()"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <!-- Ambiance Mode - Empty center, timer in top-right corner -->
        <div v-else-if="store.timerDisplayMode === 'ambiance'" class="ambiance-content">
          <!-- Main content area is empty for ambiance mode -->
        </div>
      </main>

      <!-- Ambiance Mode Compact Timer (Top-Right) -->
      <div v-if="store.timerDisplayMode === 'ambiance'" class="ambiance-timer">
        <!-- Mode Tabs -->
        <div class="ambiance-mode-tabs">
          <button 
            v-for="mode in modes" 
            :key="mode.key"
            class="ambiance-mode-tab"
            :class="{ active: store.timerMode === mode.key }"
            @click="store.switchMode(mode.key)"
          >
            {{ mode.label.charAt(0) }}
          </button>
        </div>
        
        <!-- Compact Timer Display -->
        <div class="ambiance-timer-display">
          <div class="ambiance-time">{{ store.displayTime }}</div>
          <div class="ambiance-timer-controls">
            <button 
              class="ambiance-control-btn"
              @click="store.toggleTimer()"
            >
              <svg v-if="!store.isRunning" width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
              </svg>
              <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none">
                <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
              </svg>
            </button>
            <button 
              class="ambiance-control-btn"
              @click="store.resetTimer()"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M3 12A9 9 0 1 0 9 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 6L9 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Top-Right Settings Button -->
      <div class="settings-button">
        <button 
          class="corner-btn settings-btn"
          @click="store.toggleSidebar()"
          title="Paramètres"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            <path d="M19.4 15A1.65 1.65 0 0 0 18.82 13.37L20.25 12L18.82 10.63A1.65 1.65 0 0 0 19.4 9L19.78 7.5A1.65 1.65 0 0 0 18.41 5.59L16.91 5.97A1.65 1.65 0 0 0 15.28 5.19L14.65 3.69A1.65 1.65 0 0 0 12.99 2.64H11.01A1.65 1.65 0 0 0 9.35 3.69L8.72 5.19A1.65 1.65 0 0 0 7.09 5.97L5.59 5.59A1.65 1.65 0 0 0 4.22 7.5L4.6 9A1.65 1.65 0 0 0 5.18 10.63L3.75 12L5.18 13.37A1.65 1.65 0 0 0 4.6 15L4.22 16.5A1.65 1.65 0 0 0 5.59 18.41L7.09 18.03A1.65 1.65 0 0 0 8.72 18.81L9.35 20.31A1.65 1.65 0 0 0 11.01 21.36H12.99A1.65 1.65 0 0 0 14.65 20.31L15.28 18.81A1.65 1.65 0 0 0 16.91 18.03L18.41 18.41A1.65 1.65 0 0 0 19.78 16.5L19.4 15Z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>

      <!-- Bottom Center Theme Switcher -->
      <div class="theme-switcher">
        <div class="theme-switcher-container">
          <button 
            class="theme-btn"
            :class="{ active: store.timerDisplayMode === 'home' }"
            @click="store.setTimerDisplayMode('home')"
            title="Home"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 22V12H15V22" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button 
            class="theme-btn"
            :class="{ active: store.timerDisplayMode === 'focus' }"
            @click="store.setTimerDisplayMode('focus')"
            title="Focus"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 18V5"></path>
              <path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"></path>
              <path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"></path>
              <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"></path>
              <path d="M18 18a4 4 0 0 0 2-7.464"></path>
              <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"></path>
              <path d="M6 18a4 4 0 0 1-2-7.464"></path>
              <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"></path>
            </svg>
          </button>
          <button 
            class="theme-btn"
            :class="{ active: store.timerDisplayMode === 'ambiance' }"
            @click="store.setTimerDisplayMode('ambiance')"
            title="Ambiance"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1"></path>
              <circle cx="12" cy="8" r="2"></circle>
              <path d="M12 10v12"></path>
              <path d="M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z"></path>
              <path d="M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Bottom-Right Fullscreen Button -->
      <div class="fullscreen-button">
        <button 
          class="corner-btn fullscreen-btn"
          @click="store.toggleFullscreen()"
          title="Plein écran"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V8M21 8V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H16M16 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V16M3 16V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Expanded Todo Panel -->
    <Transition name="slide-right">
      <div v-if="unifiedLeftExpanded" class="expanded-todo-panel">
        <div class="todo-panel-header">
          <h3>Gestion des Tâches</h3>
          <button @click="toggleUnifiedLeft" class="close-panel-btn">×</button>
        </div>
        
        <!-- Add Task Form -->
        <div class="add-task-form">
          <input 
            v-model="newTaskText"
            @keyup.enter="addNewTask"
            type="text" 
            placeholder="Nouvelle tâche..." 
            class="task-input"
          />
          <div class="task-options">
            <div class="eisenhower-matrix">
              <label class="checkbox-label">
                <input v-model="newTaskUrgent" type="checkbox" />
                <span>Urgent</span>
              </label>
              <label class="checkbox-label">
                <input v-model="newTaskImportant" type="checkbox" />
                <span>Important</span>
              </label>
            </div>
            <select v-model="newTaskEstimatedTime" class="time-select">
              <option value="15">15min</option>
              <option value="25">25min</option>
              <option value="30">30min</option>
              <option value="45">45min</option>
              <option value="60">1h</option>
            </select>
          </div>
          <button @click="addNewTask" class="add-task-btn">Ajouter</button>
        </div>

        <!-- Task List -->
        <div class="todo-list">
          <div 
            v-for="task in incompleteTasks"
            :key="task.id"
            class="task-item"
            :class="getTaskPriorityClass(task)"
          >
            <button @click="store.toggleTodo(task.id)" class="task-check">
              <svg v-if="task.completed" width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            
            <div class="task-info">
              <span class="task-text">{{ task.text }}</span>
              <div class="task-meta">
                <span class="task-time">{{ task.estimatedTime }}min</span>
                <div class="task-flags">
                  <span v-if="task.urgent" class="flag urgent">U</span>
                  <span v-if="task.important" class="flag important">I</span>
                </div>
              </div>
            </div>
            
            <button @click="store.deleteTodo(task.id)" class="task-delete">×</button>
          </div>
          
          <div v-if="incompleteTasks.length === 0" class="no-tasks">
            Aucune tâche en cours
          </div>
        </div>
      </div>
    </Transition>

    <!-- YouTube Widget -->
    <div v-if="showYouTubeWidget" class="youtube-widget-overlay">
      <div class="youtube-widget-container">
        <YouTubeWidget @close="showYouTubeWidget = false" />
      </div>
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
import { ref, computed, onMounted, onUnmounted, watch, nextTick, h } from 'vue'
import { useAppStore } from './stores/appStore'
import DynamicBackground from './components/DynamicBackground.vue'
import SidePanel from './components/SidePanel.vue'
import YouTubeWidget from './components/YouTubeWidget.vue'

const store = useAppStore()

// Timer modes data
const modes = [
  { key: 'pomodoro', label: 'Pomodoro' },
  { key: 'shortBreak', label: 'Short Break' },
  { key: 'longBreak', label: 'Long Break' }
]

// Sidebar resize functionality
const sidebarWidth = ref(400)
const isResizing = ref(false)

// Current time for home mode
const currentTimeString = ref('')

// State management for all modes
const unifiedLeftExpanded = ref(false)
const showTodoPreview = ref(false)
const showMusicPreview = ref(false)
const showSoundPreview = ref(false)
const showYouTubeWidget = ref(false)
let previewTimeouts = {}

const currentTime = computed(() => currentTimeString.value)

// New task form data
const newTaskText = ref('')
const newTaskUrgent = ref(false)
const newTaskImportant = ref(false)
const newTaskEstimatedTime = ref(25)

// Computed properties for tasks
const incompleteTasks = computed(() => {
  return store.todos.filter(task => !task.completed)
})

const previewTasks = computed(() => {
  return incompleteTasks.value.slice(0, 3)
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

// Todo management functions
function addNewTask() {
  if (newTaskText.value.trim()) {
    store.addTodo({
      text: newTaskText.value.trim(),
      urgent: newTaskUrgent.value,
      important: newTaskImportant.value,
      estimatedTime: newTaskEstimatedTime.value
    })
    
    // Reset form
    newTaskText.value = ''
    newTaskUrgent.value = false
    newTaskImportant.value = false
    newTaskEstimatedTime.value = 25
  }
}

function getTaskPriorityClass(task) {
  if (task.urgent && task.important) return 'priority-urgent-important'
  if (!task.urgent && task.important) return 'priority-important'
  if (task.urgent && !task.important) return 'priority-urgent'
  return 'priority-low'
}

// Unified sidebar functions
function toggleUnifiedLeft() {
  unifiedLeftExpanded.value = !unifiedLeftExpanded.value
}

// Preview handlers
function showTodoPreviewHandler() {
  clearTimeout(previewTimeouts.todo)
  showTodoPreview.value = true
}

function hideTodoPreview() {
  previewTimeouts.todo = setTimeout(() => {
    showTodoPreview.value = false
  }, 300)
}

function showMusicPreviewHandler() {
  clearTimeout(previewTimeouts.music)
  showMusicPreview.value = true
}

function hideMusicPreview() {
  previewTimeouts.music = setTimeout(() => {
    showMusicPreview.value = false
  }, 300)
}

function showSoundPreviewHandler() {
  clearTimeout(previewTimeouts.sound)
  showSoundPreview.value = true
}

function hideSoundPreview() {
  previewTimeouts.sound = setTimeout(() => {
    showSoundPreview.value = false
  }, 300)
}

// Music and sound functions
function toggleMusic() {
  showYouTubeWidget.value = !showYouTubeWidget.value
}

function toggleSound() {
  store.toggleSound()
}

// Resize functions
function startResize(event) {
  isResizing.value = true
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}

function handleResize(event) {
  if (isResizing.value) {
    const newWidth = window.innerWidth - event.clientX
    sidebarWidth.value = Math.max(300, Math.min(600, newWidth))
  }
}

function stopResize() {
  isResizing.value = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}
</script>

<style scoped>
/* Clean layout system following mockup specifications */

.app {
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
}

.main-layout {
  height: 100vh;
  width: 100vw;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* LEFT SIDEBAR - All three modes */
.left-sidebar {
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 100;
}

.sidebar-section {
  position: relative;
}

.sidebar-btn {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  position: relative;
}

.sidebar-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.task-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4444;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

/* Task Preview Panel (Static) */
.task-preview-panel {
  margin-top: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 15px;
  width: 200px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.preview-panel-header {
  color: white;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 10px;
  text-align: center;
}

.preview-panel-tasks {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preview-panel-task {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
}

.priority-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #666;
}

.priority-urgent-important .priority-dot {
  background: #ff4444;
}

.priority-important .priority-dot {
  background: #ffaa00;
}

.priority-urgent .priority-dot {
  background: #ff8800;
}

.task-text {
  color: white;
  font-size: 12px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.no-tasks {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  text-align: center;
}

/* CENTRAL CONTENT AREA */
.central-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* HOME MODE - Digital Clock */
.home-clock-container {
  text-align: center;
}

.digital-clock {
  font-size: 96px;
  font-weight: 900;
  color: white;
  text-shadow: 2px 2px 20px rgba(0, 0, 0, 0.5);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 40px 60px;
}

/* FOCUS MODE - Pomodoro Timer */
.focus-timer-container {
  text-align: center;
}

.timer-mode-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  justify-content: center;
}

.timer-mode-tab {
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.timer-mode-tab.active {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.timer-display {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 40px;
}

.timer-time {
  font-size: 96px;
  font-weight: 900;
  color: white;
  text-shadow: 2px 2px 20px rgba(0, 0, 0, 0.5);
  margin-bottom: 30px;
}

.timer-controls {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.timer-control-btn {
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.timer-control-btn.primary {
  background: #00aa44;
  color: white;
  border-color: #00aa44;
}

.timer-control-btn.primary:hover {
  background: #008833;
}

.timer-control-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

.timer-control-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* AMBIANCE MODE - Compact Timer (Top-Right) */
.ambiance-timer {
  position: fixed;
  top: 20px;
  right: 80px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 20px;
  z-index: 50;
}

.ambiance-mode-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
  justify-content: center;
}

.ambiance-mode-tab {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
}

.ambiance-mode-tab.active {
  background: rgba(255, 255, 255, 0.3);
}

.ambiance-timer-display {
  text-align: center;
}

.ambiance-time {
  font-size: 28px;
  font-weight: bold;
  color: white;
  margin-bottom: 10px;
}

.ambiance-timer-controls {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.ambiance-control-btn {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.ambiance-control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* CORNER BUTTONS */
.settings-button {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
}

.fullscreen-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
}

.corner-btn {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.corner-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

/* THEME SWITCHER - Bottom Center */
.theme-switcher {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

.theme-switcher-container {
  display: flex;
  gap: 15px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  padding: 15px 25px;
  border-radius: 50px;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.theme-btn {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-btn:hover,
.theme-btn.active {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* EXPANDED TODO PANEL */
.expanded-todo-panel {
  position: fixed;
  left: 0;
  top: 0;
  width: 400px;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(15px);
  border-right: 2px solid rgba(255, 255, 255, 0.2);
  z-index: 200;
  padding: 30px;
  overflow-y: auto;
}

.todo-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.todo-panel-header h3 {
  color: white;
  font-size: 24px;
  margin: 0;
}

.close-panel-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-task-form {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
}

.task-input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
  margin-bottom: 15px;
}

.task-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.task-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.eisenhower-matrix {
  display: flex;
  gap: 15px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  cursor: pointer;
}

.time-select {
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.add-task-btn {
  width: 100%;
  padding: 12px;
  background: #00aa44;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.add-task-btn:hover {
  background: #008833;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px;
  border: 2px solid transparent;
}

.task-item.priority-urgent-important {
  border-color: #ff4444;
}

.task-item.priority-important {
  border-color: #ffaa00;
}

.task-item.priority-urgent {
  border-color: #ff8800;
}

.task-check {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 4px;
  background: transparent;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-info {
  flex: 1;
}

.task-text {
  color: white;
  font-size: 16px;
  display: block;
  margin-bottom: 5px;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-time {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.task-flags {
  display: flex;
  gap: 5px;
}

.flag {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.flag.urgent {
  background: #ff8800;
}

.flag.important {
  background: #ffaa00;
}

.task-delete {
  background: none;
  border: none;
  color: #ff4444;
  font-size: 18px;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* YOUTUBE WIDGET */
.youtube-widget-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.youtube-widget-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 15px;
  padding: 30px;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

/* TRANSITIONS */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-right-enter-from {
  transform: translateX(-100%);
}

.slide-right-leave-to {
  transform: translateX(-100%);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* PREVIEW TOOLTIPS */
.task-preview,
.music-preview,
.sound-preview {
  position: absolute;
  left: 80px;
  top: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 15px;
  width: 200px;
  z-index: 150;
}

.preview-header {
  color: white;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
}

.preview-tasks {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preview-task {
  display: flex;
  align-items: center;
  gap: 8px;
}

.current-music,
.current-sound {
  color: white;
}

.music-title,
.sound-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.music-status,
.sound-status {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.no-music,
.no-sound {
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .left-sidebar {
    left: 10px;
    gap: 15px;
  }
  
  .sidebar-btn {
    width: 50px;
    height: 50px;
  }
  
  .task-preview-panel {
    width: 180px;
    padding: 12px;
  }
  
  .digital-clock {
    font-size: 60px;
    padding: 30px 40px;
  }
  
  .timer-time {
    font-size: 60px;
  }
  
  .ambiance-timer {
    right: 60px;
    padding: 15px;
  }
  
  .expanded-todo-panel {
    width: 100vw;
    padding: 20px;
  }
  
  .theme-switcher-container {
    padding: 12px 20px;
    gap: 12px;
  }
  
  .theme-btn {
    width: 40px;
    height: 40px;
  }
}
</style>