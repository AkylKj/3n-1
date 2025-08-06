/**
 * Модуль сравнения и анализа последовательностей
 * Включает сравнение множественных последовательностей, статистический анализ и поиск паттернов
 */
export class ComparisonAnalyzer {
    constructor() {
        this.sequences = [];
        this.patterns = [];
        this.statistics = {};
        this.isInitialized = false;
        this.charts = {};
    }

    /**
     * Инициализация анализатора
     */
    async init() {
        try {
            console.log('🔍 Инициализация анализатора сравнений...');
            
            // Инициализация базовых паттернов
            this.initializePatterns();
            
            this.isInitialized = true;
            console.log('✅ Анализатор сравнений инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации анализатора сравнений:', error);
            throw error;
        }
    }

    /**
     * Инициализация базовых паттернов
     */
    initializePatterns() {
        this.patterns = [
            {
                name: 'Быстрая сходимость',
                description: 'Последовательности, которые быстро достигают 1',
                condition: (seq) => seq.statistics.length < 20,
                color: '#10b981'
            },
            {
                name: 'Длинная последовательность',
                description: 'Последовательности с большим количеством шагов',
                condition: (seq) => seq.statistics.length > 100,
                color: '#ef4444'
            },
            {
                name: 'Высокий пик',
                description: 'Последовательности с очень высокими значениями',
                condition: (seq) => seq.statistics.maxValue > 10000,
                color: '#f59e0b'
            },
            {
                name: 'Стабильная',
                description: 'Последовательности с небольшими колебаниями',
                condition: (seq) => {
                    const values = seq.sequence;
                    const avg = values.reduce((a, b) => a + b, 0) / values.length;
                    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
                    return Math.sqrt(variance) < avg * 0.5;
                },
                color: '#3b82f6'
            },
            {
                name: 'Циклическая',
                description: 'Последовательности с повторяющимися паттернами',
                condition: (seq) => this.hasCyclicPattern(seq.sequence),
                color: '#8b5cf6'
            },
            {
                name: 'Экспоненциальный рост',
                description: 'Последовательности с быстрым ростом значений',
                condition: (seq) => this.hasExponentialGrowth(seq.sequence),
                color: '#ec4899'
            },
            {
                name: 'Плавная сходимость',
                description: 'Последовательности с плавным уменьшением',
                condition: (seq) => this.hasSmoothConvergence(seq.sequence),
                color: '#06b6d4'
            }
        ];
    }

    /**
     * Проверка на циклические паттерны
     * @param {Array} sequence - Последовательность
     * @returns {boolean} Есть ли циклические паттерны
     */
    hasCyclicPattern(sequence) {
        if (sequence.length < 6) return false;
        
        // Ищем повторяющиеся подпоследовательности
        for (let len = 2; len <= Math.min(10, Math.floor(sequence.length / 2)); len++) {
            for (let start = 0; start <= sequence.length - len * 2; start++) {
                const pattern = sequence.slice(start, start + len);
                const nextPattern = sequence.slice(start + len, start + len * 2);
                
                if (pattern.every((val, idx) => val === nextPattern[idx])) {
                    return true;
                }
            }
        }
        
        return false;
    }

    /**
     * Проверка на экспоненциальный рост
     * @param {Array} sequence - Последовательность
     * @returns {boolean} Есть ли экспоненциальный рост
     */
    hasExponentialGrowth(sequence) {
        if (sequence.length < 5) return false;
        
        let growthCount = 0;
        for (let i = 1; i < sequence.length; i++) {
            if (sequence[i] > sequence[i-1] * 1.5) {
                growthCount++;
            }
        }
        
        return growthCount >= Math.floor(sequence.length * 0.3);
    }

    /**
     * Проверка на плавную сходимость
     * @param {Array} sequence - Последовательность
     * @returns {boolean} Есть ли плавная сходимость
     */
    hasSmoothConvergence(sequence) {
        if (sequence.length < 10) return false;
        
        // Проверяем последние 30% последовательности
        const checkLength = Math.floor(sequence.length * 0.3);
        const endSequence = sequence.slice(-checkLength);
        
        let decreasingCount = 0;
        for (let i = 1; i < endSequence.length; i++) {
            if (endSequence[i] <= endSequence[i-1]) {
                decreasingCount++;
            }
        }
        
        return decreasingCount >= Math.floor(endSequence.length * 0.7);
    }

