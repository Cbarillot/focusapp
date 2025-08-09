<template>
  <div class="todo-settings">
    <!-- Microsoft To-Do Integration Section -->
    <div class="section">
      <h3 class="section-title">Microsoft To-Do Integration</h3>
      
      <div class="integration-options">
        <div class="integration-card">
          <div class="integration-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11L12 14L22 4" stroke="#0078D4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="#0078D4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Microsoft To-Do</span>
          </div>
          <p class="integration-description">
            Connect to Microsoft To-Do for advanced task management and cross-device sync.
          </p>
          <button @click="openMicrosoftToDo" class="integration-btn">
            Open Microsoft To-Do
          </button>
        </div>
        
        <div class="integration-toggle">
          <label class="toggle-container">
            <span>Use local tasks as fallback</span>
            <input 
              v-model="useLocalFallback" 
              type="checkbox"
              class="toggle-input"
            />
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">Add New Task</h3>
      
      <div class="add-task-form">
        <input 
          v-model="newTask.title"
          type="text"
          placeholder="Enter task title..."
          class="task-input"
          @keyup.enter="addTask"
        />
        
        <div class="task-options">
          <select v-model="newTask.priority" class="priority-select">
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          
          <!-- Time Estimation with Clock Icons -->
          <div class="time-estimation">
            <label class="estimation-label">Time Estimate:</label>
            <div class="time-options">
              <button 
                v-for="option in timeOptions"
                :key="option.minutes"
                type="button"
                class="time-btn"
                :class="{ active: newTask.estimatedMinutes === option.minutes }"
                @click="newTask.estimatedMinutes = option.minutes"
                :title="`${option.minutes} minutes`"
              >
                <div class="clock-icons">
                  <svg 
                    v-for="n in option.clocks"
                    :key="n"
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <span>{{ option.minutes }}min</span>
              </button>
            </div>
          </div>
          
          <!-- Task Type Toggle -->
          <div class="task-type">
            <label class="type-label">Task Type:</label>
            <div class="type-options">
              <button 
                v-for="type in taskTypes"
                :key="type.key"
                type="button"
                class="type-btn"
                :class="{ active: newTask.type === type.key }"
                @click="newTask.type = type.key"
              >
                <span class="type-icon">{{ type.icon }}</span>
                <span>{{ type.label }}</span>
              </button>
            </div>
          </div>
        </div>
        
        <div class="task-tags">
          <input 
            v-model="newTagInput"
            type="text"
            placeholder="Add tags (press Enter)..."
            class="tag-input"
            @keyup.enter="addTag"
          />
          
          <div class="tag-list">
            <span 
              v-for="tag in newTask.tags"
              :key="tag"
              class="tag"
            >
              {{ tag }}
              <button @click="removeTag(tag)" class="tag-remove">×</button>
            </span>
          </div>
        </div>
        
        <button @click="addTask" class="add-btn">Add Task</button>
      </div>
    </div>
    
    <div class="section">
      <h3 class="section-title">Tasks</h3>
      
      <div class="task-controls">
        <div class="filter-tabs">
          <button 
            v-for="filter in filters"
            :key="filter.key"
            class="filter-tab"
            :class="{ active: store.todoFilter === filter.key }"
            @click="store.todoFilter = filter.key"
          >
            {{ filter.label }}
          </button>
        </div>
        
        <select v-model="store.todoSort" class="sort-select">
          <option value="created">Date Created</option>
          <option value="priority">Priority</option>
          <option value="due">Due Date</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="pomodoros">Estimated Time</option>
        </select>
      </div>
      
      <div class="task-list" v-if="filteredTodos.length > 0">
        <div 
          v-for="todo in filteredTodos"
          :key="todo.id"
          class="task-card"
          :class="{ completed: todo.completed }"
          draggable="true"
          @dragstart="onDragStart($event, todo)"
          @dragover.prevent
          @drop="onDrop($event, todo)"
        >
          <div class="task-header">
            <button 
              @click="store.toggleTodo(todo.id)"
              class="task-checkbox"
              :class="{ checked: todo.completed }"
            >
              <svg v-if="todo.completed" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            
            <div class="task-content">
              <h4 class="task-title">{{ todo.title }}</h4>
              <div class="task-meta">
                <span 
                  class="priority-badge"
                  :class="todo.priority"
                >
                  {{ todo.priority }}
                </span>
                <span v-if="todo.estimatedMinutes" class="time-estimate">
                  <div class="clock-icons">
                    <svg 
                      v-for="n in getClockCount(todo.estimatedMinutes)"
                      :key="n"
                      width="12" 
                      height="12" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                      <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  {{ todo.estimatedMinutes }}min
                </span>
                <span v-if="todo.type" class="task-type-badge" :class="todo.type">
                  {{ getTypeInfo(todo.type).icon }} {{ getTypeInfo(todo.type).label }}
                </span>
              </div>
            </div>
            
            <div class="task-actions">
              <button @click="editTask(todo)" class="action-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button @click="store.deleteTodo(todo.id)" class="action-btn delete">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div v-if="todo.tags && todo.tags.length > 0" class="task-tags-display">
            <span 
              v-for="tag in todo.tags"
              :key="tag"
              class="task-tag"
            >
              {{ tag }}
            </span>
          </div>
          
          <div v-if="todo.subtasks && todo.subtasks.length > 0" class="subtasks">
            <h5 class="subtasks-title">Subtasks</h5>
            <div 
              v-for="subtask in todo.subtasks"
              :key="subtask.id"
              class="subtask"
            >
              <button 
                @click="toggleSubtask(todo.id, subtask.id)"
                class="subtask-checkbox"
                :class="{ checked: subtask.completed }"
              >
                <svg v-if="subtask.completed" width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <span class="subtask-title">{{ subtask.title }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="empty-state">
        <p>No tasks yet. Add your first task above!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '../../stores/appStore'

const store = useAppStore()

// Microsoft To-Do Integration
const useLocalFallback = ref(true) // Always enabled as fallback

// Time estimation options with clock icons (15, 30, 45, 60 minutes = 1, 2, 3, 4 clocks)
const timeOptions = [
  { minutes: 15, clocks: 1 },
  { minutes: 30, clocks: 2 },
  { minutes: 45, clocks: 3 },
  { minutes: 60, clocks: 4 }
]

// Task types with icons
const taskTypes = [
  { key: 'work', label: 'Work', icon: '💼' },
  { key: 'personal', label: 'Personal', icon: '🏠' },
  { key: 'study', label: 'Study', icon: '📚' },
  { key: 'health', label: 'Health', icon: '💪' },
  { key: 'creative', label: 'Creative', icon: '🎨' },
  { key: 'other', label: 'Other', icon: '📝' }
]

const newTask = ref({
  title: '',
  priority: 'medium',
  estimatedMinutes: 30, // Default to 30 minutes
  type: 'work', // Default to work
  tags: []
})

const newTagInput = ref('')

const filters = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' }
]

