<template>
  <div 
    :class="{ 
      'todo-container': true, 
      'expanded': isExpanded,
      'collapsed': !isExpanded 
    }"
  >
    <!-- Toggle Button -->
    <button 
      class="todo-toggle"
      @click="toggleExpanded"
      :style="{ backgroundColor: theme.primaryColor }"
    >
      <span class="toggle-icon">{{ isExpanded ? '✕' : '📝' }}</span>
      <span v-if="!isExpanded" class="task-count">{{ incompleteTasks.length }}</span>
    </button>

    <!-- Todo Panel -->
    <div class="todo-panel" v-show="isExpanded">
      <div class="todo-header">
        <h3>📋 Ma to-do list</h3>
        <button class="close-btn" @click="toggleExpanded">✕</button>
      </div>

      <div class="todo-content">
        <!-- Add new task -->
        <div class="add-task">
          <input
            v-model="newTask"
            type="text"
            placeholder="Ajouter une tâche..."
            @keyup.enter="addTask"
            ref="newTaskInput"
          />
          <button @click="addTask" :disabled="!newTask.trim()">+</button>
        </div>

        <!-- Task list -->
        <div class="task-list" ref="taskList">
          <div
            v-for="(task, index) in tasks"
            :key="task.id"
            :class="{ 
              'task-item': true, 
              'completed': task.completed,
              'dragging': draggedTask === task.id
            }"
            draggable="true"
            @dragstart="startDrag(task, $event)"
            @dragover.prevent
            @drop="dropTask($event, index)"
            @dragenter.prevent
          >
            <div class="drag-handle">⋮⋮</div>
            
            <input
              type="checkbox"
              v-model="task.completed"
              @change="updateTask(task)"
              class="task-checkbox"
            />
            
            <span 
              :class="{ 'task-text': true, 'completed': task.completed }"
              @dblclick="editTask(task)"
            >
              {{ task.text }}
            </span>
            
            <input
              v-if="editingTask === task.id"
              v-model="task.text"
              type="text"
              class="edit-input"
              @keyup.enter="finishEdit"
              @keyup.escape="cancelEdit"
              @blur="finishEdit"
              ref="editInput"
            />
            
            <button 
              @click="deleteTask(task.id)" 
              class="delete-btn"
              title="Supprimer"
            >
              🗑️
            </button>
          </div>

          <div v-if="tasks.length === 0" class="empty-state">
            <p>Aucune tâche pour le moment</p>
            <p>Ajoutez votre première tâche ci-dessus ⬆️</p>
          </div>
        </div>

        <!-- Task stats -->
        <div class="task-stats">
          <small>
            {{ completedTasks.length }} terminée{{ completedTasks.length !== 1 ? 's' : '' }}, 
            {{ incompleteTasks.length }} restante{{ incompleteTasks.length !== 1 ? 's' : '' }}
          </small>
          <button 
            v-if="completedTasks.length > 0" 
            @click="clearCompleted"
            class="clear-btn"
          >
            Vider terminées
          </button>
        </div>
      </div>
    </div>

    <!-- Backdrop for mobile -->
    <div 
      v-if="isExpanded" 
      class="todo-backdrop"
      @click="toggleExpanded"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'

const props = defineProps({
  theme: {
    type: Object,
    default: () => ({ primaryColor: '#4b6cb7' })
  }
})

// Reactive state
const isExpanded = ref(false)
const newTask = ref('')
const editingTask = ref(null)
const draggedTask = ref(null)
const tasks = ref([])

// Computed properties
const completedTasks = computed(() => tasks.value.filter(task => task.completed))
const incompleteTasks = computed(() => tasks.value.filter(task => !task.completed))

// Methods
function toggleExpanded() {
  isExpanded.value = !isExpanded.value
  
  if (isExpanded.value) {
    // Focus on input when opening
    nextTick(() => {
      document.querySelector('.add-task input')?.focus()
    })
  }
}

function addTask() {
  if (newTask.value.trim()) {
    const task = {
      id: Date.now() + Math.random(),
      text: newTask.value.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    }
    
    tasks.value.unshift(task) // Add to beginning
    newTask.value = ''
    saveTasks()
  }
}

function updateTask(task) {
  // Task completion state already updated by v-model
  saveTasks()
}

function editTask(task) {
  if (task.completed) return // Don't edit completed tasks
  
  editingTask.value = task.id
  nextTick(() => {
    const input = document.querySelector('.edit-input')
    if (input) {
      input.focus()
      input.select()
    }
  })
}

function finishEdit() {
  if (editingTask.value) {
    const task = tasks.value.find(t => t.id === editingTask.value)
    if (task && !task.text.trim()) {
      // Delete empty task
      deleteTask(task.id)
    } else {
      saveTasks()
    }
  }
  editingTask.value = null
}

function cancelEdit() {
  editingTask.value = null
  loadTasks() // Reload to cancel changes
}

function deleteTask(taskId) {
  tasks.value = tasks.value.filter(task => task.id !== taskId)
  saveTasks()
}

function clearCompleted() {
  tasks.value = tasks.value.filter(task => !task.completed)
  saveTasks()
}

