# 🏗️ Архитектура проекта "Визуализация гипотезы 3n+1"

## 📐 Общая архитектура

### Модульная структура
Проект построен на модульной архитектуре с четким разделением ответственности:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Layer      │    │  Business Logic │    │  Visualization  │
│                 │    │                 │    │                 │
│ - Input Forms   │◄──►│ - Algorithm     │◄──►│ - Chart.js      │
│ - Controls      │    │ - Data Manager  │    │ - Three.js      │
│ - Statistics    │    │ - State Manager │    │ - Export        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🧩 Основные компоненты

### 1. Algorithm Module (`algorithm.js`)
**Ответственность**: Вычисление последовательности 3n+1

```javascript
class CollatzAlgorithm {
  // Вычисляет последовательность для заданного числа
  static generateSequence(startNumber)
  
  // Вычисляет статистику последовательности
  static calculateStatistics(sequence)
  
  // Оптимизированное вычисление для больших чисел
  static generateSequenceOptimized(startNumber)
}
```

### 2. Data Manager (`dataManager.js`)
**Ответственность**: Управление данными и состоянием

```javascript
class DataManager {
  // Хранение текущих последовательностей
  sequences = []
  
  // Добавление новой последовательности
  addSequence(startNumber)
  
  // Удаление последовательности
  removeSequence(id)
  
  // Получение статистики
  getStatistics()
}
```

### 3. Visualization 2D (`visualization2d.js`)
**Ответственность**: 2D визуализация с Chart.js

```javascript
class Visualization2D {
  // Создание линейного графика
  createLineChart(container, data)
  
  // Создание гистограммы статистики
  createHistogram(container, data)
  
  // Обновление графика
  updateChart(newData)
  
  // Настройка интерактивности
  setupInteractivity()
}
```

### 4. Visualization 3D (`visualization3d.js`)
**Ответственность**: 3D визуализация с Three.js

```javascript
class Visualization3D {
  // Инициализация 3D сцены
  initScene(container)
  
  // Создание 3D представления последовательности
  createSequenceVisualization(sequence)
  
  // Управление камерой
  setupCameraControls()
  
  // Анимации
  animate()
}
```

### 5. UI Controller (`uiController.js`)
**Ответственность**: Управление пользовательским интерфейсом

```javascript
class UIController {
  // Обработка ввода пользователя
  handleInput()
  
  // Обновление UI элементов
  updateUI()
  
  // Управление событиями
  setupEventListeners()
  
  // Плавные анимации
  animateTransition()
}
```

### 6. Prediction Engine (`predictionEngine.js`)
**Ответственность**: Предсказание свойств последовательностей

```javascript
class PredictionEngine {
  // Предсказание всех свойств последовательности
  predictSequenceProperties(startNumber)
  
  // Анализ паттернов в базе данных
  analyzePatterns()
  
  // Вычисление уверенности предсказания
  calculateConfidence(prediction, actual)
  
  // Обновление модели на основе новых данных
  updateModel(newData)
}
```

## 📊 Структура данных

