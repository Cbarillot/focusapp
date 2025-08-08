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
  const isFullscreen = ref(false) // Fullscreen mode state
  
  // Theme & styling - Three integrated themes: home, ambiance, focus
  const currentTheme = ref('home') // home, ambiance, focus
  const backgroundType = ref('gradient') // gradient, image, video, color
  const backgroundValue = ref('linear-gradient(135deg, #667eea 0%, #764ba2 100%)')
  const overlayOpacity = ref(0.3)
  
  // Theme definitions with color palettes
  const themes = ref({
    home: {
      name: 'Home',
      colors: {
        primary: '#8B5CF6',
        primaryDark: '#7C3AED',
        secondary: '#A78BFA',
        accent: '#EC4899',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }
    },
    ambiance: {
      name: 'Ambiance',
      colors: {
        primary: '#10B981',
        primaryDark: '#059669',
        secondary: '#6EE7B7',
        accent: '#34D399',
        background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)'
      }
    },
    focus: {
      name: 'Focus',
      colors: {
        primary: '#F59E0B',
        primaryDark: '#D97706',
        secondary: '#FCD34D',
        accent: '#FBBF24',
        background: 'linear-gradient(135deg, #92400e 0%, #b45309 100%)'
      }
    }
  })
  
  // Music state - Universal music component with URL support
  const musicPlaying = ref(false)
  const currentTrack = ref(null)
  const volume = ref(0.7)
  const musicUrl = ref('') // Support for Spotify, Deezer, YouTube, SoundCloud URLs
  const musicPlatform = ref('') // spotify, deezer, youtube, soundcloud
  const musicError = ref('')
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

  // Get current theme colors
  const currentThemeColors = computed(() => {
    return themes.value[currentTheme.value]?.colors || themes.value.home.colors
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

  // Theme management functions
  function switchTheme(themeName) {
    if (themes.value[themeName]) {
      currentTheme.value = themeName
      // Apply theme colors to CSS variables
      applyThemeColors()
      // Store theme preference (could be localStorage in future)
    }
  }

  function applyThemeColors() {
    const colors = currentThemeColors.value
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      root.style.setProperty('--color-primary', colors.primary)
      root.style.setProperty('--color-primary-dark', colors.primaryDark)
      root.style.setProperty('--color-secondary', colors.secondary)
      root.style.setProperty('--color-accent', colors.accent)
      // Update background if it's a gradient theme
      if (colors.background) {
        backgroundValue.value = colors.background
      }
    }
  }

  // Music URL handling functions
  function setMusicUrl(url) {
    musicUrl.value = url
    musicError.value = ''
    musicPlatform.value = detectMusicPlatform(url)
  }

  function detectMusicPlatform(url) {
    if (url.includes('spotify.com')) return 'spotify'
    if (url.includes('deezer.com')) return 'deezer'
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
    if (url.includes('soundcloud.com')) return 'soundcloud'
    return ''
  }

  // Fullscreen management
  function toggleFullscreen() {
    if (typeof document !== 'undefined') {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
          isFullscreen.value = true
        }).catch(() => {
          console.warn('Fullscreen not supported or denied')
        })
      } else {
        document.exitFullscreen().then(() => {
          isFullscreen.value = false
        })
      }
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
    isFullscreen,
    currentTheme,
    themes,
    backgroundType,
    backgroundValue,
    overlayOpacity,
    musicPlaying,
    currentTrack,
    volume,
    musicUrl,
    musicPlatform,
    musicError,
    soundscapes,
    todos,
    todoFilter,
    todoSort,
    
    // Computed
    displayTime,
    currentModeTime,
    currentThemeColors,
    
    // Actions
    toggleTimer,
    resetTimer,
    switchMode,
    toggleSidebar,
    setActiveTab,
    setBackground,
    addTodo,
    toggleTodo,
    deleteTodo,
    switchTheme,
    applyThemeColors,
    setMusicUrl,
    detectMusicPlatform,
    toggleFullscreen
  }
})