<template>
  <div class="soundscape-controls">
    <div class="soundscape-container">
      <div class="soundscape-items">
        <button 
          v-for="(soundscape, key) in store.soundscapes" 
          :key="key"
          class="soundscape-btn"
          :class="{ active: soundscape.enabled }"
          @click="toggleSoundscape(key)"
        >
          <component :is="getSoundscapeIcon(key)" />
          <span class="soundscape-label">{{ getSoundscapeLabel(key) }}</span>
          <input 
            v-if="soundscape.enabled"
            type="range"
            min="0"
            max="1"
            step="0.1"
            :value="soundscape.volume"
            @input="updateVolume(key, $event.target.value)"
            class="volume-slider"
            @click.stop
          />
        </button>
      </div>
      
      <!-- Master Volume -->
      <div class="master-volume">
        <VolumeIcon />
        <input 
          type="range"
          min="0"
          max="1"
          step="0.1"
          :value="store.volume"
          @input="store.volume = $event.target.value"
          class="master-slider"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '../stores/appStore'

const store = useAppStore()

function toggleSoundscape(key) {
  store.soundscapes[key].enabled = !store.soundscapes[key].enabled
}

function updateVolume(key, volume) {
  store.soundscapes[key].volume = parseFloat(volume)
}

function getSoundscapeLabel(key) {
  const labels = {
    rain: 'Rain',
    forest: 'Forest',
    cafe: 'Café',
    ocean: 'Ocean'
  }
  return labels[key] || key
}

function getSoundscapeIcon(key) {
  const icons = {
    rain: 'RainIcon',
    forest: 'ForestIcon', 
    cafe: 'CafeIcon',
    ocean: 'OceanIcon'
  }
  return icons[key] || 'DefaultIcon'
}
</script>

<script>
// Icon components
const RainIcon = {
  template: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 10C17 8.89543 16.1046 8 15 8C13.8954 8 13 8.89543 13 10M7 12L5 16M12 12L10 16M17 12L15 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z" stroke="currentColor" stroke-width="2"/>
    </svg>
  `
}

const ForestIcon = {
  template: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22V16M12 16L8 12L12 8L16 12L12 16ZM12 16L6 10L12 4L18 10L12 16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const CafeIcon = {
  template: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 8H20C21.1046 8 22 8.89543 22 10V12C22 13.1046 21.1046 14 20 14H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M5 8H15V18C15 19.1046 14.1046 20 13 20H7C5.89543 20 5 19.1046 5 18V8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7 4V8M11 4V8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const OceanIcon = {
  template: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 12C2 12 4 9 8 9C12 9 14 12 18 12C22 12 24 9 24 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 16C2 16 4 13 8 13C12 13 14 16 18 16C22 16 24 13 24 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 20C2 20 4 17 8 17C12 17 14 20 18 20C22 20 24 17 24 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const VolumeIcon = {
  template: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15.54 8.46C16.4731 9.39309 17.0018 10.6691 17.0018 11.995C17.0018 13.3209 16.4731 14.5969 15.54 15.53" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

export default {
  components: {
    RainIcon,
    ForestIcon,
    CafeIcon,
    OceanIcon,
    VolumeIcon
  }
}
</script>

<style scoped>
.soundscape-controls {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(40px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.soundscape-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.soundscape-items {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  overflow-x: auto;
  padding: 4px 0;
}

.soundscape-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: var(--border-radius-full);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease;
  min-width: fit-content;
  backdrop-filter: blur(10px);
}

.soundscape-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.95);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.soundscape-btn.active {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.9);
  color: #6B46C1;
  font-weight: 600;
  box-shadow: 0 2px 12px rgba(255, 255, 255, 0.25);
}

.soundscape-label {
  font-size: 11px;
}

.volume-slider {
  width: 60px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  cursor: pointer;
  margin-left: 4px;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-text-primary);
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-text-primary);
  cursor: pointer;
  border: none;
}

.master-volume {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.8);
  border-left: 1px solid rgba(255, 255, 255, 0.15);
  padding-left: 24px;
}

.master-slider {
  width: 80px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  cursor: pointer;
}

.master-slider::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
}

.master-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: none;
}

/* Scrollbar for soundscape items */
.soundscape-items::-webkit-scrollbar {
  height: 4px;
}

.soundscape-items::-webkit-scrollbar-track {
  background: transparent;
}

.soundscape-items::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

/* Responsive */
@media (max-width: 768px) {
  .soundscape-container {
    padding: 12px 15px;
    gap: 15px;
  }
  
  .master-volume {
    padding-left: 15px;
  }
  
  .master-slider {
    width: 60px;
  }
}

@media (max-width: 480px) {
  .soundscape-container {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .master-volume {
    border-left: none;
    border-top: 1px solid var(--color-border);
    padding-left: 0;
    padding-top: 12px;
    justify-content: center;
  }
  
  .soundscape-items {
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .soundscape-btn {
    padding: 6px 10px;
    font-size: 11px;
  }
  
  .soundscape-label {
    display: none;
  }
  
  .volume-slider {
    width: 50px;
  }
}
</style>
