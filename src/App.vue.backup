<template>
  <div class="app">
    <!-- Dynamic Background -->
    <DynamicBackground />
    
    <!-- Main Layout -->
    <div class="main-layout">
      <!-- Central Timer Area -->
      <main class="timer-area" :class="`mode-${store.timerDisplayMode}`">
        <!-- Focus Mode - Full Pomodoro Timer -->
        <div v-if="store.timerDisplayMode === 'focus'" class="timer-container">
          <!-- Mode Tabs -->
          <div class="mode-tabs">
            <button 
              v-for="mode in modes" 
              :key="mode.key"
              class="mode-tab"
              :class="{ active: store.timerMode === mode.key }"
              @click="store.switchMode(mode.key)"
            >
              {{ mode.label }}
            </button>
          </div>
          
          <!-- Timer Display -->
          <div class="timer-display">
            <div class="time">{{ store.displayTime }}</div>
            <div class="timer-controls">
              <button 
                class="control-btn primary"
                @click="store.toggleTimer()"
              >
                {{ store.isRunning ? 'Pause' : 'Start' }}
              </button>
              <button 
                class="control-btn secondary"
                @click="store.resetTimer()"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <!-- Home Mode - Large Digital Clock -->
        <div v-else-if="store.timerDisplayMode === 'home'" class="clock-container">
          <div class="current-time">{{ currentTime }}</div>
          <div class="session-info">
            <span class="session-type">{{ modes.find(m => m.key === store.timerMode)?.label }}</span>
            <span class="session-time">{{ store.displayTime }}</span>
            <div class="session-controls">
              <button 
                class="session-control-btn"
                @click="store.toggleTimer()"
              >
                {{ store.isRunning ? '⏸️' : '▶️' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Ambiance Mode - Complete pomodoro module in top-right -->
        <div v-else-if="store.timerDisplayMode === 'ambiance'" class="ambiance-timer-module">
          <!-- Mode Tabs -->
          <div class="ambiance-mode-tabs">
            <button 
              v-for="mode in modes" 
              :key="mode.key"
              class="ambiance-mode-tab"
              :class="{ active: store.timerMode === mode.key }"
              @click="store.switchMode(mode.key)"
            >
              {{ mode.label.charAt(0) }}
            </button>
          </div>
          
          <!-- Timer Display -->
          <div class="ambiance-timer-display">
            <div class="ambiance-time">{{ store.displayTime }}</div>
            <div class="ambiance-timer-controls">
              <button 
                class="ambiance-control-btn primary"
                @click="store.toggleTimer()"
              >
                <svg v-if="!store.isRunning" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                </svg>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                  <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
                </svg>
              </button>
              <button 
                class="ambiance-control-btn secondary"
                @click="store.resetTimer()"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 7V12L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Settings Button (Ambiance Mode) -->
        <button 
          v-if="store.timerDisplayMode === 'ambiance'"
          class="ambiance-settings-btn"
          @click="openSettings"
          title="Paramètres"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2573 9.77251 19.9887C9.5799 19.7201 9.31074 19.5176 9 19.41C8.69838 19.2769 8.36381 19.2372 8.03941 19.296C7.71502 19.3548 7.41568 19.5095 7.18 19.74L7.12 19.8C6.93425 19.986 6.71368 20.1335 6.47088 20.2341C6.22808 20.3348 5.96783 20.3866 5.705 20.3866C5.44217 20.3866 5.18192 20.3348 4.93912 20.2341C4.69632 20.1335 4.47575 19.986 4.29 19.8C4.10405 19.6143 3.95653 19.3937 3.85588 19.1509C3.75523 18.9081 3.70343 18.6478 3.70343 18.385C3.70343 18.1222 3.75523 17.8619 3.85588 17.6191C3.95653 17.3763 4.10405 17.1557 4.29 16.97L4.35 16.91C4.58054 16.6743 4.73519 16.375 4.794 16.0506C4.85282 15.7262 4.81312 15.3916 4.68 15.09C4.55324 14.7942 4.34276 14.542 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.74269 9.96512 4.01133 9.77251C4.27998 9.5799 4.48249 9.31074 4.59 9C4.72312 8.69838 4.76282 8.36381 4.704 8.03941C4.64519 7.71502 4.49054 7.41568 4.26 7.18L4.2 7.12C4.01405 6.93425 3.86653 6.71368 3.76588 6.47088C3.66523 6.22808 3.61343 5.96783 3.61343 5.705C3.61343 5.44217 3.66523 5.18192 3.76588 4.93912C3.86653 4.69632 4.01405 4.47575 4.2 4.29C4.38575 4.10405 4.60632 3.95653 4.84912 3.85588C5.09192 3.75523 5.35217 3.70343 5.615 3.70343C5.87783 3.70343 6.13808 3.75523 6.38088 3.85588C6.62368 3.95653 6.84425 4.10405 7.03 4.29L7.09 4.35C7.32568 4.58054 7.62502 4.73519 7.94941 4.794C8.27381 4.85282 8.60838 4.81312 8.91 4.68H9C9.29577 4.55324 9.54802 4.34276 9.73563 4.07447C9.92325 3.80618 10.0187 3.49179 10.02 3.17V3C10.02 2.46957 10.2307 1.96086 10.6058 1.58579C10.9809 1.21071 11.4896 1 12.02 1C12.5504 1 13.0591 1.21071 13.4342 1.58579C13.8093 1.96086 14.02 2.46957 14.02 3V3.09C14.0213 3.41179 14.1168 3.72618 14.3044 3.99447C14.492 4.26276 14.7443 4.47324 15.04 4.6C15.3416 4.73312 15.6762 4.77282 16.0006 4.714C16.325 4.65519 16.6243 4.50054 16.86 4.27L16.92 4.21C17.1057 4.02405 17.3263 3.87653 17.5691 3.77588C17.8119 3.67523 18.0722 3.62343 18.335 3.62343C18.5978 3.62343 18.8581 3.67523 19.1009 3.77588C19.3437 3.87653 19.5643 4.02405 19.75 4.21C19.936 4.39575 20.0835 4.61632 20.1841 4.85912C20.2848 5.10192 20.3366 5.36217 20.3366 5.625C20.3366 5.88783 20.2848 6.14808 20.1841 6.39088C20.0835 6.63368 19.936 6.85425 19.75 7.04L19.69 7.1C19.4595 7.33568 19.3048 7.63502 19.246 7.95941C19.1872 8.28381 19.2269 8.61838 19.36 8.92V9C19.4868 9.29577 19.6972 9.54802 19.9655 9.73563C20.2338 9.92325 20.5482 10.0187 20.87 10.02H21C21.5304 10.02 22.0391 10.2307 22.4142 10.6058C22.7893 10.9809 23 11.4896 23 12.02C23 12.5504 22.7893 13.0591 22.4142 13.4342C22.0391 13.8093 21.5304 14.02 21 14.02H20.91C20.5882 14.0213 20.2738 14.1168 20.0055 14.3044C19.7372 14.492 19.5268 14.7443 19.4 15.04V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <!-- Settings Button (Focus/Home Mode) -->
        <button 
          v-if="store.timerDisplayMode !== 'ambiance'"
          class="unified-settings-btn"
          @click="openSettings"
          title="Paramètres"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2573 9.77251 19.9887C9.5799 19.7201 9.31074 19.5176 9 19.41C8.69838 19.2769 8.36381 19.2372 8.03941 19.296C7.71502 19.3548 7.41568 19.5095 7.18 19.74L7.12 19.8C6.93425 19.986 6.71368 20.1335 6.47088 20.2341C6.22808 20.3348 5.96783 20.3866 5.705 20.3866C5.44217 20.3866 5.18192 20.3348 4.93912 20.2341C4.69632 20.1335 4.47575 19.986 4.29 19.8C4.10405 19.6143 3.95653 19.3937 3.85588 19.1509C3.75523 18.9081 3.70343 18.6478 3.70343 18.385C3.70343 18.1222 3.75523 17.8619 3.85588 17.6191C3.95653 17.3763 4.10405 17.1557 4.29 16.97L4.35 16.91C4.58054 16.6743 4.73519 16.375 4.794 16.0506C4.85282 15.7262 4.81312 15.3916 4.68 15.09C4.55324 14.7942 4.34276 14.542 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.74269 9.96512 4.01133 9.77251C4.27998 9.5799 4.48249 9.31074 4.59 9C4.72312 8.69838 4.76282 8.36381 4.704 8.03941C4.64519 7.71502 4.49054 7.41568 4.26 7.18L4.2 7.12C4.01405 6.93425 3.86653 6.71368 3.76588 6.47088C3.66523 6.22808 3.61343 5.96783 3.61343 5.705C3.61343 5.44217 3.66523 5.18192 3.76588 4.93912C3.86653 4.69632 4.01405 4.47575 4.2 4.29C4.38575 4.10405 4.60632 3.95653 4.84912 3.85588C5.09192 3.75523 5.35217 3.70343 5.615 3.70343C5.87783 3.70343 6.13808 3.75523 6.38088 3.85588C6.62368 3.95653 6.84425 4.10405 7.03 4.29L7.09 4.35C7.32568 4.58054 7.62502 4.73519 7.94941 4.794C8.27381 4.85282 8.60838 4.81312 8.91 4.68H9C9.29577 4.55324 9.54802 4.34276 9.73563 4.07447C9.92325 3.80618 10.0187 3.49179 10.02 3.17V3C10.02 2.46957 10.2307 1.96086 10.6058 1.58579C10.9809 1.21071 11.4896 1 12.02 1C12.5504 1 13.0591 1.21071 13.4342 1.58579C13.8093 1.96086 14.02 2.46957 14.02 3V3.09C14.0213 3.41179 14.1168 3.72618 14.3044 3.99447C14.492 4.26276 14.7443 4.47324 15.04 4.6C15.3416 4.73312 15.6762 4.77282 16.0006 4.714C16.325 4.65519 16.6243 4.50054 16.86 4.27L16.92 4.21C17.1057 4.02405 17.3263 3.87653 17.5691 3.77588C17.8119 3.67523 18.0722 3.62343 18.335 3.62343C18.5978 3.62343 18.8581 3.67523 19.1009 3.77588C19.3437 3.87653 19.5643 4.02405 19.75 4.21C19.936 4.39575 20.0835 4.61632 20.1841 4.85912C20.2848 5.10192 20.3366 5.36217 20.3366 5.625C20.3366 5.88783 20.2848 6.14808 20.1841 6.39088C20.0835 6.63368 19.936 6.85425 19.75 7.04L19.69 7.1C19.4595 7.33568 19.3048 7.63502 19.246 7.95941C19.1872 8.28381 19.2269 8.61838 19.36 8.92V9C19.4868 9.29577 19.6972 9.54802 19.9655 9.73563C20.2338 9.92325 20.5482 10.0187 20.87 10.02H21C21.5304 10.02 22.0391 10.2307 22.4142 10.6058C22.7893 10.9809 23 11.4896 23 12.02C23 12.5504 22.7893 13.0591 22.4142 13.4342C22.0391 13.8093 21.5304 14.02 21 14.02H20.91C20.5882 14.0213 20.2738 14.1168 20.0055 14.3044C19.7372 14.492 19.5268 14.7443 19.4 15.04V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </main>

      <!-- Left Sidebar (All Modes) -->
      <div class="ambiance-left-sidebar" :class="{ expanded: unifiedLeftExpanded }">
          <!-- Todo Section -->
          <div class="ambiance-sidebar-section">
            <button 
              class="ambiance-sidebar-btn"
              @mouseenter="showTodoPreviewHandler"
              @mouseleave="hideTodoPreview"
              @click="toggleUnifiedLeft"
              title="Tâches"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11L12 14L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="ambiance-task-count" v-if="!unifiedLeftExpanded && incompleteTasks.length > 0">{{ incompleteTasks.length }}</span>
            </button>
            
            <!-- Todo Preview -->
            <div 
              v-if="showTodoPreview && !unifiedLeftExpanded"
              class="ambiance-todo-preview"
              @mouseenter="showTodoPreviewHandler"
              @mouseleave="hideTodoPreview"
            >
              <div class="preview-tasks">
                <div 
                  v-for="task in previewTasks.slice(0, 3)"
                  :key="task.id"
                  class="preview-task"
                  :class="`priority-${task.priority}`"
                >
                  <div class="task-color-dot"></div>
                  <span class="task-preview-text">{{ task.text }}</span>
                </div>
                <div v-if="incompleteTasks.length === 0" class="no-tasks">Aucune tâche</div>
                <div v-if="incompleteTasks.length > 3" class="more-tasks">+{{ incompleteTasks.length - 3 }} autres</div>
              </div>
            </div>
          </div>

          <!-- Music Section -->
          <div class="ambiance-sidebar-section">
            <button 
              class="ambiance-sidebar-btn"
              @mouseenter="showMusicPreviewHandler"
              @mouseleave="hideMusicPreview"
              @click="openMusic"
              title="Musique"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18V5L21 3V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="2"/>
                <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
            
            <!-- Music Preview -->
            <div 
              v-if="showMusicPreview"
              class="ambiance-music-preview"
              @mouseenter="showMusicPreviewHandler"
              @mouseleave="hideMusicPreview"
            >
              <div class="current-track" v-if="store.currentTrack">
                <div class="track-title">{{ store.currentTrack }}</div>
                <div class="track-status">{{ store.musicPlaying ? '▶️ En cours' : '⏸️ En pause' }}</div>
              </div>
              <div v-else class="no-music">Aucune musique</div>
            </div>
          </div>

          <!-- Sound Section -->
          <div class="ambiance-sidebar-section">
            <button 
              class="ambiance-sidebar-btn"
              @mouseenter="showSoundPreviewHandler"
              @mouseleave="hideSoundPreview"
              @click="openSound"
              title="Sons"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15.54 8.46C16.4731 9.39309 17.0018 10.6691 17.0018 11.995C17.0018 13.3209 16.4731 14.5969 15.54 15.53" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            
            <!-- Sound Preview -->
            <div 
              v-if="showSoundPreview"
              class="ambiance-sound-preview"
              @mouseenter="showSoundPreviewHandler"
              @mouseleave="hideSoundPreview"
            >
              <div class="current-sound" v-if="store.currentSound">
                <div class="sound-title">{{ store.currentSound }}</div>
                <div class="sound-status">{{ store.soundPlaying ? '🔊 Actif' : '🔇 Inactif' }}</div>
              </div>
              <div v-else class="no-sound">Aucun son</div>
            </div>
          </div>

          <!-- Expanded Content -->
          <div v-if="unifiedLeftExpanded" class="ambiance-expanded-content">
            <!-- Todo List Interface -->
            <div class="expanded-todo-section">
              <h4>Gestion des Tâches</h4>
              
              <!-- Add Task Form -->
              <div class="add-task-form">
                <input 
                  v-model="newTaskText"
                  @keyup.enter="addNewTask"
                  type="text" 
                  placeholder="Nouvelle tâche..." 
                  class="task-input"
                />
                <div class="task-options">
                  <div class="eisenhower-matrix">
                    <label class="checkbox-label">
                      <input v-model="newTaskUrgent" type="checkbox" />
                      <span>Urgent</span>
                    </label>
                    <label class="checkbox-label">
                      <input v-model="newTaskImportant" type="checkbox" />
                      <span>Important</span>
                    </label>
                  </div>
                  <select v-model="newTaskEstimatedTime" class="time-select">
                    <option value="15">15min</option>
                    <option value="25">25min</option>
                    <option value="30">30min</option>
                    <option value="45">45min</option>
                    <option value="60">1h</option>
                  </select>
                </div>
                <button @click="addNewTask" class="add-task-btn">Ajouter</button>
              </div>

              <!-- Task List -->
              <div class="todo-list">
                <div 
                  v-for="task in incompleteTasks"
                  :key="task.id"
                  class="task-item"
                  :class="getTaskPriorityClass(task)"
                >
                  <button @click="store.toggleTodo(task.id)" class="task-check">
                    <svg v-if="task.completed" width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  
                  <div class="task-info">
                    <span class="task-text">{{ task.text }}</span>
                    <div class="task-meta">
                      <span class="task-time">{{ task.estimatedTime }}min</span>
                      <div class="task-flags">
                        <span v-if="task.urgent" class="flag urgent">U</span>
                        <span v-if="task.important" class="flag important">I</span>
                      </div>
                    </div>
                  </div>
                  
                  <button @click="store.deleteTodo(task.id)" class="task-delete">×</button>
                </div>
                
                <div v-if="incompleteTasks.length === 0" class="no-tasks">
                  Aucune tâche en cours
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Theme Mode Switcher (Bottom Center) -->
        <div class="ambiance-theme-switcher">
          <div class="theme-mode-icons">
            <button 
              class="theme-mode-btn"
              :class="{ active: store.timerDisplayMode === 'home' }"
              @click="store.setTimerDisplayMode('home')"
              title="Mode Home"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 22V12H15V22" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button 
              class="theme-mode-btn"
              :class="{ active: store.timerDisplayMode === 'focus' }"
              @click="store.setTimerDisplayMode('focus')"
              title="Mode Focus"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 18V5"></path>
                <path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"></path>
                <path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"></path>
                <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"></path>
                <path d="M18 18a4 4 0 0 0 2-7.464"></path>
                <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"></path>
                <path d="M6 18a4 4 0 0 1-2-7.464"></path>
                <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"></path>
              </svg>
            </button>
            <button 
              class="theme-mode-btn"
              :class="{ active: store.timerDisplayMode === 'ambiance' }"
              @click="store.setTimerDisplayMode('ambiance')"
              title="Mode Ambiance"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1"></path>
                <circle cx="12" cy="8" r="2"></circle>
                <path d="M12 10v12"></path>
                <path d="M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z"></path>
                <path d="M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- YouTube Widget (appears when music button is clicked) -->
        <div v-if="showYouTubeWidget" class="youtube-widget-container">
          <YouTubeWidget @close="showYouTubeWidget = false" />
        </div>

        <!-- Fullscreen Button (Bottom Right) -->
        <div class="ambiance-fullscreen">
          <button 
            class="ambiance-fullscreen-btn"
            @click="store.toggleFullscreen()"
            title="Plein écran"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V8M21 8V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H16M16 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V16M3 16V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Content area for ambiance and home modes -->
      <main v-if="store.timerDisplayMode !== 'focus'" class="content-area">
        <div class="content-container">
          <!-- Content area is now available for other uses -->
        </div>
      </main>

      <!-- Unified Left Sidebar (All Modes) -->
      <div class="unified-left-sidebar" :class="{ expanded: unifiedLeftExpanded }">
        <!-- Todo Section -->
        <div class="sidebar-section">
          <button 
            class="sidebar-btn"
            @mouseenter="showTodoPreviewHandler"
            @mouseleave="hideTodoPreview"
            @click="toggleUnifiedLeft"
            title="Tâches"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11L12 14L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="task-count" v-if="!unifiedLeftExpanded && incompleteTasks.length > 0">{{ incompleteTasks.length }}</span>
          </button>
        </div>

        <!-- Music Section -->
        <div class="sidebar-section">
          <button 
            class="sidebar-btn"
            @mouseenter="showMusicPreviewHandler"
            @mouseleave="hideMusicPreview"
            @click="openMusic"
            title="Musique"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18V5L21 3V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="2"/>
              <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>

        <!-- Sound Section -->
        <div class="sidebar-section">
          <button 
            class="sidebar-btn"
            @mouseenter="showSoundPreviewHandler"
            @mouseleave="hideSoundPreview"
            @click="openSound"
            title="Sons"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15.54 8.46C16.4731 9.39309 17.0018 10.6691 17.0018 11.995C17.0018 13.3209 16.4731 14.5969 15.54 15.53" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- Fullscreen Button (Ambiance Mode) -->
        <div v-if="store.timerDisplayMode === 'ambiance'" class="ambiance-fullscreen">
          <button 
            class="ambiance-fullscreen-btn"
            @click="store.toggleFullscreen()"
            title="Plein écran"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V8M21 8V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H16M16 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V16M3 16V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- Fullscreen Button (Focus/Home Mode) -->
        <div v-if="store.timerDisplayMode !== 'ambiance'" class="unified-fullscreen">
          <button 
            class="unified-fullscreen-btn"
            @click="store.toggleFullscreen()"
            title="Plein écran"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V8M21 8V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H16M16 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V16M3 16V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Side Panel -->
    <Transition name="slide">
      <div v-if="store.sidebarOpen" class="sidebar" :style="{ width: sidebarWidth + 'px' }">
        <div 
          class="sidebar-resize-handle"
          @mousedown="startResize"
        ></div>
        <SidePanel />
      </div>
    </Transition>
    
    <!-- Sidebar Overlay -->
    <Transition name="fade">
      <div 
        v-if="store.sidebarOpen" 
        class="sidebar-overlay"
        @click="store.toggleSidebar()"
      ></div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick, h } from 'vue'
import { useAppStore } from './stores/appStore'
import DynamicBackground from './components/DynamicBackground.vue'
import SidePanel from './components/SidePanel.vue'
import YouTubeWidget from './components/YouTubeWidget.vue'

const store = useAppStore()

// Sidebar resize functionality
const sidebarWidth = ref(400)
const isResizing = ref(false)

// Current time for home mode
const currentTimeString = ref('')

// Unified mode specific state (all modes use same sidebar system)
const unifiedLeftExpanded = ref(false)
const showTodoPreview = ref(false)
const showMusicPreview = ref(false)
const showSoundPreview = ref(false)
const showYouTubeWidget = ref(false)
let previewTimeouts = {}

const currentTime = computed(() => currentTimeString.value)

// New task form data
const newTaskText = ref('')
const newTaskUrgent = ref(false)
const newTaskImportant = ref(false)
const newTaskEstimatedTime = ref(25)

// Computed properties for tasks
const incompleteTasks = computed(() => {
  return store.todos.filter(task => !task.completed)
})

const previewTasks = computed(() => {
  return incompleteTasks.value.slice(0, 3)
})

// Update current time every second
let timeInterval = null

onMounted(() => {
  updateCurrentTime()
  timeInterval = setInterval(updateCurrentTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

function updateCurrentTime() {
  const now = new Date()
  currentTimeString.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Todo management functions
function addNewTask() {
  if (newTaskText.value.trim()) {
    store.addTodo({
      text: newTaskText.value.trim(),
      urgent: newTaskUrgent.value,
      important: newTaskImportant.value,
      estimatedTime: newTaskEstimatedTime.value
    })
    
    // Reset form
    newTaskText.value = ''
    newTaskUrgent.value = false
    newTaskImportant.value = false
    newTaskEstimatedTime.value = 25
  }
}

function getTaskPriorityClass(task) {
  if (task.urgent && task.important) return 'priority-urgent-important'
  if (!task.urgent && task.important) return 'priority-important'
  if (task.urgent && !task.important) return 'priority-urgent'
  return 'priority-low'
}

// Unified mode functions (used by all timer modes)
function toggleUnifiedLeft() {
  unifiedLeftExpanded.value = !unifiedLeftExpanded.value
}

function showTodoPreviewHandler() {
  clearTimeout(previewTimeouts.todo)
  showTodoPreview.value = true
}

function hideTodoPreview() {
  previewTimeouts.todo = setTimeout(() => {
    showTodoPreview.value = false
  }, 300)
}

function showMusicPreviewHandler() {
  clearTimeout(previewTimeouts.music)
  showMusicPreview.value = true
}

function hideMusicPreview() {
  previewTimeouts.music = setTimeout(() => {
    showMusicPreview.value = false
  }, 300)
}

function showSoundPreviewHandler() {
  clearTimeout(previewTimeouts.sound)
  showSoundPreview.value = true
}

function hideSoundPreview() {
  previewTimeouts.sound = setTimeout(() => {
    showSoundPreview.value = false
  }, 300)
}

function openSettings() {
  store.setActiveTab('timer')
  if (!store.sidebarOpen) {
    store.toggleSidebar()
  }
}

function openMusic() {
  showYouTubeWidget.value = !showYouTubeWidget.value
}

function openSound() {
  store.setActiveTab('sounds')
  if (!store.sidebarOpen) {
    store.toggleSidebar()
  }
}

// Sidebar resize functionality
function startResize(e) {
  isResizing.value = true
  const startX = e.clientX
  const startWidth = sidebarWidth.value

  function doResize(e) {
    if (!isResizing.value) return
    const deltaX = startX - e.clientX
    const newWidth = Math.max(320, Math.min(800, startWidth + deltaX))
    sidebarWidth.value = newWidth
  }

  function stopResize() {
    isResizing.value = false
    document.removeEventListener('mousemove', doResize)
    document.removeEventListener('mouseup', stopResize)
  }

  document.addEventListener('mousemove', doResize)
  document.addEventListener('mouseup', stopResize)
  e.preventDefault()
}

const modes = [
  { key: 'pomodoro', label: 'Pomodoro' },
  { key: 'shortBreak', label: 'Short Break' },
  { key: 'longBreak', label: 'Long Break' }
]
</script>



<style scoped>
.app {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.main-layout {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.app-header {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}

.timer-mode-switcher {
  display: flex;
  gap: 8px;
  padding: 8px;
  border-radius: var(--border-radius-full);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.mode-switcher-btn {
  width: 44px;
  height: 44px;
  border-radius: var(--border-radius-full);
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.mode-switcher-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
  transform: scale(1.05);
}

.mode-switcher-btn.active {
  background: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}


/* Timer Area */
.timer-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 20px 80px;
}

.timer-container {
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.mode-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 60px;
  flex-wrap: wrap;
}

.mode-tab {
  padding: 12px 24px;
  border-radius: var(--border-radius-full);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.mode-tab:hover {
  background: rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 1);
}

.mode-tab.active {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  color: rgba(255, 255, 255, 1);
}

.timer-display {
  margin-bottom: 40px;
}

.time {
  /* Timer display inspired by flocus/app.flocus.com for optimal readability */
  font-family: 'Be Vietnam Pro', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: clamp(5rem, 15vw, 140px);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.04em;
  margin-bottom: 40px;
  color: #fff;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.timer-controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.control-btn {
  padding: 16px 32px;
  border-radius: var(--border-radius-full);
  font-size: 16px;
  font-weight: 600;
  min-width: 120px;
  transition: all var(--transition-fast);
}

.control-btn.primary {
  background: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 1);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.control-btn.primary:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.control-btn.secondary {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.8);
}

.control-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
}

/* Footer - No longer needed as navigation is in corners */
/* Removed .app-footer styles as they're replaced by corner navigation */

/* Sidebar - Resizable panel on right side */
.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px; /* Default width */
  min-width: 320px;
  max-width: 800px;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  z-index: 200;
  overflow-y: auto;
}

.sidebar-resize-handle {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: transparent;
  cursor: ew-resize;
  z-index: 201;
  transition: background-color 0.2s ease;
}

.sidebar-resize-handle:hover,
.sidebar:hover .sidebar-resize-handle {
  background: var(--color-primary);
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 150;
}

/* ========== UNIFIED LAYOUT SYSTEM ========== */

/* Timer Area - Unified across all modes */
.timer-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  transition: all 0.3s ease;
}

.timer-area.mode-focus {
  padding: 100px 20px 80px;
}

.timer-area.mode-home {
  padding: 80px 20px 120px; /* Increased bottom padding to avoid theme switcher */
  align-items: flex-start;
  padding-top: 100px; /* Move clock down more */
}

.timer-area.mode-ambiance {
  padding: 20px;
  align-items: flex-start;
  justify-content: flex-end;
}

/* Ambiance timer module positioning - adjusted to prevent button overflow */
.ambiance-timer-module {
  position: fixed;
  top: 20px;
  right: 90px; /* Moved left to make room for settings button */
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.3);
  min-width: 200px;
}

/* Unified Left Sidebar (All Modes) */
.unified-left-sidebar {
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  width: 48px;
  transition: all 0.3s ease;
}

.unified-left-sidebar.expanded {
  width: 280px;
}

.sidebar-section {
  position: relative;
  margin-bottom: 12px;
}

.sidebar-btn {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-lg);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.sidebar-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateX(4px);
}

.task-count {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* Preview Popups */
.todo-preview,
.music-preview,
.sound-preview {
  position: absolute;
  left: 60px;
  top: 0;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--border-radius-lg);
  padding: 12px;
  min-width: 200px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 110;
}

/* Unified Theme Switcher (Bottom Center) */
.unified-theme-switcher {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

.theme-mode-icons {
  display: flex;
  gap: 8px;
  padding: 8px;
  border-radius: var(--border-radius-full);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.theme-mode-btn {
  width: 44px;
  height: 44px;
  border-radius: var(--border-radius-full);
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.theme-mode-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
  transform: scale(1.05);
}

.theme-mode-btn.active {
  background: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

/* Unified Settings Button (Top Right) */
.unified-settings-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-full);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  cursor: pointer;
  z-index: 100;
}

.unified-settings-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 1);
  transform: scale(1.05);
}

