<template>
  <div class="bg-black/20 backdrop-blur-md rounded-2xl p-6 text-white">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
        To-Do List
      </h2>
      <button
        @click="showAddTask = true"
        class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm font-medium"
      >
        + Ajouter
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="mb-6 space-y-4">
      <!-- Search -->
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher des tâches..."
          class="w-full p-3 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
        >
        <svg class="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>

      <!-- Filter tabs -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="filter in filters"
          :key="filter.key"
          @click="currentFilter = filter.key"
          class="px-3 py-1 text-sm rounded-full transition-all"
          :class="currentFilter === filter.key 
            ? 'bg-blue-600 text-white' 
            : 'bg-white/10 text-gray-300 hover:bg-white/20'"
        >
          {{ filter.label }} ({{ getFilteredCount(filter.key) }})
        </button>
      </div>

      <!-- Tag filter -->
      <div v-if="allTags.length > 0" class="flex flex-wrap gap-2">
        <button
          v-for="tag in allTags"
          :key="tag"
          @click="toggleTagFilter(tag)"
          class="px-2 py-1 text-xs rounded-full transition-all"
          :class="selectedTags.includes(tag)
            ? 'bg-purple-600 text-white'
            : 'bg-purple-600/30 text-purple-200 hover:bg-purple-600/50'"
        >
          #{{ tag }}
        </button>
      </div>
    </div>

    <!-- Sort Options -->
    <div class="mb-4">
      <select 
        v-model="sortBy"
        class="p-2 bg-white/10 border border-white/20 rounded text-white text-sm"
      >
        <option value="priority">Trier par priorité</option>
        <option value="deadline">Trier par échéance</option>
        <option value="duration">Trier par durée</option>
        <option value="created">Trier par création</option>
      </select>
    </div>

    <!-- Tasks List -->
    <div class="space-y-3 max-h-96 overflow-y-auto">
      <div
        v-for="task in filteredTasks"
        :key="task.id"
        class="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all group"
        :class="{
          'opacity-50': task.completed,
          'border-red-400/50': isOverdue(task),
          'border-orange-400/50': isDueSoon(task)
        }"
      >
        <div class="flex items-start gap-3">
          <!-- Checkbox -->
          <input
            type="checkbox"
            v-model="task.completed"
            @change="updateTask(task)"
            class="mt-1 rounded bg-white/10 border-white/20 text-green-500"
          >

          <!-- Task Content -->
          <div class="flex-1">
            <div class="flex items-start justify-between">
              <div>
                <h3 
                  class="font-medium"
                  :class="task.completed ? 'line-through text-gray-400' : 'text-white'"
                >
                  {{ task.title }}
                </h3>
                <p 
                  v-if="task.description"
                  class="text-sm text-gray-400 mt-1"
                >
                  {{ task.description }}
                </p>
              </div>

              <!-- Duration indicator -->
              <div class="flex items-center gap-1 ml-2">
                <span 
                  v-for="n in task.estimatedDuration"
                  :key="n"
                  class="text-yellow-400"
                >
                  🕐
                </span>
              </div>
            </div>

            <!-- Task metadata -->
            <div class="flex items-center gap-4 mt-3 text-sm">
              <!-- Priority -->
              <span 
                class="px-2 py-1 rounded text-xs"
                :class="getPriorityClass(task.priority)"
              >
                {{ getPriorityLabel(task.priority) }}
              </span>

              <!-- Deadline -->
              <span 
                v-if="task.deadline"
                class="text-xs"
                :class="{
                  'text-red-400': isOverdue(task),
                  'text-orange-400': isDueSoon(task),
                  'text-gray-400': !isOverdue(task) && !isDueSoon(task)
                }"
              >
                📅 {{ formatDate(task.deadline) }}
              </span>

              <!-- Tags -->
              <div v-if="task.tags.length > 0" class="flex gap-1">
                <span 
                  v-for="tag in task.tags"
                  :key="tag"
                  class="px-2 py-1 bg-purple-600/30 text-purple-200 text-xs rounded"
                >
                  #{{ tag }}
                </span>
              </div>

              <!-- Recurring -->
              <span v-if="task.recurring" class="text-xs text-blue-400">
                🔄 Récurrent
              </span>
            </div>

            <!-- Subtasks -->
            <div v-if="task.subtasks && task.subtasks.length > 0" class="mt-3 ml-4">
              <div 
                v-for="subtask in task.subtasks"
                :key="subtask.id"
                class="flex items-center gap-2 py-1 text-sm"
              >
                <input
                  type="checkbox"
                  v-model="subtask.completed"
                  @change="updateTask(task)"
                  class="rounded bg-white/10 border-white/20 text-green-500 text-xs"
                >
                <span 
                  :class="subtask.completed ? 'line-through text-gray-400' : 'text-gray-300'"
                >
                  {{ subtask.title }}
                </span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              @click="editTask(task)"
              class="p-1 hover:bg-white/20 rounded text-gray-400 hover:text-white"
            >
              ✏️
            </button>
            <button
              @click="deleteTask(task.id)"
              class="p-1 hover:bg-white/20 rounded text-gray-400 hover:text-red-400"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="filteredTasks.length === 0" class="text-center py-8 text-gray-400">
        <p>Aucune tâche trouvée</p>
      </div>
    </div>

    <!-- Add/Edit Task Modal -->
    <div v-if="showAddTask || editingTask" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-gray-900 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-4 text-white">
          {{ editingTask ? 'Modifier la tâche' : 'Nouvelle tâche' }}
        </h3>

        <form @submit.prevent="saveTask" class="space-y-4">
          <!-- Title -->
          <div>
            <label class="block text-sm text-gray-400 mb-1">Titre</label>
            <input
              v-model="taskForm.title"
              type="text"
              required
              class="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
            >
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm text-gray-400 mb-1">Description</label>
            <textarea
              v-model="taskForm.description"
              rows="3"
              class="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white resize-none"
            ></textarea>
          </div>

          <!-- Priority -->
          <div>
            <label class="block text-sm text-gray-400 mb-1">Priorité</label>
            <select 
              v-model="taskForm.priority"
              class="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="low">Faible</option>
              <option value="medium">Moyenne</option>
              <option value="high">Élevée</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>

          <!-- Duration -->
          <div>
            <label class="block text-sm text-gray-400 mb-1">Durée estimée</label>
            <select 
              v-model="taskForm.estimatedDuration"
              class="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="1">🕐 15-30 minutes</option>
              <option value="2">🕐🕐 30-60 minutes</option>
              <option value="3">🕐🕐🕐 1-2 heures</option>
              <option value="4">🕐🕐🕐🕐 2+ heures</option>
            </select>
          </div>

          <!-- Deadline -->
          <div>
            <label class="block text-sm text-gray-400 mb-1">Échéance</label>
            <input
              v-model="taskForm.deadline"
              type="datetime-local"
              class="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
            >
          </div>

          <!-- Tags -->
          <div>
            <label class="block text-sm text-gray-400 mb-1">Tags (séparés par des virgules)</label>
            <input
              v-model="taskForm.tagsInput"
              type="text"
              placeholder="work, urgent, project"
              class="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
            >
          </div>

          <!-- Recurring -->
          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              v-model="taskForm.recurring"
              class="rounded bg-white/10 border-white/20 text-blue-500"
            >
            <label class="text-white">Tâche récurrente</label>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-4">
            <button
              type="submit"
              class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
            >
              {{ editingTask ? 'Modifier' : 'Ajouter' }}
            </button>
            <button
              type="button"
              @click="cancelEdit"
              class="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'

