(function() {
	
	"use strict";
	
	/**
	 * SectionLoader - Modular HTML section loader
	 * Loads HTML content dynamically using data-include attributes
	 */
	class SectionLoader {
		constructor(options = {}) {
			this.options = {
				enableCache: options.enableCache !== false,
				showLoading: options.showLoading !== false,
				attribute: options.attribute || 'data-include',
				onLoad: options.onLoad || null,
				onError: options.onError || null,
				timeout: options.timeout || 10000
			};
			
			this.cache = new Map();
			this.loadedCount = 0;
			this.totalCount = 0;
		}
		
		/**
		 * Initialize the loader and load all sections
		 */
		async init() {
			const elements = document.querySelectorAll(`[${this.options.attribute}]`);
			this.totalCount = elements.length;
			
			if (this.totalCount === 0) {
				return;
			}
			
			// Show loading state
			if (this.options.showLoading) {
				this.showLoadingState(elements);
			}
			
			// Load all sections in parallel
			const promises = Array.from(elements).map(element => this.loadSection(element));
			
			try {
				await Promise.all(promises);
				this.onAllLoaded();
			} catch (error) {
				console.error('Error loading sections:', error);
			}
		}
		
		/**
		 * Load a single section
		 */
		async loadSection(element) {
			const path = element.getAttribute(this.options.attribute);
			
			if (!path) {
				console.warn('No path specified for element:', element);
				return;
			}
			
			try {
				const content = await this.fetchContent(path);
				this.insertContent(element, content, path);
				this.loadedCount++;
				
				// Callback on successful load
				if (typeof this.options.onLoad === 'function') {
					this.options.onLoad(element, path);
				}
				
			} catch (error) {
				this.handleError(element, path, error);
			}
		}
		
		/**
		 * Fetch content from path with caching and timeout
		 */
		async fetchContent(path) {
			// Check cache first
			if (this.options.enableCache && this.cache.has(path)) {
				return this.cache.get(path);
			}
			
			// Create fetch with timeout
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), this.options.timeout);
			
			try {
				const response = await fetch(path, {
					signal: controller.signal,
					headers: {
						'X-Requested-With': 'XMLHttpRequest'
					}
				});
				
				clearTimeout(timeoutId);
				
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				
				const content = await response.text();
				
				// Cache the content
				if (this.options.enableCache) {
					this.cache.set(path, content);
				}
				
				return content;
				
			} catch (error) {
				clearTimeout(timeoutId);
				
				if (error.name === 'AbortError') {
					throw new Error(`Request timeout for: ${path}`);
				}
				throw error;
			}
		}
		
		/**
		 * Insert content into element
		 */
		insertContent(element, content, path) {
			// Remove loading state
			element.classList.remove('loading');
			
			// Insert the content
			element.innerHTML = content;
			
			// Remove the data-include attribute to prevent reloading
			element.removeAttribute(this.options.attribute);
			
			// Execute any scripts in the loaded content
			this.executeScripts(element);
			
			// Trigger custom event
			const event = new CustomEvent('sectionLoaded', {
				detail: { element, path, content }
			});
			document.dispatchEvent(event);
		}
		
		/**
		 * Execute scripts in loaded content
		 */
		executeScripts(element) {
			const scripts = element.querySelectorAll('script');
			
			scripts.forEach(oldScript => {
				const newScript = document.createElement('script');
				
				// Copy attributes
				Array.from(oldScript.attributes).forEach(attr => {
					newScript.setAttribute(attr.name, attr.value);
				});
				
				// Copy content
				newScript.textContent = oldScript.textContent;
				
				// Replace old script with new one
				oldScript.parentNode.replaceChild(newScript, oldScript);
			});
		}
		
		/**
		 * Handle loading errors
		 */
		handleError(element, path, error) {
			console.error(`Failed to load section: ${path}`, error);
			
			element.classList.remove('loading');
			element.classList.add('load-error');
			
			// Create user-friendly error message
			const errorMessage = this.createErrorMessage(path, error);
			element.innerHTML = errorMessage;
			
			// Callback on error
			if (typeof this.options.onError === 'function') {
				this.options.onError(element, path, error);
			}
			
			// Trigger custom event
			const event = new CustomEvent('sectionError', {
				detail: { element, path, error }
			});
			document.dispatchEvent(event);
		}
		
		/**
		 * Create error message HTML
		 */
		createErrorMessage(path, error) {
			return `
				<div class="section-load-error" style="padding: 20px; text-align: center; color: #666;">
					<p style="margin: 0; font-size: 14px;">
						<strong>Failed to load content</strong><br>
						<span style="font-size: 12px;">${path}</span>
					</p>
				</div>
			`;
		}
		
		/**
		 * Show loading state on elements
		 */
		showLoadingState(elements) {
			elements.forEach(element => {
				element.classList.add('loading');
				
				// Add minimal loading indicator if element is empty
				if (!element.innerHTML.trim()) {
					element.innerHTML = '<div class="section-loading" style="padding: 40px; text-align: center;"><span style="color: #ccc;">Loading...</span></div>';
				}
			});
		}
		
		/**
		 * Called when all sections are loaded
		 */
		onAllLoaded() {
			// Trigger custom event
			const event = new CustomEvent('allSectionsLoaded', {
				detail: { 
					total: this.totalCount,
					loaded: this.loadedCount
				}
			});
			document.dispatchEvent(event);
			
			// Re-initialize any jQuery plugins or scripts that depend on the DOM
			this.reinitializePlugins();
		}
		
		/**
		 * Reinitialize plugins after content is loaded
		 */
		reinitializePlugins() {
			// Trigger jQuery ready event for dynamically loaded content
			if (typeof jQuery !== 'undefined') {
				jQuery(document).trigger('contentLoaded');
			}
			
			// Reinitialize common elements
			this.initializeMobileMenu();
			this.initializeSearchBox();
			this.initializeNavSidebar();
			this.initializeAboutSidebar();
			this.initializeAccordion();
			this.initializeSwiper();
		}
		
		/**
		 * Initialize mobile menu after header is loaded
		 */
		initializeMobileMenu() {
			if (typeof jQuery === 'undefined') return;
			
			const $ = jQuery;
			
			// Mobile Nav Hide Show
			if ($('.mobile-menu').length) {
				var mobileMenuContent = $('.main-header .nav-outer .main-menu').html();
				if (mobileMenuContent) {
					$('.mobile-menu .menu-box .menu-outer').html(mobileMenuContent);
				}
				
				// Dropdown Button
				$('.mobile-menu li.dropdown .dropdown-btn').on('click', function() {
					$(this).prev('ul').slideToggle(500);
				});
				
				// Menu Toggle Btn
				$('.mobile-nav-toggler').on('click', function() {
					$('body').addClass('mobile-menu-visible');
				});
				
				// Menu Toggle Btn
				$('.mobile-menu .menu-backdrop,.mobile-menu .close-btn').on('click', function() {
					$('body').removeClass('mobile-menu-visible');
				});
			}
		}
		
		/**
		 * Initialize search box
		 */
		initializeSearchBox() {
			if (typeof jQuery === 'undefined') return;
			
			const $ = jQuery;
			
			if ($('.search-box-outer').length) {
				$('.search-box-outer').on('click', function() {
					$('body').addClass('search-active');
				});
				
				$('.close-search, .search-back-drop').on('click', function() {
					$('body').removeClass('search-active');
				});
			}
		}
		
		/**
		 * Initialize nav sidebar
		 */
		initializeNavSidebar() {
			if (typeof jQuery === 'undefined') return;
			
			const $ = jQuery;
			
			if ($('.navSidebar-button').length) {
				$('.navSidebar-button').on('click', function() {
					$('body').toggleClass('nav-sidebar-active');
				});
				
				$('.nav-sidebar .close-button, .nav-sidebar-overlay').on('click', function() {
					$('body').removeClass('nav-sidebar-active');
				});
			}
		}
		
		/**
		 * Initialize about sidebar
		 */
		initializeAboutSidebar() {
			if (typeof jQuery === 'undefined') return;
			
			const $ = jQuery;
			
			// About Widget Click - Open Sidebar
			if ($('.about-widget').length) {
				$('.about-widget').off('click').on('click', function(e) {
					e.preventDefault();
					$('.about-sidebar').addClass('active');
					console.log('About sidebar opened');
				});
			}
			
			// Close Button Click - Close Sidebar
			if ($('.about-sidebar .close-button').length) {
				$('.about-sidebar .close-button').off('click').on('click', function(e) {
					e.preventDefault();
					$('.about-sidebar').removeClass('active');
					console.log('About sidebar closed');
				});
			}
			
			// Gradient Layer Click - Close Sidebar
			if ($('.about-sidebar .gradient-layer').length) {
				$('.about-sidebar .gradient-layer').off('click').on('click', function(e) {
					e.preventDefault();
					$('.about-sidebar').removeClass('active');
					console.log('About sidebar closed via gradient');
				});
			}
		}
		
		/**
		 * Initialize accordion boxes
		 */
		initializeAccordion() {
			if (typeof jQuery === 'undefined') return;
			
			const $ = jQuery;
			
			// Accordion Box functionality
			if ($('.accordion-box').length) {
				// Remove any existing handlers to prevent duplicates
				$('.accordion-box').off('click', '.acc-btn');
				
				// Add click handler for accordion buttons
				$('.accordion-box').on('click', '.acc-btn', function() {
					var outerBox = $(this).parents('.accordion-box');
					var target = $(this).parents('.accordion');
					
					if ($(this).next('.acc-content').is(':visible')) {
						// Close this accordion
						$(this).removeClass('active');
						$(this).next('.acc-content').slideUp(300);
						$(outerBox).children('.accordion').removeClass('active-block');
					} else {
						// Close all accordions in this box
						$(outerBox).find('.accordion .acc-btn').removeClass('active');
						$(this).addClass('active');
						$(outerBox).children('.accordion').removeClass('active-block');
						$(outerBox).find('.accordion').children('.acc-content').slideUp(300);
						
						// Open this accordion
						target.addClass('active-block');
						$(this).next('.acc-content').slideDown(300);
					}
				});
				
				console.log('Accordion initialized');
			}
		}
		
		/**
		 * Initialize Swiper sliders after content is loaded
		 */
		initializeSwiper() {
			if (typeof Swiper === 'undefined') {
				console.warn('Swiper library not loaded');
				return;
			}
			
			// Log that we're initializing Swipers
			console.log('Initializing Swiper sliders...');
			
			// Small delay to ensure DOM is fully rendered
			setTimeout(() => {
				// Initialize main slider if it exists
				if (document.querySelector('.main-slider')) {
					console.log('Initializing main-slider...');
					new Swiper('.main-slider', {
					slidesPerView: 1,
					spaceBetween: 0,
					loop: true,
					autoplay: {
						enabled: true,
						delay: 6000,
					},
					// Navigation arrows
					navigation: {
						nextEl: '.main-slider-next',
						prevEl: '.main-slider-prev',
						clickable: true,
					},
					//Pagination
					pagination: {
						el: ".slider-one_pagination",
						clickable: true,
						renderBullet: function (index, className) {
							let formattedIndex = (index + 1).toString().padStart(2, '0');
							return '<span class="' + className + '">' + formattedIndex + "</span>";
						},
					},
					speed: 500,
					breakpoints: {
						'1600': {
							slidesPerView: 1,
						},
						'1200': {
							slidesPerView: 1,
						},
						'992': {
							slidesPerView: 1,
						},
						'768': {
							slidesPerView: 1,
						},
						'576': {
							slidesPerView: 1,
						},
						'0': {
							slidesPerView: 1,
						},
					},
				});
				}
				
				// Initialize clients slider if it exists
				if (document.querySelector('.clients_slider')) {
					console.log('Initializing clients_slider...');
					new Swiper('.clients_slider', {
						slidesPerView: 4,
						spaceBetween: 10,
						loop: true,
						autoplay: {
							enabled: true,
							delay: 6000
						},
						// Navigation arrows
						navigation: {
							nextEl: '.clients_slider-button-next',
							prevEl: '.clients_slider-button-prev',
							clickable: true,
						},
						//Pagination
						pagination: {
							el: ".clients_slider-pagination",
							clickable: true,
						},
						speed: 1500,
						breakpoints: {
							'1600': {
								slidesPerView: 4,
							},
							'1200': {
								slidesPerView: 4,
							},
							'992': {
								slidesPerView: 4,
							},
							'768': {
								slidesPerView: 3,
							},
							'576': {
								slidesPerView: 2,
							},
							'0': {
								slidesPerView: 1,
							},
						},
					});
				}
			}, 100); // 100ms delay
		}
		
		/**
		 * Clear cache
		 */
		clearCache() {
			this.cache.clear();
		}
		
		/**
		 * Reload a specific section
		 */
		async reloadSection(selector) {
			const element = document.querySelector(selector);
			if (element) {
				const path = element.getAttribute(this.options.attribute);
				if (path) {
					// Remove from cache
					this.cache.delete(path);
					// Reload
					await this.loadSection(element);
				}
			}
		}
	}
	
	/**
	 * Initialize loader when DOM is ready
	 */
	function initLoader() {
		// Create and initialize the loader
		const loader = new SectionLoader({
			enableCache: true,
			showLoading: true,
			onLoad: (element, path) => {
				// Optional: log successful loads in development
				// console.log(`Loaded: ${path}`);
			},
			onError: (element, path, error) => {
				// Log errors
				console.error(`Error loading ${path}:`, error.message);
			}
		});
		
		loader.init();
		
		// Expose loader globally for debugging/manual control
		window.sectionLoader = loader;
	}
	
	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initLoader);
	} else {
		// DOM already loaded
		initLoader();
	}
	
})();

