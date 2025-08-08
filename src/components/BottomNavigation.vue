<template>
  <nav class="bottom-navigation">
    <div class="nav-container">
      <!-- Home Button -->
      <button 
        class="nav-button"
        :class="{ active: store.currentTheme === 'home' }"
        @click="switchToHome"
        title="Mode Home"
      >
        <HomeIcon />
        <span class="nav-label">Home</span>
      </button>

      <!-- Ambiance Button -->
      <button 
        class="nav-button"
        :class="{ active: store.currentTheme === 'ambiance' }"
        @click="switchToAmbiance"
        title="Mode Ambiance"
      >
        <AmbianceIcon />
        <span class="nav-label">Ambiance</span>
      </button>

      <!-- Focus Button -->
      <button 
        class="nav-button"
        :class="{ active: store.currentTheme === 'focus' }"
        @click="switchToFocus"
        title="Mode Focus"
      >
        <FocusIcon />
        <span class="nav-label">Focus</span>
      </button>

      <!-- Music Button -->
      <button 
        class="nav-button"
        :class="{ active: store.activeTab === 'music' && store.sidebarOpen }"
        @click="openMusic"
        title="Musique"
      >
        <MusicIcon />
        <span class="nav-label">Musique</span>
      </button>

      <!-- Todo Button -->
      <button 
        class="nav-button"
        :class="{ active: store.activeTab === 'todo' && store.sidebarOpen }"
        @click="openTodo"
        title="To-do"
      >
        <TodoIcon />
        <span class="nav-label">To-do</span>
      </button>

      <!-- Settings Button -->
      <button 
        class="nav-button"
        :class="{ active: store.sidebarOpen && ['timer', 'themes', 'background'].includes(store.activeTab) }"
        @click="openSettings"
        title="Réglages"
      >
        <SettingsIcon />
        <span class="nav-label">Réglages</span>
      </button>

      <!-- Fullscreen Button -->
      <button 
        class="nav-button"
        :class="{ active: store.isFullscreen }"
        @click="toggleFullscreen"
        title="Plein écran"
      >
        <FullscreenIcon />
        <span class="nav-label">Plein écran</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useAppStore } from '../stores/appStore'

const store = useAppStore()

// Action handlers with user logic slots
function switchToHome() {
  store.switchTheme('home')
  // Slot for user-defined logic
  console.log('Switched to Home theme')
}

function switchToAmbiance() {
  store.switchTheme('ambiance')
  // Slot for user-defined logic
  console.log('Switched to Ambiance theme')
}

function switchToFocus() {
  store.switchTheme('focus')
  // Slot for user-defined logic
  console.log('Switched to Focus theme')
}

function openMusic() {
  store.setActiveTab('music')
  // Slot for user-defined logic
  console.log('Opened Music panel')
}

function openTodo() {
  store.setActiveTab('todo')
  // Slot for user-defined logic
  console.log('Opened Todo panel')
}

function openSettings() {
  store.setActiveTab('timer')
  // Slot for user-defined logic
  console.log('Opened Settings panel')
}

function toggleFullscreen() {
  store.toggleFullscreen()
  // Slot for user-defined logic
  console.log('Toggled fullscreen mode')
}
</script>

