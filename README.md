# 🧮 3n+1 Hypothesis Visualization

[🇷🇺 Русский](README.ru.md) | [🇺🇸 English](README.md) | [🗺️ Roadmap](roadmap.md)

Interactive web application for visualizing the Collatz conjecture (3n+1) using modern web technologies.

## 📋 About the Project

The Collatz conjecture (also known as the 3n+1 hypothesis) is an unsolved mathematical problem that states that for any positive integer n, the sequence defined as follows always reaches 1:

- If n is even, divide by 2
- If n is odd, multiply by 3 and add 1

This application allows you to:
- Visualize 3n+1 sequences in 2D and 3D
- Compare different sequences
- Analyze statistics and patterns
- Export results

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **2D Visualization**: Chart.js
- **3D Visualization**: Three.js
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Additional**: dat.GUI, Stats.js

## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AkylKj/3n-1
cd 3n-visualization
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Production Build

```bash
npm run build
```

The built files will be in the `dist/` folder.

## 📁 Project Structure

```
3n-visualization/
├── src/
│   ├── js/
│   │   ├── algorithm.js      # 3n+1 algorithm
│   │   ├── dataManager.js    # Data management
│   │   ├── visualization2d.js # 2D visualization (Chart.js)
│   │   ├── visualization3d.js # 3D visualization (Three.js)
│   │   ├── uiController.js   # UI management
│   │   ├── utils.js          # Utilities
│   │   └── main.js           # Main logic
│   ├── css/
│   │   └── style.css         # Styles
│   └── index.html            # Main page
├── public/
│   └── assets/               # Static resources
├── package.json
├── vite.config.js
├── tailwind.config.js
├── [roadmap.md](roadmap.md)               # Development plan
├── ARCHITECTURE.md          # Project architecture
└── README.md
```

## 🎯 Functionality

### Core Features

1. **Input and Computation**
   - Input initial number
   - Generate 3n+1 sequence
   - Input data validation

2. **2D Visualization**
   - Linear sequence graphs
   - Statistics histograms
   - Interactive elements (zoom, pan)

3. **3D Visualization**
   - Volumetric data representation
   - Interactive camera
   - Animations and transitions

4. **Statistics and Analysis**
   - Sequence length
   - Maximum value
   - Step count
   - Pattern analysis

5. **Comparison**
   - Simultaneous display of multiple sequences
   - Comparative statistics

6. **Export**
   - Save graphs
   - Export data to JSON

### Usage Examples

#### Basic Usage
1. Enter a number in the input field (e.g., 27)
2. Click "Compute"
3. Explore the sequence in 2D and 3D visualizations
4. View statistics

#### Sequence Comparison
1. Enter a number
2. Click "Compare"
3. Study differences between sequences

## 🎨 Design

The application uses a dark theme with accent colors:
- **Background**: #1a1a1a
- **Surface**: #2d2d2d
- **Accent**: #3b82f6 (blue)
- **Text**: #ffffff

## 📱 Responsiveness

The application is adapted for various devices:
- **Desktop**: Full functionality
- **Tablet**: Optimized interface
- **Mobile**: Simplified version focused on 2D visualization

## 🔧 Configuration

### Vite Configuration
The `vite.config.js` file contains build and development settings.

### Tailwind CSS Configuration
The `tailwind.config.js` file contains custom colors and styles.

## 🚀 Performance

- Lazy loading of 3D components
- Computation memoization
- User input debouncing
- Optimization for large datasets

## 🐛 Debugging

The application is available globally in the browser for debugging:
```javascript
// Access to main application
window.app

// Access to modules
window.app.dataManager
window.app.visualization2D
window.app.visualization3D
```

## 📈 Metrics

- Load time < 2 seconds
- Smooth animation (60 FPS)
- Support for numbers up to 10^6
- User-friendly interface

## 🤝 Contributing

1. Fork the repository
2. Create a branch for your feature
3. Make your changes
4. Create a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.


## 📞 Support

If you have questions or suggestions, create an Issue in the repository.

---

**Created with ❤️ for mathematics exploration** 