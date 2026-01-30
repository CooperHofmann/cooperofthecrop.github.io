/**
 * EDITORIAL PORTFOLIO - MINIMAL JS
 * 
 * Design philosophy:
 * - Motion is minimal and functional
 * - No scroll choreography
 * - Native browser scroll
 * - Simple fade-in on load only
 * - Smooth page transitions
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
     * Initialize page transitions - slide from bottom up
     */
    function initPageTransitions() {
        // Create the transition overlay if it doesn't exist
        if (!document.querySelector('.page-transition-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'page-transition-overlay';
            document.body.appendChild(overlay);
        }
        
        // Check if we're coming from a page transition
        if (sessionStorage.getItem('pageTransition') === 'true') {
            sessionStorage.removeItem('pageTransition');
            const overlay = document.querySelector('.page-transition-overlay');
            if (overlay) {
                overlay.classList.add('exit');
                // Remove the overlay after animation completes
                setTimeout(() => {
                    overlay.classList.remove('exit');
                }, 600);
            }
        }
        
        // Add click handlers to gallery links for page transitions
        const galleryLinks = document.querySelectorAll('.gallery-index-item');
        
        galleryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                
                // Trigger the page transition
                const overlay = document.querySelector('.page-transition-overlay');
                if (overlay && href) {
                    // Store that we're doing a transition
                    sessionStorage.setItem('pageTransition', 'true');
                    
                    overlay.classList.add('animating');
                    
                    // Navigate after animation
                    setTimeout(() => {
                        window.location.href = href;
                    }, 500);
                } else if (href) {
                    window.location.href = href;
                }
            });
        });
        
        // Also add transitions to nav links going to gallery pages
        const navLinks = document.querySelectorAll('nav a[href$=".html"]:not([href="admin.html"])');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Don't transition for same page or external links
                if (!href || href === window.location.pathname.split('/').pop()) {
                    return;
                }
                
                e.preventDefault();
                
                const overlay = document.querySelector('.page-transition-overlay');
                if (overlay) {
                    sessionStorage.setItem('pageTransition', 'true');
                    overlay.classList.add('animating');
                    
                    setTimeout(() => {
                        window.location.href = href;
                    }, 500);
                } else {
                    window.location.href = href;
                }
            });
        });
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
        initPageTransitions();
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
