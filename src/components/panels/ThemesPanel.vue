<template>
  <div class="p-6">
    <div class="space-y-6">
      <!-- Dynamic Themes -->
      <div>
        <h3 class="text-lg font-semibold mb-4 text-white">Thèmes Dynamiques</h3>
        <div class="grid grid-cols-1 gap-3">
          <button
            v-for="theme in themes"
            :key="theme.id"
            @click="applyTheme(theme)"
            class="p-4 rounded-lg border border-white/20 hover:border-white/40 transition-all duration-200 text-left"
            :class="{ 'bg-white/10': currentTheme === theme.id }"
          >
            <div class="flex items-center gap-3">
              <div 
                class="w-8 h-8 rounded-full"
                :style="{ background: theme.preview }"
              ></div>
              <div>
                <div class="text-white font-medium">{{ theme.name }}</div>
                <div class="text-gray-400 text-sm">{{ theme.description }}</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Auto Theme -->
      <div>
        <h3 class="text-lg font-semibold mb-4 text-white">Thème Automatique</h3>
        <div class="space-y-3">
          <label class="flex items-center gap-3">
            <input 
              type="checkbox" 
              v-model="autoTheme.timeBasedEnabled"
              class="rounded bg-white/10 border-white/20 text-blue-500"
            >
            <span class="text-white">Basé sur l'heure</span>
          </label>
          <label class="flex items-center gap-3">
            <input 
              type="checkbox" 
              v-model="autoTheme.weatherBasedEnabled"
              class="rounded bg-white/10 border-white/20 text-blue-500"
            >
            <span class="text-white">Basé sur la météo</span>
          </label>
        </div>
      </div>

      <!-- Custom Theme -->
      <div>
        <h3 class="text-lg font-semibold mb-4 text-white">Thème Personnalisé</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm text-gray-400 mb-2">Couleur principale</label>
            <input 
              type="color" 
              v-model="customTheme.primaryColor"
              class="w-full h-10 rounded border border-white/20 bg-transparent"
            >
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Couleur secondaire</label>
            <input 
              type="color" 
              v-model="customTheme.secondaryColor"
              class="w-full h-10 rounded border border-white/20 bg-transparent"
            >
          </div>
          <button 
            @click="applyCustomTheme"
            class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            Appliquer le thème personnalisé
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const currentTheme = ref('ocean')

const themes = [
  {
    id: 'ocean',
    name: 'Océan',
    description: 'Bleu profond et apaisant',
    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 'forest',
    name: 'Forêt',
    description: 'Verts naturels et relaxants',
    preview: 'linear-gradient(135deg, #2d5016 0%, #a8e6cf 100%)'
  },
  {
    id: 'sunset',
    name: 'Coucher de soleil',
    description: 'Oranges et roses chauds',
    preview: 'linear-gradient(135deg, #ff8a80 0%, #ff6ec7 100%)'
  }
]

const autoTheme = reactive({
  timeBasedEnabled: false,
  weatherBasedEnabled: false
})

const customTheme = reactive({
  primaryColor: '#667eea',
  secondaryColor: '#764ba2'
})

function applyTheme(theme) {
  currentTheme.value = theme.id
  // TODO: Implement theme application logic
  console.log('Applying theme:', theme.name)
}

function applyCustomTheme() {
  // TODO: Implement custom theme application
  console.log('Applying custom theme:', customTheme)
}
</script>