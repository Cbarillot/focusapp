<template>
  <div class="music-settings">
    <!-- Streaming Services Integration -->
    <div class="section">
      <h3 class="section-title">Streaming Services</h3>
      <p class="section-description">
        Connect your favorite music streaming services for ambient focus music
      </p>
      
      <div class="streaming-services">
        <button class="service-card spotify" @click="connectSpotify">
          <div class="service-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.959-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.361 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </div>
          <div class="service-info">
            <h4>Spotify</h4>
            <p>{{ spotifyConnected ? 'Connected' : 'Connect to access your playlists' }}</p>
          </div>
          <div class="service-status" :class="{ connected: spotifyConnected }">
            {{ spotifyConnected ? '✓' : '+' }}
          </div>
        </button>
        
        <button class="service-card deezer" @click="connectDeezer">
          <div class="service-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.81 12.74h-3.27v1.45h3.27v-1.45zm0-2.36h-3.27v1.45h3.27V10.38zm0-2.36h-3.27v1.45h3.27V8.02zm-4.09 6.17h-3.27v1.45h3.27v-1.45zm0-2.36h-3.27v1.45h3.27v-1.45zm0-2.36h-3.27v1.45h3.27V9.47zm0-2.36h-3.27v1.45h3.27V7.11zm-4.09 9.44h-3.27v1.45h3.27v-1.45zm0-2.36h-3.27v1.45h3.27v-1.45zm0-2.36h-3.27v1.45h3.27v-1.45zm0-2.36h-3.27v1.45h3.27V9.47zm0-2.36h-3.27v1.45h3.27V7.11z"/>
            </svg>
          </div>
          <div class="service-info">
            <h4>Deezer</h4>
            <p>{{ deezerConnected ? 'Connected' : 'Connect to access your music' }}</p>
          </div>
          <div class="service-status" :class="{ connected: deezerConnected }">
            {{ deezerConnected ? '✓' : '+' }}
          </div>
        </button>
      </div>
    </div>
    
    <!-- YouTube Music Integration -->
    <div class="section">
      <h3 class="section-title">YouTube Music</h3>
      <p class="section-description">
        Play ambient focus music directly from YouTube
      </p>
      
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
      <p class="section-description">
        Upload your own audio files for focus sessions
      </p>
      
      <div class="local-music-section">
        <input 
          type="file"
          ref="fileInput"
          accept="audio/*"
          multiple
          @change="loadLocalMusic"
          style="display: none"
        />
        
        <button @click="$refs.fileInput.click()" class="file-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Upload Audio Files
        </button>
        
        <!-- Placeholder for future local music library -->
        <div v-if="localTracks.length > 0" class="local-tracks">
          <h4 class="tracks-title">Your Music Library</h4>
          <div class="track-list">
            <div 
              v-for="track in localTracks"
              :key="track.id"
              class="track-item"
              :class="{ playing: currentTrack?.id === track.id }"
              @click="playTrack(track)"
            >
              <div class="track-info">
                <span class="track-name">{{ track.name }}</span>
                <span class="track-duration">{{ track.duration }}</span>
              </div>
              <button class="track-play-btn">
                <svg v-if="currentTrack?.id === track.id && store.musicPlaying" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16"/>
                  <rect x="14" y="4" width="4" height="16"/>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5,3 19,12 5,21"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
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
      <p class="section-description">
        Configure how music integrates with your focus sessions
      </p>
      
      <div class="settings-group">
        <label class="toggle-label">
          <input 
            type="checkbox" 
            v-model="musicSettings.autoPlay"
            class="toggle-input" 
          />
          <span class="toggle-slider"></span>
          <span>Auto-play music when timer starts</span>
        </label>
        
        <label class="toggle-label">
          <input 
            type="checkbox" 
            v-model="musicSettings.fadeOnBreak"
            class="toggle-input" 
          />
          <span class="toggle-slider"></span>
          <span>Fade out music during breaks</span>
        </label>
        
        <label class="toggle-label">
          <input 
            type="checkbox" 
            v-model="musicSettings.loopTrack"
            class="toggle-input" 
          />
          <span class="toggle-slider"></span>
          <span>Loop current track</span>
        </label>
        
        <label class="volume-label">
          <span>Master Volume</span>
          <div class="volume-container">
            <input 
              type="range"
              min="0"
              max="1"
              step="0.1"
              v-model="musicSettings.volume"
              class="volume-slider"
            />
            <span class="volume-value">{{ Math.round(musicSettings.volume * 100) }}%</span>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAppStore } from '../../stores/appStore'

const store = useAppStore()

// Component state
const youtubeUrl = ref('')
const currentVideoId = ref('')
const localAudioSrc = ref('')
const spotifyConnected = ref(false) // Placeholder for Spotify connection status
const deezerConnected = ref(false)  // Placeholder for Deezer connection status
const currentTrack = ref(null)
const localTracks = ref([]) // Local music library

// Music settings configuration
const musicSettings = reactive({
  autoPlay: true,
  fadeOnBreak: false,
  loopTrack: false,
  volume: 0.7
})

// YouTube music presets for focus/ambient music
const youtubePresets = [
  { id: 'dQw4w9WgXcQ', title: 'Lofi Hip Hop' },
  { id: 'jfKfPfyJRdk', title: 'Café Jazz' },
  { id: '4xDzrJKXOOY', title: 'Classical Focus' },
  { id: '5yx6BWlEVcY', title: 'Nature Sounds' },
  { id: 'lTRiuFIWV54', title: 'Ambient Space' },
  { id: 'hHW1oY26kxQ', title: 'Study Piano' }
]

/**
 * Load YouTube video by URL or search term
 * Extracts video ID from URL or falls back to first preset
 */
