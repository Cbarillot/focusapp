<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 relative">
    <AnimatedBackground />
    
    <!-- Side Panel -->
    <aside 
      class="fixed top-0 left-0 h-full w-80 bg-black/20 backdrop-blur-md border-r border-white/10 transform transition-transform duration-300 z-40"
      :class="{ '-translate-x-full': !sidebarOpen }"
    >
      <SidePanel @close="sidebarOpen = false" />
    </aside>

    <!-- Toggle Button -->
    <button
      @click="sidebarOpen = !sidebarOpen"
      class="fixed top-4 left-4 z-50 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white p-3 rounded-lg transition-all duration-200"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              :d="sidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"></path>
      </svg>
    </button>

    <!-- Main Content -->
    <main 
      class="transition-all duration-300 min-h-screen"
      :class="{ 'ml-80': sidebarOpen }"
    >
      <div class="flex flex-col items-center justify-center min-h-screen p-8">
        <div class="w-full max-w-2xl">
          <slot />
        </div>
      </div>
    </main>

    <!-- Overlay for mobile -->
    <div 
      v-if="sidebarOpen" 
      class="fixed inset-0 bg-black/50 z-30 md:hidden"
      @click="sidebarOpen = false"
    ></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AnimatedBackground from '../AnimatedBackground.vue'
import SidePanel from '../panels/SidePanel.vue'

const sidebarOpen = ref(false)
</script>