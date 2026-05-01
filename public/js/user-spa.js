(() => {
    class UserSPARouter {
        constructor() {
            this.routes = {
                dashboard: {
                    type: 'inline',
                    content: '',
                    bodyClass: ''
                },
                bills: {
                    type: 'remote',
                    path: '/user/pages/bills.html',
                    bodyClass: ''
                },
                report: {
                    type: 'remote',
                    path: '/user/pages/report-payment.html',
                    bodyClass: '',
                    parentNav: 'report'
                },
                resident: {
                    type: 'remote',
                    path: '/user/pages/resident-detail.html',
                    bodyClass: 'resident-detail-page',
                    parentNav: 'dashboard'
                },
                // Хаб «Обслуживание» для мобильной навигации
                service: {
                    type: 'remote',
                    path: '/user/pages/service.html',
                    bodyClass: ''
                },
                appeals: {
                    type: 'remote',
                    path: '/user/pages/appeals.html',
                    bodyClass: ''
                },
                invoice: {
                    type: 'remote',
                    path: '/user/pages/invoice-view.html',
                    bodyClass: '',
                    parentNav: 'bills'
                },
                'advance-history': {
                    type: 'remote',
                    path: '/user/pages/advance-history.html',
                    bodyClass: ''
                },
                news: {
                    type: 'remote',
                    path: '/user/pages/news.html',
                    bodyClass: '',
                    parentNav: 'news'
                },
                profile: {
                    type: 'placeholder',
                    parentNav: 'profile'
                }
            };

            // Маппинг роутов к заголовкам и breadcrumbs
            this.pageInfo = {
                dashboard: {
                    title: 'Добро пожаловать!',
                    titleKey: 'user_dashboard_welcome',
                    breadcrumb: [
                        { text: 'Главная', icon: 'bi-house-door', key: 'home' }
                    ]
                },
                bills: {
                    title: 'Мои счета',
                    titleKey: 'user_nav_user_bills',
                    breadcrumb: [
                        { text: 'Главная', icon: 'bi-house-door', key: 'home', route: 'dashboard' },
                        { text: 'Мои счета', key: 'user_nav_user_bills' }
                    ]
                },
                report: {
                    title: 'Оплата счетов',
                    titleKey: 'user_nav_user_report',
                    breadcrumb: [
                        { text: 'Главная', icon: 'bi-house-door', key: 'home', route: 'dashboard' },
                        { text: 'Оплата счетов', key: 'user_nav_user_report' }
                    ]
                },
                resident: {
                    title: 'Информация о резиденте',
                    titleKey: 'user_resident_info',
                    breadcrumb: [
                        { text: 'Главная', icon: 'bi-house-door', key: 'home', route: 'dashboard' },
                        { text: 'Резидент', key: 'user_resident_info' }
                    ]
                },
                service: {
                    title: 'Обслуживание',
                    titleKey: 'nav_maintenance',
                    breadcrumb: [
                        { text: 'Главная', icon: 'bi-house-door', key: 'home', route: 'dashboard' },
                        { text: 'Обслуживание', key: 'nav_maintenance' }
                    ]
                },
                appeals: {
                    title: 'Заявки',
                    titleKey: 'user_nav_user_requests',
                    breadcrumb: [
                        { text: 'Главная', icon: 'bi-house-door', key: 'home', route: 'dashboard' },
                        { text: 'Заявки', key: 'user_nav_user_requests' }
                    ]
                },
                invoice: {
                    title: 'Просмотр счёта',
                    titleKey: 'user_invoice_view',
                    breadcrumb: [
                        { text: 'Главная', icon: 'bi-house-door', key: 'home', route: 'dashboard' },
                        { text: 'Мои счета', key: 'user_nav_user_bills', route: 'bills' },
                        { text: 'Просмотр счёта', key: 'user_invoice_view' }
                    ]
                },
                'advance-history': {
                    title: 'Списания аванса',
                    titleKey: 'user_nav_advance_history',
                    breadcrumb: [
                        { text: 'Главная', icon: 'bi-house-door', key: 'home', route: 'dashboard' },
                        { text: 'Списания аванса', key: 'user_nav_advance_history' }
                    ]
                },
                news: {
                    title: 'Новости',
                    titleKey: 'user_nav_user_news',
                    breadcrumb: [
                        { text: 'Главная', icon: 'bi-house-door', key: 'home', route: 'dashboard' },
                        { text: 'Новости', key: 'user_nav_user_news' }
                    ]
                },
                profile: {
                    title: 'Профиль',
                    titleKey: 'nav_profile',
                    breadcrumb: [
                        { text: 'Главная', icon: 'bi-house-door', key: 'home', route: 'dashboard' },
                        { text: 'Профиль', key: 'nav_profile' }
                    ]
                }
            };

            this.contentContainer = null;
            this.currentRoute = null;
            this.isLoading = false;
            this.loadedStyleUrls = new Set();
        }

        init() {
            this.contentContainer = document.getElementById('userSpaContent');
            if (!this.contentContainer) return;

            this.routes.dashboard.content = this.contentContainer.innerHTML;

            const initialRoute = this.getRouteFromLocation();
            
            // Если мы не на дашборде, сразу показываем состояние загрузки, 
            // чтобы не мелькал контент дашборда из HTML
            if (initialRoute !== 'dashboard') {
                this.showLoadingState();
            }

            this.setupNavigationListeners();
            this.setupActionTargets();

            window.addEventListener('popstate', (event) => {
                const route = event.state?.route || this.getRouteFromLocation();
                this.navigate(route, false);
            });

            // Слушаем изменения hash для обновления активного пункта меню
            this._isNavigating = false;
            window.addEventListener('hashchange', () => {
                if (this._isNavigating) {
                    this._isNavigating = false;
                    return;
                }
                const route = this.getRouteFromLocation();
                this.navigate(route, false);
            });

            // При первой загрузке всегда обновляем активное состояние и заголовок
            this.updateActiveMenu(initialRoute);
            this.updatePageTitle(initialRoute);
            this.navigate(initialRoute, false);
        }

        getRouteFromLocation() {
            const hash = window.location.hash.replace('#', '').split('?')[0];
            if (hash) {
                return hash;
            }
            return 'dashboard';
        }

        extractRouteFromHref(href) {
            if (!href) return null;
            // Извлекаем route из href
            // /user/dashboard.html#bills -> bills
            // #report -> report
            // /user/dashboard.html -> dashboard
            if (href.includes('#')) {
                const hash = href.split('#')[1].split('?')[0];
                return hash || 'dashboard';
            }
            if (href === '/user/dashboard.html' || href === '/user/dashboard.html/') {
                return 'dashboard';
            }
            return null;
        }

        setupNavigationListeners() {
            // Обрабатываем все nav-item элементы
            document.querySelectorAll('.nav-item').forEach(link => {
                // Пропускаем кнопку выхода
                if (link.classList.contains('logout-btn')) {
                    return;
                }

                link.addEventListener('click', (e) => {
                    const dataRoute = link.getAttribute('data-user-route');
                    const href = link.getAttribute('href');
                    
                    let route = dataRoute || this.extractRouteFromHref(href);
                    
                    if (route && this.routes[route]) {
                        e.preventDefault();
                        this.navigate(route, true);
                    } else if (href && href.startsWith('#')) {
                        // Для простых hash ссылок просто обновляем активное состояние
                        e.preventDefault();
                        const hashRoute = href.replace('#', '');
                        if (hashRoute) {
                            window.location.hash = hashRoute;
                            this.updateActiveMenu(hashRoute);
                        }
                    }
                });
            });
        }

        setupActionTargets() {
            document.addEventListener('click', (event) => {
                const target = event.target.closest('[data-user-route-target]');
                if (!target) return;
                event.preventDefault();
                const route = target.getAttribute('data-user-route-target');
                
                // If navigating to resident detail or bills, store resident ID
                if (route === 'resident' || route === 'bills') {
                    // Try to get resident ID from button attribute or dashboard data
                    let residentId = target.getAttribute('data-resident-id');
                    
                    if (!residentId && window.dashboardData && window.dashboardData.residents && window.dashboardData.residents.length > 0) {
                        // Fallback to first resident if no specific ID provided
                        residentId = window.dashboardData.residents[0].id;
                    }
                    
                    if (residentId) {
                        sessionStorage.setItem('currentResidentId', residentId.toString());
                    } else {
                        console.warn('Resident ID not found, will try to load from backend');
                    }
                }

                if (route === 'bills') {
                    const statuses = target.getAttribute('data-bills-statuses');
                    if (statuses) {
                        try {
                            const list = statuses.split(',').map(s => s.trim()).filter(Boolean);
                            if (list.length) {
                                sessionStorage.setItem('billsFilterStatuses', JSON.stringify(list));
                                // bills.html applies preset filters only with fresh billsSystemFilterMeta (same as report-payment flow).
                                sessionStorage.setItem('billsSystemFilterMeta', JSON.stringify({
                                    source: 'dashboard_nav',
                                    ts: Date.now()
                                }));
                            }
                        } catch (e) {
                            console.warn('Failed to store billsFilterStatuses', e);
                        }
                    } else {
                        // «Мои счета» без фильтра — не тянуть предыдущий предустановленный набор статусов
                        try {
                            sessionStorage.removeItem('billsFilterStatuses');
                            sessionStorage.removeItem('billsFilterInvoiceIds');
                            sessionStorage.removeItem('billsSystemFilterMeta');
                        } catch (_) { /* ignore */ }
                    }
                }
                
                // For report payment, also store resident ID if provided
                if (route === 'report') {
                    const residentId = target.getAttribute('data-resident-id');
                    if (residentId) {
                        sessionStorage.setItem('currentResidentId', residentId.toString());
                    }
                }
                
                // If navigating to invoice detail, store invoice ID
                if (route === 'invoice') {
                    const invoiceId = target.getAttribute('data-invoice-id');
                    if (invoiceId) {
                        sessionStorage.setItem('currentInvoiceId', invoiceId.toString());
                    }
                }
                
                this.navigate(route, true);
            });
        }

        navigate(route, updateHistory = true) {
            // Если роут не существует, используем dashboard
            if (!route) {
                route = 'dashboard';
            }

            // Если это уже текущий роут - пропускаем
            if (this.currentRoute === route && !this.isLoading) {
                return;
            }

            // Устанавливаем флаг, чтобы hashchange не вызывал повторную навигацию
            this._isNavigating = true;

            // Обновляем URL
            if (updateHistory) {
                const url = route === 'dashboard'
                    ? window.location.pathname
                    : `${window.location.pathname}#${route}`;
                history.pushState({ route }, '', url);
            } else {
                history.replaceState({ route }, '', route === 'dashboard'
                    ? window.location.pathname
                    : `${window.location.pathname}#${route}`);
            }

            // Всегда обновляем активный пункт меню и заголовок
            this.updateActiveMenu(route);
            this.updatePageTitle(route);
            this.applyBodyClass(route);

            const config = this.routes[route];
            
            // Для placeholder роутов (news, profile и т.д.) - только обновляем меню
            if (!config || config.type === 'placeholder') {
                this.currentRoute = route;
                return;
            }

            // Для inline контента (dashboard)
            if (config.type === 'inline') {
                this.showLoadingState();
                this.afterContentRender(route);
                this.currentRoute = route;
                return;
            }

            // Для remote контента
            this.loadRemoteRoute(route, config.path);
        }

        updateActiveMenu(route) {
            // Если у маршрута есть "родитель" для навигации (например, invoice -> bills),
            // подсвечиваем в меню именно его.
            const routeConfig = this.routes[route];
            const navRoute = routeConfig?.parentNav || route;

            // Убираем active со всех пунктов меню
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });

            // Добавляем active на текущий пункт меню
            document.querySelectorAll('.nav-item').forEach(item => {
                // Пропускаем кнопку выхода
                if (item.classList.contains('logout-btn')) {
                    return;
                }

                // Получаем route из data-user-route или href
                const dataRoute = item.getAttribute('data-user-route');
                const href = item.getAttribute('href');
                
                let itemRoute = null;
                if (dataRoute) {
                    itemRoute = dataRoute;
                } else if (href) {
                    itemRoute = this.extractRouteFromHref(href);
                }

                // Сравниваем роуты
                if (itemRoute && (itemRoute === navRoute || itemRoute === route)) {
                    item.classList.add('active');
                }
            });
        }

        updatePageTitle(route) {
            const pageInfo = this.pageInfo[route] || this.pageInfo['dashboard'];
            const titleContainer = document.querySelector('.page-title');
            
            if (!titleContainer) return;
            
            // Обновляем заголовок
            const h1 = titleContainer.querySelector('h1');
            if (h1) {
                // Используем ключ i18n если есть, иначе fallback на title
                if (pageInfo.titleKey) {
                    h1.setAttribute('data-i18n', pageInfo.titleKey);
                    // Устанавливаем fallback текст
                    h1.textContent = pageInfo.title;
                } else {
                    h1.textContent = pageInfo.title;
                    h1.removeAttribute('data-i18n');
                }
            }
            
            // Обновляем breadcrumb
            const breadcrumbContainer = titleContainer.querySelector('.page-breadcrumb');
            if (breadcrumbContainer && pageInfo.breadcrumb) {
                let breadcrumbHtml = '';
                
                pageInfo.breadcrumb.forEach((crumb, index) => {
                    // Разделитель между элементами
                    if (index > 0) {
                        breadcrumbHtml += '<span class="breadcrumb-separator">›</span>';
                    }
                    
                    // Иконка (только для первого элемента)
                    const iconHtml = crumb.icon 
                        ? `<i class="bi ${crumb.icon}"></i> ` 
                        : '';
                    
                    // Если есть route - делаем кликабельным
                    if (crumb.route) {
                        const dataI18n = crumb.key ? `data-i18n="${crumb.key}"` : '';
                        breadcrumbHtml += `
                            <a href="#${crumb.route}" class="breadcrumb-item breadcrumb-link" data-user-route="${crumb.route}" ${dataI18n}>
                                ${iconHtml}<span ${dataI18n}>${crumb.text}</span>
                            </a>
                        `;
                    } else {
                        const dataI18n = crumb.key ? `data-i18n="${crumb.key}"` : '';
                        breadcrumbHtml += `
                            <span class="breadcrumb-item" ${dataI18n}>
                                ${iconHtml}<span ${dataI18n}>${crumb.text}</span>
                            </span>
                        `;
                    }
                });
                
                breadcrumbContainer.innerHTML = breadcrumbHtml;
                
                // Добавляем обработчики на кликабельные breadcrumbs
                breadcrumbContainer.querySelectorAll('.breadcrumb-link').forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const targetRoute = link.getAttribute('data-user-route');
                        if (targetRoute) {
                            this.navigate(targetRoute, true);
                        }
                    });
                });
            }
            
            // Обновляем title страницы (используем переведенный текст если доступен)
            const pageTitle = pageInfo.title || 'RoyalPark';
            document.title = `${pageTitle} - RoyalPark`;
            
            // Применяем переводы если доступны
            setTimeout(() => {
                if (window.i18n) {
                    const savedLang = (typeof window.getUiLanguage === 'function' ? window.getUiLanguage() : (localStorage.getItem('language') || 'az'));
                    window.i18n.applyLanguage(savedLang);
                    // Обновляем title страницы после перевода
                    if (h1 && pageInfo.titleKey) {
                        const translatedTitle = h1.textContent || pageInfo.title;
                        document.title = `${translatedTitle} - RoyalPark`;
                    }
                }
            }, 50);
        }

        applyBodyClass(route) {
            Object.values(this.routes).forEach(cfg => {
                if (cfg.bodyClass) {
                    document.body.classList.remove(cfg.bodyClass);
                }
            });

            const current = this.routes[route];
            if (current?.bodyClass) {
                document.body.classList.add(current.bodyClass);
            }
        }

        async loadRemoteRoute(route, path) {
            if (this.isLoading) return;

            try {
                this.isLoading = true;
                this.showLoadingState();

                const response = await fetch(path, { cache: 'no-store' });
                if (!response.ok) {
                    throw new Error(`Ошибка загрузки ${response.status}`);
                }

                const rawHtml = await response.text();
                const { html, styleHrefs } = this.extractContentAndStyles(rawHtml);
                await this.ensureStylesLoaded(styleHrefs);
                this.contentContainer.innerHTML = html;
                this.afterContentRender(route);
                this.currentRoute = route;
            } catch (error) {
                console.error(error);
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
                <div class="loading-state" style="display:flex;align-items:center;justify-content:center;min-height:400px;">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Загрузка...</span>
                    </div>
                </div>
            `;
        }

        showErrorState(error) {
            this.contentContainer.innerHTML = `
                <div class="error-state" style="padding:32px;text-align:center;">
                    <div class="alert alert-danger">
                        <h4>Не удалось загрузить страницу</h4>
                        <p>${error.message}</p>
                        <button class="btn btn-primary mt-3" onclick="window.userSpaRouter.navigate('dashboard', true)">
                            Вернуться на главную
                        </button>
                    </div>
                </div>
            `;
        }

        afterContentRender(route) {
            this.executeInlineScripts();

            // Обновляем имя и аватар пользователя в шапке на всех страницах
            if (typeof loadUserProfileForHeader === 'function') {
                loadUserProfileForHeader();
            } else if (window.dashboardData && window.dashboardData.user) {
                // Fallback: используем данные из dashboardData если функция недоступна
                if (typeof window.updateUserHeader === 'function') {
                    window.updateUserHeader(window.dashboardData.user);
                }
            }

            // Применяем переводы с несколькими попытками для надежности
            const applyTranslations = () => {
                if (window.reapplyAutoTranslations) {
                    window.reapplyAutoTranslations();
                }
                if (window.i18n) {
                    const savedLang = (typeof window.getUiLanguage === 'function' ? window.getUiLanguage() : (localStorage.getItem('language') || 'az'));
                    window.i18n.applyLanguage(savedLang);
                }
            };
            
            // Первая попытка сразу
            applyTranslations();
            
            // Вторая попытка через небольшую задержку
            setTimeout(applyTranslations, 100);
            
            // Третья попытка через еще большую задержку (на случай если скрипты загружаются асинхронно)
            setTimeout(applyTranslations, 300);

            if (window.addCardAnimations) {
                window.addCardAnimations();
            }

            // Reload dashboard data if navigating to dashboard
            if (route === 'dashboard' && typeof loadDashboardData === 'function') {
                setTimeout(() => {
                    loadDashboardData();
                }, 150);
            }

            // Reload bills data if navigating to bills page
            if (route === 'bills') {
                // Reset any initialization flags if needed
                // The inline scripts will be executed automatically by executeInlineScripts()
                setTimeout(() => {
                    // Scripts in bills.html will auto-execute when loaded
                }, 100);
            }
        }

        executeInlineScripts() {
            const scripts = this.contentContainer.querySelectorAll('script');
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                });
                newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                oldScript.parentNode.replaceChild(newScript, oldScript);
            });
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        window.userSpaRouter = new UserSPARouter();
        window.userSpaRouter.init();
    });
})();

