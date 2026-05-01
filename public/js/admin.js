// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuth();

    // Initialize sidebar toggle
    initSidebarToggle();

    // Initialize navigation - DISABLED to allow normal page navigation
    // initNavigation();

    // Initialize charts
    initCharts();

    // Load dashboard data
    loadDashboardData();
    
    // Initialize monthly issue button check
    checkMonthlyActivation();
    setInterval(checkMonthlyActivation, 3600000); // Check every hour
    
    // Add modern animations and effects
    addCardAnimations();
    initSmoothScroll();
    addRippleEffect();
    // initPlanTooltip вызывается автоматически через IIFE при готовности DOM
    initPlanLegendNavigation();
    
    // Add loading complete class for animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

window.addEventListener('spa:contentLoaded', function(e) {
    // Check monthly issue activation on page change
    checkMonthlyActivation();
    
    setTimeout(() => {
        const planOverlay = document.querySelector('.plan-overlay');
        if (planOverlay || (e.detail && e.detail.route === '/blocks')) {
            // 3. При SPA-переходе — просто сбрасываем текущее состояние, НЕ переинициализируя слушатели
            const tooltip = document.getElementById('planTooltip');
            if (tooltip) {
                tooltip.classList.add('hidden');
                tooltip.classList.remove('visible');
            }
            // Сбрасываем текущую область через глобальную переменную
            window.currentArea = null;
        }
    }, 200);
    // initPlanLegendNavigation можно вызывать, так как она проверяет существование элементов
    initPlanLegendNavigation();
});

// Check if user is authenticated and has admin role
function checkAuth() {
    // DISABLED - allow access without authentication for development
    // const authToken = localStorage.getItem('authToken');
    // const userRole = localStorage.getItem('userRole');

    // if (!authToken || userRole !== 'admin') {
    //     window.location.href = '/';
    //     return;
    // }

    // Set user info
    const username = localStorage.getItem('username') || 'Admin';
    const userNameEl = document.querySelector('.user-name');
    const userAvatarEl = document.querySelector('.user-avatar');
    
    if (userNameEl) {
        userNameEl.textContent = username;
    }
    
    if (userAvatarEl) {
        userAvatarEl.textContent = username.substring(0, 2).toUpperCase();
    }
}

// Sidebar toggle functionality - DISABLED to avoid conflicts with inline script
// The sidebar toggle is now handled in index.html inline script
function initSidebarToggle() {
    // This function is disabled to prevent conflicts
    // Sidebar toggle is handled in admin/index.html inline script
    console.log('initSidebarToggle called but disabled - using inline script handler instead');
    
    // Only handle ESC key for sidebar toggle (if not already handled)
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        // ESC key to toggle sidebar - only if not already handled
        const escHandler = function(e) {
            if (e.key === 'Escape' && window.innerWidth > 768) {
                const isCollapsed = sidebar.classList.contains('collapsed');
                sidebar.classList.toggle('collapsed');
                localStorage.setItem('sidebarCollapsed', !isCollapsed);
            }
        };
        
        // Check if ESC handler already exists
        document.addEventListener('keydown', escHandler);
    }
}

// Navigation functionality
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(navItem => navItem.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');

            // Get the href and load corresponding content
            const href = this.getAttribute('href');
            loadContent(href);
        });
    });
}

