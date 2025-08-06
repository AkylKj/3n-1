/**
 * Модуль алгоритма 3n+1 (гипотеза Коллатца)
 * 
 * Гипотеза Коллатца утверждает, что для любого положительного целого числа n
 * последовательность, определенная следующим образом, всегда достигает 1:
 * 
 * - Если n четное, разделить на 2
 * - Если n нечетное, умножить на 3 и добавить 1
 * 
 * Последовательность: n → n/2 (если n четное) или n → 3n + 1 (если n нечетное)
 */

export class CollatzAlgorithm {
    
    /**
     * Генерирует последовательность 3n+1 для заданного числа
     * @param {number} startNumber - Начальное число
     * @returns {Array<number>} Массив чисел последовательности
     */
    static generateSequence(startNumber) {
        if (!Number.isInteger(startNumber) || startNumber < 1) {
            throw new Error('Начальное число должно быть положительным целым числом');
        }

        const sequence = [startNumber];
        let current = startNumber;
        const maxIterations = 1000000; // Защита от бесконечных циклов
        let iterations = 0;

        while (current !== 1 && iterations < maxIterations) {
            if (current % 2 === 0) {
                // Четное число - делим на 2
                current = current / 2;
            } else {
                // Нечетное число - умножаем на 3 и добавляем 1
                current = 3 * current + 1;
            }
            
            sequence.push(current);
            iterations++;
        }

        if (iterations >= maxIterations) {
            console.warn(`Достигнуто максимальное количество итераций для числа ${startNumber}`);
        }

        return sequence;
    }

    /**
     * Генерирует последовательность с оптимизацией для больших чисел
     * @param {number} startNumber - Начальное число
     * @returns {Array<number>} Массив чисел последовательности
     */
    static generateSequenceOptimized(startNumber) {
        if (!Number.isInteger(startNumber) || startNumber < 1) {
            throw new Error('Начальное число должно быть положительным целым числом');
        }

        const sequence = [startNumber];
        let current = startNumber;
        const maxIterations = 1000000;
        let iterations = 0;

        // Кэш для уже вычисленных значений
        const cache = new Map();

        while (current !== 1 && iterations < maxIterations) {
            // Проверяем кэш
            if (cache.has(current)) {
                const cachedSequence = cache.get(current);
                sequence.push(...cachedSequence);
                break;
            }

            const next = this.getNextNumber(current);
            sequence.push(next);
            
            // Кэшируем промежуточные результаты
            if (current < 10000) {
                cache.set(current, [next]);
            }
            
            current = next;
            iterations++;
        }

        if (iterations >= maxIterations) {
            console.warn(`Достигнуто максимальное количество итераций для числа ${startNumber}`);
        }

        return sequence;
    }

    /**
     * Вычисляет следующее число в последовательности
     * @param {number} n - Текущее число
     * @returns {number} Следующее число
     */
    static getNextNumber(n) {
        if (n % 2 === 0) {
            return n / 2;
        } else {
            return 3 * n + 1;
        }
    }

    /**
     * Вычисляет статистику последовательности
     * @param {Array<number>} sequence - Последовательность чисел
     * @returns {Object} Объект со статистикой
     */
    static calculateStatistics(sequence) {
        if (!Array.isArray(sequence) || sequence.length === 0) {
            throw new Error('Последовательность должна быть непустым массивом');
        }

        const stats = {
            length: sequence.length,
            maxValue: Math.max(...sequence),
            minValue: Math.min(...sequence),
            steps: sequence.length - 1,
            hasReachedOne: sequence[sequence.length - 1] === 1,
            startNumber: sequence[0],
            endNumber: sequence[sequence.length - 1],
            averageValue: sequence.reduce((sum, num) => sum + num, 0) / sequence.length,
            evenCount: sequence.filter(num => num % 2 === 0).length,
            oddCount: sequence.filter(num => num % 2 === 1).length,
            maxValueIndex: sequence.indexOf(Math.max(...sequence)),
            peakToTroughRatio: 0,
            complexity: 0
        };

        // Вычисляем отношение пика к впадине
        if (stats.minValue > 0) {
            stats.peakToTroughRatio = stats.maxValue / stats.minValue;
        }

        // Вычисляем сложность (количество изменений направления)
        let directionChanges = 0;
        for (let i = 1; i < sequence.length - 1; i++) {
            const prev = sequence[i - 1];
            const curr = sequence[i];
            const next = sequence[i + 1];
            
            if ((curr > prev && curr > next) || (curr < prev && curr < next)) {
                directionChanges++;
            }
        }
        stats.complexity = directionChanges;

        return stats;
    }

