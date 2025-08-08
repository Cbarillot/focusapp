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
  const currentTheme = ref('toto-forest')
  const backgroundType = ref('canvas') // gradient, image, video, canvas, color, youtube, animated-gradient
  const backgroundValue = ref('lava-lamp')
  const overlayOpacity = ref(0.1)

  // Custom gradient colors
  const customGradientColors = ref(['#DF437A', '#3d57d6', '#a117fd', '#ec634b'])

  // Authentic Flocus themes with official assets
  const themes = ref({
    // Gradients & Couleurs
    'aura-twilight': {
      name: 'Aura Twilight',
      type: 'image',
      value: 'https://app.flocus.com/resources/images/themes/fc5d2c05dba5c17ea3fa.jpg',
      preview: 'https://app.flocus.com/resources/images/themes/58caf7f5c0a933ebfcf7.jpg'
    },
    'peach-aura-heart': {
      name: 'Peach Aura Heart',
      type: 'image',
      value: 'https://app.flocus.com/resources/images/themes/965c98510eb70fec097e.jpg',
      preview: 'https://app.flocus.com/resources/images/themes/ccb0d385a36dc1178827.jpg'
    },
    'light-pink-heart': {
      name: 'Light Pink Heart',
      type: 'image',
      value: 'https://app.flocus.com/resources/images/themes/00dc574ebb26a022627c.jpg',
      preview: 'https://app.flocus.com/resources/images/themes/b0c91910b984527131f6.jpg'
    },
    'flare': {
      name: 'Flare',
      type: 'image',
      value: 'https://app.flocus.com/resources/images/themes/115716ff2673a42650ae.jpg',
      preview: 'https://app.flocus.com/resources/images/themes/792e25b707a50d2d7551.jpg'
    },
    'minimalist-black': {
      name: 'Minimalist Black',
      type: 'color',
      value: '#000000',
      preview: 'https://app.flocus.com/resources/images/themes/2d727f863f76cb1a139c.jpg'
    },
    'minimalist-white': {
      name: 'Minimalist White',
      type: 'color',
      value: '#ffffff',
      preview: 'https://app.flocus.com/resources/images/themes/5d61d93074b98cd7d14b.jpg'
    },
    'heat-map': {
      name: 'Heat Map',
      type: 'image',
      value: 'https://app.flocus.com/resources/images/themes/ab5ca8f3b3764cc20004.jpg',
      preview: 'https://app.flocus.com/resources/images/themes/cae695fe669d8ba55e7c.jpg'
    },
    'dark-purple-heart': {
      name: 'Dark Purple Heart',
      type: 'image',
      value: 'https://app.flocus.com/resources/images/themes/7c723116a71b050b0b70.jpg',
      preview: 'https://app.flocus.com/resources/images/themes/9ba61149de74b12d8966.jpg'
    },
    'light-purple-heart': {
      name: 'Light Purple Heart',
      type: 'image',
      value: 'https://app.flocus.com/resources/images/themes/2acc7101e9ef5ef4bf80.jpg',
      preview: 'https://app.flocus.com/resources/images/themes/c804c8491b9500138eac.jpg'
    },
    'grainy-gradient': {
      name: 'Grainy Gradient',
      type: 'image',
      value: 'https://app.flocus.com/resources/images/themes/87223eadf66a7c8533bd.jpg',
      preview: 'https://app.flocus.com/resources/images/themes/7f66742ba6d4d10c29b9.jpg'
    },

    // Mondes Ambiants (Images Statiques)
    'countryside-morning': {
      name: 'Countryside Morning',
      type: 'image',
      value: 'https://app.flocus.com/resources/images/themes/3e53804e0136d8ff63b8.jpg',
      preview: 'https://app.flocus.com/resources/images/themes/334ccea6b7512b27afb1.jpg'
    },
    'toto-forest': {
      name: 'Toto Forest',
      type: 'image',
      value: 'https://app.flocus.com/resources/images/themes/036dc091aa98dbd75448.jpg',
      preview: 'https://app.flocus.com/resources/images/themes/08a988943a40a96f3643.jpg'
    },
    'lofi-clouds': {
      name: 'Lofi Clouds',
      type: 'image',
      value: 'https://app.flocus.com/resources/images/themes/2079a04c9d9eacfad9a7.jpg',
      preview: 'https://app.flocus.com/resources/images/themes/7abf9677d15105b172d0.jpg'
    },
    'dusk-peak': {
      name: 'Dusk Peak',
      type: 'image',
      value: 'https://app.flocus.com/resources/images/themes/e94e6e0046be104ab9ac.jpg',
      preview: 'https://app.flocus.com/resources/images/themes/7f3394286f7c042b834f.jpg'
    },
    'tuscan-village': {
      name: 'Tuscan Village',
      type: 'image',
      value: 'https://app.flocus.com/resources/images/themes/62327872335dfebe5ceb.jpg',
      preview: 'https://app.flocus.com/resources/images/themes/46d3613a152ee2e89ba7.jpg'
    },
    'forest-retreat': {
      name: 'Forest Retreat',
      type: 'image',
      value: 'https://app.flocus.com/resources/images/themes/48e0089a1b940d6305bb.jpg',
      preview: 'https://app.flocus.com/resources/images/themes/cddb17ec102f168f890f.jpg'
    },
    'cotton-candy-sky': {
      name: 'Cotton Candy Sky',
      type: 'image',
      value: 'https://app.flocus.com/resources/images/themes/a8978a9cea4b37baa5d6.jpg',
      preview: 'https://app.flocus.com/resources/images/themes/bd7d7112fbdeabc801f9.jpg'
    },
    'countryside-night': {
      name: 'Countryside Night',
      type: 'image',
      value: 'https://app.flocus.com/resources/images/themes/d282ec9c6a6d989d73ce.jpg',
      preview: 'https://app.flocus.com/resources/images/themes/c4d6817730566cdcbbbe.jpg'
    },
    'underwater-reef': {
      name: 'Underwater Reef',
      type: 'image',
      value: 'https://app.flocus.com/resources/images/themes/2cf1a7cb698f4601bd00.jpg',
      preview: 'https://app.flocus.com/resources/images/themes/ca29d2c7897474a7d57a.jpg'
    },

    // Mondes Ambiants (Vidéos)
    'snowy-winter-cabin': {
      name: 'Snowy Winter Cabin',
      type: 'video',
      value: 'https://app.flocus.com/resources/images/themes/39fdded69cd655331f55.mp4',
      preview: 'https://app.flocus.com/resources/images/themes/1b651162dfdd425d13f7.jpg'
    },
    'rainy-lofi-cafe': {
      name: 'Rainy Lofi Cafe',
      type: 'video',
      value: 'https://app.flocus.com/resources/images/themes/f578c6b4e6af48261e67.mp4',
      preview: 'https://app.flocus.com/resources/images/themes/4faea10e2f2c6eb4d8bc.jpg'
    },
    'flickering-fireplace': {
      name: 'Flickering Fireplace',
      type: 'video',
      value: 'https://app.flocus.com/resources/images/themes/5f776353fd8c17bd56ca.mp4',
      preview: 'https://app.flocus.com/resources/images/themes/d992a6ca9a7eee1f8e8e.jpg'
    },

    // Canvas Animations (gardés pour la variété)
    'lava-lamp': {
      name: 'Lava Lamp',
      type: 'canvas',
      value: 'lava-lamp',
      colors: ['#DF437A', '#3d57d6', '#a117fd', '#ec634b'],
      preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojREY0MzdBIiAvPjxzdG9wIG9mZnNldD0iMzMlIiBzdHlsZT0ic3RvcC1jb2xvcjojM2Q1N2Q2IiAvPjxzdG9wIG9mZnNldD0iNjYlIiBzdHlsZT0ic3RvcC1jb2xvcjojYTExN2ZkIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2VjNjM0YiIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0idXJsKCNncmFkKSIgcng9IjgiLz48L3N2Zz4='
    },
    'aurora': {
      name: 'Aurora',
      type: 'canvas',
      value: 'aurora',
      colors: ['#00c9ff', '#92fe9d', '#ff9a9e', '#fecfef'],
      preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhdXJvcmEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMGM5ZmYiIC8+PHN0b3Agb2Zmc2V0PSIzMyUiIHN0eWxlPSJzdG9wLWNvbG9yOiM5MmZlOWQiIC8+PHN0b3Agb2Zmc2V0PSI2NiUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjlhOWUiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmVjZmVmIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI2F1cm9yYSkiIHJ4PSI4Ii8+PC9zdmc+'
    },

    // Custom Themes (nouveaux ajouts)
    'enchanted-river': {
      name: 'Enchanted River',
      type: 'image',
      value: 'https://cdn.builder.io/api/v1/image/assets%2F65e0ac12b2f240efbb50b7ef46d7e58e%2F0c503ef5af214ff6a16651be304d1f40?format=webp&width=800',
      preview: 'https://cdn.builder.io/api/v1/image/assets%2F65e0ac12b2f240efbb50b7ef46d7e58e%2F0c503ef5af214ff6a16651be304d1f40?format=webp&width=400'
    },
    'hobbit-home': {
      name: 'Hobbit Home',
      type: 'image',
      value: 'https://cdn.builder.io/api/v1/image/assets%2F65e0ac12b2f240efbb50b7ef46d7e58e%2F1f5f030c86ae4e0d81e4da399ae31cf1?format=webp&width=800',
      preview: 'https://cdn.builder.io/api/v1/image/assets%2F65e0ac12b2f240efbb50b7ef46d7e58e%2F1f5f030c86ae4e0d81e4da399ae31cf1?format=webp&width=400'
    },
    'golden-forest-cat': {
      name: 'Golden Forest Cat',
      type: 'image',
      value: 'https://cdn.builder.io/api/v1/image/assets%2F65e0ac12b2f240efbb50b7ef46d7e58e%2F2cc8dc38ac0949ac9d2af91847e6a0b6?format=webp&width=800',
      preview: 'https://cdn.builder.io/api/v1/image/assets%2F65e0ac12b2f240efbb50b7ef46d7e58e%2F2cc8dc38ac0949ac9d2af91847e6a0b6?format=webp&width=400'
    },

    // Custom Animated Gradient
    'custom-animated-gradient': {
      name: 'Custom Animated Gradient',
      type: 'animated-gradient',
      value: 'custom',
      colors: ['#DF437A', '#3d57d6', '#a117fd', '#ec634b'],
      preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhbmltYXRlZCIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojREY0MzdBIiAvPjxzdG9wIG9mZnNldD0iMzMlIiBzdHlsZT0ic3RvcC1jb2xvcjojM2Q1N2Q2IiAvPjxzdG9wIG9mZnNldD0iNjYlIiBzdHlsZT0ic3RvcC1jb2xvcjojYTExN2ZkIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2VjNjM0YiIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0idXJsKCNhbmltYXRlZCkiIHJ4PSI4Ii8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iNjAiIHI9IjMiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjgiPjxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIHZhbHVlcz0iMC44OzAuMzswLjgiIGR1cj0iMnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+PC9jaXJjbGU+PC9zdmc+'
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
    customGradientColors,
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
    setYouTubeBackground,
    extractYouTubeId,
    setCustomGradientColors,
    setAnimatedGradientBackground,
    addTodo,
    toggleTodo,
    deleteTodo
  }
})