// Load content based on navigation
function loadContent(section) {
    // Полностью отключаем legacy-обновление заголовков.
    // Сейчас всю навигацию и заголовки контролирует SPA Router (spa-router.js),
    // поэтому эта функция должна НИЧЕГО не менять, иначе заголовок может
    // мигать "Панель управления" при переходах между страницами.
    console.log('Sidebar Toggle Script: loadContent() is legacy and is now a no-op in SPA mode.', section);
    return;
    
    // Update page title
    const pageTitle = document.querySelector('.page-title h1');
    const breadcrumb = document.querySelector('.breadcrumb-item:last-child');
    
    const sectionNames = {
        '#dashboard': 'Панель управления',
        '#analytics': 'Аналитика',
        '#reports': 'Отчеты',
        '#users': 'Пользователи',
        '#buildings': 'Здания',
        '#apartments': 'Квартиры',
        '#meters': 'Счетчики',
        '#payments': 'Платежи',
        '#invoices': 'Счета',
        '#debts': 'Задолженности',
        '#maintenance': 'Заявки на ремонт',
        '#inspections': 'Проверки',
        '#staff': 'Персонал',
        '#settings': 'Настройки',
        '#logs': 'Логи',
        '#backup': 'Резервное копирование'
    };

    if (pageTitle && sectionNames[section]) {
        pageTitle.textContent = sectionNames[section];
    }
    
    if (breadcrumb && sectionNames[section]) {
        breadcrumb.textContent = sectionNames[section];
    }

    // TODO: Load actual content from FastAPI backend
    // This will be connected to your backend API
}

// Initialize charts with Chart.js
function initCharts() {
    // Chart buttons
    const chartBtns = document.querySelectorAll('.chart-btn');
    
    chartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            chartBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update chart data based on selected period
            const selectedPeriod = this.dataset.period || this.textContent;
            console.log('Chart period changed to:', selectedPeriod);
            updateChartData(selectedPeriod);
        });
    });

    // Initialize Chart.js
    initPaymentChart();

    // Re-localize chart labels on interface language switch
    window.addEventListener('languageChanged', refreshChartLabelsByActivePeriod);
    window.addEventListener('storage', (e) => {
        if (e.key === 'language') refreshChartLabelsByActivePeriod();
    });
}

// Create a beautiful gradient chart
function initPaymentChart() {
    const chartPlaceholder = document.querySelector('.chart-placeholder');
    
    if (!chartPlaceholder) return;
    
    // Replace placeholder with canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'paymentChart';
    canvas.style.maxHeight = '300px';
    chartPlaceholder.innerHTML = '';
    chartPlaceholder.appendChild(canvas);
    chartPlaceholder.style.background = 'transparent';
    
    const ctx = canvas.getContext('2d');
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(102, 126, 234, 0.8)');
    gradient.addColorStop(1, 'rgba(118, 75, 162, 0.1)');
    
    // Sample data
    const data = {
        labels: [
            tr('monday', 'Mon'),
            tr('tuesday', 'Tue'),
            tr('wednesday', 'Wed'),
            tr('thursday', 'Thu'),
            tr('friday', 'Fri'),
            tr('saturday', 'Sat'),
            tr('sunday', 'Sun')
        ],
        datasets: [{
            label: tr('chart_payments_series', 'Payments'),
            data: [12000, 19000, 15000, 25000, 22000, 18000, 24000],
            backgroundColor: gradient,
            borderColor: 'rgba(102, 126, 234, 1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#fff',
            pointBorderColor: 'rgba(102, 126, 234, 1)',
            pointBorderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointHoverBackgroundColor: 'rgba(102, 126, 234, 1)',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 3
        }]
    };
    
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return '₼' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return '₼' + value.toLocaleString();
                        },
                        color: '#6c757d'
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#6c757d'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    };
    
    window.paymentChart = new Chart(ctx, config);
}