// Drag and drop functionality
function startDrag(task, event) {
  draggedTask.value = task.id
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/html', event.target.outerHTML)
}

function dropTask(event, targetIndex) {
  event.preventDefault()
  
  if (draggedTask.value) {
    const draggedIndex = tasks.value.findIndex(t => t.id === draggedTask.value)
    
    if (draggedIndex !== -1 && draggedIndex !== targetIndex) {
      // Remove dragged task
      const draggedTaskObj = tasks.value.splice(draggedIndex, 1)[0]
      
      // Insert at new position
      const newIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex
      tasks.value.splice(newIndex, 0, draggedTaskObj)
      
      saveTasks()
    }
    
    draggedTask.value = null
  }
}

// Local storage persistence
function saveTasks() {
  localStorage.setItem('focusapp-tasks', JSON.stringify(tasks.value))
}

function loadTasks() {
  const saved = localStorage.getItem('focusapp-tasks')
  if (saved) {
    try {
      tasks.value = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to load tasks:', e)
      tasks.value = []
    }
  }
}

// Keyboard shortcuts
function handleKeyboard(event) {
  // Ctrl/Cmd + T to toggle todo list
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 't') {
    event.preventDefault()
    toggleExpanded()
  }
  
  // Escape to close when open
  if (event.key === 'Escape' && isExpanded.value) {
    toggleExpanded()
  }
}

// Lifecycle
onMounted(() => {
  loadTasks()
  document.addEventListener('keydown', handleKeyboard)
})

// Watch for theme changes
watch(() => props.theme, (newTheme) => {
  // Update CSS custom properties
  if (newTheme.primaryColor) {
    document.documentElement.style.setProperty('--todo-primary-color', newTheme.primaryColor)
  }
}, { immediate: true })
</script>

<style scoped>
.todo-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.todo-toggle {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: var(--todo-primary-color, #4b6cb7);
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.todo-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.toggle-icon {
  transition: transform 0.3s ease;
}

.expanded .toggle-icon {
  transform: rotate(180deg);
}

.task-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.todo-panel {
  position: absolute;
  top: 70px;
  right: 0;
  width: 350px;
  max-height: 500px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideInFromRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

.todo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.todo-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #666;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #333;
}

.todo-content {
  padding: 0 20px 20px;
  max-height: 400px;
  overflow-y: auto;
}

.add-task {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.add-task input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.2s;
}

.add-task input:focus {
  outline: none;
  border-color: var(--todo-primary-color, #4b6cb7);
  box-shadow: 0 0 0 3px rgba(75, 108, 183, 0.1);
}

.add-task button {
  background: var(--todo-primary-color, #4b6cb7);
  color: white;
  border: none;
  border-radius: 8px;
  width: 44px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: all 0.2s;
}

.add-task button:hover:not(:disabled) {
  background: color-mix(in srgb, var(--todo-primary-color, #4b6cb7) 90%, black);
}

.add-task button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.task-list {
  margin-bottom: 15px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  cursor: default;
}

.task-item:hover {
  background: rgba(0, 0, 0, 0.02);
  padding-left: 8px;
  padding-right: 8px;
  margin-left: -8px;
  margin-right: -8px;
  border-radius: 8px;
}

.task-item.dragging {
  opacity: 0.5;
  transform: rotate(3deg);
}

.drag-handle {
  color: #999;
  cursor: grab;
  font-size: 12px;
  line-height: 1;
}

.drag-handle:active {
  cursor: grabbing;
}

.task-checkbox {
  accent-color: var(--todo-primary-color, #4b6cb7);
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.task-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
  transition: all 0.2s;
}

.task-text.completed {
  text-decoration: line-through;
  color: #999;
  opacity: 0.7;
}

.edit-input {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid var(--todo-primary-color, #4b6cb7);
  border-radius: 4px;
  font-size: 14px;
  background: white;
}

.edit-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(75, 108, 183, 0.2);
}

.delete-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  font-size: 14px;
  opacity: 0;
  transition: all 0.2s;
}

.task-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  color: #ff4757;
  background: rgba(255, 71, 87, 0.1);
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-state p {
  margin: 8px 0;
  font-size: 14px;
}

.task-stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 15px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 12px;
  color: #666;
}

.clear-btn {
  background: none;
  border: none;
  color: #ff4757;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: rgba(255, 71, 87, 0.1);
}

.todo-backdrop {
  display: none;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .todo-container {
    top: 15px;
    right: 15px;
  }
  
  .todo-toggle {
    width: 50px;
    height: 50px;
    font-size: 16px;
  }
  
  .task-count {
    width: 20px;
    height: 20px;
    font-size: 11px;
  }
  
  .todo-panel {
    width: calc(100vw - 30px);
    right: -15px;
    max-width: 400px;
  }
  
  .expanded .todo-backdrop {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.1);
    z-index: -1;
  }
}

@media (max-width: 480px) {
  .todo-panel {
    width: calc(100vw - 20px);
    right: -10px;
    top: 60px;
  }
  
  .todo-container {
    right: 10px;
    top: 10px;
  }
  
  .todo-content {
    padding: 0 15px 15px;
  }
  
  .todo-header {
    padding: 15px;
  }
}
</style>