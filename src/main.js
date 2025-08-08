import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Initialize theme on app start
app.mount('#app')

// Initialize default theme after mounting
import { useAppStore } from './stores/appStore'
const store = useAppStore()
store.setTheme('home') // Set default theme