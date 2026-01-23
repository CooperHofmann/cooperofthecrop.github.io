/**
 * CINEMATIC ANIMATIONS
 * 
 * Handles scroll-triggered animations for a cinematic photography portfolio
 * - Images fade in and gently rise on scroll
 * - Text animates after nearby images
 * - Animations trigger at 10-20% viewport entry
 * - Animations run once, not repeating
 */

(function() {
    'use strict';
    
    // Configuration
    const ANIMATION_CONFIG = {
        threshold: 0.15, // Trigger at 15% viewport entry
        rootMargin: '0px',
        triggerOnce: true // Animation runs once
    };
    
    /**
     * Initialize scroll-triggered animations using Intersection Observer
     */
    function initScrollAnimations() {
        // Select all elements that should animate on scroll
        const animatableElements = document.querySelectorAll(
            '.image-block, .work-item, .gallery-item, .text-block'
        );
        
        if (animatableElements.length === 0) return;
        
        // Create observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add a slight delay for staggered animation effect
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, index * 50); // 50ms stagger between consecutive elements
                    
                    // Optionally unobserve after animation if triggerOnce is true
                    if (ANIMATION_CONFIG.triggerOnce) {
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, {
            threshold: ANIMATION_CONFIG.threshold,
            rootMargin: ANIMATION_CONFIG.rootMargin
        });
        
        // Observe all animatable elements
        animatableElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    /**
     * Initialize smooth scroll behavior
     * Adds momentum/inertia effect to scrolling
     */
    function initSmoothScroll() {
        // Modern browsers already support smooth scrolling via CSS
        // This function can be extended with a library like Lenis if needed
        
        // For now, ensure scroll-behavior: smooth is applied
        if (!document.documentElement.style.scrollBehavior) {
            document.documentElement.style.scrollBehavior = 'smooth';
        }
        
        // Optional: Add custom smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
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
     * Add lazy loading for images
     * Native lazy loading with fallback
     */
    function initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        // Modern browsers support native lazy loading
        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading is supported, images will load automatically
            return;
        }
        
        // Fallback for older browsers using Intersection Observer
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    /**
     * Prevent layout shift by setting image aspect ratios
     */
    function preventLayoutShift() {
        const images = document.querySelectorAll('.image-block img, .gallery-item img, .work-item-image img');
        
        images.forEach(img => {
            // If image has natural dimensions, calculate aspect ratio
            if (img.naturalWidth && img.naturalHeight) {
                const aspectRatio = img.naturalWidth / img.naturalHeight;
                img.style.aspectRatio = aspectRatio;
            } else {
                // Wait for image to load
                img.addEventListener('load', function() {
                    const aspectRatio = this.naturalWidth / this.naturalHeight;
                    this.style.aspectRatio = aspectRatio;
                });
            }
        });
    }
    
    /**
     * Initialize all cinematic features
     */
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        // Initialize all features
        initScrollAnimations();
        initSmoothScroll();
        initMobileMenu();
        initLazyLoading();
        
        // Prevent layout shift after a short delay to ensure images are loaded
        setTimeout(preventLayoutShift, 100);
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
