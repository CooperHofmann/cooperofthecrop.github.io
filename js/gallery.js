/**
 * GALLERY MODULE
 * 
 * Handles dynamic image loading and lightbox functionality for portfolio pages
 * This module reads from config.js to determine which images to display
 */

// Initialize gallery for a specific category
function initGallery(category) {
    const config = portfolioConfig[category];
    if (!config) {
        console.error(`Category "${category}" not found in config`);
        return;
    }

    // Update page title
    const titleElement = document.querySelector('.gallery-main h1');
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
    const basePath = config.images.length > 0 ? `images/${category}/` : '';

    // Generate gallery items
    images.forEach((image, index) => {
        const imagePath = basePath ? `${basePath}${image}` : image;
        const galleryItem = createGalleryItem(imagePath, index);
        galleryGrid.appendChild(galleryItem);
    });

    // Initialize lightbox
    initLightbox();
}

// Create a single gallery item element
function createGalleryItem(imagePath, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    
    // Add featured class to first item
    if (index === 0) {
        item.classList.add('gallery-featured');
    }

    const img = document.createElement('img');
    img.src = imagePath;
    img.alt = `Gallery image ${index + 1}`;
    img.loading = 'lazy'; // Native lazy loading
    
    // Load image to get natural dimensions
    img.onload = function() {
        const aspectRatio = this.naturalWidth / this.naturalHeight;
        
        // Force first image to 16:9 landscape
        if (index === 0) {
            item.style.aspectRatio = '16 / 9';
        } else {
            // Use natural aspect ratio for other images
            item.style.aspectRatio = `${aspectRatio}`;
        }
    };
    
    // Error handling for broken images
    img.onerror = function() {
        console.warn(`Failed to load image: ${imagePath}`);
        this.src = placeholderImages[0]; // Fallback to placeholder
    };

    item.appendChild(img);
    
    // Add click handler for lightbox
    item.addEventListener('click', () => openLightbox(index));

    return item;
}

// Lightbox functionality
let currentImageIndex = 0;
let lightboxImages = [];

function initLightbox() {
    // Get all gallery images
    const galleryItems = document.querySelectorAll('.gallery-item img');
    lightboxImages = Array.from(galleryItems).map(img => img.src);

    // Create lightbox if it doesn't exist
    if (!document.getElementById('lightbox')) {
        createLightboxHTML();
    }
}

function createLightboxHTML() {
    const lightboxHTML = `
        <div id="lightbox" class="lightbox">
            <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
            <button class="lightbox-prev" onclick="navigateLightbox(-1)">&#8249;</button>
            <button class="lightbox-next" onclick="navigateLightbox(1)">&#8250;</button>
            <img id="lightbox-img" src="" alt="Lightbox image">
            <div class="lightbox-counter">
                <span id="lightbox-current">1</span> / <span id="lightbox-total">1</span>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
}

function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    currentImageIndex = index;
    
    const img = document.getElementById('lightbox-img');
    img.src = lightboxImages[currentImageIndex];
    
    updateLightboxCounter();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

function navigateLightbox(direction) {
    currentImageIndex += direction;
    
    // Loop around
    if (currentImageIndex < 0) {
        currentImageIndex = lightboxImages.length - 1;
    } else if (currentImageIndex >= lightboxImages.length) {
        currentImageIndex = 0;
    }
    
    const img = document.getElementById('lightbox-img');
    img.src = lightboxImages[currentImageIndex];
    updateLightboxCounter();
}

function updateLightboxCounter() {
    document.getElementById('lightbox-current').textContent = currentImageIndex + 1;
    document.getElementById('lightbox-total').textContent = lightboxImages.length;
}

// Mobile menu toggle (shared across all pages)
function toggleMenu() {
    document.getElementById('nav-menu').classList.toggle('active');
}