// Update chart data based on period
function updateChartData(period) {
    if (!window.paymentChart) return;
    
    let newData, newLabels;
    const periodKey = normalizeChartPeriod(period);
    
    if (periodKey === 'week') {
        newLabels = [
            tr('monday', 'Mon'),
            tr('tuesday', 'Tue'),
            tr('wednesday', 'Wed'),
            tr('thursday', 'Thu'),
            tr('friday', 'Fri'),
            tr('saturday', 'Sat'),
            tr('sunday', 'Sun')
        ];
        newData = [12000, 19000, 15000, 25000, 22000, 18000, 24000];
    } else if (periodKey === 'month') {
        newLabels = [
            tr('chart_week_1', 'Week 1'),
            tr('chart_week_2', 'Week 2'),
            tr('chart_week_3', 'Week 3'),
            tr('chart_week_4', 'Week 4')
        ];
        newData = [85000, 92000, 88000, 95000];
    } else if (periodKey === 'year') {
        newLabels = [
            tr('month_january', 'January'),
            tr('month_february', 'February'),
            tr('month_march', 'March'),
            tr('month_april', 'April'),
            tr('month_may', 'May'),
            tr('month_june', 'June'),
            tr('month_july', 'July'),
            tr('month_august', 'August'),
            tr('month_september', 'September'),
            tr('month_october', 'October'),
            tr('month_november', 'November'),
            tr('month_december', 'December')
        ];
        newData = [320000, 340000, 330000, 360000, 350000, 380000, 390000, 370000, 385000, 395000, 400000, 420000];
    } else {
        return;
    }
    
    window.paymentChart.data.labels = newLabels;
    window.paymentChart.data.datasets[0].label = tr('chart_payments_series', 'Payments');
    window.paymentChart.data.datasets[0].data = newData;
    window.paymentChart.update('active');
}

function tr(key, fallback = '') {
    const lang = localStorage.getItem('language') || window.i18n?.currentLanguage || 'az';
    return window.i18n?.translate?.(key, lang) || fallback || key;
}

function normalizeChartPeriod(periodRaw) {
    const period = String(periodRaw || '').trim().toLowerCase();

    if (['day', 'week', 'month', 'year'].includes(period)) return period;
    if (['день', 'gün'].includes(period)) return 'day';
    if (['неделя', 'həftə'].includes(period)) return 'week';
    if (['месяц', 'ay'].includes(period)) return 'month';
    if (['год', 'il'].includes(period)) return 'year';

    return period;
}

function refreshChartLabelsByActivePeriod() {
    if (!window.paymentChart) return;
    const activeBtn = document.querySelector('.chart-btn.active');
    const selectedPeriod = activeBtn?.dataset?.period || activeBtn?.textContent || 'week';
    updateChartData(selectedPeriod);
}

// Load dashboard data
async function loadDashboardData() {
    try {
        // TODO: Fetch data from FastAPI backend
        // const response = await fetch('FASTAPI_URL/api/dashboard/stats', {
        //     headers: {
        //         'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        //     }
        // });
        // const data = await response.json();
        
        // For now, using placeholder data
        // console.log('Dashboard data loaded (placeholder)');
        
        // Update stats with real data when backend is ready
        updateStats({
            totalUsers: data.totalUsers,
            totalBuildings: data.totalBuildings,
            monthlyPayments: data.monthlyPayments,
            activeRequests: data.activeRequests
        });

    } catch (error) {
        //console.error('Error loading dashboard data:', error);
    }
}

// Update statistics with animated counters
function updateStats(data) {
    console.log('Updating stats with:', data);
    
    // Animate counter numbers
    animateValue('.stat-card:nth-child(1) .stat-value', 0, data.totalUsers, 2000);
    animateValue('.stat-card:nth-child(2) .stat-value', 0, data.totalBuildings, 2000);
    animateValue('.stat-card:nth-child(4) .stat-value', 0, data.activeRequests, 2000);
}

// Animate counter from start to end
function animateValue(selector, start, end, duration) {
    const element = document.querySelector(selector);
    if (!element) return;
    
    const range = end - start;
    const increment = range / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        
        // Format number with separators
        const formatted = Math.floor(current).toLocaleString('ru-RU');
        element.textContent = formatted;
    }, 16);
}

// Add entrance animations to cards
function addCardAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards
    const cards = document.querySelectorAll('.stat-card, .chart-card, .activity-card, .card');
    cards.forEach(card => {
        observer.observe(card);
    });
}

