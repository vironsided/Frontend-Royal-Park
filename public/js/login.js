// 🔥 LOGIN PAGE JAVASCRIPT - Backend Integration 🔥

document.addEventListener('DOMContentLoaded', function() {
    const API_BASE = window.getApiBase ? window.getApiBase() : (window.BACKEND_API_BASE || 'http://localhost:8000');
    // Initialize animations
    initParticles();
    addRippleEffect();
    addInputAnimations();
    
    const loginForm = document.getElementById('loginForm');
    const alertBox = document.getElementById('alert');
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');
    const t = (key, fallback) => (window.i18n && typeof window.i18n.translate === 'function')
        ? window.i18n.translate(key)
        : fallback;

    function translateLoginError(detail, status) {
        const normalized = String(detail || '').trim().toLowerCase();
        const invalidHints = [
            'неверное имя пользователя',
            'неверный пароль',
            'invalid',
            'incorrect',
            'wrong credentials',
            'username or password'
        ];

        if (status === 401 || invalidHints.some(h => normalized.includes(h))) {
            return t('login_error_invalid_credentials', 'Неверное имя пользователя или пароль');
        }
        if (status === 429) {
            return t('login_error_too_many_requests', 'Слишком много попыток входа. Попробуйте позже');
        }
        if (status >= 500) {
            return t('login_error_server', 'Ошибка сервера. Попробуйте позже');
        }
        return t('login_error_generic', 'Ошибка входа в систему');
    }

    // Handle form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const btnText = loginSubmitBtn.querySelector('.btn-text');
        const btnIcon = loginSubmitBtn.querySelector('.btn-icon');

        // Validation
        if (!username || !password) {
            showAlert(t('login_error_fill_all_fields', 'Пожалуйста, заполните все поля'), 'error');
            return;
        }

        loginSubmitBtn.classList.add('loading');
        loginSubmitBtn.disabled = true;
        if (btnText) btnText.style.opacity = '0';
        if (btnIcon) btnIcon.style.opacity = '0';

        try {
            // API call to backend
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Важно: отправляем cookies
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: '' }));
                const localizedError = translateLoginError(errorData.detail, response.status);
                throw new Error(localizedError);
            }

            const data = await response.json();
            
            // Save user data to localStorage
            localStorage.setItem('authToken', 'authenticated');
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('username', data.username);

            try {
                const lang = (window.i18n && window.i18n.currentLanguage)
                    || localStorage.getItem('language')
                    || 'az';
                localStorage.setItem('language', lang);
            } catch (e) { /* ignore */ }

            showAlert(t('login_success_redirect', 'Вход выполнен успешно! Перенаправление...'), 'success');
            
            // Add success animation
            celebrateSuccess();

            // Redirect based on role and password change status
            setTimeout(() => {
                if (data.require_password_change) {
                    // Redirect to password setup if first login
                    window.location.href = '/qr-password-setup.html?from_login=true';
                    return;
                }

                if (data.role === 'RESIDENT') {
                    // Redirect to user panel for residents
                    window.location.href = '/user/dashboard.html';
                } else if (data.role === 'SALES') {
                    // SALES видит только раздел «Продажи» — сразу туда
                    window.location.href = '/admin/#/sales';
                } else {
                    // Redirect to admin panel for all other roles (ADMIN, OPERATOR, ROOT)
                    window.location.href = '/admin/#/dashboard';
                }
            }, 1500);
        } catch (error) {
            console.error('Login error:', error);
            showAlert(error.message || t('login_error_generic', 'Ошибка входа в систему'), 'error');
            shakeElement(loginSubmitBtn);
        } finally {
            loginSubmitBtn.classList.remove('loading');
            loginSubmitBtn.disabled = false;
            if (btnText) btnText.style.opacity = '1';
            if (btnIcon) btnIcon.style.opacity = '1';
        }
    });

    // Show alert message
    function showAlert(message, type) {
        alertBox.innerHTML = `<i class="bi bi-${type === 'error' ? 'exclamation-triangle' : 'check-circle'}"></i> ${message}`;
        alertBox.className = `alert alert-${type} show`;
        
        setTimeout(() => {
            alertBox.classList.remove('show');
        }, 5000);
    }
});

