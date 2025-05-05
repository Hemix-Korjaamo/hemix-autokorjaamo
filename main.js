// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('show');
        // Toggle aria-expanded for accessibility
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
    });

    // Language Switcher
    const languageButtons = document.querySelectorAll('.language-btn');
    let currentLang = localStorage.getItem('language') || 'fi'; // Default to Finnish

    // Set initial language
    setLanguage(currentLang);

    languageButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentLang = button.getAttribute('data-lang');
            localStorage.setItem('language', currentLang); // Persist language choice
            setLanguage(currentLang);
            languageButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    function setLanguage(lang) {
        // Update all elements with data-fi and data-en attributes
        document.querySelectorAll('[data-fi][data-en]').forEach(element => {
            element.textContent = element.getAttribute(`data-${lang}`);
            // Update alt text for images if applicable
            if (element.tagName === 'IMG' && element.hasAttribute(`data-${lang}`)) {
                element.alt = element.getAttribute(`data-${lang}`);
            }
        });
        // Update select options separately to preserve their values
        document.querySelectorAll('select option').forEach(option => {
            if (option.hasAttribute(`data-${lang}`)) {
                option.textContent = option.getAttribute(`data-${lang}`);
            }
        });
        // Update HTML lang attribute for accessibility
        document.documentElement.lang = lang;
    }

    // Scroll Animations
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    animateElements.forEach(element => observer.observe(element));

    // FAQ Toggle with Animation
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            faqItems.forEach(i => {
                i.classList.remove('open');
                i.querySelector('.faq-answer').style.maxHeight = '0';
            }); // Close all
            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px'; // Animate to content height
            }
        });
    });

    // Gallery Modal
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeModal = document.querySelector('.close-modal');
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');
    let currentIndex = 0;

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            openModal();
        });
    });

    function openModal() {
        modal.style.display = 'flex';
        // Since placeholders are used, we'll simulate an image source
        modalImg.src = galleryItems[currentIndex].querySelector('.gallery-placeholder') ? '' : galleryItems[currentIndex].querySelector('img').src;
        modalImg.alt = galleryItems[currentIndex].querySelector('.gallery-caption h4').textContent;
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        modal.focus(); // For accessibility
    }

    function closeModalFunc() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        galleryItems[currentIndex].focus(); // Return focus to the last viewed item
    }

    closeModal.addEventListener('click', closeModalFunc);

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        modalImg.src = galleryItems[currentIndex].querySelector('.gallery-placeholder') ? '' : galleryItems[currentIndex].querySelector('img').src;
        modalImg.alt = galleryItems[currentIndex].querySelector('.gallery-caption h4').textContent;
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        modalImg.src = galleryItems[currentIndex].querySelector('.gallery-placeholder') ? '' : galleryItems[currentIndex].querySelector('img').src;
        modalImg.alt = galleryItems[currentIndex].querySelector('.gallery-caption h4').textContent;
    });

    // Keyboard Navigation for Modal
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModalFunc();
        if (e.key === 'ArrowRight') nextBtn.click();
        if (e.key === 'ArrowLeft') prevBtn.click();
    });

    // Close modal when clicking outside the image
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModalFunc();
    });

    // Contact Form Validation
    const contactForm = document.getElementById('contact-form');
    const formErrors = document.getElementById('form-errors');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const errors = [];

        // Sanitize inputs (basic example to prevent XSS)
        const sanitizeInput = (input) => {
            const div = document.createElement('div');
            div.textContent = input;
            return div.innerHTML;
        };

        const name = sanitizeInput(contactForm.name.value.trim());
        const email = sanitizeInput(contactForm.email.value.trim());
        const phone = sanitizeInput(contactForm.phone.value.trim());
        const service = contactForm.service.value;
        const message = sanitizeInput(contactForm.message.value.trim());

        // Validation
        if (name.length < 2) {
            errors.push(currentLang === 'fi' ? 'Nimi on liian lyhyt.' : 'Name is too short.');
        }

        const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        if (!emailPattern.test(email)) {
            errors.push(currentLang === 'fi' ? 'Syötä kelvollinen sähköpostiosoite.' : 'Please enter a valid email address.');
        }

        const phonePattern = /[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}/;
        if (phone && !phonePattern.test(phone)) {
            errors.push(currentLang === 'fi' ? 'Syötä kelvollinen puhelinnumero.' : 'Please enter a valid phone number.');
        }

        if (!service) {
            errors.push(currentLang === 'fi' ? 'Valitse palvelu.' : 'Please select a service.');
        }

        if (message.length < 10) {
            errors.push(currentLang === 'fi' ? 'Viesti on liian lyhyt.' : 'Message is too short.');
        }

        if (errors.length > 0) {
            formErrors.textContent = errors.join(' ');
            formErrors.style.display = 'block';
            formErrors.focus(); // For accessibility
        } else {
            formErrors.style.display = 'none';
            // Simulate form submission (replace with actual backend logic)
            console.log({ name, email, phone, service, message });
            alert(currentLang === 'fi' ? 'Viesti lähetetty onnistuneesti!' : 'Message sent successfully!');
            contactForm.reset();
        }
    });
});