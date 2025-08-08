<template>
  <MainLayout>
    <div class="space-y-8">
      <!-- Welcome Section -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
          Focus App
        </h1>
        <p class="text-xl text-gray-300 max-w-2xl mx-auto">
          Maximisez votre productivité avec notre interface moderne inspirée de Flocus
        </p>
      </div>

      <!-- Main Widgets Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Pomodoro Timer -->
        <div class="lg:col-span-1">
          <PomodoroWidget />
        </div>

        <!-- Todo List -->
        <div class="lg:col-span-1">
          <TodoWidget />
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from './components/layout/MainLayout.vue'
import PomodoroWidget from './components/widgets/PomodoroWidget.vue'
import TodoWidget from './components/widgets/TodoWidget.vue'
</script>