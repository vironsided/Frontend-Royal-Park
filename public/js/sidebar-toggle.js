/**
 * Sidebar Toggle Script for RoyalPark Admin Panel
 * Universal script for all HTML pages (non-SPA)
 */

document.addEventListener('DOMContentLoaded', function() {
    // Skip this script if we're on admin page (it has its own handler)
    if (window.location.pathname.includes('/admin/')) {
        console.log('Sidebar Toggle Script: Skipping admin page (has own handler)');
        return;
    }
    
    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    const sidebar = document.querySelector('.sidebar') || document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    console.log('Sidebar Toggle Script loaded');
    
    if (toggleSidebarBtn && sidebar) {
        // Add tooltips to nav items
        const navItems = sidebar.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const textEl = item.querySelector('.nav-text');
            if (textEl && textEl.textContent.trim()) {
                item.setAttribute('data-tooltip', textEl.textContent.trim());
            }
        });
        
        // Load saved state from localStorage
        const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (sidebarCollapsed) {
            sidebar.classList.add('collapsed');
            console.log('Sidebar initialized as collapsed');
        }
        
        // Remove any existing event listeners
        const oldOnClick = toggleSidebarBtn.onclick;
        if (oldOnClick) {
            console.warn('⚠️ Found existing onclick handler, replacing...');
        }
        
        // Toggle sidebar on button click
        toggleSidebarBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('=== TOGGLE BUTTON CLICKED ===');
            console.log('Timestamp:', new Date().toLocaleTimeString());
            
            const isMobile = window.innerWidth <= 768;

            // Check current state IMMEDIATELY
            const classList = Array.from(sidebar.classList);
            const hasCollapsedClass = classList.includes('collapsed');
            const currentWidth = sidebar.offsetWidth;
            const computedWidth = window.getComputedStyle(sidebar).width;
            
            console.log('📊 Current State:');
            console.log('  - classList:', classList);
            console.log('  - hasCollapsedClass:', hasCollapsedClass);
            console.log('  - currentWidth:', currentWidth + 'px');
            console.log('  - computedWidth:', computedWidth);
            console.log('  - style.width:', sidebar.style.width);

            // На мобильных используем overlay и не трогаем width через inline-стили
            if (isMobile) {
                // hasCollapsedClass === true  -> сейчас закрыто, после клика ОТКРОЕМ
                // hasCollapsedClass === false -> сейчас открыто, после клика ЗАКРОЕМ
                const willBeCollapsed = !hasCollapsedClass;
                sidebar.classList.toggle('collapsed', willBeCollapsed);

                const isNowOpen = !willBeCollapsed;
                if (sidebarOverlay) {
                    sidebarOverlay.classList.toggle('show', isNowOpen);
                }

                // Убираем системный скроллбар, чтобы не было неразмытой полосы
                if (isNowOpen) {
                    document.documentElement.style.overflow = 'hidden';
                    document.body.style.overflow = 'hidden';
                } else {
                    document.documentElement.style.overflow = '';
                    document.body.style.overflow = '';
                }

                localStorage.setItem('sidebarCollapsed', willBeCollapsed ? 'true' : 'false');
                return;
            }
            
            if (hasCollapsedClass) {
                // Expand sidebar
                console.log('🔄 Action: EXPANDING sidebar...');
                sidebar.classList.remove('collapsed');
                sidebar.style.width = '280px';
                sidebar.style.minWidth = '280px';
                sidebar.style.maxWidth = '280px';
                localStorage.setItem('sidebarCollapsed', 'false');
                
                // Check immediately after
                console.log('Immediately after remove: hasCollapsed =', sidebar.classList.contains('collapsed'));
                
                setTimeout(() => {
                    console.log('✅ EXPAND Complete (100ms later):');
                    console.log('  - width:', sidebar.offsetWidth + 'px');
                    console.log('  - computed:', window.getComputedStyle(sidebar).width);
                    console.log('  - hasCollapsed:', sidebar.classList.contains('collapsed'));
                }, 100);
                
                if (window.showSuccess) {
                    showSuccess('📌 Панель развёрнута');
                }
            } else {
                // Collapse sidebar
                console.log('🔄 Action: COLLAPSING sidebar...');
                sidebar.classList.add('collapsed');
                sidebar.style.width = '80px';
                sidebar.style.minWidth = '80px';
                sidebar.style.maxWidth = '80px';
                localStorage.setItem('sidebarCollapsed', 'true');
                
                // Check immediately after
                console.log('Immediately after add: hasCollapsed =', sidebar.classList.contains('collapsed'));
                
                setTimeout(() => {
                    console.log('✅ COLLAPSE Complete (100ms later):');
                    console.log('  - width:', sidebar.offsetWidth + 'px');
                    console.log('  - computed:', window.getComputedStyle(sidebar).width);
                    console.log('  - hasCollapsed:', sidebar.classList.contains('collapsed'));
                }, 100);
                
                if (window.showInfo) {
                    showInfo('📌 Панель свёрнута');
                }
            }
            
            console.log('=== END TOGGLE ===\n');
        };
        
        console.log('✅ Sidebar toggle initialized successfully');
        
        // Add global debug functions
        window.debugSidebar = function() {
            console.log('=== SIDEBAR DEBUG INFO ===');
            console.log('classList:', Array.from(sidebar.classList));
            console.log('hasCollapsed:', sidebar.classList.contains('collapsed'));
            console.log('offsetWidth:', sidebar.offsetWidth + 'px');
            console.log('computedWidth:', window.getComputedStyle(sidebar).width);
            console.log('style.width:', sidebar.style.width);
            console.log('localStorage:', localStorage.getItem('sidebarCollapsed'));
        };
        
        window.forceSidebarCollapse = function() {
            console.log('🔧 FORCE COLLAPSING sidebar...');
            sidebar.classList.add('collapsed');
            sidebar.style.width = '80px';
            sidebar.style.minWidth = '80px';
            sidebar.style.maxWidth = '80px';
            localStorage.setItem('sidebarCollapsed', 'true');
            setTimeout(() => window.debugSidebar(), 100);
        };
        
        window.forceSidebarExpand = function() {
            console.log('🔧 FORCE EXPANDING sidebar...');
            sidebar.classList.remove('collapsed');
            sidebar.style.width = '280px';
            sidebar.style.minWidth = '280px';
            sidebar.style.maxWidth = '280px';
            localStorage.setItem('sidebarCollapsed', 'false');
            setTimeout(() => window.debugSidebar(), 100);
        };

        // Overlay click to close on mobile
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', function () {
                if (window.innerWidth <= 768) {
                    sidebar.classList.add('collapsed');
                    sidebarOverlay.classList.remove('show');
                    localStorage.setItem('sidebarCollapsed', 'true');
                    document.documentElement.style.overflow = '';
                    document.body.style.overflow = '';
                }
            });
        }
        
        console.log('💡 Debug commands available:');
        console.log('  - debugSidebar() - показать состояние');
        console.log('  - forceSidebarCollapse() - принудительно свернуть');
        console.log('  - forceSidebarExpand() - принудительно развернуть');
    } else {
        console.warn('⚠️ Sidebar or toggle button not found');
    }
});