### Последовательность 3n+1
```javascript
{
  id: "unique-id",
  startNumber: 27,
  sequence: [27, 82, 41, 124, 62, 31, 94, 47, 142, 71, 214, 107, 322, 161, 484, 242, 121, 364, 182, 91, 274, 137, 412, 206, 103, 310, 155, 466, 233, 700, 350, 175, 526, 263, 790, 395, 1186, 593, 1780, 890, 445, 1336, 668, 334, 167, 502, 251, 754, 377, 1132, 566, 283, 850, 425, 1276, 638, 319, 958, 479, 1438, 719, 2158, 1079, 3238, 1619, 4858, 2429, 7288, 3644, 1822, 911, 2734, 1367, 4102, 2051, 6154, 3077, 9232, 4616, 2308, 1154, 577, 1732, 866, 433, 1300, 650, 325, 976, 488, 244, 122, 61, 184, 92, 46, 23, 70, 35, 106, 53, 160, 80, 40, 20, 10, 5, 16, 8, 4, 2, 1],
  statistics: {
    length: 112,
    maxValue: 9232,
    steps: 111,
    hasReachedOne: true
  },
  color: "#3b82f6",
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

### Статистика
```javascript
{
  totalSequences: 5,
  averageLength: 45.2,
  maxLength: 112,
  minLength: 1,
  mostCommonMaxValue: 9232,
  sequencesReachingOne: 5
}
```

### Предсказание
```javascript
{
  startNumber: 27,
  predictions: {
    length: {
      min: 95,
      max: 125,
      confidence: 0.85,
      unit: "шагов"
    },
    maxValue: {
      min: 8000,
      max: 12000,
      confidence: 0.78,
      unit: "число"
    },
    convergenceTime: {
      min: 80,
      max: 110,
      confidence: 0.82,
      unit: "шагов"
    }
  },
  modelVersion: "1.0",
  lastUpdated: "2024-01-01T00:00:00.000Z"
}
```

## 🔄 Поток данных

### 1. Ввод пользователя
```
User Input → UIController → DataManager → Algorithm → Visualization
```

### 2. Обновление визуализации
```
DataManager → Visualization2D/3D → DOM Update
```

### 3. Экспорт данных
```
DataManager → Export Module → File Download
```

## 🎨 UI/UX Дизайн

### Цветовая палитра
- **Primary**: #3b82f6 (синий) - основной акцент
- **Secondary**: #64748b (серый) - вторичные элементы
- **Background**: #1a1a1a (средний темный) - основной фон
- **Surface**: #2d2d2d (средне-серый) - поверхности карточек
- **Text**: #ffffff (белый) - основной текст
- **Text Secondary**: #a1a1aa (светло-серый) - вторичный текст
- **Success**: #10b981 (зеленый) - успешные операции
- **Warning**: #f59e0b (желтый) - предупреждения
- **Error**: #ef4444 (красный) - ошибки
- **Prediction**: #8b5cf6 (фиолетовый) - предсказания

### Компоненты интерфейса

#### 1. Панель ввода
```html
<div class="input-panel">
  <input type="number" placeholder="Введите число...">
  <button class="btn-primary">Вычислить</button>
  <button class="btn-secondary">Сравнить</button>
</div>
```

#### 2. Области визуализации
```html
<div class="visualization-container">
  <div class="chart-2d">
    <canvas id="chart2d"></canvas>
  </div>
  <div class="chart-3d">
    <canvas id="chart3d"></canvas>
  </div>
</div>
```

#### 3. Панель статистики
```html
<div class="statistics-panel">
  <div class="stat-card">
    <h3>Длина последовательности</h3>
    <p class="stat-value">112</p>
  </div>
  <!-- Другие статистики -->
</div>
```

#### 4. Панель предсказаний
```html
<div class="prediction-panel">
  <h3>Предсказание свойств</h3>
  <div class="prediction-card">
    <div class="prediction-item">
      <span class="prediction-label">Длина:</span>
      <span class="prediction-range">95-125</span>
      <span class="prediction-confidence">85%</span>
    </div>
    <div class="prediction-item">
      <span class="prediction-label">Максимум:</span>
      <span class="prediction-range">8000-12000</span>
      <span class="prediction-confidence">78%</span>
    </div>
  </div>
</div>
```

## 🔧 Конфигурация

### Vite Configuration
```javascript
// vite.config.js
export default {
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  server: {
    port: 3000,
    open: true
  }
}
```

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        background: '#1a1a1a',
        surface: '#2d2d2d'
      }
    }
  }
}
```

## 📱 Адаптивность

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Адаптивные компоненты
- Стековое расположение визуализаций на мобильных
- Скрытие 3D визуализации на маленьких экранах
- Уменьшенные элементы управления
- Оптимизированные графики

## 🚀 Производительность и плавность

### Оптимизации
1. **Ленивая загрузка** 3D компонентов
2. **Мемоизация** вычислений алгоритма
3. **Дебаунсинг** пользовательского ввода
4. **Виртуализация** для больших последовательностей
5. **Web Workers** для тяжелых вычислений

### Плавные анимации
1. **Средние скорости** (0.5-1 сек) для всех переходов
2. **Плавные изменения** цветов и размеров
3. **Микроанимации** для интерактивных элементов
4. **Анимации загрузки** и обновления данных
5. **Переходы между вкладками** с плавными эффектами

### Темная тема
1. **Средний темный фон** (#1a1a1a) для комфортного использования
2. **Синий акцент** (#3b82f6) для основных элементов
3. **Правильные контрасты** для читаемости
4. **Уютная атмосфера** для длительного использования

### Мониторинг
- FPS мониторинг с Stats.js
- Время отклика интерфейса
- Использование памяти
- Время загрузки компонентов 