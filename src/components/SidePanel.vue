<template>
  <div class="side-panel">
    <!-- Header -->
    <div class="panel-header">
      <h2>Settings</h2>
      <button class="close-btn" @click="store.toggleSidebar()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    
    <!-- Navigation Tabs -->
    <nav class="panel-nav">
      <button 
        v-for="tab in tabs"
        :key="tab.key"
        class="nav-tab"
        :class="{ active: store.activeTab === tab.key }"
        @click="store.setActiveTab(tab.key)"
      >
        <component :is="tab.icon" />
        <span>{{ tab.label }}</span>
        <span v-if="tab.isNew" class="new-badge">New</span>
      </button>
    </nav>
    
    <!-- Content Area -->
    <div class="panel-content">
      <component :is="activeComponent" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../stores/appStore'
import ThemeSettings from './panels/ThemeSettings.vue'
import ClockSettings from './panels/ClockSettings.vue'
import TimerSettings from './panels/TimerSettings.vue'
import StatsSettings from './panels/StatsSettings.vue'
import MusicSettings from './panels/MusicSettings.vue'
import NotepadSettings from './panels/NotepadSettings.vue'
import SoundsSettings from './panels/SoundsSettings.vue'
import QuotesSettings from './panels/QuotesSettings.vue'

const store = useAppStore()

const tabs = [
  {
    key: 'themes',
    label: 'Themes',
    icon: 'ThemeIcon',
    isNew: true
  },
  {
    key: 'clock',
    label: 'Clock',
    icon: 'ClockIcon'
  },
  {
    key: 'timer',
    label: 'Focus Timer',
    icon: 'TimerIcon',
    isNew: true
  },
  {
    key: 'stats',
    label: 'Stats',
    icon: 'StatsIcon'
  },
  {
    key: 'music',
    label: 'Music',
    icon: 'MusicIcon'
  },
  {
    key: 'notepad',
    label: 'Notepad',
    icon: 'NotepadIcon'
  },
  {
    key: 'sounds',
    label: 'Sounds',
    icon: 'SoundsIcon'
  },
  {
    key: 'quotes',
    label: 'Quotes',
    icon: 'QuotesIcon'
  }
]

const activeComponent = computed(() => {
  switch (store.activeTab) {
    case 'themes': return ThemeSettings
    case 'clock': return ClockSettings
    case 'timer': return TimerSettings
    case 'stats': return StatsSettings
    case 'music': return MusicSettings
    case 'notepad': return NotepadSettings
    case 'sounds': return SoundsSettings
    case 'quotes': return QuotesSettings
    default: return ThemeSettings
  }
})
</script>

<script>
// Icon components
const ClockIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
      <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const TimerIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2H14M12 6V12L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2"/>
    </svg>
  `
}

const StatsIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3V21H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 9L12 6L16 10L21 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const NotepadIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16 13H8M16 17H8M10 9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const SoundsIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15.54 8.46C16.4731 9.39309 17.0018 10.6691 17.0018 11.995C17.0018 13.3209 16.4731 14.5969 15.54 15.53" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const QuotesIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 21C3 17.9 5.9 15 9 15C6.9 15 6 13.1 6 11C6 7.9 8.9 5 12 5S18 7.9 18 11C18 13.1 17.1 15 15 15C18.1 15 21 17.9 21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const ThemeIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
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

const BackgroundIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
      <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="2"/>
      <path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const TodoIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 11L12 14L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

export default {
  components: {
    ClockIcon,
    TimerIcon,
    StatsIcon,
    ThemeIcon,
    MusicIcon,
    NotepadIcon,
    SoundsIcon,
    QuotesIcon
  }
}
</script>

<style scoped>
.side-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid var(--color-border);
}

.panel-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.close-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-full);
  background: transparent;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
}

.panel-nav {
  padding: 16px;
  border-bottom: 1px solid var(--color-border);
}

.nav-tab {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 4px;
  border-radius: var(--border-radius-md);
  background: transparent;
  color: var(--color-text-secondary);
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-fast);
  position: relative;
}

.nav-tab:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
}

.nav-tab.active {
  background: var(--color-primary);
  color: var(--color-text-primary);
}

.nav-tab:last-child {
  margin-bottom: 0;
}

.new-badge {
  margin-left: auto;
  background: var(--color-primary);
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

/* Responsive */
@media (max-width: 480px) {
  .panel-header {
    padding: 20px;
  }
  
  .panel-nav {
    padding: 12px;
  }
  
  .nav-tab {
    padding: 10px 12px;
    font-size: 13px;
  }
  
  .panel-content {
    padding: 20px;
  }
}
</style>