    /**
     * Добавление последовательности для анализа
     * @param {Object} sequence - Данные последовательности
     */
    addSequence(sequence) {
        this.sequences.push({
            ...sequence,
            id: sequence.id || `seq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            addedAt: new Date(),
            patterns: this.detectPatterns(sequence),
            cycles: this.findCycles(sequence.sequence),
            convergenceAnalysis: this.analyzeConvergence(sequence.sequence)
        });

        // Обновление статистики
        this.updateStatistics();
    }

    /**
     * Поиск циклов в последовательности
     * @param {Array} sequence - Последовательность
     * @returns {Array} Найденные циклы
     */
    findCycles(sequence) {
        const cycles = [];
        
        // Ищем циклы разной длины
        for (let cycleLength = 2; cycleLength <= Math.min(20, Math.floor(sequence.length / 2)); cycleLength++) {
            for (let start = 0; start <= sequence.length - cycleLength * 2; start++) {
                const cycle = sequence.slice(start, start + cycleLength);
                let repeatCount = 1;
                
                // Проверяем повторения
                for (let offset = cycleLength; offset <= sequence.length - cycleLength; offset += cycleLength) {
                    const nextCycle = sequence.slice(start + offset, start + offset + cycleLength);
                    if (cycle.every((val, idx) => val === nextCycle[idx])) {
                        repeatCount++;
                    } else {
                        break;
                    }
                }
                
                if (repeatCount >= 2) {
                    cycles.push({
                        length: cycleLength,
                        start: start,
                        repeats: repeatCount,
                        pattern: cycle,
                        totalLength: cycleLength * repeatCount
                    });
                }
            }
        }
        
        return cycles;
    }

    /**
     * Анализ сходимости последовательности
     * @param {Array} sequence - Последовательность
     * @returns {Object} Анализ сходимости
     */
    analyzeConvergence(sequence) {
        const analysis = {
            convergenceType: 'unknown',
            convergenceSpeed: 0,
            oscillationLevel: 0,
            stabilityScore: 0
        };
        
        if (sequence.length < 3) return analysis;
        
        // Анализ колебаний
        let oscillations = 0;
        for (let i = 1; i < sequence.length - 1; i++) {
            const prev = sequence[i-1];
            const curr = sequence[i];
            const next = sequence[i+1];
            
            if ((curr > prev && curr > next) || (curr < prev && curr < next)) {
                oscillations++;
            }
        }
        
        analysis.oscillationLevel = oscillations / (sequence.length - 2);
        
        // Анализ стабильности
        const differences = [];
        for (let i = 1; i < sequence.length; i++) {
            differences.push(Math.abs(sequence[i] - sequence[i-1]));
        }
        
        const avgDifference = differences.reduce((a, b) => a + b, 0) / differences.length;
        const maxDifference = Math.max(...differences);
        analysis.stabilityScore = 1 - (avgDifference / maxDifference);
        
        // Определение типа сходимости
        const lastValues = sequence.slice(-Math.min(10, Math.floor(sequence.length * 0.2)));
        const isDecreasing = lastValues.every((val, idx) => idx === 0 || val <= lastValues[idx-1]);
        const isConverging = lastValues[lastValues.length - 1] <= Math.max(...lastValues) * 0.5;
        
        if (isDecreasing && isConverging) {
            analysis.convergenceType = 'smooth';
            analysis.convergenceSpeed = 1 - analysis.oscillationLevel;
        } else if (analysis.oscillationLevel > 0.5) {
            analysis.convergenceType = 'oscillating';
            analysis.convergenceSpeed = 0.5;
        } else {
            analysis.convergenceType = 'irregular';
            analysis.convergenceSpeed = 0.3;
        }
        
        return analysis;
    }

    /**
     * Удаление последовательности
     * @param {string} sequenceId - ID последовательности
     */
    removeSequence(sequenceId) {
        this.sequences = this.sequences.filter(seq => seq.id !== sequenceId);
        this.updateStatistics();
    }

    /**
     * Очистка всех последовательностей
     */
    clearSequences() {
        this.sequences = [];
        this.updateStatistics();
    }

    /**
     * Обновление статистики
     */
    updateStatistics() {
        if (this.sequences.length === 0) {
            this.statistics = {};
            return;
        }

        const lengths = this.sequences.map(seq => seq.statistics.length);
        const maxValues = this.sequences.map(seq => seq.statistics.maxValue);
        const stepCounts = this.sequences.map(seq => seq.statistics.steps);

        this.statistics = {
            totalSequences: this.sequences.length,
            averageLength: lengths.reduce((a, b) => a + b, 0) / lengths.length,
            minLength: Math.min(...lengths),
            maxLength: Math.max(...lengths),
            averageMaxValue: maxValues.reduce((a, b) => a + b, 0) / maxValues.length,
            minMaxValue: Math.min(...maxValues),
            maxMaxValue: Math.max(...maxValues),
            averageSteps: stepCounts.reduce((a, b) => a + b, 0) / stepCounts.length,
            minSteps: Math.min(...stepCounts),
            maxSteps: Math.max(...stepCounts),
            patterns: this.analyzePatternDistribution(),
            correlations: this.calculateCorrelations(),
            cycles: this.analyzeCycles(),
            convergence: this.analyzeOverallConvergence()
        };
    }

    /**
     * Анализ циклов во всех последовательностях
     * @returns {Object} Статистика циклов
     */
    analyzeCycles() {
        const cycleStats = {
            totalCycles: 0,
            averageCycleLength: 0,
            mostCommonCycleLength: 0,
            sequencesWithCycles: 0
        };
        
        const cycleLengths = [];
        let totalCycles = 0;
        let sequencesWithCycles = 0;
        
        this.sequences.forEach(seq => {
            if (seq.cycles && seq.cycles.length > 0) {
                sequencesWithCycles++;
                seq.cycles.forEach(cycle => {
                    cycleLengths.push(cycle.length);
                    totalCycles++;
                });
            }
        });
        
        if (cycleLengths.length > 0) {
            cycleStats.totalCycles = totalCycles;
            cycleStats.averageCycleLength = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length;
            cycleStats.sequencesWithCycles = sequencesWithCycles;
            
            // Находим наиболее частую длину цикла
            const lengthCounts = {};
            cycleLengths.forEach(length => {
                lengthCounts[length] = (lengthCounts[length] || 0) + 1;
            });
            
            cycleStats.mostCommonCycleLength = Object.entries(lengthCounts)
                .sort(([,a], [,b]) => b - a)[0][0];
        }
        
        return cycleStats;
    }

    /**
     * Анализ общей сходимости
     * @returns {Object} Статистика сходимости
     */
    analyzeOverallConvergence() {
        const convergenceTypes = {};
        const speeds = [];
        const stabilities = [];
        
        this.sequences.forEach(seq => {
            if (seq.convergenceAnalysis) {
                const type = seq.convergenceAnalysis.convergenceType;
                convergenceTypes[type] = (convergenceTypes[type] || 0) + 1;
                speeds.push(seq.convergenceAnalysis.convergenceSpeed);
                stabilities.push(seq.convergenceAnalysis.stabilityScore);
            }
        });
        
        return {
            types: convergenceTypes,
            averageSpeed: speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0,
            averageStability: stabilities.length > 0 ? stabilities.reduce((a, b) => a + b, 0) / stabilities.length : 0,
            dominantType: Object.entries(convergenceTypes).sort(([,a], [,b]) => b - a)[0]?.[0] || 'unknown'
        };
    }

    /**
     * Детекция паттернов в последовательности
     * @param {Object} sequence - Данные последовательности
     * @returns {Array} Массив найденных паттернов
     */
    detectPatterns(sequence) {
        const detectedPatterns = [];
        
        this.patterns.forEach(pattern => {
            if (pattern.condition(sequence)) {
                detectedPatterns.push({
                    name: pattern.name,
                    description: pattern.description,
                    color: pattern.color
                });
            }
        });

        return detectedPatterns;
    }

    /**
     * Анализ распределения паттернов
     * @returns {Object} Статистика паттернов
     */
    analyzePatternDistribution() {
        const patternCounts = {};
        
        this.patterns.forEach(pattern => {
            patternCounts[pattern.name] = 0;
        });

        this.sequences.forEach(sequence => {
            sequence.patterns.forEach(pattern => {
                patternCounts[pattern.name]++;
            });
        });

        return patternCounts;
    }

    /**
     * Вычисление корреляций между свойствами
     * @returns {Object} Матрица корреляций
     */
    calculateCorrelations() {
        if (this.sequences.length < 2) return {};

        const properties = this.sequences.map(seq => ({
            startNumber: seq.startNumber,
            length: seq.statistics.length,
            maxValue: seq.statistics.maxValue,
            steps: seq.statistics.steps
        }));

        return {
            lengthVsMaxValue: this.calculateCorrelation(
                properties.map(p => p.length),
                properties.map(p => p.maxValue)
            ),
            startNumberVsLength: this.calculateCorrelation(
                properties.map(p => p.startNumber),
                properties.map(p => p.length)
            ),
            startNumberVsMaxValue: this.calculateCorrelation(
                properties.map(p => p.startNumber),
                properties.map(p => p.maxValue)
            ),
            stepsVsLength: this.calculateCorrelation(
                properties.map(p => p.steps),
                properties.map(p => p.length)
            )
        };
    }

    /**
     * Вычисление корреляции Пирсона
     * @param {Array} x - Первый массив значений
     * @param {Array} y - Второй массив значений
     * @returns {number} Коэффициент корреляции
     */
    calculateCorrelation(x, y) {
        const n = x.length;
        if (n !== y.length || n === 0) return 0;

        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
        const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

        return denominator === 0 ? 0 : numerator / denominator;
    }

    /**
     * Поиск аномалий в последовательностях
     * @returns {Array} Массив аномалий
     */
    findAnomalies() {
        const anomalies = [];
        
        if (this.sequences.length < 3) return anomalies;

        const lengths = this.sequences.map(seq => seq.statistics.length);
        const maxValues = this.sequences.map(seq => seq.statistics.maxValue);

        // Поиск выбросов по длине
        const lengthStats = this.calculateOutlierStats(lengths);
        this.sequences.forEach((seq, index) => {
            if (lengths[index] > lengthStats.upperBound || lengths[index] < lengthStats.lowerBound) {
                anomalies.push({
                    type: 'length',
                    sequence: seq,
                    value: lengths[index],
                    description: `Длина ${lengths[index]} выходит за пределы нормального диапазона`,
                    severity: this.calculateAnomalySeverity(lengths[index], lengthStats)
                });
            }
        });

        // Поиск выбросов по максимальному значению
        const maxValueStats = this.calculateOutlierStats(maxValues);
        this.sequences.forEach((seq, index) => {
            if (maxValues[index] > maxValueStats.upperBound || maxValues[index] < maxValueStats.lowerBound) {
                anomalies.push({
                    type: 'maxValue',
                    sequence: seq,
                    value: maxValues[index],
                    description: `Максимальное значение ${maxValues[index]} выходит за пределы нормального диапазона`,
                    severity: this.calculateAnomalySeverity(maxValues[index], maxValueStats)
                });
            }
        });

        // Поиск аномалий в паттернах
        this.sequences.forEach(seq => {
            if (seq.patterns.length === 0) {
                anomalies.push({
                    type: 'pattern',
                    sequence: seq,
                    value: 'no_patterns',
                    description: 'Последовательность не соответствует ни одному известному паттерну',
                    severity: 'medium'
                });
            }
        });

        return anomalies;
    }

    /**
     * Вычисление серьезности аномалии
     * @param {number} value - Значение
     * @param {Object} stats - Статистика
     * @returns {string} Уровень серьезности
     */
    calculateAnomalySeverity(value, stats) {
        const distance = Math.abs(value - (stats.q1 + stats.q3) / 2);
        const iqr = stats.iqr;
        
        if (distance > iqr * 3) return 'high';
        if (distance > iqr * 2) return 'medium';
        return 'low';
    }

    /**
     * Вычисление статистики для поиска выбросов
     * @param {Array} values - Массив значений
     * @returns {Object} Статистика выбросов
     */
    calculateOutlierStats(values) {
        const sorted = [...values].sort((a, b) => a - b);
        const q1 = sorted[Math.floor(sorted.length * 0.25)];
        const q3 = sorted[Math.floor(sorted.length * 0.75)];
        const iqr = q3 - q1;
        
        return {
            q1,
            q3,
            iqr,
            lowerBound: q1 - 1.5 * iqr,
            upperBound: q3 + 1.5 * iqr
        };
    }

    /**
     * Генерация отчета сравнения
     * @returns {Object} Отчет сравнения
     */
    generateComparisonReport() {
        return {
            timestamp: new Date(),
            totalSequences: this.sequences.length,
            statistics: this.statistics,
            patterns: this.analyzePatternDistribution(),
            anomalies: this.findAnomalies(),
            correlations: this.calculateCorrelations(),
            cycles: this.analyzeCycles(),
            convergence: this.analyzeOverallConvergence(),
            sequences: this.sequences.map(seq => ({
                id: seq.id,
                startNumber: seq.startNumber,
                length: seq.statistics.length,
                maxValue: seq.statistics.maxValue,
                patterns: seq.patterns,
                cycles: seq.cycles,
                convergenceAnalysis: seq.convergenceAnalysis
            }))
        };
    }

    /**
     * Экспорт данных сравнения
     * @param {string} format - Формат экспорта ('json', 'csv')
     * @returns {string} Экспортированные данные
     */
    exportComparisonData(format = 'json') {
        const report = this.generateComparisonReport();
        
        if (format === 'json') {
            return JSON.stringify(report, null, 2);
        } else if (format === 'csv') {
            return this.convertToCSV(report);
        }
        
        return '';
    }

    /**
     * Конвертация в CSV формат
     * @param {Object} report - Отчет сравнения
     * @returns {string} CSV данные
     */
    convertToCSV(report) {
        const headers = ['ID', 'Start Number', 'Length', 'Max Value', 'Patterns', 'Cycles', 'Convergence Type'];
        const rows = report.sequences.map(seq => [
            seq.id,
            seq.startNumber,
            seq.length,
            seq.maxValue,
            seq.patterns.map(p => p.name).join('; '),
            seq.cycles ? seq.cycles.length : 0,
            seq.convergenceAnalysis ? seq.convergenceAnalysis.convergenceType : 'unknown'
        ]);
        
        return [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
    }

    /**
     * Получение последовательностей по паттерну
     * @param {string} patternName - Название паттерна
     * @returns {Array} Массив последовательностей с данным паттерном
     */
    getSequencesByPattern(patternName) {
        return this.sequences.filter(seq => 
            seq.patterns.some(pattern => pattern.name === patternName)
        );
    }

    /**
     * Получение статистики по диапазону
     * @param {number} minStart - Минимальное начальное число
     * @param {number} maxStart - Максимальное начальное число
     * @returns {Object} Статистика для диапазона
     */
    getStatisticsByRange(minStart, maxStart) {
        const filteredSequences = this.sequences.filter(seq => 
            seq.startNumber >= minStart && seq.startNumber <= maxStart
        );

        if (filteredSequences.length === 0) return {};

        const lengths = filteredSequences.map(seq => seq.statistics.length);
        const maxValues = filteredSequences.map(seq => seq.statistics.maxValue);

        return {
            count: filteredSequences.length,
            averageLength: lengths.reduce((a, b) => a + b, 0) / lengths.length,
            averageMaxValue: maxValues.reduce((a, b) => a + b, 0) / maxValues.length,
            minLength: Math.min(...lengths),
            maxLength: Math.max(...lengths),
            minMaxValue: Math.min(...maxValues),
            maxMaxValue: Math.max(...maxValues)
        };
    }

    /**
     * Предсказание свойств на основе анализа паттернов
     * @param {number} startNumber - Начальное число
     * @returns {Object} Предсказание свойств
     */
    predictProperties(startNumber) {
        if (this.sequences.length < 5) {
            return {
                confidence: 0,
                message: 'Недостаточно данных для предсказания'
            };
        }

        // Находим похожие последовательности
        const similarSequences = this.sequences
            .filter(seq => Math.abs(seq.startNumber - startNumber) <= 10)
            .sort((a, b) => Math.abs(a.startNumber - startNumber) - Math.abs(b.startNumber - startNumber));

        if (similarSequences.length === 0) {
            return {
                confidence: 0.1,
                message: 'Нет похожих последовательностей для сравнения'
            };
        }

        const avgLength = similarSequences.reduce((sum, seq) => sum + seq.statistics.length, 0) / similarSequences.length;
        const avgMaxValue = similarSequences.reduce((sum, seq) => sum + seq.statistics.maxValue, 0) / similarSequences.length;

        const confidence = Math.min(0.9, similarSequences.length / 10);

        return {
            confidence,
            predictedLength: Math.round(avgLength),
            predictedMaxValue: Math.round(avgMaxValue),
            similarSequences: similarSequences.length,
            patterns: this.findCommonPatterns(similarSequences)
        };
    }

    /**
     * Поиск общих паттернов в группе последовательностей
     * @param {Array} sequences - Массив последовательностей
     * @returns {Array} Общие паттерны
     */
    findCommonPatterns(sequences) {
        const patternCounts = {};
        
        sequences.forEach(seq => {
            seq.patterns.forEach(pattern => {
                patternCounts[pattern.name] = (patternCounts[pattern.name] || 0) + 1;
            });
        });

        return Object.entries(patternCounts)
            .filter(([, count]) => count >= Math.ceil(sequences.length * 0.3))
            .map(([name, count]) => ({
                name,
                frequency: count / sequences.length
            }));
    }
} 