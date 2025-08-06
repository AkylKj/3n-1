// Главный файл приложения
import { CollatzAlgorithm } from './algorithm.js';
import { DataManager } from './dataManager.js';
import { Visualization2D } from './visualization2d.js';
import { Visualization3D } from './visualization3d.js';
import { UIController } from './uiController.js';
import { Utils } from './utils.js';
import { TabManager } from './tabManager.js';
import { AdvancedVisualization } from './advancedVisualization.js';
import { ComparisonAnalyzer } from './comparisonAnalyzer.js';

class App {
    constructor() {
        this.dataManager = new DataManager();
        this.uiController = new UIController();
        this.tabManager = new TabManager();
        this.comparisonAnalyzer = new ComparisonAnalyzer();
        this.visualization2D = null;
        this.visualization3D = null;
        this.advancedVisualization = null;
        this.isInitialized = false;
    }

    async init() {
        try {
            console.log('🚀 Инициализация приложения...');
            
            // Инициализация UI контроллера
            console.log('🎨 Инициализация UI контроллера...');
            await this.uiController.init();
            
            // Инициализация системы вкладок
            console.log('📑 Инициализация системы вкладок...');
            await this.tabManager.init();
            
            // Инициализация анализатора сравнений
            console.log('🔍 Инициализация анализатора сравнений...');
            await this.comparisonAnalyzer.init();
            
            // Инициализация визуализаций
            console.log('📊 Инициализация визуализаций...');
            await this.initVisualizations();
            
            // Настройка обработчиков событий
            console.log('🔗 Настройка обработчиков событий...');
            this.setupEventListeners();
            
            // Загрузка примера
            console.log('📝 Загрузка примера...');
            this.loadExample();
            
            this.isInitialized = true;
            console.log('✅ Приложение успешно инициализировано');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации приложения:', error);
            this.showError('Ошибка инициализации приложения');
        }
    }

    async initVisualizations() {
        try {
            console.log('📊 Начинаем инициализацию визуализаций...');
            
            // Инициализация 2D визуализации
            console.log('📈 Инициализация 2D визуализации...');
            this.visualization2D = new Visualization2D();
            await this.visualization2D.init();
            console.log('✅ 2D визуализация инициализирована');
            
            // Настройка интерактивности для 2D визуализации
            console.log('🔧 Настройка интерактивности 2D...');
            this.visualization2D.setupInteractivity();
            console.log('✅ Интерактивность 2D настроена');
            
            // Инициализация 3D визуализации (ленивая загрузка)
            console.log('🎮 Инициализация 3D визуализации...');
            this.visualization3D = new Visualization3D();
            await this.visualization3D.init();
            console.log('✅ 3D визуализация инициализирована');
            
            // Инициализация расширенных визуализаций
            console.log('📊 Инициализация расширенных визуализаций...');
            this.advancedVisualization = new AdvancedVisualization();
            await this.advancedVisualization.init();
            console.log('✅ Расширенные визуализации инициализированы');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации визуализаций:', error);
            throw error;
        }
    }

