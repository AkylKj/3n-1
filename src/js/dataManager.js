/**
 * Модуль управления данными и состоянием приложения
 * Отвечает за хранение, обновление и предоставление данных о последовательностях
 */

import { CollatzAlgorithm } from './algorithm.js';

export class DataManager {
    constructor() {
        this.sequences = [];
        this.currentSequenceId = 0;
        this.maxSequences = 10; // Максимальное количество последовательностей для сравнения
        this.eventListeners = new Map();
    }

    /**
     * Добавляет новую последовательность в хранилище
     * @param {number} startNumber - Начальное число
     * @param {Array<number>} sequence - Последовательность чисел
     * @returns {Object} Объект с данными последовательности
     */
    addSequence(startNumber, sequence) {
        // Проверяем, не превышен ли лимит последовательностей
        if (this.sequences.length >= this.maxSequences) {
            // Удаляем самую старую последовательность
            this.sequences.shift();
        }

        // Генерируем уникальный ID
        const id = this.generateId();
        
        // Вычисляем статистику
        const statistics = CollatzAlgorithm.calculateStatistics(sequence);
        
        // Генерируем цвет для визуализации
        const color = this.generateColor(this.sequences.length);
        
        // Создаем объект последовательности
        const sequenceData = {
            id,
            startNumber,
            sequence,
            statistics,
            color,
            createdAt: new Date().toISOString(),
            patterns: CollatzAlgorithm.analyzePatterns(sequence)
        };

        // Добавляем в массив
        this.sequences.push(sequenceData);
        
        // Уведомляем слушателей об изменении
        this.notifyListeners('sequenceAdded', sequenceData);
        
        return sequenceData;
    }

    /**
     * Удаляет последовательность по ID
     * @param {string} id - ID последовательности
     * @returns {boolean} true, если последовательность была удалена
     */
    removeSequence(id) {
        const index = this.sequences.findIndex(seq => seq.id === id);
        if (index !== -1) {
            const removedSequence = this.sequences.splice(index, 1)[0];
            this.notifyListeners('sequenceRemoved', removedSequence);
            return true;
        }
        return false;
    }

    /**
     * Получает все последовательности
     * @returns {Array<Object>} Массив последовательностей
     */
    getSequences() {
        return [...this.sequences];
    }

    /**
     * Получает последовательность по ID
     * @param {string} id - ID последовательности
     * @returns {Object|null} Объект последовательности или null
     */
    getSequenceById(id) {
        return this.sequences.find(seq => seq.id === id) || null;
    }

    /**
     * Получает последнюю добавленную последовательность
     * @returns {Object|null} Последняя последовательность или null
     */
    getLastSequence() {
        return this.sequences.length > 0 ? this.sequences[this.sequences.length - 1] : null;
    }

    /**
     * Очищает все последовательности
     */
    clearSequences() {
        this.sequences = [];
        this.notifyListeners('sequencesCleared');
    }

    /**
     * Получает общую статистику по всем последовательностям
     * @returns {Object} Объект с общей статистикой
     */
    getOverallStatistics() {
        if (this.sequences.length === 0) {
            return {
                totalSequences: 0,
                averageLength: 0,
                maxLength: 0,
                minLength: 0,
                totalSteps: 0,
                sequencesReachingOne: 0,
                averageMaxValue: 0,
                mostCommonMaxValue: 0
            };
        }

        const lengths = this.sequences.map(seq => seq.statistics.length);
        const maxValues = this.sequences.map(seq => seq.statistics.maxValue);
        const steps = this.sequences.map(seq => seq.statistics.steps);
        const reachingOne = this.sequences.filter(seq => seq.statistics.hasReachedOne).length;

        // Находим наиболее частое максимальное значение
        const maxValueCounts = {};
        maxValues.forEach(value => {
            maxValueCounts[value] = (maxValueCounts[value] || 0) + 1;
        });
        
        const mostCommonMaxValue = Object.keys(maxValueCounts).reduce((a, b) => 
            maxValueCounts[a] > maxValueCounts[b] ? a : b
        );

        return {
            totalSequences: this.sequences.length,
            averageLength: lengths.reduce((sum, len) => sum + len, 0) / lengths.length,
            maxLength: Math.max(...lengths),
            minLength: Math.min(...lengths),
            totalSteps: steps.reduce((sum, step) => sum + step, 0),
            sequencesReachingOne: reachingOne,
            averageMaxValue: maxValues.reduce((sum, val) => sum + val, 0) / maxValues.length,
            mostCommonMaxValue: parseInt(mostCommonMaxValue)
        };
    }

