// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('show');
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
    });

    // Language Switcher
    const languageButtons = document.querySelectorAll('.language-btn');
    let currentLang = 'fi'; // Default to Finnish

    setLanguage(currentLang);
    document.querySelector('.language-btn[data-lang="fi"]').classList.add('active');

    languageButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentLang = button.getAttribute('data-lang');
            localStorage.setItem('language', currentLang);
            setLanguage(currentLang);
            languageButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    function setLanguage(lang) {
        document.querySelectorAll('[data-fi][data-en]').forEach(element => {
            element.textContent = element.getAttribute(`data-${lang}`);
            if (element.tagName === 'IMG' && element.hasAttribute(`data-${lang}`)) {
                element.alt = element.getAttribute(`data-${lang}`);
            }
        });
        document.querySelectorAll('.gallery-caption h4, .gallery-caption p').forEach(element => {
            element.textContent = element.getAttribute(`data-${lang}`);
        });
        document.querySelectorAll('select option').forEach(option => {
            if (option.hasAttribute(`data-${lang}`)) {
                option.textContent = option.getAttribute(`data-${lang}`);
            }
        });
        document.querySelectorAll('.form-group label').forEach(label => {
            label.textContent = label.getAttribute(`data-${lang}`);
        });
        document.querySelectorAll('.form-group input[placeholder]').forEach(input => {
            input.placeholder = input.getAttribute(`data-${lang}`) || input.placeholder;
        });
        document.documentElement.lang = lang;
    }

    // Scroll Animations
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = { threshold: 0.1 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
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
            });
            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
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

    // Ensure modal is hidden on page load
    modal.style.display = 'none';

    galleryItems.forEach((item, index) => {
        const image = item.querySelector('.gallery-image');
        image.addEventListener('click', () => {
            currentIndex = index;
            openModal();
        });
    });

    function openModal() {
        try {
            modal.style.display = 'flex';
            const imgElement = galleryItems[currentIndex].querySelector('.gallery-image');
            if (!imgElement) throw new Error('No image found');
            modalImg.src = imgElement.src;
            modalImg.alt = imgElement.getAttribute(`data-${currentLang}`);
            document.body.style.overflow = 'hidden';
            modal.focus();
            // Dynamically adjust image size
            modalImg.onload = () => {
                const naturalWidth = modalImg.naturalWidth;
                const naturalHeight = modalImg.naturalHeight;
                const viewportWidth = window.innerWidth * 0.9; // 90% of viewport
                const viewportHeight = window.innerHeight * 0.9;
                const aspectRatio = naturalWidth / naturalHeight;
                if (naturalWidth > viewportWidth || naturalHeight > viewportHeight) {
                    if (viewportWidth / aspectRatio <= viewportHeight) {
                        modalImg.style.width = '100%';
                        modalImg.style.height = 'auto';
                    } else {
                        modalImg.style.width = 'auto';
                        modalImg.style.height = '100%';
                    }
                } else {
                    modalImg.style.width = 'auto';
                    modalImg.style.height = 'auto';
                }
            };
        } catch (error) {
            console.error('Error opening modal:', error);
            closeModalFunc();
        }
    }

    function closeModalFunc() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        galleryItems[currentIndex].focus();
    }

    closeModal.addEventListener('click', closeModalFunc);

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        const imgElement = galleryItems[currentIndex].querySelector('.gallery-image');
        modalImg.src = imgElement.src;
        modalImg.alt = imgElement.getAttribute(`data-${currentLang}`);
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        const imgElement = galleryItems[currentIndex].querySelector('.gallery-image');
        modalImg.src = imgElement.src;
        modalImg.alt = imgElement.getAttribute(`data-${currentLang}`);
    });

    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModalFunc();
        if (e.key === 'ArrowRight') nextBtn.click();
        if (e.key === 'ArrowLeft') prevBtn.click();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModalFunc();
    });

    // Contact Form Validation
    const contactForm = document.getElementById('contact-form');
    const formErrors = document.getElementById('form-errors');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const errors = [];

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
            formErrors.focus();
        } else {
            formErrors.style.display = 'none';
            contactForm.submit();
            alert(currentLang === 'fi' ? 'Viesti lähetetty onnistuneesti!' : 'Message sent successfully!');
            contactForm.reset();
        }
    });
});