// Main JavaScript for LogikMeter

// Language Management
let currentLanguage = 'en';

function changeLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    
    // Update current language display
    const currentLangElement = document.getElementById('currentLang');
    if (currentLangElement) {
        currentLangElement.textContent = lang.toUpperCase();
    }
    
    // Update all elements with language attributes
    const elements = document.querySelectorAll('[data-en][data-fa]');
    elements.forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            element.textContent = text;
        }
    });
    
    // Update placeholders
    const placeholderElements = document.querySelectorAll(`[data-${lang}-placeholder]`);
    placeholderElements.forEach(element => {
        const placeholder = element.getAttribute(`data-${lang}-placeholder`);
        if (placeholder) {
            element.placeholder = placeholder;
        }
    });
    
    // Update select options
    const selectOptions = document.querySelectorAll('option[data-en][data-fa]');
    selectOptions.forEach(option => {
        const text = option.getAttribute(`data-${lang}`);
        if (text) {
            option.textContent = text;
        }
    });
    
    // Save language preference
    localStorage.setItem('preferredLanguage', lang);
    
    // Update Bootstrap RTL classes if needed
    updateBootstrapRTL(lang);
}

function updateBootstrapRTL(lang) {
    const body = document.body;
    if (lang === 'fa') {
        // Add RTL specific classes
        body.classList.add('rtl');
        
        // Update text alignment classes
        const textStartElements = document.querySelectorAll('.text-start');
        textStartElements.forEach(el => {
            el.classList.remove('text-start');
            el.classList.add('text-end');
        });
        
        const textEndElements = document.querySelectorAll('.text-end');
        textEndElements.forEach(el => {
            if (!el.classList.contains('original-text-end')) {
                el.classList.remove('text-end');
                el.classList.add('text-start');
            }
        });
    } else {
        body.classList.remove('rtl');
        
        // Restore original text alignment
        const textEndElements = document.querySelectorAll('.text-start');
        textEndElements.forEach(el => {
            if (body.classList.contains('rtl')) {
                el.classList.remove('text-start');
                el.classList.add('text-end');
            }
        });
    }
}

// Initialize language on page load
function initializeLanguage() {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    changeLanguage(savedLanguage);
}

// Countdown Timer
function startCountdown(elementId, duration) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let timeLeft = duration;
    
    const timer = setInterval(() => {
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        
        element.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            element.textContent = '00:00:00';
            // Handle timer expiration
            onTimerExpired();
        }
        
        timeLeft--;
    }, 1000);
}

function onTimerExpired() {
    // Show notification or redirect
    console.log('Timer expired!');
}

// Form Validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        }
    });
    
    return isValid;
}

// Real-time form validation
function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required')) {
                    if (!this.value.trim()) {
                        this.classList.add('is-invalid');
                        this.classList.remove('is-valid');
                    } else {
                        this.classList.remove('is-invalid');
                        this.classList.add('is-valid');
                    }
                }
            });
        });
    });
}

// Search and Filter Functions
function setupSearch() {
    const searchInput = document.querySelector('input[placeholder*="Search"]');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterTopics(searchTerm);
        });
    }
}

function filterTopics(searchTerm) {
    const topicCards = document.querySelectorAll('.topic-card');
    topicCards.forEach(card => {
        const title = card.querySelector('.card-title a')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Category and Status Filters
function setupFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
}

function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    
    const topicCards = document.querySelectorAll('.topic-card');
    
    topicCards.forEach(card => {
        let showCard = true;
        
        // Category filter
        if (categoryFilter) {
            const categoryBadge = card.querySelector('.badge');
            const cardCategory = categoryBadge?.textContent.toLowerCase() || '';
            if (!cardCategory.includes(categoryFilter.toLowerCase())) {
                showCard = false;
            }
        }
        
        // Status filter
        if (statusFilter && showCard) {
            const statusBadges = card.querySelectorAll('.badge');
            let hasMatchingStatus = false;
            
            statusBadges.forEach(badge => {
                const badgeText = badge.textContent.toLowerCase();
                if (
                    (statusFilter === 'active' && badgeText.includes('active')) ||
                    (statusFilter === 'voting' && badgeText.includes('voting')) ||
                    (statusFilter === 'completed' && badgeText.includes('completed'))
                ) {
                    hasMatchingStatus = true;
                }
            });
            
            if (!hasMatchingStatus) {
                showCard = false;
            }
        }
        
        card.style.display = showCard ? 'block' : 'none';
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 80px; right: 20px; z-index: 1050; min-width: 300px;';
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Loading States
function showLoading(element) {
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    
    if (element) {
        element.classList.add('loading');
        const originalText = element.textContent;
        element.setAttribute('data-original-text', originalText);
        element.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Loading...`;
    }
}

function hideLoading(element) {
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    
    if (element) {
        element.classList.remove('loading');
        const originalText = element.getAttribute('data-original-text');
        if (originalText) {
            element.textContent = originalText;
            element.removeAttribute('data-original-text');
        }
    }
}

// Local Storage Helpers
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function loadFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
    }
}

// Animation Helpers
function animateValue(element, start, end, duration) {
    const startTime = performance.now();
    const change = end - start;
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = start + (change * progress);
        element.textContent = Math.floor(current).toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }
    
    requestAnimationFrame(updateValue);
}

// Initialize animations for stats
function initializeStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-card h4, .balance-amount .display-4');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const finalValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
                animateValue(element, 0, finalValue, 2000);
                observer.unobserve(element);
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// Copy to Clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy to clipboard', 'danger');
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguage();
    setupFormValidation();
    setupSearch();
    setupFilters();
    initializeStatsAnimation();
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.card, .feature-card, .stat-card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    });
    
    cards.forEach(card => cardObserver.observe(card));
});

// Handle form submissions
document.addEventListener('submit', function(e) {
    const form = e.target;
    
    // Prevent default submission for demo
    e.preventDefault();
    
    if (validateForm(form.id)) {
        showLoading(form.querySelector('button[type="submit"]'));
        
        // Simulate API call
        setTimeout(() => {
            hideLoading(form.querySelector('button[type="submit"]'));
            showNotification('Action completed successfully!', 'success');
            
            // Close modal if form is in a modal
            const modal = form.closest('.modal');
            if (modal) {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            }
        }, 2000);
    } else {
        showNotification('Please fill in all required fields', 'warning');
    }
});

// Export functions for use in other files
window.LogikMeter = {
    changeLanguage,
    showNotification,
    showLoading,
    hideLoading,
    validateForm,
    saveToStorage,
    loadFromStorage,
    copyToClipboard
};