function loadYouTube() {
  if (youtubeUrl.value) {
    const videoId = extractYouTubeId(youtubeUrl.value)
    if (videoId) {
      currentVideoId.value = videoId
      store.currentTrack = youtubeUrl.value
      store.musicPlaying = true
    } else {
      // Fallback to first preset if URL is invalid
      currentVideoId.value = youtubePresets[0].id
    }
  }
}

/**
 * Extract YouTube video ID from various URL formats
 * @param {string} url - YouTube URL
 * @returns {string|null} Video ID or null if invalid
 */
function extractYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

/**
 * Load a YouTube preset by video ID
 * @param {string} videoId - YouTube video ID
 */
function loadPreset(videoId) {
  currentVideoId.value = videoId
  youtubeUrl.value = `https://www.youtube.com/watch?v=${videoId}`
  store.currentTrack = youtubeUrl.value
  store.musicPlaying = true
}

/**
 * Handle local music file upload
 * Supports multiple files and creates a local music library
 * @param {Event} event - File input change event
 */
function loadLocalMusic(event) {
  const files = Array.from(event.target.files)
  
  files.forEach(file => {
    const url = URL.createObjectURL(file)
    const track = {
      id: Date.now() + Math.random(), // Simple ID generation
      name: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
      url: url,
      file: file,
      duration: '00:00', // Placeholder - would be calculated from audio metadata
      type: 'local'
    }
    
    localTracks.value.push(track)
    
    // Set as current audio source if it's the first upload
    if (files.indexOf(file) === 0) {
      localAudioSrc.value = url
      currentTrack.value = track
      store.currentTrack = track.name
      store.musicPlaying = true
    }
  })
}

/**
 * Play a specific track from the local library
 * @param {Object} track - Track object
 */
function playTrack(track) {
  currentTrack.value = track
  localAudioSrc.value = track.url
  store.currentTrack = track.name
  store.musicPlaying = true
}

/**
 * Connect to Spotify (placeholder implementation)
 * In a real app, this would initiate OAuth flow
 */
function connectSpotify() {
  if (spotifyConnected.value) {
    // Disconnect
    spotifyConnected.value = false
    console.log('Disconnected from Spotify')
  } else {
    // Placeholder for Spotify Web API integration
    console.log('Initiating Spotify connection...')
    
    // Simulate connection process
    setTimeout(() => {
      spotifyConnected.value = true
      console.log('Connected to Spotify')
      
      // TODO: Implement actual Spotify Web API integration
      // This would involve:
      // 1. OAuth 2.0 authorization flow
      // 2. Access token management
      // 3. Playlist and track fetching
      // 4. Playback control through Spotify Web Playback SDK
    }, 1500)
  }
}

/**
 * Connect to Deezer (placeholder implementation)
 * In a real app, this would initiate Deezer API connection
 */
function connectDeezer() {
  if (deezerConnected.value) {
    // Disconnect
    deezerConnected.value = false
    console.log('Disconnected from Deezer')
  } else {
    // Placeholder for Deezer API integration
    console.log('Initiating Deezer connection...')
    
    // Simulate connection process
    setTimeout(() => {
      deezerConnected.value = true
      console.log('Connected to Deezer')
      
      // TODO: Implement actual Deezer API integration
      // This would involve:
      // 1. OAuth 2.0 authorization flow with Deezer
      // 2. Access token management
      // 3. User's music library access
      // 4. Track streaming (note: Deezer has limitations for web playback)
    }, 1500)
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

/* Streaming Services Styles */
.streaming-services {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.service-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: var(--border-radius-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  text-align: left;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.service-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.service-card.spotify:hover {
  border-color: #1db954;
}

.service-card.deezer:hover {
  border-color: #ff6600;
}

.service-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-md);
  background: rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.spotify .service-icon {
  background: rgba(29, 185, 84, 0.2);
  color: #1db954;
}

.deezer .service-icon {
  background: rgba(255, 102, 0, 0.2);
  color: #ff6600;
}

.service-info {
  flex: 1;
}

.service-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.service-info p {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.service-status {
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-full);
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.service-status.connected {
  background: var(--color-primary);
  color: var(--color-text-primary);
}

/* YouTube Section Styles */
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
  transform: translateY(-1px);
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
  transform: translateY(-1px);
}

/* Local Music Styles */
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
  transform: translateY(-1px);
}

.local-tracks {
  margin-top: 16px;
}

.tracks-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.track-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.track-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: var(--border-radius-sm);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.track-item:hover,
.track-item.playing {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--color-primary);
}

.track-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.track-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.track-duration {
  font-size: 12px;
  color: var(--color-text-muted);
}

.track-play-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-full);
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.track-play-btn:hover {
  background: var(--color-primary);
  color: var(--color-text-primary);
  transform: scale(1.1);
}

.audio-player {
  width: 100%;
  height: 40px;
  border-radius: var(--border-radius-sm);
}

/* Settings Group Styles */
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

/* Volume Slider Styles */
.volume-label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.volume-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.volume-slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: none;
}

.volume-value {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-primary);
  min-width: 40px;
  text-align: right;
}

/* Responsive */
@media (max-width: 480px) {
  .input-group {
    flex-direction: column;
  }
  
  .preset-grid {
    grid-template-columns: 1fr;
  }
  
  .toggle-label,
  .volume-label {
    font-size: 13px;
  }
  
  .service-card {
    padding: 12px;
    gap: 12px;
  }
  
  .service-icon {
    width: 40px;
    height: 40px;
  }
  
  .service-info h4 {
    font-size: 14px;
  }
  
  .service-info p {
    font-size: 12px;
  }
}
</style>