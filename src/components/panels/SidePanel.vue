<template>
  <div class="flex flex-col h-full text-white">
    <!-- Header -->
    <div class="p-6 border-b border-white/10">
      <h2 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
        Focus App
      </h2>
      <p class="text-gray-400 text-sm mt-1">Customize your workspace</p>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-white/10">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="flex-1 p-4 text-sm font-medium transition-all duration-200"
        :class="{
          'text-blue-400 border-b-2 border-blue-400 bg-white/5': activeTab === tab.id,
          'text-gray-400 hover:text-white hover:bg-white/5': activeTab !== tab.id
        }"
      >
        <div class="flex flex-col items-center gap-1">
          <component :is="tab.icon" class="w-5 h-5" />
          <span>{{ tab.name }}</span>
        </div>
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto">
      <component :is="currentTabComponent" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ThemesPanel from './ThemesPanel.vue'
import TimerPanel from './TimerPanel.vue' 
import BackgroundPanel from './BackgroundPanel.vue'
import MusicPanel from './MusicPanel.vue'

// Simple SVG icons as components
const PaletteIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3V1m0 18v2m8-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2V11z"/></svg>`
}

const ClockIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
}

const PhotoIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`
}

const MusicIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM22 16c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"/></svg>`
}

const activeTab = ref('themes')

const tabs = [
  { id: 'themes', name: 'Thèmes', icon: PaletteIcon, component: ThemesPanel },
  { id: 'timer', name: 'Timer', icon: ClockIcon, component: TimerPanel },
  { id: 'background', name: 'Fond', icon: PhotoIcon, component: BackgroundPanel },
  { id: 'music', name: 'Musique', icon: MusicIcon, component: MusicPanel }
]

const currentTabComponent = computed(() => {
  return tabs.find(tab => tab.id === activeTab.value)?.component || ThemesPanel
})

const emit = defineEmits(['close'])
</script>