// 🌍 Auto-translation Helper
// Автоматически применяет переводы к стандартным элементам

(function() {
    'use strict';
    
    // Mapping of Russian text to translation keys
    const textMapping = {
        // Common
        'Поиск...': 'search',
        'Поиск платежей...': 'search_payments',
        'Показать меню': 'show_menu',
        'Главная': 'home',
        'Выход': 'logout',
        'Настройки': 'settings',
        'Применить': 'apply',
        'Сбросить': 'reset',
        'Системный админ': 'system_admin',
        'Сохранить': 'save',
        'Отмена': 'cancel',
        
        // Login Page
        'Система управления коммунальными услугами': 'login_subtitle',
        'Выберите роль': 'login_select_role',
        'Имя пользователя': 'username',
        'Пароль': 'password',
        'Забыли пароль?': 'forgot_password',
        'Войти в систему': 'login_button',
        'Защищенное соединение': 'secure_connection',
        '© 2024 RoyalPark. Все права защищены.': 'copyright',
        
        // Roles
        'Администратор': 'role_admin',
        'Пользователь': 'role_user',
        'Служба': 'role_maintenance',
        'Бухгалтер': 'role_accountant',
        
        // Navigation Sections
        'ГЛАВНОЕ': 'nav_main',
        'УПРАВЛЕНИЕ': 'nav_management',
        'ФИНАНСЫ': 'nav_finance',
        'ОБСЛУЖИВАНИЕ': 'nav_maintenance',
        'СИСТЕМА': 'nav_system',
        
        // Navigation
        'Панель': 'nav_dashboard',
        'Панель управления': 'nav_dashboard',
        'Платежи': 'nav_payments',
        'Счета': 'nav_accounts',
        'Задолженности': 'nav_debts',
        'Отчеты': 'nav_reports',
        'ОТЧЕТЫ': 'nav_reports',
        'Финансовые': 'nav_financial',
        'Аналитика': 'nav_analytics',
        'Новости': 'nav_documents',
        'Заявки': 'nav_requests',
        'Заявки на ремонт': 'nav_repair_requests',
        'Счетчики': 'nav_meters',
        'Новости': 'nav_news',
        'Профиль': 'nav_profile',
        'Пользователи': 'nav_users',
        'Здания': 'nav_buildings',
        'Квартиры': 'nav_apartments',
        'Проверки': 'nav_checks',
        'Персонал': 'nav_personnel',
        
        // Dashboard Titles
        'Панель администратора': 'dashboard_admin',
        'Панель жильца': 'dashboard_user',
        'Панель службы': 'dashboard_maintenance',
        'Панель бухгалтера': 'dashboard_accountant',
        
        // Stats Cards
        'Доход за месяц': 'income_month',
        'Платежей сегодня': 'payments_today',
        'Платежи за месяц': 'payments_month',
        'Оплачиваемость': 'payability',
        'Обработано': 'processed',
        'Требует внимания': 'requires_attention',
        'Отличный показатель': 'excellent_indicator',
        'Всего пользователей': 'total_users',
        'Зданий': 'buildings',
        'Активные заявки': 'active_requests',
        'за месяц': 'per_month',
        'за неделю': 'per_week',
        'новых': 'new',
        
        // Time Periods
        'Неделя': 'week',
        'Месяц': 'month',
        'Год': 'year',
        'Сегодня': 'today',
        'Вчера': 'yesterday',
        
        // Days of week
        'Пн': 'monday',
        'Вт': 'tuesday',
        'Ср': 'wednesday',
        'Чт': 'thursday',
        'Пт': 'friday',
        'Сб': 'saturday',
        'Вс': 'sunday',
        
        // Activity
        'Последняя активность': 'latest_activity',
        'Последние платежи': 'latest_payments',
        'Новый платеж получен': 'new_payment_received',
        'Новая заявка на ремонт': 'new_repair_request',
        'Показания счетчика': 'meter_reading',
        'Проверка завершена': 'check_completed',
        'Новый пользователь': 'new_user',
        'Напоминание о задолженности': 'debt_reminder',
        'Квартира': 'apartment',
        'Здание': 'building',
        'минут назад': 'minutes_ago',
        'час назад': 'hour_ago',
        'часа назад': 'hours_ago',
        'квартир': 'apartments',
        
        // Payment Statistics
        'Статистика платежей': 'payment_statistics',
        'Динамика платежей': 'payment_dynamics',
        
        // Table Headers
        'ПОЛЬЗОВАТЕЛЬ': 'user',
        'Пользователь': 'user',
        'Плательщик': 'payer',
        'СУММА': 'amount',
        'Сумма': 'amount',
        'ДАТА': 'date',
        'Дата': 'date',
        'СТАТУС': 'status',
        'Статус': 'status',
        'Квартира': 'apartment',
        'ОПЛАЧЕНО': 'status_paid',
        'Оплачено': 'status_paid',
        'В ОБРАБОТКЕ': 'status_processing',
        'В обработке': 'status_pending',
        'Отклонено': 'status_failed',
        
        // Filters
        'Фильтры платежей': 'filters_title',
        'Период': 'filter_period',
        'Статус': 'filter_status',
        'Метод оплаты': 'filter_method',
        'Все статусы': 'all_statuses',
        'Все методы': 'all_methods',
        'Все здания': 'all_buildings',
        
        // Reports
        'Генерация отчетов': 'reports_title',
        'Финансовый отчет': 'report_financial',
        'Отчет по платежам': 'report_payments',
        'Отчет по задолженностям': 'report_debts',
        'Аналитический отчет': 'report_analytics',
        'Отчет по зданиям': 'report_buildings',
        'Налоговый отчет': 'report_tax',
        'Сформировать': 'generate',
        'Сформировать все отчеты': 'generate_all',
        
        // Meters
        'Проверка счетчиков': 'meters_title',
        'Электричество': 'meter_electricity',
        'Вода': 'meter_cold_water',
        'Горячая вода': 'meter_cold_water',
        'Предыдущее': 'meter_previous',
        'Текущее': 'meter_current',
        'Потребление': 'meter_consumption',
        'Утвердить': 'meter_approve',
        'Отклонить': 'meter_reject',
        'Расследовать': 'meter_investigate',
    };
    
    // Placeholders mapping
    const placeholderMapping = {
        'Поиск...': 'search',
        'Поиск платежей...': 'search_payments',
        'Axtarış...': 'search',
        'Введите имя пользователя': 'username_placeholder',
        'Введите пароль': 'password_placeholder',
        'İstifadəçi adını daxil edin': 'username_placeholder',
        'Şifrəni daxil edin': 'password_placeholder',
        'Enter username': 'username_placeholder',
        'Enter password': 'password_placeholder',
    };
    
    function autoTranslate() {
        // Wait for i18n to be available
        if (!window.i18n) {
            setTimeout(autoTranslate, 100);
            return;
        }
        
        // Find all text nodes and apply translations
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const textNodes = [];
        let node;
        
        while (node = walker.nextNode()) {
            const text = node.nodeValue.trim();
            if (!text || !textMapping[text]) continue;

            const parentEl = node.parentElement;
            // ВАЖНО: не трогаем заголовок в #page-title-container,
            // им управляет SPA Router (spa-router.js). Иначе h1
            // будет всегда переводиться как "Панель управления".
            if (parentEl && parentEl.closest('#page-title-container')) {
                continue;
            }

            textNodes.push({
                node: node,
                text: text,
                key: textMapping[text]
            });
        }
        
        // Apply data-i18n to parent elements
        textNodes.forEach(({ node, text, key }) => {
            const parent = node.parentElement;
            if (parent && !parent.getAttribute('data-i18n')) {
                // Check if parent only contains this text node
                if (parent.childNodes.length === 1 || 
                    (parent.childNodes.length === 3 && parent.querySelector('i'))) {
                    parent.setAttribute('data-i18n', key);
                }
            }
        });
        
        // Handle table headers specifically
        document.querySelectorAll('th, td').forEach(el => {
            const text = el.textContent.trim();
            if (textMapping[text] && !el.getAttribute('data-i18n')) {
                el.setAttribute('data-i18n', textMapping[text]);
            }
        });
        
        // Handle badges and spans in tables
        document.querySelectorAll('.badge, table span').forEach(el => {
            const text = el.textContent.trim();
            if (textMapping[text] && !el.getAttribute('data-i18n')) {
                el.setAttribute('data-i18n', textMapping[text]);
            }
        });
        
        // Handle placeholders
        document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
            const placeholder = el.placeholder;
            if (placeholderMapping[placeholder]) {
                el.setAttribute('data-i18n-placeholder', placeholderMapping[placeholder]);
            }
        });
        
        // Apply translations immediately
        window.i18n.applyLanguage(window.i18n.currentLanguage);
    }
    
    // Export function for re-applying translations
    window.reapplyAutoTranslations = function() {
        if (window.i18n) {
            // Re-scan for new table headers
            document.querySelectorAll('th, td').forEach(el => {
                const text = el.textContent.trim();
                if (textMapping[text] && !el.getAttribute('data-i18n')) {
                    el.setAttribute('data-i18n', textMapping[text]);
                }
            });
            
            // Re-scan badges and spans
            document.querySelectorAll('.badge, table span').forEach(el => {
                const text = el.textContent.trim();
                if (textMapping[text] && !el.getAttribute('data-i18n')) {
                    el.setAttribute('data-i18n', textMapping[text]);
                }
            });
            
            window.i18n.applyLanguage(window.i18n.currentLanguage);
        }
    };
    
    // Run when DOM is ready and i18n is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(autoTranslate, 200);
        });
    } else {
        setTimeout(autoTranslate, 200);
    }
})();

