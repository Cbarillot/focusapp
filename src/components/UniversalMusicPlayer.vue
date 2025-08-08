<template>
  <div class="universal-music-player">
    <!-- Platform Selection -->
    <div class="platform-selector">
      <button 
        v-for="platform in platforms"
        :key="platform.key"
        class="platform-btn"
        :class="{ active: store.currentPlatform === platform.key }"
        @click="selectPlatform(platform.key)"
        :title="platform.name"
      >
        <component :is="platform.icon" />
        <span>{{ platform.name }}</span>
      </button>
    </div>
    
    <!-- URL Input -->
    <div class="url-input-section">
      <input 
        v-model="currentUrl"
        type="text"
        :placeholder="`Enter ${getCurrentPlatform()?.name} URL...`"
        class="url-input"
        @keyup.enter="loadMusic"
      />
      <button @click="loadMusic" class="load-btn">
        <PlayIcon />
      </button>
    </div>
    
    <!-- Error Message -->
    <div v-if="errorMessage" class="error-message">
      <AlertIcon />
      <span>{{ errorMessage }}</span>
      <button @click="errorMessage = ''" class="error-close">×</button>
    </div>
    
    <!-- Player Section -->
    <div v-if="currentTrackData" class="player-section">
      <div class="track-info">
        <div class="track-title">{{ currentTrackData.title }}</div>
        <div class="track-platform">{{ getCurrentPlatform()?.name }}</div>
      </div>
      
      <!-- Embedded Player -->
      <div class="player-container">
        <div v-if="embedSupported" class="embed-player">
          <!-- YouTube Embed -->
          <iframe 
            v-if="store.currentPlatform === 'youtube' && youtubeVideoId"
            :src="`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&loop=1&playlist=${youtubeVideoId}&controls=1`"
            frameborder="0"
            allowfullscreen
            allow="autoplay; encrypted-media"
            class="youtube-embed"
          ></iframe>
          
          <!-- Spotify Embed -->
          <iframe 
            v-if="store.currentPlatform === 'spotify' && spotifyId"
            :src="`https://open.spotify.com/embed/${spotifyId.type}/${spotifyId.id}?utm_source=generator&autoplay=1`"
            frameborder="0"
            allowfullscreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            class="spotify-embed"
          ></iframe>
          
          <!-- SoundCloud Embed -->
          <iframe 
            v-if="store.currentPlatform === 'soundcloud' && soundcloudUrl"
            :src="`https://w.soundcloud.com/player/?url=${encodeURIComponent(soundcloudUrl)}&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`"
            frameborder="0"
            class="soundcloud-embed"
          ></iframe>
        </div>
        
        <!-- Fallback External Link -->
        <div v-else class="external-player">
          <p>Embedded player not available for this content.</p>
          <button @click="openExternal" class="external-btn">
            <ExternalIcon />
            Open in {{ getCurrentPlatform()?.name }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Quick Access Presets -->
    <div class="presets-section">
      <h4>Quick Access</h4>
      <div class="preset-grid">
        <button 
          v-for="preset in currentPresets"
          :key="preset.id"
          class="preset-item"
          @click="loadPreset(preset)"
        >
          <component :is="getCurrentPlatform()?.icon" />
          <span>{{ preset.title }}</span>
        </button>
      </div>
    </div>
    
    <!-- Add Custom Asset Zone -->
    <div class="custom-asset-zone">
      <button class="add-asset-btn" @click="showAssetUpload = true">
        <PlusIcon />
        <span>Add Music Source</span>
      </button>
      
      <!-- Asset Upload Modal (simplified) -->
      <div v-if="showAssetUpload" class="asset-upload-overlay" @click="showAssetUpload = false">
        <div class="asset-upload-modal" @click.stop>
          <h3>Add Music Source</h3>
          <p>Upload your own music files or add streaming links</p>
          <input type="file" accept="audio/*" @change="uploadLocalMusic" />
          <button @click="showAssetUpload = false">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAppStore } from '../stores/appStore'

const store = useAppStore()

// Reactive state
const currentUrl = ref('')
const errorMessage = ref('')
const currentTrackData = ref(null)
const youtubeVideoId = ref('')
const spotifyId = ref(null)
const soundcloudUrl = ref('')
const embedSupported = ref(true)
const showAssetUpload = ref(false)

