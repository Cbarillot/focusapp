<template>
  <div class="timer-settings">
    <div class="section">
      <h3 class="section-title">Timer Duration</h3>
      
      <div class="setting-group">
        <label class="setting-label">
          <span>Pomodoro</span>
          <div class="time-input">
            <input 
              type="number" 
              :value="Math.floor(store.pomodoroTime / 60)"
              @input="updatePomodoroTime($event.target.value)"
              min="1"
              max="60"
              class="time-field"
            />
            <span class="time-unit">min</span>
          </div>
        </label>
        
        <label class="setting-label">
          <span>Short Break</span>
          <div class="time-input">
            <input 
              type="number" 
              :value="Math.floor(store.shortBreakTime / 60)"
              @input="updateShortBreakTime($event.target.value)"
              min="1"
              max="30"
              class="time-field"
            />
            <span class="time-unit">min</span>
          </div>
        </label>
        
        <label class="setting-label">
          <span>Long Break</span>
          <div class="time-input">
            <input 
              type="number" 
              :value="Math.floor(store.longBreakTime / 60)"
              @input="updateLongBreakTime($event.target.value)"
              min="1"
              max="60"
              class="time-field"
            />
            <span class="time-unit">min</span>
          </div>
        </label>
      </div>
    </div>
    
    <div class="section">
      <h3 class="section-title">Auto Start</h3>
      
      <div class="toggle-group">
        <label class="toggle-label">
          <input type="checkbox" class="toggle-input" />
          <span class="toggle-slider"></span>
          <span>Auto start breaks</span>
        </label>
        
        <label class="toggle-label">
          <input type="checkbox" class="toggle-input" />
          <span class="toggle-slider"></span>
          <span>Auto start pomodoros</span>
        </label>
      </div>
    </div>
    
    <div class="section">
      <h3 class="section-title">Long Break Interval</h3>
      
      <div class="setting-group">
        <label class="setting-label">
          <span>After every</span>
          <div class="time-input">
            <input 
              type="number" 
              value="4"
              min="2"
              max="10"
              class="time-field"
            />
            <span class="time-unit">pomodoros</span>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '../../stores/appStore'

const store = useAppStore()

function updatePomodoroTime(minutes) {
  store.pomodoroTime = parseInt(minutes) * 60
  if (store.timerMode === 'pomodoro') {
    store.timeRemaining = store.pomodoroTime
  }
}

function updateShortBreakTime(minutes) {
  store.shortBreakTime = parseInt(minutes) * 60
  if (store.timerMode === 'shortBreak') {
    store.timeRemaining = store.shortBreakTime
  }
}

function updateLongBreakTime(minutes) {
  store.longBreakTime = parseInt(minutes) * 60
  if (store.timerMode === 'longBreak') {
    store.timeRemaining = store.longBreakTime
  }
}
</script>

<style scoped>
.timer-settings {
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

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.time-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-field {
  width: 60px;
  padding: 8px 12px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
  font-size: 14px;
  text-align: center;
}

.time-field:focus {
  border-color: var(--color-primary);
  background: rgba(255, 255, 255, 0.1);
}

.time-unit {
  font-size: 12px;
  color: var(--color-text-muted);
  min-width: 40px;
}

.toggle-group {
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
  .setting-label {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .time-input {
    align-self: flex-end;
  }
}
</style>