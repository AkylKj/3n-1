/**
 * Модуль управления пользовательским интерфейсом
 * Отвечает за обработку пользовательского ввода, плавные анимации и обновление UI элементов
 */

export class UIController {
    constructor() {
        this.isInitialized = false;
        this.animationQueue = [];
        this.isAnimating = false;
        this.currentTheme = 'dark';
        this.animationSpeed = 500; // Средняя скорость анимаций (0.5 сек)
    }

    /**
     * Инициализация UI контроллера
     */
    async init() {
        try {
            console.log('🎨 Инициализация UI контроллера...');
            
            // Инициализация анимаций
            this.setupAnimationSystem();
            
            // Настройка обработчиков событий
            this.setupEventListeners();
            
            // Применение начальных анимаций
            this.applyInitialAnimations();
            
            this.isInitialized = true;
            
            console.log('✅ UI контроллер инициализирован');
        } catch (error) {
            console.error('❌ Ошибка инициализации UI контроллера:', error);
            throw error;
        }
    }

    /**
     * Настройка системы анимаций
     */
    setupAnimationSystem() {
        // Создание CSS переменных для анимаций
        const root = document.documentElement;
        root.style.setProperty('--animation-speed', `${this.animationSpeed}ms`);
        root.style.setProperty('--animation-easing', 'cubic-bezier(0.4, 0, 0.2, 1)');
        
        // Настройка Intersection Observer для анимаций при скролле
        this.setupScrollAnimations();
        
        // Настройка анимаций для статистических карточек
        this.setupStatisticsAnimations();
        
        // Настройка анимаций для кнопок
        this.setupButtonAnimations();
        
        // Настройка анимаций для вкладок
        this.setupTabAnimations();
    }

