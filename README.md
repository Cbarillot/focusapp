# FocusApp - Advanced Pomodoro Focus Application

A modern, feature-rich Pomodoro timer application built with Vue.js 3, combining the best of both productivity and aesthetic design. This application merges advanced Pomodoro functionality with a beautiful, responsive interface inspired by modern design principles.

![FocusApp Interface](https://github.com/user-attachments/assets/0f637ed6-39f0-4ddb-b714-4ded8d281ca5)

## ✨ Features

### 🍅 Pomodoro Timer
- **Customizable intervals**: Configure work sessions (25min), short breaks (5min), and long breaks (15min)
- **Auto-cycling**: Automatic transition between work and break sessions
- **Visual feedback**: Large, clear timer display with modern glassmorphic design
- **Smart breaks**: Long breaks every 4 completed pomodoro cycles

### 🎨 Dynamic Theming
- **6 Built-in themes**: Purple, Ocean Blue, Forest Green, Cherry Pink, Sunset Orange, and Midnight
- **Custom colors**: Pick your own primary and secondary colors
- **Palette generation**: Extract color schemes from background images automatically
- **Dark/Light mode**: Toggle between interface themes
- **Real-time preview**: See changes instantly across the entire interface

### 🖼️ Dynamic Backgrounds
- **Multiple types**: Gradients, solid colors, images, and videos
- **Curated presets**: Beautiful gradient and image collections
- **Custom uploads**: Upload your own background images and videos
- **Overlay control**: Adjustable opacity for optimal text readability
- **Smooth animations**: Gentle transitions between background changes

### 🎵 Music Integration
- **Streaming services**: Spotify and Deezer integration (API placeholders ready)
- **YouTube Music**: Direct YouTube video embedding with focus music presets
- **Local music**: Upload and manage your own audio files
- **Smart controls**: Auto-play with timer, fade during breaks, loop tracks
- **Volume management**: Master volume control with visual feedback

### ✅ Task Management
- **Full todo system**: Add, edit, complete, and delete tasks
- **Priority levels**: High, medium, and low priority with visual indicators
- **Pomodoro estimates**: Set expected pomodoro count per task
- **Tags system**: Organize tasks with custom tags
- **Filtering & sorting**: Multiple view options for task management
- **Drag & drop**: Reorder tasks with intuitive interactions

### 🎧 Ambient Soundscapes
- **4 Ambient sounds**: Rain, Forest, Café, and Ocean
- **Volume controls**: Individual volume sliders for each soundscape
- **Mix and match**: Combine multiple soundscapes for custom ambiance

## 🛠️ Technical Stack

- **Frontend Framework**: Vue.js 3 with Composition API
- **State Management**: Pinia for reactive state management
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Pure CSS with CSS custom properties for theming
- **Icons**: Custom SVG icon components
- **Responsive Design**: Mobile-first approach with accessible interfaces

## 📁 Project Structure

```
src/
├── components/
│   ├── icons/           # SVG icon components
│   ├── panels/          # Settings panel components
│   ├── DynamicBackground.vue
│   ├── SidePanel.vue
│   └── SoundscapeControls.vue
├── stores/
│   └── appStore.js      # Centralized state management
├── App.vue              # Main application component
├── main.js              # Application entry point
└── style.css            # Global styles and CSS variables

public/
└── assets/              # Static assets directory
    ├── images/          # Background images
    ├── videos/          # Background videos
    └── audio/           # Soundscape and music files
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd focusapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🎨 Customization

### Adding Custom Themes
Add new themes in `src/components/panels/ThemeSettings.vue`:

```javascript
const themes = [
  // ... existing themes
  {
    key: 'custom',
    name: 'Custom Theme',
    colors: {
      primary: '#your-color',
      secondary: '#your-secondary',
      accent: '#your-accent'
    }
  }
]
```

### Adding Background Assets
1. Place images in `public/assets/images/`
2. Place videos in `public/assets/videos/`
3. Update the preset arrays in `BackgroundSettings.vue`

### Music Integration Setup
The application includes placeholder integration for Spotify and Deezer:

1. **Spotify**: Register your app at [Spotify Developer Dashboard](https://developer.spotify.com/)
2. **Deezer**: Get API access at [Deezer Developers](https://developers.deezer.com/)
3. Update the connection functions in `MusicSettings.vue` with your API credentials

## 🌐 Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

Modern browsers with CSS custom properties and ES6+ support.

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile phones (320px - 767px)

## ♿ Accessibility

FocusApp follows accessibility best practices:
- ARIA labels and roles for screen readers
- Keyboard navigation support
- High contrast ratios for text readability
- Focus indicators for interactive elements
- Semantic HTML structure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Future Enhancements

- [ ] Desktop notifications for timer completion
- [ ] Productivity analytics and statistics
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Team collaboration features
- [ ] Mobile app versions
- [ ] Offline functionality with service workers
- [ ] Advanced music streaming integrations
- [ ] Custom soundscape creation

## 📸 Screenshots

### Main Timer Interface
![Main Interface](https://github.com/user-attachments/assets/0f637ed6-39f0-4ddb-b714-4ded8d281ca5)

### Settings Sidebar
![Settings Panel](https://github.com/user-attachments/assets/44c12059-5dd6-4984-8b2f-da83f2aa020d)

### Enhanced Music Integration
![Music Panel](https://github.com/user-attachments/assets/13c394fb-fddf-4ed0-928a-19e9ab0f95d2)

---

**Built with ❤️ for productivity enthusiasts**