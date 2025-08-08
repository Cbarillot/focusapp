<template>
  <div class="p-6">
    <div class="space-y-6">
      <!-- Timer Settings -->
      <div>
        <h3 class="text-lg font-semibold mb-4 text-white">Configuration du Timer</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm text-gray-400 mb-2">Durée de travail (minutes)</label>
            <input 
              type="number" 
              v-model="settings.workDuration"
              min="1" 
              max="120"
              class="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none"
            >
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Pause courte (minutes)</label>
            <input 
              type="number" 
              v-model="settings.shortBreak"
              min="1" 
              max="30"
              class="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none"
            >
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Pause longue (minutes)</label>
            <input 
              type="number" 
              v-model="settings.longBreak"
              min="1" 
              max="60"
              class="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none"
            >
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Cycles avant pause longue</label>
            <input 
              type="number" 
              v-model="settings.cyclesBeforeLongBreak"
              min="2" 
              max="10"
              class="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none"
            >
          </div>
        </div>
      </div>

      <!-- Notifications -->
      <div>
        <h3 class="text-lg font-semibold mb-4 text-white">Notifications</h3>
        <div class="space-y-3">
          <label class="flex items-center gap-3">
            <input 
              type="checkbox" 
              v-model="settings.soundEnabled"
              class="rounded bg-white/10 border-white/20 text-blue-500"
            >
            <span class="text-white">Sons de notification</span>
          </label>
          <div v-if="settings.soundEnabled" class="ml-6">
            <label class="block text-sm text-gray-400 mb-2">Son personnalisé</label>
            <select 
              v-model="settings.notificationSound"
              class="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
            >
              <option value="bell">Cloche</option>
              <option value="chime">Carillon</option>
              <option value="ding">Ding</option>
              <option value="custom">Personnalisé...</option>
            </select>
          </div>
          <label class="flex items-center gap-3">
            <input 
              type="checkbox" 
              v-model="settings.desktopNotifications"
              class="rounded bg-white/10 border-white/20 text-blue-500"
            >
            <span class="text-white">Notifications bureau</span>
          </label>
        </div>
      </div>

      <!-- Auto-start -->
      <div>
        <h3 class="text-lg font-semibold mb-4 text-white">Démarrage Automatique</h3>
        <div class="space-y-3">
          <label class="flex items-center gap-3">
            <input 
              type="checkbox" 
              v-model="settings.autoStartBreaks"
              class="rounded bg-white/10 border-white/20 text-blue-500"
            >
            <span class="text-white">Démarrer les pauses automatiquement</span>
          </label>
          <label class="flex items-center gap-3">
            <input 
              type="checkbox" 
              v-model="settings.autoStartPomodoros"
              class="rounded bg-white/10 border-white/20 text-blue-500"
            >
            <span class="text-white">Démarrer les pomodoros automatiquement</span>
          </label>
        </div>
      </div>

      <!-- Save Button -->
      <button 
        @click="saveSettings"
        class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
      >
        Enregistrer les paramètres
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const settings = reactive({
  workDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  cyclesBeforeLongBreak: 4,
  soundEnabled: true,
  notificationSound: 'bell',
  desktopNotifications: true,
  autoStartBreaks: false,
  autoStartPomodoros: false
})

function saveSettings() {
  // TODO: Implement settings persistence
  console.log('Saving timer settings:', settings)
}
</script>