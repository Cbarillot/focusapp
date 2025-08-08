<template>
  <div class="panel-section">
    <h3>Themes</h3>
    <p class="section-description">Choose from beautiful backgrounds to enhance your focus experience.</p>
    
    <div class="themes-grid">
      <div 
        v-for="(theme, key) in store.themes" 
        :key="key"
        class="theme-card"
        :class="{ active: store.currentTheme === key }"
        @click="selectTheme(key)"
      >
        <div class="theme-preview">
          <div 
            v-if="theme.type === 'canvas'"
            class="canvas-preview"
            :style="{ background: getCanvasPreviewGradient(theme.colors) }"
          >
            <div class="canvas-indicator">✨</div>
          </div>
          <div 
            v-else-if="theme.type === 'gradient'"
            class="gradient-preview"
            :style="{ background: theme.value }"
          ></div>
          <img 
            v-else
            :src="getPreviewImage(theme)"
            :alt="theme.name"
            class="theme-image"
            @error="handleImageError"
          />
          <div class="theme-type-badge" :class="theme.type">
            {{ getTypeBadge(theme.type) }}
          </div>
        </div>
        <div class="theme-info">
          <h4 class="theme-name">{{ theme.name }}</h4>
          <p class="theme-type">{{ getTypeLabel(theme.type) }}</p>
        </div>
      </div>
    </div>
    
    <div class="setting-group">
      <h4>Display Settings</h4>
      
      <div class="setting-item">
        <label class="setting-label">Overlay opacity</label>
        <div class="slider-container">
          <input 
            type="range" 
            min="0" 
            max="0.8" 
            step="0.1" 
            v-model="overlayOpacity" 
            @input="updateOverlay"
            class="slider"
          />
          <span class="slider-value">{{ Math.round(overlayOpacity * 100) }}%</span>
        </div>
      </div>
      
      <div class="setting-item">
        <label class="setting-label">Auto-change themes</label>
        <label class="toggle-switch">
          <input type="checkbox" v-model="autoChangeThemes" />
          <span class="toggle-slider"></span>
        </label>
      </div>
      
      <div class="setting-item" v-if="autoChangeThemes">
        <label class="setting-label">Change interval</label>
        <select v-model="changeInterval" class="select-input">
          <option value="hour">Every hour</option>
          <option value="session">Every session</option>
          <option value="day">Daily</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '../../stores/appStore'

const store = useAppStore()

const overlayOpacity = ref(store.overlayOpacity)
const autoChangeThemes = ref(false)
const changeInterval = ref('hour')

function selectTheme(themeKey) {
  store.setTheme(themeKey)
}

function updateOverlay() {
  store.overlayOpacity = parseFloat(overlayOpacity.value)
}

function getPreviewImage(theme) {
  // Use high-quality placeholder images that match the theme style
  const placeholderImages = {
    'toto-forest': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3',
    'mountain-lake': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3',
    'cyberpunk-city': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3',
    'ocean-waves': 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3'
  }
  
  const key = Object.keys(placeholderImages).find(k => 
    theme.name.toLowerCase().replace(/\s+/g, '-').includes(k.split('-')[0]) ||
    k.includes(theme.name.toLowerCase().replace(/\s+/g, '-'))
  )
  
  return key ? placeholderImages[key] : theme.value
}

function getCanvasPreviewGradient(colors) {
  if (!colors || colors.length < 2) return 'linear-gradient(45deg, #8B5CF6, #EC4899)'
  return `radial-gradient(circle at 30% 40%, ${colors[0]}40 0%, ${colors[1]}40 25%, ${colors[2]}40 50%, ${colors[3] || colors[0]}40 100%)`
}

function getTypeBadge(type) {
  const badges = {
    'canvas': '✨',
    'video': '🎬',
    'image': '🖼️',
    'gradient': '🌈'
  }
  return badges[type] || '🎨'
}

function getTypeLabel(type) {
  const labels = {
    'canvas': 'Animated',
    'video': 'Video',
    'image': 'Photo',
    'gradient': 'Gradient'
  }
  return labels[type] || 'Custom'
}

function handleImageError(event) {
  // Fallback to a gradient if image fails to load
  const colors = ['#8B5CF6', '#EC4899', '#F59E0B']
  event.target.style.display = 'none'
  event.target.parentElement.style.background = `linear-gradient(45deg, ${colors.join(', ')})`
}
</script>

<style scoped>
.themes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.theme-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.theme-card.active {
  background: rgba(139, 92, 246, 0.2);
  border-color: var(--color-primary);
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
}

.theme-preview {
  position: relative;
  height: 80px;
  overflow: hidden;
}

.theme-image,
.canvas-preview,
.gradient-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.theme-card:hover .theme-image,
.theme-card:hover .canvas-preview {
  transform: scale(1.05);
}

.canvas-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.canvas-indicator {
  font-size: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.theme-type-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2px 6px;
  font-size: 10px;
  line-height: 1;
}

.theme-type-badge.video {
  background: rgba(239, 68, 68, 0.8);
}

.theme-type-badge.canvas {
  background: rgba(139, 92, 246, 0.8);
}

.theme-type-badge.image {
  background: rgba(34, 197, 94, 0.8);
}

.theme-type-badge.gradient {
  background: rgba(249, 115, 22, 0.8);
}

.theme-info {
  padding: 12px;
}

.theme-name {
  margin: 0 0 4px 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.theme-type {
  margin: 0;
  font-size: 11px;
  color: var(--color-text-secondary);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.slider {
  width: 100px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: none;
}

.slider-value {
  font-size: 12px;
  color: var(--color-text-secondary);
  min-width: 32px;
  text-align: right;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.2);
  transition: 0.2s;
  border-radius: 20px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.2s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--color-primary);
}

input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

.select-input {
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-sm);
  color: var(--color-text-primary);
  font-size: 12px;
}

h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

/* Responsive */
@media (max-width: 768px) {
  .themes-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }
  
  .theme-preview {
    height: 70px;
  }
  
  .theme-info {
    padding: 10px;
  }
  
  .theme-name {
    font-size: 12px;
  }
  
  .theme-type {
    font-size: 10px;
  }
}

@media (max-width: 480px) {
  .themes-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .theme-preview {
    height: 60px;
  }
  
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .slider-container {
    align-self: stretch;
    justify-content: space-between;
  }
  
  .slider {
    flex: 1;
    margin-right: 12px;
  }
}
</style>
