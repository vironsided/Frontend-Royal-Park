// Maintenance Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initSidebarToggle();
    initNavigation();
    addCardAnimations();
    addRippleEffect();
    initMeterVerification();
});

function checkAuth() {
    const authToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    if (!authToken || userRole !== 'maintenance') {
        window.location.href = '/';
        return;
    }

    const username = localStorage.getItem('username') || 'Мастер';
    const userNameEl = document.querySelector('.user-name');
    const userAvatarEl = document.querySelector('.user-avatar');
    
    if (userNameEl) userNameEl.textContent = username;
    if (userAvatarEl) userAvatarEl.textContent = username.substring(0, 2).toUpperCase();
}

function initSidebarToggle() {
    const toggleBtn = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle collapsed class
            sidebar.classList.toggle('collapsed');
            
            // Save state
            const isCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', isCollapsed);
            
            // Update button icon rotation
            if (isCollapsed) {
                toggleBtn.style.transform = 'rotate(180deg)';
            } else {
                toggleBtn.style.transform = 'rotate(0deg)';
            }
        });

        // Restore sidebar state on page load
        const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (sidebarCollapsed) {
            sidebar.classList.add('collapsed');
            toggleBtn.style.transform = 'rotate(180deg)';
        }
    }

    // ESC key to toggle sidebar
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar) {
            sidebar.classList.toggle('collapsed');
            const isCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', isCollapsed);
            
            if (toggleBtn) {
                toggleBtn.style.transform = isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        }
    });
    
    // Close sidebar on outside click (mobile)
    document.addEventListener('click', function(e) {
        if (window.innerWidth < 768 && sidebar) {
            if (!sidebar.contains(e.target) && !e.target.closest('.toggle-sidebar')) {
                sidebar.classList.add('collapsed');
            }
        }
    });
}

function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
                e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function addCardAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.stat-card, .request-card, .card').forEach(card => {
        observer.observe(card);
    });
}

