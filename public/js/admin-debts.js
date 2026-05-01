// 💰 Debts Management Page - RoyalPark Admin Panel

(function() {
    'use strict';

    let debts = [];

    // Initialize page
    function init() {
        loadDebts();
        updateStats();
    }

    // Load debts/complaints from test data
    function loadDebts() {
        debts = (TestData.debts || []).map((item) => ({
            ...item,
            submittedAt: item.submittedAt || `${item.dueDate}T09:00:00`,
            invoiceNumber: item.invoiceNumber || `INV-${item.dueDate || '2024'}/${String(item.id).padStart(4, '0')}`,
            expectedAmount: item.expectedAmount ?? item.amount,
            receivedAmount: item.receivedAmount ?? item.amount,
            complaintReason: item.complaintReason || item.task || 'Уточнение начислений',
            residentComment: item.residentComment || item.notes || 'Комментарий отсутствует',
            accountant: item.accountant || {
                name: item.assignedTo || 'Не назначен',
                status: 'Без статуса',
                viewedAt: null
            },
            maintenance: item.maintenance || {
                name: null,
                status: 'Не назначен',
                scheduledAt: null
            },
            timeline: item.timeline || []
        }));
        renderDebts();
    }

    // Render debts
    function renderDebts() {
        const container = document.getElementById('debtsList');
        if (!container) return;

        container.innerHTML = debts.map((debt, index) => {
            const difference = (debt.receivedAmount || 0) - (debt.expectedAmount || 0);
            return `
            <div class="card debt-card ${debt.status} mb-4 animate__animated animate__fadeInUp" style="animation-delay: ${index * 0.1}s">
                <div class="card-body">
                    <div class="row g-4">
                        <div class="col-lg-4 border-end">
                            <div class="d-flex align-items-center mb-3">
                                <div class="user-avatar-sm me-3" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 50%; color: white; font-weight: bold; font-size: 1.25rem;">
                                    ${getInitials(debt.userName)}
                                </div>
                                <div>
                                    <h5 class="mb-1">${debt.userName}</h5>
                                    <p class="mb-0 text-muted">
                                        <i class="bi bi-house-door"></i> ${debt.apartment}
                                    </p>
                                </div>
                            </div>

                            <div class="d-flex flex-wrap gap-2 mb-3">
                                <span class="badge ${getStageClass(debt.stage)}">
                                    <i class="bi ${getStageIcon(debt.stage)}"></i>
                                    ${getStageLabel(debt.stage)}
                                </span>
                                <a class="badge bg-dark-subtle text-dark invoice-link" href="#/invoice-view?id=${encodeURIComponent(debt.id)}" data-invoice="${debt.invoiceNumber || ''}">
                                    <i class="bi bi-receipt"></i> ${debt.invoiceNumber}
                                </a>
                                <span class="badge bg-dark-subtle text-dark">
                                    <i class="bi bi-clock"></i> ${formatDateTime(debt.submittedAt)}
                                </span>
                            </div>

                            <div class="alert alert-danger mb-3">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <small class="text-uppercase text-muted">Счёт на оплату</small>
                                        <h4 class="mb-0">${(debt.receivedAmount || 0).toFixed(2)} ₼</h4>
                                    </div>
                                    <div class="text-end">
                                        <small class="text-uppercase text-muted">Ожидалось</small>
                                        <h5 class="mb-0">${(debt.expectedAmount || 0).toFixed(2)} ₼</h5>
                                    </div>
                                </div>
                                <div class="mt-2 d-flex justify-content-between">
                                    <span class="text-muted">Разница</span>
                                    <strong class="${difference > 0 ? 'text-danger' : 'text-success'}">
                                        ${difference > 0 ? '+' : ''}${difference.toFixed(2)} ₼
                                    </strong>
                                </div>
                            </div>

                            <div class="mb-3">
                                <small class="text-muted text-uppercase">Причина обращения</small>
                                <p class="mb-0 fw-semibold">${debt.complaintReason}</p>
                            </div>
                            <div class="mb-3">
                                <small class="text-muted text-uppercase">Комментарий жителя</small>
                                <div class="alert alert-info mb-0">
                                    <small>${debt.residentComment}</small>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-4 border-end">
                            <h6 class="mb-3">
                                <i class="bi bi-person-badge"></i> Ответственный (бухгалтерия)
                            </h6>
                            <div class="mb-3">
                                <div class="d-flex align-items-center">
                                    <div class="user-avatar-sm me-2" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; color: white; font-weight: bold; font-size: 0.875rem;">
                                        ${getInitials(debt.accountant?.name || 'RP')}
                                    </div>
                                    <div>
                                        <strong>${debt.accountant?.name || 'Не назначен'}</strong>
                                        <div class="text-muted small">${debt.accountant?.status || 'Без статуса'}</div>
                                    </div>
                                </div>
                                <div class="small text-muted mt-1">
                                    ${debt.accountant?.viewedAt ? `Просмотрено: ${formatDateTime(debt.accountant.viewedAt)}` : 'Ещё не просмотрено'}
                                </div>
                            </div>

                            <h6 class="mb-3 mt-4">
                                <i class="bi bi-tools"></i> Техническая служба
                            </h6>
                            <div class="mb-3">
                                <div class="d-flex align-items-center">
                                    <div class="user-avatar-sm me-2" style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; color: white; font-weight: bold; font-size: 0.875rem;">
                                        ${getInitials(debt.maintenance?.name || '—')}
                                    </div>
                                    <div>
                                        <strong>${debt.maintenance?.name || 'Не назначен'}</strong>
                                        <div class="text-muted small">${debt.maintenance?.status || 'Без действий'}</div>
                                    </div>
                                </div>
                                <div class="small text-muted mt-1">
                                    ${debt.maintenance?.scheduledAt ? `План: ${formatDateTime(debt.maintenance.scheduledAt)}` : 'Дата визита не назначена'}
                                </div>
                            </div>

                            <h6 class="mb-3 mt-4">
                                <i class="bi bi-list-check"></i> Текущий шаг
                            </h6>
                            <div class="task-badge">
                                <i class="bi bi-gear-fill"></i>
                                <span>${debt.task}</span>
                            </div>

                            <h6 class="mb-3 mt-4">
                                <i class="bi bi-chat-left-text"></i> Примечания
                            </h6>
                            <div class="alert alert-info mb-0">
                                <small>${debt.notes}</small>
                            </div>
                        </div>

                        <div class="col-lg-4">
                            <h6 class="mb-3">
                                <i class="bi bi-clock-history"></i> История действий
                            </h6>
                            <div class="timeline">
                                ${getDebtTimeline(debt)}
                            </div>

                            <div class="mt-4 d-grid gap-2">
                                <button class="btn btn-success" onclick="markAsPaid(${debt.id})">
                                    <i class="bi bi-check-circle"></i> Закрыть обращение
                                </button>
                                <button class="btn btn-primary" onclick="contactUser(${debt.userId})">
                                    <i class="bi bi-chat-left-dots"></i> Ответить жителю
                                </button>
                                <button class="btn btn-warning" onclick="sendReminder(${debt.id})">
                                    <i class="bi bi-search"></i> Запросить проверку
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        }).join('');

        // Bind invoice links to SPA router if available
        container.querySelectorAll('.invoice-link').forEach(link => {
            link.addEventListener('click', (e) => {
                if (!window.spaRouter) return;
                e.preventDefault();
                const href = link.getAttribute('href') || '';
                const route = href.replace(/^#/, '');
                window.spaRouter.navigate(route);
            });
        });
    }

    // Get initials from name
    function getInitials(name) {
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    // Generate timeline for debt
    function getDebtTimeline(debt) {
        const timeline = (debt.timeline && debt.timeline.length)
            ? debt.timeline
            : [
                {
                    date: debt.submittedAt || new Date().toISOString(),
                    text: 'Обращение создано',
                    icon: 'chat-dots-fill',
                    color: 'primary'
                },
                {
                    date: new Date().toISOString(),
                    text: debt.task,
                    icon: 'gear-fill',
                    color: 'info'
                }
            ];

        return timeline.map((item) => `
            <div class="timeline-item">
                <div class="timeline-dot" style="background: var(--bs-${item.color});"></div>
                <div>
                    <small class="text-muted">${formatDateTime(item.date)}</small>
                    <p class="mb-0">
                        <i class="bi bi-${item.icon} text-${item.color}"></i>
                        ${item.text}
                    </p>
                </div>
            </div>
        `).join('');
    }

    // Update statistics
    function updateStats() {
        const activeRequests = debts.length;
        const todaysRequests = debts.filter(d => isToday(d.submittedAt)).length;
        const viewedRequests = debts.filter(d => d.viewed).length;
        const inProgressRequests = debts.filter(d => d.stage === 'in_progress').length;

        const activeEl = document.getElementById('activeRequestsCount');
        const todayEl = document.getElementById('todayRequestsCount');
        const viewedEl = document.getElementById('viewedRequestsCount');
        const inProgressEl = document.getElementById('inProgressRequestsCount');

        if (activeEl) activeEl.textContent = activeRequests;
        if (todayEl) todayEl.textContent = todaysRequests;
        if (viewedEl) viewedEl.textContent = viewedRequests;
        if (inProgressEl) inProgressEl.textContent = inProgressRequests;
    }

    function isToday(dateString) {
        if (!dateString) return false;
        const target = new Date(dateString);
        const now = new Date();
        return target.getFullYear() === now.getFullYear() &&
            target.getMonth() === now.getMonth() &&
            target.getDate() === now.getDate();
    }

    // Utility: create or get a reusable modal container
    function getModalRoot() {
        let root = document.getElementById('debtsModalRoot');
        if (!root) {
            root = document.createElement('div');
            root.id = 'debtsModalRoot';
            document.body.appendChild(root);
        }
        return root;
    }

    // In-app confirm modal (returns Promise<boolean>)
    // Make it globally available for admin panel
    window.showConfirmModal = function showConfirmModal(options) {
        const {
            title = 'Подтвердите действие',
            message = '',
            confirmText = 'Подтвердить',
            cancelText = 'Отмена'
        } = options || {};

        return new Promise((resolve) => {
            const root = getModalRoot();
            const overlay = document.createElement('div');
            overlay.className = 'account-modal-overlay show';
            overlay.innerHTML = `
                <div class="account-modal" style="max-width:520px">
                    <div class="account-modal-header">
                        <h2>${title}</h2>
                        <button class="account-modal-close">&times;</button>
                    </div>
                    <div class="account-modal-body">
                        <div style="display:flex; gap:12px; align-items:flex-start;">
                            <div style="width:38px; height:38px; border-radius:10px; background:#f59e0b; color:#fff; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 20px rgba(0,0,0,.2)">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                            </div>
                            <div style="white-space:pre-wrap;">${message}</div>
                        </div>
                    </div>
                    <div class="account-modal-footer">
                        <button class="account-btn account-btn-secondary btn-cancel">${cancelText}</button>
                        <button class="account-btn account-btn-primary btn-ok">${confirmText}</button>
                    </div>
                </div>`;

            function close(result) {
                overlay.classList.remove('show');
                setTimeout(() => overlay.remove(), 150);
                document.body.style.overflow = '';
                resolve(result);
            }

            overlay.addEventListener('click', (e) => { if (e.target === overlay) close(false); });
            overlay.querySelector('.account-modal-close').addEventListener('click', () => close(false));
            overlay.querySelector('.btn-cancel').addEventListener('click', () => close(false));
            overlay.querySelector('.btn-ok').addEventListener('click', () => close(true));
            document.addEventListener('keydown', function esc(e){ if(e.key==='Escape'){ close(false); document.removeEventListener('keydown', esc);} });

            root.appendChild(overlay);
            document.body.style.overflow = 'hidden';
        });
    };

    // Global showConfirm function for admin panel (compatible with Promise-style calls)
    // Usage: showConfirm(message, title) returns Promise<boolean>
    // Or: showConfirm(message, onConfirm, onCancel) for callback style
    window.showConfirm = function showConfirm(message, titleOrCallback, onCancel) {
        // If second argument is a function, use callback style (legacy)
        if (typeof titleOrCallback === 'function') {
            const onConfirm = titleOrCallback;
            const promise = window.showConfirmModal({
                title: 'Подтвердите действие',
                message: message,
                confirmText: 'OK',
                cancelText: 'Отмена'
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
        const title = typeof titleOrCallback === 'string' ? titleOrCallback : 'Подтвердите действие';
        return window.showConfirmModal({
            title: title,
            message: message,
            confirmText: 'OK',
            cancelText: 'Отмена'
        });
    };

    // In-app info modal
    function showInfoModal(options) {
        const { title = 'Информация', message = '', okText = 'OK' } = options || {};
        return new Promise((resolve) => {
            const root = getModalRoot();
            const overlay = document.createElement('div');
            overlay.className = 'account-modal-overlay show';
            overlay.innerHTML = `
                <div class="account-modal" style="max-width:520px">
                    <div class="account-modal-header">
                        <h2>${title}</h2>
                        <button class="account-modal-close">&times;</button>
                    </div>
                    <div class="account-modal-body">${message}</div>
                    <div class="account-modal-footer">
                        <button class="account-btn account-btn-primary btn-ok">${okText}</button>
                    </div>
                </div>`;
            function close() {
                overlay.classList.remove('show');
                setTimeout(() => overlay.remove(), 150);
                document.body.style.overflow = '';
                resolve();
            }
            overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
            overlay.querySelector('.account-modal-close').addEventListener('click', close);
            overlay.querySelector('.btn-ok').addEventListener('click', close);
            document.addEventListener('keydown', function esc(e){ if(e.key==='Escape'){ close(); document.removeEventListener('keydown', esc);} });
            root.appendChild(overlay);
            document.body.style.overflow = 'hidden';
        });
    }

    // Mark as paid
    window.markAsPaid = function(debtId) {
        const debt = debts.find(d => d.id === debtId);
        if (!debt) return;

        showConfirmModal({
            title: 'Подтверждение оплаты',
            message: `Подтвердить оплату ${debt.amount.toFixed(2)} ₼ от ${debt.userName}?`,
            confirmText: 'Подтвердить',
            cancelText: 'Отмена'
        }).then((ok) => {
            if (!ok) return;
            const index = debts.findIndex(d => d.id === debtId);
            debts.splice(index, 1);
            renderDebts();
            updateStats();
            showNotification(`Задолженность ${debt.userName} отмечена как оплаченная!`, 'success');
        });
    };

    // Contact user
    window.contactUser = function(userId) {
        const user = TestData.users.find(u => u.id === userId);
        if (!user) return;

        const modalContent = `
            <div style="display:flex; flex-direction:column; gap:12px; line-height:1.6;">
                <div><strong>Житель:</strong> ${user.name}</div>
                <div><strong>Блок:</strong> ${user.building || '—'}</div>
                <div><strong>Квартира:</strong> ${user.apartment || '—'}</div>
                <hr style="margin: 6px 0;">
                <div>
                    <strong>Телефон:</strong> <a href="tel:${user.phone}" style="text-decoration:none;">${user.phone}</a>
                </div>
                <div>
                    <strong>Email:</strong> <a href="mailto:${user.email}" style="text-decoration:none;">${user.email}</a>
                </div>
            </div>
        `;

        showInfoModal({ title: 'Контакты жильца', message: modalContent, okText: 'Закрыть' })
            .then(() => showNotification(`Контактные данные ${user.name} отображены`, 'info'));
    };

    // Send reminder
    window.sendReminder = function(debtId) {
        const debt = debts.find(d => d.id === debtId);
        if (!debt) return;

        showNotification(`SMS-напоминание отправлено ${debt.userName}`, 'info');
    };

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function formatDateTime(dateString) {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return date.toLocaleString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function getStageLabel(stage) {
        switch (stage) {
            case 'in_progress':
                return 'В процессе';
            case 'escalated':
                return 'На дополнительной проверке';
            case 'resolved':
                return 'Закрыто';
            case 'new':
                return 'Новое обращение';
            default:
                return 'На рассмотрении';
        }
    }

    function getStageClass(stage) {
        switch (stage) {
            case 'in_progress':
                return 'bg-warning text-dark';
            case 'escalated':
                return 'bg-danger text-white';
            case 'resolved':
                return 'bg-success text-white';
            case 'new':
                return 'bg-secondary text-white';
            default:
                return 'bg-dark text-white';
        }
    }

    function getStageIcon(stage) {
        switch (stage) {
            case 'in_progress':
                return 'bi-arrow-repeat';
            case 'escalated':
                return 'bi-arrow-up-circle';
            case 'resolved':
                return 'bi-check-circle-fill';
            case 'new':
                return 'bi-eye-fill';
            default:
                return 'bi-info-circle';
        }
    }

    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} position-fixed top-0 end-0 m-3 animate__animated animate__fadeInRight`;
        notification.style.zIndex = '10000';
        notification.innerHTML = `
            <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}-fill me-2"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.remove('animate__fadeInRight');
            notification.classList.add('animate__fadeOutRight');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();