// Add smooth scroll behavior
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || !href) return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add ripple effect to buttons
function addRippleEffect() {
    const buttons = document.querySelectorAll('.nav-item, .chart-btn, button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Interactive plan tooltip for Blocks page
(function() {
    // 1. Предотвращаем повторную инициализацию
    if (window.__tooltipInitialized) {
        return;
    }
    window.__tooltipInitialized = true;
    
    // Инициализируем кеш для SVG overlay при первой загрузке
    if (!window.__cachedPlanOverlay) {
        // Сохраняем SVG overlay в кеш при первой загрузке страницы
        const initCache = () => {
            const overlay = document.querySelector('.plan-overlay');
            if (overlay && !window.__cachedPlanOverlay) {
                window.__cachedPlanOverlay = overlay.cloneNode(true);
            }
        };
        
        // Пытаемся сохранить в кеш сразу, если DOM готов
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initCache);
        } else {
            setTimeout(initCache, 100);
        }
    }

    let currentArea = null;
    let tooltip = null;
    let titleEl = null;
    let descEl = null;
    const isMobileOrTouch = () => window.matchMedia('(max-width: 768px)').matches || ('ontouchstart' in window);

    function hideTooltip() {
        if (!tooltip) return;
        tooltip.classList.add('hidden');
        tooltip.classList.remove('visible');
        currentArea = null;
        window.currentArea = null;
    }

    function ensurePlanTooltipElement() {
        // Проверяем существующий элемент
        if (window.planTooltipElement && document.body && document.body.contains(window.planTooltipElement)) {
            return window.planTooltipElement;
        }
        
        // Убеждаемся что body готов
        if (!document.body) {
            console.warn('initPlanTooltip: document.body not ready');
            return null;
        }
        
        const tooltipEl = document.createElement('div');
        tooltipEl.id = 'planTooltip';
        tooltipEl.className = 'plan-tooltip hidden';
        tooltipEl.style.cssText = 'position: fixed; z-index: 10000; pointer-events: none;';
        tooltipEl.innerHTML = `
            <div class="tooltip-title-row">
                <span class="tooltip-dot"></span>
                <span class="tooltip-title">Зона</span>
            </div>
            <div class="tooltip-desc">Информация уточняется.</div>
        `;
        
        document.body.appendChild(tooltipEl);
        window.planTooltipElement = tooltipEl;
        return tooltipEl;
    }

    // Функция для проверки класса элемента (работает с SVG и обычными элементами)
    function hasClass(element, className) {
        if (!element) return false;
        // Для SVG элементов используем getAttribute
        if (element.tagName && ['svg', 'polygon', 'path', 'circle', 'rect'].includes(element.tagName.toLowerCase())) {
            const classAttr = element.getAttribute('class') || '';
            return classAttr.split(/\s+/).includes(className);
        }
        // Для обычных элементов используем classList
        if (element.classList) {
            return element.classList.contains(className);
        }
        return false;
    }

    // Функция для получения полигона из события
    function getPolygonFromEvent(event) {
        let target = event.target;
        if (!target) return null;
        
        // Проверяем сам элемент
        if (hasClass(target, 'plan-area')) {
            return target;
        }
        
        // Для SVG элементов closest может не работать, проверяем вручную
        if (target.tagName && target.tagName.toLowerCase() === 'polygon' && hasClass(target, 'plan-area')) {
            return target;
        }
        
        // Проверяем родительские элементы (на случай вложенных элементов)
        if (target.closest) {
            try {
                const closest = target.closest('.plan-area');
                if (closest) return closest;
            } catch (e) {
                // closest может не работать для SVG в некоторых браузерах
            }
        }
        
        // Для SVG: проверяем родительские элементы вручную
        let parent = target.parentElement || target.parentNode;
        let depth = 0;
        while (parent && depth < 10) {
            if (hasClass(parent, 'plan-area')) {
                return parent;
            }
            parent = parent.parentElement || parent.parentNode;
            depth++;
        }
        
        return null;
    }

    // Обработчик входа мыши
    function handleEnter(event) {
        if (isMobileOrTouch()) {
            hideTooltip();
            return;
        }
        const polygon = getPolygonFromEvent(event);
        if (!polygon) {
            hideTooltip();
            return;
        }

        // Инициализируем tooltip при первом использовании
        if (!tooltip) {
            tooltip = ensurePlanTooltipElement();
            if (!tooltip) {
                console.warn('initPlanTooltip: failed to create tooltip element');
                return;
            }
            titleEl = tooltip.querySelector('.tooltip-title');
            descEl = tooltip.querySelector('.tooltip-desc');
            if (!titleEl || !descEl) {
                console.warn('initPlanTooltip: failed to find tooltip elements');
                return;
            }
        }

        currentArea = polygon;
        window.currentArea = currentArea;
        
        // Получаем данные из data-атрибутов (для SVG используем getAttribute)
        const label = polygon.dataset?.blockLabel || polygon.getAttribute('data-block-label') || 'Зона';
        const info = polygon.dataset?.blockInfo || polygon.getAttribute('data-block-info') || 'Информация уточняется.';
        
        if (titleEl) titleEl.textContent = label;

        // Если в data-block-info передан HTML (начинается с '<'),
        // рендерим как HTML (например, список этажей/квартир/жителей/заселённости),
        // иначе выводим как обычный текст.
        if (info && info.trim().startsWith('<')) {
            if (descEl) descEl.innerHTML = info;
        } else {
            if (descEl) descEl.textContent = info;
        }

        if (tooltip) {
            // Убеждаемся что tooltip видим и правильно позиционирован
            tooltip.style.display = '';
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
            tooltip.classList.remove('hidden');
            tooltip.classList.add('visible');
            
            // Позиционируем tooltip сразу
            tooltip.style.left = `${event.clientX}px`;
            tooltip.style.top = `${event.clientY - 16}px`;
        }
    }

    // Обработчик движения мыши
    function moveTooltip(event) {
        if (isMobileOrTouch()) {
            hideTooltip();
            return;
        }
        if (!currentArea || !tooltip) return;
        
        tooltip.style.left = `${event.clientX}px`;
        tooltip.style.top = `${event.clientY - 16}px`;
    }

    // Обработчик выхода мыши
    function handleLeave(event) {
        if (isMobileOrTouch()) {
            hideTooltip();
            return;
        }
        const polygon = getPolygonFromEvent(event);
        if (!polygon || polygon === currentArea) {
            hideTooltip();
        }
    }

    // Инициализация: навешиваем делегированные обработчики на document (БЕЗ capture)
    // Выполняется один раз при загрузке скрипта
    document.addEventListener('mouseover', handleEnter, { passive: true });
    document.addEventListener('mousemove', moveTooltip, { passive: true });
    document.addEventListener('mouseout', handleLeave, { passive: true });
    window.addEventListener('scroll', hideTooltip, { passive: true });
    document.addEventListener('touchstart', hideTooltip, { passive: true });
    document.addEventListener('click', hideTooltip, { passive: true });
    
    // Отладочная функция для проверки работы tooltip
    window.debugPlanTooltip = function() {
        console.log('=== Plan Tooltip Debug ===');
        console.log('Tooltip initialized:', window.__tooltipInitialized);
        console.log('Current area:', currentArea);
        console.log('Tooltip element:', tooltip);
        console.log('Cached overlay:', window.__cachedPlanOverlay ? 'exists' : 'not found');
        const overlays = document.querySelectorAll('.plan-overlay');
        console.log('Overlays in DOM:', overlays.length);
        const polygons = document.querySelectorAll('.plan-area');
        console.log('Polygons in DOM:', polygons.length);
        if (polygons.length > 0) {
            console.log('First polygon:', polygons[0]);
            console.log('First polygon classes:', polygons[0].getAttribute('class'));
            console.log('First polygon data:', {
                blockCode: polygons[0].getAttribute('data-block-code'),
                blockLabel: polygons[0].getAttribute('data-block-label'),
                blockInfo: polygons[0].getAttribute('data-block-info')
            });
        }
        const tooltipEl = document.getElementById('planTooltip');
        if (tooltipEl) {
            console.log('Tooltip element found:', tooltipEl);
            console.log('Tooltip classes:', tooltipEl.className);
            console.log('Tooltip style:', tooltipEl.style.cssText);
        } else {
            console.log('Tooltip element NOT found in DOM');
        }
    };

    // Экспортируем функцию для внешнего использования (пустая, так как уже инициализировано)
    window.initPlanTooltip = function() {
        // Функция уже инициализирована, ничего не делаем
        console.log('initPlanTooltip: already initialized via IIFE');
    };
})();

