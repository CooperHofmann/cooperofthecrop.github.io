/**
 * EDITORIAL PORTFOLIO - MINIMAL JS
 * 
 * Design philosophy:
 * - Motion is minimal and functional
 * - No scroll choreography
 * - Native browser scroll
 * - Simple fade-in on load only
 */

(function() {
    'use strict';
    
    /**
     * Initialize mobile menu toggle
     */
    function initMobileMenu() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.getElementById('nav-menu');
        
        if (menuBtn && navMenu) {
            menuBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
            
            // Close menu when clicking a link
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!menuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                }
            });
        }
    }
    
    /**
     * Initialize all features
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        initMobileMenu();
    }
    
    // Start initialization
    init();
    
    // Expose toggle menu function globally for onclick handlers
    window.toggleMenu = function() {
        const navMenu = document.getElementById('nav-menu');
        if (navMenu) {
            navMenu.classList.toggle('active');
        }
    };
    
})();
