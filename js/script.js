// script.js - Professional Portfolio with Dual Theme
document.addEventListener('DOMContentLoaded', () => {
    // ========== THEME MANAGEMENT WITH DROPDOWN ==========
    function initThemeManager() {
        const themeDropdownBtn = document.getElementById('themeDropdownBtn');
        const themeDropdownMenu = document.getElementById('themeDropdownMenu');
        const themeOptions = document.querySelectorAll('.theme-option');
        
        // Available themes
        const themes = ['dark-blue', 'light', 'indigo', 'emerald', 'monochrome'];
        
        // Get saved theme or default to dark-blue
        const getCurrentTheme = () => {
            const savedTheme = localStorage.getItem('portfolio-theme');
            return savedTheme && themes.includes(savedTheme) ? savedTheme : 'dark-blue';
        };
        
        let currentTheme = getCurrentTheme();
        
        // Apply theme
        const applyTheme = (theme) => {
            // Remove all theme attributes first
            themes.forEach(t => {
                if (t === 'dark-blue') {
                    document.documentElement.removeAttribute('data-theme');
                }
            });
            
            // Apply the selected theme
            if (theme !== 'dark-blue') {
                document.documentElement.setAttribute('data-theme', theme);
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
            
            // Update active state in dropdown
            themeOptions.forEach(option => {
                option.classList.remove('active');
                if (option.getAttribute('data-theme') === theme) {
                    option.classList.add('active');
                }
            });
            
            localStorage.setItem('portfolio-theme', theme);
            currentTheme = theme;
            
            // Recreate particles for the new theme
            if (typeof createParticles === 'function') {
                createParticles();
            }
        };
        
        // Initialize theme
        applyTheme(currentTheme);
        
        // Toggle dropdown
        if (themeDropdownBtn && themeDropdownMenu) {
            themeDropdownBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                themeDropdownMenu.classList.toggle('active');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!themeDropdownMenu.contains(e.target) && !themeDropdownBtn.contains(e.target)) {
                    themeDropdownMenu.classList.remove('active');
                }
            });
            
            // Prevent dropdown from closing when clicking inside
            themeDropdownMenu.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
        
        // Theme option click handlers
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.getAttribute('data-theme');
                applyTheme(theme);
                // Close dropdown after selection
                if (themeDropdownMenu) {
                    themeDropdownMenu.classList.remove('active');
                }
            });
        });
        
        console.log('✅ Theme manager initialized! Current theme:', currentTheme);
    }

    // Initialize on DOM load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThemeManager);
    } else {
        initThemeManager();
    }
    
    // ========== PROFILE IMAGE HANDLING ==========
    const profileImg = document.getElementById('profileImg');
    if (profileImg) {
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
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileBtn.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
    
    // ========== EMAILJS INITIALIZATION ==========
    (function() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init('qZDmA1imzHhCAtCrQ');
        }
    })();
    
    // ========== CONTACT FORM ==========
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (contactForm) {
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
            
            const serviceID = 'service_yfs314h';
            const templateID = 'template_gym648t';
            
            const templateParams = {
                from_email: userEmail,
                subject: userSubject,
                message: userMessage,
                to_email: 'kairymagno@gmail.com'
            };
            
            emailjs.send(serviceID, templateID, templateParams)
                .then(function(response) {
                    formStatus.innerHTML = '<span style="color: #10b981;">✓ Message sent successfully! I\'ll get back to you soon.</span>';
                    contactForm.reset();
                    setTimeout(() => {
                        formStatus.innerHTML = '';
                    }, 5000);
                })
                .catch(function(error) {
                    console.error('Email error:', error);
                    formStatus.innerHTML = '<span style="color: #ef4444;">❌ Failed to send. Please email me directly at kairymagno@gmail.com</span>';
                    setTimeout(() => {
                        formStatus.innerHTML = '';
                    }, 5000);
                })
                .finally(() => {
                    sendBtn.innerHTML = originalText;
                    sendBtn.disabled = false;
                });
        });
    }
    
    // ========== SMOOTH SCROLLING ==========
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
    
    // ========== INTERSECTION OBSERVER FOR FADE-IN ==========
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
    
    // ========== UPDATE FOOTER YEAR ==========
    const footerPara = document.querySelector('.footer p');
    if (footerPara) {
        const currentYear = new Date().getFullYear();
        footerPara.innerHTML = footerPara.innerHTML.replace(/2026|2025/g, currentYear);
    }
    
    // ========== TYPING ANIMATION ==========
    const roles = ["Web Developer", "Game Developer", "IT Support Specialist"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    const typedRoleElement = document.getElementById('typedRole');
    
    function typeEffect() {
        if (!typedRoleElement) return;
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
    
    if (typedRoleElement) {
        typedRoleElement.innerHTML = '<span class="typed-cursor">|</span>';
        setTimeout(typeEffect, 600);
    }
    
    // ========== IMAGE SLIDESHOW ==========
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
    
    const preloadedImages = [];
    function preloadImages() {
        images.forEach((src, index) => {
            const img = new Image();
            img.onload = () => {
                preloadedImages[index] = img;
            };
            img.onerror = () => {
                // Skip failed images
                preloadedImages[index] = null;
            };
            img.src = src;
        });
    }
    
    function changeImage() {
        if (!profileImgSlide || isTransitioning) return;
        if (preloadedImages.length === 0) return;
        
        isTransitioning = true;
        profileImgSlide.style.opacity = '0';
        
        setTimeout(() => {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            
            // Try next image if current one failed to load
            let attempts = 0;
            while (!preloadedImages[currentImageIndex] && attempts < images.length) {
                currentImageIndex = (currentImageIndex + 1) % images.length;
                attempts++;
            }
            
            if (preloadedImages[currentImageIndex]) {
                profileImgSlide.src = preloadedImages[currentImageIndex].src;
            }
            
            profileImgSlide.style.opacity = '1';
            
            setTimeout(() => {
                isTransitioning = false;
            }, 500);
        }, 400);
    }
    
    if (profileImgSlide && profilePlaceholder) {
        preloadImages();
        if (images.length > 1) {
            slideshowInterval = setInterval(changeImage, 4000);
        }
        
        // Pause slideshow on hover
        profilePlaceholder.addEventListener('mouseenter', () => {
            if (slideshowInterval) clearInterval(slideshowInterval);
        });
        
        profilePlaceholder.addEventListener('mouseleave', () => {
            if (images.length > 1) {
                slideshowInterval = setInterval(changeImage, 4000);
            }
        });
    }
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
        }
    });
    
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
            setTimeout(() => {
                if (modalImg) modalImg.src = '';
            }, 300);
        }
        
        // Close button
        if (closeBtn) {
            closeBtn.onclick = closeModal;
        }
        
        // Click outside image
        modal.onclick = function(e) {
            if (e.target === modal) {
                closeModal();
            }
        };
        
        // Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });
        
        // Attach to project images with data-lightbox attribute
        document.querySelectorAll('.project-img[data-lightbox]').forEach(container => {
            const img = container.querySelector('img');
            if (img) {
                container.addEventListener('click', function(e) {
                    // Don't open if clicking a link inside
                    if (e.target.closest('a')) return;
                    
                    const imageSrc = this.getAttribute('data-lightbox');
                    const imageTitle = this.getAttribute('data-title') || img.alt || 'Project Image';
                    
                    if (imageSrc) {
                        modal.classList.add('show');
                        modalImg.src = imageSrc;
                        modalImg.alt = imageTitle;
                        captionText.textContent = imageTitle;
                        document.body.style.overflow = 'hidden';
                    }
                });
            }
        });
    }
    
    initLightbox();
    
    console.log('✅ Portfolio initialized successfully!');
});

