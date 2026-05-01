// 🔧 Repair Requests Management - RoyalPark Admin Panel

(function() {
    'use strict';

    let requests = [];
    let staff = [];

    // Initialize page
    function init() {
        loadRequests();
        loadStaff();
        updateStats();
    }

    // Load repair requests from test data
    function loadRequests() {
        requests = TestData.repairRequests;
        renderRequests();
    }

    // Load staff
    function loadStaff() {
        staff = TestData.staff;
    }

    // Render repair requests
    function renderRequests() {
        const container = document.getElementById('requestsList');
        if (!container) return;

        const grouped = groupByStatus(requests);

        container.innerHTML = `
            <div class="row g-4">
                <!-- New Requests -->
                <div class="col-lg-4">
                    <div class="status-column">
                        <h5 class="mb-3">
                            <span class="badge bg-secondary">${grouped.new.length}</span>
                            Новые
                        </h5>
                        ${renderStatusGroup(grouped.new, 'new')}
                    </div>
                </div>

                <!-- In Progress -->
                <div class="col-lg-4">
                    <div class="status-column">
                        <h5 class="mb-3">
                            <span class="badge bg-primary">${grouped.in_progress.length}</span>
                            В работе
                        </h5>
                        ${renderStatusGroup(grouped.in_progress, 'in_progress')}
                    </div>
                </div>

                <!-- Pending -->
                <div class="col-lg-4">
                    <div class="status-column">
                        <h5 class="mb-3">
                            <span class="badge bg-warning">${grouped.pending.length}</span>
                            Ожидание
                        </h5>
                        ${renderStatusGroup(grouped.pending, 'pending')}
                    </div>
                </div>
            </div>
        `;
    }

    // Group requests by status
    function groupByStatus(reqs) {
        return {
            new: reqs.filter(r => r.status === 'new'),
            pending: reqs.filter(r => r.status === 'pending'),
            in_progress: reqs.filter(r => r.status === 'in_progress')
        };
    }

    // Render status group
    function renderStatusGroup(reqs, status) {
        if (reqs.length === 0) {
            return '<div class="text-center text-muted py-4"><i class="bi bi-inbox"></i><p>Нет заявок</p></div>';
        }

        return reqs.map(req => renderRequestCard(req, status)).join('');
    }

    // Render request card
    function renderRequestCard(req, status) {
        const priorityColors = {
            critical: 'danger',
            high: 'warning',
            medium: 'info',
            low: 'secondary'
        };

        const priorityIcons = {
            critical: 'exclamation-octagon-fill',
            high: 'exclamation-triangle-fill',
            medium: 'exclamation-circle-fill',
            low: 'info-circle-fill'
        };

        const categoryIcons = {
            plumbing: 'droplet-fill',
            electrical: 'lightning-charge-fill',
            heating: 'thermometer-half',
            windows: 'window',
            elevator: 'building',
            common_area: 'door-open'
        };

        return `
            <div class="card request-card mb-3 animate__animated animate__fadeInUp priority-${req.priority}">
                <div class="card-body">
                    <!-- Priority Badge -->
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge bg-${priorityColors[req.priority]}">
                            <i class="bi bi-${priorityIcons[req.priority]}"></i>
                            ${getPriorityText(req.priority)}
                        </span>
                        <small class="text-muted">#${req.id}</small>
                    </div>

                    <!-- Issue -->
                    <h6 class="mb-2">
                        <i class="bi bi-${categoryIcons[req.category]} text-primary"></i>
                        ${req.issue}
                    </h6>

                    <!-- User Info -->
                    <div class="mb-2">
                        <small class="text-muted">Заявитель:</small><br>
                        <strong>${req.userName || 'Общая'}</strong><br>
                        <small>${req.apartment}</small>
                    </div>

                    <!-- Assigned To -->
                    ${req.assignedTo ? `
                        <div class="mb-2">
                            <small class="text-muted">Исполнитель:</small><br>
                            <div class="d-flex align-items-center">
                                <div class="worker-avatar me-2">
                                    ${getInitials(req.assignedTo)}
                                </div>
                                <small><strong>${req.assignedTo}</strong></small>
                            </div>
                        </div>
                    ` : '<div class="alert alert-warning py-1 px-2 mb-2"><small>Не назначен</small></div>'}

                    <!-- Progress -->
                    ${req.progress > 0 ? `
                        <div class="mb-2">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <small>Прогресс:</small>
                                <small><strong>${req.progress}%</strong></small>
                            </div>
                            <div class="progress" style="height: 8px;">
                                <div class="progress-bar bg-success" style="width: ${req.progress}%"></div>
                            </div>
                        </div>
                    ` : ''}

                    <!-- Task -->
                    <div class="mb-2">
                        <small class="text-primary">
                            <i class="bi bi-gear"></i> ${req.currentTask}
                        </small>
                    </div>

                    <!-- Dates -->
                    <div class="d-flex justify-content-between text-muted mb-2">
                        <small><i class="bi bi-calendar-plus"></i> ${formatShortDate(req.createdDate)}</small>
                        <small><i class="bi bi-calendar-check"></i> ${formatShortDate(req.dueDate)}</small>
                    </div>

                    <!-- Cost -->
                    <div class="alert alert-info py-1 px-2 mb-2">
                        <small><strong>Смета: ${req.estimatedCost.toFixed(2)} ₼</strong></small>
                    </div>

                    <!-- Actions -->
                    <div class="btn-group btn-group-sm w-100">
                        <button class="btn btn-outline-primary" onclick="viewRequest(${req.id})" title="Просмотр">
                            <i class="bi bi-eye"></i>
                        </button>
                        ${!req.assignedTo ? `
                            <button class="btn btn-outline-success" onclick="assignWorker(${req.id})" title="Назначить">
                                <i class="bi bi-person-plus"></i>
                            </button>
                        ` : ''}
                        <button class="btn btn-outline-warning" onclick="updateProgress(${req.id})" title="Обновить">
                            <i class="bi bi-arrow-repeat"></i>
                        </button>
                        ${req.progress >= 100 || req.status === 'in_progress' ? `
                            <button class="btn btn-outline-success" onclick="completeRequest(${req.id})" title="Завершить">
                                <i class="bi bi-check-circle"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // Get initials from name
    function getInitials(name) {
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    // Get priority text
    function getPriorityText(priority) {
        const texts = {
            critical: 'КРИТИЧНО',
            high: 'ВЫСОКИЙ',
            medium: 'СРЕДНИЙ',
            low: 'НИЗКИЙ'
        };
        return texts[priority] || priority;
    }

    // Format short date
    function formatShortDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            month: 'short',
            day: 'numeric'
        });
    }

    // Update statistics
    function updateStats() {
        const total = requests.length;
        const inProgress = requests.filter(r => r.status === 'in_progress').length;
        const pending = requests.filter(r => r.status === 'pending').length;
        const critical = requests.filter(r => r.priority === 'critical').length;

        document.getElementById('totalRequests').textContent = total;
        document.getElementById('inProgressRequests').textContent = inProgress;
        document.getElementById('pendingRequests').textContent = pending;
        document.getElementById('criticalRequests').textContent = critical;
    }

    // View request details
    window.viewRequest = function(requestId) {
        const req = requests.find(r => r.id === requestId);
        if (!req) return;

        alert(`Детали заявки #${req.id}\n\nПроблема: ${req.issue}\nЗаявитель: ${req.userName || 'Общая'}\nИсполнитель: ${req.assignedTo || 'Не назначен'}\nПрогресс: ${req.progress}%\nСмета: ${req.estimatedCost} ₼\n\nПримечания: ${req.notes}`);
    };

    // Assign worker
    window.assignWorker = function(requestId) {
        const req = requests.find(r => r.id === requestId);
        if (!req) return;

        const workers = staff.filter(s => s.status === 'active' && s.activeRequests < 5);
        if (workers.length === 0) {
            alert('Нет доступных сотрудников');
            return;
        }

        const workerName = prompt(`Назначить сотрудника для заявки #${req.id}:\n\nДоступные:\n${workers.map((w, i) => `${i+1}. ${w.name} (${w.position})`).join('\n')}\n\nВведите номер:`);
        
        if (workerName) {
            const workerIndex = parseInt(workerName) - 1;
            if (workerIndex >= 0 && workerIndex < workers.length) {
                req.assignedTo = workers[workerIndex].name;
                req.status = 'pending';
                req.assignedDate = new Date().toISOString().split('T')[0];
                renderRequests();
                updateStats();
                showNotification(`Заявка назначена: ${workers[workerIndex].name}`, 'success');
            }
        }
    };

    // Update progress
    window.updateProgress = function(requestId) {
        const req = requests.find(r => r.id === requestId);
        if (!req) return;

        const newProgress = prompt(`Обновить прогресс для заявки #${req.id}\nТекущий прогресс: ${req.progress}%\n\nВведите новый прогресс (0-100):`);
        
        if (newProgress !== null) {
            const progress = parseInt(newProgress);
            if (progress >= 0 && progress <= 100) {
                req.progress = progress;
                if (progress > 0 && req.status === 'pending') {
                    req.status = 'in_progress';
                }
                renderRequests();
                updateStats();
                showNotification(`Прогресс обновлен: ${progress}%`, 'info');
            }
        }
    };

    // Complete request
    window.completeRequest = function(requestId) {
        const req = requests.find(r => r.id === requestId);
        if (!req) return;

        if (confirm(`Завершить заявку #${req.id}?\n${req.issue}`)) {
            const index = requests.findIndex(r => r.id === requestId);
            requests.splice(index, 1);
            renderRequests();
            updateStats();
            showNotification('Заявка завершена!', 'success');
        }
    };

    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} position-fixed top-0 end-0 m-3 animate__animated animate__fadeInRight`;
        notification.style.zIndex = '10000';
        notification.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i>${message}`;
        document.body.appendChild(notification);
        setTimeout(() => {
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












