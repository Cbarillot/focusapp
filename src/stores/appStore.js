/**
 * App Store - Centralized State Management
 * 
 * This store manages the entire application state using Pinia.
 * It handles timer functionality, UI state, theming, music, and todo management.
 * 
 * Key Features:
 * - Pomodoro timer with auto-cycling between work and break sessions
 * - Theme and background customization
 * - Music and soundscape integration
 * - Task management with priorities and pomodoro estimates
 * - Persistent UI state (sidebar, active tabs)
 * 
 * Architecture:
 * - Uses Vue 3 Composition API with reactive references
 * - Computed properties for derived state (displayTime, currentModeTime)
 * - Actions for state mutations and side effects
 * - Timer uses JavaScript intervals for countdown functionality
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // ==========================================
  // TIMER STATE & CONFIGURATION
  // ==========================================
  
  // Current timer mode: 'pomodoro' (25min), 'shortBreak' (5min), 'longBreak' (15min)
  const timerMode = ref('pomodoro')
  
  // Time remaining in seconds for current session
  const timeRemaining = ref(25 * 60)
  
  // Whether timer is currently running
  const isRunning = ref(false)
  
  // Number of completed pomodoro cycles (used for long break timing)
  const cycle = ref(0)
  
  // Internal timer interval reference
  let timerInterval = null
  
  // Timer duration settings (in seconds)
  const pomodoroTime = ref(25 * 60)     // 25 minutes work session
  const shortBreakTime = ref(5 * 60)    // 5 minute break
  const longBreakTime = ref(15 * 60)    // 15 minute long break
  
  // ==========================================
  // UI STATE MANAGEMENT
  // ==========================================
  
  // Controls sidebar visibility
  const sidebarOpen = ref(false)
  
  // Active tab in sidebar: 'timer', 'themes', 'music', 'background', 'todo'
  const activeTab = ref('timer')
  
  // ==========================================
  // THEME & VISUAL CUSTOMIZATION
  // ==========================================
  
  // Current color theme identifier
  const currentTheme = ref('purple')
  
  // Background type: 'gradient', 'image', 'video', 'color'
  const backgroundType = ref('gradient')
  
  // Background content (CSS gradient, image URL, video URL, or color value)
  const backgroundValue = ref('linear-gradient(135deg, #667eea 0%, #764ba2 100%)')
  
  // Overlay opacity for background content (0-1)
  const overlayOpacity = ref(0.3)
  
  // ==========================================
  // MUSIC & AUDIO STATE
  // ==========================================
  
  // Whether music is currently playing
  const musicPlaying = ref(false)
  
  // Current track information (URL, name, or object)
  const currentTrack = ref(null)
  
  // Master volume level (0-1)
  const volume = ref(0.7)
  
  // Ambient soundscape settings
  const soundscapes = ref({
    rain: { enabled: false, volume: 0.5 },
    forest: { enabled: false, volume: 0.5 },
    cafe: { enabled: false, volume: 0.5 },
    ocean: { enabled: false, volume: 0.5 }
  })
  
  // ==========================================
  // TASK MANAGEMENT STATE
  // ==========================================
  
  // Array of todo items with full task information
  const todos = ref([])
  
  // Filter for task list: 'all', 'active', 'completed'
  const todoFilter = ref('all')
  
  // Sort order: 'created', 'priority', 'due', 'alphabetical'
  const todoSort = ref('created')
  
  // ==========================================
  // COMPUTED PROPERTIES
  // ==========================================
  
  /**
   * Format time remaining as MM:SS string for display
   * @returns {string} Formatted time string (e.g., "25:00")
   */
  const displayTime = computed(() => {
    const minutes = Math.floor(timeRemaining.value / 60)
    const seconds = timeRemaining.value % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })
  
  /**
   * Get the total duration for the current timer mode
   * @returns {number} Duration in seconds
   */
  const currentModeTime = computed(() => {
    switch (timerMode.value) {
      case 'pomodoro': return pomodoroTime.value
      case 'shortBreak': return shortBreakTime.value
      case 'longBreak': return longBreakTime.value
      default: return pomodoroTime.value
    }
  })
  
  // ==========================================
  // TIMER FUNCTIONS
  // ==========================================
  
  /**
   * Timer tick function - decrements time and handles completion
   * Automatically cycles between pomodoro and break modes
   */
  function tick() {
    if (timeRemaining.value > 0) {
      timeRemaining.value--
    } else {
      // Timer completed - handle mode switching
      isRunning.value = false
      if (timerInterval) {
        clearInterval(timerInterval)
        timerInterval = null
      }
      
      // Auto-cycle logic: pomodoro → break, break → pomodoro
      if (timerMode.value === 'pomodoro') {
        cycle.value++
        // Every 4th cycle triggers a long break
        if (cycle.value % 4 === 0) {
          switchMode('longBreak')
        } else {
          switchMode('shortBreak')
        }
      } else {
        switchMode('pomodoro')
      }
    }
  }
  
  // Actions
  function toggleTimer() {
    isRunning.value = !isRunning.value
    
    if (isRunning.value) {
      timerInterval = setInterval(tick, 1000)
    } else {
      if (timerInterval) {
        clearInterval(timerInterval)
        timerInterval = null
      }
    }
  }
  
  function resetTimer() {
    isRunning.value = false
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
    timeRemaining.value = currentModeTime.value
  }
  
  function switchMode(mode) {
    timerMode.value = mode
    isRunning.value = false
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
    
    switch (mode) {
      case 'pomodoro':
        timeRemaining.value = pomodoroTime.value
        break
      case 'shortBreak':
        timeRemaining.value = shortBreakTime.value
        break
      case 'longBreak':
        timeRemaining.value = longBreakTime.value
        break
    }
  }
  
  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }
  
  function setActiveTab(tab) {
    activeTab.value = tab
    if (!sidebarOpen.value) {
      sidebarOpen.value = true
    }
  }
  
  function setBackground(type, value) {
    backgroundType.value = type
    backgroundValue.value = value
  }
  
  function addTodo(todo) {
    todos.value.push({
      id: Date.now(),
      ...todo,
      completed: false,
      created: new Date(),
      subtasks: []
    })
  }
  
  function toggleTodo(id) {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }
  
  function deleteTodo(id) {
    const index = todos.value.findIndex(t => t.id === id)
    if (index > -1) {
      todos.value.splice(index, 1)
    }
  }
  
  return {
    // State
    timerMode,
    timeRemaining,
    isRunning,
    cycle,
    pomodoroTime,
    shortBreakTime,
    longBreakTime,
    sidebarOpen,
    activeTab,
    currentTheme,
    backgroundType,
    backgroundValue,
    overlayOpacity,
    musicPlaying,
    currentTrack,
    volume,
    soundscapes,
    todos,
    todoFilter,
    todoSort,
    
    // Computed
    displayTime,
    currentModeTime,
    
    // Actions
    toggleTimer,
    resetTimer,
    switchMode,
    toggleSidebar,
    setActiveTab,
    setBackground,
    addTodo,
    toggleTodo,
    deleteTodo
  }
})