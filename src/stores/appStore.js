import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // Timer state
  const timerMode = ref('pomodoro') // pomodoro, shortBreak, longBreak
  const timeRemaining = ref(25 * 60) // in seconds
  const isRunning = ref(false)
  const cycle = ref(0)
  let timerInterval = null
  
  // Timer settings
  const pomodoroTime = ref(25 * 60)
  const shortBreakTime = ref(5 * 60)
  const longBreakTime = ref(15 * 60)
  
  // UI state
  const sidebarOpen = ref(false)
  const activeTab = ref('themes') // themes, clock, timer, stats, music, notepad, sounds, quotes
  
  // Theme & styling
  const currentTheme = ref('lava-lamp')
  const backgroundType = ref('canvas') // gradient, image, video, canvas, color
  const backgroundValue = ref('lava-lamp')
  const overlayOpacity = ref(0.1)

  // Theme definitions with Flocus-style assets
  const themes = ref({
    'lava-lamp': {
      name: 'Lava Lamp',
      type: 'canvas',
      value: 'lava-lamp',
      colors: ['#DF437A', '#3d57d6', '#a117fd', '#ec634b'],
      preview: '/themes/lava-lamp-preview.jpg'
    },
    'toto-forest': {
      name: 'Toto Forest',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop',
      preview: '/themes/toto-forest-preview.jpg'
    },
    'cyberpunk-city': {
      name: 'Cyberpunk City',
      type: 'video',
      value: 'https://player.vimeo.com/external/373465046.hd.mp4?s=ac9a1a4a47d98c2065e6a91c3b6b19d5b5e0d7a1&profile_id=174',
      preview: '/themes/cyberpunk-preview.jpg'
    },
    'mountain-lake': {
      name: 'Mountain Lake',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2069&auto=format&fit=crop',
      preview: '/themes/mountain-lake-preview.jpg'
    },
    'ocean-waves': {
      name: 'Ocean Waves',
      type: 'video',
      value: 'https://player.vimeo.com/external/227468707.hd.mp4?s=39c64a4db9ce62f9eea3e754d8f4a8e8f1f5d2a1&profile_id=174',
      preview: '/themes/ocean-waves-preview.jpg'
    },
    'aurora-gradient': {
      name: 'Aurora',
      type: 'canvas',
      value: 'aurora',
      colors: ['#00c9ff', '#92fe9d', '#ff9a9e', '#fecfef'],
      preview: '/themes/aurora-preview.jpg'
    },
    'sunset-gradient': {
      name: 'Sunset',
      type: 'gradient',
      value: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
      preview: '/themes/sunset-preview.jpg'
    }
  })
  
  // Music state
  const musicPlaying = ref(false)
  const currentTrack = ref(null)
  const volume = ref(0.7)
  const soundscapes = ref({
    rain: { enabled: false, volume: 0.5 },
    forest: { enabled: false, volume: 0.5 },
    cafe: { enabled: false, volume: 0.5 },
    ocean: { enabled: false, volume: 0.5 }
  })
  
  // Todo state
  const todos = ref([])
  const todoFilter = ref('all') // all, active, completed
  const todoSort = ref('created') // created, priority, due, alphabetical
  
  // Computed
  const displayTime = computed(() => {
    const minutes = Math.floor(timeRemaining.value / 60)
    const seconds = timeRemaining.value % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })
  
  const currentModeTime = computed(() => {
    switch (timerMode.value) {
      case 'pomodoro': return pomodoroTime.value
      case 'shortBreak': return shortBreakTime.value
      case 'longBreak': return longBreakTime.value
      default: return pomodoroTime.value
    }
  })
  
  // Timer functions
  function tick() {
    if (timeRemaining.value > 0) {
      timeRemaining.value--
    } else {
      // Timer finished
      isRunning.value = false
      if (timerInterval) {
        clearInterval(timerInterval)
        timerInterval = null
      }
      
      // Auto-switch to next mode (simplified logic)
      if (timerMode.value === 'pomodoro') {
        cycle.value++
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

  function setTheme(themeKey) {
    const theme = themes.value[themeKey]
    if (theme) {
      currentTheme.value = themeKey
      backgroundType.value = theme.type
      backgroundValue.value = theme.value

      // Set CSS variables for canvas themes
      if (theme.colors) {
        theme.colors.forEach((color, index) => {
          document.documentElement.style.setProperty(`--gradient-color-${index + 1}`, color)
        })
      }
    }
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
    themes,
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
    setTheme,
    addTodo,
    toggleTodo,
    deleteTodo
  }
})
