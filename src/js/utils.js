/**
 * Модуль утилит для работы с данными, форматирования и других вспомогательных функций
 */

export class Utils {
    
    /**
     * Форматирует число с разделителями тысяч
     * @param {number} num - Число для форматирования
     * @returns {string} Отформатированное число
     */
    static formatNumber(num) {
        return num.toLocaleString('ru-RU');
    }

    /**
     * Форматирует большие числа в сокращенном виде (K, M, B)
     * @param {number} num - Число для форматирования
     * @returns {string} Сокращенное число
     */
    static formatLargeNumber(num) {
        if (num >= 1e9) {
            return (num / 1e9).toFixed(1) + 'B';
        } else if (num >= 1e6) {
            return (num / 1e6).toFixed(1) + 'M';
        } else if (num >= 1e3) {
            return (num / 1e3).toFixed(1) + 'K';
        }
        return num.toString();
    }

    /**
     * Форматирует время в секундах в читаемый вид
     * @param {number} seconds - Время в секундах
     * @returns {string} Отформатированное время
     */
    static formatTime(seconds) {
        if (seconds < 60) {
            return `${seconds.toFixed(1)}с`;
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}м ${remainingSeconds.toFixed(0)}с`;
        } else {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            return `${hours}ч ${minutes}м`;
        }
    }

    /**
     * Генерирует случайный цвет
     * @returns {string} HEX цвет
     */
    static generateRandomColor() {
        const colors = [
            '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
            '#06b6d4', '#f97316', '#ec4899', '#84cc16', '#6366f1',
            '#14b8a6', '#f43f5e', '#a855f7', '#eab308', '#22c55e'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    /**
     * Создает градиент между двумя цветами
     * @param {string} color1 - Первый цвет (HEX)
     * @param {string} color2 - Второй цвет (HEX)
     * @param {number} steps - Количество шагов
     * @returns {Array<string>} Массив цветов градиента
     */
    static createGradient(color1, color2, steps) {
        const colors = [];
        for (let i = 0; i < steps; i++) {
            const ratio = i / (steps - 1);
            colors.push(this.interpolateColor(color1, color2, ratio));
        }
        return colors;
    }

    /**
     * Интерполирует между двумя цветами
     * @param {string} color1 - Первый цвет (HEX)
     * @param {string} color2 - Второй цвет (HEX)
     * @param {number} ratio - Коэффициент интерполяции (0-1)
     * @returns {string} Интерполированный цвет
     */
    static interpolateColor(color1, color2, ratio) {
        const r1 = parseInt(color1.slice(1, 3), 16);
        const g1 = parseInt(color1.slice(3, 5), 16);
        const b1 = parseInt(color1.slice(5, 7), 16);
        
        const r2 = parseInt(color2.slice(1, 3), 16);
        const g2 = parseInt(color2.slice(3, 5), 16);
        const b2 = parseInt(color2.slice(5, 7), 16);
        
        const r = Math.round(r1 + (r2 - r1) * ratio);
        const g = Math.round(g1 + (g2 - g1) * ratio);
        const b = Math.round(b1 + (b2 - b1) * ratio);
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    /**
     * Дебаунсинг функции
     * @param {Function} func - Функция для дебаунсинга
     * @param {number} delay - Задержка в миллисекундах
     * @returns {Function} Дебаунсированная функция
     */
    static debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * Троттлинг функции
     * @param {Function} func - Функция для троттлинга
     * @param {number} limit - Лимит вызовов в миллисекундах
     * @returns {Function} Троттлированная функция
     */
    static throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Клонирует объект глубоко
     * @param {*} obj - Объект для клонирования
     * @returns {*} Клонированный объект
     */
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        
        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }
        
        if (obj instanceof Array) {
            return obj.map(item => this.deepClone(item));
        }
        
        if (typeof obj === 'object') {
            const cloned = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloned[key] = this.deepClone(obj[key]);
                }
            }
            return cloned;
        }
    }

    /**
     * Проверяет, является ли объект пустым
     * @param {*} obj - Объект для проверки
     * @returns {boolean} true, если объект пустой
     */
    static isEmpty(obj) {
        if (obj == null) return true;
        if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
        if (obj instanceof Map || obj instanceof Set) return obj.size === 0;
        if (typeof obj === 'object') return Object.keys(obj).length === 0;
        return false;
    }

    /**
     * Генерирует уникальный ID
     * @param {string} prefix - Префикс для ID
     * @returns {string} Уникальный ID
     */
    static generateId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Создает задержку
     * @param {number} ms - Время задержки в миллисекундах
     * @returns {Promise} Промис, который разрешается через указанное время
     */
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Асинхронно загружает изображение
     * @param {string} src - URL изображения
     * @returns {Promise<HTMLImageElement>} Промис с загруженным изображением
     */
    static loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    /**
     * Скачивает данные как файл
     * @param {string} data - Данные для скачивания
     * @param {string} filename - Имя файла
     * @param {string} mimeType - MIME тип файла
     */
    static downloadFile(data, filename, mimeType = 'text/plain') {
        const blob = new Blob([data], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * Копирует текст в буфер обмена
     * @param {string} text - Текст для копирования
     * @returns {Promise<boolean>} true, если копирование успешно
     */
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.error('Ошибка копирования в буфер обмена:', error);
            return false;
        }
    }

    /**
     * Форматирует размер файла
     * @param {number} bytes - Размер в байтах
     * @returns {string} Отформатированный размер
     */
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Б';
        
        const k = 1024;
        const sizes = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Проверяет поддержку WebGL
     * @returns {boolean} true, если WebGL поддерживается
     */
    static isWebGLSupported() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                     (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    /**
     * Проверяет поддержку Web Workers
     * @returns {boolean} true, если Web Workers поддерживаются
     */
    static isWebWorkerSupported() {
        return typeof Worker !== 'undefined';
    }

    /**
     * Получает информацию о производительности
     * @returns {Object} Объект с информацией о производительности
     */
    static getPerformanceInfo() {
        const performance = window.performance;
        const memory = performance.memory;
        
        return {
            memory: memory ? {
                used: this.formatFileSize(memory.usedJSHeapSize),
                total: this.formatFileSize(memory.totalJSHeapSize),
                limit: this.formatFileSize(memory.jsHeapSizeLimit)
            } : null,
            timing: performance.timing ? {
                loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
                domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
            } : null
        };
    }

    /**
     * Создает анимацию числа
     * @param {HTMLElement} element - Элемент для анимации
     * @param {number} start - Начальное значение
     * @param {number} end - Конечное значение
     * @param {number} duration - Длительность анимации в миллисекундах
     */
    static animateNumber(element, start, end, duration = 1000) {
        const startTime = performance.now();
        const difference = end - start;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Функция плавности (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = start + difference * easeOut;
            
            element.textContent = Math.round(current).toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    /**
     * Создает уведомление
     * @param {string} message - Сообщение
     * @param {string} type - Тип уведомления ('success', 'error', 'warning', 'info')
     * @param {number} duration - Длительность показа в миллисекундах
     */
    static showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up`;
        
        // Добавляем цвет в зависимости от типа
        switch (type) {
            case 'success':
                notification.classList.add('bg-success', 'text-white');
                break;
            case 'error':
                notification.classList.add('bg-error', 'text-white');
                break;
            case 'warning':
                notification.classList.add('bg-warning', 'text-white');
                break;
            default:
                notification.classList.add('bg-secondary', 'text-white');
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, duration);
    }

    /**
     * Проверяет, находится ли элемент в области видимости
     * @param {HTMLElement} element - Элемент для проверки
     * @returns {boolean} true, если элемент видим
     */
    static isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Плавно прокручивает к элементу
     * @param {HTMLElement} element - Элемент для прокрутки
     * @param {Object} options - Опции прокрутки
     */
    static scrollToElement(element, options = {}) {
        const defaultOptions = {
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        };
        
        element.scrollIntoView({ ...defaultOptions, ...options });
    }
} 