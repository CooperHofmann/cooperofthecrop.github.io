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
    
    // Store aspect ratio as data attribute for justified layout
    const setAspectRatioData = function() {
        if (isFeatured) {
            item.setAttribute('data-aspect-ratio', '1.777'); // 16:9
            item.setAttribute('data-orientation', 'featured');
        } else if (img.naturalWidth > 0 && img.naturalHeight > 0) {
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            item.setAttribute('data-aspect-ratio', aspectRatio.toString());
            
            // Store orientation for reference
            if (aspectRatio < 0.7) {
                item.setAttribute('data-orientation', 'tall-portrait');
            } else if (aspectRatio < 0.9) {
                item.setAttribute('data-orientation', 'portrait');
            } else if (aspectRatio < 1.1) {
                item.setAttribute('data-orientation', 'square');
            } else if (aspectRatio < 1.8) {
                item.setAttribute('data-orientation', 'landscape');
            } else {
                item.setAttribute('data-orientation', 'wide-landscape');
            }
        }
    };
    
    // Handle both immediate load (cached) and delayed load cases
    if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
        setAspectRatioData();
    } else {
        img.onload = setAspectRatioData;
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

/**
 * JUSTIFIED LAYOUT ALGORITHM
 * 
 * Implements a justified masonry-style layout that:
 * - Dynamically groups images into rows
 * - Fills 100% of container width
 * - Preserves original aspect ratios
 * - Averages 3-4 images per row on desktop
 * - Eliminates dead space
 */

function applyJustifiedLayout() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;
    
    // Get all non-featured gallery items
    const items = Array.from(galleryGrid.querySelectorAll('.gallery-item:not(.gallery-featured)'));
    if (items.length === 0) return;
    
    // Wait for all images to load before calculating layout
    const images = items.map(item => item.querySelector('img'));
    const allImagesLoaded = Promise.all(
        images.map(img => {
            if (img.complete && img.naturalWidth > 0) {
                return Promise.resolve();
            }
            return new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve; // Continue even if image fails
            });
        })
    );
    
    allImagesLoaded.then(() => {
        const containerWidth = galleryGrid.offsetWidth;
        if (containerWidth === 0) return;
        
        // Get breakpoint settings
        const windowWidth = window.innerWidth;
        let targetRowHeight, gutter, idealImagesPerRow;
        
        if (windowWidth <= 768) {
            // Mobile: 1-2 images per row
            targetRowHeight = 280;
            gutter = 12;
            idealImagesPerRow = 1.5;
        } else if (windowWidth <= 1200) {
            // Tablet: 2-3 images per row
            targetRowHeight = 300;
            gutter = 16;
            idealImagesPerRow = 2.5;
        } else {
            // Desktop: 3-4 images per row
            targetRowHeight = 340;
            gutter = 20;
            idealImagesPerRow = 3.5;
        }
        
        // Calculate justified layout
        const rows = buildJustifiedRows(items, containerWidth, gutter, idealImagesPerRow, targetRowHeight);
        
        // Apply calculated dimensions to items
        rows.forEach(row => {
            row.items.forEach(itemData => {
                const item = itemData.element;
                item.style.width = `${itemData.width}px`;
                item.style.height = `${row.height}px`;
                item.style.flexShrink = '0';
            });
        });
    });
}

function buildJustifiedRows(items, containerWidth, gutter, idealImagesPerRow, targetRowHeight) {
    const rows = [];
    let currentRow = [];
    let currentRowAspectSum = 0;
    
    // Define min and max row heights to keep rows more consistent
    const minRowHeight = targetRowHeight * 0.65;
    const maxRowHeight = targetRowHeight * 1.35;
    
    items.forEach((item, index) => {
        const aspectRatio = parseFloat(item.getAttribute('data-aspect-ratio')) || 1.5;
        
        // Add to current row
        currentRow.push({
            element: item,
            aspectRatio: aspectRatio
        });
        currentRowAspectSum += aspectRatio;
        
        // Calculate what the row height would be if we finalize now
        const totalGutterWidth = (currentRow.length - 1) * gutter;
        const availableWidth = containerWidth - totalGutterWidth;
        const potentialRowHeight = availableWidth / currentRowAspectSum;
        
        // Check if we should finalize this row
        let shouldFinalizeRow = false;
        
        // Last item - must finalize
        if (index === items.length - 1) {
            shouldFinalizeRow = true;
        }
        // We've reached minimum images and height is reasonable
        else if (currentRow.length >= Math.floor(idealImagesPerRow)) {
            if (potentialRowHeight >= minRowHeight && potentialRowHeight <= maxRowHeight) {
                shouldFinalizeRow = true;
            }
            // Or we've exceeded max images per row
            else if (currentRow.length >= Math.ceil(idealImagesPerRow) + 1) {
                shouldFinalizeRow = true;
            }
        }
        // Height has dropped below minimum (too many images)
        else if (potentialRowHeight < minRowHeight && currentRow.length >= 2) {
            shouldFinalizeRow = true;
        }
        
        if (shouldFinalizeRow) {
            // Recalculate final dimensions
            const finalGutterWidth = (currentRow.length - 1) * gutter;
            const finalAvailableWidth = containerWidth - finalGutterWidth;
            const finalRowHeight = finalAvailableWidth / currentRowAspectSum;
            
            // Constrain row height to reasonable bounds
            const constrainedHeight = Math.max(minRowHeight, Math.min(maxRowHeight, finalRowHeight));
            
            // Calculate final widths for each image
            const finalRow = {
                height: constrainedHeight,
                items: currentRow.map(itemData => ({
                    element: itemData.element,
                    width: constrainedHeight * itemData.aspectRatio,
                    aspectRatio: itemData.aspectRatio
                }))
            };
            
            rows.push(finalRow);
            
            // Reset for next row
            currentRow = [];
            currentRowAspectSum = 0;
        }
    });
    
    return rows;
}

// Initialize justified layout on load and resize
function initJustifiedLayout() {
    // Apply layout after a short delay to ensure images are loaded
    setTimeout(() => {
        applyJustifiedLayout();
    }, 100);
    
    // Reapply on window resize with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            applyJustifiedLayout();
        }, 250);
    });
}

// Call initJustifiedLayout after gallery is initialized
// This should be called after initGallery() completes
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait a bit for dynamic content to load
        setTimeout(initJustifiedLayout, 500);
    });
} else {
    setTimeout(initJustifiedLayout, 500);
}
