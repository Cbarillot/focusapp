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
            value="#8B5CF6"
            class="color-input"
            @input="updateCustomColor('primary', $event.target.value)"
          />
        </label>
        
        <label class="color-label">
          <span>Secondary Color</span>
          <input 
            type="color" 
            value="#A78BFA"
            class="color-input"
            @input="updateCustomColor('secondary', $event.target.value)"
          />
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '../../stores/appStore'

const store = useAppStore()

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

function setTheme(themeKey) {
  store.currentTheme = themeKey
  const theme = themes.find(t => t.key === themeKey)
  if (theme) {
    // Update CSS custom properties
    document.documentElement.style.setProperty('--color-primary', theme.colors.primary)
    document.documentElement.style.setProperty('--color-secondary', theme.colors.secondary)
  }
}

function updateCustomColor(type, color) {
  document.documentElement.style.setProperty(`--color-${type}`, color)
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
}

.theme-card.active {
  background: rgba(139, 92, 246, 0.2);
  border-color: var(--color-primary);
  color: var(--color-text-primary);
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

/* Responsive */
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
}
</style>