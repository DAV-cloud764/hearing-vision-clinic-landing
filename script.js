        // Typewriter Effect
        const phrases = ["Your Eyes & Ears Deserve the Best", "Expert Care for a Clearer Life", "Trusted By The Community"];
        let currentPhraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typewriterTimeout;

        const insuranceProviders = [
            { name: 'NHIF', logo: 'assets/National-Health-Insurance-Fund-Tanzania.webp' },
            { name: 'Britam', logo: 'assets/Britam.webp' },
            { name: 'Jubilee', logo: 'assets/Jubilee.webp' },
            { name: 'Assemble', logo: 'assets/Assemble.webp' },
            { name: 'Strategis', logo: 'assets/Strategis.webp' }
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
            const carousel = document.getElementById('insurance-carousel');
            const track = document.getElementById('insurance-track');
            const fallback = document.getElementById('insurance-fallback');

            if (!carousel || !track || !fallback || insuranceProviders.length === 0) {
                return;
            }

            const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            let visibleCount = 0;
            let currentIndex = 0;
            let slideStep = 0;
            let advanceTimer = null;
            let resizeRaf = null;

            function getVisibleCount() {
                const rawValue = window.getComputedStyle(carousel).getPropertyValue('--insurance-visible').trim();
                const parsedValue = Number.parseInt(rawValue, 10);
                return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 2;
            }

            function getGapSize() {
                const styles = window.getComputedStyle(track);
                const gapValue = styles.columnGap || styles.gap || '0px';
                return Number.parseFloat(gapValue) || 0;
            }

            function clearTimer() {
                if (advanceTimer) {
                    window.clearTimeout(advanceTimer);
                    advanceTimer = null;
                }
            }

            function updateSlideStep() {
                const firstSlide = track.querySelector('.insurance-slide');
                if (!firstSlide) {
                    slideStep = 0;
                    return;
                }

                slideStep = firstSlide.getBoundingClientRect().width + getGapSize();
            }

            function buildTrack() {
                track.innerHTML = '';

                const clones = insuranceProviders.slice(0, visibleCount);
                [...insuranceProviders, ...clones].forEach((provider) => {
                    track.appendChild(createInsuranceSlide(provider));
                });
            }

            function buildFallbackGrid() {
                fallback.innerHTML = '';

                const grid = document.createElement('div');
                grid.className = 'insurance-fallback-grid';

                insuranceProviders.forEach((provider) => {
                    grid.appendChild(createInsuranceSlide(provider));
                });

                fallback.appendChild(grid);
            }

            function resetTrackPosition() {
                track.style.transition = 'none';
                currentIndex = 0;
                track.style.transform = 'translate3d(0, 0, 0)';
                track.offsetHeight;
                track.style.transition = '';
            }

            function scheduleNextAdvance() {
                clearTimer();

                if (reducedMotionQuery.matches || slideStep === 0) {
                    return;
                }

                advanceTimer = window.setTimeout(() => {
                    currentIndex += 1;
                    track.style.transform = `translate3d(-${currentIndex * slideStep}px, 0, 0)`;
                }, 1800);
            }

            function showStaticFallback() {
                clearTimer();
                carousel.classList.add('is-static');
                fallback.classList.remove('hidden');
                buildFallbackGrid();
                track.innerHTML = '';
            }

            function renderCarousel() {
                clearTimer();
                fallback.classList.add('hidden');
                carousel.classList.remove('is-static');
                visibleCount = getVisibleCount();
                buildTrack();
                currentIndex = 0;
                track.style.transition = 'none';
                track.style.transform = 'translate3d(0, 0, 0)';
                track.offsetHeight;
                track.style.transition = '';
                updateSlideStep();
                scheduleNextAdvance();
            }

            function syncCarousel() {
                if (reducedMotionQuery.matches) {
                    showStaticFallback();
                    return;
                }

                renderCarousel();
            }

            track.addEventListener('transitionend', (event) => {
                if (event.target !== track || event.propertyName !== 'transform') {
                    return;
                }

                if (currentIndex >= insuranceProviders.length) {
                    resetTrackPosition();
                }

                scheduleNextAdvance();
            });

            const onResize = () => {
                window.cancelAnimationFrame(resizeRaf);
                resizeRaf = window.requestAnimationFrame(() => {
                    if (reducedMotionQuery.matches) {
                        return;
                    }

                    const nextVisibleCount = getVisibleCount();
                    if (nextVisibleCount !== visibleCount) {
                        renderCarousel();
                        return;
                    }

                    updateSlideStep();
                });
            };

            syncCarousel();
            window.addEventListener('resize', onResize);

            if (typeof reducedMotionQuery.addEventListener === 'function') {
                reducedMotionQuery.addEventListener('change', syncCarousel);
            } else if (typeof reducedMotionQuery.addListener === 'function') {
                reducedMotionQuery.addListener(syncCarousel);
            }
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
        
        // Animations
        document.addEventListener('DOMContentLoaded', () => {
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
        });

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

        // Form submission prevention
        document.getElementById('appointment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Appointment request submitted successfully!');
            e.target.reset();
        });