<template>
  <!-- 
    Corner Navigation Component
    Distributes navigation buttons across the four corners of the screen
    for a clean, airy presentation while maintaining functionality.
    
    Corner Distribution:
    - Top-Left: Already has menu button in App.vue
    - Top-Right: Settings and system controls (Settings, Fullscreen)
    - Bottom-Left: Media controls (Music, Volume)
    - Bottom-Right: Productivity and theme controls (Todo, Theme switcher)
  -->
  <div class="corner-navigation">
    
    <!-- Top-Right Corner: Settings & System Controls -->
    <div class="corner-container corner-top-right">
      <!-- Settings Button -->
      <button 
        class="corner-button"
        :class="{ active: store.sidebarOpen && ['timer', 'themes', 'background'].includes(store.activeTab) }"
        @click="openSettings"
        :title="'Réglages'"
        :aria-label="'Réglages'"
      >
        <SettingsIcon />
      </button>

      <!-- Fullscreen Button -->
      <button 
        class="corner-button"
        :class="{ active: store.isFullscreen }"
        @click="toggleFullscreen"
        :title="'Plein écran'"
        :aria-label="'Plein écran'"
      >
        <FullscreenIcon />
      </button>
    </div>

    <!-- Bottom-Left Corner: Media Controls -->
    <div class="corner-container corner-bottom-left">
      <!-- Music Button -->
      <button 
        class="corner-button"
        :class="{ active: store.activeTab === 'music' && store.sidebarOpen }"
        @click="openMusic"
        :title="'Musique'"
        :aria-label="'Musique'"
      >
        <MusicIcon />
      </button>

      <!-- Volume Control -->
      <div class="volume-control-container">
        <button 
          class="corner-button volume-button"
          @click="toggleVolumeSlider"
          :title="'Volume'"
          :aria-label="'Volume'"
        >
          <VolumeIcon />
        </button>
        
        <!-- Volume Slider - appears on hover/click -->
        <div 
          class="volume-slider-container"
          :class="{ visible: volumeSliderVisible }"
        >
          <input 
            type="range"
            min="0"
            max="1"
            step="0.1"
            :value="store.volume"
            @input="store.volume = $event.target.value"
            class="volume-slider"
            :aria-label="'Volume'"
          />
        </div>
      </div>
    </div>

    <!-- Bottom-Right Corner: Productivity & Theme Controls -->
    <div class="corner-container corner-bottom-right">
      <!-- Todo Button -->
      <button 
        class="corner-button"
        :class="{ active: store.activeTab === 'todo' && store.sidebarOpen }"
        @click="openTodo"
        :title="'To-do'"
        :aria-label="'To-do'"
      >
        <TodoIcon />
      </button>

      <!-- Theme Switcher Button (cycles through Home/Ambiance/Focus) -->
      <button 
        class="corner-button theme-switcher"
        :class="{ 
          active: ['home', 'ambiance', 'focus'].includes(store.currentTheme),
          'theme-home': store.currentTheme === 'home',
          'theme-ambiance': store.currentTheme === 'ambiance', 
          'theme-focus': store.currentTheme === 'focus'
        }"
        @click="cycleTheme"
        :title="getThemeTitle()"
        :aria-label="getThemeTitle()"
      >
        <component :is="getCurrentThemeIcon()" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '../stores/appStore'

const store = useAppStore()

// Local state for volume slider visibility
const volumeSliderVisible = ref(false)

// Theme cycle order
const themeOrder = ['home', 'ambiance', 'focus']

// Action handlers with improved logic
function openSettings() {
  store.setActiveTab('timer')
  console.log('Opened Settings panel')
}

function toggleFullscreen() {
  store.toggleFullscreen()
  console.log('Toggled fullscreen mode')
}

function openMusic() {
  store.setActiveTab('music')
  console.log('Opened Music panel')
}

function openTodo() {
  store.setActiveTab('todo')
  console.log('Opened Todo panel')
}

function toggleVolumeSlider() {
  volumeSliderVisible.value = !volumeSliderVisible.value
}

function cycleTheme() {
  const currentIndex = themeOrder.indexOf(store.currentTheme)
  const nextIndex = (currentIndex + 1) % themeOrder.length
  const nextTheme = themeOrder[nextIndex]
  store.switchTheme(nextTheme)
  console.log(`Switched to ${nextTheme} theme`)
}

function getCurrentThemeIcon() {
  switch (store.currentTheme) {
    case 'home': return 'HomeIcon'
    case 'ambiance': return 'AmbianceIcon'
    case 'focus': return 'FocusIcon'
    default: return 'HomeIcon'
  }
}

