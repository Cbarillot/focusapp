<template>
  <div class="theme-manager">
    <div class="theme-tabs">
      <button 
        :class="{ active: activeTab === 'presets' }" 
        @click="activeTab = 'presets'"
      >
        Thèmes
      </button>
      <button 
        :class="{ active: activeTab === 'custom' }" 
        @click="activeTab = 'custom'"
      >
        Personnalisé
      </button>
    </div>

    <div v-if="activeTab === 'presets'" class="preset-themes">
      <h3>Thèmes prédéfinis</h3>
      <div class="theme-grid">
        <div 
          v-for="theme in presetThemes" 
          :key="theme.id"
          :class="{ active: currentTheme.id === theme.id }"
          class="theme-item"
          @click="applyTheme(theme)"
        >
          <div class="theme-preview" :style="{ background: theme.background }"></div>
          <span>{{ theme.name }}</span>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'custom'" class="custom-theme">
      <h3>Créer un thème personnalisé</h3>
      
      <div class="background-section">
        <h4>Fond d'écran</h4>
        <div class="background-options">
          <div class="upload-section">
            <input 
              type="file" 
              ref="fileInput"
              @change="onBackgroundFile" 
              accept="image/*,video/*"
              style="display: none"
            />
            <button @click="$refs.fileInput.click()">
              📁 Fichier local
            </button>
          </div>
          
          <div class="url-section">
            <input 
              v-model="customBackgroundUrl"
              type="url" 
              placeholder="URL d'image ou vidéo"
              @input="onBackgroundUrl"
            />
            <button @click="applyBackgroundUrl">✓</button>
          </div>
        </div>

        <div v-if="customBackground" class="background-preview">
          <img 
            v-if="customBackground.type === 'image'" 
            :src="customBackground.src" 
            alt="Preview"
          />
          <video 
            v-else-if="customBackground.type === 'video'"
            :src="customBackground.src" 
            muted 
            loop
            autoplay
          ></video>
        </div>
      </div>

      <div class="color-section" v-if="extractedColors.length">
        <h4>Palette de couleurs</h4>
        <div class="color-palette">
          <div 
            v-for="(color, index) in extractedColors" 
            :key="index"
            :style="{ backgroundColor: color }"
            :class="{ active: selectedColor === color }"
            class="color-swatch"
            @click="selectColor(color)"
          >
          </div>
        </div>
      </div>

      <button 
        v-if="customBackground && selectedColor" 
        @click="saveCustomTheme"
        class="save-theme-btn"
      >
        💾 Sauvegarder le thème
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'

const emit = defineEmits(['theme-changed'])

const activeTab = ref('presets')
const customBackgroundUrl = ref('')
const customBackground = ref(null)
const extractedColors = ref([])
const selectedColor = ref(null)

// Current applied theme
const currentTheme = reactive({
  id: 'default',
  name: 'Default',
  background: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
  primaryColor: '#4b6cb7',
  type: 'gradient'
})

// Preset themes
const presetThemes = ref([
  {
    id: 'default',
    name: 'Océan',
    background: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
    primaryColor: '#4b6cb7',
    type: 'gradient'
  },
  {
    id: 'sunset',
    name: 'Coucher de soleil',
    background: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
    primaryColor: '#ff7e5f',
    type: 'gradient'
  },
  {
    id: 'forest',
    name: 'Forêt',
    background: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)',
    primaryColor: '#56ab2f',
    type: 'gradient'
  },
  {
    id: 'night',
    name: 'Nuit étoilée',
    background: 'linear-gradient(135deg, #2c3e50 0%, #000428 100%)',
    primaryColor: '#2c3e50',
    type: 'gradient'
  }
])

function applyTheme(theme) {
  Object.assign(currentTheme, theme)
  emit('theme-changed', currentTheme)
  saveThemeToStorage()
}

function onBackgroundFile(event) {
  const file = event.target.files[0]
  if (file) {
    const url = URL.createObjectURL(file)
    const type = file.type.startsWith('image/') ? 'image' : 'video'
    
    customBackground.value = { src: url, type }
    
    if (type === 'image') {
      extractColorsFromImage(url)
    }
  }
}

function onBackgroundUrl() {
  // Auto-apply URL as user types (with debounce could be added)
}

