<template>
  <div class="theme-settings">
    <div class="section">
      <h3 class="section-title">Color Themes</h3>
      
      <div class="theme-grid">
        <button 
          v-for="theme in themes"
          :key="theme.key"
          class="theme-card"
          :class="{ active: store.currentTheme === theme.key }"
          @click="setTheme(theme.key)"
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
            :value="customPrimary"
            class="color-input"
            @input="updateCustomColor('primary', $event.target.value)"
          />
        </label>
        
        <label class="color-label">
          <span>Secondary Color</span>
          <input 
            type="color" 
            :value="customSecondary"
            class="color-input"
            @input="updateCustomColor('secondary', $event.target.value)"
          />
        </label>
      </div>
    </div>
    
    <div class="section">
      <h3 class="section-title">Palette from Background</h3>
      <p class="section-description">
        Generate color palette automatically from your background image or video
      </p>
      
      <div class="palette-section">
        <input 
          type="file"
          ref="paletteImageInput"
          accept="image/*"
          @change="generatePaletteFromImage"
          style="display: none"
        />
        
        <button @click="$refs.paletteImageInput.click()" class="palette-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="13.5" cy="6.5" r=".5" stroke="currentColor" stroke-width="2"/>
            <circle cx="17.5" cy="10.5" r=".5" stroke="currentColor" stroke-width="2"/>
            <circle cx="8.5" cy="7.5" r=".5" stroke="currentColor" stroke-width="2"/>
            <circle cx="6.5" cy="12.5" r=".5" stroke="currentColor" stroke-width="2"/>
            <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22C17.5 22 22 17.5 22 12C22 11.3 21.9 10.7 21.7 10.1L17 10.1C16.4 10.1 15.9 10.6 15.9 11.2C15.9 11.8 16.4 12.3 17 12.3L20.6 12.3C19.9 16.9 16.2 20.6 11.6 21.3V17.7C11.6 17.1 11.1 16.6 10.5 16.6C9.9 16.6 9.4 17.1 9.4 17.7V21.3C4.8 20.6 1.1 16.9 0.4 12.3H4C4.6 12.3 5.1 11.8 5.1 11.2C5.1 10.6 4.6 10.1 4 10.1H0.4C1.1 5.5 4.8 1.8 9.4 1.1V4.7C9.4 5.3 9.9 5.8 10.5 5.8C11.1 5.8 11.6 5.3 11.6 4.7V1.1C11.7 1.1 11.8 1.1 11.9 1.1" stroke="currentColor" stroke-width="2"/>
          </svg>
          Generate from Image
        </button>
        
        <div v-if="generatedPalette.length > 0" class="generated-palette">
          <h4 class="palette-title">Generated Palette</h4>
          <div class="palette-colors">
            <button 
              v-for="(color, index) in generatedPalette"
              :key="index"
              class="palette-color"
              :style="{ backgroundColor: color }"
              @click="applyGeneratedColor(color, index)"
              :title="`Apply ${color} as ${index === 0 ? 'primary' : 'secondary'} color`"
            ></button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <h3 class="section-title">Dark/Light Mode</h3>
      <p class="section-description">
        Toggle between dark and light interface themes
      </p>
      
      <div class="mode-toggle">
        <label class="toggle-label">
          <input 
            type="checkbox" 
            :checked="isDarkMode"
            @change="toggleDarkMode"
            class="toggle-input" 
          />
          <span class="toggle-slider"></span>
          <span>{{ isDarkMode ? 'Dark Mode' : 'Light Mode' }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '../../stores/appStore'

const store = useAppStore()

// Reactive state for custom colors and features
const customPrimary = ref('#8B5CF6')
const customSecondary = ref('#A78BFA')
const generatedPalette = ref([])
const isDarkMode = ref(true) // Default to dark mode

// Theme definitions with enhanced color palettes
const themes = [
  {
    key: 'purple',
    name: 'Purple',
    colors: {
      primary: '#8B5CF6',
      secondary: '#A78BFA',
      accent: '#DDD6FE'
    }
  },
  {
    key: 'blue',
    name: 'Ocean Blue',
    colors: {
      primary: '#3B82F6',
      secondary: '#60A5FA',
      accent: '#DBEAFE'
    }
  },
  {
    key: 'green',
    name: 'Forest Green',
    colors: {
      primary: '#10B981',
      secondary: '#34D399',
      accent: '#D1FAE5'
    }
  },
  {
    key: 'pink',
    name: 'Cherry Pink',
    colors: {
      primary: '#EC4899',
      secondary: '#F472B6',
      accent: '#FCE7F3'
    }
  },
  {
    key: 'orange',
    name: 'Sunset Orange',
    colors: {
      primary: '#F97316',
      secondary: '#FB923C',
      accent: '#FED7AA'
    }
  },
  {
    key: 'dark',
    name: 'Midnight',
    colors: {
      primary: '#4B5563',
      secondary: '#6B7280',
      accent: '#D1D5DB'
    }
  }
]

/**
 * Apply a theme by updating CSS custom properties
 * @param {string} themeKey - The key of the theme to apply
 */
function setTheme(themeKey) {
  store.currentTheme = themeKey
  const theme = themes.find(t => t.key === themeKey)
  if (theme) {
    // Update CSS custom properties for immediate visual feedback
    document.documentElement.style.setProperty('--color-primary', theme.colors.primary)
    document.documentElement.style.setProperty('--color-secondary', theme.colors.secondary)
    
    // Update custom color inputs to match selected theme
    customPrimary.value = theme.colors.primary
    customSecondary.value = theme.colors.secondary
  }
}

/**
 * Update custom colors and apply them immediately
 * @param {string} type - Either 'primary' or 'secondary'
 * @param {string} color - The hex color value
 */
function updateCustomColor(type, color) {
  document.documentElement.style.setProperty(`--color-${type}`, color)
  
  // Update reactive state
  if (type === 'primary') {
    customPrimary.value = color
  } else {
    customSecondary.value = color
  }
  
  // Set theme to custom when user picks custom colors
  store.currentTheme = 'custom'
}

/**
 * Generate color palette from uploaded image using Canvas API
 * This is a placeholder implementation - in a real app you'd use a more sophisticated
 * color extraction library like Vibrant.js or similar
 * @param {Event} event - The file input change event
 */
function generatePaletteFromImage(event) {
  const file = event.target.files[0]
  if (!file) return
  
  // Create a temporary image and canvas for color extraction
  const img = new Image()
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  img.onload = function() {
    // Resize canvas for faster processing
    canvas.width = 150
    canvas.height = 150
    
    // Draw image to canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    
    // Extract colors (simplified implementation)
    const colors = extractColorsFromCanvas(canvas, ctx)
    generatedPalette.value = colors
    
    // Clean up
    URL.revokeObjectURL(img.src)
  }
  
  img.src = URL.createObjectURL(file)
}

/**
 * Simplified color extraction from canvas
 * In a production app, you'd want to use a more sophisticated algorithm
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx 
 * @returns {string[]} Array of hex color strings
 */
function extractColorsFromCanvas(canvas, ctx) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  const colorCounts = {}
  
  // Sample every 10th pixel to improve performance
  for (let i = 0; i < data.length; i += 40) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const alpha = data[i + 3]
    
    // Skip transparent pixels
    if (alpha < 125) continue
    
    // Convert to hex
    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
    colorCounts[hex] = (colorCounts[hex] || 0) + 1
  }
  
  // Sort by frequency and return top 6 colors
  return Object.entries(colorCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6)
    .map(([color]) => color)
}

