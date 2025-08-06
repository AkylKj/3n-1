/**
 * Модуль расширенных 2D визуализаций
 * Включает радарные, полярные, тепловые карты и древовидные диаграммы
 */
export class AdvancedVisualization {
    constructor() {
        this.charts = {};
        this.isInitialized = false;
        this.chartConfigs = {
            radar: null,
            polar: null,
            heatmap: null,
            tree: null
        };
    }

    /**
     * Инициализация расширенных визуализаций
     */
    async init() {
        try {
            console.log('📊 Инициализация расширенных визуализаций...');
            
            // Инициализация всех типов графиков
            await this.initRadarChart();
            await this.initPolarChart();
            await this.initHeatmapChart();
            await this.initTreeChart();
            
            // Настройка обработчиков событий
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.log('✅ Расширенные визуализации инициализированы');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации расширенных визуализаций:', error);
            throw error;
        }
    }

    /**
     * Инициализация радарной диаграммы
     */
    async initRadarChart() {
        const canvas = document.getElementById('radarChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        this.chartConfigs.radar = {
            type: 'radar',
            data: {
                labels: ['Длина', 'Максимум', 'Скорость сходимости', 'Сложность', 'Уникальность'],
                datasets: [{
                    label: 'Свойства последовательности',
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(100, 116, 139, 0.3)'
                        },
                        angleLines: {
                            color: 'rgba(100, 116, 139, 0.3)'
                        },
                        pointLabels: {
                            color: '#ffffff',
                            font: {
                                size: 12
                            }
                        },
                        ticks: {
                            color: '#a1a1aa',
                            backdropColor: 'transparent'
                        }
                    }
                }
            }
        };

