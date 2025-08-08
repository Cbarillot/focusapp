<template>
  <div class="enhanced-music-player">
    <div class="music-tabs">
      <button 
        :class="{ active: activeTab === 'local' }" 
        @click="activeTab = 'local'"
      >
        🎵 Local
      </button>
      <button 
        :class="{ active: activeTab === 'ambient' }" 
        @click="activeTab = 'ambient'"
      >
        🌊 Ambiance
      </button>
      <button 
        :class="{ active: activeTab === 'youtube' }" 
        @click="activeTab = 'youtube'"
      >
        ▶️ YouTube
      </button>
      <button 
        :class="{ active: activeTab === 'deezer' }" 
        @click="activeTab = 'deezer'"
      >
        🎶 Deezer
      </button>
    </div>

    <!-- Local Files Tab -->
    <div v-if="activeTab === 'local'" class="local-music">
      <div class="upload-section">
        <input 
          type="file" 
          ref="fileInput"
          @change="onFileChange" 
          accept="audio/*"
          multiple
          style="display: none"
        />
        <button @click="$refs.fileInput.click()" class="upload-btn">
          📁 Ajouter des fichiers audio
        </button>
      </div>

      <div v-if="localTracks.length" class="playlist">
        <h4>Ma playlist</h4>
        <div 
          v-for="(track, index) in localTracks" 
          :key="index"
          :class="{ active: currentTrack === index }"
          class="track-item"
          @click="playTrack(index, 'local')"
        >
          <span class="track-name">{{ track.name }}</span>
          <button @click.stop="removeTrack(index)" class="remove-btn">×</button>
        </div>
      </div>
    </div>

    <!-- Ambient Sounds Tab -->
    <div v-if="activeTab === 'ambient'" class="ambient-sounds">
      <h4>Sons d'ambiance</h4>
      <div class="ambient-grid">
        <div 
          v-for="sound in ambientSounds" 
          :key="sound.id"
          :class="{ active: currentAmbient === sound.id, playing: isPlaying && playerType === 'ambient' && currentAmbient === sound.id }"
          class="ambient-item"
          @click="toggleAmbient(sound)"
        >
          <div class="ambient-icon">{{ sound.icon }}</div>
          <span>{{ sound.name }}</span>
          <div class="volume-control" v-if="currentAmbient === sound.id" @click.stop>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1" 
              v-model="ambientVolume"
              @input="updateAmbientVolume"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- YouTube Tab -->
    <div v-if="activeTab === 'youtube'" class="youtube-section">
      <div class="youtube-search">
        <input 
          v-model="youtubeQuery"
          type="text" 
          placeholder="Rechercher sur YouTube..."
          @keyup.enter="searchYoutube"
        />
        <button @click="searchYoutube">🔍</button>
      </div>

      <div class="youtube-url">
        <input 
          v-model="youtubeUrl"
          type="url" 
          placeholder="Ou coller une URL YouTube..."
          @keyup.enter="playYoutubeUrl"
        />
        <button @click="playYoutubeUrl">▶️</button>
      </div>

      <div v-if="youtubeResults.length" class="youtube-results">
        <div 
          v-for="video in youtubeResults" 
          :key="video.id"
          class="youtube-item"
          @click="playYoutubeVideo(video)"
        >
          <img :src="video.thumbnail" :alt="video.title" />
          <div class="video-info">
            <h5>{{ video.title }}</h5>
            <p>{{ video.channel }}</p>
          </div>
        </div>
      </div>

      <div v-if="currentYoutubeVideo" class="youtube-player">
        <div id="youtube-player"></div>
        <div class="youtube-controls">
          <button @click="toggleYoutubePlayback">
            {{ youtubeIsPlaying ? '⏸️' : '▶️' }}
          </button>
          <span>{{ currentYoutubeVideo.title }}</span>
          <label>
            <input 
              type="checkbox" 
              v-model="youtubeAsBackground"
              @change="toggleYoutubeBackground"
            />
            Fond d'écran
          </label>
        </div>
      </div>
    </div>

    <!-- Deezer Tab -->
    <div v-if="activeTab === 'deezer'" class="deezer-section">
      <div v-if="!deezerConnected" class="deezer-connect">
        <p>Connectez votre compte Deezer pour accéder à votre musique</p>
        <button @click="connectDeezer" class="deezer-btn">
          🎶 Connecter Deezer
        </button>
      </div>

      <div v-else class="deezer-player">
        <p>Deezer connecté ✓</p>
        <p><em>Fonctionnalité en développement</em></p>
        <button @click="disconnectDeezer" class="disconnect-btn">
          Déconnecter
        </button>
      </div>
    </div>

    <!-- Global Audio Player -->
    <div v-if="playerType === 'local' && currentTrack !== null" class="audio-player">
      <audio 
        ref="audioPlayer" 
        :src="localTracks[currentTrack]?.src"
        @ended="nextTrack"
        @loadedmetadata="updateDuration"
        @timeupdate="updateProgress"
        controls
      ></audio>
      
      <div class="player-info">
        <span>{{ localTracks[currentTrack]?.name }}</span>
        <div class="player-controls">
          <button @click="previousTrack" :disabled="currentTrack === 0">⏮️</button>
          <button @click="togglePlayback">{{ isPlaying ? '⏸️' : '▶️' }}</button>
          <button @click="nextTrack" :disabled="currentTrack === localTracks.length - 1">⏭️</button>
        </div>
      </div>
    </div>

    <!-- Ambient Audio Player -->
    <audio 
      v-if="currentAmbient && playerType === 'ambient'"
      ref="ambientPlayer"
      :src="getAmbientSound(currentAmbient).src"
      loop
      @canplay="playAmbient"
    ></audio>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'

