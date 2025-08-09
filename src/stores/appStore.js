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
const activeTab = ref('themes') // themes, clock, timer, stats, music, notepad, sounds, quotes, background, todo
const isFullscreen = ref(false) // Fullscreen mode state

// Theme & styling
const currentTheme = ref('toto-forest') // home, ambiance, focus, toto-forest, etc.
const backgroundType = ref('canvas') // gradient, image, video, canvas, color, youtube, animated-gradient
const backgroundValue = ref('lava-lamp') // valeur par défaut selon le backgroundType
const overlayOpacity = ref(0.2) // compromis entre 0.1 et 0.3

// Custom gradient colors (utilisé pour les backgrounds personnalisés)
const customGradientColors = ref(['#DF437A', '#3d57d6', '#a117fd', '#ec634b'])

// Authentic Flocus themes with official assets + custom, canvas/animated themes, and color palettes
const themes = ref({
  // Gradients & Couleurs
  'aura-twilight': {
    name: 'Aura Twilight',
    type: 'image',
    value: 'https://app.flocus.com/resources/images/themes/fc5d2c05dba5c17ea3fa.jpg',
    preview: 'https://app.flocus.com/resources/images/themes/58caf7f5c0a933ebfcf7.jpg'
  },
  // ... (tous les autres thèmes de la version ai_main_f671d7f41848, à conserver)
  // Exemple avec les mondes ambiants, canvas, animated, custom, etc.
  'lava-lamp': {
    name: 'Lava Lamp',
    type: 'canvas',
    value: 'lava-lamp',
    colors: ['#DF437A', '#3d57d6', '#a117fd', '#ec634b'],
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojREY0MzdBIiAvPjxzdG9wIG9mZnNldD0iMzMlIiBzdHlsZT0ic3RvcC1jb2xvcjojM2Q1N2Q2IiAvPjxzdG9wIG9mZnNldD0iNjYlIiBzdHlsZT0ic3RvcC1jb2xvcjojYTExN2ZkIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2VjNjM0YiIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0idXJsKCNncmFkKSIgcng9IjgiLz48L3N2Zz4='
  },
  'custom-animated-gradient': {
    name: 'Custom Animated Gradient',
    type: 'animated-gradient',
    value: 'custom',
    colors: ['#DF437A', '#3d57d6', '#a117fd', '#ec634b'],
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhbmltYXRlZCIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojREY0MzdBIiAvPjxzdG9wIG9mZnNldD0iMzMlIiBzdHlsZT0ic3RvcC1jb2xvcjojM2Q1N2Q2IiAvPjxzdG9wIG9mZnNldD0iNjYlIiBzdHlsZT0ic3RvcC1jb2xvcjojYTExN2ZkIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2VjNjM0YiIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0idXJsKCNhbmltYXRlZCkiIHJ4PSI4Ii8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iNjAiIHI9IjMiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjgiPjxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIHZhbHVlcz0iMC44OzAuMzswLjgiIGR1cj0iMnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+PC9jaXJjbGU+PC9zdmc+'
  },

  // === NEW THEMES FROM ASSETS ===
  // Pour ajouter de nouveaux thèmes :
  // 1. Ajoutez les fichiers image/vidéo dans public/assets/themes/images/ ou public/assets/themes/videos/
  // 2. Créez un objet thème ici avec : name, type ('image'/'video'), value (chemin du fichier), preview, category
  // 3. Ajoutez la clé du thème dans l'array approprié dans ThemeSettings.vue (ambientThemes ou animatedThemes)
  
  // Image themes for Ambient Worlds category
  '3d-cartoon-door': {
    name: '3D Cartoon Door',
    type: 'image',
    value: '/assets/themes/images/3d-rendering-cartoon-welcome-door.jpg',
    preview: '/assets/themes/images/3d-rendering-cartoon-welcome-door.jpg',
    category: 'ambient'
  },
  'digital-river-landscape': {
    name: 'Digital River Landscape',
    type: 'image', 
    value: '/assets/themes/images/digital-art-style-river-nature-landscape.jpg',
    preview: '/assets/themes/images/digital-art-style-river-nature-landscape.jpg',
    category: 'ambient'
  },
  'mysterious-forest-cat': {
    name: 'Mysterious Forest Cat',
    type: 'image',
    value: '/assets/themes/images/mysterious-cat-sunny-forest.jpg', 
    preview: '/assets/themes/images/mysterious-cat-sunny-forest.jpg',
    category: 'ambient'
  },

  // Video themes for Animated category
  'castle-beyond-clouds': {
    name: 'Castle Beyond Clouds',
    type: 'video',
    value: '/assets/themes/videos/castle-beyond-the-clouds.1920x1080.mp4',
    preview: '/assets/themes/videos/castle-beyond-the-clouds.1920x1080.mp4', // Will use first frame
    category: 'animated'
  },
  'spirited-away-chihiro': {
    name: 'Spirited Away - Chihiro',
    type: 'video',
    value: '/assets/themes/videos/chihiro-ogino-spirited-away.1920x1080.mp4',
    preview: '/assets/themes/videos/chihiro-ogino-spirited-away.1920x1080.mp4',
    category: 'animated'
  },
  'coffee-shop-ambience': {
    name: 'Coffee Shop Ambience',
    type: 'video',
    value: '/assets/themes/videos/coffee-shop.1920x1080.mp4',
    preview: '/assets/themes/videos/coffee-shop.1920x1080.mp4',
    category: 'animated'
  },
  'cozy-room': {
    name: 'Cozy Room',
    type: 'video',
    value: '/assets/themes/videos/cozy-room.1920x1080.mp4',
    preview: '/assets/themes/videos/cozy-room.1920x1080.mp4',
    category: 'animated'
  },
  'spirited-away-island': {
    name: 'Spirited Away - Island House',
    type: 'video',
    value: '/assets/themes/videos/house-on-island-spirited-away.1920x1080.mp4',
    preview: '/assets/themes/videos/house-on-island-spirited-away.1920x1080.mp4',
    category: 'animated'
  },
  'lofi-coffee-shop': {
    name: 'Lofi Coffee Shop',
    type: 'video',
    value: '/assets/themes/videos/lofi-coffee-shop.1920x1080.mp4',
    preview: '/assets/themes/videos/lofi-coffee-shop.1920x1080.mp4',
    category: 'animated'
  },
  'lofi-girl-animated': {
    name: 'Lofi Girl Animated',
    type: 'video',
    value: '/assets/themes/videos/lofi-girl-animated.1920x1080.mp4',
    preview: '/assets/themes/videos/lofi-girl-animated.1920x1080.mp4',
    category: 'animated'
  },
  'morning-coffee': {
    name: 'Morning Coffee',
    type: 'video',
    value: '/assets/themes/videos/morning-coffee.1920x1080.mp4',
    preview: '/assets/themes/videos/morning-coffee.1920x1080.mp4',
    category: 'animated'
  },
  'forest-house': {
    name: 'Small House in Forest',
    type: 'video',
    value: '/assets/themes/videos/small-house-in-forest.1920x1080.mp4',
    preview: '/assets/themes/videos/small-house-in-forest.1920x1080.mp4',
    category: 'animated'
  },
  'spirited-away-train': {
    name: 'Spirited Away - Train Travel',
    type: 'video',
    value: '/assets/themes/videos/spirited-away-train-travel.1920x1080.mp4',
    preview: '/assets/themes/videos/spirited-away-train-travel.1920x1080.mp4',
    category: 'animated'
  },
  'train-spirited-away': {
    name: 'Train - Spirited Away',
    type: 'video',
    value: '/assets/themes/videos/train-spirited-away.1920x1080.mp4',
    preview: '/assets/themes/videos/train-spirited-away.1920x1080.mp4',
    category: 'animated'
  },
  'zelda-forest-temple': {
    name: 'Zelda Forest Temple',
    type: 'video',
    value: '/assets/themes/videos/zelda-forest-temple.1920x1080.mp4',
    preview: '/assets/themes/videos/zelda-forest-temple.1920x1080.mp4',
    category: 'animated'
  },
  // === END NEW THEMES ===

  // Palette themes
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

  function extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
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

  function setYouTubeBackground(youtubeUrl) {
    const videoId = extractYouTubeId(youtubeUrl)
    if (videoId) {
      backgroundType.value = 'youtube'
      backgroundValue.value = videoId
      return true
    }
    return false
  }

  function setCustomGradientColors(colors) {
    customGradientColors.value = [...colors]
    // Update CSS variables for the animated gradient
    colors.forEach((color, index) => {
      document.documentElement.style.setProperty(`--custom-gradient-color-${index + 1}`, color)
    })
  }

  function setAnimatedGradientBackground() {
    backgroundType.value = 'animated-gradient'
    backgroundValue.value = 'custom'
    setCustomGradientColors(customGradientColors.value)
  }
  
  function addTodo(todo) {
    todos.value.push({
      id: Date.now(),
      ...todo,
      completed: false,
      created: new Date(),
      subtasks: [],
      // Ensure backward compatibility
      estimatedPomodoros: todo.estimatedPomodoros || Math.ceil((todo.estimatedMinutes || 30) / 25),
      // New fields with defaults
      estimatedMinutes: todo.estimatedMinutes || 30,
      type: todo.type || 'work'
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
    themes,
    customGradientColors,
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
    setTheme,
    setYouTubeBackground,
    extractYouTubeId,
    setCustomGradientColors,
    setAnimatedGradientBackground,
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
