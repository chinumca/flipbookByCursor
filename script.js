// Page Flip Book Application
class PageFlipBook {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 4;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateUI();
    }
    
    bindEvents() {
        // Navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        prevBtn.addEventListener('click', () => this.previousPage());
        nextBtn.addEventListener('click', () => this.nextPage());
        
        // Page dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToPage(index + 1));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isAnimating) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    this.previousPage();
                    break;
                case 'ArrowRight':
                    this.nextPage();
                    break;
                case 'Home':
                    this.goToPage(1);
                    break;
                case 'End':
                    this.goToPage(this.totalPages);
                    break;
            }
        });
        
        // Touch/swipe support
        this.addTouchSupport();
    }
    
    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        const book = document.querySelector('.book');
        
        book.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        book.addEventListener('touchend', (e) => {
            if (this.isAnimating) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only trigger if horizontal swipe is more significant than vertical
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextPage();
                } else {
                    this.previousPage();
                }
            }
        });
    }
    
    nextPage() {
        if (this.currentPage < this.totalPages && !this.isAnimating) {
            this.goToPage(this.currentPage + 1);
        }
    }
    
    previousPage() {
        if (this.currentPage > 1 && !this.isAnimating) {
            this.goToPage(this.currentPage - 1);
        }
    }
    
    goToPage(pageNumber) {
        if (pageNumber < 1 || pageNumber > this.totalPages || this.isAnimating) {
            return;
        }
        
        this.isAnimating = true;
        
        // Update current page
        this.currentPage = pageNumber;
        
        // Animate page flip
        this.animatePageFlip();
        
        // Update UI after animation
        setTimeout(() => {
            this.updateUI();
            this.isAnimating = false;
        }, 400);
    }
    
    animatePageFlip() {
        const pages = document.querySelectorAll('.page');
        
        pages.forEach((page, index) => {
            const pageNumber = index + 1;
            
            if (pageNumber <= this.currentPage) {
                // Pages that should be visible (rotated to 0deg)
                page.style.transform = 'rotateY(0deg)';
                page.style.zIndex = this.totalPages - pageNumber + 1;
            } else {
                // Pages that should be hidden (rotated to -180deg)
                page.style.transform = 'rotateY(-180deg)';
                page.style.zIndex = this.totalPages - pageNumber + 1;
            }
        });
    }
    
    updateUI() {
        // Update page indicator
        document.getElementById('currentPage').textContent = this.currentPage;
        document.getElementById('totalPages').textContent = this.totalPages;
        
        // Update navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === this.totalPages;
        
        // Update page dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index + 1 === this.currentPage);
        });
        
        // Add visual feedback
        this.addPageTransitionEffect();
    }
    
    addPageTransitionEffect() {
        const book = document.querySelector('.book');
        book.style.transform = 'scale(1.02)';
        
        setTimeout(() => {
            book.style.transform = 'scale(1)';
        }, 200);
    }
}

// Initialize the page flip book when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PageFlipBook();
    
    // Add some interactive effects
    addInteractiveEffects();
});

// Additional interactive effects
function addInteractiveEffects() {
    // Add hover effects to pages
    const pages = document.querySelectorAll('.page');
    
    pages.forEach(page => {
        page.addEventListener('mouseenter', () => {
            if (!page.classList.contains('flip')) {
                page.style.transform += ' translateZ(10px)';
            }
        });
        
        page.addEventListener('mouseleave', () => {
            page.style.transform = page.style.transform.replace(' translateZ(10px)', '');
        });
    });
    
    // Add click effect to media elements
    const mediaElements = document.querySelectorAll('audio, video');
    
    mediaElements.forEach(element => {
        element.addEventListener('play', () => {
            element.parentElement.style.transform = 'scale(1.05)';
            element.parentElement.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
        });
        
        element.addEventListener('pause', () => {
            element.parentElement.style.transform = 'scale(1)';
            element.parentElement.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        });
    });
    
    // Add loading animation
    addLoadingAnimation();
}

function addLoadingAnimation() {
    const book = document.querySelector('.book');
    
    // Initial loading animation
    book.style.opacity = '0';
    book.style.transform = 'rotateY(90deg) scale(0.8)';
    
    setTimeout(() => {
        book.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        book.style.opacity = '1';
        book.style.transform = 'rotateY(0deg) scale(1)';
    }, 100);
}

// Add smooth scrolling for menu links
document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Add click animation
        link.style.transform = 'scale(0.95)';
        setTimeout(() => {
            link.style.transform = 'scale(1)';
        }, 150);
        
        // You can add actual navigation logic here
        console.log(`Navigating to: ${link.getAttribute('href')}`);
    });
});

// Add parallax effect to background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('body');
    const speed = scrolled * 0.5;
    
    parallax.style.backgroundPosition = `center ${speed}px`;
});

// Add page visibility API for performance
document.addEventListener('visibilitychange', () => {
    const mediaElements = document.querySelectorAll('audio, video');
    
    if (document.hidden) {
        // Pause all media when page is hidden
        mediaElements.forEach(element => {
            if (!element.paused) {
                element.pause();
            }
        });
    }
});