// Навигация по плану по клику на легенду блоков
function initPlanLegendNavigation() {
    const planFrame = document.querySelector('.plan-image-frame');
    const legendItems = document.querySelectorAll('.plan-legend span[data-block-code]');
    const areas = document.querySelectorAll('.plan-area[data-block-code]');
    
    if (!planFrame || !legendItems.length || !areas.length) {
        return;
    }
    
    const areaByCode = {};
    areas.forEach(area => {
        const code = (area.dataset.blockCode || '').toUpperCase();
        if (code) {
            areaByCode[code] = area;
        }
    });
    
    legendItems.forEach(item => {
        if (item.dataset.planLegendBound === 'true') return;
        item.dataset.planLegendBound = 'true';
        item.style.cursor = 'pointer';
        
        item.addEventListener('click', () => {
            const code = (item.dataset.blockCode || '').toUpperCase();
            const targetArea = areaByCode[code];
            
            // Плавно скроллим к плану
            planFrame.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            
            // Кратко подсвечиваем нужный блок
            if (targetArea) {
                targetArea.classList.add('highlight');
                setTimeout(() => {
                    targetArea.classList.remove('highlight');
                }, 1200);
            }
        });
    });
}

// Add CSS for ripple effect dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    button, .nav-item, .chart-btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(rippleStyle);