    /**
     * Настройка анимаций при скролле
     */
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Наблюдение за элементами, которые должны анимироваться при скролле
        const animatedElements = document.querySelectorAll('.card, .stat-card, .chart-container');
        animatedElements.forEach(el => observer.observe(el));
    }

    /**
     * Настройка анимаций для статистических карточек
     */
    setupStatisticsAnimations() {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 100}ms`;
            card.classList.add('animate-slide-up');
        });
    }

    /**
     * Настройка анимаций для кнопок
     */
    setupButtonAnimations() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
        buttons.forEach(button => {
            // Добавление эффекта мерцания при наведении
            button.addEventListener('mouseenter', () => {
                this.addShimmerEffect(button);
            });
            
            // Добавление эффекта нажатия
            button.addEventListener('mousedown', () => {
                button.style.transform = 'scale(0.95)';
            });
            
            button.addEventListener('mouseup', () => {
                button.style.transform = 'scale(1)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
            });
        });
    }

    /**
     * Настройка анимаций для вкладок
     */
    setupTabAnimations() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.animateTabSwitch(button, tabPanels);
            });
        });
    }

    /**
     * Анимация переключения вкладок
     */
    animateTabSwitch(clickedButton, tabPanels) {
        const tabId = clickedButton.getAttribute('data-tab');
        
        // Удаление активного состояния со всех кнопок
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Добавление активного состояния к нажатой кнопке
        clickedButton.classList.add('active');
        
        // Анимация переключения панелей
        tabPanels.forEach(panel => {
            if (panel.id === `tab-content-${tabId}`) {
                panel.classList.remove('hidden');
                panel.classList.add('active', 'animate-fade-in');
                
                // Анимация содержимого панели
                const content = panel.querySelector('.tab-content');
                if (content) {
                    content.classList.add('animate-slide-up');
                }
            } else {
                panel.classList.remove('active', 'animate-fade-in');
                panel.classList.add('hidden');
            }
        });
    }

    /**
     * Применение начальных анимаций
     */
    applyInitialAnimations() {
        // Анимация появления заголовка
        const header = document.querySelector('header');
        if (header) {
            header.classList.add('animate-slide-down');
        }
        
        // Анимация появления основной панели ввода
        const inputPanel = document.querySelector('.input-panel');
        if (inputPanel) {
            inputPanel.classList.add('animate-fade-in');
        }
        
        // Анимация появления статистических карточек
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-scale-in');
            }, index * 150);
        });
    }

    /**
     * Добавление эффекта мерцания
     */
    addShimmerEffect(element) {
        element.classList.add('shimmer-effect');
        setTimeout(() => {
            element.classList.remove('shimmer-effect');
        }, 2000);
    }

    /**
     * Плавное обновление статистических значений
     */
    updateStatisticsWithAnimation(newStats) {
        const statElements = {
            'sequenceLength': document.getElementById('sequenceLength'),
            'maxValue': document.getElementById('maxValue'),
            'stepCount': document.getElementById('stepCount'),
            'status': document.getElementById('status')
        };

        Object.entries(newStats).forEach(([key, value]) => {
            const element = statElements[key];
            if (element) {
                this.animateValueChange(element, value);
            }
        });
    }

    /**
     * Анимация изменения значения
     */
    animateValueChange(element, newValue) {
        const oldValue = element.textContent;
        
        // Добавление класса для анимации
        element.classList.add('stat-value-updating');
        
        // Плавное изменение значения
        element.textContent = newValue;
        
        // Анимация обновления
        element.classList.add('animate-bounce-gentle');
        element.style.color = '#3b82f6';
        
        setTimeout(() => {
            element.classList.remove('stat-value-updating', 'animate-bounce-gentle');
            element.style.color = '';
        }, 800);
    }

    /**
     * Плавное обновление UI элементов
     */
    updateUI() {
        // Анимация обновления карточек
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.classList.add('animate-scale-in');
            setTimeout(() => {
                card.classList.remove('animate-scale-in');
            }, 500);
        });
        
        // Анимация обновления графиков
        const chartContainers = document.querySelectorAll('.chart-container');
        chartContainers.forEach(container => {
            container.classList.add('animate-fade-in');
        });
    }

    /**
     * Настройка обработчиков событий
     */
    setupEventListeners() {
        // Обработка ввода в поле ввода
        const numberInput = document.getElementById('numberInput');
        if (numberInput) {
            numberInput.addEventListener('focus', () => {
                numberInput.classList.add('animate-scale-in');
            });
            
            numberInput.addEventListener('blur', () => {
                numberInput.classList.remove('animate-scale-in');
            });
            
            // Анимация при вводе
            numberInput.addEventListener('input', () => {
                if (numberInput.value.length > 0) {
                    numberInput.classList.add('border-primary');
                } else {
                    numberInput.classList.remove('border-primary');
                }
            });
        }

        // Обработка кнопок
        const calculateBtn = document.getElementById('calculateBtn');
        const compareBtn = document.getElementById('compareBtn');
        
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                this.animateButtonClick(calculateBtn);
            });
        }
        
        if (compareBtn) {
            compareBtn.addEventListener('click', () => {
                this.animateButtonClick(compareBtn);
            });
        }

        // Обработка hover эффектов
        this.setupHoverEffects();
        
        // Обработка анимаций загрузки
        this.setupLoadingAnimations();
    }

    /**
     * Анимация нажатия кнопки
     */
    animateButtonClick(button) {
        button.classList.add('animate-scale-out');
        setTimeout(() => {
            button.classList.remove('animate-scale-out');
            button.classList.add('animate-scale-in');
        }, 150);
        setTimeout(() => {
            button.classList.remove('animate-scale-in');
        }, 300);
    }

    /**
     * Настройка hover эффектов
     */
    setupHoverEffects() {
        // Эффект поднятия для карточек
        const cards = document.querySelectorAll('.card, .stat-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('hover-lift');
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('hover-lift');
            });
        });

        // Эффект свечения для интерактивных элементов
        const interactiveElements = document.querySelectorAll('.btn-primary, .tab-button');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.classList.add('hover-glow');
            });
            
            element.addEventListener('mouseleave', () => {
                element.classList.remove('hover-glow');
            });
        });
    }

    /**
     * Настройка анимаций загрузки
     */
    setupLoadingAnimations() {
        // Создание компонента загрузки
        this.createLoadingComponent();
        
        // Обработка состояний загрузки
        this.handleLoadingStates();
    }

    /**
     * Создание компонента загрузки
     */
    createLoadingComponent() {
        const loadingTemplate = `
            <div class="loading-overlay hidden">
                <div class="loading-content">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">Загрузка...</div>
                    <div class="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', loadingTemplate);
    }

    /**
     * Обработка состояний загрузки
     */
    handleLoadingStates() {
        // Показ загрузки при вычислении
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                this.showLoading();
            });
        }
    }

    /**
     * Показать состояние загрузки
     */
    showLoading() {
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('hidden');
            loadingOverlay.classList.add('animate-fade-in');
        }
    }

    /**
     * Скрыть состояние загрузки
     */
    hideLoading() {
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('animate-fade-out');
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
                loadingOverlay.classList.remove('animate-fade-out');
            }, 300);
        }
    }

    /**
     * Обработка пользовательского ввода
     */
    handleInput() {
        // Анимация при вводе
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.animateInputChange(input);
            });
        });
    }

    /**
     * Анимация изменения ввода
     */
    animateInputChange(input) {
        input.classList.add('animate-scale-in');
        setTimeout(() => {
            input.classList.remove('animate-scale-in');
        }, 200);
    }

    /**
     * Плавные переходы между состояниями
     */
    animateTransition(fromState, toState, duration = 500) {
        return new Promise((resolve) => {
            // Анимация выхода из текущего состояния
            this.animateExit(fromState, duration / 2);
            
            setTimeout(() => {
                // Анимация входа в новое состояние
                this.animateEnter(toState, duration / 2);
                resolve();
            }, duration / 2);
        });
    }

    /**
     * Анимация выхода
     */
    animateExit(element, duration) {
        element.style.transition = `all ${duration}ms ease-out`;
        element.style.opacity = '0';
        element.style.transform = 'translateY(-20px)';
    }

    /**
     * Анимация входа
     */
    animateEnter(element, duration) {
        element.style.transition = `all ${duration}ms ease-out`;
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }

    /**
     * Добавление микроанимаций
     */
    addMicroAnimations() {
        // Пульсация для важных элементов
        const importantElements = document.querySelectorAll('.stat-card, .btn-primary');
        importantElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.classList.add('pulse-effect');
            });
            
            element.addEventListener('mouseleave', () => {
                element.classList.remove('pulse-effect');
            });
        });

        // Плавающий эффект для декоративных элементов
        const decorativeElements = document.querySelectorAll('.logo, .icon');
        decorativeElements.forEach(element => {
            element.classList.add('float-effect');
        });
    }

    /**
     * Обновление темы
     */
    updateTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        // Анимация смены темы
        document.body.style.transition = 'background-color 0.6s ease, color 0.6s ease';
        
        // Обновление цветов
        if (theme === 'dark') {
            document.body.style.backgroundColor = '#1a1a1a';
            document.body.style.color = '#ffffff';
        } else {
            document.body.style.backgroundColor = '#ffffff';
            document.body.style.color = '#1a1a1a';
        }
    }

    /**
     * Получение текущих настроек анимаций
     */
    getAnimationSettings() {
        return {
            speed: this.animationSpeed,
            theme: this.currentTheme,
            isAnimating: this.isAnimating
        };
    }

    /**
     * Установка скорости анимаций
     */
    setAnimationSpeed(speed) {
        this.animationSpeed = speed;
        document.documentElement.style.setProperty('--animation-speed', `${speed}ms`);
    }
} 