/* Unified Fullscreen Button (Bottom Right) */
.unified-fullscreen {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
}

.unified-fullscreen-btn {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-full);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.unified-fullscreen-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 1);
  transform: translateY(-2px) scale(1.05);
}

/* YouTube Widget Container */
.youtube-widget-container {
  position: fixed;
  bottom: 100px;
  right: 20px;
  z-index: 200;
  animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.ambiance-layout {
  position: relative;
  width: 100%;
  height: 100vh;
}

/* Pomodoro Module (Top-Right) */
.ambiance-pomodoro-module {
  position: fixed;
  top: 20px;
  right: 80px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.3);
  min-width: 200px;
}

.ambiance-mode-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.ambiance-mode-tab {
  width: 28px;
  height: 28px;
  border-radius: var(--border-radius-full);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.8);
  font-size: 10px;
  font-weight: 600;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.ambiance-mode-tab:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
}

.ambiance-mode-tab.active {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  color: rgba(255, 255, 255, 1);
}

.ambiance-timer-display {
  text-align: center;
}

.ambiance-time {
  font-family: 'Be Vietnam Pro', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 24px;
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  -webkit-font-smoothing: antialiased;
}

.ambiance-timer-controls {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.ambiance-control-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--border-radius-full);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.ambiance-control-btn.primary {
  background: rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 1);
}