function applyBackgroundUrl() {
  if (customBackgroundUrl.value) {
    const isVideo = /\.(mp4|webm|ogg)$/i.test(customBackgroundUrl.value)
    const type = isVideo ? 'video' : 'image'
    
    customBackground.value = { 
      src: customBackgroundUrl.value, 
      type 
    }
    
    if (type === 'image') {
      extractColorsFromImage(customBackgroundUrl.value)
    }
  }
}

function extractColorsFromImage(imageSrc) {
  // Create a canvas to analyze the image
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    // Scale down for performance
    const maxSize = 100
    const scale = Math.min(maxSize / img.width, maxSize / img.height)
    canvas.width = img.width * scale
    canvas.height = img.height * scale
    
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const colors = extractDominantColors(imageData.data)
    extractedColors.value = colors
  }
  img.src = imageSrc
}

function extractDominantColors(imageData) {
  const colorMap = new Map()
  const step = 4 * 5 // Sample every 5th pixel for performance
  
  for (let i = 0; i < imageData.length; i += step) {
    const r = imageData[i]
    const g = imageData[i + 1]
    const b = imageData[i + 2]
    const alpha = imageData[i + 3]
    
    if (alpha > 128) { // Skip transparent pixels
      // Quantize colors to reduce noise
      const qr = Math.round(r / 32) * 32
      const qg = Math.round(g / 32) * 32  
      const qb = Math.round(b / 32) * 32
      
      const colorKey = `${qr},${qg},${qb}`
      colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1)
    }
  }
  
  // Sort by frequency and convert to hex
  const sortedColors = Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([color]) => {
      const [r, g, b] = color.split(',').map(Number)
      return rgbToHex(r, g, b)
    })
  
  return sortedColors
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

function selectColor(color) {
  selectedColor.value = color
}

function saveCustomTheme() {
  const customTheme = {
    id: 'custom-' + Date.now(),
    name: 'Mon thème personnalisé',
    background: customBackground.value.type === 'image' 
      ? `url(${customBackground.value.src})` 
      : customBackground.value.src,
    primaryColor: selectedColor.value,
    type: customBackground.value.type,
    backgroundSrc: customBackground.value.src
  }
  
  // Add to presets for easy access
  presetThemes.value.push(customTheme)
  
  // Apply immediately
  applyTheme(customTheme)
  
  // Switch to presets tab to show the saved theme
  activeTab.value = 'presets'
}

function saveThemeToStorage() {
  localStorage.setItem('focusapp-theme', JSON.stringify(currentTheme))
}

function loadThemeFromStorage() {
  const saved = localStorage.getItem('focusapp-theme')
  if (saved) {
    try {
      const theme = JSON.parse(saved)
      Object.assign(currentTheme, theme)
      emit('theme-changed', currentTheme)
    } catch (e) {
      console.error('Failed to load saved theme:', e)
    }
  }
}

onMounted(() => {
  loadThemeFromStorage()
  // Apply initial theme
  emit('theme-changed', currentTheme)
})
</script>

<style scoped>
.theme-manager {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.theme-tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.theme-tabs button {
  flex: 1;
  padding: 10px 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.theme-tabs button.active {
  border-bottom-color: var(--primary-color, #4b6cb7);
  color: var(--primary-color, #4b6cb7);
  font-weight: 600;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
}

.theme-item {
  text-align: center;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.theme-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.theme-item.active {
  border-color: var(--primary-color, #4b6cb7);
}

.theme-preview {
  width: 100%;
  height: 60px;
  border-radius: 6px;
  margin-bottom: 8px;
}

.background-options {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 15px;
}

.url-section {
  display: flex;
  flex: 1;
  gap: 8px;
}

.url-section input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.background-preview {
  margin: 15px 0;
  max-height: 200px;
  overflow: hidden;
  border-radius: 8px;
}

.background-preview img,
.background-preview video {
  width: 100%;
  height: auto;
  display: block;
}

.color-palette {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.color-swatch {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.2s;
}

.color-swatch:hover {
  transform: scale(1.1);
}

.color-swatch.active {
  border-color: #333;
  transform: scale(1.1);
}

.save-theme-btn {
  background: var(--primary-color, #4b6cb7);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  margin-top: 15px;
}

.save-theme-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover {
  background: #f5f5f5;
}

h3, h4 {
  margin: 0 0 15px 0;
  color: #333;
}

h4 {
  font-size: 14px;
  font-weight: 600;
}
</style>