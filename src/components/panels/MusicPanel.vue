<template>
  <div class="p-6">
    <div class="space-y-6">
      <!-- Music Source -->
      <div>
        <h3 class="text-lg font-semibold mb-4 text-white">Source de musique</h3>
        <div class="grid grid-cols-1 gap-3">
          <button
            v-for="source in musicSources"
            :key="source.id"
            @click="currentSource = source.id"
            class="p-4 rounded-lg border border-white/20 hover:border-white/40 transition-all duration-200 text-left"
            :class="{ 'bg-white/10 border-blue-400': currentSource === source.id }"
          >
            <div class="flex items-center gap-3">
              <component :is="source.icon" class="w-6 h-6 text-gray-400" />
              <div>
                <div class="text-white font-medium">{{ source.name }}</div>
                <div class="text-gray-400 text-sm">{{ source.description }}</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Local Music -->
      <div v-if="currentSource === 'local'">
        <h3 class="text-lg font-semibold mb-4 text-white">Fichiers Locaux</h3>
        <div class="space-y-3">
          <input 
            type="file" 
            @change="handleLocalFileUpload"
            multiple
            accept="audio/*"
            class="w-full p-2 bg-white/10 border border-white/20 rounded text-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-600 file:text-white"
          >
          <div v-if="localFiles.length > 0" class="space-y-2">
            <div 
              v-for="(file, index) in localFiles"
              :key="index"
              class="flex items-center justify-between p-2 bg-white/5 rounded"
            >
              <span class="text-white text-sm">{{ file.name }}</span>
              <button 
                @click="playLocalFile(file)"
                class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
              >
                Jouer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- YouTube -->
      <div v-else-if="currentSource === 'youtube'">
        <h3 class="text-lg font-semibold mb-4 text-white">YouTube</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm text-gray-400 mb-2">URL de la playlist YouTube</label>
            <input 
              type="url" 
              v-model="youtubeSettings.playlistUrl"
              placeholder="https://www.youtube.com/playlist?list=..."
              class="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none"
            >
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Ou URL d'une vidéo</label>
            <input 
              type="url" 
              v-model="youtubeSettings.videoUrl"
              placeholder="https://www.youtube.com/watch?v=..."
              class="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none"
            >
          </div>
          <div class="flex items-center gap-3">
            <input 
              type="checkbox" 
              v-model="youtubeSettings.shuffle"
              class="rounded bg-white/10 border-white/20 text-blue-500"
            >
            <span class="text-white">Lecture aléatoire</span>
          </div>
          <div class="flex items-center gap-3">
            <input 
              type="checkbox" 
              v-model="youtubeSettings.loop"
              class="rounded bg-white/10 border-white/20 text-blue-500"
            >
            <span class="text-white">Lecture en boucle</span>
          </div>
          <button 
            @click="loadYouTubePlaylist"
            class="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
          >
            Charger la playlist
          </button>
        </div>
      </div>

      <!-- Deezer -->
      <div v-else-if="currentSource === 'deezer'">
        <h3 class="text-lg font-semibold mb-4 text-white">Deezer</h3>
        <div class="space-y-3">
          <div v-if="!deezerConnected">
            <p class="text-gray-400 mb-3">Connectez-vous à Deezer pour accéder à vos playlists</p>
            <button 
              @click="connectToDeezer"
              class="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium"
            >
              Se connecter à Deezer
            </button>
          </div>
          <div v-else>
            <p class="text-green-400 mb-3">✓ Connecté à Deezer</p>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Vos playlists</label>
              <select 
                v-model="deezerSettings.selectedPlaylist"
                class="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
              >
                <option value="">Sélectionner une playlist</option>
                <option 
                  v-for="playlist in deezerPlaylists"
                  :key="playlist.id"
                  :value="playlist.id"
                >
                  {{ playlist.title }}
                </option>
              </select>
            </div>
            <button 
              @click="disconnectFromDeezer"
              class="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>

      <!-- Volume Control -->
      <div>
        <h3 class="text-lg font-semibold mb-4 text-white">Contrôles Audio</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm text-gray-400 mb-2">Volume ({{ volume }}%)</label>
            <input 
              type="range" 
              v-model="volume"
              min="0" 
              max="100"
              class="w-full accent-blue-500"
            >
          </div>
          <div class="flex items-center gap-3">
            <input 
              type="checkbox" 
              v-model="fadeInOut"
              class="rounded bg-white/10 border-white/20 text-blue-500"
            >
            <span class="text-white">Fondu enchaîné</span>
          </div>
          <div class="flex items-center gap-3">
            <input 
              type="checkbox" 
              v-model="pauseOnTimerEnd"
              class="rounded bg-white/10 border-white/20 text-blue-500"
            >
            <span class="text-white">Mettre en pause à la fin du timer</span>
          </div>
        </div>
      </div>

      <!-- Current Player (if active) -->
      <div v-if="currentTrack" class="bg-white/10 rounded-lg p-4">
        <h4 class="text-white font-medium mb-2">En cours de lecture</h4>
        <div class="flex items-center gap-3">
          <div class="flex-1">
            <div class="text-white text-sm">{{ currentTrack.title }}</div>
            <div class="text-gray-400 text-xs">{{ currentTrack.artist }}</div>
          </div>
          <div class="flex gap-2">
            <button 
              @click="previousTrack"
              class="p-2 bg-white/20 hover:bg-white/30 rounded"
            >
              ⏮
            </button>
            <button 
              @click="togglePlayPause"
              class="p-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              {{ isPlaying ? '⏸' : '▶' }}
            </button>
            <button 
              @click="nextTrack"
              class="p-2 bg-white/20 hover:bg-white/30 rounded"
            >
              ⏭
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// Simple SVG icons as components
const MusicIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM22 16c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"/></svg>`
}