function addRippleEffect() {
    document.querySelectorAll('.nav-item, .btn-accept, .btn-action').forEach(el => {
        el.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-anim 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

document.addEventListener('click', (e) => {
    if (e.target.closest('.logout-btn')) {
        localStorage.clear();
        window.location.href = '/';
    }
});

const style = document.createElement('style');
style.textContent = '@keyframes ripple-anim { to { transform: scale(2); opacity: 0; } }';
document.head.appendChild(style);

// 🔧 METER VERIFICATION FUNCTIONALITY
function initMeterVerification() {
    const meterCards = document.querySelectorAll('.meter-card');
    
    meterCards.forEach(card => {
        const readingInput = card.querySelector('.reading-input');
        const approveBtn = card.querySelector('.btn-verify.approve');
        const rejectBtn = card.querySelector('.btn-verify.reject');
        const investigateBtn = card.querySelector('.btn-verify.investigate');
        
        // Auto-calculate consumption on input change
        if (readingInput) {
            readingInput.addEventListener('input', function() {
                calculateConsumption(card);
            });
            
            // Add input animation
            readingInput.addEventListener('focus', function() {
                this.style.transform = 'scale(1.02)';
            });
            
            readingInput.addEventListener('blur', function() {
                this.style.transform = 'scale(1)';
            });
        }
        
        // Approve button
        if (approveBtn) {
            approveBtn.addEventListener('click', function() {
                approveMeterReading(card);
            });
        }
        
        // Reject button
        if (rejectBtn) {
            rejectBtn.addEventListener('click', function() {
                rejectMeterReading(card);
            });
        }
        
        // Investigate button
        if (investigateBtn) {
            investigateBtn.addEventListener('click', function() {
                investigateMeterReading(card);
            });
        }
    });
}

// Calculate consumption
function calculateConsumption(card) {
    const readings = card.querySelectorAll('.reading-value');
    const input = card.querySelector('.reading-input');
    const consumptionValue = card.querySelector('.consumption-value');
    
    if (!readings[0] || !input || !consumptionValue) return;
    
    const previousReading = parseFloat(readings[0].textContent.replace(/[^0-9.]/g, ''));
    const currentReading = parseFloat(input.value.replace(/[^0-9.]/g, ''));
    
    if (!isNaN(previousReading) && !isNaN(currentReading)) {
        const consumption = currentReading - previousReading;
        const unit = card.querySelector('.reading-unit').textContent;
        
        // Update consumption display
        consumptionValue.textContent = consumption.toFixed(1) + ' ' + unit;
        
        // Check for anomalies
        checkForAnomalies(card, consumption, unit);
    }
}

// Check for anomalies
function checkForAnomalies(card, consumption, unit) {
    const consumptionItem = card.querySelector('.consumption');
    let threshold = 0;
    
    // Set thresholds based on unit
    if (unit.includes('кВт')) threshold = 500; // Electricity
    else if (unit.includes('м³')) threshold = 10; // Water
    
    // Check if consumption exceeds threshold
    if (consumption > threshold) {
        // Add anomaly class
        card.classList.add('anomaly');
        consumptionItem.classList.add('anomaly-value');
        
        // Add warning if not exists
        if (!card.querySelector('.anomaly-warning')) {
            const warning = document.createElement('span');
            warning.className = 'anomaly-warning';
            warning.innerHTML = '<i class="bi bi-exclamation-circle"></i> Превышение нормы!';
            consumptionItem.appendChild(warning);
        }
        
        // Update status badge
        const statusBadge = card.querySelector('.meter-status');
        if (statusBadge) {
            statusBadge.textContent = 'Аномалия';
            statusBadge.className = 'meter-status anomaly';
        }
    } else {
        // Remove anomaly class
        card.classList.remove('anomaly');
        consumptionItem.classList.remove('anomaly-value');
        
        // Remove warning
        const warning = card.querySelector('.anomaly-warning');
        if (warning) warning.remove();
    }
}

// Approve meter reading
function approveMeterReading(card) {
    const meterType = card.querySelector('.meter-info h4').textContent.trim();
    const apartment = card.querySelector('.meter-info p').textContent.trim();
    const reading = card.querySelector('.reading-input').value;
    
    // Add success animation
    card.style.animation = 'none';
    setTimeout(() => {
        card.style.animation = 'fadeInUp 0.5s ease-out';
    }, 10);
    
    // Update status badge
    const statusBadge = card.querySelector('.meter-status');
    if (statusBadge) {
        statusBadge.textContent = 'Проверено';
        statusBadge.className = 'meter-status verified';
    }
    
    // Show success notification
    showNotification('success', `Показание подтверждено: ${meterType} (${apartment}) - ${reading}`);
    
    // Disable inputs and buttons
    card.querySelector('.reading-input').disabled = true;
    card.querySelectorAll('.btn-verify').forEach(btn => btn.disabled = true);
    
    // Update counter
    updateVerificationStats('approved');
}

// Reject meter reading
function rejectMeterReading(card) {
    const meterType = card.querySelector('.meter-info h4').textContent.trim();
    const apartment = card.querySelector('.meter-info p').textContent.trim();
    
    // Add shake animation
    card.style.animation = 'shake 0.5s ease';
    
    // Show reject notification
    showNotification('error', `Показание отклонено: ${meterType} (${apartment})`);
    
    // Clear input
    card.querySelector('.reading-input').value = '';
    
    // Update counter
    updateVerificationStats('rejected');
}

// Investigate meter reading
function investigateMeterReading(card) {
    const meterType = card.querySelector('.meter-info h4').textContent.trim();
    const apartment = card.querySelector('.meter-info p').textContent.trim();
    
    // Add pulse animation
    card.style.animation = 'pulse 0.5s ease';
    
    // Show investigation notification
    showNotification('warning', `Проверка назначена: ${meterType} (${apartment})`);
    
    // Update status badge
    const statusBadge = card.querySelector('.meter-status');
    if (statusBadge) {
        statusBadge.textContent = 'Расследование';
        statusBadge.className = 'meter-status pending';
    }
    
    // Update counter
    updateVerificationStats('investigation');
}

// Show notification
function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'exclamation-triangle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Add styles dynamically
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        background: ${type === 'success' ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' : 
                      type === 'error' ? 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)' : 
                      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'};
        color: white;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        animation: slideInRight 0.5s ease-out;
        z-index: 10000;
    `;
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-out';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Update verification stats
function updateVerificationStats(action) {
    // This would typically update a database
    console.log('Verification action:', action);
    
    // Update UI counters (simulated)
    const pendingEl = document.querySelector('.stat-box:not(.success):not(.warning) .stat-number');
    if (pendingEl && action === 'approved') {
        const current = parseInt(pendingEl.textContent);
        pendingEl.textContent = Math.max(0, current - 1);
    }
}

// Add notification animations
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(notificationStyle);

console.log('🔧 Maintenance dashboard loaded!');
