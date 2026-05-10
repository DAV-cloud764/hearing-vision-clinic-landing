        // Typewriter Effect
        const phrases = ["Your Eyes & Ears Deserve the Best", "Expert Care for a Clearer Life", "Trusted By The Community"];
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

        // Form submission prevention
        document.getElementById('appointment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Appointment request submitted successfully!');
            e.target.reset();
        });