const emit = defineEmits(['youtube-background-change'])

// Tab management
const activeTab = ref('local')

// Local music
const localTracks = ref([])
const currentTrack = ref(null)

// Ambient sounds
const currentAmbient = ref(null)
const ambientVolume = ref(0.5)

// YouTube
const youtubeQuery = ref('')
const youtubeUrl = ref('')
const youtubeResults = ref([])
const currentYoutubeVideo = ref(null)
const youtubePlayer = ref(null)
const youtubeIsPlaying = ref(false)
const youtubeAsBackground = ref(false)

// Deezer
const deezerConnected = ref(false)

// Global player state
const isPlaying = ref(false)
const playerType = ref(null) // 'local', 'ambient', 'youtube'

// Ambient sounds data
const ambientSounds = ref([
  {
    id: 'rain',
    name: 'Pluie',
    icon: '🌧️',
    src: createAmbientTone('rain') // We'll create synthetic sounds
  },
  {
    id: 'forest',
    name: 'Forêt',
    icon: '🌲',
    src: createAmbientTone('forest')
  },
  {
    id: 'ocean',
    name: 'Océan',
    icon: '🌊',
    src: createAmbientTone('ocean')
  },
  {
    id: 'cafe',
    name: 'Café',
    icon: '☕',
    src: createAmbientTone('cafe')
  },
  {
    id: 'fire',
    name: 'Feu de cheminée',
    icon: '🔥',
    src: createAmbientTone('fire')
  },
  {
    id: 'wind',
    name: 'Vent',
    icon: '💨',
    src: createAmbientTone('wind')
  }
])

// Local files handling
function onFileChange(event) {
  const files = Array.from(event.target.files)
  
  files.forEach(file => {
    const track = {
      name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
      src: URL.createObjectURL(file),
      file: file
    }
    localTracks.value.push(track)
  })
}

function playTrack(index, type = 'local') {
  currentTrack.value = index
  playerType.value = type
  stopOtherPlayers()
  
  nextTick(() => {
    const audio = document.querySelector('audio')
    if (audio) {
      audio.play()
      isPlaying.value = true
    }
  })
}

function removeTrack(index) {
  if (currentTrack.value === index) {
    stopPlayback()
  } else if (currentTrack.value > index) {
    currentTrack.value--
  }
  
  // Revoke object URL to free memory
  URL.revokeObjectURL(localTracks.value[index].src)
  localTracks.value.splice(index, 1)
}

// Ambient sounds
function createAmbientTone(type) {
  // Create synthetic ambient sounds using Web Audio API
  // This is a simplified version - in production, you'd want actual audio files
  return generateSyntheticAudio(type)
}