const filteredTodos = computed(() => {
  let filtered = store.todos

  // Apply filter
  switch (store.todoFilter) {
    case 'active':
      filtered = filtered.filter(todo => !todo.completed)
      break
    case 'completed':
      filtered = filtered.filter(todo => todo.completed)
      break
  }

  // Apply sort
  switch (store.todoSort) {
    case 'priority':
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      filtered = [...filtered].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
      break
    case 'alphabetical':
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'pomodoros':
      // Sort by estimated minutes instead of pomodoros
      filtered = [...filtered].sort((a, b) => (b.estimatedMinutes || 0) - (a.estimatedMinutes || 0))
      break
    case 'created':
    default:
      filtered = [...filtered].sort((a, b) => new Date(b.created) - new Date(a.created))
  }

  return filtered
})

// Microsoft To-Do Integration
/**
 * Opens Microsoft To-Do in a new tab/window
 * This provides the primary task management experience with full Microsoft ecosystem integration
 * Future enhancement: Could embed Microsoft To-Do using iframe or webview for seamless experience
 */
function openMicrosoftToDo() {
  try {
    // Open Microsoft To-Do in new tab
    window.open('https://to-do.office.com/tasks/', '_blank', 'noopener,noreferrer')
    
    // Optional: Could implement deeper integration in future
    // - Microsoft Graph API integration for task sync
    // - OAuth authentication for user-specific task lists
    // - Real-time synchronization between local and Microsoft tasks
    console.log('Opened Microsoft To-Do - Future: implement sync capabilities')
  } catch (error) {
    console.error('Failed to open Microsoft To-Do:', error)
    // Fallback to local functionality is already enabled
  }
}