// State
const tasks = ref([])
const showAddTask = ref(false)
const editingTask = ref(null)
const searchQuery = ref('')
const currentFilter = ref('all')
const selectedTags = ref([])
const sortBy = ref('priority')

// Form data
const taskForm = reactive({
  title: '',
  description: '',
  priority: 'medium',
  estimatedDuration: 2,
  deadline: '',
  tagsInput: '',
  recurring: false
})

// Filters
const filters = [
  { key: 'all', label: 'Toutes' },
  { key: 'pending', label: 'En cours' },
  { key: 'completed', label: 'Terminées' },
  { key: 'urgent', label: 'Urgentes' },
  { key: 'overdue', label: 'En retard' }
]

// Computed properties
const allTags = computed(() => {
  const tagSet = new Set()
  tasks.value.forEach(task => {
    task.tags.forEach(tag => tagSet.add(tag))
  })
  return Array.from(tagSet)
})

const filteredTasks = computed(() => {
  let filtered = tasks.value.filter(task => {
    // Search filter
    if (searchQuery.value && !task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
        !task.description.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return false
    }

    // Tag filter
    if (selectedTags.value.length > 0 && !selectedTags.value.some(tag => task.tags.includes(tag))) {
      return false
    }

    // Status filter
    switch (currentFilter.value) {
      case 'pending':
        return !task.completed
      case 'completed':
        return task.completed
      case 'urgent':
        return task.priority === 'urgent' && !task.completed
      case 'overdue':
        return isOverdue(task) && !task.completed
      default:
        return true
    }
  })

  // Sort
  return filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case 'deadline':
        if (!a.deadline && !b.deadline) return 0
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(a.deadline) - new Date(b.deadline)
      case 'duration':
        return b.estimatedDuration - a.estimatedDuration
      case 'created':
        return new Date(b.createdAt) - new Date(a.createdAt)
      default:
        return 0
    }
  })
})

