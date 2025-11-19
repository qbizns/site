/**
 * Modern Masonry Gallery with Lazy Loading and GSAP Animations
 * Handles image loading, masonry layout calculations, and smooth animations
 */

(function($) {
    'use strict';

    // Wait for DOM and images to be ready
    $(document).ready(function() {
        // Wait a bit for dynamic content to load
        setTimeout(function() {
            initGallery();
        }, 300);
    });
    
    // Also initialize when sections are loaded (for dynamic includes)
    $(window).on('load', function() {
        setTimeout(function() {
            initGallery();
        }, 500);
    });

    function initGallery() {
        const galleryContainer = $('.gallery-masonry-container');
        if (!galleryContainer.length) return;

        // Initialize masonry layout
        calculateMasonryLayout();
        
        // Initialize lazy loading
        initLazyLoading();
        
        // Initialize GSAP animations
        initGSAPAnimations();
        
        // Initialize Magnific Popup
        initMagnificPopup();
        
        // Recalculate on window resize
        let resizeTimer;
        $(window).on('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                calculateMasonryLayout();
            }, 250);
        });
    }

    /**
     * Calculate masonry layout - CSS Columns handles this automatically
     * This function is kept for potential future enhancements
     */
    function calculateMasonryLayout() {
        // CSS Columns masonry layout doesn't need manual calculation
        // The browser handles the layout automatically
        // This function is kept for compatibility and future enhancements
        const items = $('.gallery-item[data-gallery-item]');
        
        // Ensure all images are properly sized
        items.each(function() {
            const $item = $(this);
            const $img = $item.find('.gallery-image');
            
            // Ensure image fills container without extra space
            $item.css({
                'height': 'auto',
                'width': '100%'
            });
            
            $img.css({
                'width': '100%',
                'height': 'auto',
                'display': 'block'
            });
        });
    }

    /**
     * Initialize lazy loading using Intersection Observer
     */
    function initLazyLoading() {
        // Check if Intersection Observer is supported
        if (!('IntersectionObserver' in window)) {
            // Fallback: Load all images immediately
            $('.gallery-image[loading="lazy"]').each(function() {
                $(this).removeAttr('loading');
            });
            return;
        }

        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Load image if it has a data-src attribute (for future enhancement)
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    // Remove loading attribute once loaded
                    img.addEventListener('load', function() {
                        $(this).closest('.gallery-item').removeClass('loading');
                    }, { once: true });
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px' // Start loading 50px before image enters viewport
        });

        // Observe all gallery images
        $('.gallery-image').each(function() {
            imageObserver.observe(this);
        });
    }

    /**
     * Initialize GSAP ScrollTrigger animations
     */
    function initGSAPAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            // Fallback: Use CSS animations
            setTimeout(function() {
                $('.gallery-item').addClass('animate-in');
            }, 100);
            return;
        }

        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Animate gallery items on scroll
        const items = $('.gallery-item[data-gallery-item]');
        
        items.each(function(index) {
            const $item = $(this);
            
            gsap.fromTo($item[0], 
                {
                    opacity: 0,
                    y: 50,
                    scale: 0.9
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: $item[0],
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                        once: true
                    },
                    delay: index * 0.05 // Stagger effect
                }
            );
        });
    }

    /**
     * Initialize Magnific Popup for lightbox
     */
    function initMagnificPopup() {
        if (typeof $.fn.magnificPopup === 'undefined') {
            console.warn('Magnific Popup is not loaded');
            return;
        }

        $('.gallery-link.lightbox-image').magnificPopup({
            type: 'image',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [1, 2] // Preload next 2 images
            },
            image: {
                titleSrc: function(item) {
                    return item.el.find('img').attr('alt') || 'Gallery Image';
                }
            },
            mainClass: 'mfp-gallery',
            removalDelay: 300,
            fixedContentPos: true,
            fixedBgPos: true,
            overflowY: 'auto',
            closeBtnInside: true,
            preloader: true,
            midClick: true,
            zoom: {
                enabled: true,
                duration: 300
            },
            callbacks: {
                open: function() {
                    // Add custom class when lightbox opens
                    $('body').addClass('mfp-gallery-open');
                },
                close: function() {
                    // Remove custom class when lightbox closes
                    $('body').removeClass('mfp-gallery-open');
                }
            }
        });
    }

    /**
     * Recalculate layout after images load
     */
    function recalculateAfterLoad() {
        let loadedCount = 0;
        const totalImages = $('.gallery-image').length;
        
        $('.gallery-image').on('load', function() {
            loadedCount++;
            if (loadedCount === totalImages) {
                setTimeout(function() {
                    calculateMasonryLayout();
                }, 100);
            }
        });
    }

    // Initialize recalculation
    recalculateAfterLoad();

})(jQuery);

