// 🚀 SPA Router for RoyalPark Admin Panel
// Single Page Application роутер

class SPARouter {
    constructor() {
        this.routes = {
            // Главное
            '/': '/admin/content/dashboard.html',
            '/dashboard': '/admin/content/dashboard.html',
            '/analytics': '/admin/content/analytics.html',
            '/reports': '/admin/content/reports.html',
            
            // Управление
            '/blocks': '/admin/content/blocks.html',
            '/tariffs': '/admin/content/tariffs.html',
            '/residents': '/admin/content/residents.html',
            '/tenants': '/admin/content/tenants.html',
            '/readings': '/admin/content/readings.html',
            '/sales': '/admin/content/sales.html',
            
            // Финансы
            '/payments': '/admin/content/payments.html',
            '/payment-view': '/admin/content/payment-view.html',
            '/invoices': '/admin/content/invoices.html',
            '/debts': '/admin/content/debts.html',
            '/appeals': '/admin/content/appeals-table.html',
            '/appeals2': '/admin/content/appeals2.html',
            '/invoice-view': '/admin/content/invoice-view.html',
            
            // Обслуживание
            '/repair-requests': '/admin/content/repair-requests.html',
            '/inspections': '/admin/content/inspections.html',
            '/staff': '/admin/content/staff.html',
            
            // Система
            '/news': '/admin/content/news.html',
            '/settings': '/admin/content/settings.html',
            '/logs': '/admin/content/logs.html',
            '/backup': '/admin/content/backup.html',
            
            // Недвижимость
            '/buildings': '/admin/content/buildings.html',
            '/apartments': '/admin/content/apartments.html',
            '/users': '/admin/content/users.html',
            '/meters': '/admin/content/meters.html'
        };
        
        // Маппинг роутов к заголовкам и breadcrumbs
        this.pageInfo = {
            // Главное
            '/dashboard': {
                title: 'Панель управления',
                breadcrumb: ['Главная', 'Панель управления'],
                section: 'Главное'
            },
            '/analytics': {
                title: 'Аналитика',
                breadcrumb: ['Главная', 'Аналитика'],
                section: 'Главное'
            },
            '/reports': {
                title: 'Отчеты',
                breadcrumb: ['Главная', 'Отчеты'],
                section: 'Главное'
            },
            
            // Управление
            '/blocks': {
                title: 'Блоки',
                breadcrumb: ['Управление', 'Блоки'],
                section: 'Управление'
            },
            '/tariffs': {
                title: 'Тарифы',
                breadcrumb: ['Управление', 'Тарифы'],
                section: 'Управление'
            },
            '/residents': {
                title: 'Резиденты',
                breadcrumb: ['Управление', 'Резиденты'],
                section: 'Управление'
            },
            '/tenants': {
                title: 'Жители',
                breadcrumb: ['Управление', 'Жители'],
                section: 'Управление'
            },
            '/readings': {
                title: 'Показатели',
                breadcrumb: ['Управление', 'Показатели'],
                section: 'Управление'
            },
            '/users': {
                title: 'Пользователи',
                breadcrumb: ['Управление', 'Пользователи'],
                section: 'Управление'
            },
            '/sales': {
                title: 'Продажи',
                breadcrumb: ['Управление', 'Продажи'],
                section: 'Управление'
            },
            
            // Финансы
            '/payments': {
                title: 'Платежи',
                breadcrumb: ['Финансы', 'Платежи'],
                section: 'Финансы'
            },
            '/payment-view': {
                title: 'Платежи',
                breadcrumb: ['Финансы', 'Платежи'],
                section: 'Финансы'
            },
            '/invoices': {
                title: 'Счета',
                breadcrumb: ['Финансы', 'Счета'],
                section: 'Финансы'
            },
            '/debts': {
                title: 'Обращения',
                breadcrumb: ['Финансы', 'Обращения'],
                section: 'Финансы'
            },
            '/appeals': {
                title: 'Обращения 11',
                breadcrumb: ['Финансы', 'Обращения 11'],
                section: 'Финансы'
            },
            '/appeals2': {
                title: 'Обращения',
                breadcrumb: ['Финансы', 'Обращения'],
                section: 'Финансы'
            },
            '/invoice-view': {
                title: 'Invoice view',
                breadcrumb: ['Финансы', 'Счета', 'Invoice view'],
                section: 'Финансы'
            },
            
            // Обслуживание
            '/repair-requests': {
                title: 'Заявки на ремонт',
                breadcrumb: ['Обслуживание', 'Заявки на ремонт'],
                section: 'Обслуживание'
            },
            '/inspections': {
                title: 'Проверки',
                breadcrumb: ['Обслуживание', 'Проверки'],
                section: 'Обслуживание'
            },
            '/staff': {
                title: 'Персонал',
                breadcrumb: ['Обслуживание', 'Персонал'],
                section: 'Обслуживание'
            },
            
            // Система
            '/news': {
                title: 'Новости',
                breadcrumb: ['Система', 'Новости'],
                section: 'Система'
            },
            '/settings': {
                title: 'Настройки',
                breadcrumb: ['Система', 'Настройки'],
                section: 'Система'
            },
            '/logs': {
                title: 'Логи',
                breadcrumb: ['Система', 'Логи'],
                section: 'Система'
            },
            '/backup': {
                title: 'Резервное копирование',
                breadcrumb: ['Система', 'Резервное копирование'],
                section: 'Система'
            }
        };
        
        this.contentContainer = null;
        this.currentRoute = null;
        this.isLoading = false;
        this.loadedStyleUrls = new Set();
    }
    
