// ============================================
// PORTFOLIO SCRIPT - Kairy Ken Magno
// ============================================

(function() {
    'use strict';
    
    // ========== THEME MANAGEMENT WITH DROPDOWN ==========
    function initThemeManager() {
        const themeDropdownBtn = document.getElementById('themeDropdownBtn');
        const themeDropdownMenu = document.getElementById('themeDropdownMenu');
        const themeOptions = document.querySelectorAll('.theme-option');
        
        // Check if elements exist, retry if not
        if (!themeDropdownBtn || !themeDropdownMenu) {
            console.warn('Theme elements not found, retrying...');
            setTimeout(initThemeManager, 100);
            return;
        }
        
        // Available themes
        const themes = ['dark-blue', 'light', 'indigo', 'emerald', 'monochrome'];
        
        // Get saved theme or default to dark-blue
        function getCurrentTheme() {
            const savedTheme = localStorage.getItem('portfolio-theme');
            return savedTheme && themes.includes(savedTheme) ? savedTheme : 'dark-blue';
        }
        
        let currentTheme = getCurrentTheme();
        
        // Apply theme function with text color forcing
        function applyTheme(theme) {
            console.log('🎨 Applying theme:', theme);
            
            // STEP 1: Always remove any existing data-theme attribute first
            document.documentElement.removeAttribute('data-theme');
            
            // STEP 2: Apply new theme (only if not dark-blue, which is the default)
            if (theme && theme !== 'dark-blue') {
                document.documentElement.setAttribute('data-theme', theme);
            }
            
            // STEP 3: Update dropdown active state
            themeOptions.forEach(option => {
                const optionTheme = option.getAttribute('data-theme');
                if (optionTheme === theme) {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
            });
            
            // STEP 4: Save to localStorage
            localStorage.setItem('portfolio-theme', theme);
            currentTheme = theme;
            
            // STEP 5: FORCE TEXT COLOR UPDATE - Critical fix!
            forceTextColorUpdate(theme);
            
            // STEP 6: Recreate particles
            if (typeof createParticles === 'function') {
                createParticles();
            }
            
            // Debug info
            const currentAttr = document.documentElement.getAttribute('data-theme');
            console.log('✅ Theme applied. data-theme attribute:', currentAttr || '(none - using default)');
            console.log('📝 Text colors should now be:', theme === 'light' ? 'dark (black)' : 'light (white)');
        }
        
        // ========== FORCE TEXT COLOR UPDATE ==========
        function forceTextColorUpdate(theme) {
            // Get the computed text color based on theme
            const isLight = theme === 'light';
            const textColor = isLight ? '#111827' : '#F8FAFC';
            const textSecondary = isLight ? '#374151' : '#CBD5E1';
            const textMuted = isLight ? '#6B7280' : '#94A3B8';
            
            console.log(`🔄 Forcing text colors to: ${textColor} (${isLight ? 'light theme' : 'dark theme'})`);
            
            // Method 1: Update body color directly with important
            document.body.style.setProperty('color', textColor, 'important');
            
            // Method 2: Force all text elements to update
            const textElements = document.querySelectorAll(
                'h1, h2, h3, h4, h5, h6, p, span, div, a, li, ' +
                'button, input, textarea, label, .logo-text, .nav-link, ' +
                '.hero-title, .hero-desc, .hero-desc-full, .section-title, ' +
                '.about-content h3, .about-content p, .project-info h3, ' +
                '.project-info p, .project-tags span, .contact-detail, ' +
                '.footer p, .floating-card, .skill-item span, .theme-option, ' +
                '.theme-dropdown-header, .message-content, .question-btn'
            );
            
            textElements.forEach(el => {
                // Skip elements that should always be accent color
                if (el.classList.contains('blue-accent') || 
                    el.classList.contains('blue-gradient') ||
                    el.classList.contains('accent-blue')) {
                    return;
                }
                
                // Skip elements in contact-left (should be white)
                if (el.closest('.contact-left')) {
                    return;
                }
                
                // Skip buttons that use btn-text
                if (el.closest('.btn-primary') || el.closest('.btn-outline')) {
                    return;
                }
                
                // Apply appropriate text color based on element type
                if (el.classList.contains('text-muted') || 
                    el.closest('.text-muted') ||
                    el.classList.contains('text-secondary') ||
                    el.closest('.text-secondary')) {
                    // These use their own variables
                } else if (el.closest('.project-tags') || el.closest('.skill-item')) {
                    // These should use muted color
                } else {
                    // Force primary text color
                    el.style.setProperty('color', textColor, 'important');
                }
            });
            
            // Update secondary text elements
            const secondaryElements = document.querySelectorAll(
                '.nav-link, .hero-desc, .hero-desc-full, .about-content p, ' +
                '.project-info p, .contact-detail, .footer p'
            );
            secondaryElements.forEach(el => {
                if (!el.closest('.contact-left')) {
                    el.style.setProperty('color', textSecondary, 'important');
                }
            });
            
            // Update muted text elements
            const mutedElements = document.querySelectorAll(
                '.project-tags span, .skill-item span, .text-muted, .theme-dropdown-header'
            );
            mutedElements.forEach(el => {
                el.style.setProperty('color', textMuted, 'important');
            });
            
            // Update nav links specially
            document.querySelectorAll('.nav-link').forEach(el => {
                el.style.setProperty('color', textSecondary, 'important');
                el.addEventListener('mouseenter', function() {
                    this.style.setProperty('color', textColor, 'important');
                });
                el.addEventListener('mouseleave', function() {
                    if (!this.classList.contains('active')) {
                        this.style.setProperty('color', textSecondary, 'important');
                    }
                });
            });
            
            // Force a repaint
            document.body.style.display = 'none';
            document.body.offsetHeight; // Trigger reflow
            document.body.style.display = '';
            
            console.log('✅ Text colors forced updated');
        }
        
        // Initialize theme on load
        applyTheme(currentTheme);
        
        // Toggle dropdown
        themeDropdownBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            themeDropdownMenu.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!themeDropdownMenu.contains(e.target) && !themeDropdownBtn.contains(e.target)) {
                themeDropdownMenu.classList.remove('active');
            }
        });
        
        // Prevent dropdown from closing when clicking inside
        themeDropdownMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Theme option click handlers
        themeOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                const theme = this.getAttribute('data-theme');
                applyTheme(theme);
                themeDropdownMenu.classList.remove('active');
            });
        });
        
        console.log('✅ Theme manager initialized! Current theme:', currentTheme);
    }

    // ========== PROFILE IMAGE HANDLING ==========
    function initProfileImage() {
        const profileImg = document.getElementById('profileImg');
        if (!profileImg) return;
        
        profileImg.addEventListener('error', function() {
            this.style.display = 'none';
            const parent = this.parentElement;
            if (!parent.querySelector('.fallback-user')) {
                const fallbackDiv = document.createElement('div');
                fallbackDiv.style.cssText = `
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #2563eb, #6366f1);
                    color: white;
                    font-size: 3.5rem;
                `;
                fallbackDiv.innerHTML = '<i class="fas fa-user-circle"></i>';
                fallbackDiv.className = 'fallback-user';
                parent.appendChild(fallbackDiv);
            }
        });
        
        if (!profileImg.src || profileImg.src.includes('null') || profileImg.src === window.location.href) {
            profileImg.src = 'https://ui-avatars.com/api/?background=2563eb&color=fff&bold=true&size=300&name=Kairy+Ken';
        }
    }

    // ========== MOBILE NAVIGATION ==========
    function initMobileNav() {
        const mobileBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.getElementById('navLinks');
        
        if (!mobileBtn || !navLinks) return;
        
        function closeMenu() {
            navLinks.classList.remove('active');
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
        
        function openMenu() {
            navLinks.classList.add('active');
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        }
        
        mobileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (navLinks.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navLinks.contains(e.target) && !mobileBtn.contains(e.target) && navLinks.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    // ========== EMAILJS & CONTACT FORM ==========
    function initContactForm() {
        // Initialize EmailJS
        if (typeof emailjs !== 'undefined') {
            emailjs.init('qZDmA1imzHhCAtCrQ');
        }
        
        const contactForm = document.getElementById('contactForm');
        const formStatus = document.getElementById('formStatus');
        
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const sendBtn = document.getElementById('sendBtn');
            if (!sendBtn) return;
            
            const originalText = sendBtn.innerHTML;
            sendBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Sending...';
            sendBtn.disabled = true;
            
            const userEmail = document.getElementById('userEmail').value.trim();
            const userSubject = document.getElementById('userSubject').value.trim();
            const userMessage = document.getElementById('userMessage').value.trim();
            
            // Basic validation
            if (!userEmail || !userSubject || !userMessage) {
                formStatus.innerHTML = '<span style="color: #ef4444;">Please fill in all fields.</span>';
                sendBtn.innerHTML = originalText;
                sendBtn.disabled = false;
                return;
            }
            
            if (typeof emailjs === 'undefined') {
                formStatus.innerHTML = '<span style="color: #ef4444;">❌ Email service not available. Please email me directly at kairymagno@gmail.com</span>';
                sendBtn.innerHTML = originalText;
                sendBtn.disabled = false;
                return;
            }
            
            const templateParams = {
                from_email: userEmail,
                subject: userSubject,
                message: userMessage,
                to_email: 'kairymagno@gmail.com'
            };
            
            emailjs.send('service_yfs314h', 'template_gym648t', templateParams)
                .then(function() {
                    formStatus.innerHTML = '<span style="color: #10b981;">✓ Message sent successfully! I\'ll get back to you soon.</span>';
                    contactForm.reset();
                    setTimeout(() => { formStatus.innerHTML = ''; }, 5000);
                })
                .catch(function(error) {
                    console.error('Email error:', error);
                    formStatus.innerHTML = '<span style="color: #ef4444;">❌ Failed to send. Please email me directly at kairymagno@gmail.com</span>';
                    setTimeout(() => { formStatus.innerHTML = ''; }, 5000);
                })
                .finally(function() {
                    sendBtn.innerHTML = originalText;
                    sendBtn.disabled = false;
                });
        });
    }

    // ========== SMOOTH SCROLLING ==========
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElem = document.querySelector(targetId);
                if (targetElem) {
                    e.preventDefault();
                    const navHeight = document.querySelector('.navbar')?.offsetHeight || 70;
                    const targetPosition = targetElem.getBoundingClientRect().top + window.pageYOffset - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ========== INTERSECTION OBSERVER FOR FADE-IN ==========
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(section);
        });
        
        document.querySelectorAll('.project-card, .about-container').forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(15px)';
            element.style.transition = `opacity 0.4s ease ${index * 0.08}s, transform 0.4s ease ${index * 0.08}s`;
            observer.observe(element);
        });
    }

    // ========== UPDATE FOOTER YEAR ==========
    function updateFooterYear() {
        const footerPara = document.querySelector('.footer p');
        if (footerPara) {
            const currentYear = new Date().getFullYear();
            footerPara.innerHTML = footerPara.innerHTML.replace(/2026|2025/g, currentYear);
        }
    }

    // ========== TYPING ANIMATION ==========
    function initTypingAnimation() {
        const roles = ["Web Developer", "Game Developer", "IT Support Specialist"];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;
        const typedRoleElement = document.getElementById('typedRole');
        
        if (!typedRoleElement) return;
        
        function typeEffect() {
            if (isPaused) return;
            
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                if (charIndex > 0) {
                    charIndex--;
                    typedRoleElement.innerHTML = currentRole.substring(0, charIndex) + '<span class="typed-cursor">|</span>';
                    setTimeout(typeEffect, 40);
                } else {
                    isDeleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                    setTimeout(typeEffect, 400);
                }
            } else {
                if (charIndex < currentRole.length) {
                    charIndex++;
                    typedRoleElement.innerHTML = currentRole.substring(0, charIndex) + '<span class="typed-cursor">|</span>';
                    setTimeout(typeEffect, 120);
                } else {
                    typedRoleElement.innerHTML = currentRole;
                    isPaused = true;
                    setTimeout(() => {
                        isPaused = false;
                        isDeleting = true;
                        typeEffect();
                    }, 1800);
                }
            }
        }
        
        typedRoleElement.innerHTML = '<span class="typed-cursor">|</span>';
        setTimeout(typeEffect, 600);
    }

    // ========== IMAGE SLIDESHOW ==========
    function initImageSlideshow() {
        const images = [
            'images/pic1.png',
            'images/pic2.png', 
            'images/pic3.png'
        ];
        let currentImageIndex = 0;
        let isTransitioning = false;
        let slideshowInterval = null;
        const profileImgSlide = document.getElementById('profileImg');
        const profilePlaceholder = document.querySelector('.profile-pic-placeholder');
        
        if (!profileImgSlide || !profilePlaceholder) return;
        
        const preloadedImages = [];
        
        function preloadImages() {
            images.forEach((src, index) => {
                const img = new Image();
                img.onload = () => { preloadedImages[index] = img; };
                img.onerror = () => { preloadedImages[index] = null; };
                img.src = src;
            });
        }
        
        function changeImage() {
            if (isTransitioning || preloadedImages.length === 0) return;
            
            isTransitioning = true;
            profileImgSlide.style.opacity = '0';
            
            setTimeout(() => {
                currentImageIndex = (currentImageIndex + 1) % images.length;
                
                let attempts = 0;
                while (!preloadedImages[currentImageIndex] && attempts < images.length) {
                    currentImageIndex = (currentImageIndex + 1) % images.length;
                    attempts++;
                }
                
                if (preloadedImages[currentImageIndex]) {
                    profileImgSlide.src = preloadedImages[currentImageIndex].src;
                }
                
                profileImgSlide.style.opacity = '1';
                
                setTimeout(() => { isTransitioning = false; }, 500);
            }, 400);
        }
        
        preloadImages();
        
        if (images.length > 1) {
            slideshowInterval = setInterval(changeImage, 4000);
        }
        
        profilePlaceholder.addEventListener('mouseenter', () => {
            if (slideshowInterval) clearInterval(slideshowInterval);
        });
        
        profilePlaceholder.addEventListener('mouseleave', () => {
            if (images.length > 1) {
                slideshowInterval = setInterval(changeImage, 4000);
            }
        });
        
        window.addEventListener('beforeunload', () => {
            if (slideshowInterval) clearInterval(slideshowInterval);
        });
    }

    // ========== LIGHTBOX FUNCTIONALITY ==========
    function initLightbox() {
        let modal = document.getElementById('lightbox-modal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'lightbox-modal';
            modal.className = 'lightbox-modal';
            modal.innerHTML = `
                <span class="close-lightbox">&times;</span>
                <img class="lightbox-content" id="lightbox-img" alt="Enlarged view">
                <div class="lightbox-caption" id="lightbox-caption"></div>
            `;
            document.body.appendChild(modal);
        }
        
        const modalImg = document.getElementById('lightbox-img');
        const captionText = document.getElementById('lightbox-caption');
        const closeBtn = modal.querySelector('.close-lightbox');
        
        function closeModal() {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            setTimeout(() => { if (modalImg) modalImg.src = ''; }, 300);
        }
        
        function openModal(imageSrc, imageTitle) {
            modal.classList.add('show');
            modalImg.src = imageSrc;
            modalImg.alt = imageTitle;
            captionText.textContent = imageTitle;
            document.body.style.overflow = 'hidden';
        }
        
        if (closeBtn) closeBtn.onclick = closeModal;
        
        modal.onclick = function(e) {
            if (e.target === modal) closeModal();
        };
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });
        
        document.querySelectorAll('.project-img[data-lightbox]').forEach(container => {
            const img = container.querySelector('img');
            if (img) {
                container.addEventListener('click', function(e) {
                    if (e.target.closest('a')) return;
                    
                    const imageSrc = this.getAttribute('data-lightbox');
                    const imageTitle = this.getAttribute('data-title') || img.alt || 'Project Image';
                    
                    if (imageSrc) openModal(imageSrc, imageTitle);
                });
            }
        });
    }

    // ========== SKILLS CAROUSEL ==========
    function initSkillsCarousel() {
        const carousel = document.getElementById('skillsCarousel');
        if (!carousel) return;
        
        carousel.addEventListener('mouseenter', () => {
            carousel.style.animationPlayState = 'paused';
        });
        
        carousel.addEventListener('mouseleave', () => {
            carousel.style.animationPlayState = 'running';
        });
        
        carousel.addEventListener('touchstart', () => {
            carousel.style.animationPlayState = 'paused';
        }, { passive: true });
        
        carousel.addEventListener('touchend', () => {
            setTimeout(() => {
                carousel.style.animationPlayState = 'running';
            }, 1500);
        });
    }

    // ========== CHATBOT FUNCTIONALITY ==========
    function initChatbot() {
        const chatbotToggle = document.getElementById('chatbotToggle');
        const chatbotContainer = document.getElementById('chatbotContainer');
        const chatbotClose = document.getElementById('chatbotClose');
        const chatbotMessages = document.getElementById('chatbotMessages');
        const questionButtons = document.querySelectorAll('.question-btn');

        if (!chatbotToggle || !chatbotContainer) return;

        const responses = {
            about: {
                answer: `👋 <strong>About Kairy Ken Magno</strong><br><br>
                Kairy is a passionate <strong>full-stack developer</strong> and creative problem solver from the Philippines. He specializes in building responsive web applications using <strong>Laravel</strong> and modern frontend technologies.<br><br>
                🎯 <strong>Key Highlights:</strong><br>
                • Aspiring full-stack developer<br>
                • Game development enthusiast (Unity)<br>
                • IT support & server management experience<br>
                • Strong focus on clean, maintainable code<br>
                • Continuous learner and team player`
            },
            skills: {
                answer: `💻 <strong>Technical Skills</strong><br><br>
                <strong>Web Development:</strong><br>
                HTML5, CSS3, JavaScript, ReactJS, Bootstrap, Tailwind CSS<br><br>
                <strong>Backend:</strong><br>
                PHP (Laravel), Python, MySQL, MongoDB, REST APIs<br><br>
                <strong>Game Development:</strong><br>
                Unity, C#, Blender (3D Modeling)<br><br>
                <strong>Mobile:</strong><br>
                Flutter, Android Studio<br><br>
                <strong>IT & Hardware:</strong><br>
                Proxmox, Virtual Machines, PC Assembly, Arduino, Networking<br><br>
                <strong>Soft Skills:</strong><br>
                Problem-solving, Team collaboration, Communication, Attention to detail`
            },
            projects: {
                answer: `🚀 <strong>Featured Projects</strong><br><br>
                <strong>🎮 The Finding of Isabel</strong><br>
                Award-winning 3D horror game (Unity/C#). Capstone project featuring URS Binangonan Campus.<br><br>
                <strong>🏀 HoopsHub</strong><br>
                Flutter mobile app for basketball gym management.<br><br>
                <strong>🌾 RizalAgriCultiva</strong><br>
                PHP/MySQL agriculture information system with admin dashboard.<br><br>
                <strong>🤖 AI Resume Analyzer</strong><br>
                n8n + Groq AI automation for recruitment screening.<br><br>
                <strong>⏱️ DTR Management System</strong><br>
                Laravel 11 daily time record with employee/admin portals.`
            },
            experience: {
                answer: `📋 <strong>Experience & Expertise</strong><br><br>
                <strong>Web Development:</strong><br>
                • Building responsive web apps with Laravel<br>
                • Frontend development with ReactJS & Tailwind<br>
                • REST API development & integration<br><br>
                <strong>Game Development:</strong><br>
                • Unity game development with C#<br>
                • 3D modeling with Blender<br><br>
                <strong>IT Support:</strong><br>
                • Server setup & management (Proxmox)<br>
                • PC & server assembly<br>
                • Network configuration basics<br><br>
                <strong>Currently:</strong> Open to opportunities and freelance projects`
            },
            education: {
                answer: `🎓 <strong>Education</strong><br><br>
                Kairy is a recent IT graduate. His capstone project "<strong>The Finding of Isabel</strong>" won Best Software Development Study, showcasing his game development and 3D modeling skills.`
            },
            contact: {
                answer: `📧 <strong>Get in Touch</strong><br><br>
                <strong>Email:</strong> kairymagno@gmail.com<br>
                <strong>Phone:</strong> +63 (915) 957-4952<br>
                <strong>Location:</strong> Philippines<br><br>
                <strong>Social Links:</strong><br>
                • GitHub: github.com/Kairyyyy<br>
                • LinkedIn: linkedin.com/in/kairy-ken-magno<br><br>
                Kairy is always open to collaboration and exciting opportunities!`
            },
            game: {
                answer: `🎮 <strong>Game Development</strong><br><br>
                <strong>Unity Engine:</strong><br>
                • 3D game development<br>
                • C# scripting<br>
                • Level design<br><br>
                <strong>3D Modeling:</strong><br>
                • Blender for asset creation<br>
                • Environment design<br><br>
                <strong>Notable Project:</strong><br>
                "<strong>The Finding of Isabel</strong>" - Award-winning horror game featuring exploration, puzzles, and immersive storytelling.`
            }
        };

        function addMessage(type, content) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chatbot-message ${type}-message`;
            
            const messageContent = document.createElement('div');
            messageContent.className = 'message-content';
            messageContent.innerHTML = `<p>${content}</p>`;
            
            messageDiv.appendChild(messageContent);
            chatbotMessages.appendChild(messageDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        function showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'chatbot-message bot-message';
            typingDiv.innerHTML = `
                <div class="message-content">
                    <div class="typing-indicator">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            `;
            chatbotMessages.appendChild(typingDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            return typingDiv;
        }

        function handleQuestionClick(question) {
            const questionText = question.textContent.trim();
            const questionKey = question.getAttribute('data-question');
            
            questionButtons.forEach(btn => btn.disabled = true);
            addMessage('user', questionText);
            const typingIndicator = showTypingIndicator();
            
            setTimeout(() => {
                typingIndicator.remove();
                
                if (questionKey && responses[questionKey]) {
                    addMessage('bot', responses[questionKey].answer);
                } else {
                    addMessage('bot', "I'm not sure about that. Try asking about Kairy's skills, projects, or how to contact him! 😊");
                }
                
                questionButtons.forEach(btn => btn.disabled = false);
            }, 1200);
        }

        questionButtons.forEach(button => {
            button.addEventListener('click', () => handleQuestionClick(button));
        });

        function openChatbot() {
            chatbotContainer.classList.add('open');
            chatbotToggle.classList.add('active');
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        function closeChatbot() {
            chatbotContainer.classList.remove('open');
            chatbotToggle.classList.remove('active');
        }

        chatbotToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            chatbotContainer.classList.contains('open') ? closeChatbot() : openChatbot();
        });

        chatbotClose.addEventListener('click', function(e) {
            e.stopPropagation();
            closeChatbot();
        });

        document.addEventListener('click', function(e) {
            if (!chatbotContainer.contains(e.target) && !chatbotToggle.contains(e.target) && chatbotContainer.classList.contains('open')) {
                closeChatbot();
            }
        });

        chatbotContainer.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // ========== INITIALIZE ALL FUNCTIONS ==========
    function initAll() {
        initThemeManager();
        initProfileImage();
        initMobileNav();
        initContactForm();
        initSmoothScroll();
        initScrollAnimations();
        updateFooterYear();
        initTypingAnimation();
        initImageSlideshow();
        initLightbox();
        initSkillsCarousel();
        initChatbot();
        
        console.log('✅ Portfolio initialized successfully!');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();

// ========== PARTICLE BACKGROUND EFFECT ==========
function createParticles() {
    const existingParticles = document.querySelector('.particles');
    if (existingParticles) {
        existingParticles.remove();
    }
    
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.insertBefore(particlesContainer, document.body.firstChild);
    
    // Check if current theme is light (for particle count and opacity)
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const isLight = currentTheme === 'light';
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? (isLight ? 8 : 12) : (isLight ? 18 : 30);
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 2.5 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 12 + 8}s`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.opacity = Math.random() * (isLight ? 0.1 : 0.18) + (isLight ? 0.02 : 0.04);
        
        particlesContainer.appendChild(particle);
    }
}

// Initialize particles
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createParticles);
} else {
    createParticles();
}

// Handle resize with debounce
let lastWidth = window.innerWidth;
let resizeTimeout;

window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (Math.abs(window.innerWidth - lastWidth) > 150) {
            createParticles();
            lastWidth = window.innerWidth;
        }
    }, 400);
});