function getThemeTitle() {
  switch (store.currentTheme) {
    case 'home': return 'Thème Home (cliquer pour changer)'
    case 'ambiance': return 'Thème Ambiance (cliquer pour changer)'
    case 'focus': return 'Thème Focus (cliquer pour changer)'
    default: return 'Changer de thème'
  }
}

// Handle click outside to hide volume slider
function handleClickOutside(event) {
  if (!event.target.closest('.corner-bottom-left')) {
    volumeSliderVisible.value = false
  }
}

// Add event listener for click outside
if (typeof document !== 'undefined') {
  document.addEventListener('click', handleClickOutside)
}
</script>

<script>
// Enhanced SVG icons - inline, accessible, without text
const SettingsIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
      <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2573 9.77251 19.9887C9.5799 19.7201 9.31074 19.5176 9 19.41C8.69838 19.2769 8.36381 19.2372 8.03941 19.296C7.71502 19.3548 7.41568 19.5095 7.18 19.74L7.12 19.8C6.93425 19.986 6.71368 20.1335 6.47088 20.2341C6.22808 20.3348 5.96783 20.3866 5.705 20.3866C5.44217 20.3866 5.18192 20.3348 4.93912 20.2341C4.69632 20.1335 4.47575 19.986 4.29 19.8C4.10405 19.6143 3.95653 19.3937 3.85588 19.1509C3.75523 18.9081 3.70343 18.6478 3.70343 18.385C3.70343 18.1222 3.75523 17.8619 3.85588 17.6191C3.95653 17.3763 4.10405 17.1557 4.29 16.97L4.35 16.91C4.58054 16.6743 4.73519 16.375 4.794 16.0506C4.85282 15.7262 4.81312 15.3916 4.68 15.09C4.55324 14.7942 4.34276 14.542 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.74269 9.96512 4.01133 9.77251C4.27998 9.5799 4.48249 9.31074 4.59 9C4.72312 8.69838 4.76282 8.36381 4.704 8.03941C4.64519 7.71502 4.49054 7.41568 4.26 7.18L4.2 7.12C4.01405 6.93425 3.86653 6.71368 3.76588 6.47088C3.66523 6.22808 3.61343 5.96783 3.61343 5.705C3.61343 5.44217 3.66523 5.18192 3.76588 4.93912C3.86653 4.69632 4.01405 4.47575 4.2 4.29C4.38575 4.10405 4.60632 3.95653 4.84912 3.85588C5.09192 3.75523 5.35217 3.70343 5.615 3.70343C5.87783 3.70343 6.13808 3.75523 6.38088 3.85588C6.62368 3.95653 6.84425 4.10405 7.03 4.29L7.09 4.35C7.32568 4.58054 7.62502 4.73519 7.94941 4.794C8.27381 4.85282 8.60838 4.81312 8.91 4.68H9C9.29577 4.55324 9.54802 4.34276 9.73563 4.07447C9.92325 3.80618 10.0187 3.49179 10.02 3.17V3C10.02 2.46957 10.2307 1.96086 10.6058 1.58579C10.9809 1.21071 11.4896 1 12.02 1C12.5504 1 13.0591 1.21071 13.4342 1.58579C13.8093 1.96086 14.02 2.46957 14.02 3V3.09C14.0213 3.41179 14.1168 3.72618 14.3044 3.99447C14.492 4.26276 14.7443 4.47324 15.04 4.6C15.3416 4.73312 15.6762 4.77282 16.0006 4.714C16.325 4.65519 16.6243 4.50054 16.86 4.27L16.92 4.21C17.1057 4.02405 17.3263 3.87653 17.5691 3.77588C17.8119 3.67523 18.0722 3.62343 18.335 3.62343C18.5978 3.62343 18.8581 3.67523 19.1009 3.77588C19.3437 3.87653 19.5643 4.02405 19.75 4.21C19.936 4.39575 20.0835 4.61632 20.1841 4.85912C20.2848 5.10192 20.3366 5.36217 20.3366 5.625C20.3366 5.88783 20.2848 6.14808 20.1841 6.39088C20.0835 6.63368 19.936 6.85425 19.75 7.04L19.69 7.1C19.4595 7.33568 19.3048 7.63502 19.246 7.95941C19.1872 8.28381 19.2269 8.61838 19.36 8.92V9C19.4868 9.29577 19.6972 9.54802 19.9655 9.73563C20.2338 9.92325 20.5482 10.0187 20.87 10.02H21C21.5304 10.02 22.0391 10.2307 22.4142 10.6058C22.7893 10.9809 23 11.4896 23 12.02C23 12.5504 22.7893 13.0591 22.4142 13.4342C22.0391 13.8093 21.5304 14.02 21 14.02H20.91C20.5882 14.0213 20.2738 14.1168 20.0055 14.3044C19.7372 14.492 19.5268 14.7443 19.4 15.04V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const FullscreenIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V8M21 8V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H16M16 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V16M3 16V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const MusicIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M9 18V5L21 3V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="2"/>
      <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="2"/>
    </svg>
  `
}

const VolumeIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15.54 8.46C16.4731 9.39309 17.0018 10.6691 17.0018 11.995C17.0018 13.3209 16.4731 14.5969 15.54 15.53" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const TodoIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M9 11L12 14L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M21 12V19C21 19.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const HomeIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const AmbianceIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const FocusIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
      <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

export default {
  components: {
    SettingsIcon,
    FullscreenIcon,
    MusicIcon,
    VolumeIcon,
    TodoIcon,
    HomeIcon,
    AmbianceIcon, 
    FocusIcon
  }
}
</script>

<style scoped>
/* 
  Corner Navigation Styles
  Clean, responsive design with blur effects and translucent backgrounds
  Positioned in screen corners for airy, minimal presentation
*/

.corner-navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 100;
}

/* Corner container base styles */
.corner-container {
  position: absolute;
  display: flex;
  gap: 8px;
  pointer-events: auto;
}

/* Corner positioning - easily customizable */
.corner-top-right {
  top: 20px;
  right: 20px;
  flex-direction: row;
}

.corner-bottom-left {
  bottom: 20px;
  left: 20px;
  flex-direction: column;
  align-items: flex-start;
}

.corner-bottom-right {
  bottom: 20px;
  right: 20px;
  flex-direction: row;
}

/* Enhanced corner buttons with clean styling */
.corner-button {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-full, 50%);
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.corner-button:hover {
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 1);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.3);
}

/* Active states with dynamic theme colors */
.corner-button.active {
  background: var(--color-primary, #8B5CF6);
  color: white;
  border-color: var(--color-primary, #8B5CF6);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

/* Theme-specific active states */
.corner-button.theme-switcher.theme-home {
  background: #8B5CF6;
  border-color: #8B5CF6;
}

.corner-button.theme-switcher.theme-ambiance {
  background: #10B981;
  border-color: #10B981;
}

.corner-button.theme-switcher.theme-focus {
  background: #F59E0B;
  border-color: #F59E0B;
}

/* Volume control container */
.volume-control-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.volume-button {
  /* Inherits corner-button styles */
}

/* Volume slider container with smooth transitions */
.volume-slider-container {
  position: absolute;
  left: 60px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 12px 16px;
  min-width: 100px;
}

.volume-slider-container.visible {
  opacity: 1;
  visibility: visible;
}

/* Enhanced volume slider */
.volume-slider {
  width: 80px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.3);
  outline: none;
  cursor: pointer;
  appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary, #8B5CF6);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.volume-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.volume-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary, #8B5CF6);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

/* Responsive design for mobile devices */
@media (max-width: 768px) {
  /* Adjust corner positioning for mobile */
  .corner-top-right {
    top: 15px;
    right: 15px;
  }

  .corner-bottom-left {
    bottom: 15px;
    left: 15px;
  }

  .corner-bottom-right {
    bottom: 15px;
    right: 15px;
  }

  .corner-button {
    width: 44px;
    height: 44px;
  }

  /* Stack buttons vertically on mobile for better touch targets */
  .corner-top-right,
  .corner-bottom-right {
    flex-direction: column;
  }

  /* Adjust volume slider positioning for mobile */
  .volume-slider-container {
    left: 50px;
    min-width: 80px;
  }

  .volume-slider {
    width: 60px;
  }
}

@media (max-width: 480px) {
  /* Further mobile optimizations */
  .corner-container {
    gap: 6px;
  }

  .corner-button {
    width: 40px;
    height: 40px;
  }

  .corner-top-right,
  .corner-bottom-left,
  .corner-bottom-right {
    top: 12px;
    right: 12px;
    bottom: 12px;
    left: 12px;
  }

  .volume-slider-container {
    left: 45px;
  }
}

/* Animation for smooth transitions */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.corner-container {
  animation: slideIn 0.3s ease-out;
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .corner-button,
  .volume-slider-container {
    transition: none;
  }
  
  .corner-container {
    animation: none;
  }
}

/* Focus styles for keyboard navigation */
.corner-button:focus-visible {
  outline: 2px solid var(--color-primary, #8B5CF6);
  outline-offset: 2px;
}

.volume-slider:focus-visible {
  outline: 2px solid var(--color-primary, #8B5CF6);
  outline-offset: 2px;
}
</style>