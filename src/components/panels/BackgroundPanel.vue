<template>
  <div class="p-6">
    <div class="space-y-6">
      <!-- Background Type -->
      <div>
        <h3 class="text-lg font-semibold mb-4 text-white">Type d'arrière-plan</h3>
        <div class="grid grid-cols-1 gap-3">
          <button
            v-for="type in backgroundTypes"
            :key="type.id"
            @click="currentType = type.id"
            class="p-4 rounded-lg border border-white/20 hover:border-white/40 transition-all duration-200 text-left"
            :class="{ 'bg-white/10 border-blue-400': currentType === type.id }"
          >
            <div class="flex items-center gap-3">
              <component :is="type.icon" class="w-6 h-6 text-gray-400" />
              <div>
                <div class="text-white font-medium">{{ type.name }}</div>
                <div class="text-gray-400 text-sm">{{ type.description }}</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Dynamic Content Based on Type -->
      <div v-if="currentType === 'gradient'">
        <h3 class="text-lg font-semibold mb-4 text-white">Dégradé Personnalisé</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm text-gray-400 mb-2">Couleur de début</label>
            <input 
              type="color" 
              v-model="gradientSettings.startColor"
              class="w-full h-10 rounded border border-white/20 bg-transparent"
            >
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Couleur de fin</label>
            <input 
              type="color" 
              v-model="gradientSettings.endColor"
              class="w-full h-10 rounded border border-white/20 bg-transparent"
            >
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Direction</label>
            <select 
              v-model="gradientSettings.direction"
              class="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
            >
              <option value="135deg">Diagonal ↘</option>
              <option value="90deg">Vertical ↓</option>
              <option value="0deg">Horizontal →</option>
              <option value="45deg">Diagonal ↗</option>
            </select>
          </div>
        </div>
      </div>

      <div v-else-if="currentType === 'image'">
        <h3 class="text-lg font-semibold mb-4 text-white">Image d'arrière-plan</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm text-gray-400 mb-2">URL de l'image</label>
            <input 
              type="url" 
              v-model="imageSettings.url"
              placeholder="https://example.com/image.jpg"
              class="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none"
            >
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Ou télécharger un fichier</label>
            <input 
              type="file" 
              @change="handleImageUpload"
              accept="image/*"
              class="w-full p-2 bg-white/10 border border-white/20 rounded text-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-600 file:text-white"
            >
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Position</label>
            <select 
              v-model="imageSettings.position"
              class="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
            >
              <option value="center">Centre</option>
              <option value="cover">Couverture</option>
              <option value="contain">Contenir</option>
              <option value="repeat">Répéter</option>
            </select>
          </div>
        </div>
      </div>

      <div v-else-if="currentType === 'video'">
        <h3 class="text-lg font-semibold mb-4 text-white">Vidéo d'arrière-plan</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm text-gray-400 mb-2">URL de la vidéo</label>
            <input 
              type="url" 
              v-model="videoSettings.url"
              placeholder="https://example.com/video.mp4"
              class="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none"
            >
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Ou télécharger un fichier</label>
            <input 
              type="file" 
              @change="handleVideoUpload"
              accept="video/*"
              class="w-full p-2 bg-white/10 border border-white/20 rounded text-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-600 file:text-white"
            >
          </div>
          <div class="flex items-center gap-3">
            <input 
              type="checkbox" 
              v-model="videoSettings.muted"
              class="rounded bg-white/10 border-white/20 text-blue-500"
            >
            <span class="text-white">Muet</span>
          </div>
        </div>
      </div>

      <!-- Overlay Settings -->
      <div>
        <h3 class="text-lg font-semibold mb-4 text-white">Superposition</h3>
        <div class="space-y-3">
          <label class="flex items-center gap-3">
            <input 
              type="checkbox" 
              v-model="overlaySettings.enabled"
              class="rounded bg-white/10 border-white/20 text-blue-500"
            >
            <span class="text-white">Activer la superposition</span>
          </label>
          <div v-if="overlaySettings.enabled" class="space-y-3">
            <div>
              <label class="block text-sm text-gray-400 mb-2">Couleur de la superposition</label>
              <input 
                type="color" 
                v-model="overlaySettings.color"
                class="w-full h-10 rounded border border-white/20 bg-transparent"
              >
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Opacité ({{ overlaySettings.opacity }}%)</label>
              <input 
                type="range" 
                v-model="overlaySettings.opacity"
                min="0" 
                max="100"
                class="w-full accent-blue-500"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Apply Button -->
      <button 
        @click="applyBackground"
        class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
      >
        Appliquer l'arrière-plan
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// Simple SVG icons as components
const GradientIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3V1m0 18v2m8-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2V11z"/></svg>`
}

const ImageIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`
}

const VideoIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>`
}

const currentType = ref('gradient')

const backgroundTypes = [
  {
    id: 'gradient',
    name: 'Dégradé',
    description: 'Dégradé de couleurs personnalisable',
    icon: GradientIcon
  },
  {
    id: 'image',
    name: 'Image',
    description: 'Image personnalisée ou URL',
    icon: ImageIcon
  },
  {
    id: 'video',
    name: 'Vidéo',
    description: 'Vidéo d\'arrière-plan animée',
    icon: VideoIcon
  }
]

const gradientSettings = reactive({
  startColor: '#667eea',
  endColor: '#764ba2',
  direction: '135deg'
})

const imageSettings = reactive({
  url: '',
  file: null,
  position: 'cover'
})

const videoSettings = reactive({
  url: '',
  file: null,
  muted: true
})

const overlaySettings = reactive({
  enabled: false,
  color: '#000000',
  opacity: 20
})

function handleImageUpload(event) {
  const file = event.target.files[0]
  if (file) {
    imageSettings.file = file
    imageSettings.url = URL.createObjectURL(file)
  }
}

function handleVideoUpload(event) {
  const file = event.target.files[0]
  if (file) {
    videoSettings.file = file
    videoSettings.url = URL.createObjectURL(file)
  }
}

function applyBackground() {
  // TODO: Implement background application logic
  console.log('Applying background:', {
    type: currentType.value,
    gradient: gradientSettings,
    image: imageSettings,
    video: videoSettings,
    overlay: overlaySettings
  })
}
</script>