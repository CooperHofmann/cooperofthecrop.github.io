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
     * Check if user prefers reduced motion
     */
    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    
    /**
     * Trigger page transition to a URL
     */
    function triggerPageTransition(href) {
        if (!href) return;
        
        // If user prefers reduced motion, navigate directly
        if (prefersReducedMotion()) {
            window.location.href = href;
            return;
        }
        
        const overlay = document.querySelector('.page-transition-overlay');
        if (overlay) {
            // Store that we're doing a transition
            sessionStorage.setItem('pageTransition', 'true');
            
            overlay.classList.add('animating');
            
            // Navigate after animation completes (600ms animation duration)
            setTimeout(() => {
                window.location.href = href;
            }, 600);
        } else {
            window.location.href = href;
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
            
            // Add page-entering class for content animation
            if (!prefersReducedMotion()) {
                document.body.classList.add('page-entering');
            }
            
            const overlay = document.querySelector('.page-transition-overlay');
            if (overlay && !prefersReducedMotion()) {
                overlay.classList.add('exit');
                // Remove the overlay after animation completes (500ms + 100ms delay = 600ms)
                setTimeout(() => {
                    overlay.classList.remove('exit');
                    // Clean up will-change after animation
                    overlay.style.willChange = 'auto';
                }, 700);
            }
        }
        
        // Add click handlers to gallery links for page transitions
        const galleryLinks = document.querySelectorAll('.gallery-index-item');
        
        galleryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                triggerPageTransition(href);
            });
            
            // Keyboard accessibility - handle Enter and Space keys
            link.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const href = this.getAttribute('href');
                    triggerPageTransition(href);
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
                triggerPageTransition(href);
            });
            
            // Keyboard accessibility for nav links
            link.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    const href = this.getAttribute('href');
                    
                    // Don't transition for same page
                    if (!href || href === window.location.pathname.split('/').pop()) {
                        return;
                    }
                    
                    e.preventDefault();
                    triggerPageTransition(href);
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
