<template>
  <div class="music-settings">
    <!-- Deezer Integration -->
    <div class="section">
      <h3 class="section-title">Deezer Music</h3>
      <p class="section-description">Connect to your Deezer account and control your playlists.</p>
      
      <div class="deezer-section">
        <div class="deezer-login" v-if="!deezerConnected">
          <button @click="connectDeezer" class="connect-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="currentColor"/>
            </svg>
            Connect to Deezer
          </button>
          <p class="connect-description">Sign in with your Deezer account to access your playlists and control music playback.</p>
        </div>
        
        <div class="deezer-player" v-else>
          <div class="player-header">
            <div class="now-playing">
              <div class="track-info">
                <h4 class="track-title">{{ currentTrack.title || 'No track selected' }}</h4>
                <p class="artist-name">{{ currentTrack.artist || '' }}</p>
              </div>
              <div class="album-art" v-if="currentTrack.albumArt">
                <img :src="currentTrack.albumArt" alt="Album art" />
              </div>
            </div>
            
            <div class="player-controls">
              <button @click="previousTrack" class="control-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 4L20 12L6 20V4Z" fill="currentColor" transform="rotate(180 12 12)"/>
                  <rect x="4" y="4" width="2" height="16" fill="currentColor"/>
                </svg>
              </button>
              
              <button @click="togglePlayPause" class="control-btn play-pause">
                <svg v-if="!isPlaying" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                  <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
                </svg>
              </button>
              
              <button @click="nextTrack" class="control-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 4L20 12L6 20V4Z" fill="currentColor"/>
                  <rect x="18" y="4" width="2" height="16" fill="currentColor"/>
                </svg>
              </button>
            </div>
            
            <div class="volume-control">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M19.07 4.93A10 10 0 0 1 19.07 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <input 
                type="range" 
                min="0" 
                max="100" 
                v-model="volume"
                @input="updateVolume"
                class="volume-slider"
              />
            </div>
          </div>
          
          <div class="playlist-section">
            <h4 class="playlist-title">My Playlists</h4>
            <div class="playlist-grid">
              <div 
                v-for="playlist in deezerPlaylists"
                :key="playlist.id"
                class="playlist-card"
                :class="{ active: currentPlaylist?.id === playlist.id }"
                @click="selectPlaylist(playlist)"
              >
                <div class="playlist-cover">
                  <img :src="playlist.picture_medium" :alt="playlist.title" />
                  <div class="play-overlay">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                    </svg>
                  </div>
                </div>
                <div class="playlist-info">
                  <h5 class="playlist-name">{{ playlist.title }}</h5>
                  <p class="track-count">{{ playlist.nb_tracks }} tracks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Mini Player for Fullscreen Mode -->
        <div v-if="store.isFullscreen && isPlaying" class="mini-player">
          <div class="mini-track-info">
            <span class="mini-track-title">{{ currentTrack.title }}</span>
            <span class="mini-artist">{{ currentTrack.artist }}</span>
          </div>
          <div class="mini-controls">
            <button @click="togglePlayPause" class="mini-control-btn">
              <svg v-if="!isPlaying" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Universal Music Component -->
    <div class="section">
      <UniversalMusic />
    </div>
    
    <!-- YouTube Music (Legacy Support) -->
    <div class="section">
      <h3 class="section-title">YouTube Music</h3>
      
      <div class="youtube-section">
        <div class="input-group">
          <input 
            v-model="youtubeUrl"
            type="text"
            placeholder="Enter YouTube URL or search term"
            class="youtube-input"
            @keyup.enter="loadYouTube"
          />
          <button @click="loadYouTube" class="load-btn">Load</button>
        </div>
        
        <div v-if="currentVideoId" class="youtube-player">
          <iframe 
            :src="`https://www.youtube.com/embed/${currentVideoId}?enablejsapi=1&autoplay=1&loop=1&playlist=${currentVideoId}`"
            frameborder="0"
            allowfullscreen
            allow="autoplay; encrypted-media"
            class="youtube-iframe"
          ></iframe>
        </div>
        
        <div class="youtube-presets">
          <h4 class="presets-title">Popular Focus Music</h4>
          <div class="preset-grid">
            <button 
              v-for="preset in youtubePresets"
              :key="preset.id"
              class="preset-btn"
              @click="loadPreset(preset.id)"
            >
              {{ preset.title }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Local Music -->
    <div class="section">
      <h3 class="section-title">Local Music</h3>
      
      <div class="local-music-section">
        <input 
          type="file"
          ref="fileInput"
          accept="audio/*"
          @change="loadLocalMusic"
          style="display: none"
        />
        
        <button @click="$refs.fileInput.click()" class="file-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Upload Audio File
        </button>
        
        <audio 
          v-if="localAudioSrc"
          :src="localAudioSrc"
          controls
          class="audio-player"
        ></audio>
      </div>
    </div>
    
    <!-- Music Settings -->
    <div class="section">
      <h3 class="section-title">Music Settings</h3>
      
      <div class="settings-group">
        <label class="toggle-label">
          <input type="checkbox" class="toggle-input" />
          <span class="toggle-slider"></span>
          <span>Auto-play music when timer starts</span>
        </label>
        
        <label class="toggle-label">
          <input type="checkbox" class="toggle-input" />
          <span class="toggle-slider"></span>
          <span>Fade out music during breaks</span>
        </label>
        
        <label class="toggle-label">
          <input type="checkbox" class="toggle-input" />
          <span class="toggle-slider"></span>
          <span>Loop current track</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '../../stores/appStore'
import UniversalMusic from '../UniversalMusic.vue'

const store = useAppStore()

// Deezer integration
const deezerConnected = ref(false)
const isPlaying = ref(false)
const volume = ref(70)
const currentTrack = ref({
  title: '',
  artist: '',
  albumArt: ''
})
const currentPlaylist = ref(null)
const deezerPlaylists = ref([
  // Mock data - in real implementation, this would come from Deezer API
  {
    id: 1,
    title: 'Focus Beats',
    picture_medium: 'https://via.placeholder.com/150x150/8B5CF6/FFFFFF?text=Focus',
    nb_tracks: 25
  },
  {
    id: 2,
    title: 'Chill Lofi',
    picture_medium: 'https://via.placeholder.com/150x150/10B981/FFFFFF?text=Lofi',
    nb_tracks: 18
  },
  {
    id: 3,
    title: 'Study Piano',
    picture_medium: 'https://via.placeholder.com/150x150/F59E0B/FFFFFF?text=Piano',
    nb_tracks: 32
  }
])

// YouTube integration
const youtubeUrl = ref('')
const currentVideoId = ref('')
const localAudioSrc = ref('')

const youtubePresets = [
  { id: 'zhDwjnYZiCo', title: 'Lofi Study', url: 'https://www.youtube.com/live/zhDwjnYZiCo?si=ZuFZCpaBymXSSoQG' },
  { id: 'Rik8YhvH09M', title: 'Home Cosy Ambiance', url: 'https://youtu.be/Rik8YhvH09M?si=1ZLAf8IbMfZ4Zlh3' },
  { id: 'kfZyQ4K2vcw', title: 'Forest Witch Ambiance', url: 'https://youtu.be/kfZyQ4K2vcw?si=_8pTMJePBKbLMmkU' },
  { id: '0L38Z9hIi5s', title: 'Coffee Piano Ambiance', url: 'https://youtu.be/0L38Z9hIi5s?si=l48HxC1vUNXa4rFG' },
  { id: 'PMMGwSJsHfU', title: 'Medieval Village', url: 'https://youtu.be/PMMGwSJsHfU?si=egnG7zejirdD1Zk8' },
  { id: 'XFGgeltLaks', title: 'Hogwarts Music', url: 'https://youtu.be/XFGgeltLaks?si=QvQEv9OV1owmTpnt' }
]

function loadYouTube() {
  if (youtubeUrl.value) {
    // Extract video ID from YouTube URL or use as search term
    const videoId = extractYouTubeId(youtubeUrl.value)
    if (videoId) {
      currentVideoId.value = videoId
      store.currentTrack = youtubeUrl.value
      store.musicPlaying = true
    } else {
      // For simplicity, use the first preset if not a valid URL
      currentVideoId.value = youtubePresets[0].id
    }
  }
}

function extractYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

function loadPreset(videoId) {
  currentVideoId.value = videoId
  youtubeUrl.value = `https://www.youtube.com/watch?v=${videoId}`
  store.currentTrack = youtubeUrl.value
  store.musicPlaying = true
}

function loadLocalMusic(event) {
  const file = event.target.files[0]
  if (file) {
    localAudioSrc.value = URL.createObjectURL(file)
    store.currentTrack = file.name
    store.musicPlaying = true
  }
}

// Deezer functions
function connectDeezer() {
  // In a real implementation, this would initiate OAuth flow with Deezer
  // For demo purposes, we'll simulate connection
  deezerConnected.value = true
  // Mock current track
  currentTrack.value = {
    title: 'Lofi Study Session',
    artist: 'ChillBeats',
    albumArt: 'https://via.placeholder.com/60x60/8B5CF6/FFFFFF?text=♪'
  }
}

function togglePlayPause() {
  isPlaying.value = !isPlaying.value
  store.musicPlaying = isPlaying.value
}

function nextTrack() {
  // Mock next track functionality
  console.log('Next track')
}

function previousTrack() {
  // Mock previous track functionality  
  console.log('Previous track')
}

function updateVolume() {
  store.volume = volume.value / 100
}

function selectPlaylist(playlist) {
  currentPlaylist.value = playlist
  // Mock playlist selection
  currentTrack.value = {
    title: `Playing from ${playlist.title}`,
    artist: 'Various Artists',
    albumArt: playlist.picture_medium
  }
}
</script>

<style scoped>
.music-settings {
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

.section-description {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: var(--color-text-secondary);
}

/* Deezer Integration Styles */
.deezer-section {
  border-radius: var(--border-radius-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.deezer-login {
  padding: 32px;
  text-align: center;
}

.connect-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: #FF6600; /* Deezer orange */
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.connect-btn:hover {
  background: #E55A00;
  transform: translateY(-2px);
}

.connect-description {
  margin-top: 16px;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.deezer-player {
  padding: 20px;
}

.player-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border);
}

.now-playing {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.track-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: var(--color-text-primary);
}

.track-info p {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.album-art {
  width: 50px;
  height: 50px;
  border-radius: var(--border-radius-sm);
  overflow: hidden;
}

.album-art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.player-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.control-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-full);
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

.control-btn.play-pause {
  width: 48px;
  height: 48px;
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
}

.volume-slider {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
}

.playlist-section {
  margin-top: 20px;
}

.playlist-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: var(--color-text-primary);
}

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
}

.playlist-card {
  cursor: pointer;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}

.playlist-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.playlist-card.active {
  border-color: var(--color-primary);
  background: rgba(139, 92, 246, 0.1);
}

.playlist-cover {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
}

.playlist-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.playlist-card:hover .play-overlay {
  opacity: 1;
}

.playlist-info {
  padding: 12px;
}

.playlist-name {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-count {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
}

/* Mini Player for Fullscreen */
.mini-player {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-md);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 1000;
  border: 1px solid var(--color-border);
}

.mini-track-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mini-track-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mini-artist {
  font-size: 12px;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mini-controls {
  display: flex;
  align-items: center;
}

.mini-control-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--border-radius-full);
  border: none;
  background: var(--color-primary);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mini-control-btn:hover {
  background: var(--color-primary-dark);
  transform: scale(1.05);
}

.youtube-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  gap: 8px;
}

