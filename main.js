// Form validation
document.addEventListener('DOMContentLoaded', function() {
    // Form validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value;
            
            // Validate input fields
            if (!name || !email || !service || !message) {
                alert('Please fill out all required fields');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Phone validation (optional field)
            if (phone) {
                const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
                if (!phoneRegex.test(phone)) {
                    alert('Please enter a valid phone number');
                    return;
                }
            }
            
            // If all validations pass, simulate form submission
            alert('Thank you for your message! We will contact you soon.');
            contactForm.reset();
        });
    }

    // FAQ toggle functionality
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        });
    }

    // Mobile navigation toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('nav ul');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            menuToggle.classList.toggle('active');
        });
    }

    // Gallery image modal
    const galleryItems = document.querySelectorAll('.gallery-item img');
    if (galleryItems.length > 0) {
        const modal = document.getElementById('image-modal');
        const modalImg = document.getElementById('modal-img');
        const closeModal = document.querySelector('.close-modal');
        
        galleryItems.forEach(img => {
            img.addEventListener('click', () => {
                modal.style.display = 'flex';
                modalImg.src = img.src;
            });
        });
        
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        // Close modal when clicking outside image
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('show')) {
                    navLinks.classList.remove('show');
                    if (menuToggle) menuToggle.classList.remove('active');
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for animations
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
});