// 🎨 PARTICLES EFFECT
function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 80;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            dx: (Math.random() - 0.5) * 0.5,
            dy: (Math.random() - 0.5) * 0.5,
            color: getRandomColor()
        });
    }

    function getRandomColor() {
        const colors = [
            'rgba(102, 126, 234, 0.8)',
            'rgba(240, 147, 251, 0.8)',
            'rgba(250, 112, 154, 0.8)',
            'rgba(17, 153, 142, 0.8)',
            'rgba(79, 172, 254, 0.8)',
            'rgba(254, 225, 64, 0.8)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((particle, index) => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            
            // Update position
            particle.x += particle.dx;
            particle.y += particle.dy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;
            
            // Draw connections
            particles.forEach((otherParticle, otherIndex) => {
                if (index !== otherIndex) {
                    const distance = Math.sqrt(
                        Math.pow(particle.x - otherParticle.x, 2) + 
                        Math.pow(particle.y - otherParticle.y, 2)
                    );
                    
                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `rgba(102, 126, 234, ${0.15 * (1 - distance / 120)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            });
        });
        
        requestAnimationFrame(drawParticles);
    }

    drawParticles();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// 💫 RIPPLE EFFECT
function addRippleEffect() {
    document.querySelectorAll('.login-btn').forEach(element => {
        element.addEventListener('click', function(e) {
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

// ✨ INPUT ANIMATIONS
function addInputAnimations() {
    const inputs = document.querySelectorAll('.form-control');
    
    inputs.forEach(input => {
        // Focus animations
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
        
        // Typing effect
        input.addEventListener('input', function() {
            const icon = this.parentElement.querySelector('.input-icon');
            if (icon) {
                icon.style.animation = 'none';
                setTimeout(() => {
                    icon.style.animation = 'iconBounce 0.5s ease';
                }, 10);
            }
        });
    });
}

// 🎊 SUCCESS CELEBRATION
function celebrateSuccess() {
    const colors = ['#667eea', '#f093fb', '#fa709a', '#11998e', '#4facfe', '#fee140'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        createConfetti(colors[Math.floor(Math.random() * colors.length)]);
    }
}

function createConfetti(color) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = color;
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-10px';
    confetti.style.borderRadius = '50%';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    confetti.style.opacity = '1';
    
    document.body.appendChild(confetti);
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = 5 + Math.random() * 10;
    let x = parseFloat(confetti.style.left);
    let y = parseFloat(confetti.style.top);
    let dx = Math.cos(angle) * velocity;
    let dy = Math.sin(angle) * velocity;
    let opacity = 1;
    
    function animate() {
        y += dy;
        x += dx;
        dy += 0.5; // gravity
        opacity -= 0.01;
        
        confetti.style.top = y + 'px';
        confetti.style.left = x + 'px';
        confetti.style.opacity = opacity;
        
        if (opacity > 0 && y < window.innerHeight) {
            requestAnimationFrame(animate);
        } else {
            confetti.remove();
        }
    }
    
    animate();
}

// 🔄 SHAKE ANIMATION
function shakeElement(element) {
    element.style.animation = 'none';
    setTimeout(() => {
        element.style.animation = 'shake 0.5s ease';
    }, 10);
}

// Add shake keyframes dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(shakeStyle);

// 👁️ PASSWORD TOGGLE
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.className = 'bi bi-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleIcon.className = 'bi bi-eye';
    }
    
    // Add animation
    toggleIcon.style.transform = 'translateY(-50%) scale(1.3)';
    setTimeout(() => {
        toggleIcon.style.transform = 'translateY(-50%) scale(1)';
    }, 200);
}

// Make it global
window.togglePassword = togglePassword;

// 🌊 MOUSE MOVE EFFECT
document.addEventListener('mousemove', (e) => {
    const loginBox = document.querySelector('.login-box');
    if (!loginBox) return;
    
    const rect = loginBox.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 50;
    const rotateY = (centerX - x) / 50;
    
    loginBox.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

// Reset on mouse leave
document.addEventListener('mouseleave', () => {
    const loginBox = document.querySelector('.login-box');
    if (loginBox) {
        loginBox.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    }
});

// ⌨️ KEYBOARD SHORTCUTS
document.addEventListener('keydown', (e) => {
    // Ctrl + Enter to submit
    if (e.ctrlKey && e.key === 'Enter') {
        document.getElementById('loginForm').requestSubmit();
    }
});

console.log('🔥 Login page загружена с backend интеграцией! 🔥');
