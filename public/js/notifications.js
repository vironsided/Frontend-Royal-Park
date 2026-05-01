// Modern Toast Notification System

// Create notification container on page load
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('toast-container')) {
        const container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
});

// Show notification
function showNotification(message, type = 'success', duration = 3000) {
    const container = document.getElementById('toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = getIcon(type);
    
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${message}</div>
        <button class="toast-close" onclick="closeToast(this)">
            <i class="bi bi-x"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto remove
    if (duration > 0) {
        setTimeout(() => {
            closeToast(toast.querySelector('.toast-close'));
        }, duration);
    }
    
    return toast;
}

// Close toast
function closeToast(button) {
    const toast = button.parentElement || button;
    toast.classList.remove('show');
    toast.classList.add('hide');
    
    setTimeout(() => {
        if (toast.parentElement) {
            toast.parentElement.removeChild(toast);
        }
    }, 300);
}

// Create container if not exists
function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// Get icon based on type
function getIcon(type) {
    const icons = {
        success: '<i class="bi bi-check-circle-fill"></i>',
        error: '<i class="bi bi-x-circle-fill"></i>',
        warning: '<i class="bi bi-exclamation-triangle-fill"></i>',
        info: '<i class="bi bi-info-circle-fill"></i>'
    };
    return icons[type] || icons.info;
}

// Convenience methods
function showSuccess(message, duration = 3000) {
    return showNotification(message, 'success', duration);
}

function showError(message, duration = 4000) {
    return showNotification(message, 'error', duration);
}

function showWarning(message, duration = 3500) {
    return showNotification(message, 'warning', duration);
}

function showInfo(message, duration = 3000) {
    return showNotification(message, 'info', duration);
}

// Custom Confirm Dialog - REMOVED: Use window.showConfirm from user.js instead
// This function has been removed to avoid conflicts. All code should use window.showConfirm
// which returns a Promise<boolean> and is defined in user.js

function closeConfirm(overlay) {
    overlay.classList.remove('show');
    setTimeout(() => {
        if (overlay.parentElement) {
            overlay.parentElement.removeChild(overlay);
        }
    }, 200);
}

// Custom Prompt Dialog
function showPrompt(message, defaultValue = '', onConfirm, onCancel) {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    
    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog';
    
    dialog.innerHTML = `
        <div class="confirm-message">${message}</div>
        <input type="text" class="prompt-input" value="${defaultValue}">
        <div class="confirm-actions">
            <button class="confirm-btn confirm-ok">OK</button>
            <button class="confirm-btn confirm-cancel">Отмена</button>
        </div>
    `;
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    const input = dialog.querySelector('.prompt-input');
    
    // Show with animation
    setTimeout(() => {
        overlay.classList.add('show');
        input.focus();
        input.select();
    }, 10);
    
    // OK button
    const okHandler = () => {
        const value = input.value;
        closeConfirm(overlay);
        if (onConfirm) onConfirm(value);
    };
    
    dialog.querySelector('.confirm-ok').addEventListener('click', okHandler);
    
    // Enter key
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            okHandler();
        }
    });
    
    // Cancel button
    dialog.querySelector('.confirm-cancel').addEventListener('click', () => {
        closeConfirm(overlay);
        if (onCancel) onCancel(false);  // Pass false when cancelled
        else if (onConfirm) onConfirm(false);  // If no onCancel, call onConfirm with false
    });
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeConfirm(overlay);
            if (onCancel) onCancel();
        }
    });
    
    // Close on Escape
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeConfirm(overlay);
            if (onCancel) onCancel();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// Add CSS styles
const style = document.createElement('style');
style.textContent = `
    #toast-container {
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
    }
    
    .toast {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 300px;
        max-width: 500px;
        padding: 16px 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        opacity: 0;
        transform: translateX(400px);
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        pointer-events: auto;
    }
    
    .toast.show {
        opacity: 1;
        transform: translateX(0);
    }
    
    .toast.hide {
        opacity: 0;
        transform: translateX(400px);
    }
    
    .toast-icon {
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .toast-success {
        border-left: 4px solid #10b981;
    }
    
    .toast-success .toast-icon {
        color: #10b981;
    }
    
    .toast-error {
        border-left: 4px solid #ef4444;
    }
    
    .toast-error .toast-icon {
        color: #ef4444;
    }
    
    .toast-warning {
        border-left: 4px solid #f59e0b;
    }
    
    .toast-warning .toast-icon {
        color: #f59e0b;
    }
    
    .toast-info {
        border-left: 4px solid #3b82f6;
    }
    
    .toast-info .toast-icon {
        color: #3b82f6;
    }
    
    .toast-message {
        flex: 1;
        font-size: 0.95rem;
        color: #333;
        font-weight: 500;
    }
    
    .toast-close {
        background: none;
        border: none;
        color: #999;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.2s;
    }
    
    .toast-close:hover {
        background: #f3f4f6;
        color: #333;
    }
    
    @media (max-width: 768px) {
        #toast-container {
            left: 12px;
            right: 12px;
            top: 72px;
            gap: 8px;
        }
        
        .toast {
            min-width: auto;
            width: 100%;
            padding: 12px 14px;
            border-radius: 10px;
            transform: translateY(-14px);
        }

        .toast.show {
            transform: translateY(0);
        }

        .toast.hide {
            transform: translateY(-14px);
        }
    }
    
    /* Confirm and Prompt Dialogs */
    .confirm-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s ease;
    }
    
    .confirm-overlay.show {
        opacity: 1;
    }
    
    .confirm-dialog {
        background: #1c1e24;
        border-radius: 16px;
        padding: 30px;
        min-width: 400px;
        max-width: 500px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
        transform: scale(0.9);
        transition: transform 0.2s ease;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .confirm-overlay.show .confirm-dialog {
        transform: scale(1);
    }
    
    .confirm-message {
        font-size: 1.1rem;
        color: #ffffff;
        margin-bottom: 25px;
        line-height: 1.5;
    }
    
    .prompt-input {
        width: 100%;
        padding: 12px 15px;
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        font-size: 1rem;
        margin-bottom: 25px;
        transition: border-color 0.3s;
        background: rgba(255, 255, 255, 0.05);
        color: #ffffff;
    }
    
    .prompt-input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.25);
        background: rgba(255, 255, 255, 0.08);
    }
    
    .confirm-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
    }
    
    .confirm-btn {
        padding: 10px 24px;
        border: none;
        border-radius: 8px;
        font-size: 0.95rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .confirm-ok {
        background: #667eea;
        color: white;
    }
    
    .confirm-ok:hover {
        background: #5568d3;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    
    .confirm-cancel {
        background: #6c757d;
        color: white;
    }
    
    .confirm-cancel:hover {
        background: #5a6268;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
    }
    
    @media (max-width: 768px) {
        .confirm-dialog {
            min-width: auto;
            width: 90%;
            padding: 25px;
        }
        
        .confirm-actions {
            flex-direction: column-reverse;
        }
        
        .confirm-btn {
            width: 100%;
        }
    }
`;
document.head.appendChild(style);