// Helper functions
function getClockCount(minutes) {
  const option = timeOptions.find(opt => opt.minutes === minutes)
  return option ? Array.from({ length: option.clocks }, (_, i) => i + 1) : [1]
}

function getTypeInfo(typeKey) {
  return taskTypes.find(type => type.key === typeKey) || taskTypes[0]
}

// Local storage persistence
function saveToLocalStorage() {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem('focusapp-todos', JSON.stringify(store.todos))
      localStorage.setItem('focusapp-todo-settings', JSON.stringify({
        useLocalFallback: useLocalFallback.value,
        todoFilter: store.todoFilter,
        todoSort: store.todoSort
      }))
    } catch (error) {
      console.error('Failed to save todos to localStorage:', error)
    }
  }
}

function loadFromLocalStorage() {
  if (typeof localStorage !== 'undefined') {
    try {
      const savedTodos = localStorage.getItem('focusapp-todos')
      if (savedTodos) {
        const todos = JSON.parse(savedTodos)
        // Migrate old todos to new format if needed
        const migratedTodos = todos.map(todo => ({
          ...todo,
          estimatedMinutes: todo.estimatedMinutes || (todo.estimatedPomodoros ? todo.estimatedPomodoros * 25 : 30),
          type: todo.type || 'work'
        }))
        store.todos = migratedTodos
      }
      
      const savedSettings = localStorage.getItem('focusapp-todo-settings')
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        useLocalFallback.value = settings.useLocalFallback ?? true
        store.todoFilter = settings.todoFilter || 'all'
        store.todoSort = settings.todoSort || 'created'
      }
    } catch (error) {
      console.error('Failed to load todos from localStorage:', error)
    }
  }
}

function addTask() {
  if (newTask.value.title.trim()) {
    const task = {
      ...newTask.value,
      title: newTask.value.title.trim(),
      // Keep backwards compatibility
      estimatedPomodoros: Math.ceil(newTask.value.estimatedMinutes / 25)
    }
    
    store.addTodo(task)
    saveToLocalStorage() // Persist to localStorage
    
    // Reset form
    newTask.value = {
      title: '',
      priority: 'medium',
      estimatedMinutes: 30,
      type: 'work',
      tags: []
    }
  }
}

function addTag() {
  const tag = newTagInput.value.trim()
  if (tag && !newTask.value.tags.includes(tag)) {
    newTask.value.tags.push(tag)
    newTagInput.value = ''
  }
}

function removeTag(tagToRemove) {
  newTask.value.tags = newTask.value.tags.filter(tag => tag !== tagToRemove)
}

function editTask(todo) {
  // TODO: Implement edit functionality
  // Future enhancement: Add modal or inline editing for tasks
  // Could integrate with Microsoft To-Do for editing synced tasks
  console.log('Edit task:', todo)
}

function toggleSubtask(todoId, subtaskId) {
  const todo = store.todos.find(t => t.id === todoId)
  if (todo) {
    const subtask = todo.subtasks.find(s => s.id === subtaskId)
    if (subtask) {
      subtask.completed = !subtask.completed
      saveToLocalStorage() // Persist changes
    }
  }
}

