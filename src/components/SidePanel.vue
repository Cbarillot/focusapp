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
import TimerSettings from './panels/TimerSettings.vue'
import ThemeSettings from './panels/ThemeSettings.vue'
import MusicSettings from './panels/MusicSettings.vue'
import BackgroundSettings from './panels/BackgroundSettings.vue'
import TodoSettings from './panels/TodoSettings.vue'
import IconTimer from './icons/IconTimer.vue'
import IconTheme from './icons/IconTheme.vue'
import IconMusic from './icons/IconMusic.vue'
import IconBackground from './icons/IconBackground.vue'
import IconTodo from './icons/IconTodo.vue'

const store = useAppStore()

const tabs = [
  { 
    key: 'timer', 
    label: 'Timer', 
    icon: IconTimer
  },
  { 
    key: 'themes', 
    label: 'Themes', 
    icon: IconTheme
  },
  { 
    key: 'music', 
    label: 'Music', 
    icon: IconMusic
  },
  { 
    key: 'background', 
    label: 'Background', 
    icon: IconBackground
  },
  { 
    key: 'todo', 
    label: 'To-do', 
    icon: IconTodo
  }
]

const activeComponent = computed(() => {
  switch (store.activeTab) {
    case 'timer': return TimerSettings
    case 'themes': return ThemeSettings
    case 'music': return MusicSettings
    case 'background': return BackgroundSettings
    case 'todo': return TodoSettings
    default: return TimerSettings
  }
})
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