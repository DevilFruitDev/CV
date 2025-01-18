// =====================================
// Form Validation Helpers
// =====================================
const formValidation = {
    isEmailValid: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    isRequired: (value) => {
        return value.trim() !== '';
    },

    isMinLength: (value, minLength) => {
        return value.length >= minLength;
    },

    isMaxLength: (value, maxLength) => {
        return value.length <= maxLength;
    }
};

// =====================================
// Animation Helpers
// =====================================
const animations = {
    fadeIn: (element, duration = 300) => {
        element.style.opacity = 0;
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            
            element.style.opacity = Math.min(progress / duration, 1);
            
            if (progress < duration) {
                window.requestAnimationFrame(animate);
            }
        };
        
        window.requestAnimationFrame(animate);
    },

    fadeOut: (element, duration = 300) => {
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            
            element.style.opacity = Math.max(1 - (progress / duration), 0);
            
            if (progress < duration) {
                window.requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        window.requestAnimationFrame(animate);
    }
};

// =====================================
// General Utility Functions
// =====================================
const utils = {
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle: (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    getScrollPercentage: () => {
        const doc = document.documentElement;
        const winHeight = window.innerHeight;
        const docHeight = doc.scrollHeight - winHeight;
        const scrollTop = window.scrollY;
        return (scrollTop / docHeight) * 100;
    }
};

// Export all utility functions
export { formValidation, animations, utils };