// ========== PARTICLE BACKGROUND EFFECT ==========
function createParticles() {
    // Remove existing particles
    const existingParticles = document.querySelector('.particles');
    if (existingParticles) {
        existingParticles.remove();
    }
    
    // Create new particles container
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.insertBefore(particlesContainer, document.body.firstChild);
    
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? (isDark ? 12 : 8) : (isDark ? 30 : 18);
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 2.5 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 12 + 8}s`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.opacity = Math.random() * (isDark ? 0.18 : 0.1) + (isDark ? 0.04 : 0.02);
        
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

// ========== SKILLS CAROUSEL ==========
function initSkillsCarousel() {
    const carousel = document.getElementById('skillsCarousel');
    if (!carousel) return;
    
    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
        carousel.style.animationPlayState = 'paused';
    });
    
    carousel.addEventListener('mouseleave', () => {
        carousel.style.animationPlayState = 'running';
    });
    
    // Pause on touch for mobile
    carousel.addEventListener('touchstart', () => {
        carousel.style.animationPlayState = 'paused';
    }, { passive: true });
    
    carousel.addEventListener('touchend', () => {
        setTimeout(() => {
            carousel.style.animationPlayState = 'running';
        }, 1500);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSkillsCarousel);
} else {
    initSkillsCarousel();
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

    chatbotToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        chatbotContainer.classList.contains('open') ? closeChatbot() : openChatbot();
    });

    chatbotClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeChatbot();
    });

    document.addEventListener('click', (e) => {
        if (!chatbotContainer.contains(e.target) && !chatbotToggle.contains(e.target) && chatbotContainer.classList.contains('open')) {
            closeChatbot();
        }
    });

    chatbotContainer.addEventListener('click', (e) => e.stopPropagation());
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
} else {
    initChatbot();
}