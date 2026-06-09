document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       MOBILE MENU TOGGLE
       ========================================================================== */
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenuMobile = document.querySelector('.nav-menu-mobile');
    
    if (menuToggle && navMenuMobile) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenuMobile.classList.toggle('active');
        });

        // Close menu when clicking a link
        navMenuMobile.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenuMobile.classList.remove('active');
            });
        });
    }

    /* ==========================================================================
       STICKY HEADER SCROLL EFFECT
       ========================================================================== */
    const header = document.querySelector('.header');
    const navContainer = document.querySelector('.nav-container');
    
    if (header && navContainer) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.boxShadow = 'var(--shadow-sm)';
                navContainer.style.height = '60px';
            } else {
                header.style.boxShadow = 'none';
                navContainer.style.height = '80px';
            }
        });
    }

    /* ==========================================================================
       SCROLL-TRIGGERED REVEAL ANIMATIONS
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Animates only once
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }

    /* ==========================================================================
       BEFORE/AFTER SLIDER (DRAGGABLE)
       ========================================================================== */
    const slider = document.querySelector('.before-after-slider');
    const afterContainer = document.querySelector('.slider-img-after-container');
    const handle = document.querySelector('.slider-handle');
    const afterImg = document.querySelector('.slider-img-after-container .slider-img');

    if (slider && afterContainer && handle && afterImg) {
        let isDragging = false;

        const updateSlider = (x) => {
            const rect = slider.getBoundingClientRect();
            let position = ((x - rect.left) / rect.width) * 100;
            
            // Constrain between 0% and 100%
            if (position < 0) position = 0;
            if (position > 100) position = 100;

            afterContainer.style.width = `${position}%`;
            handle.style.left = `${position}%`;
        };

        const onResize = () => {
            const rect = slider.getBoundingClientRect();
            afterImg.style.width = `${rect.width}px`;
        };

        // Initialize width on load and resize
        window.addEventListener('resize', onResize);
        onResize(); // First call

        // Mouse Events
        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault();
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            updateSlider(e.clientX);
        });

        // Touch Events for Mobile
        handle.addEventListener('touchstart', (e) => {
            isDragging = true;
        });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            if (e.touches.length > 0) {
                updateSlider(e.touches[0].clientX);
            }
        });

        // Fallback click on slider
        slider.addEventListener('click', (e) => {
            if (e.target !== handle && !handle.contains(e.target)) {
                updateSlider(e.clientX);
            }
        });
    }

    /* ==========================================================================
       BODENPLANER (FLOOR CONFIGURATOR)
       ========================================================================== */
    const configOptions = document.querySelectorAll('.config-option');
    const previewImg = document.querySelector('.configurator-preview-image');
    const overlayTitle = document.querySelector('.config-overlay-title');
    const overlayDesc = document.querySelector('.config-overlay-desc');

    // Sample data to simulate changes in timber and pattern
    const woodData = {
        eiche: {
            title: "Eiche Natur",
            desc: "Robust, zeitlos, goldwarmer Charakter. Perfekt für hochfrequentierte Wohnräume."
        },
        nussbaum: {
            title: "Amerikanischer Nussbaum",
            desc: "Dunkelbraun, edle Maserung, samtige Haptik. Verleiht Räumen eine luxuriöse Tiefe."
        },
        ahorn: {
            title: "Bergahorn",
            desc: "Sehr hell, feinporig, freundlich. Ideal für skandinavische & minimalistische Designs."
        },
        buche: {
            title: "Rotbuche",
            desc: "Dezent rötlich, feine Textur, extrem hart. Schafft ein warmes, wohnliches Klima."
        }
    };

    const patternData = {
        fischgraet: "Fischgrät-Verlegung",
        landhausdiele: "Landhausdiele (Breit)",
        schiffsboden: "Klassischer Schiffsboden"
    };

    if (configOptions.length > 0 && previewImg && overlayTitle && overlayDesc) {
        let activeWood = 'eiche';
        let activePattern = 'fischgraet';

        const updateConfiguratorPreview = () => {
            // Apply a brief fade effect
            previewImg.style.opacity = '0.3';
            
            setTimeout(() => {
                const woodInfo = woodData[activeWood];
                const patternName = patternData[activePattern];
                
                overlayTitle.textContent = `${woodInfo.title}`;
                overlayDesc.textContent = `${patternName} – ${woodInfo.desc}`;
                
                // Set real floor preview image from local authentic project photos.
                let imgUrl = "images/fischgraeten1.jpeg"; // default Eiche
                
                if (activeWood === 'nussbaum') {
                    imgUrl = "images/meetingraum.jpeg"; // dark walnut wood
                } else if (activeWood === 'ahorn') {
                    imgUrl = "images/fischgraeten3.jpeg"; // light wood/maple
                } else if (activeWood === 'buche') {
                    imgUrl = "images/versiegelung3.jpeg"; // warm reddish/beech wood
                }
                
                previewImg.src = imgUrl;
                previewImg.style.opacity = '1';
            }, 200);
        };

        configOptions.forEach(option => {
            option.addEventListener('click', () => {
                const group = option.parentElement;
                
                // Deactivate other options in the same group
                group.querySelectorAll('.config-option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                // Extract value and type
                const val = option.dataset.val;
                if (option.parentElement.id === 'options-wood') {
                    activeWood = val;
                } else if (option.parentElement.id === 'options-pattern') {
                    activePattern = val;
                }
                
                updateConfiguratorPreview();
            });
        });
    }

    /* ==========================================================================
       FILTERABLE GALLERY WITH LIGHTBOX
       ========================================================================== */
    const filters = document.querySelectorAll('.gallery-filter');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Lightbox Elements
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    if (filters.length > 0 && galleryItems.length > 0) {
        // Filter Logic
        filters.forEach(filter => {
            filter.addEventListener('click', () => {
                filters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');

                const category = filter.dataset.filter;

                galleryItems.forEach(item => {
                    if (category === 'all' || item.dataset.category === category) {
                        item.classList.remove('hide');
                    } else {
                        item.classList.add('hide');
                    }
                });
            });
        });

        // Lightbox Logic
        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const img = item.querySelector('.gallery-img');
                const title = item.querySelector('.gallery-title').textContent;
                const cat = item.querySelector('.gallery-category').textContent;

                if (lightbox && lightboxImg && lightboxCaption) {
                    lightboxImg.src = img.src;
                    lightboxCaption.textContent = `${title} (${cat})`;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Stop scrolling
                }
            });
        });

        if (lightbox && lightboxClose) {
            const closeLightbox = () => {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto'; // Re-enable scroll
            };

            lightboxClose.addEventListener('click', closeLightbox);
            
            // Close when clicking outside of image
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });

            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                    closeLightbox();
                }
            });
        }
    }

    /* ==========================================================================
       MULTI-STEP PROJECT CALCULATOR
       ========================================================================== */
    const calcSteps = document.querySelectorAll('.calc-step');
    const calcIndicators = document.querySelectorAll('.calc-step-indicator');
    const progressBar = document.querySelector('.calc-progress-bar');
    
    const prevBtn = document.getElementById('calc-prev-btn');
    const nextBtn = document.getElementById('calc-next-btn');
    const submitBtn = document.getElementById('calc-submit-btn');

    const serviceOptions = document.querySelectorAll('.calc-service-option');
    const areaInput = document.getElementById('calc-area-range');
    const areaValue = document.getElementById('calc-area-val');
    const floorSelect = document.getElementById('calc-floor-type');

    // Summary Elements
    const summaryService = document.getElementById('summary-service');
    const summaryArea = document.getElementById('summary-area');
    const summaryFloor = document.getElementById('summary-floor');
    const summaryPrice = document.getElementById('summary-price');

    if (calcSteps.length > 0) {
        let currentStep = 0;
        let selectedService = 'verlegen';
        let selectedServiceText = 'Boden verlegen';
        
        // Setup Range Slider Output
        if (areaInput && areaValue) {
            areaInput.addEventListener('input', () => {
                areaValue.textContent = `${areaInput.value} m²`;
                calculateEstimate();
            });
        }

        // Setup Service Option Click
        if (serviceOptions.length > 0) {
            serviceOptions.forEach(opt => {
                opt.addEventListener('click', () => {
                    serviceOptions.forEach(o => o.classList.remove('active'));
                    opt.classList.add('active');
                    
                    selectedService = opt.dataset.service;
                    selectedServiceText = opt.querySelector('.calc-card-title').textContent;
                    
                    calculateEstimate();
                });
            });
        }

        const calculateEstimate = () => {
            const area = areaInput ? parseInt(areaInput.value, 10) : 30;
            const floorType = floorSelect ? floorSelect.value : 'eiche';
            
            let minPricePerSqm = 0;
            let maxPricePerSqm = 0;
            
            if (selectedService === 'verlegen') {
                // Base laying prices per sqm depending on material
                if (floorType === 'eiche' || floorType === 'nussbaum') {
                    minPricePerSqm = 45; maxPricePerSqm = 75; // Premium parquet
                } else if (floorType === 'vinyl') {
                    minPricePerSqm = 28; maxPricePerSqm = 45;
                } else if (floorType === 'laminat') {
                    minPricePerSqm = 22; maxPricePerSqm = 35;
                } else {
                    minPricePerSqm = 30; maxPricePerSqm = 50; // default
                }
            } else if (selectedService === 'schleifen') {
                minPricePerSqm = 24; maxPricePerSqm = 38; // sanding
            } else if (selectedService === 'versiegeln') {
                minPricePerSqm = 12; maxPricePerSqm = 20; // sealing
            } else if (selectedService === 'beratung') {
                minPricePerSqm = 0; maxPricePerSqm = 0; // free consultation
            }

            const minTotal = minPricePerSqm * area;
            const maxTotal = maxPricePerSqm * area;

            // Update DOM Summary
            if (summaryService) summaryService.textContent = selectedServiceText;
            if (summaryArea) summaryArea.textContent = `${area} m²`;
            if (summaryFloor) {
                const floorName = floorSelect ? floorSelect.options[floorSelect.selectedIndex].text : '';
                summaryFloor.textContent = selectedService === 'versiegeln' || selectedService === 'schleifen' ? 'Vorhandener Holzboden' : floorName;
            }
            
            if (summaryPrice) {
                if (selectedService === 'beratung') {
                    summaryPrice.textContent = 'Kostenlos';
                } else {
                    summaryPrice.textContent = `€${minTotal.toLocaleString('de-AT')} - €${maxTotal.toLocaleString('de-AT')}`;
                }
            }
        };

        if (floorSelect) {
            floorSelect.addEventListener('change', calculateEstimate);
        }

        const updateStepView = () => {
            // Hide all steps, show current
            calcSteps.forEach((step, idx) => {
                if (idx === currentStep) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });

            // Update indicators
            calcIndicators.forEach((ind, idx) => {
                if (idx === currentStep) {
                    ind.classList.add('active');
                    ind.classList.remove('completed');
                } else if (idx < currentStep) {
                    ind.classList.remove('active');
                    ind.classList.add('completed');
                } else {
                    ind.classList.remove('active');
                    ind.classList.remove('completed');
                }
            });

            // Progress bar
            const percent = (currentStep / (calcSteps.length - 1)) * 100;
            if (progressBar) progressBar.style.width = `${percent}%`;

            // Adjust navigation buttons
            if (currentStep === 0) {
                prevBtn.style.visibility = 'hidden';
                nextBtn.style.display = 'inline-flex';
                submitBtn.style.display = 'none';
            } else if (currentStep === calcSteps.length - 1) {
                prevBtn.style.visibility = 'visible';
                nextBtn.style.display = 'none';
                submitBtn.style.display = 'inline-flex';
                calculateEstimate(); // Final recalculation
            } else {
                prevBtn.style.visibility = 'visible';
                nextBtn.style.display = 'inline-flex';
                submitBtn.style.display = 'none';
            }
        };

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentStep < calcSteps.length - 1) {
                    currentStep++;
                    updateStepView();
                }
            });

            prevBtn.addEventListener('click', () => {
                if (currentStep > 0) {
                    currentStep--;
                    updateStepView();
                }
            });
        }

        // Handle Form Submission (mailto integration)
        const calcForm = document.getElementById('calc-project-form');
        if (calcForm) {
            calcForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const name = document.getElementById('calc-name').value;
                const email = document.getElementById('calc-email').value;
                const phone = document.getElementById('calc-phone').value;
                const message = document.getElementById('calc-msg').value;

                const area = areaInput ? areaInput.value : 30;
                const floorName = floorSelect ? floorSelect.options[floorSelect.selectedIndex].text : '';
                const priceRange = summaryPrice ? summaryPrice.textContent : '';

                // Construct mailto link
                const recipient = "office@tt-parkett.at";
                const subject = encodeURIComponent(`Projektanfrage über Webseite: ${selectedServiceText}`);
                
                const bodyText = `Sehr geehrtes Team von TT-Parkett,\n\n` +
                                 `Ich habe über Ihren Projektplaner folgende Schätzung berechnet:\n` +
                                 `- Gewünschte Leistung: ${selectedServiceText}\n` +
                                 `- Ungefähre Fläche: ${area} m²\n` +
                                 `- Bodenart: ${selectedService === 'versiegeln' || selectedService === 'schleifen' ? 'Vorhandener Holzboden' : floorName}\n` +
                                 `- Geschätzter Richtpreis: ${priceRange}\n\n` +
                                 `Meine Kontaktdaten:\n` +
                                 `- Name: ${name}\n` +
                                 `- E-Mail: ${email}\n` +
                                 `- Telefon: ${phone}\n\n` +
                                 `Zusätzliche Nachricht:\n${message}\n\n` +
                                 `Bitte setzen Sie sich zwecks einer kostenlosen und verbindlichen Beratung mit mir in Verbindung.\n\n` +
                                 `Mit freundlichen Grüßen,\n${name}`;

                const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
                
                // Open mail application
                window.location.href = mailtoUrl;
            });
        }

        // Init
        calculateEstimate();
        updateStepView();
    }
});
