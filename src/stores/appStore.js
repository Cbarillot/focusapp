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
  const activeTab = ref('timer') // timer, themes, music, background, todo
  
  // Theme & styling
  const currentTheme = ref('home') // home, ambiance, focus
  const backgroundType = ref('gradient') // gradient, image, video, color
  const backgroundValue = ref('linear-gradient(135deg, #667eea 0%, #764ba2 100%)')
  const overlayOpacity = ref(0.3)
  
  // Theme definitions
  const themes = ref({
    home: {
      name: 'Home',
      colors: {
        primary: '#8B5CF6',
        primaryDark: '#7C3AED', 
        secondary: '#A78BFA',
        accent: '#DDD6FE'
      },
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    ambiance: {
      name: 'Ambiance',
      colors: {
        primary: '#10B981',
        primaryDark: '#059669',
        secondary: '#34D399', 
        accent: '#D1FAE5'
      },
      background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)'
    },
    focus: {
      name: 'Focus',
      colors: {
        primary: '#F97316',
        primaryDark: '#EA580C',
        secondary: '#FB923C',
        accent: '#FED7AA'
      },
      background: 'linear-gradient(135deg, #c2410c 0%, #9a3412 100%)'
    }
  })
  
  // Music state
  const musicPlaying = ref(false)
  const currentTrack = ref(null)
  const currentPlatform = ref('youtube') // youtube, spotify, deezer, soundcloud
  const volume = ref(0.7)
  const isFullscreen = ref(false)
  const soundscapes = ref({
    rain: { enabled: false, volume: 0.5 },
    forest: { enabled: false, volume: 0.5 },
    cafe: { enabled: false, volume: 0.5 },
    ocean: { enabled: false, volume: 0.5 }
  })
  
  // Music platform links
  const musicLinks = ref({
    spotify: '',
    deezer: '', 
    youtube: '',
    soundcloud: ''
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
  
  function setTheme(theme) {
    currentTheme.value = theme
    const themeConfig = themes.value[theme]
    if (themeConfig) {
      // Update CSS custom properties
      document.documentElement.style.setProperty('--color-primary', themeConfig.colors.primary)
      document.documentElement.style.setProperty('--color-primary-dark', themeConfig.colors.primaryDark)
      document.documentElement.style.setProperty('--color-secondary', themeConfig.colors.secondary)
      document.documentElement.style.setProperty('--color-accent', themeConfig.colors.accent)
      // Update background
      setBackground('gradient', themeConfig.background)
    }
  }
  
  function toggleFullscreen() {
    isFullscreen.value = !isFullscreen.value
    if (isFullscreen.value) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
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
    themes,
    backgroundType,
    backgroundValue,
    overlayOpacity,
    musicPlaying,
    currentTrack,
    currentPlatform,
    volume,
    isFullscreen,
    soundscapes,
    musicLinks,
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
    setTheme,
    setBackground,
    toggleFullscreen,
    addTodo,
    toggleTodo,
    deleteTodo
  }
})