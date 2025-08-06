/**
 * Модуль управления системой вкладок
 * Отвечает за переключение между вкладками, сохранение состояния и анимации
 */
export class TabManager {
    constructor() {
        this.currentTab = 'about';
        this.tabs = ['about', '2d', '3d', 'advanced'];
        this.tabStates = {};
        this.isInitialized = false;
    }

    /**
     * Инициализация системы вкладок
     */
    async init() {
        try {
            console.log('🎯 Инициализация системы вкладок...');
            
            // Загрузка сохраненного состояния
            this.loadTabState();
            
            // Настройка обработчиков событий
            this.setupEventListeners();
            
            // Активация начальной вкладки
            this.switchTab(this.currentTab);
            
            this.isInitialized = true;
            console.log('✅ Система вкладок инициализирована');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации системы вкладок:', error);
            throw error;
        }
    }

    /**
     * Настройка обработчиков событий для вкладок
     */
    setupEventListeners() {
        // Обработчики для кнопок вкладок
        this.tabs.forEach(tabId => {
            const tabButton = document.getElementById(`tab-${tabId}`);
            if (tabButton) {
                tabButton.addEventListener('click', () => {
                    this.switchTab(tabId);
                });
            }
        });

        // Обработчики для кнопок экспорта
        const exportButtons = [
            'export2dBtn', 'exportRadarBtn', 'exportPolarBtn', 
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

        // Обработчик для кнопки полного экрана
        const fullscreenBtn = document.getElementById('fullscreen2dBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleFullscreen('chart2d');
            });
        }

        // Обработчик изменения размера окна
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    /**
     * Переключение на указанную вкладку
     * @param {string} tabId - ID вкладки для переключения
     */
    switchTab(tabId) {
        if (!this.tabs.includes(tabId)) {
            console.warn(`Вкладка ${tabId} не найдена`);
            return;
        }

        console.log(`🔄 Переключение на вкладку: ${tabId}`);

        // Обновление активной вкладки
        this.currentTab = tabId;

        // Обновление кнопок вкладок
        this.updateTabButtons(tabId);

        // Обновление панелей вкладок
        this.updateTabPanels(tabId);

        // Сохранение состояния
        this.saveTabState();

        // Уведомление о смене вкладки
        this.notifyTabChange(tabId);

        // Анимация перехода
        this.animateTabTransition(tabId);
    }

    /**
     * Обновление кнопок вкладок
     * @param {string} activeTabId - ID активной вкладки
     */
    updateTabButtons(activeTabId) {
        this.tabs.forEach(tabId => {
            const tabButton = document.getElementById(`tab-${tabId}`);
            if (tabButton) {
                if (tabId === activeTabId) {
                    tabButton.classList.add('active');
                } else {
                    tabButton.classList.remove('active');
                }
            }
        });
    }

    /**
     * Обновление панелей вкладок
     * @param {string} activeTabId - ID активной вкладки
     */
    updateTabPanels(activeTabId) {
        this.tabs.forEach(tabId => {
            const tabPanel = document.getElementById(`tab-content-${tabId}`);
            if (tabPanel) {
                if (tabId === activeTabId) {
                    // Плавное появление активной панели
                    tabPanel.style.display = 'block';
                    setTimeout(() => {
                        tabPanel.classList.add('active');
                    }, 10);
                } else {
                    // Плавное скрытие неактивных панелей
                    tabPanel.classList.remove('active');
                    setTimeout(() => {
                        if (!tabPanel.classList.contains('active')) {
                            tabPanel.style.display = 'none';
                        }
                    }, 300);
                }
            }
        });
    }

    /**
     * Анимация перехода между вкладками
     * @param {string} tabId - ID вкладки
     */
    animateTabTransition(tabId) {
        const tabPanel = document.getElementById(`tab-content-${tabId}`);
        if (tabPanel) {
            // Добавление класса анимации
            tabPanel.classList.add('fade-in');
            
            // Удаление класса анимации после завершения
            setTimeout(() => {
                tabPanel.classList.remove('fade-in');
            }, 500);
        }
    }