// Logout functionality
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    window.location.href = '/';
}

// Add logout button event listener
document.addEventListener('click', function(e) {
    if (e.target.closest('.logout-btn')) {
        logout();
    }
});

// Search functionality
const searchInput = document.querySelector('.search-box input');
if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        console.log('Searching for:', searchTerm);
        
        // TODO: Implement search functionality
        // This will search through users, buildings, apartments, etc.
    });
}

// Notification button
const notificationBtn = document.querySelector('.notification-btn');
if (notificationBtn) {
    notificationBtn.addEventListener('click', function() {
        console.log('Show notifications');
        // TODO: Show notifications dropdown
    });
}

// Auto-refresh data every 30 seconds
setInterval(() => {
    loadDashboardData();
}, 30000);

// Helper function to get modal root for admin panel
function getAdminModalRoot() {
    let root = document.getElementById('adminModalRoot');
    if (!root) {
        root = document.createElement('div');
        root.id = 'adminModalRoot';
        document.body.appendChild(root);
    }
    return root;
}

// Internal function to show confirm modal (dark theme)
function showAdminConfirmModal(options) {
    const tr = (key, fallback) => {
        const lang = localStorage.getItem('language') || window.i18n?.currentLanguage || 'az';
        return window.i18n?.translate?.(key, lang) || fallback || key;
    };
    const {
        title = tr('confirm_action_title', 'Confirm action'),
        message = '',
        confirmText = 'OK',
        cancelText = tr('cancel', 'Cancel')
    } = options || {};

    return new Promise((resolve) => {
        const root = getAdminModalRoot();
        const overlay = document.createElement('div');
        overlay.className = 'account-modal-overlay';
        overlay.innerHTML = `
            <div class="account-modal" style="max-width:520px">
                <div class="account-modal-header">
                    <h2>${title}</h2>
                    <button class="account-modal-close" type="button">&times;</button>
                </div>
                <div class="account-modal-body">
                    <div style="display:flex; gap:12px; align-items:flex-start;">
                        <div style="width:38px; height:38px; border-radius:10px; background:#f59e0b; color:#fff; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 20px rgba(0,0,0,.2); flex-shrink:0;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                        </div>
                        <div style="white-space:pre-wrap; color:#fff;">${message}</div>
                    </div>
                </div>
                <div class="account-modal-footer">
                    <button class="account-btn account-btn-secondary btn-cancel" type="button">${cancelText}</button>
                    <button class="account-btn account-btn-primary btn-ok" type="button">${confirmText}</button>
                </div>
            </div>`;

        let resolved = false;
        function close(result) {
            if (resolved) return;
            resolved = true;
            overlay.classList.remove('show');
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.remove();
                }
                document.body.style.overflow = '';
                resolve(result);
            }, 150);
        }

        overlay.addEventListener('click', (e) => { 
            if (e.target === overlay) close(false); 
        });
        overlay.querySelector('.account-modal-close').addEventListener('click', () => close(false));
        overlay.querySelector('.btn-cancel').addEventListener('click', () => close(false));
        overlay.querySelector('.btn-ok').addEventListener('click', () => close(true));
        
        const escHandler = function(e) {
            if (e.key === 'Escape') {
                close(false);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        root.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        
        // Show with animation
        setTimeout(() => overlay.classList.add('show'), 10);
    });
}