.ambiance-control-btn.primary:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-1px);
}

.ambiance-control-btn.secondary {
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.8);
}

.ambiance-control-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 1);
}

.ambiance-settings-btn {
  position: fixed;
  top: 20px;
  right: 20px; /* Aligned with fullscreen button */
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-full);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.ambiance-settings-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 1);
  transform: scale(1.05);
}

/* Left Sidebar */
.ambiance-left-sidebar {
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  width: 48px;
  transition: all 0.3s ease;
}

.ambiance-left-sidebar.expanded {
  width: 280px;
}

.ambiance-sidebar-section {
  position: relative;
  margin-bottom: 12px;
}

.ambiance-sidebar-btn {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-lg);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.ambiance-sidebar-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateX(4px);
}

.ambiance-task-count {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* Preview Popups */
.ambiance-todo-preview,
.ambiance-music-preview,
.ambiance-sound-preview {
  position: absolute;
  left: 60px;
  top: 0;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--border-radius-lg);
  padding: 12px;
  min-width: 200px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 110;
}

.preview-tasks {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preview-task {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.task-color-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.preview-task.priority-high .task-color-dot {
  background: #ef4444;
}

.preview-task.priority-medium .task-color-dot {
  background: #f59e0b;
}

.preview-task.priority-low .task-color-dot {
  background: #10b981;
}

.task-preview-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.no-tasks,
.no-music,
.no-sound {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  text-align: center;
  padding: 8px;
}

.more-tasks {
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
  font-style: italic;
  text-align: center;
}

.current-track,
.current-sound {
  text-align: center;
}

.track-title,
.sound-title {
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
}

.track-status,
.sound-status {
  color: rgba(255, 255, 255, 0.7);
  font-size: 10px;
}

/* Expanded Content */
.ambiance-expanded-content {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--border-radius-lg);
  padding: 16px;
  margin-top: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.expanded-todo-section h4 {
  margin: 0 0 16px 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 600;
}

/* Add Task Form */
.add-task-form {
  margin-bottom: 20px;
}

.task-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--border-radius-sm);
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  margin-bottom: 8px;
}