        this.charts.radar = new Chart(ctx, this.chartConfigs.radar);
    }

    /**
     * Инициализация полярного графика
     */
    async initPolarChart() {
        const canvas = document.getElementById('polarChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        this.chartConfigs.polar = {
            type: 'polarArea',
            data: {
                labels: ['Четные шаги', 'Нечетные шаги', 'Пиковые значения', 'Низкие значения'],
                datasets: [{
                    data: [0, 0, 0, 0],
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.6)',
                        'rgba(139, 92, 246, 0.6)',
                        'rgba(239, 68, 68, 0.6)',
                        'rgba(16, 185, 129, 0.6)'
                    ],
                    borderColor: [
                        'rgba(59, 130, 246, 1)',
                        'rgba(139, 92, 246, 1)',
                        'rgba(239, 68, 68, 1)',
                        'rgba(16, 185, 129, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                },
                scales: {
                    r: {
                        grid: {
                            color: 'rgba(100, 116, 139, 0.3)'
                        },
                        pointLabels: {
                            color: '#ffffff'
                        },
                        ticks: {
                            color: '#a1a1aa',
                            backdropColor: 'transparent'
                        }
                    }
                }
            }
        };

        this.charts.polar = new Chart(ctx, this.chartConfigs.polar);
    }

    /**
     * Инициализация тепловой карты
     */
    async initHeatmapChart() {
        const canvas = document.getElementById('heatmapChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Создание данных для тепловой карты
        const heatmapData = this.generateHeatmapData();
        
        this.chartConfigs.heatmap = {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Тепловая карта значений',
                    data: heatmapData,
                    backgroundColor: (context) => {
                        // Проверяем, что context.parsed существует
                        if (!context.parsed || typeof context.parsed.y === 'undefined') {
                            return 'rgba(239, 68, 68, 0.5)';
                        }
                        const value = context.parsed.y;
                        const max = Math.max(...heatmapData.map(d => d.y));
                        const intensity = value / max;
                        return `rgba(239, 68, 68, ${intensity})`;
                    },
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                // Проверяем, что context.parsed существует
                                if (!context.parsed) {
                                    return 'Данные недоступны';
                                }
                                return `Шаг ${context.parsed.x}: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Шаг',
                            color: '#ffffff'
                        },
                        grid: {
                            color: 'rgba(100, 116, 139, 0.3)'
                        },
                        ticks: {
                            color: '#a1a1aa'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Значение',
                            color: '#ffffff'
                        },
                        grid: {
                            color: 'rgba(100, 116, 139, 0.3)'
                        },
                        ticks: {
                            color: '#a1a1aa'
                        }
                    }
                }
            }
        };

        this.charts.heatmap = new Chart(ctx, this.chartConfigs.heatmap);
    }

    /**
     * Инициализация древовидной диаграммы
     */
    async initTreeChart() {
        const canvas = document.getElementById('treeChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Создание данных для древовидной диаграммы
        const treeData = this.generateTreeData();
        
        this.chartConfigs.tree = {
            type: 'bubble',
            data: {
                datasets: [{
                    label: 'Древовидная структура',
                    data: treeData,
                    backgroundColor: (context) => {
                        // Проверяем, что context.parsed существует
                        if (!context.parsed || typeof context.parsed.r === 'undefined') {
                            return 'rgba(16, 185, 129, 0.5)';
                        }
                        const value = context.parsed.r;
                        const max = Math.max(...treeData.map(d => d.r));
                        const intensity = value / max;
                        return `rgba(16, 185, 129, ${intensity})`;
                    },
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                // Проверяем, что context.parsed существует
                                if (!context.parsed) {
                                    return 'Данные недоступны';
                                }
                                return `Уровень ${context.parsed.x}: ${context.parsed.y} (размер: ${context.parsed.r})`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Уровень',
                            color: '#ffffff'
                        },
                        grid: {
                            color: 'rgba(100, 116, 139, 0.3)'
                        },
                        ticks: {
                            color: '#a1a1aa'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Значение',
                            color: '#ffffff'
                        },
                        grid: {
                            color: 'rgba(100, 116, 139, 0.3)'
                        },
                        ticks: {
                            color: '#a1a1aa'
                        }
                    }
                }
            }
        };

        this.charts.tree = new Chart(ctx, this.chartConfigs.tree);
    }

    /**
     * Генерация данных для тепловой карты
     * @returns {Array} Данные для тепловой карты
     */
    generateHeatmapData() {
        const data = [];
        for (let i = 0; i < 50; i++) {
            data.push({
                x: i,
                y: Math.random() * 1000
            });
        }
        return data;
    }

    /**
     * Генерация данных для древовидной диаграммы
     * @returns {Array} Данные для древовидной диаграммы
     */
    generateTreeData() {
        const data = [];
        for (let i = 0; i < 20; i++) {
            data.push({
                x: i,
                y: Math.random() * 100,
                r: Math.random() * 20 + 5
            });
        }
        return data;
    }

    /**
     * Обновление всех графиков с новыми данными
     * @param {Array} sequences - Массив последовательностей
     */
    updateCharts(sequences) {
        if (!sequences || sequences.length === 0) return;

        const sequence = sequences[sequences.length - 1];
        
        try {
            // Обновление радарной диаграммы
            this.updateRadarChart(sequence);
            
            // Обновление полярного графика
            this.updatePolarChart(sequence);
            
            // Обновление тепловой карты
            this.updateHeatmapChart(sequence);
            
            // Обновление древовидной диаграммы
            this.updateTreeChart(sequence);
        } catch (error) {
            console.error('❌ Ошибка обновления расширенных графиков:', error);
        }
    }

    /**
     * Обновление радарной диаграммы
     * @param {Object} sequence - Данные последовательности
     */
    updateRadarChart(sequence) {
        if (!this.charts.radar) return;

        try {
            const stats = sequence.statistics;
            const maxValue = Math.max(...sequence.sequence);
            
            // Нормализация данных для радарной диаграммы
            const data = [
                Math.min(stats.length / 100, 1) * 100, // Длина (нормализованная)
                Math.min(maxValue / 10000, 1) * 100,   // Максимум (нормализованный)
                Math.min(100 / stats.length, 1) * 100, // Скорость сходимости
                Math.min(stats.length / 50, 1) * 100,  // Сложность
                Math.min(new Set(sequence.sequence).size / sequence.sequence.length, 1) * 100 // Уникальность
            ];

            this.chartConfigs.radar.data.datasets[0].data = data;
            this.charts.radar.update('active');
        } catch (error) {
            console.error('❌ Ошибка обновления радарной диаграммы:', error);
        }
    }

    /**
     * Обновление полярного графика
     * @param {Object} sequence - Данные последовательности
     */
    updatePolarChart(sequence) {
        if (!this.charts.polar) return;

        try {
            const seq = sequence.sequence;
            const evenSteps = seq.filter((_, i) => i % 2 === 0).length;
            const oddSteps = seq.filter((_, i) => i % 2 === 1).length;
            const peakValues = seq.filter(val => val > Math.max(...seq) * 0.8).length;
            const lowValues = seq.filter(val => val < Math.max(...seq) * 0.2).length;

            this.chartConfigs.polar.data.datasets[0].data = [
                evenSteps,
                oddSteps,
                peakValues,
                lowValues
            ];
            
            this.charts.polar.update('active');
        } catch (error) {
            console.error('❌ Ошибка обновления полярного графика:', error);
        }
    }

    /**
     * Обновление тепловой карты
     * @param {Object} sequence - Данные последовательности
     */
    updateHeatmapChart(sequence) {
        if (!this.charts.heatmap) return;

        try {
            const data = sequence.sequence.map((value, index) => ({
                x: index,
                y: value
            }));

            this.chartConfigs.heatmap.data.datasets[0].data = data;
            this.charts.heatmap.update('active');
        } catch (error) {
            console.error('❌ Ошибка обновления тепловой карты:', error);
        }
    }

    /**
     * Обновление древовидной диаграммы
     * @param {Object} sequence - Данные последовательности
     */
    updateTreeChart(sequence) {
        if (!this.charts.tree) return;

        try {
            const data = [];
            const seq = sequence.sequence;
            const chunkSize = Math.ceil(seq.length / 20);
            
            for (let i = 0; i < 20; i++) {
                const start = i * chunkSize;
                const end = Math.min(start + chunkSize, seq.length);
                const chunk = seq.slice(start, end);
                const avgValue = chunk.reduce((a, b) => a + b, 0) / chunk.length;
                const maxInChunk = Math.max(...chunk);
                
                data.push({
                    x: i,
                    y: avgValue,
                    r: Math.min(maxInChunk / 100, 25)
                });
            }

            this.chartConfigs.tree.data.datasets[0].data = data;
            this.charts.tree.update('active');
        } catch (error) {
            console.error('❌ Ошибка обновления древовидной диаграммы:', error);
        }
    }

    /**
     * Настройка обработчиков событий
     */
    setupEventListeners() {
        // Обработчики для кнопок экспорта
        const exportButtons = [
            'exportRadarBtn', 'exportPolarBtn', 
            'exportHeatmapBtn', 'exportTreeBtn'
        ];

        exportButtons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleExport(btnId);
                });
            }
        });

        // Обработчик изменения размера окна
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    /**
     * Обработка экспорта графиков
     * @param {string} buttonId - ID кнопки экспорта
     */
    handleExport(buttonId) {
        const chartMap = {
            'exportRadarBtn': 'radarChart',
            'exportPolarBtn': 'polarChart',
            'exportHeatmapBtn': 'heatmapChart',
            'exportTreeBtn': 'treeChart'
        };

        const chartId = chartMap[buttonId];
        if (chartId) {
            this.exportChart(chartId);
        }
    }

    /**
     * Экспорт графика в PNG
     * @param {string} chartId - ID canvas графика
     */
    exportChart(chartId) {
        try {
            const canvas = document.getElementById(chartId);
            if (canvas) {
                const link = document.createElement('a');
                link.download = `${chartId}_${new Date().toISOString().slice(0, 10)}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                
                console.log(`📊 Экспорт расширенного графика: ${chartId}`);
            }
        } catch (error) {
            console.error('Ошибка экспорта расширенного графика:', error);
        }
    }

    /**
     * Обработка изменения размера окна
     */
    handleResize() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.resize();
            }
        });
    }

    /**
     * Показ/скрытие индикаторов загрузки
     * @param {boolean} show - Показывать ли индикаторы загрузки
     */
    showLoading(show) {
        const loadingElements = [
            'radarChartLoading',
            'polarChartLoading',
            'heatmapChartLoading',
            'treeChartLoading'
        ];

        loadingElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.toggle('hidden', !show);
            }
        });
    }

    /**
     * Очистка всех графиков
     */
    clearCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        this.charts = {};
    }
} 