// Methods
function getFilteredCount(filterKey) {
  return tasks.value.filter(task => {
    switch (filterKey) {
      case 'pending':
        return !task.completed
      case 'completed':
        return task.completed
      case 'urgent':
        return task.priority === 'urgent' && !task.completed
      case 'overdue':
        return isOverdue(task) && !task.completed
      default:
        return true
    }
  }).length
}

function toggleTagFilter(tag) {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

function getPriorityClass(priority) {
  switch (priority) {
    case 'urgent':
      return 'bg-red-600 text-white'
    case 'high':
      return 'bg-orange-600 text-white'
    case 'medium':
      return 'bg-yellow-600 text-white'
    case 'low':
      return 'bg-green-600 text-white'
    default:
      return 'bg-gray-600 text-white'
  }
}

function getPriorityLabel(priority) {
  const labels = {
    urgent: 'Urgent',
    high: 'Élevée',
    medium: 'Moyenne',
    low: 'Faible'
  }
  return labels[priority] || priority
}

function isOverdue(task) {
  if (!task.deadline || task.completed) return false
  return new Date(task.deadline) < new Date()
}

function isDueSoon(task) {
  if (!task.deadline || task.completed || isOverdue(task)) return false
  const now = new Date()
  const deadline = new Date(task.deadline)
  const hoursDiff = (deadline - now) / (1000 * 60 * 60)
  return hoursDiff <= 24
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function editTask(task) {
  editingTask.value = task
  Object.assign(taskForm, {
    title: task.title,
    description: task.description,
    priority: task.priority,
    estimatedDuration: task.estimatedDuration,
    deadline: task.deadline,
    tagsInput: task.tags.join(', '),
    recurring: task.recurring
  })
}

function cancelEdit() {
  showAddTask.value = false
  editingTask.value = null
  Object.assign(taskForm, {
    title: '',
    description: '',
    priority: 'medium',
    estimatedDuration: 2,
    deadline: '',
    tagsInput: '',
    recurring: false
  })
}

function saveTask() {
  const tags = taskForm.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag)
  
  const taskData = {
    title: taskForm.title,
    description: taskForm.description,
    priority: taskForm.priority,
    estimatedDuration: parseInt(taskForm.estimatedDuration),
    deadline: taskForm.deadline || null,
    tags,
    recurring: taskForm.recurring,
    completed: false
  }

  if (editingTask.value) {
    // Update existing task
    Object.assign(editingTask.value, taskData)
  } else {
    // Add new task
    const newTask = {
      id: Date.now(),
      ...taskData,
      createdAt: new Date().toISOString(),
      subtasks: []
    }
    tasks.value.unshift(newTask)
  }

  saveTasks()
  cancelEdit()
}

function updateTask(task) {
  saveTasks()
}

function deleteTask(taskId) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
    tasks.value = tasks.value.filter(task => task.id !== taskId)
    saveTasks()
  }
}

function saveTasks() {
  localStorage.setItem('focusapp-tasks', JSON.stringify(tasks.value))
}

function loadTasks() {
  const savedTasks = localStorage.getItem('focusapp-tasks')
  if (savedTasks) {
    tasks.value = JSON.parse(savedTasks)
  } else {
    // Sample tasks for demonstration
    tasks.value = [
      {
        id: 1,
        title: 'Terminer le projet Focus App',
        description: 'Implémenter toutes les fonctionnalités demandées',
        priority: 'urgent',
        estimatedDuration: 4,
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['work', 'development'],
        recurring: false,
        completed: false,
        createdAt: new Date().toISOString(),
        subtasks: []
      },
      {
        id: 2,
        title: 'Réviser pour l\'examen',
        description: 'Chapitre 3 et 4 du cours',
        priority: 'high',
        estimatedDuration: 3,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['study', 'exam'],
        recurring: false,
        completed: false,
        createdAt: new Date().toISOString(),
        subtasks: []
      }
    ]
  }
}

onMounted(() => {
  loadTasks()
})
</script>