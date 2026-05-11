        // Typewriter Effect
        const phrases = ["Eye & Ear Clinic in Tabata, Dar es Salaam", "Comprehensive Ophthalmology and ENT Care", "Insurance-Friendly Vision and Hearing Services"];
        let currentPhraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typewriterTimeout;

        const insuranceProviders = [
            { name: 'NHIF', logo: 'assets/National-Health-Insurance-Fund-Tanzania.webp' },
            { name: 'Britam Insurance', logo: 'assets/Britam.webp' },
            { name: 'Jubilee Insurance', logo: 'assets/Jubilee.webp' },
            { name: 'Strategies Insurance', logo: 'assets/Strategis.webp' },
            { name: 'Assemble Insurance', logo: 'assets/Assemble.webp' }
        ];

        function createInsuranceSlide(provider) {
            const slide = document.createElement('article');
            slide.className = 'insurance-slide';
            slide.innerHTML = `
                <div class="insurance-card">
                    <div class="insurance-logo">
                        <img src="${provider.logo}" alt="${provider.name} logo" loading="lazy" decoding="async">
                    </div>
                    <div class="insurance-name">${provider.name}</div>
                </div>
            `;
            return slide;
        }

        function setupInsuranceCarousel() {
            return;
        }
        
        function typeWriter() {
            const typeTarget = document.getElementById('typewriter');
            if (!typeTarget) return; // Safety check
            
            const currentPhrase = phrases[currentPhraseIndex];
            
            if (isDeleting) {
                charIndex--;
            } else {
                charIndex++;
            }
            
            typeTarget.textContent = currentPhrase.substring(0, charIndex);
            
            let typeSpeed = 80; // Slightly faster for smoothness
            if (isDeleting) typeSpeed = 40;
            
            if (!isDeleting && charIndex === currentPhrase.length) {
                typeSpeed = 1500; // Pause at end before deleting
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                typeSpeed = 600; // Pause before typing next phrase
            }
            
            typewriterTimeout = setTimeout(typeWriter, typeSpeed);
        }
        
        function initializePage() {
            const motion = window.Motion;
            const animate = motion?.animate;
            const inView = motion?.inView;
            const stagger = motion?.stagger;

            // Start Typewriter after DOM is ready
            typewriterTimeout = setTimeout(typeWriter, 800);
            setupInsuranceCarousel();
            
            // Hero Entry
            if (animate) {
                try {
                    animate([
                        ['#hero-badge', { opacity: 1, y: 0 }, { duration: 0.8, delay: 0.2 }],
                        ['#hero-title', { opacity: 1 }, { duration: 0.8, delay: 0.3 }],
                        ['#hero-subtext', { opacity: 1, y: 0 }, { duration: 0.8, delay: 0.4 }],
                        ['#hero-cta', { opacity: 1, y: 0 }, { duration: 0.8, delay: 0.5 }]
                    ]);
                } catch (e) {
                    console.warn('Motion library animation error:', e);
                    // Fallback: show elements immediately
                    document.getElementById('hero-badge')?.style.setProperty('opacity', '1', 'important');
                    document.getElementById('hero-subtext')?.style.setProperty('opacity', '1', 'important');
                    document.getElementById('hero-cta')?.style.setProperty('opacity', '1', 'important');
                }
            } else {
                // Fallback: show elements immediately
                document.getElementById('hero-badge')?.style.setProperty('opacity', '1', 'important');
                document.getElementById('hero-subtext')?.style.setProperty('opacity', '1', 'important');
                document.getElementById('hero-cta')?.style.setProperty('opacity', '1', 'important');
            }

            // Scroll animations
            if (inView && animate && stagger) {
                inView('.section-title', (info) => {
                    animate(info.target, { opacity: [0, 1], y: [20, 0] }, { duration: 0.8 });
                });
                
                inView('.section-desc', (info) => {
                    animate(info.target, { opacity: [0, 1], y: [20, 0] }, { duration: 0.8, delay: 0.2 });
                });

                // Services Grid
                inView('.service-card', () => {
                    animate(
                        document.querySelectorAll('.service-card'),
                        { opacity: [0, 1], y: [30, 0] },
                        { delay: stagger(0.15), duration: 0.8 }
                    )
                });

                // Contact section
                inView('.form-container', () => {
                    animate('.form-container', { opacity: [0, 1], x: [-30, 0] }, { duration: 0.8 });
                    animate('.contact-info', { opacity: [0, 1], x: [30, 0] }, { duration: 0.8, delay: 0.2 });
                });
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializePage);
        } else {
            initializePage();
        }

        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

        function setMobileMenuOpen(isOpen) {
            if (!mobileMenuButton || !mobileMenu) return;

            mobileMenuButton.setAttribute('aria-expanded', String(isOpen));
            mobileMenuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
            mobileMenu.dataset.open = String(isOpen);
            mobileMenu.setAttribute('aria-hidden', String(!isOpen));
            document.body.classList.toggle('nav-menu-open', isOpen);
        }

        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                const isOpen = mobileMenu.dataset.open === 'true';
                setMobileMenuOpen(!isOpen);
            });

            mobileMenuLinks.forEach((link) => {
                link.addEventListener('click', () => {
                    setMobileMenuOpen(false);
                });
            });

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    setMobileMenuOpen(false);
                }
            });

            window.addEventListener('resize', () => {
                if (window.innerWidth >= 768) {
                    setMobileMenuOpen(false);
                }
            });
        }

        window.setupInsuranceCarousel = setupInsuranceCarousel;

        // Testimonial Carousel
        const track = document.getElementById('carousel-track');
        const dots = document.querySelectorAll('.carousel-dot');
        let currentSlide = 0;
        
        function updateCarousel(index) {
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.replace('opacity-100', 'opacity-50'));
            dots[index].classList.replace('opacity-50', 'opacity-100');
            currentSlide = index;
        }

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                updateCarousel(index);
            });
        });

        // Initial state
        dots[0].classList.replace('opacity-50', 'opacity-100');

        // Auto play
        setInterval(() => {
            currentSlide = (currentSlide + 1) % dots.length;
            updateCarousel(currentSlide);
        }, 5000);

        // Form submission handling
        const form = document.getElementById('appointment-form');
        const feedbackEl = document.getElementById('form-feedback');
        const submitBtn = document.getElementById('submit-btn');
        const btnText = submitBtn.querySelector('span');
        let feedbackTimeout;

        function showFeedback(message, type) {
            // Clear any existing timeout
            if (feedbackTimeout) clearTimeout(feedbackTimeout);
            
            // Set message and base classes
            feedbackEl.textContent = message;
            feedbackEl.className = `mt-4 p-4 rounded-xl text-sm font-medium transition-opacity duration-500 ease-in-out opacity-0 ${
                type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`;
            
            // Remove display:none to allow rendering
            feedbackEl.classList.remove('hidden');
            
            // Trigger reflow to ensure the transition applies
            void feedbackEl.offsetWidth;
            
            // Fade in
            feedbackEl.classList.remove('opacity-0');
            feedbackEl.classList.add('opacity-100');

            // Auto dismiss after 4 seconds
            feedbackTimeout = setTimeout(() => {
                // Fade out
                feedbackEl.classList.remove('opacity-100');
                feedbackEl.classList.add('opacity-0');
                
                // Hide after transition ends
                setTimeout(() => {
                    feedbackEl.classList.add('hidden');
                }, 500); // Wait for the duration-500 fading to complete
            }, 4000);
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Set loading state
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
            btnText.innerHTML = `
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
            `;
            
            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    form.reset();
                    showFeedback('✅ Appointment request submitted successfully! We will contact you shortly.', 'success');
                } else {
                    const data = await response.json();
                    let errMsg = 'Oops! There was a problem submitting your form.';
                    if (Object.hasOwn(data, 'errors')) {
                        errMsg = data.errors.map(error => error.message).join(', ');
                    }
                    showFeedback(errMsg, 'error');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showFeedback('Network error. Please check your connection and try again.', 'error');
            } finally {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
                btnText.textContent = 'Book Appointment';
            }
        });