    setupEventListeners() {
        console.log('🔗 Настройка обработчиков событий...');
        
        // Обработчик кнопки "Вычислить"
        const calculateBtn = document.getElementById('calculateBtn');
        console.log('🔘 Кнопка "Вычислить":', calculateBtn);
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                console.log('🖱️ Клик по кнопке "Вычислить"');
                this.handleCalculate();
            });
        } else {
            console.error('❌ Кнопка "Вычислить" не найдена!');
        }

        // Обработчик кнопки "Сравнить"
        const compareBtn = document.getElementById('compareBtn');
        console.log('🔘 Кнопка "Сравнить":', compareBtn);
        if (compareBtn) {
            compareBtn.addEventListener('click', () => {
                console.log('🖱️ Клик по кнопке "Сравнить"');
                this.handleCompare();
            });
        } else {
            console.error('❌ Кнопка "Сравнить" не найдена!');
        }

        // Обработчики панели сравнения
        const clearComparisonBtn = document.getElementById('clearComparisonBtn');
        if (clearComparisonBtn) {
            clearComparisonBtn.addEventListener('click', () => {
                console.log('🖱️ Клик по кнопке "Очистить сравнение"');
                this.clearComparison();
            });
        }

        const exportComparisonBtn = document.getElementById('exportComparisonBtn');
        if (exportComparisonBtn) {
            exportComparisonBtn.addEventListener('click', () => {
                console.log('🖱️ Клик по кнопке "Экспорт сравнения"');
                this.exportComparison();
            });
        }

        // Обработчик Enter в поле ввода
        const numberInput = document.getElementById('numberInput');
        console.log('📝 Поле ввода:', numberInput);
        if (numberInput) {
            numberInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    console.log('⌨️ Нажат Enter в поле ввода');
                    this.handleCalculate();
                }
            });
        } else {
            console.error('❌ Поле ввода не найдено!');
        }

        // Обработчики 3D визуализации
        const reset3dBtn = document.getElementById('reset3dBtn');
        if (reset3dBtn) {
            reset3dBtn.addEventListener('click', () => {
                if (this.visualization3D) {
                    this.visualization3D.resetCamera();
                }
            });
        }

        const toggle3dAnimationBtn = document.getElementById('toggle3dAnimationBtn');
        if (toggle3dAnimationBtn) {
            toggle3dAnimationBtn.addEventListener('click', () => {
                if (this.visualization3D) {
                    this.visualization3D.toggleAnimation();
                }
            });
        }

        // Обработчик изменения размера окна
        window.addEventListener('resize', () => this.handleResize());

        // Обработчик смены вкладок
        document.addEventListener('tabChanged', (e) => {
            this.handleTabChange(e.detail);
        });

        // Обработчик изменения размера вкладок
        document.addEventListener('tabResize', (e) => {
            this.handleTabResize(e.detail);
        });
    }

    async handleCalculate() {
        console.log('🔍 handleCalculate вызван');
        
        const input = document.getElementById('numberInput');
        console.log('📝 Input элемент:', input);
        
        const number = parseInt(input.value);
        console.log('🔢 Введенное число:', number);

        if (!number || number < 1) {
            console.log('❌ Неверное число');
            this.showError('Пожалуйста, введите положительное число');
            return;
        }

        if (number > 1000000) {
            console.log('❌ Слишком большое число');
            this.showError('Число слишком большое. Максимум: 1,000,000');
            return;
        }

        try {
            console.log('🚀 Начинаем вычисление...');
            // Показ загрузки с анимацией
            this.uiController.showLoading();
            
            // Генерация последовательности
            console.log('📊 Генерируем последовательность...');
            const sequence = CollatzAlgorithm.generateSequence(number);
            console.log('✅ Последовательность сгенерирована:', sequence.length, 'элементов');
            
            // Добавление в DataManager
            console.log('💾 Добавляем в DataManager...');
            const sequenceData = this.dataManager.addSequence(number, sequence);
            console.log('✅ Данные добавлены:', sequenceData);
            
            // Плавное обновление UI с анимациями
            console.log('🎨 Обновляем UI с анимациями...');
            this.updateUIWithAnimations(sequenceData);
            
            // Обновление визуализаций
            console.log('📈 Обновляем визуализации...');
            await this.updateVisualizations();
            
            console.log('✅ Вычисление завершено успешно');
            // Скрытие загрузки с анимацией
            this.uiController.hideLoading();
            
            // Показ успешного сообщения с анимацией
            this.showSuccessWithAnimation(`Последовательность для числа ${number} успешно вычислена!`);
            
        } catch (error) {
            console.error('❌ Ошибка вычисления:', error);
            this.showError('Ошибка при вычислении последовательности');
            this.uiController.hideLoading();
        }
    }

    async handleCompare() {
        const input = document.getElementById('numberInput');
        const number = parseInt(input.value);

        if (!number || number < 1) {
            this.showError('Пожалуйста, введите положительное число');
            return;
        }

        // Добавляем несколько последовательностей для сравнения
        const numbersToCompare = [number, number + 1, number + 2, number + 3, number + 5, number + 7];
        
        try {
            this.showLoading(true);
            
            // Очищаем предыдущие данные сравнения
            this.comparisonAnalyzer.clearSequences();
            
            for (const num of numbersToCompare) {
                const sequence = CollatzAlgorithm.generateSequence(num);
                const sequenceData = this.dataManager.addSequence(num, sequence);
                
                // Добавляем в анализатор сравнений
                this.comparisonAnalyzer.addSequence(sequenceData);
            }
            
            // Обновление визуализаций
            await this.updateVisualizations();
            
            // Показываем панель сравнения
            this.showComparisonPanel();
            
            // Обновляем графики сравнения
            this.updateComparisonCharts();
            
            this.showLoading(false);
            
        } catch (error) {
            console.error('Ошибка сравнения:', error);
            this.showError('Ошибка при сравнении последовательностей');
            this.showLoading(false);
        }
    }

    /**
     * Показ панели сравнения
     */
    showComparisonPanel() {
        const panel = document.getElementById('comparisonPanel');
        if (panel) {
            panel.style.display = 'block';
            panel.scrollIntoView({ behavior: 'smooth' });
        }
        
        this.updateComparisonStatistics();
        this.updateComparisonTables();
    }

    /**
     * Обновление статистики сравнения
     */
    updateComparisonStatistics() {
        const report = this.comparisonAnalyzer.generateComparisonReport();
        const anomalies = this.comparisonAnalyzer.findAnomalies();
        
        // Обновляем статистику
        document.getElementById('totalSequences').textContent = report.totalSequences;
        document.getElementById('averageLength').textContent = report.statistics.averageLength?.toFixed(1) || '-';
        document.getElementById('averageMaxValue').textContent = report.statistics.averageMaxValue?.toLocaleString() || '-';
        document.getElementById('anomaliesCount').textContent = anomalies.length;
        
        // Анимация обновления
        this.animateComparisonStatistics();
    }

    /**
     * Анимация статистики сравнения
     */
    animateComparisonStatistics() {
        const statElements = document.querySelectorAll('#comparisonStatistics .stat-card p');
        statElements.forEach(element => {
            element.style.transform = 'scale(1.1)';
            element.style.transition = 'transform 0.3s ease';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 300);
        });
    }

    /**
     * Обновление таблиц сравнения
     */
    updateComparisonTables() {
        const report = this.comparisonAnalyzer.generateComparisonReport();
        
        // Обновляем список паттернов
        this.updatePatternsList(report.patterns);
        
        // Обновляем список аномалий
        this.updateAnomaliesList(report.anomalies);
        
        // Обновляем таблицу последовательностей
        this.updateSequencesTable(report.sequences);
    }

    /**
     * Обновление списка паттернов
     */
    updatePatternsList(patterns) {
        const patternsList = document.getElementById('patternsList');
        if (!patternsList) return;
        
        const activePatterns = Object.entries(patterns).filter(([, count]) => count > 0);
        
        if (activePatterns.length === 0) {
            patternsList.innerHTML = '<p class="text-text-secondary text-sm">Нет данных для анализа</p>';
            return;
        }
        
        patternsList.innerHTML = activePatterns.map(([pattern, count]) => `
            <div class="flex items-center justify-between p-2 bg-surface rounded">
                <span class="text-sm">${pattern}</span>
                <span class="text-xs bg-primary text-white px-2 py-1 rounded">${count}</span>
            </div>
        `).join('');
    }

    /**
     * Обновление списка аномалий
     */
    updateAnomaliesList(anomalies) {
        const anomaliesList = document.getElementById('anomaliesList');
        if (!anomaliesList) return;
        
        if (anomalies.length === 0) {
            anomaliesList.innerHTML = '<p class="text-text-secondary text-sm">Аномалии не обнаружены</p>';
            return;
        }
        
        anomaliesList.innerHTML = anomalies.map(anomaly => `
            <div class="p-2 bg-surface rounded border-l-4 border-${this.getSeverityColor(anomaly.severity)}">
                <div class="text-sm font-medium">${anomaly.sequence.startNumber}</div>
                <div class="text-xs text-text-secondary">${anomaly.description}</div>
            </div>
        `).join('');
    }

    /**
     * Получение цвета для уровня серьезности
     */
    getSeverityColor(severity) {
        switch (severity) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'success';
            default: return 'secondary';
        }
    }

    /**
     * Обновление таблицы последовательностей
     */
    updateSequencesTable(sequences) {
        const tableBody = document.getElementById('sequencesTableBody');
        if (!tableBody) return;
        
        if (sequences.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-text-secondary">Нет данных</td></tr>';
            return;
        }
        
        tableBody.innerHTML = sequences.map(seq => `
            <tr class="border-b border-secondary/20 hover:bg-surface/50">
                <td class="py-2 px-3">${seq.startNumber}</td>
                <td class="py-2 px-3">${seq.length}</td>
                <td class="py-2 px-3">${seq.maxValue.toLocaleString()}</td>
                <td class="py-2 px-3">
                    <div class="flex flex-wrap gap-1">
                        ${seq.patterns.map(pattern => 
                            `<span class="text-xs px-2 py-1 rounded" style="background-color: ${pattern.color}20; color: ${pattern.color}">${pattern.name}</span>`
                        ).join('')}
                    </div>
                </td>
                <td class="py-2 px-3">
                    <button onclick="app.removeSequenceFromComparison('${seq.id}')" class="text-xs text-error hover:text-error/80">
                        Удалить
                    </button>
                </td>
            </tr>
        `).join('');
    }

    /**
     * Удаление последовательности из сравнения
     */
    removeSequenceFromComparison(sequenceId) {
        this.comparisonAnalyzer.removeSequence(sequenceId);
        this.updateComparisonStatistics();
        this.updateComparisonTables();
        this.updateComparisonCharts();
    }

    /**
     * Обновление графиков сравнения
     */
    updateComparisonCharts() {
        this.createComparisonChart();
        this.createCorrelationChart();
    }

    /**
     * Создание графика сравнения
     */
    createComparisonChart() {
        const ctx = document.getElementById('comparisonChart');
        if (!ctx) return;
        
        // Уничтожаем предыдущий график
        if (this.comparisonAnalyzer.charts.comparison) {
            this.comparisonAnalyzer.charts.comparison.destroy();
        }
        
        const sequences = this.comparisonAnalyzer.sequences;
        const labels = sequences.map(seq => seq.startNumber);
        const lengths = sequences.map(seq => seq.statistics.length);
        const maxValues = sequences.map(seq => seq.statistics.maxValue);
        
        this.comparisonAnalyzer.charts.comparison = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Длина последовательности',
                        data: lengths,
                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Максимальное значение (÷100)',
                        data: maxValues.map(v => v / 100),
                        backgroundColor: 'rgba(245, 158, 11, 0.8)',
                        borderColor: 'rgba(245, 158, 11, 1)',
                        borderWidth: 1
                    }
                ]
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
                    x: {
                        ticks: {
                            color: '#a1a1aa'
                        },
                        grid: {
                            color: 'rgba(100, 116, 139, 0.2)'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#a1a1aa'
                        },
                        grid: {
                            color: 'rgba(100, 116, 139, 0.2)'
                        }
                    }
                }
            }
        });
    }

    /**
     * Создание графика корреляций
     */
    createCorrelationChart() {
        const ctx = document.getElementById('correlationChart');
        if (!ctx) return;
        
        // Уничтожаем предыдущий график
        if (this.comparisonAnalyzer.charts.correlation) {
            this.comparisonAnalyzer.charts.correlation.destroy();
        }
        
        const correlations = this.comparisonAnalyzer.calculateCorrelations();
        const labels = Object.keys(correlations).map(key => 
            key.replace('Vs', ' vs ').replace(/([A-Z])/g, ' $1')
        );
        const values = Object.values(correlations);
        
        this.comparisonAnalyzer.charts.correlation = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Корреляция',
                    data: values,
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    borderColor: 'rgba(139, 92, 246, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(139, 92, 246, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
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
                        max: 1,
                        min: -1,
                        ticks: {
                            color: '#a1a1aa',
                            stepSize: 0.5
                        },
                        grid: {
                            color: 'rgba(100, 116, 139, 0.2)'
                        },
                        pointLabels: {
                            color: '#a1a1aa'
                        }
                    }
                }
            }
        });
    }

    /**
     * Очистка сравнения
     */
    clearComparison() {
        this.comparisonAnalyzer.clearSequences();
        
        // Скрываем панель сравнения
        const panel = document.getElementById('comparisonPanel');
        if (panel) {
            panel.style.display = 'none';
        }
        
        // Уничтожаем графики
        if (this.comparisonAnalyzer.charts.comparison) {
            this.comparisonAnalyzer.charts.comparison.destroy();
            this.comparisonAnalyzer.charts.comparison = null;
        }
        if (this.comparisonAnalyzer.charts.correlation) {
            this.comparisonAnalyzer.charts.correlation.destroy();
            this.comparisonAnalyzer.charts.correlation = null;
        }
        
        this.showSuccess('Сравнение очищено');
    }

    /**
     * Экспорт данных сравнения
     */
    exportComparison() {
        try {
            const jsonData = this.comparisonAnalyzer.exportComparisonData('json');
            const csvData = this.comparisonAnalyzer.exportComparisonData('csv');
            
            // Создаем файл для скачивания
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const jsonBlob = new Blob([jsonData], { type: 'application/json' });
            const csvBlob = new Blob([csvData], { type: 'text/csv' });
            
            // Создаем ссылки для скачивания
            const jsonUrl = URL.createObjectURL(jsonBlob);
            const csvUrl = URL.createObjectURL(csvBlob);
            
            // Создаем элементы для скачивания
            const jsonLink = document.createElement('a');
            jsonLink.href = jsonUrl;
            jsonLink.download = `comparison_${timestamp}.json`;
            jsonLink.click();
            
            const csvLink = document.createElement('a');
            csvLink.href = csvUrl;
            csvLink.download = `comparison_${timestamp}.csv`;
            csvLink.click();
            
            // Очищаем URL
            URL.revokeObjectURL(jsonUrl);
            URL.revokeObjectURL(csvUrl);
            
            this.showSuccess('Данные сравнения экспортированы');
            
        } catch (error) {
            console.error('Ошибка экспорта:', error);
            this.showError('Ошибка при экспорте данных');
        }
    }

    updateUI(sequenceData) {
        // Обновление статистики
        const stats = sequenceData.statistics;
        
        document.getElementById('sequenceLength').textContent = stats.length;
        document.getElementById('maxValue').textContent = stats.maxValue.toLocaleString();
        document.getElementById('stepCount').textContent = stats.steps;
        document.getElementById('status').textContent = stats.hasReachedOne ? '✓ Завершена' : '⚠ Не завершена';
        
        // Обновление деталей последовательности
        this.updateSequenceDetails(sequenceData);
        
        // Анимация обновления статистики
        this.animateStatistics();
    }

    updateUIWithAnimations(sequenceData) {
        console.log('🎨 Плавное обновление UI с анимациями:', sequenceData);
        
        // Плавное обновление статистики с анимациями
        this.updateSequenceDetailsWithAnimations(sequenceData);
        
        // Анимация статистики
        this.animateStatistics();
        
        // Обновление UI контроллера с анимациями
        this.uiController.updateUI();
        
        // Добавление микроанимаций
        this.uiController.addMicroAnimations();
    }

    updateSequenceDetailsWithAnimations(sequenceData) {
        const stats = {
            sequenceLength: sequenceData.statistics.length,
            maxValue: sequenceData.statistics.maxValue.toLocaleString(),
            stepCount: sequenceData.statistics.steps,
            status: sequenceData.statistics.hasReachedOne ? '✓ Завершена' : '⚠ Не завершена'
        };
        
        // Плавное обновление статистических значений с анимациями
        this.uiController.updateStatisticsWithAnimation(stats);
    }

    updateSequenceDetails(sequenceData) {
        const detailsContainer = document.getElementById('sequenceDetails');
        const sequence = sequenceData.sequence;
        
        let detailsHTML = '';
        
        // Показываем первые 20 и последние 10 элементов
        const showFirst = 20;
        const showLast = 10;
        
        if (sequence.length <= showFirst + showLast) {
            // Если последовательность короткая, показываем все
            detailsHTML = sequence.map((num, index) => 
                `<span class="sequence-number">${num}</span>${index < sequence.length - 1 ? ' → ' : ''}`
            ).join('');
        } else {
            // Показываем первые элементы
            const firstPart = sequence.slice(0, showFirst).map((num, index) => 
                `<span class="sequence-number">${num}</span>${index < showFirst - 1 ? ' → ' : ''}`
            ).join('');
            
            // Показываем многоточие
            const middlePart = `<span class="sequence-step">... (${sequence.length - showFirst - showLast} элементов) ...</span>`;
            
            // Показываем последние элементы
            const lastPart = sequence.slice(-showLast).map((num, index) => 
                `<span class="sequence-number">${num}</span>${index < showLast - 1 ? ' → ' : ''}`
            ).join('');
            
            detailsHTML = firstPart + ' → ' + middlePart + ' → ' + lastPart;
        }
        
        detailsContainer.innerHTML = detailsHTML;
    }

    animateStatistics() {
        const statElements = document.querySelectorAll('.stat-value');
        statElements.forEach(element => {
            element.classList.add('updated');
            setTimeout(() => {
                element.classList.remove('updated');
            }, 300);
        });
    }

    async updateVisualizations() {
        const sequences = this.dataManager.getSequences();
        
        if (sequences.length === 0) return;
        
        try {
            // Обновление 2D визуализации
            if (this.visualization2D) {
                await this.visualization2D.update(sequences);
            }
            
            // Обновление 3D визуализации
            if (this.visualization3D) {
                await this.visualization3D.update(sequences);
            }
            
            // Обновление расширенных визуализаций
            if (this.advancedVisualization) {
                this.advancedVisualization.updateCharts(sequences);
            }
            
        } catch (error) {
            console.error('Ошибка обновления визуализаций:', error);
        }
    }

    handleResize() {
        // Обновление размеров визуализаций при изменении размера окна
        if (this.visualization2D) {
            this.visualization2D.resize();
        }
        
        if (this.visualization3D) {
            this.visualization3D.resize();
        }

        if (this.advancedVisualization) {
            this.advancedVisualization.handleResize();
        }
    }

    loadExample() {
        // Загружаем пример с числом 27 (известная длинная последовательность)
        document.getElementById('numberInput').value = '27';
    }

    showLoading(show) {
        const loadingElements = document.querySelectorAll('[id$="Loading"]');
        loadingElements.forEach(element => {
            element.classList.toggle('hidden', !show);
        });
    }

    showError(message) {
        // Создаем временное уведомление об ошибке
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-error text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showSuccess(message) {
        // Создаем временное уведомление об успехе
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-success text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showSuccessWithAnimation(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-success text-white px-6 py-3 rounded-lg shadow-lg z-50';
        successDiv.innerHTML = `
            <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(successDiv);
        
        // Анимация появления с плавным эффектом
        successDiv.style.opacity = '0';
        successDiv.style.transform = 'translateX(100%) scale(0.9)';
        
        setTimeout(() => {
            successDiv.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            successDiv.style.opacity = '1';
            successDiv.style.transform = 'translateX(0) scale(1)';
        }, 100);
        
        // Эффект пульсации
        setTimeout(() => {
            successDiv.style.transform = 'translateX(0) scale(1.05)';
            setTimeout(() => {
                successDiv.style.transform = 'translateX(0) scale(1)';
            }, 150);
        }, 600);
        
        // Удаление через 4 секунды с плавной анимацией
        setTimeout(() => {
            successDiv.style.opacity = '0';
            successDiv.style.transform = 'translateX(100%) scale(0.9)';
            setTimeout(() => {
                if (document.body.contains(successDiv)) {
                    document.body.removeChild(successDiv);
                }
            }, 500);
        }, 4000);
    }

    /**
     * Обработка смены вкладки
     * @param {Object} detail - Детали события смены вкладки
     */
    async handleTabChange(detail) {
        const { tabId } = detail;
        console.log(`🔄 Обработка смены вкладки: ${tabId}`);
        
        try {
            // Обновление визуализаций в зависимости от активной вкладки
            if (tabId === '2d') {
                // Обновление 2D визуализации
                const sequences = this.dataManager.getSequences();
                if (sequences.length > 0 && this.visualization2D) {
                    await this.visualization2D.update(sequences);
                }
            } else if (tabId === '3d') {
                // Обновление 3D визуализации
                const sequences = this.dataManager.getSequences();
                if (sequences.length > 0 && this.visualization3D) {
                    await this.visualization3D.update(sequences);
                }
            } else if (tabId === 'advanced') {
                // Обновление расширенных визуализаций
                const sequences = this.dataManager.getSequences();
                if (sequences.length > 0 && this.advancedVisualization) {
                    this.advancedVisualization.updateCharts(sequences);
                }
            }
            
            // Сохранение состояния вкладки
            this.tabManager.saveTabStateData(tabId, {
                lastVisited: Date.now(),
                hasData: this.dataManager.getSequences().length > 0
            });
            
        } catch (error) {
            console.error('Ошибка обработки смены вкладки:', error);
        }
    }

    /**
     * Обработка изменения размера вкладки
     * @param {Object} detail - Детали события изменения размера
     */
    async handleTabResize(detail) {
        const { tabId } = detail;
        console.log(`📏 Обработка изменения размера вкладки: ${tabId}`);
        
        try {
            // Обновление размеров визуализаций в зависимости от активной вкладки
            if (tabId === '2d' && this.visualization2D) {
                this.visualization2D.resize();
            } else if (tabId === '3d' && this.visualization3D) {
                this.visualization3D.resize();
            } else if (tabId === 'advanced' && this.advancedVisualization) {
                this.advancedVisualization.handleResize();
            }
            
        } catch (error) {
            console.error('Ошибка обработки изменения размера вкладки:', error);
        }
    }
}

// Инициализация приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    const app = new App();
    await app.init();
    
    // Делаем приложение доступным глобально для отладки
    window.app = app;
});

// Обработка ошибок
window.addEventListener('error', (event) => {
    console.error('Глобальная ошибка:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Необработанное отклонение промиса:', event.reason);
}); 