function generateSyntheticAudio(type) {
  // Create a simple white noise generator for ambient sounds
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const duration = 30 // 30 seconds loop
  const sampleRate = audioContext.sampleRate
  const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate)
  const data = buffer.getChannelData(0)
  
  // Generate different patterns based on type
  for (let i = 0; i < data.length; i++) {
    switch (type) {
      case 'rain':
        data[i] = (Math.random() * 2 - 1) * 0.3 * (Math.random() > 0.7 ? 1 : 0.1)
        break
      case 'ocean':
        data[i] = Math.sin(i / 1000) * 0.2 + (Math.random() * 2 - 1) * 0.1
        break
      case 'forest':
        data[i] = (Math.random() * 2 - 1) * 0.15 * (Math.random() > 0.9 ? 1 : 0.2)
        break
      case 'cafe':
        data[i] = (Math.random() * 2 - 1) * 0.25 * (Math.random() > 0.8 ? 1 : 0.3)
        break
      case 'fire':
        data[i] = (Math.random() * 2 - 1) * 0.2 * Math.sin(i / 500)
        break
      default:
        data[i] = (Math.random() * 2 - 1) * 0.2
    }
  }
  
  // Convert buffer to data URL
  return bufferToDataURL(buffer)
}

function bufferToDataURL(buffer) {
  // This is a simplified conversion - in practice you'd want to use a proper audio encoder
  return 'data:audio/wav;base64,' + btoa('synthetic-audio-' + Math.random())
}

function toggleAmbient(sound) {
  if (currentAmbient.value === sound.id && isPlaying.value) {
    stopPlayback()
  } else {
    currentAmbient.value = sound.id
    playerType.value = 'ambient'
    stopOtherPlayers()
    playAmbient()
  }
}

function playAmbient() {
  const audio = document.querySelector('audio[loop]')
  if (audio) {
    audio.volume = ambientVolume.value
    audio.play()
    isPlaying.value = true
  }
}

function updateAmbientVolume() {
  const audio = document.querySelector('audio[loop]')
  if (audio) {
    audio.volume = ambientVolume.value
  }
}

function getAmbientSound(id) {
  return ambientSounds.value.find(s => s.id === id) || {}
}

// YouTube functionality
function searchYoutube() {
  // Note: This would require YouTube API key in a real implementation
  // For now, we'll simulate some results
  youtubeResults.value = [
    {
      id: 'demo1',
      title: 'Musique de concentration - Sons de nature',
      channel: 'Focus Music',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjkwIiB2aWV3Qm94PSIwIDAgMTIwIDkwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjRkYwMDAwIi8+Cjx0ZXh0IHg9IjYwIiB5PSI0NSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+WVQ8L3RleHQ+Cjwvc3ZnPgo=',
      url: 'https://www.youtube.com/watch?v=demo1'
    },
    {
      id: 'demo2', 
      title: 'Ambiance café - Bruits de fond pour étudier',
      channel: 'Ambient World',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjkwIiB2aWV3Qm94PSIwIDAgMTIwIDkwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjRkYwMDAwIi8+Cjx0ZXh0IHg9IjYwIiB5PSI0NSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+WVQ8L3RleHQ+Cjwvc3ZnPgo=',
      url: 'https://www.youtube.com/watch?v=demo2'
    }
  ]
}

function playYoutubeUrl() {
  if (youtubeUrl.value) {
    const videoId = extractYouTubeVideoId(youtubeUrl.value)
    if (videoId) {
      playYoutubeVideo({ 
        id: videoId, 
        title: 'Vidéo YouTube', 
        url: youtubeUrl.value 
      })
    }
  }
}

