/**
 * CINEMATIC GALLERY MODULE
 * 
 * Handles dynamic image loading for portfolio gallery pages
 * Implements vertical stacking layout with scroll-triggered animations
 * Replaces the justified masonry layout with a simple, editorial flow
 */

// Initialize gallery for a specific category
function initGallery(category) {
    const config = portfolioConfig[category];
    if (!config) {
        console.error(`Category "${category}" not found in config`);
        return;
    }

    // Update page title
    const titleElement = document.querySelector('.gallery-header h1');
    if (titleElement) {
        titleElement.innerHTML = config.title;
    }

    // Get gallery container
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) {
        console.error('Gallery grid not found');
        return;
    }

    // Clear existing content
    galleryGrid.innerHTML = '';

    // Get images array (use placeholders if empty)
    const images = config.images.length > 0 ? config.images : placeholderImages;
    // Map category name to directory name (handle bestOf -> best-of)
    const directoryName = category === 'bestOf' ? 'best-of' : category;
    const basePath = config.images.length > 0 ? `images/${directoryName}/` : '';

    // Generate gallery items - simple vertical stacking
    images.forEach((image, index) => {
        const imagePath = basePath ? `${basePath}${image}` : image;
        const galleryItem = createGalleryItem(imagePath, index, images.length);
        galleryGrid.appendChild(galleryItem);
    });

    // Initialize lightbox with all images
    initLightbox();
}

// Create a single gallery item element
function createGalleryItem(imagePath, index, totalImages) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('data-index', index);

    const img = document.createElement('img');
    img.src = imagePath;
    img.alt = `Gallery image ${index + 1}`;
    img.loading = 'lazy'; // Native lazy loading
    
    // Click to open lightbox
    item.addEventListener('click', function() {
        openLightbox(index);
    });

    item.appendChild(img);
    return item;
}

// ========================================
// LIGHTBOX FUNCTIONALITY
// ========================================

let currentLightboxIndex = 0;
let lightboxImages = [];

// Initialize lightbox
function initLightbox() {
    // Collect all gallery images for lightbox
    const galleryItems = document.querySelectorAll('.gallery-item img');
    lightboxImages = Array.from(galleryItems).map(img => img.src);

    // Create lightbox if it doesn't exist
    if (!document.querySelector('.lightbox')) {
        createLightboxElement();
    }

    // Setup lightbox controls
    setupLightboxControls();
}

// Create lightbox DOM element
function createLightboxElement() {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Close">×</button>
        <button class="lightbox-prev" aria-label="Previous">‹</button>
        <button class="lightbox-next" aria-label="Next">›</button>
        <img src="" alt="Lightbox image">
        <div class="lightbox-counter"></div>
    `;
    document.body.appendChild(lightbox);
}

// Setup lightbox event listeners
function setupLightboxControls() {
    const lightbox = document.querySelector('.lightbox');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', showPrevImage);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', showNextImage);
    }

    // Close on background click
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });
}

// Open lightbox at specific index
function openLightbox(index) {
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox img');
    
    if (!lightbox || !lightboxImg) return;

    currentLightboxIndex = index;
    lightboxImg.src = lightboxImages[index];
    updateLightboxCounter();
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close lightbox
function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;

    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

// Show previous image
function showPrevImage() {
    currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    const lightboxImg = document.querySelector('.lightbox img');
    if (lightboxImg) {
        lightboxImg.src = lightboxImages[currentLightboxIndex];
        updateLightboxCounter();
    }
}

// Show next image
function showNextImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
    const lightboxImg = document.querySelector('.lightbox img');
    if (lightboxImg) {
        lightboxImg.src = lightboxImages[currentLightboxIndex];
        updateLightboxCounter();
    }
}

// Update lightbox counter
function updateLightboxCounter() {
    const counter = document.querySelector('.lightbox-counter');
    if (counter) {
        counter.textContent = `${currentLightboxIndex + 1} / ${lightboxImages.length}`;
    }
}

// Mobile menu toggle (kept for compatibility)
function toggleMenu() {
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

// Make toggleMenu available globally
window.toggleMenu = toggleMenu;