// Platform definitions
const platforms = [
  {
    key: 'youtube',
    name: 'YouTube',
    icon: 'YoutubeIcon',
    regex: /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
    embedTemplate: 'https://www.youtube.com/embed/{id}'
  },
  {
    key: 'spotify',
    name: 'Spotify',
    icon: 'SpotifyIcon',
    regex: /spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/,
    embedTemplate: 'https://open.spotify.com/embed/{type}/{id}'
  },
  {
    key: 'soundcloud',
    name: 'SoundCloud',
    icon: 'SoundcloudIcon',
    regex: /soundcloud\.com\/[\w-]+\/[\w-]+/,
    embedTemplate: null // Uses direct URL
  },
  {
    key: 'deezer',
    name: 'Deezer',
    icon: 'DeezerIcon',
    regex: /deezer\.com\/(track|album|playlist)\/(\d+)/,
    embedTemplate: null // Limited embed support
  }
]

// Presets for each platform
const presets = {
  youtube: [
    { id: 'jfKfPfyJRdk', title: 'Lofi Hip Hop Radio', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' },
    { id: 'DWcJFNfaw9c', title: 'Café Jazz', url: 'https://www.youtube.com/watch?v=DWcJFNfaw9c' },
    { id: '4xDzrJKXOOY', title: 'Classical Focus', url: 'https://www.youtube.com/watch?v=4xDzrJKXOOY' },
    { id: '5yx6BWlEVcY', title: 'Nature Sounds', url: 'https://www.youtube.com/watch?v=5yx6BWlEVcY' }
  ],
  spotify: [
    { id: 'playlist-37i9dQZF1DX0XUsuxWHRQd', title: 'Chill Lofi Study Beats', url: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd' },
    { id: 'playlist-37i9dQZF1DWZeKCadgRdKQ', title: 'Deep Focus', url: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ' }
  ],
  soundcloud: [
    { id: 'chillhop', title: 'Chillhop Music', url: 'https://soundcloud.com/chillhopmusi' },
    { id: 'lofigirlstudy', title: 'Lofi Girl Study', url: 'https://soundcloud.com/lofi-girl' }
  ],
  deezer: []
}

// Computed properties
const getCurrentPlatform = () => platforms.find(p => p.key === store.currentPlatform)
const currentPresets = computed(() => presets[store.currentPlatform] || [])

// Methods
function selectPlatform(platformKey) {
  store.currentPlatform = platformKey
  currentUrl.value = store.musicLinks[platformKey] || ''
  clearCurrentTrack()
}

function loadMusic() {
  if (!currentUrl.value) {
    showError('Please enter a valid URL')
    return
  }
  
  const platform = getCurrentPlatform()
  if (!platform) {
    showError('Invalid platform selected')
    return
  }
  
  try {
    parseAndLoadUrl(currentUrl.value, platform)
  } catch (error) {
    showError(`Error loading music: ${error.message}`)
  }
}

function parseAndLoadUrl(url, platform) {
  clearError()
  
  switch (platform.key) {
    case 'youtube':
      const ytMatch = url.match(platform.regex)
      if (ytMatch) {
        youtubeVideoId.value = ytMatch[1]
        currentTrackData.value = {
          title: `YouTube Video: ${youtubeVideoId.value}`,
          url: url
        }
        embedSupported.value = true
        store.musicPlaying = true
      } else {
        showError('Invalid YouTube URL')
      }
      break
      
    case 'spotify':
      const spotifyMatch = url.match(platform.regex)
      if (spotifyMatch) {
        spotifyId.value = { type: spotifyMatch[1], id: spotifyMatch[2] }
        currentTrackData.value = {
          title: `Spotify ${spotifyMatch[1]}: ${spotifyMatch[2]}`,
          url: url
        }
        embedSupported.value = true
        store.musicPlaying = true
      } else {
        showError('Invalid Spotify URL')
      }
      break
      
    case 'soundcloud':
      if (url.includes('soundcloud.com')) {
        soundcloudUrl.value = url
        currentTrackData.value = {
          title: 'SoundCloud Track',
          url: url
        }
        embedSupported.value = true
        store.musicPlaying = true
      } else {
        showError('Invalid SoundCloud URL')
      }
      break
      
    case 'deezer':
      // Deezer has limited embed support, fallback to external
      currentTrackData.value = {
        title: 'Deezer Track',
        url: url
      }
      embedSupported.value = false
      store.musicPlaying = true
      break
      
    default:
      showError('Platform not supported yet')
  }
  
  // Save to store
  store.currentTrack = url
  store.musicLinks[platform.key] = url
}

function loadPreset(preset) {
  currentUrl.value = preset.url
  loadMusic()
}

function openExternal() {
  if (currentTrackData.value?.url) {
    window.open(currentTrackData.value.url, '_blank')
  }
}

function uploadLocalMusic(event) {
  const file = event.target.files[0]
  if (file) {
    // Handle local file upload (simplified)
    currentTrackData.value = {
      title: file.name,
      url: URL.createObjectURL(file)
    }
    embedSupported.value = false
    showAssetUpload.value = false
    store.musicPlaying = true
  }
}

function clearCurrentTrack() {
  currentTrackData.value = null
  youtubeVideoId.value = ''
  spotifyId.value = null
  soundcloudUrl.value = ''
  embedSupported.value = true
  store.musicPlaying = false
}

function showError(message) {
  errorMessage.value = message
  setTimeout(() => errorMessage.value = '', 5000)
}

function clearError() {
  errorMessage.value = ''
}

// Watch for platform changes
watch(() => store.currentPlatform, (newPlatform) => {
  currentUrl.value = store.musicLinks[newPlatform] || ''
})
</script>

<script>
// Icon Components
const YoutubeIcon = {
  template: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
}

const SpotifyIcon = {
  template: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/></svg>`
}

const SoundcloudIcon = {
  template: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M1.175 12.225c-.051 0-.094.046-.094.105l-.053 2.164.053 2.169c0 .059.043.105.094.105s.094-.046.094-.105l.06-2.169-.06-2.164c0-.059-.043-.105-.094-.105zm1.33.576c-.059 0-.103.046-.103.105l-.047 1.588.047 1.608c0 .059.044.105.103.105.06 0 .104-.046.104-.105l.053-1.608-.053-1.588c0-.059-.044-.105-.104-.105zm1.269-.402c-.064 0-.115.046-.115.109l-.044 1.987.044 2.055c0 .063.051.109.115.109s.115-.046.115-.109l.05-2.055-.05-1.987c0-.063-.051-.109-.115-.109zm1.286-.339c-.069 0-.125.046-.125.109l-.041 2.326.041 2.295c0 .063.056.109.125.109.07 0 .126-.046.126-.109l.046-2.295-.046-2.326c0-.063-.056-.109-.126-.109zm1.308-.576c-.074 0-.134.051-.134.115l-.037 2.902.037 2.664c0 .064.06.115.134.115.075 0 .135-.051.135-.115l.041-2.664-.041-2.902c0-.064-.06-.115-.135-.115zm1.306-.664c-.079 0-.143.055-.143.125l-.035 3.566.035 2.553c0 .07.064.125.143.125.08 0 .144-.055.144-.125l.039-2.553-.039-3.566c0-.07-.064-.125-.144-.125zm1.277-.814c-.083 0-.151.059-.151.134l-.032 4.38.032 2.427c0 .075.068.134.151.134.084 0 .152-.059.152-.134l.036-2.427-.036-4.38c0-.075-.068-.134-.152-.134zm1.28-1.094c-.089 0-.16.063-.16.143l-.03 5.474.03 2.316c0 .08.071.143.16.143s.161-.063.161-.143l.033-2.316-.033-5.474c0-.08-.072-.143-.161-.143zm1.307-2.293c-.096 0-.174.071-.174.159l-.027 7.767.027 2.194c0 .088.078.159.174.159.097 0 .175-.071.175-.159l.03-2.194-.03-7.767c0-.088-.078-.159-.175-.159zm1.251.758c-.102 0-.185.075-.185.167l-.025 7.009.025 2.131c0 .092.083.167.185.167.103 0 .186-.075.186-.167l.028-2.131-.028-7.009c0-.092-.083-.167-.186-.167zm1.258-1.155c-.108 0-.196.079-.196.177l-.023 8.164.023 2.068c0 .098.088.177.196.177.109 0 .197-.079.197-.177l.026-2.068-.026-8.164c0-.098-.088-.177-.197-.177zm1.295-2.139c-.114 0-.207.083-.207.186l-.021 10.303.021 2.005c0 .103.093.186.207.186.115 0 .208-.083.208-.186l.023-2.005-.023-10.303c0-.103-.093-.186-.208-.186zm1.276-.763c-.121 0-.219.087-.219.194l-.019 11.066.019 1.942c0 .107.098.194.219.194.122 0 .22-.087.22-.194l.021-1.942-.021-11.066c0-.107-.098-.194-.22-.194zm1.264-1.077c-.127 0-.23.091-.23.203l-.017 12.143.017 1.879c0 .112.103.203.23.203.128 0 .231-.091.231-.203l.019-1.879-.019-12.143c0-.112-.103-.203-.231-.203zm1.247-1.269c-.133 0-.241.095-.241.212l-.015 13.412.015 1.816c0 .117.108.212.241.212.134 0 .242-.095.242-.212l.017-1.816-.017-13.412c0-.117-.108-.212-.242-.212zm1.221-1.202c-.139 0-.252.099-.252.221l-.013 14.614.013 1.753c0 .122.113.221.252.221.14 0 .253-.099.253-.221l.015-1.753-.015-14.614c0-.122-.113-.221-.253-.221zm1.186-1.089c-.145 0-.263.103-.263.229l-.011 15.703.011 1.69c0 .126.118.229.263.229.146 0 .264-.103.264-.229l.013-1.69-.013-15.703c0-.126-.118-.229-.264-.229zm1.157-1.136c-.151 0-.274.107-.274.238l-.009 16.839.009 1.627c0 .131.123.238.274.238.152 0 .275-.107.275-.238l.01-1.627-.01-16.839c0-.131-.123-.238-.275-.238z"/></svg>`
}

const DeezerIcon = {
  template: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.81 12.74h3.98v1.49h-3.98v-1.49zm0-2.98h3.98v1.49h-3.98V9.76zm0-2.98h3.98v1.49h-3.98V6.78zm0 8.94h3.98v1.49h-3.98v-1.49zm-5.97-8.94h3.98v1.49h-3.98V6.78zm0 2.98h3.98v1.49h-3.98V9.76zm0 2.98h3.98v1.49h-3.98v-1.49zm0 2.98h3.98v1.49h-3.98v-1.49zm-5.97-8.94h3.98v1.49H6.87V9.76zm0 2.98h3.98v1.49H6.87v-1.49zm0 2.98h3.98v1.49H6.87v-1.49zm-5.97 0H4.9v1.49H.9v-1.49z"/></svg>`
}

const PlayIcon = {
  template: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 3l14 9-14 9V3z" fill="currentColor"/></svg>`
}

const ExternalIcon = {
  template: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m4-3h6v6m-11 5L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
}

const PlusIcon = {
  template: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14m-7-7h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
}

const AlertIcon = {
  template: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
}

export default {
  components: {
    YoutubeIcon,
    SpotifyIcon,
    SoundcloudIcon,
    DeezerIcon,
    PlayIcon,
    ExternalIcon,
    PlusIcon,
    AlertIcon
  }
}
</script>

<style scoped>
.universal-music-player {
  color: var(--color-text-primary);
}

.platform-selector {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.platform-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: var(--border-radius-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.platform-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
}

.platform-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-primary);
}

.url-input-section {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.url-input {
  flex: 1;
  padding: 12px 16px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
  font-size: 14px;
}

.url-input:focus {
  border-color: var(--color-primary);
  background: rgba(255, 255, 255, 0.1);
}

.load-btn {
  padding: 12px 16px;
  border-radius: var(--border-radius-sm);
  background: var(--color-primary);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.load-btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--border-radius-sm);
  color: #FCA5A5;
  font-size: 14px;
  margin-bottom: 24px;
}

.error-close {
  margin-left: auto;
  background: transparent;
  color: inherit;
  font-size: 18px;
  font-weight: bold;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.player-section {
  margin-bottom: 32px;
}

.track-info {
  margin-bottom: 16px;
}

.track-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.track-platform {
  font-size: 12px;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  font-weight: 500;
}

.player-container {
  border-radius: var(--border-radius-md);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
}

.embed-player {
  width: 100%;
  min-height: 200px;
}

.youtube-embed,
.spotify-embed,
.soundcloud-embed {
  width: 100%;
  height: 300px;
  border-radius: var(--border-radius-sm);
}

.soundcloud-embed {
  height: 166px;
}

.external-player {
  padding: 32px;
  text-align: center;
  color: var(--color-text-secondary);
}

.external-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  margin: 16px auto 0;
  border-radius: var(--border-radius-md);
  background: var(--color-primary);
  color: var(--color-text-primary);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.external-btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.presets-section {
  margin-bottom: 32px;
}

.presets-section h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.preset-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--border-radius-sm);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 13px;
  text-align: left;
  transition: all var(--transition-fast);
}

.preset-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-text-primary);
  border-color: rgba(255, 255, 255, 0.2);
}

.custom-asset-zone {
  border: 2px dashed var(--color-border);
  border-radius: var(--border-radius-md);
  padding: 24px;
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
  margin: 0 auto;
}

.add-asset-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
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
  background: var(--color-bg-dark);
  border-radius: var(--border-radius-lg);
  padding: 32px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.asset-upload-modal h3 {
  margin: 0 0 16px 0;
  color: var(--color-text-primary);
}

.asset-upload-modal p {
  margin: 0 0 24px 0;
  color: var(--color-text-secondary);
  font-size: 14px;
}

/* Responsive */
@media (max-width: 768px) {
  .platform-selector {
    justify-content: center;
  }
  
  .url-input-section {
    flex-direction: column;
  }
  
  .preset-grid {
    grid-template-columns: 1fr;
  }
  
  .youtube-embed,
  .spotify-embed,
  .soundcloud-embed {
    height: 200px;
  }
}
</style>