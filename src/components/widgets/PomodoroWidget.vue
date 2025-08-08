<template>
  <div class="bg-black/20 backdrop-blur-md rounded-2xl p-8 text-white">
    <!-- Header -->
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
        {{ currentMode }}
      </h2>
      <p class="text-gray-400 mt-2">
        Session {{ currentSession }} / {{ settings.cyclesBeforeLongBreak }}
      </p>
    </div>

    <!-- Timer Display -->
    <div class="text-center mb-8">
      <div class="text-7xl font-light mb-4 font-mono tracking-wider">
        {{ displayTime }}
      </div>
      
      <!-- Progress Ring -->
      <div class="relative w-32 h-32 mx-auto mb-6">
        <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
          <!-- Background circle -->
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            stroke-width="12"
          />
          <!-- Progress circle -->
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            :stroke="progressColor"
            stroke-width="12"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="progressOffset"
            class="transition-all duration-1000 ease-out"
          />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-lg font-medium">{{ progressPercent }}%</span>
        </div>
      </div>
    </div>

    <!-- Control Buttons -->
    <div class="flex justify-center gap-4 mb-8">
      <button
        @click="toggle"
        class="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
        :class="{ 'bg-orange-600 hover:bg-orange-700': isRunning }"
      >
        {{ isRunning ? 'Pause' : 'Démarrer' }}
      </button>
      
      <button
        @click="reset"
        class="px-6 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
      >
        Reset
      </button>
      
      <button
        @click="skip"
        class="px-6 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
      >
        Passer
      </button>
    </div>

    <!-- Statistics -->
    <div class="grid grid-cols-3 gap-4 bg-white/5 rounded-xl p-4">
      <div class="text-center">
        <div class="text-2xl font-bold text-blue-400">{{ stats.completedPomodoros }}</div>
        <div class="text-sm text-gray-400">Pomodoros</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-green-400">{{ stats.focusTime }}</div>
        <div class="text-sm text-gray-400">Min focus</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-purple-400">{{ stats.totalSessions }}</div>
        <div class="text-sm text-gray-400">Sessions</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted, watch } from 'vue'

// Timer settings (could be passed as props or from store)
const settings = ref({
  workDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  cyclesBeforeLongBreak: 4,
  soundEnabled: true,
  autoStartBreaks: false,
  autoStartPomodoros: false
})

// Timer state
const timeLeft = ref(settings.value.workDuration * 60)
const isRunning = ref(false)
const currentMode = ref('Pomodoro')
const currentSession = ref(1)
const totalSessions = ref(0)

// Statistics
const stats = ref({
  completedPomodoros: 0,
  focusTime: 0,
  totalSessions: 0
})

// Timer interval
let interval = null

// Computed properties
const displayTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const circumference = 2 * Math.PI * 54
const progressPercent = computed(() => {
  const total = getCurrentModeDuration() * 60
  return Math.round(((total - timeLeft.value) / total) * 100)
})

const progressOffset = computed(() => {
  const total = getCurrentModeDuration() * 60
  const progress = (total - timeLeft.value) / total
  return circumference - (progress * circumference)
})

const progressColor = computed(() => {
  switch (currentMode.value) {
    case 'Pomodoro':
      return '#3b82f6' // blue
    case 'Pause courte':
      return '#10b981' // green
    case 'Pause longue':
      return '#8b5cf6' // purple
    default:
      return '#3b82f6'
  }
})

// Methods
function getCurrentModeDuration() {
  switch (currentMode.value) {
    case 'Pomodoro':
      return settings.value.workDuration
    case 'Pause courte':
      return settings.value.shortBreak
    case 'Pause longue':
      return settings.value.longBreak
    default:
      return settings.value.workDuration
  }
}

function tick() {
  if (timeLeft.value > 0) {
    timeLeft.value--
  } else {
    // Timer finished
    completeSession()
  }
}

function toggle() {
  if (isRunning.value) {
    pause()
  } else {
    start()
  }
}

function start() {
  isRunning.value = true
  interval = setInterval(tick, 1000)
}

function pause() {
  isRunning.value = false
  if (interval) {
    clearInterval(interval)
    interval = null
  }
}

function reset() {
  pause()
  timeLeft.value = getCurrentModeDuration() * 60
}

function skip() {
  pause()
  completeSession()
}

function completeSession() {
  pause()
  
  // Play notification sound if enabled
  if (settings.value.soundEnabled) {
    playNotificationSound()
  }
  
  // Show desktop notification
  showDesktopNotification()
  
  // Update statistics
  updateStats()
  
  // Switch to next mode
  switchMode()
  
  // Auto-start if enabled
  if (shouldAutoStart()) {
    setTimeout(() => {
      start()
    }, 1000)
  }
}

function switchMode() {
  if (currentMode.value === 'Pomodoro') {
    stats.value.completedPomodoros++
    
    if (currentSession.value >= settings.value.cyclesBeforeLongBreak) {
      currentMode.value = 'Pause longue'
      currentSession.value = 1
    } else {
      currentMode.value = 'Pause courte'
      currentSession.value++
    }
  } else {
    currentMode.value = 'Pomodoro'
  }
  
  timeLeft.value = getCurrentModeDuration() * 60
  totalSessions.value++
  stats.value.totalSessions = totalSessions.value
}

function shouldAutoStart() {
  if (currentMode.value === 'Pomodoro') {
    return settings.value.autoStartPomodoros
  } else {
    return settings.value.autoStartBreaks
  }
}

function updateStats() {
  if (currentMode.value === 'Pomodoro') {
    stats.value.focusTime += settings.value.workDuration
  }
}

function playNotificationSound() {
  // TODO: Implement sound playback
  console.log('Playing notification sound')
}

function showDesktopNotification() {
  if ('Notification' in window && Notification.permission === 'granted') {
    let title, body
    
    if (currentMode.value === 'Pomodoro') {
      title = '🍅 Pomodoro terminé !'
      body = 'Temps de prendre une pause'
    } else {
      title = '☕ Pause terminée !'
      body = 'Prêt pour un nouveau pomodoro ?'
    }
    
    new Notification(title, { body, icon: '/favicon.ico' })
  }
}

// Request notification permission on mount
onMounted(() => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
  
  // Load saved statistics
  const savedStats = localStorage.getItem('focusapp-stats')
  if (savedStats) {
    stats.value = { ...stats.value, ...JSON.parse(savedStats) }
  }
})

// Save statistics when they change
watch(stats, (newStats) => {
  localStorage.setItem('focusapp-stats', JSON.stringify(newStats))
}, { deep: true })

// Cleanup on unmount
onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})

// Watch for settings changes
watch(() => settings.value.workDuration, () => {
  if (!isRunning.value && currentMode.value === 'Pomodoro') {
    timeLeft.value = settings.value.workDuration * 60
  }
})

watch(() => settings.value.shortBreak, () => {
  if (!isRunning.value && currentMode.value === 'Pause courte') {
    timeLeft.value = settings.value.shortBreak * 60
  }
})

watch(() => settings.value.longBreak, () => {
  if (!isRunning.value && currentMode.value === 'Pause longue') {
    timeLeft.value = settings.value.longBreak * 60
  }
})
</script>