// Enhanced drag and drop functionality
let draggedItem = null

function onDragStart(event, todo) {
  draggedItem = todo
  event.dataTransfer.effectAllowed = 'move'
}

function onDrop(event, targetTodo) {
  if (draggedItem && draggedItem.id !== targetTodo.id) {
    const dragIndex = store.todos.findIndex(t => t.id === draggedItem.id)
    const targetIndex = store.todos.findIndex(t => t.id === targetTodo.id)
    
    // Reorder the todos
    const todos = [...store.todos]
    const [removed] = todos.splice(dragIndex, 1)
    todos.splice(targetIndex, 0, removed)
    
    store.todos = todos
    saveToLocalStorage() // Persist reorder
  }
  draggedItem = null
}

// Watch for changes to persist data
import { watch } from 'vue'

watch(() => store.todos, saveToLocalStorage, { deep: true })
watch(() => store.todoFilter, saveToLocalStorage)
watch(() => store.todoSort, saveToLocalStorage)
watch(useLocalFallback, saveToLocalStorage)

// Load data on component mount
onMounted(() => {
  loadFromLocalStorage()
})

/**
 * EXTENSIBILITY NOTES:
 * 
 * This TODO component is designed to be easily extended with additional task management integrations:
 * 
 * 1. MICROSOFT TO-DO INTEGRATION:
 *    - Current: Opens Microsoft To-Do in new tab
 *    - Future: Microsoft Graph API integration for real-time sync
 *    - Implementation: Add OAuth flow and Graph API calls in openMicrosoftToDo()
 * 
 * 2. OTHER INTEGRATIONS:
 *    - Google Tasks: Add similar integration following the Microsoft To-Do pattern
 *    - Todoist: Implement Todoist API integration
 *    - Notion: Connect to Notion databases for task management
 *    - Trello: Board-based task management integration
 * 
 * 3. ADDING NEW INTEGRATIONS:
 *    - Add integration card in the template (similar to Microsoft To-Do)
 *    - Create integration function following openMicrosoftToDo() pattern
 *    - Add integration settings to localStorage persistence
 *    - Implement sync logic in background service
 * 
 * 4. SYNC ARCHITECTURE:
 *    - Local tasks serve as fallback and cache
 *    - External service tasks can be synced bidirectionally
 *    - Conflict resolution for concurrent edits
 *    - Offline-first approach with sync when online
 * 
 * 5. UI EXTENSIONS:
 *    - Add integration status indicators
 *    - Show sync progress and conflicts
 *    - Allow per-task integration selection
 *    - Implement bulk operations (import/export)
 */
</script>

<style scoped>
.todo-settings {
  color: var(--color-text-primary);
}

/* Microsoft To-Do Integration Styles */
.integration-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.integration-card {
  padding: 20px;
  border-radius: var(--border-radius-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  transition: all var(--transition-fast);
}

.integration-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: #0078D4;
}

.integration-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.integration-description {
  margin: 0 0 16px 0;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.5;
}

.integration-btn {
  padding: 12px 24px;
  border-radius: var(--border-radius-sm);
  background: #0078D4;
  color: white;
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.integration-btn:hover {
  background: #106ebe;
  transform: translateY(-1px);
}

.integration-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: var(--border-radius-md);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
}

.toggle-container {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.toggle-input {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 44px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  transition: all var(--transition-fast);
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  left: 2px;
  top: 2px;
  background: white;
  border-radius: 50%;
  transition: all var(--transition-fast);
}

.toggle-input:checked + .toggle-slider {
  background: var(--color-primary);
}

.toggle-input:checked + .toggle-slider::before {
  transform: translateX(20px);
}

/* Time Estimation Styles */
.time-estimation {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.estimation-label,
.type-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.time-options,
.type-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.time-btn,
.type-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px;
  border-radius: var(--border-radius-sm);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 500;
  transition: all var(--transition-fast);
  min-width: 60px;
}

.time-btn:hover,
.type-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
  border-color: var(--color-primary);
}