<script>
// Dynamic icons that adapt to themes - placeholders for actual icons
const HomeIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const AmbianceIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const FocusIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
      <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const MusicIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18V5L21 3V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="2"/>
      <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="2"/>
    </svg>
  `
}

const TodoIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 11L12 14L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M21 12V19C21 19.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const SettingsIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
      <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2573 9.77251 19.9887C9.5799 19.7201 9.31074 19.5176 9 19.41C8.69838 19.2769 8.36381 19.2372 8.03941 19.296C7.71502 19.3548 7.41568 19.5095 7.18 19.74L7.12 19.8C6.93425 19.986 6.71368 20.1335 6.47088 20.2341C6.22808 20.3348 5.96783 20.3866 5.705 20.3866C5.44217 20.3866 5.18192 20.3348 4.93912 20.2341C4.69632 20.1335 4.47575 19.986 4.29 19.8C4.10405 19.6143 3.95653 19.3937 3.85588 19.1509C3.75523 18.9081 3.70343 18.6478 3.70343 18.385C3.70343 18.1222 3.75523 17.8619 3.85588 17.6191C3.95653 17.3763 4.10405 17.1557 4.29 16.97L4.35 16.91C4.58054 16.6743 4.73519 16.375 4.794 16.0506C4.85282 15.7262 4.81312 15.3916 4.68 15.09C4.55324 14.7942 4.34276 14.542 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.74269 9.96512 4.01133 9.77251C4.27998 9.5799 4.48249 9.31074 4.59 9C4.72312 8.69838 4.76282 8.36381 4.704 8.03941C4.64519 7.71502 4.49054 7.41568 4.26 7.18L4.2 7.12C4.01405 6.93425 3.86653 6.71368 3.76588 6.47088C3.66523 6.22808 3.61343 5.96783 3.61343 5.705C3.61343 5.44217 3.66523 5.18192 3.76588 4.93912C3.86653 4.69632 4.01405 4.47575 4.2 4.29C4.38575 4.10405 4.60632 3.95653 4.84912 3.85588C5.09192 3.75523 5.35217 3.70343 5.615 3.70343C5.87783 3.70343 6.13808 3.75523 6.38088 3.85588C6.62368 3.95653 6.84425 4.10405 7.03 4.29L7.09 4.35C7.32568 4.58054 7.62502 4.73519 7.94941 4.794C8.27381 4.85282 8.60838 4.81312 8.91 4.68H9C9.29577 4.55324 9.54802 4.34276 9.73563 4.07447C9.92325 3.80618 10.0187 3.49179 10.02 3.17V3C10.02 2.46957 10.2307 1.96086 10.6058 1.58579C10.9809 1.21071 11.4896 1 12.02 1C12.5504 1 13.0591 1.21071 13.4342 1.58579C13.8093 1.96086 14.02 2.46957 14.02 3V3.09C14.0213 3.41179 14.1168 3.72618 14.3044 3.99447C14.492 4.26276 14.7443 4.47324 15.04 4.6C15.3416 4.73312 15.6762 4.77282 16.0006 4.714C16.325 4.65519 16.6243 4.50054 16.86 4.27L16.92 4.21C17.1057 4.02405 17.3263 3.87653 17.5691 3.77588C17.8119 3.67523 18.0722 3.62343 18.335 3.62343C18.5978 3.62343 18.8581 3.67523 19.1009 3.77588C19.3437 3.87653 19.5643 4.02405 19.75 4.21C19.936 4.39575 20.0835 4.61632 20.1841 4.85912C20.2848 5.10192 20.3366 5.36217 20.3366 5.625C20.3366 5.88783 20.2848 6.14808 20.1841 6.39088C20.0835 6.63368 19.936 6.85425 19.75 7.04L19.69 7.1C19.4595 7.33568 19.3048 7.63502 19.246 7.95941C19.1872 8.28381 19.2269 8.61838 19.36 8.92V9C19.4868 9.29577 19.6972 9.54802 19.9655 9.73563C20.2338 9.92325 20.5482 10.0187 20.87 10.02H21C21.5304 10.02 22.0391 10.2307 22.4142 10.6058C22.7893 10.9809 23 11.4896 23 12.02C23 12.5504 22.7893 13.0591 22.4142 13.4342C22.0391 13.8093 21.5304 14.02 21 14.02H20.91C20.5882 14.0213 20.2738 14.1168 20.0055 14.3044C19.7372 14.492 19.5268 14.7443 19.4 15.04V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const FullscreenIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V8M21 8V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H16M16 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V16M3 16V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

export default {
  components: {
    HomeIcon,
    AmbianceIcon, 
    FocusIcon,
    MusicIcon,
    TodoIcon,
    SettingsIcon,
    FullscreenIcon
  }
}
</script>

<style scoped>
/* Bottom Navigation - Clean, responsive design */
.bottom-navigation {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  pointer-events: none;
}

.nav-container {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-full);
  box-shadow: var(--shadow-xl);
  pointer-events: auto;
}

/* Navigation buttons with rounded design */
.nav-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 12px 16px;
  min-width: 64px;
  border-radius: var(--border-radius-lg);
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 11px;
  font-weight: 500;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
  transform: translateY(-2px);
}

/* Active state with dynamic theme colors */
.nav-button.active {
  background: var(--color-primary);
  color: var(--color-text-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.nav-label {
  font-size: 10px;
  font-weight: 500;
  text-align: center;
  line-height: 1;
  white-space: nowrap;
}

/* Responsive design for mobile */
@media (max-width: 768px) {
  .bottom-navigation {
    bottom: 16px;
    left: 16px;
    right: 16px;
    transform: none;
  }
  
  .nav-container {
    justify-content: space-between;
    padding: 10px 12px;
    gap: 4px;
  }
  
  .nav-button {
    min-width: auto;
    padding: 10px 8px;
    flex: 1;
  }
  
  .nav-label {
    font-size: 9px;
  }
}

@media (max-width: 480px) {
  .bottom-navigation {
    bottom: 12px;
    left: 12px;
    right: 12px;
  }
  
  .nav-container {
    padding: 8px 10px;
    gap: 2px;
  }
  
  .nav-button {
    padding: 8px 6px;
  }
  
  .nav-label {
    font-size: 8px;
  }
}

/* Theme-specific customizations - placeholders for asset integration */
.nav-button.active[title*="Home"] {
  background: var(--color-primary, #8B5CF6);
}

.nav-button.active[title*="Ambiance"] {
  background: var(--color-primary, #10B981);
}

.nav-button.active[title*="Focus"] {
  background: var(--color-primary, #F59E0B);
}
</style>