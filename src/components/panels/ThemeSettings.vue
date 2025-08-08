<template>
  <div class="theme-settings">
    <div class="section">
      <h3 class="section-title">App Themes</h3>
      
      <div class="theme-grid">
        <button 
          v-for="(theme, key) in store.themes"
          :key="key"
          class="theme-card"
          :class="{ active: store.currentTheme === key }"
          @click="store.setTheme(key)"
        >
          <div class="theme-preview">
            <div 
              class="color-swatch primary"
              :style="{ backgroundColor: theme.colors.primary }"
            ></div>
            <div 
              class="color-swatch secondary" 
              :style="{ backgroundColor: theme.colors.secondary }"
            ></div>
            <div 
              class="color-swatch accent"
              :style="{ backgroundColor: theme.colors.accent }"
            ></div>
          </div>
          <span class="theme-name">{{ theme.name }}</span>
          <div class="theme-background-preview" :style="{ background: theme.background }"></div>
        </button>
      </div>
    </div>
    
    <div class="section">
      <h3 class="section-title">Custom Colors</h3>
      
      <div class="color-inputs">
        <label class="color-label">
          <span>Primary Color</span>
          <input 
            type="color" 
            :value="getCurrentTheme()?.colors.primary || '#8B5CF6'"
            class="color-input"
            @input="updateThemeColor('primary', $event.target.value)"
          />
        </label>
        
        <label class="color-label">
          <span>Secondary Color</span>
          <input 
            type="color" 
            :value="getCurrentTheme()?.colors.secondary || '#A78BFA'"
            class="color-input"
            @input="updateThemeColor('secondary', $event.target.value)"
          />
        </label>
        
        <label class="color-label">
          <span>Accent Color</span>
          <input 
            type="color" 
            :value="getCurrentTheme()?.colors.accent || '#DDD6FE'"
            class="color-input"
            @input="updateThemeColor('accent', $event.target.value)"
          />
        </label>
      </div>
    </div>
    
    <!-- Custom Asset Zone for Background -->
    <div class="section">
      <h3 class="section-title">Custom Backgrounds</h3>
      
      <div class="custom-asset-zone">
        <button class="add-asset-btn" @click="showBackgroundUpload = true">
          <PlusIcon />
          <span>Add Custom Background</span>
        </button>
        
        <p class="asset-hint">Upload your own background images or videos</p>
      </div>
    </div>
    
    <!-- Background Upload Modal -->
    <div v-if="showBackgroundUpload" class="asset-upload-overlay" @click="showBackgroundUpload = false">
      <div class="asset-upload-modal" @click.stop>
        <h3>Add Custom Background</h3>
        <p>Upload your own background assets</p>
        <div class="upload-options">
          <input type="file" accept="image/*" @change="uploadBackground" ref="imageInput" style="display: none" />
          <input type="file" accept="video/*" @change="uploadBackground" ref="videoInput" style="display: none" />
          <button @click="$refs.imageInput.click()" class="upload-btn">
            Upload Image
          </button>
          <button @click="$refs.videoInput.click()" class="upload-btn">
            Upload Video
          </button>
        </div>
        <button @click="showBackgroundUpload = false" class="close-btn">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '../../stores/appStore'

const store = useAppStore()
const showBackgroundUpload = ref(false)

const getCurrentTheme = () => store.themes[store.currentTheme]

function updateThemeColor(colorType, color) {
  // Update the current theme's color
  if (store.themes[store.currentTheme]) {
    store.themes[store.currentTheme].colors[colorType] = color
  }
  
  // Update CSS custom properties
  document.documentElement.style.setProperty(`--color-${colorType}`, color)
  
  // If it's primary color, also update primary-dark
  if (colorType === 'primary') {
    const darkColor = adjustColor(color, -20)
    document.documentElement.style.setProperty('--color-primary-dark', darkColor)
  }
}

function adjustColor(color, amount) {
  // Simple color adjustment utility
  const num = parseInt(color.slice(1), 16)
  const amt = Math.round(2.55 * amount)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
}

function uploadBackground(event) {
  const file = event.target.files[0]
  if (file) {
    const url = URL.createObjectURL(file)
    const type = file.type.startsWith('video/') ? 'video' : 'image'
    store.setBackground(type, url)
    showBackgroundUpload.value = false
  }
}
</script>

<script>
const PlusIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5v14m-7-7h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

export default {
  components: { PlusIcon }
}
</script>

<style scoped>
.theme-settings {
  color: var(--color-text-primary);
}

.section {
  margin-bottom: 32px;
}

.section:last-child {
  margin-bottom: 0;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
}

.theme-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-radius: var(--border-radius-lg);
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid var(--color-border);
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.theme-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  color: var(--color-text-primary);
  transform: translateY(-2px);
}

.theme-card.active {
  background: rgba(139, 92, 246, 0.15);
  border-color: var(--color-primary);
  color: var(--color-text-primary);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2);
}

.theme-background-preview {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  opacity: 0.6;
}

.theme-preview {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.theme-name {
  font-size: 13px;
  font-weight: 600;
  text-align: center;
}

.color-inputs {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.color-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: var(--color-text-secondary);
  padding: 12px 0;
}

.color-input {
  width: 50px;
  height: 40px;
  border-radius: var(--border-radius-sm);
  border: 2px solid var(--color-border);
  background: transparent;
  cursor: pointer;
  overflow: hidden;
  transition: all var(--transition-fast);
}

.color-input:hover {
  border-color: var(--color-primary);
  transform: scale(1.05);
}

.color-input::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-input::-webkit-color-swatch {
  border: none;
  border-radius: var(--border-radius-sm);
}

.color-input::-moz-color-swatch {
  border: none;
  border-radius: var(--border-radius-sm);
}

.custom-asset-zone {
  border: 2px dashed var(--color-border);
  border-radius: var(--border-radius-md);
  padding: 32px 24px;
  text-align: center;
}

.add-asset-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px;
  border-radius: var(--border-radius-md);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-fast);
  margin: 0 auto 12px;
}

.add-asset-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
  transform: translateY(-1px);
}

.asset-hint {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-muted);
}

.asset-upload-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.asset-upload-modal {
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: 32px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.asset-upload-modal h3 {
  margin: 0 0 16px 0;
  color: var(--color-text-primary);
  font-size: 18px;
}

.asset-upload-modal p {
  margin: 0 0 24px 0;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.upload-options {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  justify-content: center;
}

.upload-btn {
  padding: 12px 20px;
  border-radius: var(--border-radius-md);
  background: var(--color-primary);
  color: var(--color-text-primary);
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.upload-btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.close-btn {
  padding: 8px 16px;
  border-radius: var(--border-radius-sm);
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 13px;
  transition: all var(--transition-fast);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
}

/* Responsive */
@media (max-width: 480px) {
  .theme-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .theme-card {
    padding: 16px;
  }
  
  .color-swatch {
    width: 20px;
    height: 20px;
  }
  
  .theme-name {
    font-size: 12px;
  }
  
  .color-label {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .color-input {
    align-self: flex-end;
  }
  
  .upload-options {
    flex-direction: column;
  }
}
</style>