    /**
     * Проверяет, достигает ли последовательность 1
     * @param {Array<number>} sequence - Последовательность чисел
     * @returns {boolean} true, если последовательность достигает 1
     */
    static reachesOne(sequence) {
        return sequence[sequence.length - 1] === 1;
    }

    /**
     * Находит все числа в диапазоне, которые дают длинные последовательности
     * @param {number} start - Начало диапазона
     * @param {number} end - Конец диапазона
     * @param {number} minLength - Минимальная длина последовательности
     * @returns {Array<Object>} Массив объектов с информацией о числах
     */
    static findLongSequences(start, end, minLength = 100) {
        const results = [];
        
        for (let i = start; i <= end; i++) {
            try {
                const sequence = this.generateSequence(i);
                const stats = this.calculateStatistics(sequence);
                
                if (stats.length >= minLength) {
                    results.push({
                        number: i,
                        sequence: sequence,
                        statistics: stats
                    });
                }
            } catch (error) {
                console.warn(`Ошибка при обработке числа ${i}:`, error);
            }
        }

        // Сортируем по длине последовательности (по убыванию)
        return results.sort((a, b) => b.statistics.length - a.statistics.length);
    }

    /**
     * Анализирует паттерны в последовательности
     * @param {Array<number>} sequence - Последовательность чисел
     * @returns {Object} Объект с анализом паттернов
     */
    static analyzePatterns(sequence) {
        const patterns = {
            cycles: [],
            repeatingPatterns: [],
            growthRate: [],
            stepTypes: []
        };

        // Анализируем типы шагов
        for (let i = 0; i < sequence.length - 1; i++) {
            const current = sequence[i];
            const next = sequence[i + 1];
            
            if (next === current / 2) {
                patterns.stepTypes.push('divide');
            } else if (next === 3 * current + 1) {
                patterns.stepTypes.push('multiply');
            }
        }

        // Анализируем темп роста
        for (let i = 1; i < sequence.length; i++) {
            const growth = sequence[i] / sequence[i - 1];
            patterns.growthRate.push(growth);
        }

        // Ищем повторяющиеся паттерны
        patterns.repeatingPatterns = this.findRepeatingPatterns(sequence);

        return patterns;
    }

    /**
     * Ищет повторяющиеся паттерны в последовательности
     * @param {Array<number>} sequence - Последовательность чисел
     * @returns {Array<Array<number>>} Массив повторяющихся паттернов
     */
    static findRepeatingPatterns(sequence) {
        const patterns = [];
        const maxPatternLength = Math.min(10, Math.floor(sequence.length / 2));

        for (let patternLength = 2; patternLength <= maxPatternLength; patternLength++) {
            for (let start = 0; start <= sequence.length - patternLength * 2; start++) {
                const pattern = sequence.slice(start, start + patternLength);
                const nextOccurrence = sequence.indexOf(pattern[0], start + patternLength);
                
                if (nextOccurrence !== -1) {
                    const nextPattern = sequence.slice(nextOccurrence, nextOccurrence + patternLength);
                    if (this.arraysEqual(pattern, nextPattern)) {
                        patterns.push(pattern);
                    }
                }
            }
        }

        return patterns;
    }

    /**
     * Сравнивает два массива на равенство
     * @param {Array} arr1 - Первый массив
     * @param {Array} arr2 - Второй массив
     * @returns {boolean} true, если массивы равны
     */
    static arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        return arr1.every((val, index) => val === arr2[index]);
    }

    /**
     * Генерирует последовательность с анимацией (для демонстрации)
     * @param {number} startNumber - Начальное число
     * @param {Function} callback - Функция обратного вызова для каждого шага
     * @returns {Promise<Array<number>>} Промис с последовательностью
     */
    static async generateSequenceWithAnimation(startNumber, callback) {
        const sequence = [startNumber];
        let current = startNumber;
        const maxIterations = 1000000;
        let iterations = 0;

        while (current !== 1 && iterations < maxIterations) {
            await new Promise(resolve => setTimeout(resolve, 100)); // Задержка для анимации
            
            if (current % 2 === 0) {
                current = current / 2;
            } else {
                current = 3 * current + 1;
            }
            
            sequence.push(current);
            iterations++;
            
            if (callback) {
                callback(sequence, current, iterations);
            }
        }

        return sequence;
    }
} 