const YoutubeIcon = {
  template: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
}

const DeezerIcon = {
  template: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M18.81 12.74h-1.62v.45h1.62zM9.45 10.8H7.83v.45h1.62zM19.62 9.45h-1.62v.45h1.62zm-3.24-2.7H14.76v.45h1.62zm-3.24 0h-1.62v.45h1.62zM9.9 6.75H8.28v.45H9.9zm4.86 7.65h-1.62v.45h1.62zm3.24-1.35H16.38v.45H18zm1.62-1.35h-1.62v.45h1.62z"/></svg>`
}

const currentSource = ref('local')
const volume = ref(50)
const fadeInOut = ref(true)
const pauseOnTimerEnd = ref(true)
const isPlaying = ref(false)
const currentTrack = ref(null)

const musicSources = [
  {
    id: 'local',
    name: 'Fichiers locaux',
    description: 'Téléchargez vos propres fichiers audio',
    icon: MusicIcon
  },
  {
    id: 'youtube',
    name: 'YouTube',
    description: 'Playlists et vidéos YouTube',
    icon: YoutubeIcon
  },
  {
    id: 'deezer',
    name: 'Deezer',
    description: 'Connexion à votre compte Deezer',
    icon: DeezerIcon
  }
]

const localFiles = ref([])

const youtubeSettings = reactive({
  playlistUrl: '',
  videoUrl: '',
  shuffle: false,
  loop: true
})

const deezerConnected = ref(false)
const deezerPlaylists = ref([])
const deezerSettings = reactive({
  selectedPlaylist: ''
})

function handleLocalFileUpload(event) {
  const files = Array.from(event.target.files)
  localFiles.value = [...localFiles.value, ...files]
}

function playLocalFile(file) {
  currentTrack.value = {
    title: file.name.replace(/\.[^/.]+$/, ''),
    artist: 'Fichier local'
  }
  isPlaying.value = true
  // TODO: Implement actual playback
  console.log('Playing local file:', file.name)
}

function loadYouTubePlaylist() {
  // TODO: Implement YouTube playlist loading
  console.log('Loading YouTube playlist:', youtubeSettings.playlistUrl || youtubeSettings.videoUrl)
}

function connectToDeezer() {
  // TODO: Implement Deezer connection
  console.log('Connecting to Deezer...')
  // Simulate connection
  setTimeout(() => {
    deezerConnected.value = true
    deezerPlaylists.value = [
      { id: '1', title: 'Ma playlist de focus' },
      { id: '2', title: 'Musique relaxante' },
      { id: '3', title: 'Électronique ambiant' }
    ]
  }, 1000)
}

function disconnectFromDeezer() {
  deezerConnected.value = false
  deezerPlaylists.value = []
  deezerSettings.selectedPlaylist = ''
}

function togglePlayPause() {
  isPlaying.value = !isPlaying.value
}

function previousTrack() {
  // TODO: Implement previous track
  console.log('Previous track')
}

function nextTrack() {
  // TODO: Implement next track
  console.log('Next track')
}
</script>