// Global showConfirm function for admin panel (dark theme modal)
// Usage: showConfirm(message, title) returns Promise<boolean>
// Or: showConfirm(message, onConfirm, onCancel) for callback style
window.showConfirm = function showConfirm(message, titleOrCallback, onCancel) {
    // If second argument is a function, use callback style (legacy)
    if (typeof titleOrCallback === 'function') {
        const onConfirm = titleOrCallback;
        const promise = showAdminConfirmModal({
            title: (window.i18n?.translate?.('confirm_action_title') || 'Confirm action'),
            message: message,
            confirmText: 'OK',
            cancelText: (window.i18n?.translate?.('cancel') || 'Cancel')
        });
        promise.then((confirmed) => {
            if (confirmed && typeof onConfirm === 'function') {
                onConfirm(true);
            } else if (!confirmed) {
                if (typeof onCancel === 'function') {
                    onCancel(false);
                } else if (typeof onConfirm === 'function') {
                    onConfirm(false);
                }
            }
        });
        return promise;
    }
    
    // Promise style: showConfirm(message, title)
    const title = typeof titleOrCallback === 'string'
        ? titleOrCallback
        : (window.i18n?.translate?.('confirm_action_title') || 'Confirm action');
    return showAdminConfirmModal({
        title: title,
        message: message,
        confirmText: 'OK',
        cancelText: (window.i18n?.translate?.('cancel') || 'Cancel')
    });
};

