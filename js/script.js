// script.js - Clean version with typing animation including cursor
document.addEventListener('DOMContentLoaded', () => {
    // ---------- THEME MANAGEMENT ----------
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    const getCurrentTheme = () => {
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme) return savedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };
    
    let currentTheme = getCurrentTheme();
    
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        localStorage.setItem('portfolio-theme', theme);
    };
    
    applyTheme(currentTheme);
    
    themeToggleBtn.addEventListener('click', () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        currentTheme = newTheme;
        applyTheme(currentTheme);
    });
    
    // ---------- PROFILE IMAGE HANDLING ----------
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
                    background: linear-gradient(135deg, #2563eb, #1e40af);
                    color: white;
                    font-size: 3.5rem;
                `;
                fallbackDiv.innerHTML = '<i class="fas fa-user-circle"></i>';
                fallbackDiv.className = 'fallback-user';
                parent.appendChild(fallbackDiv);
            }
        });
        
        if (!profileImg.src || profileImg.src.includes('null')) {
            profileImg.src = 'https://ui-avatars.com/api/?background=2563eb&color=fff&bold=true&size=300&name=Kairy+Ken';
        }
    }
    
    // ---------- MOBILE NAVIGATION ----------
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
                icon.style.transition = 'transform 0.3s ease';
                icon.style.transform = 'rotate(90deg)';
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                icon.style.transform = 'rotate(0deg)';
            }
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    icon.style.transform = 'rotate(0deg)';
                }
            });
        });
    }
    
    // ---------- INITIALIZE EMAILJS ----------
    emailjs.init('D7vkLWtydyz-mfrO5');
    
    // ---------- CONTACT FORM ----------
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const sendBtn = document.getElementById('sendBtn');
            const originalText = sendBtn.innerHTML;
            sendBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Sending...';
            sendBtn.disabled = true;
            
            const userEmail = document.getElementById('userEmail').value;
            const userSubject = document.getElementById('userSubject').value;
            const userMessage = document.getElementById('userMessage').value;
            
            const serviceID = 'service_juqps7v';
            const templateID = 'template_7rjf1tk';
            
            const templateParams = {
                from_email: userEmail,
                subject: userSubject,
                message: userMessage,
                to_email: 'kairykenm@gmail.com'
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
                    formStatus.innerHTML = '<span style="color: #ef4444;">❌ Failed to send. Please email me directly at kairykenm@gmail.com</span>';
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
    
    // ---------- SMOOTH SCROLLING ----------
    document.querySelectorAll('.nav-link, .btn-primary, .btn-outline').forEach(anchor => {
        if (anchor.getAttribute('href') && anchor.getAttribute('href').startsWith('#')) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId !== '#') {
                    const targetElem = document.querySelector(targetId);
                    if (targetElem) {
                        e.preventDefault();
                        targetElem.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        }
    });
    
    // ---------- INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS ----------
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
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
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    document.querySelectorAll('.skill-category, .project-card, .about-container').forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(element);
    });
    
    // Update footer year
    const footerPara = document.querySelector('.footer p');
    if (footerPara) {
        const currentYear = new Date().getFullYear();
        footerPara.innerHTML = footerPara.innerHTML.replace('2026', currentYear);
    }
    
    console.log('Portfolio ready!');
    
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
                setTimeout(typeEffect, 50);
            } else {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                setTimeout(typeEffect, 300);
            }
        } else {
            if (charIndex < currentRole.length) {
                charIndex++;
                typedRoleElement.innerHTML = currentRole.substring(0, charIndex) + '<span class="typed-cursor">|</span>';
                setTimeout(typeEffect, 150);
            } else {
                typedRoleElement.innerHTML = currentRole;
                isPaused = true;
                setTimeout(() => {
                    isPaused = false;
                    isDeleting = true;
                    typeEffect();
                }, 1500);
            }
        }
    }
    
    if (typedRoleElement) {
        typedRoleElement.innerHTML = '<span class="typed-cursor">|</span>';
        setTimeout(typeEffect, 500);
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
    
    let pulseRing = document.querySelector('.pulse-ring');
    if (!pulseRing && profilePlaceholder) {
        pulseRing = document.createElement('div');
        pulseRing.className = 'pulse-ring';
        profilePlaceholder.appendChild(pulseRing);
    }
    
    const preloadedImages = [];
    function preloadImages() {
        images.forEach((src, index) => {
            const img = new Image();
            img.onload = () => {
                preloadedImages[index] = img;
            };
            img.src = src;
        });
    }
    
    function showPulseEffect() {
        if (!pulseRing) return;
        pulseRing.classList.remove('active');
        void pulseRing.offsetWidth;
        pulseRing.classList.add('active');
        
        if (profilePlaceholder) {
            profilePlaceholder.classList.add('ripple-effect');
            setTimeout(() => {
                profilePlaceholder.classList.remove('ripple-effect');
            }, 800);
        }
        
        if (profileImgSlide) {
            profileImgSlide.classList.add('pulse-glow');
            setTimeout(() => {
                profileImgSlide.classList.remove('pulse-glow');
            }, 600);
            
            profileImgSlide.classList.add('shine-effect');
            setTimeout(() => {
                profileImgSlide.classList.remove('shine-effect');
            }, 800);
        }
    }
    
    function changeImage() {
        if (!profileImgSlide || isTransitioning) return;
        showPulseEffect();
        
        setTimeout(() => {
            isTransitioning = true;
            profileImgSlide.style.opacity = '0';
            
            setTimeout(() => {
                currentImageIndex = (currentImageIndex + 1) % images.length;
                if (preloadedImages[currentImageIndex]) {
                    profileImgSlide.src = preloadedImages[currentImageIndex].src;
                } else {
                    profileImgSlide.src = images[currentImageIndex];
                }
                profileImgSlide.style.opacity = '1';
                
                setTimeout(() => {
                    isTransitioning = false;
                }, 500);
            }, 500);
        }, 400);
    }
    
    if (profileImgSlide && profilePlaceholder) {
        preloadImages();
        profileImgSlide.src = images[0];
        profileImgSlide.style.transition = 'opacity 0.5s ease-in-out';
        profileImgSlide.style.opacity = '1';
        slideshowInterval = setInterval(changeImage, 5000);
    }
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
        }
    });
    
    // ========== CERTIFICATE LIGHTBOX FUNCTIONALITY ==========
    function initLightbox() {
        // Create modal elements if they don't exist
        let modal = document.getElementById('lightbox-modal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'lightbox-modal';
            modal.className = 'lightbox-modal';
            modal.innerHTML = `
                <span class="close-lightbox">&times;</span>
                <img class="lightbox-content" id="lightbox-img">
                <div class="lightbox-caption" id="lightbox-caption"></div>
            `;
            document.body.appendChild(modal);
        }
        
        const modalImg = document.getElementById('lightbox-img');
        const captionText = document.getElementById('lightbox-caption');
        const closeBtn = modal.querySelector('.close-lightbox');
        
        // Get all certificate images
        const certImages = document.querySelectorAll('.certificate-image');
        
        certImages.forEach(container => {
            // Remove existing listeners to avoid duplicates
            container.removeEventListener('click', lightboxClickHandler);
            // Add click listener
            container.addEventListener('click', lightboxClickHandler);
            
            function lightboxClickHandler(e) {
                const img = container.querySelector('img');
                if (img && img.src) {
                    modal.classList.add('show');
                    modalImg.src = img.src;
                    modalImg.alt = img.alt || 'Certificate Image';
                    captionText.textContent = img.alt || 'Certificate Image';
                    
                    // Prevent body scroll when modal is open
                    document.body.style.overflow = 'hidden';
                }
            }
        });
        
        // Close modal function
        function closeModal() {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            setTimeout(() => {
                modalImg.src = '';
            }, 300);
        }
        
        // Close button click
        if (closeBtn) {
            closeBtn.removeEventListener('click', closeModal);
            closeBtn.addEventListener('click', closeModal);
        }
        
        // Close when clicking outside the image
        modal.removeEventListener('click', modalOutsideClick);
        modal.addEventListener('click', modalOutsideClick);
        
        function modalOutsideClick(e) {
            if (e.target === modal) {
                closeModal();
            }
        }
        
        // Close with Escape key
        document.removeEventListener('keydown', escapeKeyHandler);
        document.addEventListener('keydown', escapeKeyHandler);
        
        function escapeKeyHandler(e) {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        }
    }
    
    // Initialize lightbox
    initLightbox();
    
    // Re-initialize lightbox if new certificates are added dynamically (optional)
    // For mutation observer to watch for dynamically added certificate images
    const observerLightbox = new MutationObserver(() => {
        initLightbox();
    });
    
    observerLightbox.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// ========== PARTICLE BACKGROUND EFFECT ==========
function createParticles() {
    const existingParticles = document.querySelector('.particles');
    if (existingParticles) {
        existingParticles.remove();
    }
    
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.insertBefore(particlesContainer, document.body.firstChild);
    
    const particleCount = window.innerWidth < 1024 ? 30 : 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 12 + 8}s`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.opacity = Math.random() * 0.3 + 0.1;
        
        particlesContainer.appendChild(particle);
    }
}