/**
 * Apply a generated color as primary or secondary
 * @param {string} color - The hex color to apply
 * @param {number} index - The index determines if it's primary (0) or secondary (>0)
 */
function applyGeneratedColor(color, index) {
  if (index === 0) {
    updateCustomColor('primary', color)
  } else {
    updateCustomColor('secondary', color)
  }
}

/**
 * Toggle between dark and light mode
 * This updates the CSS custom properties for background and text colors
 */
function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value
  
  if (isDarkMode.value) {
    // Dark mode colors
    document.documentElement.style.setProperty('--color-bg-dark', '#1a1a1a')
    document.documentElement.style.setProperty('--color-text-primary', '#ffffff')
    document.documentElement.style.setProperty('--color-text-secondary', '#e5e5e5')
    document.documentElement.style.setProperty('--color-border', 'rgba(255, 255, 255, 0.1)')
  } else {
    // Light mode colors
    document.documentElement.style.setProperty('--color-bg-dark', '#ffffff')
    document.documentElement.style.setProperty('--color-text-primary', '#1a1a1a')
    document.documentElement.style.setProperty('--color-text-secondary', '#374151')
    document.documentElement.style.setProperty('--color-border', 'rgba(0, 0, 0, 0.1)')
  }
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
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.section-description {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.theme-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-radius: var(--border-radius-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.theme-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--color-text-primary);
  transform: translateY(-2px);
}

.theme-card.active {
  background: rgba(139, 92, 246, 0.2);
  border-color: var(--color-primary);
  color: var(--color-text-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.theme-preview {
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
}

.color-swatch {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.theme-name {
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

.color-inputs {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.color-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.color-input {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
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

/* New palette generation styles */
.palette-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.palette-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: var(--border-radius-sm);
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed var(--color-border);
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.palette-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--color-primary);
  color: var(--color-text-primary);
  transform: translateY(-1px);
}

.generated-palette {
  padding: 16px;
  border-radius: var(--border-radius-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
}

.palette-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.palette-colors {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.palette-color {
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-sm);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.palette-color:hover {
  border-color: var(--color-primary);
  transform: scale(1.1);
  box-shadow: var(--shadow-md);
}

/* Dark/Light mode toggle styles */
.mode-toggle {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.toggle-input {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: var(--border-radius-full);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--color-border);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.toggle-input:checked + .toggle-slider {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.toggle-input:checked + .toggle-slider::before {
  transform: translateX(20px);
  background: var(--color-text-primary);
}

/* Responsive styles */
@media (max-width: 480px) {
  .theme-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .theme-card {
    padding: 12px;
  }
  
  .color-swatch {
    width: 16px;
    height: 16px;
  }
  
  .theme-name {
    font-size: 11px;
  }
  
  .color-label {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .color-input {
    align-self: flex-end;
  }
  
  .palette-colors {
    gap: 6px;
  }
  
  .palette-color {
    width: 28px;
    height: 28px;
  }
}
</style>