// Monthly Invoice Issue Logic
function checkMonthlyActivation() {
    const btn = document.getElementById('btnMonthlyIssue');
    const timerBadge = document.getElementById('monthlyCountdown');
    const timerValue = document.getElementById('timerValue');
    if (!btn || !timerBadge) return;
    const t = (key, fallback) => {
        if (window.i18n && typeof window.i18n.translate === 'function') {
            return window.i18n.translate(key);
        }
        return fallback;
    };

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    // Функция для получения даты активации (последний день - 1)
    function getActivationDate(year, month) {
        const lastDay = new Date(year, month + 1, 0).getDate();
        return new Date(year, month, lastDay - 1, 0, 0, 0);
    }

    const lastDone = localStorage.getItem('lastMonthlyNotifyMonthYear');
    const currentMonthKey = `${currentMonth}-${currentYear}`;
    const alreadyDoneThisMonth = (lastDone === currentMonthKey);

    let targetDate = getActivationDate(currentYear, currentMonth);
    
    // Если уже отправили в этом месяце, цель — следующий месяц
    if (alreadyDoneThisMonth) {
        targetDate = getActivationDate(currentYear, currentMonth + 1);
    }

    const diff = targetDate - now;

    if (diff <= 0 && !alreadyDoneThisMonth) {
        // Время пришло и еще не отправляли
        btn.style.setProperty('display', 'flex', 'important');
        btn.disabled = false;
        timerBadge.style.setProperty('display', 'none', 'important');
        btn.title = t('monthly_issue_ready_title', 'Активируется за 1 день до конца месяца');
    } else {
        // Показываем таймер
        btn.style.setProperty('display', 'none', 'important');
        btn.disabled = true;
        timerBadge.style.setProperty('display', 'flex', 'important');
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        const dayShort = t('payment_timer_day_short', 'д');
        let timeStr = "";
        if (days > 0) timeStr += `${days}${dayShort} `;
        timeStr += `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        if (timerValue) timerValue.innerText = timeStr;
        timerBadge.title = alreadyDoneThisMonth
            ? t('monthly_issue_done_title', 'Рассылка за этот месяц уже выполнена')
            : t('monthly_issue_activates_in', 'Активация через {time}').replace('{time}', timeStr);
    }

    // Для дебага (форсированная активация через URL)
    if (window.location.search.includes('debug_monthly=1')) {
        btn.style.setProperty('display', 'flex', 'important');
        btn.disabled = false;
        timerBadge.style.setProperty('display', 'none', 'important');
    }
}

// Запускаем обновление таймера каждую секунду
setInterval(checkMonthlyActivation, 1000);

window.issueMonthlyInvoices = async function() {
    const t = (key, fallback) => {
        if (window.i18n && typeof window.i18n.translate === 'function') {
            return window.i18n.translate(key);
        }
        return fallback;
    };
    const lang = localStorage.getItem('language') || window.i18n?.currentLanguage || 'az';
    const localeByLang = { az: 'az-AZ', ru: 'ru-RU', en: 'en-GB' };
    const dateLocale = localeByLang[lang] || 'az-AZ';

    const daysRadio = document.querySelector('input[name="paymentDaysTop"]:checked');
    const daysToPay = parseInt(daysRadio ? daysRadio.value : "3");
    
    const now = new Date();
    const dueDate = new Date();
    dueDate.setDate(now.getDate() + daysToPay);
    
    const formattedDueDate = dueDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const confirmLine1 = t(
        'monthly_issue_confirm_message',
        'Bütün tərtib edilmiş hesablar üzrə istifadəçilərə bildiriş göndərilsin?'
    );
    const confirmLine2 = t(
        'monthly_issue_confirm_due_date',
        'Bildirişdə ödəniş son tarixi: {date} (+{days} gün)'
    )
        .replace('{date}', dueDate.toLocaleDateString(dateLocale))
        .replace('{days}', String(daysToPay));
    const confirmMessage = `${confirmLine1}\n${confirmLine2}`;
    
    if (window.showConfirm) {
        const confirmTitle = t('monthly_issue_confirm_title', 'Bildiriş göndərişi');
        window.showConfirm(confirmMessage, confirmTitle).then(async (confirmed) => {
            if (confirmed) await performMonthlyNotifyAll(formattedDueDate);
        });
    } else {
        if (confirm(confirmMessage)) {
            await performMonthlyNotifyAll(formattedDueDate);
        }
    }
};

async function performMonthlyNotifyAll(dueDate) {
    const API_BASE = window.getApiBase ? window.getApiBase() : (window.API_BASE || window.BACKEND_API_BASE || 'http://localhost:8000');
    
    try {
        const payload = {
            due_date: dueDate
        };
        
        let response = await fetch(`${API_BASE}/api/invoices/bulk-notify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include'
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Ошибка сервера');
        }
        
        const data = await response.json();
        
        // Помечаем, что в этом месяце уже отправляли
        const now = new Date();
        localStorage.setItem('lastMonthlyNotifyMonthYear', `${now.getMonth()}-${now.getFullYear()}`);
        checkMonthlyActivation(); // Сразу скрываем кнопку и включаем таймер

        const successMessage = (window.i18n?.translate?.('monthly_issue_success') || 'Bildirişlər uğurla göndərildi! Say: {count}')
            .replace('{count}', String(data.count));
        if (window.showSuccess) {
            showSuccess(successMessage);
        } else {
            alert(successMessage);
        }
        
    } catch (error) {
        console.error('Error sending bulk notifications:', error);
        const errorMessage = (window.i18n?.translate?.('monthly_issue_error_prefix') || 'Xəta: {message}')
            .replace('{message}', error.message);
        if (window.showError) {
            showError(errorMessage);
        } else {
            alert(errorMessage);
        }
    }
}