.youtube-input {
  flex: 1;
  padding: 12px 16px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
  font-size: 14px;
}

.youtube-input:focus {
  border-color: var(--color-primary);
  background: rgba(255, 255, 255, 0.1);
}

.youtube-input::placeholder {
  color: var(--color-text-muted);
}

.load-btn {
  padding: 12px 20px;
  border-radius: var(--border-radius-sm);
  background: var(--color-primary);
  color: var(--color-text-primary);
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.load-btn:hover {
  background: var(--color-primary-dark);
}

.youtube-player {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
}

.youtube-iframe {
  width: 100%;
  height: 100%;
}

.youtube-presets {
  margin-top: 8px;
}

.presets-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
}

.preset-btn {
  padding: 8px 12px;
  border-radius: var(--border-radius-sm);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 12px;
  transition: all var(--transition-fast);
}

.preset-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
}

.local-music-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.file-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border-radius: var(--border-radius-md);
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed var(--color-border);
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.file-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--color-primary);
  color: var(--color-text-primary);
}

.audio-player {
  width: 100%;
  height: 40px;
  border-radius: var(--border-radius-sm);
}

.settings-group {
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

/* Responsive */
@media (max-width: 480px) {
  .input-group {
    flex-direction: column;
  }
  
  .preset-grid {
    grid-template-columns: 1fr;
  }
  
  .toggle-label {
    font-size: 13px;
  }
}
</style>