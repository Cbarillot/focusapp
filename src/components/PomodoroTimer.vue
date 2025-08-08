<template>
  <div class="pomodoro">
    <div class="timer-display" :style="{ borderColor: theme.primaryColor }">
      <div class="time-text">{{ minutes }}:{{ seconds.toString().padStart(2, '0') }}</div>
      <div class="timer-label">{{ currentMode }}</div>
    </div>
    
    <div class="controls">
      <button 
        @click="toggle"
        class="primary-btn"
        :style="{ backgroundColor: theme.primaryColor }"
      >
        {{ running ? '⏸️ Pause' : '▶️ Start' }}
      </button>
      <button @click="reset" class="secondary-btn">
        🔄 Reset
      </button>
    </div>

    <div class="mode-selector">
      <button
        v-for="mode in modes"
        :key="mode.name"
        :class="{ active: selectedMode === mode.name }"
        @click="changeMode(mode.name)"
        :style="{ 
          backgroundColor: selectedMode === mode.name ? theme.primaryColor : 'transparent',
          borderColor: theme.primaryColor,
          color: selectedMode === mode.name ? 'white' : theme.primaryColor
        }"
      >
        {{ mode.icon }} {{ mode.label }}
      </button>
    </div>

    <div class="session-stats">
      <div class="stat">
        <span class="stat-number">{{ completedSessions }}</span>
        <span class="stat-label">Sessions terminées</span>
      </div>
      <div class="stat">
        <span class="stat-number">{{ Math.floor(totalFocusTime / 60) }}</span>
        <span class="stat-label">Minutes de focus</span>
      </div>
    </div>

    <!-- Progress Ring -->
    <div class="progress-ring">
      <svg class="progress-ring-svg" width="200" height="200">
        <circle
          class="progress-ring-circle-bg"
          stroke="#e6e6e6"
          stroke-width="8"
          fill="transparent"
          r="92"
          cx="100"
          cy="100"
        />
        <circle
          class="progress-ring-circle"
          :stroke="theme.primaryColor"
          stroke-width="8"
          fill="transparent"
          r="92"
          cx="100"
          cy="100"
          :stroke-dasharray="circleCircumference"
          :stroke-dashoffset="circleProgress"
          transform="rotate(-90 100 100)"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, watch } from 'vue'

const props = defineProps({
  theme: {
    type: Object,
    default: () => ({ primaryColor: '#4b6cb7' })
  }
})

const modes = [
  { name: 'pomodoro', label: 'Focus', icon: '🍅', duration: 25 * 60 },
  { name: 'shortBreak', label: 'Pause courte', icon: '☕', duration: 5 * 60 },
  { name: 'longBreak', label: 'Pause longue', icon: '🛋️', duration: 15 * 60 }
]

const selectedMode = ref('pomodoro')
const time = ref(modes[0].duration)
const initialTime = ref(modes[0].duration)
const running = ref(false)
const completedSessions = ref(0)
const totalFocusTime = ref(0)
let interval

// Computed properties
const minutes = computed(() => Math.floor(time.value / 60))
const seconds = computed(() => time.value % 60)
const currentMode = computed(() => {
  const mode = modes.find(m => m.name === selectedMode.value)
  return mode ? mode.label : 'Focus'
})

// Progress ring calculations
const circleRadius = 92
const circleCircumference = 2 * Math.PI * circleRadius
const circleProgress = computed(() => {
  const progress = (initialTime.value - time.value) / initialTime.value
  return circleCircumference - progress * circleCircumference
})

function tick() {
  if (time.value > 0) {
    time.value--
    
    // Track focus time
    if (selectedMode.value === 'pomodoro') {
      totalFocusTime.value++
    }
  } else {
    // Timer completed
    running.value = false
    onTimerComplete()
  }
}

function toggle() {
  running.value = !running.value
  if (running.value) {
    interval = setInterval(tick, 1000)
    // Send notification permission request
    requestNotificationPermission()
  } else {
    clearInterval(interval)
  }
}

function reset() {
  clearInterval(interval)
  const mode = modes.find(m => m.name === selectedMode.value)
  time.value = mode ? mode.duration : modes[0].duration
  initialTime.value = time.value
  running.value = false
}

function changeMode(modeName) {
  clearInterval(interval)
  running.value = false
  selectedMode.value = modeName
  
  const mode = modes.find(m => m.name === modeName)
  if (mode) {
    time.value = mode.duration
    initialTime.value = mode.duration
  }
}

