// ===== NAVIGATION TOGGLE =====
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
});

// Close mobile menu when a link is clicked
const navLinks = navMenu.querySelectorAll('a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const navbar = document.querySelector('.navbar');
    if (!navbar.contains(e.target)) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
    }
});

// ===== SCROLL ANIMATIONS =====
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

// Observe all section elements for fade-in on scroll
document.querySelectorAll('.section, .timeline-item, .skill-badge, .competency-card, .service-card, .project-card, .certificate-card, .why-card, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// ===== FORM HANDLING =====
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Basic validation
        if (!validateForm(data)) {
            showNotification('Please fill in all fields correctly.', 'error');
            return;
        }

        const recipient = 'chisomjil40@gmail.com';
        const subject = `Portfolio Inquiry: ${data.subject.trim()}`;
        const body = [
            `Name: ${data.name.trim()}`,
            `Email: ${data.email.trim()}`,
            `Subject: ${data.subject.trim()}`,
            '',
            `Message: ${data.message.trim()}`
        ].join('\n');

        const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        contactForm.reset();
        window.location.href = mailtoLink;

        console.log('Form submitted:', data);
    });
}

function validateForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!data.name || !data.name.trim()) return false;
    if (!data.email || !emailRegex.test(data.email)) return false;
    if (!data.subject || !data.subject.trim()) return false;
    if (!data.message || !data.message.trim()) return false;

    return true;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 500;
        max-width: 400px;
    `;

    document.body.appendChild(notification);

    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ===== SMOOTH SCROLL BEHAVIOR =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 50) {
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
    } else {
        navbar.style.boxShadow = 'none';
    }

    lastScrollTop = scrollTop;
});

// ===== LAZY LOAD IMAGES =====
if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
    }
});

// ===== PERFORMANCE: PASSIVE EVENT LISTENERS =====
window.addEventListener('scroll', () => {}, { passive: true });
window.addEventListener('touchmove', () => {}, { passive: true });

// ===== ADD ANIMATION KEYFRAMES VIA JAVASCRIPT =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(30px);
        }
    }

    img.loaded {
        animation: fadeInUp 0.6s ease-out;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ===== INITIALIZE ON LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio website initialized');
    
    // Add data attributes for tracking
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.setAttribute('rel', 'noopener noreferrer');
        link.setAttribute('target', '_blank');
    });

    initProjectSliders();
    initLightbox();
});

function initProjectSliders() {
    const sliders = document.querySelectorAll('.project-slider');

    sliders.forEach(slider => {
        const track = slider.querySelector('.project-slider-track');
        if (!track) return;

        const slides = Array.from(track.children);
        if (slides.length < 2) return;

        let currentIndex = 0;

        setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            track.style.transform = `translateX(-${currentIndex * 50}%)`;
        }, 5000);
    });
}


function initLightbox() {
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    if (!lightboxOverlay || !lightboxImage || !lightboxClose) return;

    let currentGallery = [];
    let currentIndex = 0;

    function openGallery(gallery, index) {
        currentGallery = gallery || [];
        currentIndex = typeof index === 'number' ? index : 0;
        if (!currentGallery.length) return;
        const item = currentGallery[currentIndex];
        lightboxImage.src = item.src;
        lightboxImage.alt = item.alt || 'Project image preview';
        lightboxOverlay.classList.add('active');
        lightboxOverlay.setAttribute('aria-hidden', 'false');
    }

    function showIndex(i) {
        if (!currentGallery.length) return;
        currentIndex = (i + currentGallery.length) % currentGallery.length;
        const item = currentGallery[currentIndex];
        lightboxImage.src = item.src;
        lightboxImage.alt = item.alt || '';
    }

    document.querySelectorAll('.project-lightbox-trigger').forEach(trigger => {
        trigger.addEventListener('click', (event) => {
            event.preventDefault();
            const card = trigger.closest('.project-card');
            const triggers = card ? Array.from(card.querySelectorAll('.project-lightbox-trigger')) : [trigger];
            const gallery = triggers.map(t => ({ src: t.getAttribute('href'), alt: t.querySelector('img')?.getAttribute('alt') || '' }));
            const href = trigger.getAttribute('href');
            const index = gallery.findIndex(g => g.src === href);
            openGallery(gallery, index !== -1 ? index : 0);
        });
    });

    lightboxPrev?.addEventListener('click', () => showIndex(currentIndex - 1));
    lightboxNext?.addEventListener('click', () => showIndex(currentIndex + 1));

    lightboxClose.addEventListener('click', () => {
        closeLightbox(lightboxOverlay, lightboxImage);
        currentGallery = [];
        currentIndex = 0;
    });

    lightboxOverlay.addEventListener('click', (event) => {
        if (event.target === lightboxOverlay) {
            closeLightbox(lightboxOverlay, lightboxImage);
            currentGallery = [];
            currentIndex = 0;
        }
    });

    document.addEventListener('keydown', (event) => {
        if (!lightboxOverlay.classList.contains('active')) return;
        if (event.key === 'Escape') {
            closeLightbox(lightboxOverlay, lightboxImage);
            currentGallery = [];
            currentIndex = 0;
        } else if (event.key === 'ArrowLeft') {
            showIndex(currentIndex - 1);
        } else if (event.key === 'ArrowRight') {
            showIndex(currentIndex + 1);
        }
    });
}

function closeLightbox(overlay, image) {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    image.src = '';
}

// Generalized slider that works with any number of slides
function initProjectSliders() {
    const sliders = document.querySelectorAll('.project-slider');

    sliders.forEach(slider => {
        const track = slider.querySelector('.project-slider-track');
        if (!track) return;

        const slides = Array.from(track.children);
        if (slides.length < 2) return;

        // Make each slide full width
        slides.forEach(s => {
            s.style.flex = '0 0 100%';
        });

        let currentIndex = 0;

        setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }, 5000);
    });
}

// ===== ACCESSIBILITY: FOCUS MANAGEMENT =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-active');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-active');
});

// Add CSS for focus visibility
const focusStyle = document.createElement('style');
focusStyle.textContent = `
    body.keyboard-active *:focus {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
    }
`;
document.head.appendChild(focusStyle);

// ===== UTILITY: GET VIEWPORT SIZE =====
function getViewportSize() {
    return {
        width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    };
}

// ===== UTILITY: DEBOUNCE FUNCTION =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== RESPONSIVE BEHAVIOR =====
const handleResize = debounce(() => {
    const viewport = getViewportSize();
    console.log('Viewport size:', viewport);
}, 250);

window.addEventListener('resize', handleResize);
