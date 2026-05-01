// 👥 Users Management Page - RoyalPark Admin Panel

(function() {
    'use strict';

    let currentUsers = [];
    let filteredUsers = [];

    // Initialize page
    function init() {
        loadUsers();
        setupEventListeners();
        updateStats();
    }

    // Load users from backend API (fallback to TestData on error)
    async function loadUsers() {
        try {
            const response = await fetch('/api/users', { credentials: 'include' });
            if (!response.ok) {
                throw new Error('Failed to load users from API');
            }
            const data = await response.json();
            // Приводим структуру API к формату, который ждёт текущий UI
            currentUsers = (data || []).map(u => ({
                id: u.id,
                // В API есть username + full_name; для витрины склеим
                name: u.full_name || u.username,
                phone: u.phone || '—',
                email: u.email || '—',
                apartment: '—', // эти поля будут браться из реальных residents позже
                building: '—',
                status: u.is_active ? 'active' : 'inactive',
                debt: 0,
                registeredDate: u.created_at || u.last_login_at || null,
                balance: 0
            }));
        } catch (e) {
            console.error('Users API error, using TestData fallback:', e);
            if (window.TestData && Array.isArray(window.TestData.users)) {
                currentUsers = window.TestData.users;
            } else {
                currentUsers = [];
            }
        }
        filteredUsers = [...currentUsers];
        renderUsersTable();
    }

    // Setup event listeners
    function setupEventListeners() {
        // Search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', handleSearch);
        }

        // Filters
        const statusFilter = document.getElementById('statusFilter');
        const debtFilter = document.getElementById('debtFilter');
        const buildingFilter = document.getElementById('buildingFilter');

        if (statusFilter) statusFilter.addEventListener('change', applyFilters);
        if (debtFilter) debtFilter.addEventListener('change', applyFilters);
        if (buildingFilter) buildingFilter.addEventListener('change', applyFilters);
    }

    // Handle search
    function handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm === '') {
            filteredUsers = [...currentUsers];
        } else {
            filteredUsers = currentUsers.filter(user => 
                user.name.toLowerCase().includes(searchTerm) ||
                user.phone.includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm) ||
                user.apartment.toLowerCase().includes(searchTerm)
            );
        }
        
        applyFilters();
    }

    // Apply filters
    function applyFilters() {
        const statusFilter = document.getElementById('statusFilter')?.value || 'all';
        const debtFilter = document.getElementById('debtFilter')?.value || 'all';
        const buildingFilter = document.getElementById('buildingFilter')?.value || 'all';

        let filtered = [...filteredUsers];

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(user => user.status === statusFilter);
        }

        // Debt filter
        if (debtFilter === 'with_debt') {
            filtered = filtered.filter(user => user.debt > 0);
        } else if (debtFilter === 'no_debt') {
            filtered = filtered.filter(user => user.debt === 0);
        }

        // Building filter
        if (buildingFilter !== 'all') {
            filtered = filtered.filter(user => user.building === buildingFilter);
        }

        renderUsersTable(filtered);
    }

    // Render users table
    function renderUsersTable(users = filteredUsers) {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        if (users.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-4">
                        <i class="bi bi-inbox" style="font-size: 3rem; color: #ccc;"></i>
                        <p class="mt-2 text-muted">Пользователи не найдены</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = users.map(user => `
            <tr class="animate__animated animate__fadeIn">
                <td>#${user.id}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="user-avatar-sm me-2" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                            ${getInitials(user.name)}
                        </div>
                        <div>
                            <div class="fw-bold">${user.name}</div>
                            <small class="text-muted">${user.email}</small>
                        </div>
                    </div>
                </td>
                <td>${user.phone}</td>
                <td><span class="badge bg-info">${user.apartment}</span></td>
                <td>${user.building}</td>
                <td>
                    <span class="badge ${user.status === 'active' ? 'bg-success' : 'bg-secondary'}">
                        ${user.status === 'active' ? 'Активен' : 'Неактивен'}
                    </span>
                </td>
                <td>
                    ${user.debt > 0 
                        ? `<span class="text-danger fw-bold">${user.debt.toFixed(2)} ₼</span>`
                        : `<span class="text-success"><i class="bi bi-check-circle-fill"></i> Нет</span>`
                    }
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="viewUser(${user.id})" title="Просмотр">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-outline-success" onclick="editUser(${user.id})" title="Редактировать">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="deleteUser(${user.id})" title="Удалить">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Get initials from name
    function getInitials(name) {
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    // Update statistics
    function updateStats() {
        const totalUsers = currentUsers.length;
        const activeUsers = currentUsers.filter(u => u.status === 'active').length;
        const inactiveUsers = currentUsers.filter(u => u.status === 'inactive').length;
        const usersWithDebt = currentUsers.filter(u => u.debt > 0).length;

        document.getElementById('totalUsers').textContent = totalUsers;
        document.getElementById('activeUsers').textContent = activeUsers;
        document.getElementById('inactiveUsers').textContent = inactiveUsers;
        document.getElementById('usersWithDebt').textContent = usersWithDebt;
    }

    // View user details
    window.viewUser = function(userId) {
        const user = currentUsers.find(u => u.id === userId);
        if (!user) return;

        const modal = new bootstrap.Modal(document.getElementById('userModal'));
        const modalBody = document.getElementById('userModalBody');
        
        modalBody.innerHTML = `
            <div class="row g-3">
                <div class="col-md-12 text-center mb-3">
                    <div class="user-avatar-large mx-auto" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 2.5rem; font-weight: bold;">
                        ${getInitials(user.name)}
                    </div>
                    <h4 class="mt-3">${user.name}</h4>
                    <span class="badge ${user.status === 'active' ? 'bg-success' : 'bg-secondary'} mb-2">
                        ${user.status === 'active' ? 'Активен' : 'Неактивен'}
                    </span>
                </div>
                
                <div class="col-md-6">
                    <label class="form-label fw-bold">Телефон</label>
                    <p><i class="bi bi-telephone"></i> ${user.phone}</p>
                </div>
                
                <div class="col-md-6">
                    <label class="form-label fw-bold">Email</label>
                    <p><i class="bi bi-envelope"></i> ${user.email}</p>
                </div>
                
                <div class="col-md-6">
                    <label class="form-label fw-bold">Квартира</label>
                    <p><i class="bi bi-door-closed"></i> ${user.apartment}</p>
                </div>
                
                <div class="col-md-6">
                    <label class="form-label fw-bold">Здание</label>
                    <p><i class="bi bi-building"></i> ${user.building}</p>
                </div>
                
                <div class="col-md-6">
                    <label class="form-label fw-bold">Дата регистрации</label>
                    <p><i class="bi bi-calendar"></i> ${formatDate(user.registeredDate)}</p>
                </div>
                
                <div class="col-md-6">
                    <label class="form-label fw-bold">Баланс</label>
                    <p class="${user.balance >= 0 ? 'text-success' : 'text-danger'} fw-bold">
                        <i class="bi bi-wallet2"></i> ${user.balance.toFixed(2)} ₼
                    </p>
                </div>
                
                <div class="col-12">
                    <label class="form-label fw-bold">Задолженность</label>
                    ${user.debt > 0 
                        ? `<div class="alert alert-danger"><i class="bi bi-exclamation-triangle-fill"></i> ${user.debt.toFixed(2)} ₼</div>`
                        : `<div class="alert alert-success"><i class="bi bi-check-circle-fill"></i> Задолженности нет</div>`
                    }
                </div>
            </div>
        `;

        modal.show();
    };

    // Edit user
    window.editUser = function(userId) {
        const user = currentUsers.find(u => u.id === userId);
        if (!user) return;

        const modal = new bootstrap.Modal(document.getElementById('userModal'));
        const modalTitle = document.getElementById('userModalTitle');
        const modalBody = document.getElementById('userModalBody');
        
        modalTitle.textContent = 'Редактировать пользователя';
        
        modalBody.innerHTML = `
            <form id="editUserForm">
                <input type="hidden" id="editUserId" value="${user.id}">
                <div class="row g-3">
                    <div class="col-md-12">
                        <label class="form-label">Имя</label>
                        <input type="text" class="form-control" id="editUserName" value="${user.name}" required>
                    </div>
                    
                    <div class="col-md-6">
                        <label class="form-label">Телефон</label>
                        <input type="tel" class="form-control" id="editUserPhone" value="${user.phone}" required>
                    </div>
                    
                    <div class="col-md-6">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" id="editUserEmail" value="${user.email}" required>
                    </div>
                    
                    <div class="col-md-6">
                        <label class="form-label">Квартира</label>
                        <input type="text" class="form-control" id="editUserApartment" value="${user.apartment}" required>
                    </div>
                    
                    <div class="col-md-6">
                        <label class="form-label">Здание</label>
                        <select class="form-select" id="editUserBuilding">
                            <option value="Блок A" ${user.building === 'Блок A' ? 'selected' : ''}>Блок A</option>
                            <option value="Блок B" ${user.building === 'Блок B' ? 'selected' : ''}>Блок B</option>
                            <option value="Блок C" ${user.building === 'Блок C' ? 'selected' : ''}>Блок C</option>
                        </select>
                    </div>
                    
                    <div class="col-md-12">
                        <label class="form-label">Статус</label>
                        <select class="form-select" id="editUserStatus">
                            <option value="active" ${user.status === 'active' ? 'selected' : ''}>Активен</option>
                            <option value="inactive" ${user.status === 'inactive' ? 'selected' : ''}>Неактивен</option>
                        </select>
                    </div>
                </div>
            </form>
        `;

        modal.show();
    };

    // Save user changes (пишем в backend)
    window.saveUserChanges = async function() {
        const userId = parseInt(document.getElementById('editUserId')?.value);
        if (!userId) return;

        const user = currentUsers.find(u => u.id === userId);
        if (!user) return;

        const payload = {
            full_name: document.getElementById('editUserName').value,
            phone: document.getElementById('editUserPhone').value,
            email: document.getElementById('editUserEmail').value,
            is_active: document.getElementById('editUserStatus').value === 'active'
        };

        try {
            const resp = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            if (!resp.ok) {
                throw new Error('Failed to update user');
            }

            // Перезагружаем список пользователей из backend
            await loadUsers();

            // Закрываем модалку
            const modal = bootstrap.Modal.getInstance(document.getElementById('userModal'));
            if (modal) modal.hide();

            showNotification('Изменения сохранены успешно!', 'success');
        } catch (e) {
            console.error('Update user error', e);
            showNotification('Не удалось сохранить изменения пользователя', 'danger');
        }
    };

    // Delete user (через backend API)
    window.deleteUser = async function(userId) {
        const user = currentUsers.find(u => u.id === userId);
        if (!user) return;

        if (confirm(`Вы уверены, что хотите удалить пользователя ${user.name}?`)) {
            try {
                const resp = await fetch(`/api/users/${userId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                if (!resp.ok) {
                    throw new Error('Failed to delete user');
                }

                await loadUsers();
                showNotification('Пользователь удален', 'warning');
            } catch (e) {
                console.error('Delete user error', e);
                showNotification('Не удалось удалить пользователя', 'danger');
            }
        }
    };

    // Add new user (через backend API)
    window.addNewUser = function() {
        const modal = new bootstrap.Modal(document.getElementById('userModal'));
        const modalTitle = document.getElementById('userModalTitle');
        const modalBody = document.getElementById('userModalBody');
        
        modalTitle.textContent = 'Добавить пользователя';
        
        modalBody.innerHTML = `
            <form id="addUserForm">
                <div class="row g-3">
                    <div class="col-md-12">
                        <label class="form-label">Имя</label>
                        <input type="text" class="form-control" id="newUserName" required>
                    </div>
                    
                    <div class="col-md-6">
                        <label class="form-label">Телефон</label>
                        <input type="tel" class="form-control" id="newUserPhone" placeholder="+994 XX XXX XX XX" required>
                    </div>
                    
                    <div class="col-md-6">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" id="newUserEmail" placeholder="example@mail.az" required>
                    </div>
                    
                    <div class="col-md-6">
                        <label class="form-label">Квартира</label>
                        <input type="text" class="form-control" id="newUserApartment" placeholder="A-101" required>
                    </div>
                    
                    <div class="col-md-6">
                        <label class="form-label">Здание</label>
                        <select class="form-select" id="newUserBuilding">
                            <option value="Блок A">Блок A</option>
                            <option value="Блок B">Блок B</option>
                            <option value="Блок C">Блок C</option>
                        </select>
                    </div>
                </div>
            </form>
        `;

        // Вешаем обработчик сохранения на кнопку "Сохранить" модалки (если она есть в разметке)
        const saveBtn = document.getElementById('userModalSaveBtn');
        if (saveBtn) {
            saveBtn.onclick = async function() {
                await createUserFromModal();
            };
        }

        modal.show();
    };

    async function createUserFromModal() {
        const nameEl = document.getElementById('newUserName');
        const phoneEl = document.getElementById('newUserPhone');
        const emailEl = document.getElementById('newUserEmail');

        const full_name = nameEl?.value?.trim();
        const phone = phoneEl?.value?.trim();
        const email = emailEl?.value?.trim();

        if (!full_name || !email) {
            showNotification('Имя и Email обязательны', 'danger');
            return;
        }

        // Простое правило: логин = email (можно будет поменять позже)
        const payload = {
            username: email,
            full_name,
            phone,
            email,
            // по умолчанию создаём как RESIDENT
            role: 'RESIDENT'
        };

        try {
            const resp = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            if (!resp.ok) {
                throw new Error('Failed to create user');
            }

            await loadUsers();

            const modal = bootstrap.Modal.getInstance(document.getElementById('userModal'));
            if (modal) modal.hide();

            showNotification('Пользователь успешно создан', 'success');
        } catch (e) {
            console.error('Create user error', e);
            showNotification('Не удалось создать пользователя', 'danger');
        }
    }

    // Export users
    window.exportUsers = function() {
        const csv = convertToCSV(filteredUsers);
        downloadCSV(csv, 'users-export.csv');
        showNotification('Экспорт завершен!', 'success');
    };

    // Convert to CSV
    function convertToCSV(users) {
        const headers = ['ID', 'Имя', 'Телефон', 'Email', 'Квартира', 'Здание', 'Статус', 'Задолженность'];
        const rows = users.map(u => [
            u.id,
            u.name,
            u.phone,
            u.email,
            u.apartment,
            u.building,
            u.status === 'active' ? 'Активен' : 'Неактивен',
            u.debt.toFixed(2)
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    // Download CSV
    function downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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