function onTimerComplete() {
  // Play notification sound
  playNotificationSound()
  
  // Show notification
  showNotification()
  
  // Track completed session
  if (selectedMode.value === 'pomodoro') {
    completedSessions.value++
    saveStats()
  }
  
  // Auto-start next mode (optional)
  autoStartNextMode()
}

function playNotificationSound() {
  // Create a simple beep sound
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
  oscillator.type = 'sine'
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 1)
}

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
}

function showNotification() {
  if ('Notification' in window && Notification.permission === 'granted') {
    const mode = modes.find(m => m.name === selectedMode.value)
    new Notification('Focus App', {
      body: `${mode.label} terminé ! ${mode.icon}`,
      icon: '/favicon.ico',
      tag: 'pomodoro-timer'
    })
  }
}

function autoStartNextMode() {
  // Auto-suggest next mode based on current
  setTimeout(() => {
    if (selectedMode.value === 'pomodoro') {
      // After focus, suggest short break
      if (completedSessions.value % 4 === 0) {
        changeMode('longBreak')
      } else {
        changeMode('shortBreak')
      }
    } else {
      // After break, suggest focus
      changeMode('pomodoro')
    }
  }, 2000)
}

function saveStats() {
  const stats = {
    completedSessions: completedSessions.value,
    totalFocusTime: totalFocusTime.value,
    lastSession: new Date().toISOString()
  }
  localStorage.setItem('focusapp-stats', JSON.stringify(stats))
}

function loadStats() {
  const saved = localStorage.getItem('focusapp-stats')
  if (saved) {
    try {
      const stats = JSON.parse(saved)
      completedSessions.value = stats.completedSessions || 0
      totalFocusTime.value = stats.totalFocusTime || 0
    } catch (e) {
      console.error('Failed to load stats:', e)
    }
  }
}

// Lifecycle
onUnmounted(() => clearInterval(interval))

// Load stats on component mount
loadStats()

// Watch for theme changes
watch(() => props.theme, (newTheme) => {
  // Update progress ring color dynamically
  const progressRing = document.querySelector('.progress-ring-circle')
  if (progressRing && newTheme.primaryColor) {
    progressRing.setAttribute('stroke', newTheme.primaryColor)
  }
}, { deep: true })
</script>

<style scoped>
.pomodoro {
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
  position: relative;
}

.timer-display {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 30px;
  border: 4px solid var(--primary-color, #4b6cb7);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.time-text {
  font-size: 3rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 5px;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
}

.timer-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.progress-ring {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 200px;
}

.progress-ring-svg {
  width: 100%;
  height: 100%;
}

.progress-ring-circle {
  transition: stroke-dashoffset 1s ease-in-out;
}

.controls {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 30px;
}

.primary-btn {
  background: var(--primary-color, #4b6cb7);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.secondary-btn {
  background: transparent;
  color: var(--primary-color, #4b6cb7);
  border: 2px solid var(--primary-color, #4b6cb7);
  padding: 13px 25px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.secondary-btn:hover {
  background: var(--primary-color, #4b6cb7);
  color: white;
}

.mode-selector {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.mode-selector button {
  padding: 10px 20px;
  border-radius: 20px;
  border: 2px solid var(--primary-color, #4b6cb7);
  background: transparent;
  color: var(--primary-color, #4b6cb7);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.mode-selector button:hover {
  background: rgba(75, 108, 183, 0.1);
}

.mode-selector button.active {
  background: var(--primary-color, #4b6cb7);
  color: white;
}

.session-stats {
  display: flex;
  gap: 30px;
  justify-content: center;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color, #4b6cb7);
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Responsive design */
@media (max-width: 768px) {
  .timer-display {
    width: 160px;
    height: 160px;
  }
  
  .progress-ring {
    width: 160px;
    height: 160px;
  }
  
  .time-text {
    font-size: 2.5rem;
  }
  
  .controls {
    flex-direction: column;
    align-items: center;
  }
  
  .primary-btn, .secondary-btn {
    width: 200px;
  }
  
  .mode-selector {
    flex-direction: column;
    align-items: center;
  }
  
  .mode-selector button {
    width: 200px;
  }
  
  .session-stats {
    gap: 20px;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .timer-display {
    width: 140px;
    height: 140px;
  }
  
  .progress-ring {
    width: 140px;
    height: 140px;
  }
  
  .time-text {
    font-size: 2rem;
  }
  
  .primary-btn, .secondary-btn {
    width: 180px;
    padding: 12px 20px;
  }
  
  .mode-selector button {
    width: 180px;
  }
}
</style>