    /**
     * Сравнивает две последовательности
     * @param {string} id1 - ID первой последовательности
     * @param {string} id2 - ID второй последовательности
     * @returns {Object} Объект с результатами сравнения
     */
    compareSequences(id1, id2) {
        const seq1 = this.getSequenceById(id1);
        const seq2 = this.getSequenceById(id2);

        if (!seq1 || !seq2) {
            throw new Error('Одна или обе последовательности не найдены');
        }

        const comparison = {
            lengthDifference: seq1.statistics.length - seq2.statistics.length,
            maxValueDifference: seq1.statistics.maxValue - seq2.statistics.maxValue,
            stepDifference: seq1.statistics.steps - seq2.statistics.steps,
            complexityDifference: seq1.statistics.complexity - seq2.statistics.complexity,
            averageValueDifference: seq1.statistics.averageValue - seq2.statistics.averageValue,
            evenOddRatio1: seq1.statistics.evenCount / seq1.statistics.oddCount,
            evenOddRatio2: seq2.statistics.evenCount / seq2.statistics.oddCount,
            similarity: this.calculateSimilarity(seq1.sequence, seq2.sequence)
        };

        return comparison;
    }

    /**
     * Вычисляет схожесть между двумя последовательностями
     * @param {Array<number>} seq1 - Первая последовательность
     * @param {Array<number>} seq2 - Вторая последовательность
     * @returns {number} Коэффициент схожести (0-1)
     */
    calculateSimilarity(seq1, seq2) {
        const minLength = Math.min(seq1.length, seq2.length);
        let matches = 0;

        for (let i = 0; i < minLength; i++) {
            if (seq1[i] === seq2[i]) {
                matches++;
            }
        }

        return matches / minLength;
    }

    /**
     * Экспортирует данные в JSON
     * @returns {string} JSON строка с данными
     */
    exportToJSON() {
        const exportData = {
            sequences: this.sequences,
            overallStatistics: this.getOverallStatistics(),
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };

        return JSON.stringify(exportData, null, 2);
    }

    /**
     * Импортирует данные из JSON
     * @param {string} jsonData - JSON строка с данными
     * @returns {boolean} true, если импорт успешен
     */
    importFromJSON(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.sequences && Array.isArray(data.sequences)) {
                this.sequences = data.sequences;
                this.notifyListeners('dataImported', data);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Ошибка импорта данных:', error);
            return false;
        }
    }

    /**
     * Генерирует уникальный ID для последовательности
     * @returns {string} Уникальный ID
     */
    generateId() {
        return `seq_${Date.now()}_${++this.currentSequenceId}`;
    }

    /**
     * Генерирует цвет для визуализации
     * @param {number} index - Индекс последовательности
     * @returns {string} HEX цвет
     */
    generateColor(index) {
        const colors = [
            '#3b82f6', // синий
            '#ef4444', // красный
            '#10b981', // зеленый
            '#f59e0b', // желтый
            '#8b5cf6', // фиолетовый
            '#06b6d4', // голубой
            '#f97316', // оранжевый
            '#ec4899', // розовый
            '#84cc16', // лаймовый
            '#6366f1'  // индиго
        ];

        return colors[index % colors.length];
    }

    /**
     * Добавляет слушателя событий
     * @param {string} event - Тип события
     * @param {Function} callback - Функция обратного вызова
     */
    addEventListener(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    /**
     * Удаляет слушателя событий
     * @param {string} event - Тип события
     * @param {Function} callback - Функция обратного вызова
     */
    removeEventListener(event, callback) {
        if (this.eventListeners.has(event)) {
            const listeners = this.eventListeners.get(event);
            const index = listeners.indexOf(callback);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        }
    }

    /**
     * Уведомляет всех слушателей о событии
     * @param {string} event - Тип события
     * @param {*} data - Данные события
     */
    notifyListeners(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Ошибка в обработчике события ${event}:`, error);
                }
            });
        }
    }

    /**
     * Получает статистику по диапазону чисел
     * @param {number} start - Начало диапазона
     * @param {number} end - Конец диапазона
     * @returns {Object} Статистика по диапазону
     */
    getRangeStatistics(start, end) {
        const rangeSequences = this.sequences.filter(seq => 
            seq.startNumber >= start && seq.startNumber <= end
        );

        if (rangeSequences.length === 0) {
            return {
                count: 0,
                averageLength: 0,
                maxLength: 0,
                minLength: 0
            };
        }

        const lengths = rangeSequences.map(seq => seq.statistics.length);

        return {
            count: rangeSequences.length,
            averageLength: lengths.reduce((sum, len) => sum + len, 0) / lengths.length,
            maxLength: Math.max(...lengths),
            minLength: Math.min(...lengths)
        };
    }

    /**
     * Фильтрует последовательности по критериям
     * @param {Object} filters - Объект с фильтрами
     * @returns {Array<Object>} Отфильтрованные последовательности
     */
    filterSequences(filters = {}) {
        let filtered = [...this.sequences];

        if (filters.minLength) {
            filtered = filtered.filter(seq => seq.statistics.length >= filters.minLength);
        }

        if (filters.maxLength) {
            filtered = filtered.filter(seq => seq.statistics.length <= filters.maxLength);
        }

        if (filters.minMaxValue) {
            filtered = filtered.filter(seq => seq.statistics.maxValue >= filters.minMaxValue);
        }

        if (filters.maxMaxValue) {
            filtered = filtered.filter(seq => seq.statistics.maxValue <= filters.maxMaxValue);
        }

        if (filters.reachingOne !== undefined) {
            filtered = filtered.filter(seq => seq.statistics.hasReachedOne === filters.reachingOne);
        }

        return filtered;
    }
} 