.time-btn.active,
.type-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-primary);
}

.clock-icons {
  display: flex;
  gap: 2px;
}

.type-icon {
  font-size: 16px;
}

.task-type {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Enhanced task display styles */
.time-estimate {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--color-text-muted);
}

.time-estimate .clock-icons {
  display: flex;
  gap: 1px;
}

.task-type-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
}

.task-type-badge.work {
  background: #0078D4;
  color: white;
}

.task-type-badge.personal {
  background: #10B981;
  color: white;
}

.task-type-badge.study {
  background: #8B5CF6;
  color: white;
}

.task-type-badge.health {
  background: #F59E0B;
  color: white;
}

.task-type-badge.creative {
  background: #EF4444;
  color: white;
}

.task-type-badge.other {
  background: #6B7280;
  color: white;
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

.add-task-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: var(--border-radius-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
}

.task-input {
  padding: 12px 16px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
  font-size: 14px;
}

.task-input:focus {
  border-color: var(--color-primary);
  background: rgba(255, 255, 255, 0.1);
}

.task-input::placeholder {
  color: var(--color-text-muted);
}

.task-options {
  display: flex;
  gap: 12px;
}

.priority-select,
.pomodoro-input {
  padding: 8px 12px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
  font-size: 13px;
}

.priority-select {
  flex: 1;
}

.pomodoro-input {
  width: 120px;
}

.task-tags {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tag-input {
  padding: 8px 12px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
  font-size: 13px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: var(--border-radius-sm);
  background: var(--color-primary);
  color: var(--color-text-primary);
  font-size: 11px;
  font-weight: 500;
}

.tag-remove {
  background: none;
  border: none;
  color: inherit;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  margin: 0;
}

.tag-remove:hover {
  opacity: 0.7;
}

.add-btn {
  padding: 10px 16px;
  border-radius: var(--border-radius-sm);
  background: var(--color-primary);
  color: var(--color-text-primary);
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-fast);
  align-self: flex-end;
}

.add-btn:hover {
  background: var(--color-primary-dark);
}

.task-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
}

.filter-tabs {
  display: flex;
  gap: 4px;
}

.filter-tab {
  padding: 6px 12px;
  border-radius: var(--border-radius-sm);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.filter-tab:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
}

.filter-tab.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-primary);
}

.sort-select {
  padding: 6px 10px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
  font-size: 12px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-card {
  padding: 16px;
  border-radius: var(--border-radius-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  transition: all var(--transition-fast);
  cursor: move;
}

.task-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.task-card.completed {
  opacity: 0.6;
}

.task-card.completed .task-title {
  text-decoration: line-through;
}

.task-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.task-checkbox {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid var(--color-border);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.task-checkbox:hover {
  border-color: var(--color-primary);
}

.task-checkbox.checked {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.task-content {
  flex: 1;
}

.task-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1.4;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.priority-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.priority-badge.high {
  background: #ef4444;
  color: white;
}

.priority-badge.medium {
  background: #f59e0b;
  color: white;
}

.priority-badge.low {
  background: #10b981;
  color: white;
}

.pomodoro-estimate {
  font-size: 11px;
  color: var(--color-text-muted);
}

.task-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  background: transparent;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.task-tags-display {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.task-tag {
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-secondary);
  font-size: 10px;
  font-weight: 500;
}

.subtasks {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

.subtasks-title {
  margin: 0 0 8px 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.subtask {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.subtask-checkbox {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border: 1px solid var(--color-border);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.subtask-checkbox:hover {
  border-color: var(--color-primary);
}

.subtask-checkbox.checked {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.subtask-title {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--color-text-muted);
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* Responsive */
@media (max-width: 480px) {
  .task-options {
    flex-direction: column;
  }
  
  .pomodoro-input {
    width: 100%;
  }
  
  .task-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .filter-tabs {
    justify-content: center;
  }
  
  .task-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .task-actions {
    align-self: flex-end;
  }
}
</style>