createParticles();

let lastWidth = window.innerWidth;
window.addEventListener('resize', () => {
    if ((lastWidth >= 768 && window.innerWidth < 768) || 
        (lastWidth < 768 && window.innerWidth >= 768)) {
        createParticles();
        lastWidth = window.innerWidth;
    }
});

// Debounce resize events for better performance
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if ((lastWidth >= 768 && window.innerWidth < 768) || 
            (lastWidth < 768 && window.innerWidth >= 768)) {
            createParticles();
            lastWidth = window.innerWidth;
        }
    }, 250);
});

// ========== CHATBOT FUNCTIONALITY ==========
function initChatbot() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotContainer = document.getElementById('chatbotContainer');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotQuestions = document.getElementById('chatbotQuestions');
    const questionButtons = document.querySelectorAll('.question-btn');

    // Check if elements exist
    if (!chatbotToggle || !chatbotContainer) return;

    // Chatbot responses database
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
            <strong>Programming:</strong><br>
            Java (OOP), Python Scripting<br><br>
            <strong>Soft Skills:</strong><br>
            Problem-solving, Team collaboration, Communication, Attention to detail`
        },
        projects: {
            answer: `🚀 <strong>Featured Projects</strong><br><br>
            <strong>🎮 The Finding of Isabel</strong><br>
            A 3D horror game built with Unity and C# as a capstone project. Features a 3D model of the University of Rizal System campus with exploration, puzzles, and immersive storytelling.<br>
            <em>Tech: C#, Unity, Blender</em><br><br>
            <strong>🏀 HOOPS Hub</strong><br>
            Manufacturing software designed to help businesses monitor production processes and improve workflow organization.<br>
            <em>Tech: Flutter, Android Studio</em><br><br>
            <strong>🌐 Web Applications</strong><br>
            Various web development projects using Laravel framework with responsive design and modern UI/UX principles.`
        },
        experience: {
            answer: `📋 <strong>Experience & Expertise</strong><br><br>
            <strong>Web Development:</strong><br>
            • Building responsive web apps with Laravel<br>
            • Frontend development with ReactJS<br>
            • REST API development & integration<br><br>
            <strong>Game Development:</strong><br>
            • Unity game development with C#<br>
            • 3D modeling with Blender<br>
            • Game design & storytelling<br><br>
            <strong>IT Support:</strong><br>
            • Server setup & management (Proxmox)<br>
            • PC & server assembly<br>
            • Network configuration basics<br>
            • Hardware troubleshooting<br><br>
            <strong>Currently:</strong> Open to opportunities and freelance projects`
        },
        education: {
            answer: `🎓 <strong>Education</strong><br><br>
            Kairy is a recent graduate with a degree in Information Technology. During his academic journey, he developed strong foundations in:<br><br>
            • Web development & programming<br>
            • Database management<br>
            • Software engineering principles<br>
            • Game development<br>
            • IT infrastructure<br><br>
            His capstone project "<strong>The Finding of Isabel</strong>" showcases his game development and 3D modeling skills, featuring a detailed recreation of the University of Rizal System campus.`
        },
        contact: {
            answer: `📧 <strong>Get in Touch with Kairy</strong><br><br>
            <strong>Email:</strong><br>
            kairykenm@gmail.com<br><br>
            <strong>Phone:</strong><br>
            +63 (915) 957-4952<br><br>
            <strong>Location:</strong><br>
            Philippines<br><br>
            <strong>Social Links:</strong><br>
            • GitHub: github.com/Kairyyyy<br>
            • LinkedIn: linkedin.com/in/kairy-ken-magno<br>
            • Facebook: facebook.com/kairy<br><br>
            Kairy is always open to collaboration, freelance work, and exciting opportunities. Don't hesitate to reach out!`
        },
        certificates: {
            answer: `📜 <strong>Certificates & Achievements</strong><br><br>
            Kairy has earned various certificates demonstrating his commitment to continuous learning and professional development.<br><br>
            Check out the <strong>Certificates section</strong> on this portfolio to view his latest certifications in web development, programming, and other technical skills.<br><br>
            <em>💡 Tip: Click on any certificate image to view it in full size!</em>`
        },
        game: {
            answer: `🎮 <strong>Game Development Journey</strong><br><br>
            Kairy is passionate about game development, specializing in:<br><br>
            <strong>Unity Engine:</strong><br>
            • 3D game development<br>
            • C# scripting<br>
            • Game mechanics & physics<br>
            • Level design<br><br>
            <strong>3D Modeling:</strong><br>
            • Blender for asset creation<br>
            • Environment design<br>
            • Character modeling<br><br>
            <strong>Notable Project:</strong><br>
            "<strong>The Finding of Isabel</strong>" - A horror game featuring exploration, puzzles, and immersive storytelling, built as a capstone project.<br><br>
            <em>Watch the gameplay on YouTube!</em>`
        }
    };

    // Function to add a message to the chat
    function addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${type}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = `<p>${content}</p>`;
        
        messageDiv.appendChild(messageContent);
        chatbotMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Function to show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message bot-message typing-message';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        return typingDiv;
    }

    // Function to remove typing indicator
    function removeTypingIndicator(indicator) {
        if (indicator && indicator.parentNode) {
            indicator.remove();
        }
    }

    // Function to handle question click
    function handleQuestionClick(question) {
        const questionText = question.textContent.trim();
        
        // Disable all question buttons temporarily
        questionButtons.forEach(btn => btn.disabled = true);
        
        // Add user message
        addMessage('user', questionText);
        
        // Show typing indicator
        const typingIndicator = showTypingIndicator();
        
        // Get the question key from data attribute
        const questionKey = question.getAttribute('data-question');
        
        // Simulate delay for natural feeling
        setTimeout(() => {
            // Remove typing indicator
            removeTypingIndicator(typingIndicator);
            
            // Get response
            if (questionKey && responses[questionKey]) {
                addMessage('bot', responses[questionKey].answer);
            } else {
                addMessage('bot', "I'm not sure about that. Try asking about Kairy's skills, projects, or how to contact him! 😊");
            }
            
            // Re-enable question buttons
            questionButtons.forEach(btn => btn.disabled = false);
        }, 1500);
    }

    // Add click listeners to question buttons
    questionButtons.forEach(button => {
        button.addEventListener('click', function() {
            handleQuestionClick(this);
        });
    });

    // Toggle chatbot open/close
    chatbotToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        const isOpen = chatbotContainer.classList.contains('open');
        
        if (isOpen) {
            closeChatbot();
        } else {
            openChatbot();
        }
    });

    // Close button
    chatbotClose.addEventListener('click', function(e) {
        e.stopPropagation();
        closeChatbot();
    });

    // Close when clicking outside
    document.addEventListener('click', function(e) {
        if (!chatbotContainer.contains(e.target) && 
            !chatbotToggle.contains(e.target) && 
            chatbotContainer.classList.contains('open')) {
            closeChatbot();
        }
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

    // Prevent chatbot container clicks from closing
    chatbotContainer.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    console.log('Chatbot initialized!');
}

// Initialize chatbot when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
} else {
    initChatbot();
}