    normalizeRoute(route) {
        if (!route) return '/dashboard';
        const [baseRoute] = route.split('?');
        if (!baseRoute || baseRoute === '/') return '/dashboard';
        return baseRoute;
    }
    
    init() {
        this.contentContainer = document.getElementById('spa-content');
        
        if (!this.contentContainer) {
            console.error('SPA content container not found!');
            return;
        }
        
        // Обрабатываем клики на ссылки меню
        this.setupNavigationListeners();
        
        // Обрабатываем кнопки "назад" и "вперед"
        window.addEventListener('popstate', (e) => {
            const route = this.getRouteFromHash();
            const normalizedRoute = this.normalizeRoute(route);
            this.updateActiveMenuItem(normalizedRoute);
            if (e.state && e.state.route) {
                this.loadContent(e.state.route, false);
            } else {
                // Передаём полный route (с query), чтобы не терять параметры
                this.loadContent(route, false);
            }
        });
        
        // Обрабатываем изменения hash (когда используется window.location.hash)
        // Используем флаг, чтобы избежать двойной загрузки при программном изменении hash
        this._isNavigating = false;
        window.addEventListener('hashchange', () => {
            // Если навигация была инициирована через navigate(), пропускаем
            if (this._isNavigating) {
                this._isNavigating = false;
                return;
            }
            
            const route = this.getRouteFromHash();
            const normalizedRoute = this.normalizeRoute(route);
            // Обновляем активный пункт меню
            this.updateActiveMenuItem(normalizedRoute);
            // Проверяем, что это не тот же роут, чтобы избежать двойной загрузки
            if (normalizedRoute !== this.currentRoute) {
                // Передаём полный route (с query), чтобы не терять параметры
                this.loadContent(route, false);
            }
        });
        
        // Загружаем начальную страницу
        const initialRoute = this.getRouteFromHash();
        const normalizedInitialRoute = this.normalizeRoute(initialRoute || '/dashboard');
        // Обновляем активный пункт меню при инициализации
        this.updateActiveMenuItem(normalizedInitialRoute);
        this.navigate(initialRoute || '/dashboard');
    }
    