    /**
     * Обработка экспорта графиков
     * @param {string} buttonId - ID кнопки экспорта
     */
    handleExport(buttonId) {
        const chartMap = {
            'export2dBtn': 'chart2d',
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
                // Создание ссылки для скачивания
                const link = document.createElement('a');
                link.download = `${chartId}_${new Date().toISOString().slice(0, 10)}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                
                console.log(`📊 Экспорт графика: ${chartId}`);
            }
        } catch (error) {
            console.error('Ошибка экспорта графика:', error);
        }
    }

    /**
     * Переключение полноэкранного режима
     * @param {string} elementId - ID элемента для полноэкранного режима
     */
    toggleFullscreen(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            if (!document.fullscreenElement) {
                element.requestFullscreen().catch(err => {
                    console.error('Ошибка перехода в полноэкранный режим:', err);
                });
            } else {
                document.exitFullscreen();
            }
        }
    }

    /**
     * Обработка изменения размера окна
     */
    handleResize() {
        // Обновление размеров графиков при изменении размера окна
        this.tabs.forEach(tabId => {
            const tabPanel = document.getElementById(`tab-content-${tabId}`);
            if (tabPanel && tabPanel.classList.contains('active')) {
                // Уведомление о необходимости обновления размеров
                this.notifyResize(tabId);
            }
        });
    }

    /**
     * Сохранение состояния вкладок в localStorage
     */
    saveTabState() {
        try {
            const state = {
                currentTab: this.currentTab,
                tabStates: this.tabStates,
                timestamp: Date.now()
            };
            localStorage.setItem('tabManagerState', JSON.stringify(state));
        } catch (error) {
            console.warn('Не удалось сохранить состояние вкладок:', error);
        }
    }

    /**
     * Загрузка состояния вкладок из localStorage
     */
    loadTabState() {
        try {
            const savedState = localStorage.getItem('tabManagerState');
            if (savedState) {
                const state = JSON.parse(savedState);
                
                // Проверка актуальности состояния (не старше 24 часов)
                const isRecent = (Date.now() - state.timestamp) < 24 * 60 * 60 * 1000;
                
                if (isRecent && this.tabs.includes(state.currentTab)) {
                    this.currentTab = state.currentTab;
                    this.tabStates = state.tabStates || {};
                }
            }
        } catch (error) {
            console.warn('Не удалось загрузить состояние вкладок:', error);
        }
    }

    /**
     * Уведомление о смене вкладки
     * @param {string} tabId - ID вкладки
     */
    notifyTabChange(tabId) {
        // Создание пользовательского события
        const event = new CustomEvent('tabChanged', {
            detail: { tabId, previousTab: this.currentTab }
        });
        document.dispatchEvent(event);
    }

    /**
     * Уведомление об изменении размера
     * @param {string} tabId - ID вкладки
     */
    notifyResize(tabId) {
        const event = new CustomEvent('tabResize', {
            detail: { tabId }
        });
        document.dispatchEvent(event);
    }

    /**
     * Получение текущей активной вкладки
     * @returns {string} ID активной вкладки
     */
    getCurrentTab() {
        return this.currentTab;
    }

    /**
     * Проверка, активна ли указанная вкладка
     * @param {string} tabId - ID вкладки
     * @returns {boolean} Активна ли вкладка
     */
    isTabActive(tabId) {
        return this.currentTab === tabId;
    }

    /**
     * Сохранение состояния для конкретной вкладки
     * @param {string} tabId - ID вкладки
     * @param {object} state - Состояние для сохранения
     */
    saveTabStateData(tabId, state) {
        this.tabStates[tabId] = {
            ...this.tabStates[tabId],
            ...state,
            lastUpdated: Date.now()
        };
        this.saveTabState();
    }

    /**
     * Получение состояния для конкретной вкладки
     * @param {string} tabId - ID вкладки
     * @returns {object} Сохраненное состояние
     */
    getTabStateData(tabId) {
        return this.tabStates[tabId] || {};
    }

    /**
     * Очистка состояния вкладок
     */
    clearTabState() {
        this.tabStates = {};
        localStorage.removeItem('tabManagerState');
    }
} 