.task-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.task-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 12px;
}

.eisenhower-matrix {
  display: flex;
  gap: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 12px;
  height: 12px;
}

.time-select {
  padding: 4px 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--border-radius-sm);
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  font-size: 11px;
}

.add-task-btn {
  width: 100%;
  padding: 6px 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--border-radius-sm);
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-task-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Task List */
.todo-list {
  max-height: 200px;
  overflow-y: auto;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.task-item:last-child {
  border-bottom: none;
}

.task-check {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.task-info {
  flex: 1;
  min-width: 0;
}

.task-text {
  display: block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.3;
  word-break: break-word;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2px;
}

.task-time {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
}

.task-flags {
  display: flex;
  gap: 2px;
}

.flag {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 2px;
  font-size: 8px;
  font-weight: bold;
  text-align: center;
  line-height: 14px;
}

.flag.urgent {
  background: #ef4444;
  color: white;
}

.flag.important {
  background: #f59e0b;
  color: white;
}

.task-delete {
  width: 20px;
  height: 20px;
  border-radius: 3px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;
}

.task-item:hover .task-delete {
  opacity: 1;
}

.task-delete:hover {
  background: rgba(239, 68, 68, 0.2);
  color: rgba(239, 68, 68, 0.8);
}

/* Priority-based styling */
.priority-urgent-important {
  border-left: 3px solid #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.priority-important {
  border-left: 3px solid #f59e0b;
  background: rgba(245, 158, 11, 0.05);
}

.priority-urgent {
  border-left: 3px solid #ec4899;
  background: rgba(236, 72, 153, 0.05);
}

.priority-low {
  border-left: 3px solid #10b981;
  background: rgba(16, 185, 129, 0.05);
}

/* Deezer Widget Container */
.deezer-widget-container {
  position: fixed;
  bottom: 100px;
  right: 20px;
  z-index: 200;
  animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Theme Mode Switcher (Bottom Center) */
.ambiance-theme-switcher {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

.theme-mode-icons {
  display: flex;
  gap: 8px;
  padding: 8px;
  border-radius: var(--border-radius-full);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.theme-mode-btn {
  width: 44px;
  height: 44px;
  border-radius: var(--border-radius-full);
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.theme-mode-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
  transform: scale(1.05);
}

.theme-mode-btn.active {
  background: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

/* Fullscreen Button (Bottom Right) */
.ambiance-fullscreen {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
}

.ambiance-fullscreen-btn {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-full);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.ambiance-fullscreen-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 1);
  transform: translateY(-2px) scale(1.05);
}

/* Responsive for ambiance mode */
@media (max-width: 768px) {
  .ambiance-pomodoro-module {
    top: 15px;
    right: 15px;
    min-width: 160px;
    padding: 12px;
  }

  .ambiance-time {
    font-size: 18px;
  }

  .ambiance-control-btn {
    width: 32px;
    height: 32px;
  }

  .ambiance-settings-btn {
    right: -45px;
    width: 32px;
    height: 32px;
  }

  .ambiance-left-sidebar {
    left: 15px;
    width: 44px;
  }

  .ambiance-left-sidebar.expanded {
    width: 250px;
  }

  .ambiance-sidebar-btn {
    width: 44px;
    height: 44px;
  }

  .ambiance-todo-preview,
  .ambiance-music-preview,
  .ambiance-sound-preview {
    left: 55px;
    min-width: 180px;
  }

  .ambiance-theme-switcher {
    bottom: 15px;
  }

  .theme-mode-btn {
    width: 40px;
    height: 40px;
  }

  .ambiance-fullscreen {
    bottom: 15px;
    right: 15px;
  }

  .ambiance-fullscreen-btn {
    width: 44px;
    height: 44px;
  }
}

@media (max-width: 480px) {
  .ambiance-pomodoro-module {
    top: 12px;
    right: 12px;
    min-width: 140px;
    padding: 10px;
  }

  .ambiance-time {
    font-size: 16px;
  }

  .ambiance-control-btn {
    width: 28px;
    height: 28px;
  }

  .ambiance-settings-btn {
    right: -40px;
    width: 28px;
    height: 28px;
  }

  .ambiance-left-sidebar {
    left: 12px;
    width: 40px;
  }

  .ambiance-left-sidebar.expanded {
    width: calc(100vw - 80px);
    max-width: 220px;
  }

  .ambiance-sidebar-btn {
    width: 40px;
    height: 40px;
  }

  .ambiance-todo-preview,
  .ambiance-music-preview,
  .ambiance-sound-preview {
    left: 50px;
    min-width: 160px;
  }

  .theme-mode-btn {
    width: 36px;
    height: 36px;
  }

  .ambiance-fullscreen-btn {
    width: 40px;
    height: 40px;
  }
}

/* Home Mode - Digital clock display at top with reduced opacity */
.home-clock {
  position: fixed;
  top: 90px; /* Moved down to avoid overlap with timer mode switcher */
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  opacity: 0.8; /* Slightly increased for better readability */
}

.clock-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px 40px; /* More padding for larger text */
  background: rgba(255, 255, 255, 0.1); /* More subtle background */
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.2); /* More subtle border */
}

.current-time {
  font-size: 72px; /* Larger and bolder like in the reference image */
  font-weight: 900; /* Much bolder */
  color: #fff;
  font-family: 'Be Vietnam Pro', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', monospace;
  letter-spacing: -0.02em;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
  line-height: 1;
}

.session-info {
  display: none; /* Hide session info for minimalist design */
}

.session-type {
  color: var(--color-text-secondary);
  font-weight: 500;
}

.session-time {
  color: var(--color-primary);
  font-weight: 600;
  font-family: 'Be Vietnam Pro', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', monospace;
}

.session-control-btn {
  background: none;
  border: none;
  font-size: 12px;
  cursor: pointer;
  transition: transform 0.2s ease;
  opacity: 0.7;
}

.session-control-btn:hover {
  transform: scale(1.2);
  opacity: 1;
}

/* Content Area for non-focus modes */
.content-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 20px 80px;
}

.content-container {
  max-width: 600px;
  width: 100%;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 100vw;
  }
  
  .app-header {
    top: 15px;
    left: 15px;
    right: 15px;
  }
  
  .timer-mode-switcher {
    padding: 6px;
    gap: 6px;
  }
  
  .mode-switcher-btn {
    width: 40px;
    height: 40px;
  }
  
  .settings-btn {
    width: 44px;
    height: 44px;
  }
  
  .timer-area {
    padding: 80px 20px 60px;
  }
  
  .mode-tabs {
    margin-bottom: 40px;
  }
  
  .mode-tab {
    padding: 10px 20px;
    font-size: 13px;
  }
  
  .control-btn {
    padding: 14px 28px;
    font-size: 15px;
    min-width: 100px;
  }

  /* Mobile responsive for new timer modes */
  .home-clock {
    top: 80px; /* Adjusted for mobile */
  }

  .clock-container {
    padding: 10px 16px;
    gap: 4px;
  }

  .current-time {
    font-size: 24px;
  }

  .session-info {
    gap: 6px;
    font-size: 11px;
  }

  .content-area {
    padding: 100px 15px 80px;
  }
}

@media (max-width: 480px) {
  .app-header {
    top: 12px;
    left: 12px;
    right: 12px;
  }
  
  .timer-mode-switcher {
    padding: 4px;
    gap: 4px;
  }
  
  .mode-switcher-btn {
    width: 36px;
    height: 36px;
  }
  
  .settings-btn {
    width: 40px;
    height: 40px;
  }
  
  .timer-area {
    padding: 70px 15px 80px; /* Added bottom padding for bottom nav */
  }
  
  .mode-tabs {
    gap: 6px;
    margin-bottom: 30px;
  }
  
  .mode-tab {
    padding: 8px 16px;
    font-size: 12px;
  }
  
  .timer-controls {
    gap: 12px;
  }
  
  .control-btn {
    padding: 12px 24px;
    font-size: 14px;
    min-width: 90px;
  }
  
  .home-clock {
    top: 75px; /* Adjusted for very small mobile */
  }
  
  .current-time {
    font-size: 20px;
  }
  
  .content-area {
    padding: 80px 12px 80px;
  }
}
</style>