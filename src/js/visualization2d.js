/**
 * Модуль 2D визуализации с использованием Chart.js
 * Отвечает за создание и обновление 2D графиков
 */

import Chart from 'chart.js/auto';

// Используем глобальный плагин зума из CDN
// Chart.register(zoomPlugin); // Убираем эту строку, так как плагин уже загружен через CDN

export class Visualization2D {
    constructor() {
        this.chart = null;
        this.isInitialized = false;
        this.chartType = 'line'; // 'line', 'bar', 'scatter'
        this.container = null;
        this.config = {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        };
    }

    /**
     * Инициализация 2D визуализации
     * @param {string} containerId - ID контейнера для графика
     */
    async init(containerId = 'chart2d') {
        try {
            console.log('📊 Инициализация 2D визуализации...');
            console.log('🔍 Ищем контейнер с ID:', containerId);
            
            this.container = document.getElementById(containerId);
            console.log('📦 Найденный контейнер:', this.container);
            
            if (!this.container) {
                console.error('❌ Контейнер не найден!');
                console.log('🔍 Доступные элементы с ID:');
                const allElements = document.querySelectorAll('[id]');
                allElements.forEach(el => console.log('  -', el.id));
                throw new Error(`Контейнер с ID "${containerId}" не найден`);
            }

            console.log('✅ Контейнер найден, создаем график...');
            // Создаем базовый график
            await this.createChart();
            
            this.isInitialized = true;
            
            console.log('✅ 2D визуализация инициализирована');
        } catch (error) {
            console.error('❌ Ошибка инициализации 2D визуализации:', error);
            throw error;
        }
    }

