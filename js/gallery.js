/**
 * GALLERY MODULE
 * 
 * Handles dynamic image loading and lightbox functionality for portfolio pages
 * This module reads from config.js to determine which images to display
 * 
 * Note: The first image is displayed as the featured/title image (full-width, 16:9).
 * All images appear in the gallery grid, with the first one having special featured styling.
 * The lightbox includes all images for navigation.
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
    // Strategy: All images appear in grid. First image gets featured styling (full-width, 16:9).
    // This makes it appear as the title/hero image while remaining part of the navigable gallery.
    images.forEach((image, index) => {
        const imagePath = basePath ? `${basePath}${image}` : image;
        
        if (index === 0) {
            // First image: create as featured/title image with special styling
            const galleryItem = createGalleryItem(imagePath, index, true);
            galleryGrid.appendChild(galleryItem);
        } else {
            // Remaining images: create as regular grid items
            const galleryItem = createGalleryItem(imagePath, index, false);
            galleryGrid.appendChild(galleryItem);
        }
    });

    // Initialize lightbox with all images (including first one)
    initLightbox();
}

// Create a single gallery item element
function createGalleryItem(imagePath, index, isFeatured) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    
    // First image is featured/title - full width, larger display
    if (isFeatured) {
        item.classList.add('gallery-featured');
    }

    const img = document.createElement('img');
    img.src = imagePath;
    img.alt = `Gallery image ${index + 1}`;
    img.loading = 'lazy'; // Native lazy loading
    
    // Function to set aspect ratio and orientation based on image dimensions
    const setAspectRatioAndOrientation = function() {
        // Force featured image to 16:9 landscape
        if (isFeatured) {
            item.style.aspectRatio = '16 / 9';
            item.setAttribute('data-orientation', 'featured');
        } else if (img.naturalWidth > 0 && img.naturalHeight > 0) {
            // Calculate aspect ratio
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            item.style.aspectRatio = `${aspectRatio}`;
            
            // Determine orientation for better grid placement
            if (aspectRatio < 0.7) {
                // Very tall portrait
                item.setAttribute('data-orientation', 'tall-portrait');
            } else if (aspectRatio < 0.9) {
                // Portrait
                item.setAttribute('data-orientation', 'portrait');
            } else if (aspectRatio < 1.1) {
                // Square
                item.setAttribute('data-orientation', 'square');
            } else if (aspectRatio < 1.8) {
                // Landscape
                item.setAttribute('data-orientation', 'landscape');
            } else {
                // Wide landscape
                item.setAttribute('data-orientation', 'wide-landscape');
            }
        }
    };
    
    // Handle both immediate load (cached) and delayed load cases
    if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
        setAspectRatioAndOrientation();
    } else {
        img.onload = setAspectRatioAndOrientation;
    }
    
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