    setupNavigationListeners() {
        // Находим все ссылки в меню
        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Используем data-route если есть, иначе href
                const route = link.getAttribute('data-route') || link.getAttribute('href');
                
                this.navigate(route);
            });
        });
    }
    
    extractRoute(href) {
        // Извлекаем роут из href
        // Поддерживаем разные форматы:
        // /blocks -> /blocks
        // /admin/blocks -> /blocks
        // /admin/blocks.html -> /blocks
        if (!href) return '/dashboard';
        
        let route = href;
        
        // Убираем /admin/ если есть
        if (route.includes('/admin/')) {
            route = route.replace('/admin/', '/');
        }
        
        // Убираем .html если есть
        route = route.replace('.html', '');
        
        // Если осталось только '/' или '/index', возвращаем /dashboard
        if (route === '/' || route === '/index') {
            return '/dashboard';
        }
        
        return route;
    }
    
    getRouteFromHash() {
        const hash = window.location.hash.slice(1); // Убираем #
        return hash || '/';
    }
    
    navigate(route) {
        if (this.isLoading) return;
        
        const normalizedRoute = this.normalizeRoute(route);
        
        // Обновляем активный пункт меню всегда (даже если роут не изменился)
        // Это важно при обновлении страницы или переходе по прямой ссылке
        this.updateActiveMenuItem(route);
        
        // Проверяем, не пытаемся ли загрузить тот же роут
        if (normalizedRoute === this.currentRoute) {
            return;
        }
        
        // Устанавливаем флаг, чтобы hashchange не загружал контент дважды
        this._isNavigating = true;
        
        // Обновляем URL
        window.location.hash = route;
        
        // Загружаем контент
        // ВАЖНО: передаём полный route (с query ?id=...), иначе потеряем параметры
        this.loadContent(route, true);
    }
    
    // Универсальная функция для навигации назад
    goBack(defaultRoute = '/dashboard') {
        // Проверяем, есть ли история в hash
        const hash = window.location.hash;
        const hashParts = hash.split('?');
        const currentRoute = hashParts[0].slice(1); // Убираем #
        
        // Определяем, откуда пришли, на основе текущего роута
        let backRoute = defaultRoute;
        
        if (currentRoute === '/invoice-view' || currentRoute.startsWith('/invoice-view')) {
            backRoute = '/invoices';
        } else if (currentRoute === '/payment-view' || currentRoute.startsWith('/payment-view')) {
            backRoute = '/payments';
        } else {
            // Пытаемся использовать предыдущий роут из истории браузера
            // В SPA это сложно, поэтому просто используем defaultRoute
            backRoute = defaultRoute;
        }
        
        this.navigate(backRoute);
    }
    
    updateActiveMenuItem(route) {
        const baseRoute = this.normalizeRoute(route);
        
        // Маппинг дочерних страниц к родительским пунктам меню
        const parentRouteMap = {
            '/invoice-view': '/invoices',
            '/payment-view': '/payments',
            '/appeals': '/appeals2',
            '/': '/dashboard'
        };
        
        // Определяем, какой роут должен быть активным в меню
        // Если это дочерняя страница, используем родительский роут
        const menuRoute = parentRouteMap[baseRoute] || baseRoute;
        
        // Убираем active со всех пунктов меню
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Добавляем active на текущий пункт меню
        document.querySelectorAll('.nav-item').forEach(item => {
            // Пропускаем элементы без href и logout кнопки
            if (!item.hasAttribute('href') || item.classList.contains('logout-btn')) {
                return;
            }
            
            // Получаем route из data-route или href
            const dataRoute = item.getAttribute('data-route');
            const href = item.getAttribute('href');
            
            let itemRoute = null;
            if (dataRoute) {
                itemRoute = this.normalizeRoute(dataRoute);
            } else if (href) {
                itemRoute = this.extractRoute(href);
            }
            
            // Сравниваем нормализованные роуты
            // Сначала проверяем точное совпадение с menuRoute
            if (itemRoute && itemRoute === menuRoute) {
                item.classList.add('active');
            }
            // Также проверяем прямое совпадение с baseRoute (на случай, если нет в parentRouteMap)
            else if (itemRoute && itemRoute === baseRoute) {
                item.classList.add('active');
            }
        });
    }
    
    async loadContent(route, updateHistory = true) {
        if (this.isLoading) return;
        
        const baseRoute = this.normalizeRoute(route);
        const contentPath = this.routes[baseRoute] || this.routes['/dashboard'];
        
        // Извлекаем параметры из hash, если они есть
        const fullHash = window.location.hash.slice(1);
        const hashParts = fullHash.split('?');
        if (hashParts.length > 1) {
            const params = new URLSearchParams(hashParts[1]);
            // Сохраняем параметры в глобальные переменные для доступа из загружаемого контента
            if (params.has('id')) {
                if (baseRoute === '/invoice-view') {
                    window.__currentInvoiceId = parseInt(params.get('id'));
                } else if (baseRoute === '/payment-view') {
                    window.__currentPaymentId = parseInt(params.get('id'));
                } else if (baseRoute === '/appeals2') {
                    window.__currentNotificationId = parseInt(params.get('id'));
                }
            }
        }
        
        try {
            this.isLoading = true;
            this.showLoadingState();
            
            // Загружаем контент
            const response = await fetch(contentPath);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const rawHtml = await response.text();
            const { html, styleHrefs } = this.extractContentAndStyles(rawHtml);
            await this.ensureStylesLoaded(styleHrefs);
            
            // Сохраняем существующий SVG overlay в глобальный кеш перед заменой контента
            if (baseRoute === '/blocks') {
                const existingOverlay = this.contentContainer.querySelector('.plan-overlay');
                if (existingOverlay) {
                    // Сохраняем в глобальный кеш (глубокое клонирование)
                    window.__cachedPlanOverlay = existingOverlay.cloneNode(true);
                }
            }
            
            // Вставляем контент
            this.contentContainer.innerHTML = html;
            
            // Восстанавливаем SVG overlay из кеша для страницы blocks
            if (baseRoute === '/blocks' && window.__cachedPlanOverlay) {
                const newOverlay = this.contentContainer.querySelector('.plan-overlay');
                const planImageFrame = this.contentContainer.querySelector('.plan-image-frame');
                if (newOverlay && planImageFrame) {
                    // Заменяем новый overlay на сохраненный из кеша (чтобы не пересоздавать полигоны)
                    const cachedOverlay = window.__cachedPlanOverlay.cloneNode(true);
                    planImageFrame.replaceChild(cachedOverlay, newOverlay);
                    
                    // Убеждаемся что tooltip может работать с восстановленными элементами
                    // Небольшая задержка для гарантии что DOM обновлен
                    setTimeout(() => {
                        const polygons = this.contentContainer.querySelectorAll('.plan-area');
                        console.log('Restored polygons count:', polygons.length);
                    }, 100);
                }
            }
            
            // Hide any plan tooltip from blocks page when navigating away
            const planTooltip = document.getElementById('planTooltip');
            if (planTooltip) {
                planTooltip.classList.add('hidden');
                planTooltip.style.display = 'none';
            }
            
            // Also call global hide function if it exists
            if (window.hidePlanTooltip) {
                window.hidePlanTooltip();
            }
            
            // Обновляем заголовок и breadcrumb
            this.updatePageTitle(baseRoute);
            
            // Обновляем историю браузера
            if (updateHistory) {
                // Сохраняем полный hash (включая ?id=...) — это критично для invoice-view/payment-view
                const fullHash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : route;
                history.pushState({ route: fullHash }, '', `#${fullHash}`);
            }
            
            this.currentRoute = baseRoute;
            
            // Обновляем активный пункт меню после загрузки контента
            this.updateActiveMenuItem(baseRoute);
            
            // Инициализируем скрипты на новой странице
            // Это выполнит скрипты и отправит событие spa:contentLoaded
            this.initializePageScripts();
            
            // Применяем переводы после небольшой задержки, чтобы контент успел отрендериться
            setTimeout(() => {
                if (window.reapplyAutoTranslations) {
                    window.reapplyAutoTranslations();
                }
                if (window.i18n) {
                    const savedLang = localStorage.getItem('language') || window.i18n.currentLanguage || 'ru';
                    window.i18n.applyLanguage(savedLang);
                }
            }, 50);
            
            // Скроллим наверх
            this.contentContainer.scrollTop = 0;
            
        } catch (error) {
            console.error('Error loading content:', error);
            this.showErrorState(error);
        } finally {
            this.isLoading = false;
        }
    }

    extractContentAndStyles(rawHtml) {
        try {
            const parser = new DOMParser();
            const parsed = parser.parseFromString(rawHtml, 'text/html');
            const styleHrefs = [];

            parsed.querySelectorAll('link[rel="stylesheet"][href]').forEach((link) => {
                const href = link.getAttribute('href');
                if (href) {
                    styleHrefs.push(href);
                }
                link.remove();
            });

            return {
                html: parsed.body ? parsed.body.innerHTML : rawHtml,
                styleHrefs
            };
        } catch (error) {
            console.warn('Failed to parse content styles, fallback to raw HTML:', error);
            return { html: rawHtml, styleHrefs: [] };
        }
    }

    async ensureStylesLoaded(styleHrefs = []) {
        if (!Array.isArray(styleHrefs) || styleHrefs.length === 0) return;
        await Promise.all(styleHrefs.map((href) => this.ensureSingleStyleLoaded(href)));
    }

    ensureSingleStyleLoaded(href) {
        if (!href) return Promise.resolve();

        const absoluteHref = new URL(href, window.location.origin).href;
        if (this.loadedStyleUrls.has(absoluteHref)) {
            return Promise.resolve();
        }

        const existing = document.head.querySelector(`link[data-spa-style="1"][href="${absoluteHref}"]`);
        if (existing) {
            if (existing.dataset.loaded === 'true') {
                this.loadedStyleUrls.add(absoluteHref);
                return Promise.resolve();
            }
            return new Promise((resolve) => {
                const markLoaded = () => {
                    existing.dataset.loaded = 'true';
                    this.loadedStyleUrls.add(absoluteHref);
                    resolve();
                };
                existing.addEventListener('load', markLoaded, { once: true });
                existing.addEventListener('error', resolve, { once: true });
            });
        }

        return new Promise((resolve) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = absoluteHref;
            link.dataset.spaStyle = '1';
            link.onload = () => {
                link.dataset.loaded = 'true';
                this.loadedStyleUrls.add(absoluteHref);
                resolve();
            };
            link.onerror = () => resolve();
            document.head.appendChild(link);
        });
    }
    
    showLoadingState() {
        this.contentContainer.innerHTML = `
            <div class="loading-state" style="display: flex; align-items: center; justify-content: center; min-height: 400px;">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Загрузка...</span>
                </div>
            </div>
        `;
    }
    
    showErrorState(error) {
        this.contentContainer.innerHTML = `
            <div class="error-state" style="padding: 40px; text-align: center;">
                <div class="alert alert-danger">
                    <h4>❌ Ошибка загрузки</h4>
                    <p>${error.message}</p>
                    <button class="btn btn-primary mt-3" onclick="location.reload()">
                        Перезагрузить страницу
                    </button>
                </div>
            </div>
        `;
    }
    
    updatePageTitle(route) {
        const pageInfo = this.pageInfo[route] || this.pageInfo['/dashboard'];
        const titleContainer = document.getElementById('page-title-container');
        
        if (!titleContainer) return;

        const t = (key, fallback) => {
            if (window.i18n && typeof window.i18n.translate === 'function') {
                return window.i18n.translate(key);
            }
            return fallback;
        };

        const textToKey = {
            'Главная': 'home',
            'Главное': 'nav_main',
            'Панель управления': 'nav_dashboard',
            'Управление': 'nav_management',
            'Аналитика': 'nav_analytics',
            'Отчеты': 'nav_reports',
            'Блоки': 'nav_blocks',
            'Тарифы': 'nav_tariffs',
            'Резиденты': 'nav_residents',
            'Жители': 'nav_tenants',
            'Показатели': 'nav_readings',
            'Пользователи': 'nav_users',
            'Продажи': 'nav_sales',
            'Финансы': 'nav_finance',
            'Платежи': 'nav_payments',
            'Счета': 'nav_accounts',
            'Обращения': 'nav_appeals',
            'Обслуживание': 'nav_maintenance',
            'Заявки на ремонт': 'nav_repair_requests',
            'Проверки': 'nav_checks',
            'Персонал': 'nav_personnel',
            'Система': 'nav_system',
            'Новости': 'nav_news',
            'Настройки': 'settings',
            'Логи': 'nav_logs',
            'Резервное копирование': 'nav_backup',
            'Invoice view': 'invoice_view_title',
            'Обращения 11': 'nav_appeals'
        };

        const translatePageText = (text) => {
            const key = textToKey[text];
            return key ? t(key, text) : text;
        };

        const translatedTitle = translatePageText(pageInfo.title);
        
        // Обновляем заголовок
        const h1 = titleContainer.querySelector('h1');
        if (h1) {
            // Prevent global i18n pass from forcing static "nav_dashboard"
            // on every route after we set the route-specific title.
            h1.removeAttribute('data-i18n');
            h1.textContent = translatedTitle;
            // Удаляем любые inline стили, которые могут перезаписать CSS стили
            h1.removeAttribute('style');
            // Принудительно перерисовываем элемент для применения CSS стилей
            void h1.offsetHeight; // Trigger reflow
        }
        
        // Обновляем breadcrumb
        const breadcrumbContainer = titleContainer.querySelector('.page-breadcrumb');
        if (breadcrumbContainer) {
            let breadcrumbHtml = '';
            pageInfo.breadcrumb.forEach((crumb, index) => {
                const translatedCrumb = translatePageText(crumb);
                if (index > 0) {
                    breadcrumbHtml += '<span>›</span>';
                }
                
                const iconHtml = index === 0 ? `
                    <svg width="14" height="14" fill="currentColor" style="margin-right: 0.25rem; vertical-align: middle;">
                        <use href="/images/icons.svg#icon-apartments"></use>
                    </svg>
                ` : '';
                
                breadcrumbHtml += `
                    <span class="breadcrumb-item">
                        ${iconHtml}
                        ${translatedCrumb}
                    </span>
                `;
            });
            
            breadcrumbContainer.innerHTML = breadcrumbHtml;
        }
        
        // Обновляем title страницы
        document.title = `${translatedTitle} - RoyalPark Admin`;
    }
    
    initializePageScripts() {
        // Выполняем скрипты внутри загруженного контента
        const scripts = this.contentContainer.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            
            // Обертываем код скрипта в IIFE, чтобы избежать повторного объявления переменных
            let scriptContent = oldScript.innerHTML.trim();
            
            // Пропускаем пустые скрипты
            if (!scriptContent || scriptContent.length === 0) {
                return;
            }
            
            // Проверяем, не обернут ли скрипт уже в IIFE
            const isAlreadyWrapped = (scriptContent.startsWith('(function') || scriptContent.startsWith('(function(')) && 
                                     (scriptContent.endsWith('})();') || scriptContent.endsWith('})()') || scriptContent.includes('})();'));
            
            let wrappedContent;
            if (isAlreadyWrapped) {
                // Если уже обернут, используем как есть
                wrappedContent = scriptContent;
            } else {
                // Обертываем в IIFE с обработкой ошибок
                wrappedContent = `(function() {
                    try {
                        ${scriptContent}
                    } catch (e) {
                        console.error('Error executing page script:', e);
                    }
                })();`;
            }
            
            try {
                newScript.appendChild(document.createTextNode(wrappedContent));
                oldScript.parentNode.replaceChild(newScript, oldScript);
            } catch (e) {
                console.error('Error replacing script:', e, 'Script content length:', scriptContent.length);
                // Пытаемся выполнить скрипт напрямую, если замена не удалась
                try {
                    eval(wrappedContent);
                } catch (evalError) {
                    console.error('Error evaluating script:', evalError);
                }
            }
        });
        
        // Извлекаем параметры из hash для передачи в событие
        const fullHash = window.location.hash.slice(1);
        const hashParts = fullHash.split('?');
        const eventDetail = { route: this.currentRoute };
        if (hashParts.length > 1) {
            const params = new URLSearchParams(hashParts[1]);
            if (params.has('id')) {
                eventDetail.id = params.get('id');
                if (this.currentRoute === '/invoice-view') {
                    eventDetail.invoiceId = parseInt(params.get('id'));
                } else if (this.currentRoute === '/payment-view') {
                    eventDetail.paymentId = parseInt(params.get('id'));
                } else if (this.currentRoute === '/appeals2') {
                    eventDetail.notificationId = parseInt(params.get('id'));
                }
            }
        }
        
        // Запускаем кастомное событие для инициализации компонентов
        // Добавляем небольшую задержку, чтобы скрипты успели выполниться
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('spa:contentLoaded', {
                detail: eventDetail
            }));
        }, 50);
    }
}

// Глобальный экспорт
window.SPARouter = SPARouter;

// Автоинициализация при загрузке страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('spa-content')) {
            window.spaRouter = new SPARouter();
            window.router = window.spaRouter; // Алиас для совместимости
            window.spaRouter.init();
            
            // Глобальная функция для навигации назад
            window.goBack = function(defaultRoute = '/dashboard') {
                if (window.spaRouter && typeof window.spaRouter.goBack === 'function') {
                    window.spaRouter.goBack(defaultRoute);
                } else {
                    window.location.hash = '#' + defaultRoute;
                }
            };
        }
    });
} else {
    if (document.getElementById('spa-content')) {
        window.spaRouter = new SPARouter();
        window.router = window.spaRouter; // Алиас для совместимости
        window.spaRouter.init();
        
        // Глобальная функция для навигации назад
        window.goBack = function(defaultRoute = '/dashboard') {
            if (window.spaRouter && typeof window.spaRouter.goBack === 'function') {
                window.spaRouter.goBack(defaultRoute);
            } else {
                window.location.hash = '#' + defaultRoute;
            }
        };
    }
}