    /**
     * Создает новый график
     */
    async createChart() {
        const ctx = this.container.getContext('2d');
        
        // Уничтожаем существующий график, если есть
        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: this.chartType,
            data: {
                labels: [],
                datasets: []
            },
            options: {
                ...this.config,
                plugins: {
                    title: {
                        display: true,
                        text: 'Последовательность 3n+1',
                        color: '#ffffff',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: true,
                        labels: {
                            color: '#ffffff',
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#3b82f6',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            title: function(context) {
                                return `Шаг ${context[0].dataIndex}`;
                            },
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Шаг',
                            color: '#ffffff'
                        },
                        ticks: {
                            color: '#a1a1aa',
                            maxTicksLimit: 20
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Значение',
                            color: '#ffffff'
                        },
                        ticks: {
                            color: '#a1a1aa'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }

    /**
     * Обновление графика
     * @param {Array} sequences - Массив последовательностей
     */
    async update(sequences) {
        if (!this.isInitialized || !this.chart) {
            console.warn('2D визуализация не инициализирована');
            return;
        }

        try {
            console.log('📈 Обновление 2D графика:', sequences.length, 'последовательностей');

            // Подготавливаем данные для графика
            const chartData = this.prepareChartData(sequences);
            
            // Обновляем данные графика
            this.chart.data.labels = chartData.labels;
            this.chart.data.datasets = chartData.datasets;
            
            // Обновляем график
            this.chart.update('active');

        } catch (error) {
            console.error('❌ Ошибка обновления 2D графика:', error);
        }
    }

    /**
     * Подготавливает данные для графика
     * @param {Array} sequences - Массив последовательностей
     * @returns {Object} Данные для Chart.js
     */
    prepareChartData(sequences) {
        if (!sequences || sequences.length === 0) {
            return {
                labels: [],
                datasets: []
            };
        }

        const datasets = [];
        const maxLength = Math.max(...sequences.map(seq => seq.sequence.length));

        sequences.forEach((sequenceData, index) => {
            const dataset = {
                label: `Число ${sequenceData.startNumber}`,
                data: sequenceData.sequence,
                borderColor: sequenceData.color,
                backgroundColor: this.hexToRgba(sequenceData.color, 0.1),
                borderWidth: 2,
                fill: false,
                tension: 0.1,
                pointRadius: 3,
                pointHoverRadius: 6,
                pointBackgroundColor: sequenceData.color,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2
            };

            datasets.push(dataset);
        });

        // Создаем метки для оси X
        const labels = Array.from({ length: maxLength }, (_, i) => i);

        return {
            labels,
            datasets
        };
    }

    /**
     * Создает гистограмму статистики
     * @param {Array} sequences - Массив последовательностей
     */
    async createStatisticsChart(sequences) {
        if (!sequences || sequences.length === 0) return;

        const statsData = sequences.map(seq => ({
            label: `Число ${seq.startNumber}`,
            length: seq.statistics.length,
            maxValue: seq.statistics.maxValue,
            steps: seq.statistics.steps
        }));

        // Создаем новый график для статистики
        const statsContainer = document.createElement('div');
        statsContainer.className = 'mt-6';
        statsContainer.innerHTML = '<h3 class="text-lg font-semibold mb-4">Статистика последовательностей</h3><canvas id="statsChart" class="w-full h-64"></canvas>';
        
        this.container.parentNode.appendChild(statsContainer);

        const ctx = statsContainer.querySelector('#statsChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: statsData.map(d => d.label),
                datasets: [
                    {
                        label: 'Длина последовательности',
                        data: statsData.map(d => d.length),
                        backgroundColor: '#3b82f6',
                        borderColor: '#2563eb',
                        borderWidth: 1
                    },
                    {
                        label: 'Максимальное значение',
                        data: statsData.map(d => d.maxValue),
                        backgroundColor: '#f59e0b',
                        borderColor: '#d97706',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Сравнение статистики',
                        color: '#ffffff'
                    },
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#a1a1aa'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#a1a1aa'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }

    /**
     * Изменяет тип графика
     * @param {string} type - Тип графика ('line', 'bar', 'scatter')
     */
    async changeChartType(type) {
        if (!this.isInitialized) return;

        this.chartType = type;
        await this.createChart();
    }

    /**
     * Настройка интерактивности для графика
     */
    setupInteractivity() {
        if (!this.chart) return;

        // Добавляем плагины для зума и панорамы
        this.chart.options.plugins.zoom = {
            pan: {
                enabled: true,
                mode: 'xy',
                modifierKey: 'ctrl'
            },
            zoom: {
                wheel: {
                    enabled: true,
                    speed: 0.1
                },
                pinch: {
                    enabled: true
                },
                mode: 'xy'
            }
        };

        // Добавляем анимации при обновлении данных
        this.chart.options.animation = {
            duration: 1000,
            easing: 'easeInOutQuart',
            onProgress: (animation) => {
                // Анимация прогресса
                const progress = animation.currentStep / animation.numSteps;
                this.updateProgressIndicator(progress);
            },
            onComplete: () => {
                // Анимация завершена
                this.hideProgressIndicator();
            }
        };

        // Добавляем интерактивные подсказки
        this.chart.options.plugins.tooltip = {
            ...this.chart.options.plugins.tooltip,
            enabled: true,
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(26, 26, 26, 0.95)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#3b82f6',
            borderWidth: 2,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
                title: (context) => {
                    return `Шаг ${context[0].dataIndex}`;
                },
                label: (context) => {
                    const value = context.parsed.y;
                    const datasetLabel = context.dataset.label;
                    return `${datasetLabel}: ${value.toLocaleString()}`;
                },
                afterLabel: (context) => {
                    // Дополнительная информация
                    const value = context.parsed.y;
                    if (value % 2 === 0) {
                        return 'Четное число';
                    } else {
                        return 'Нечетное число';
                    }
                }
            }
        };

        // Добавляем интерактивные оси
        this.chart.options.scales.x = {
            ...this.chart.options.scales.x,
            grid: {
                color: 'rgba(100, 116, 139, 0.3)',
                drawBorder: true,
                borderColor: 'rgba(100, 116, 139, 0.5)'
            },
            ticks: {
                color: '#a1a1aa',
                callback: (value, index) => {
                    // Показываем только каждый 10-й тик для больших последовательностей
                    if (this.chart.data.labels.length > 50) {
                        return index % 10 === 0 ? value : '';
                    }
                    return value;
                }
            }
        };

        this.chart.options.scales.y = {
            ...this.chart.options.scales.y,
            grid: {
                color: 'rgba(100, 116, 139, 0.3)',
                drawBorder: true,
                borderColor: 'rgba(100, 116, 139, 0.5)'
            },
            ticks: {
                color: '#a1a1aa',
                callback: (value) => {
                    return value.toLocaleString();
                }
            }
        };

        // Добавляем обработчики событий
        this.setupEventHandlers();
    }

    /**
     * Настройка обработчиков событий
     */
    setupEventHandlers() {
        if (!this.chart) return;

        // Обработчик клика по точкам графика
        this.chart.options.onClick = (event, elements) => {
            if (elements.length > 0) {
                const element = elements[0];
                const dataIndex = element.index;
                const datasetIndex = element.datasetIndex;
                const value = this.chart.data.datasets[datasetIndex].data[dataIndex];
                
                this.highlightPoint(dataIndex, datasetIndex);
                this.showPointDetails(dataIndex, value);
            }
        };

        // Обработчик двойного клика для сброса зума
        this.chart.options.onDblClick = () => {
            this.resetZoom();
        };

        // Обработчик наведения для подсветки
        this.chart.options.onHover = (event, elements) => {
            const canvas = this.chart.canvas;
            if (elements.length > 0) {
                canvas.style.cursor = 'pointer';
            } else {
                canvas.style.cursor = 'default';
            }
        };
    }

    /**
     * Подсветка точки на графике
     * @param {number} dataIndex - Индекс данных
     * @param {number} datasetIndex - Индекс набора данных
     */
    highlightPoint(dataIndex, datasetIndex) {
        if (!this.chart) return;

        // Сбрасываем все подсветки
        this.chart.data.datasets.forEach(dataset => {
            dataset.pointBackgroundColor = dataset.originalPointBackgroundColor || dataset.backgroundColor;
            dataset.pointBorderColor = dataset.originalPointBorderColor || dataset.borderColor;
            dataset.pointRadius = dataset.originalPointRadius || 3;
        });

        // Подсвечиваем выбранную точку
        const dataset = this.chart.data.datasets[datasetIndex];
        dataset.pointBackgroundColor = '#ffffff';
        dataset.pointBorderColor = '#3b82f6';
        dataset.pointRadius = 8;
        dataset.pointBorderWidth = 3;

        this.chart.update('none');
    }

    /**
     * Показ деталей точки
     * @param {number} dataIndex - Индекс данных
     * @param {number} value - Значение
     */
    showPointDetails(dataIndex, value) {
        // Создаем временное уведомление с деталями
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 bg-surface border border-secondary/20 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-slide-up';
        notification.innerHTML = `
            <div class="font-semibold mb-2">Детали точки</div>
            <div class="text-sm">
                <div>Шаг: ${dataIndex}</div>
                <div>Значение: ${value.toLocaleString()}</div>
                <div>Тип: ${value % 2 === 0 ? 'Четное' : 'Нечетное'}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    /**
     * Сброс зума
     */
    resetZoom() {
        if (this.chart && this.chart.resetZoom) {
            this.chart.resetZoom();
        }
    }

    /**
     * Обновление индикатора прогресса
     * @param {number} progress - Прогресс (0-1)
     */
    updateProgressIndicator(progress) {
        let indicator = document.getElementById('chartProgressIndicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'chartProgressIndicator';
            indicator.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-lg shadow-lg z-50';
            document.body.appendChild(indicator);
        }
        
        indicator.textContent = `Обновление графика: ${Math.round(progress * 100)}%`;
    }

    /**
     * Скрытие индикатора прогресса
     */
    hideProgressIndicator() {
        const indicator = document.getElementById('chartProgressIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    /**
     * Фильтрация данных по диапазону
     * @param {number} minValue - Минимальное значение
     * @param {number} maxValue - Максимальное значение
     */
    filterData(minValue, maxValue) {
        if (!this.chart) return;

        const originalData = this.chart.data.datasets[0].data;
        const filteredData = originalData.filter(value => value >= minValue && value <= maxValue);
        
        // Обновляем график с отфильтрованными данными
        this.chart.data.datasets[0].data = filteredData;
        this.chart.data.labels = filteredData.map((_, index) => index);
        
        this.chart.update('active');
    }

    /**
     * Восстановление всех данных
     */
    restoreData() {
        if (!this.chart || !this.originalData) return;

        this.chart.data.datasets[0].data = this.originalData;
        this.chart.data.labels = this.originalData.map((_, index) => index);
        
        this.chart.update('active');
    }

    /**
     * Изменение размера графика
     */
    resize() {
        if (this.chart) {
            this.chart.resize();
        }
    }

    /**
     * Экспорт графика в изображение
     * @param {string} format - Формат изображения ('png', 'jpeg', 'webp')
     * @returns {string} Data URL изображения
     */
    exportToImage(format = 'png') {
        if (!this.chart) return null;
        return this.chart.toBase64Image(`image/${format}`);
    }

    /**
     * Конвертирует hex цвет в rgba
     * @param {string} hex - Hex цвет
     * @param {number} alpha - Прозрачность
     * @returns {string} RGBA цвет
     */
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    /**
     * Очистка ресурсов
     */
    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
        this.isInitialized = false;
    }
} 