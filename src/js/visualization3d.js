/**
 * Модуль 3D визуализации с использованием Three.js
 * Отвечает за создание и обновление 3D сцен
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class Visualization3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.stats = null;
        this.container = null;
        this.isInitialized = false;
        this.isAnimating = false;
        this.animationId = null;
        
        // Настройки сцены
        this.settings = {
            backgroundColor: 0x1a1a1a,
            gridSize: 100,
            gridDivisions: 20,
            cameraDistance: 50,
            pointSize: 0.5,
            lineWidth: 2,
            animationSpeed: 0.01
        };
        
        // Объекты сцены
        this.objects = {
            grid: null,
            axes: null,
            sequences: new Map(),
            labels: []
        };
        
        // Состояние камеры
        this.cameraState = {
            position: new THREE.Vector3(30, 30, 30),
            target: new THREE.Vector3(0, 0, 0)
        };
    }

    /**
     * Инициализация 3D визуализации
     */
    async init() {
        try {
            console.log('🎮 Инициализация 3D визуализации...');
            
            // Получаем контейнер
            this.container = document.getElementById('chart3d');
            if (!this.container) {
                throw new Error('Контейнер для 3D визуализации не найден');
            }
            
            // Инициализация сцены
            this.initScene();
            
            // Инициализация камеры
            this.initCamera();
            
            // Инициализация рендерера
            this.initRenderer();
            
            // Инициализация контролов
            this.initControls();
            
            // Инициализация статистики
            this.initStats();
            
            // Создание базовых элементов сцены
            this.createGrid();
            this.createAxes();
            
            // Настройка обработчиков событий
            this.setupEventListeners();
            
            // Запуск рендеринга
            this.animate();
            
            this.isInitialized = true;
            console.log('✅ 3D визуализация инициализирована');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации 3D визуализации:', error);
            throw error;
        }
    }

    /**
     * Инициализация сцены
     */
    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.settings.backgroundColor);
        this.scene.fog = new THREE.Fog(this.settings.backgroundColor, 50, 200);
        
        // Добавляем освещение
        this.setupLighting();
    }

    /**
     * Настройка освещения сцены
     */
    setupLighting() {
        // Основное освещение
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // Направленное освещение
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Дополнительное освещение
        const pointLight = new THREE.PointLight(0x3b82f6, 0.5, 100);
        pointLight.position.set(-50, 50, -50);
        this.scene.add(pointLight);
        
        // Сохраняем ссылки на источники света
        this.lights = {
            ambient: ambientLight,
            directional: directionalLight,
            point: pointLight
        };
    }

    /**
     * Инициализация камеры
     */
    initCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.copy(this.cameraState.position);
        this.camera.lookAt(this.cameraState.target);
    }

    /**
     * Инициализация рендерера
     */
    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.container,
            antialias: true,
            alpha: false
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    /**
     * Инициализация контролов камеры
     */
    initControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 10;
        this.controls.maxDistance = 200;
        this.controls.maxPolarAngle = Math.PI;
        
        // Обработчик изменения камеры
        this.controls.addEventListener('change', () => {
            this.updateCameraInfo();
        });
    }

    /**
     * Инициализация статистики производительности
     */
    initStats() {
        // Временно отключаем Stats.js для упрощения
        this.stats = null;
        console.log('📊 Stats.js отключен для упрощения');
    }

    /**
     * Создание координатной сетки
     */
    createGrid() {
        const gridHelper = new THREE.GridHelper(
            this.settings.gridSize, 
            this.settings.gridDivisions,
            0x444444,
            0x222222
        );
        gridHelper.position.y = 0;
        this.scene.add(gridHelper);
        this.objects.grid = gridHelper;
    }

    /**
     * Создание осей координат
     */
    createAxes() {
        const axesHelper = new THREE.AxesHelper(20);
        this.scene.add(axesHelper);
        this.objects.axes = axesHelper;
    }

    /**
     * Настройка обработчиков событий
     */
    setupEventListeners() {
        // Кнопка сброса камеры
        const resetBtn = document.getElementById('reset3dBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetCamera());
        }

        // Кнопка переключения анимации
        const animationBtn = document.getElementById('toggle3dAnimationBtn');
        if (animationBtn) {
            animationBtn.addEventListener('click', () => this.toggleAnimation());
        }

        // Интерактивные подсказки
        this.setupTooltips();

        // Обработчик изменения размера окна
        window.addEventListener('resize', () => this.handleResize());
    }

    /**
     * Настройка интерактивных подсказок
     */
    setupTooltips() {
        // Создаем элемент для подсказок
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'fixed bg-background/90 text-text-primary px-3 py-2 rounded-lg shadow-lg text-sm pointer-events-none z-50 hidden';
        this.tooltip.style.backdropFilter = 'blur(8px)';
        document.body.appendChild(this.tooltip);

        // Обработчики мыши для подсказок
        this.renderer.domElement.addEventListener('mousemove', (event) => {
            this.handleMouseMove(event);
        });

        this.renderer.domElement.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });
    }

    /**
     * Обработка движения мыши для подсказок
     */
    handleMouseMove(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        // Проверяем пересечения с объектами
        const intersects = raycaster.intersectObjects(this.scene.children, true);
        
        if (intersects.length > 0) {
            const intersect = intersects[0];
            this.showTooltip(intersect, event);
        } else {
            this.hideTooltip();
        }
    }

    /**
     * Показать подсказку
     */
    showTooltip(intersect, event) {
        const object = intersect.object;
        let tooltipText = '';

        if (object.userData && object.userData.text) {
            tooltipText = object.userData.text;
        } else if (object.parent && object.parent.name && object.parent.name.startsWith('sequence-')) {
            const sequenceId = object.parent.name.replace('sequence-', '');
            const sequence = this.objects.sequences.get(sequenceId);
            if (sequence) {
                tooltipText = `Последовательность ${sequenceId}`;
            }
        }

        if (tooltipText) {
            this.tooltip.textContent = tooltipText;
            this.tooltip.style.left = event.clientX + 10 + 'px';
            this.tooltip.style.top = event.clientY - 10 + 'px';
            this.tooltip.classList.remove('hidden');
        }
    }

    /**
     * Скрыть подсказку
     */
    hideTooltip() {
        this.tooltip.classList.add('hidden');
    }

    /**
     * Обновление 3D сцены
     * @param {Array} sequences - Массив последовательностей
     */
    async update(sequences) {
        if (!this.isInitialized) return;
        
        console.log('🎮 Обновление 3D сцены:', sequences.length, 'последовательностей');
        
        try {
            // Очистка предыдущих последовательностей
            this.clearSequences();
            
            // Создание новых визуализаций
            for (const sequenceData of sequences) {
                await this.createSequenceVisualization(sequenceData);
            }
            
            // Обновление камеры для показа всех данных
            this.fitCameraToSequences();
            
        } catch (error) {
            console.error('❌ Ошибка обновления 3D сцены:', error);
        }
    }

    /**
     * Создание 3D представления последовательности
     * @param {Object} sequenceData - Данные последовательности
     */
    async createSequenceVisualization(sequenceData) {
        const { id, sequence, color, startNumber } = sequenceData;
        
        // Создаем группу для последовательности
        const sequenceGroup = new THREE.Group();
        sequenceGroup.name = `sequence-${id}`;
        
        // Создаем точки для каждого числа в последовательности
        const points = this.createSequencePoints(sequence, color);
        sequenceGroup.add(points);
        
        // Создаем линии, соединяющие точки
        const lines = this.createSequenceLines(sequence, color);
        sequenceGroup.add(lines);
        
        // Создаем метки для важных точек
        const labels = this.createSequenceLabels(sequence, startNumber, color);
        labels.forEach(label => sequenceGroup.add(label));
        
        // Добавляем группу в сцену
        this.scene.add(sequenceGroup);
        
        // Сохраняем ссылку на объект
        this.objects.sequences.set(id, sequenceGroup);
        
        // Анимация появления
        this.animateSequenceAppearance(sequenceGroup);
    }

    /**
     * Создание точек последовательности
     * @param {Array} sequence - Последовательность чисел
     * @param {string} color - Цвет последовательности
     * @returns {THREE.Points} Объект точек
     */
    createSequencePoints(sequence, color) {
        const positions = [];
        const colors = [];
        const sizes = [];
        
        const colorObj = new THREE.Color(color);
        
        sequence.forEach((value, index) => {
            // Позиция: X = индекс, Y = значение, Z = 0
            positions.push(index, value, 0);
            
            // Цвет с градиентом
            const intensity = Math.min(value / 1000, 1);
            colors.push(
                colorObj.r * intensity,
                colorObj.g * intensity,
                colorObj.b * intensity
            );
            
            // Размер точки зависит от значения
            sizes.push(Math.max(0.2, Math.min(2, value / 100)));
        });
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: this.settings.pointSize,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        return new THREE.Points(geometry, material);
    }

    /**
     * Создание линий последовательности
     * @param {Array} sequence - Последовательность чисел
     * @param {string} color - Цвет последовательности
     * @returns {THREE.LineSegments} Объект линий
     */
    createSequenceLines(sequence, color) {
        const positions = [];
        const colors = [];
        
        const colorObj = new THREE.Color(color);
        
        for (let i = 0; i < sequence.length - 1; i++) {
            const current = sequence[i];
            const next = sequence[i + 1];
            
            // Текущая точка
            positions.push(i, current, 0);
            colors.push(colorObj.r, colorObj.g, colorObj.b);
            
            // Следующая точка
            positions.push(i + 1, next, 0);
            colors.push(colorObj.r, colorObj.g, colorObj.b);
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.LineBasicMaterial({
            color: colorObj,
            transparent: true,
            opacity: 0.6,
            linewidth: this.settings.lineWidth,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        return new THREE.LineSegments(geometry, material);
    }

    /**
     * Создание меток для последовательности
     * @param {Array} sequence - Последовательность чисел
     * @param {number} startNumber - Начальное число
     * @param {string} color - Цвет последовательности
     * @returns {Array} Массив меток
     */
    createSequenceLabels(sequence, startNumber, color) {
        const labels = [];
        const colorObj = new THREE.Color(color);
        
        // Метка для начального числа
        if (sequence.length > 0) {
            const startLabel = this.createTextLabel(
                `Начало: ${startNumber}`,
                new THREE.Vector3(0, sequence[0], 2),
                colorObj
            );
            labels.push(startLabel);
        }
        
        // Метка для максимального значения
        const maxValue = Math.max(...sequence);
        const maxIndex = sequence.indexOf(maxValue);
        if (maxIndex > 0) {
            const maxLabel = this.createTextLabel(
                `Макс: ${maxValue}`,
                new THREE.Vector3(maxIndex, maxValue, 2),
                new THREE.Color(0xff6b6b)
            );
            labels.push(maxLabel);
        }
        
        // Метка для конца последовательности
        if (sequence.length > 1) {
            const endLabel = this.createTextLabel(
                `Конец: ${sequence[sequence.length - 1]}`,
                new THREE.Vector3(sequence.length - 1, sequence[sequence.length - 1], 2),
                new THREE.Color(0x51cf66)
            );
            labels.push(endLabel);
        }
        
        return labels;
    }

    /**
     * Создание текстовой метки
     * @param {string} text - Текст метки
     * @param {THREE.Vector3} position - Позиция метки
     * @param {THREE.Color} color - Цвет метки
     * @returns {THREE.Mesh} Объект метки
     */
    createTextLabel(text, position, color) {
        // Создаем простую геометрию для метки
        const geometry = new THREE.SphereGeometry(0.3, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color });
        
        const label = new THREE.Mesh(geometry, material);
        label.position.copy(position);
        label.userData = { text, type: 'label' };
        
        return label;
    }

    /**
     * Анимация появления последовательности
     * @param {THREE.Group} sequenceGroup - Группа последовательности
     */
    animateSequenceAppearance(sequenceGroup) {
        // Начальное состояние - невидимость и масштаб 0
        sequenceGroup.children.forEach(child => {
            if (child.material) {
                child.material.opacity = 0;
            }
            child.scale.setScalar(0);
        });
        
        // Анимация появления с задержкой для каждого элемента
        sequenceGroup.children.forEach((child, index) => {
            setTimeout(() => {
                this.animateChildAppearance(child);
            }, index * 50); // Задержка 50мс между элементами
        });
    }

    /**
     * Анимация появления отдельного элемента
     * @param {THREE.Object3D} child - Дочерний объект
     */
    animateChildAppearance(child) {
        let progress = 0;
        const duration = 0.5; // 500мс
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            progress = Math.min(1, elapsed / duration);
            
            // Плавная анимация с easing
            const easeProgress = this.easeOutCubic(progress);
            
            if (child.material) {
                child.material.opacity = easeProgress;
            }
            child.scale.setScalar(easeProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    /**
     * Функция плавности для анимаций
     * @param {number} t - Время (0-1)
     * @returns {number} Плавное значение
     */
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    /**
     * Очистка последовательностей
     */
    clearSequences() {
        this.objects.sequences.forEach((group, id) => {
            this.scene.remove(group);
            group.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        });
        this.objects.sequences.clear();
        
        // Очистка меток
        this.objects.labels.forEach(label => {
            this.scene.remove(label);
        });
        this.objects.labels = [];
    }

    /**
     * Подгонка камеры под все последовательности
     */
    fitCameraToSequences() {
        if (this.objects.sequences.size === 0) return;
        
        const box = new THREE.Box3();
        
        this.objects.sequences.forEach(group => {
            group.traverse(child => {
                if (child.geometry) {
                    box.expandByObject(child);
                }
            });
        });
        
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const distance = maxDim * 2;
        
        this.camera.position.set(
            center.x + distance,
            center.y + distance,
            center.z + distance
        );
        this.camera.lookAt(center);
        
        this.controls.target.copy(center);
        this.controls.update();
    }

    /**
     * Сброс камеры в начальное положение
     */
    resetCamera() {
        this.camera.position.copy(this.cameraState.position);
        this.camera.lookAt(this.cameraState.target);
        this.controls.target.copy(this.cameraState.target);
        this.controls.update();
    }

    /**
     * Переключение анимации
     */
    toggleAnimation() {
        this.isAnimating = !this.isAnimating;
        const btn = document.getElementById('toggle3dAnimationBtn');
        if (btn) {
            btn.textContent = this.isAnimating ? 'Остановить' : 'Анимация';
        }
    }

    /**
     * Обновление информации о камере
     */
    updateCameraInfo() {
        const cameraInfo = document.getElementById('cameraInfo');
        if (cameraInfo) {
            const pos = this.camera.position;
            cameraInfo.textContent = `X: ${pos.x.toFixed(1)}, Y: ${pos.y.toFixed(1)}, Z: ${pos.z.toFixed(1)}`;
        }
    }

    /**
     * Обработка изменения размера окна
     */
    handleResize() {
        if (!this.container || !this.camera || !this.renderer) return;
        
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    /**
     * Основной цикл анимации
     */
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Обновление FPS информации
        this.updateFPSInfo();
        
        // Обновление контролов
        if (this.controls) {
            this.controls.update();
        }
        
        // Анимация объектов
        if (this.isAnimating) {
            this.animateObjects();
        }
        
        // Рендеринг сцены
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Анимация объектов сцены
     */
    animateObjects() {
        const time = Date.now() * this.settings.animationSpeed;
        
        // Анимация последовательностей
        this.objects.sequences.forEach((group, sequenceId) => {
            group.children.forEach((child, index) => {
                if (child instanceof THREE.Points) {
                    // Плавное вращение точек
                    child.rotation.y = Math.sin(time + index * 0.1) * 0.05;
                    
                    // Пульсация размера точек
                    const scale = 1 + Math.sin(time * 2 + index * 0.2) * 0.1;
                    child.scale.setScalar(scale);
                }
                
                if (child instanceof THREE.LineSegments) {
                    // Плавное изменение прозрачности линий
                    if (child.material) {
                        child.material.opacity = 0.4 + Math.sin(time + index * 0.3) * 0.2;
                    }
                }
            });
        });
        
        // Анимация меток
        this.objects.labels.forEach((label, index) => {
            // Пульсация меток
            const scale = 1 + Math.sin(time * 3 + index * 0.5) * 0.15;
            label.scale.setScalar(scale);
            
            // Плавное вращение меток
            label.rotation.y = Math.sin(time * 0.5 + index * 0.2) * 0.1;
        });
        
        // Анимация сетки
        if (this.objects.grid) {
            this.objects.grid.rotation.y = Math.sin(time * 0.1) * 0.02;
        }
        
        // Анимация освещения
        if (this.lights) {
            // Плавное изменение интенсивности направленного света
            this.lights.directional.intensity = 0.6 + Math.sin(time * 0.5) * 0.2;
            
            // Вращение точечного источника света
            this.lights.point.position.x = Math.sin(time * 0.3) * 50;
            this.lights.point.position.z = Math.cos(time * 0.3) * 50;
        }
    }

    /**
     * Обновление информации о FPS
     */
    updateFPSInfo() {
        const fpsInfo = document.getElementById('fpsInfo');
        if (fpsInfo) {
            // Простая симуляция FPS
            fpsInfo.textContent = '60';
        }
    }

    /**
     * Изменение размера 3D сцены
     */
    resize() {
        this.handleResize();
    }

    /**
     * Очистка ресурсов
     */
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        this.clearSequences();
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.scene) {
            this.scene.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(material => material.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        }
    }
} 