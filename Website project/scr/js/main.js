// =====================================
// IMPORTS
// =====================================
import { formValidation, animations, utils } from './utils.js';

// =====================================
// PAGE STATE
// =====================================
const PAGE_STATE = {
    isLoading: true,
    menuOpen: false,
    lastScroll: 0
};

// =====================================
// DOM ELEMENTS
// =====================================
const elements = {
    // Navigation elements
    navToggle: document.querySelector('.nav-toggle'),
    navMenu: document.querySelector('.nav-menu'),
    navHeader: document.querySelector('.site-header'),
    navLinks: document.querySelectorAll('a[href^="#"]'),
    
    // About section elements
    readMoreBtn: document.querySelector('.read-more-btn'),
    expandedText: document.querySelector('.expanded-text'),
    
    // Expertise cards
    expertiseCards: document.querySelectorAll('.expertise-card'),

    // Skills section
    skillBars: document.querySelectorAll('.skill-progress'),

    // Project section
    projectCards: document.querySelectorAll('.project-card'),

    // Contact form
    contactForm: document.querySelector('.contact-form')
};

// =====================================
// UTILITY FUNCTIONS
// =====================================
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// =====================================
// INITIALIZATION FUNCTIONS
// =====================================
function handlePageLoad() {
    window.addEventListener('load', () => {
        PAGE_STATE.isLoading = false;
        document.body.classList.add('loaded');
        initializeAnimations();
    });
}

function initializeAnimations() {
    // Initial animations when page loads
    elements.skillBars.forEach(bar => {
        if (isElementInViewport(bar)) {
            animations.fadeIn(bar);
        }
    });

    elements.projectCards.forEach(card => {
        if (isElementInViewport(card)) {
            animations.fadeIn(card);
        }
    });
}

// =====================================
// NAVIGATION FUNCTIONS
// =====================================
function initializeNavigation() {
    if (elements.navToggle && elements.navMenu) {
        elements.navToggle.addEventListener('click', toggleNavigation);
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!elements.navMenu.contains(e.target) && 
                !elements.navToggle.contains(e.target) && 
                elements.navMenu.classList.contains('active')) {
                toggleNavigation();
            }
        });
    }
}

function toggleNavigation() {
    elements.navMenu.classList.toggle('active');
    PAGE_STATE.menuOpen = !PAGE_STATE.menuOpen;
    const isExpanded = elements.navToggle.getAttribute('aria-expanded') === 'true';
    elements.navToggle.setAttribute('aria-expanded', !isExpanded);
}

// =====================================
// SCROLL EFFECTS
// =====================================
function initializeScrollEffects() {
    const handleScroll = utils.throttle(() => {
        // Animate skill bars
        elements.skillBars.forEach(bar => {
            if (isElementInViewport(bar) && !bar.classList.contains('animated')) {
                animations.fadeIn(bar);
                bar.classList.add('animated');
            }
        });
        
        // Animate project cards
        elements.projectCards.forEach(card => {
            if (isElementInViewport(card) && !card.classList.contains('visible')) {
                animations.fadeIn(card);
                card.classList.add('visible');
            }
        });
    }, 100);

    window.addEventListener('scroll', handleScroll);
}

function initializeScrollHeader() {
    const handleScroll = utils.throttle(() => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > PAGE_STATE.lastScroll && currentScroll > 100) {
            elements.navHeader?.classList.add('nav-hidden');
        } else {
            elements.navHeader?.classList.remove('nav-hidden');
        }
        
        PAGE_STATE.lastScroll = currentScroll;
    }, 100);

    window.addEventListener('scroll', handleScroll);
}

// =====================================
// READ MORE FUNCTIONALITY
// =====================================
function initializeReadMore() {
    if (elements.readMoreBtn) {
        elements.readMoreBtn.addEventListener('click', toggleReadMore);
    }
}

function toggleReadMore() {
    const isExpanded = elements.readMoreBtn.getAttribute('aria-expanded') === 'true';
    elements.readMoreBtn.setAttribute('aria-expanded', !isExpanded);
    
    if (isExpanded) {
        animations.fadeOut(elements.expandedText);
    } else {
        animations.fadeIn(elements.expandedText);
    }
    
    elements.readMoreBtn.textContent = isExpanded ? 'Read More' : 'Read Less';
}

// =====================================
// EXPERTISE CARDS FUNCTIONALITY
// =====================================
function initializeExpertiseCards() {
    elements.expertiseCards.forEach(card => {
        card.addEventListener('click', () => handleCardFlip(card));
        card.addEventListener('keydown', (e) => handleCardKeypress(e, card));
    });
}

function handleCardFlip(card) {
    card.classList.toggle('flipped');
}

function handleCardKeypress(event, card) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleCardFlip(card);
    }
}

// =====================================
// SMOOTH SCROLL FUNCTIONALITY
// =====================================
function initializeSmoothScroll() {
    elements.navLinks.forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
    });
}

function handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        // Close mobile menu if open
        if (PAGE_STATE.menuOpen) {
            toggleNavigation();
        }
    }
}

// =====================================
// THEME PREFERENCE
// =====================================
function initializeThemePreference() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    function handleThemeChange(e) {
        if (e.matches) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }
    
    prefersDark.addListener(handleThemeChange);
    handleThemeChange(prefersDark);
}

// =====================================
// CONTACT FORM
// =====================================
function initializeContactForm() {
    if (!elements.contactForm) return;

    elements.contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(elements.contactForm);
        const email = formData.get('email');
        
        if (!formValidation.isEmailValid(email)) {
            alert('Please enter a valid email address');
            return;
        }

        try {
            // Simulate form submission - replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('Thank you for your message! I will get back to you soon.');
            elements.contactForm.reset();
        } catch (error) {
            console.error('Form submission error:', error);
            alert('Sorry, there was an error sending your message. Please try again.');
        }
    });
}

// =====================================
// INITIALIZE ALL FUNCTIONALITY
// =====================================
document.addEventListener('DOMContentLoaded', function() {
    try {
        handlePageLoad();
        initializeNavigation();
        initializeReadMore();
        initializeExpertiseCards();
        initializeSmoothScroll();
        initializeScrollEffects();
        initializeScrollHeader();
        initializeThemePreference();
        initializeContactForm();
    } catch (error) {
        console.error('Error initializing page:', error);
    }
});