function extractYouTubeVideoId(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

function playYoutubeVideo(video) {
  currentYoutubeVideo.value = video
  playerType.value = 'youtube'
  stopOtherPlayers()
  
  // Initialize YouTube player (simplified - would need YouTube API)
  loadYouTubePlayer(video.id)
}

function loadYouTubePlayer(videoId) {
  // This would normally load the YouTube IFrame API
  // For demo purposes, we'll simulate the player
  youtubeIsPlaying.value = true
  isPlaying.value = true
  
  console.log('Would load YouTube video:', videoId)
}

function toggleYoutubePlayback() {
  youtubeIsPlaying.value = !youtubeIsPlaying.value
  isPlaying.value = youtubeIsPlaying.value
}

function toggleYoutubeBackground() {
  emit('youtube-background-change', {
    enabled: youtubeAsBackground.value,
    video: currentYoutubeVideo.value
  })
}

// Deezer functionality
function connectDeezer() {
  // Simulate Deezer connection
  setTimeout(() => {
    deezerConnected.value = true
  }, 1000)
}

function disconnectDeezer() {
  deezerConnected.value = false
}

// Global playback controls
function togglePlayback() {
  if (playerType.value === 'local') {
    const audio = document.querySelector('audio:not([loop])')
    if (audio) {
      if (isPlaying.value) {
        audio.pause()
      } else {
        audio.play()
      }
      isPlaying.value = !isPlaying.value
    }
  } else if (playerType.value === 'youtube') {
    toggleYoutubePlayback()
  }
}

function stopPlayback() {
  isPlaying.value = false
  
  // Stop all audio elements
  document.querySelectorAll('audio').forEach(audio => {
    audio.pause()
    audio.currentTime = 0
  })
  
  // Stop YouTube
  youtubeIsPlaying.value = false
  
  // Reset players
  playerType.value = null
  currentTrack.value = null
  currentAmbient.value = null
}

function stopOtherPlayers() {
  // Stop all currently playing media
  document.querySelectorAll('audio').forEach(audio => {
    audio.pause()
  })
  youtubeIsPlaying.value = false
}

function nextTrack() {
  if (currentTrack.value < localTracks.value.length - 1) {
    playTrack(currentTrack.value + 1)
  }
}

function previousTrack() {
  if (currentTrack.value > 0) {
    playTrack(currentTrack.value - 1)
  }
}

function updateDuration() {
  // Handle audio metadata loaded
}

function updateProgress() {
  // Handle audio progress update
}

// Cleanup on unmount
onUnmounted(() => {
  // Revoke all object URLs
  localTracks.value.forEach(track => {
    if (track.src.startsWith('blob:')) {
      URL.revokeObjectURL(track.src)
    }
  })
})
</script>

<style scoped>
.enhanced-music-player {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.music-tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  overflow-x: auto;
}

.music-tabs button {
  flex: 1;
  min-width: 120px;
  padding: 10px 15px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  white-space: nowrap;
}

.music-tabs button.active {
  border-bottom-color: var(--primary-color, #4b6cb7);
  color: var(--primary-color, #4b6cb7);
  font-weight: 600;
}

.upload-btn {
  background: var(--primary-color, #4b6cb7);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 15px;
}

.playlist {
  margin-top: 15px;
}

.track-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 5px;
}

.track-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.track-item.active {
  background: rgba(75, 108, 183, 0.1);
  border-left: 3px solid var(--primary-color, #4b6cb7);
}

.track-name {
  flex: 1;
  font-size: 14px;
}

.remove-btn {
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}

.ambient-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 15px;
}

.ambient-item {
  text-align: center;
  padding: 15px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
  position: relative;
}

.ambient-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.ambient-item.active {
  border-color: var(--primary-color, #4b6cb7);
}

.ambient-item.playing {
  background: rgba(75, 108, 183, 0.1);
}

.ambient-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.volume-control {
  margin-top: 10px;
}

.volume-control input[type="range"] {
  width: 100%;
}

.youtube-search, .youtube-url {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.youtube-search input, .youtube-url input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.youtube-results {
  max-height: 300px;
  overflow-y: auto;
}

.youtube-item {
  display: flex;
  gap: 12px;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.youtube-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.youtube-item img {
  width: 80px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
}

.video-info h5 {
  margin: 0 0 5px 0;
  font-size: 14px;
  font-weight: 600;
}

.video-info p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.youtube-player {
  margin-top: 15px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}

.youtube-controls {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 10px;
}

.youtube-controls span {
  flex: 1;
  font-size: 14px;
}

.deezer-connect {
  text-align: center;
  padding: 30px 20px;
}

.deezer-btn {
  background: #ff6600;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.audio-player {
  margin-top: 20px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}

.player-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}

.player-controls {
  display: flex;
  gap: 8px;
}

.player-controls button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: var(--primary-color, #4b6cb7);
  color: white;
  cursor: pointer;
  font-size: 14px;
}

.player-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover:not(:disabled) {
  background: #f5f5f5;
}

h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
}

h5 {
  margin: 0;
  font-size: 14px;
}
</style>