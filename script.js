document.addEventListener('DOMContentLoaded', () => {
    console.log("Site de l'Association Avenir chargé.");

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Check saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.className = savedTheme;
        updateThemeIcon(savedTheme);
    } else {
        // Time-based default (Dark between 18h and 7h, Light otherwise)
        const hour = new Date().getHours();
        if (hour >= 18 || hour < 7) {
            body.className = 'dark-theme';
            updateThemeIcon('dark-theme');
        } else {
            body.className = 'light-theme';
            updateThemeIcon('light-theme');
        }
    }

    themeBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('theme', 'light-theme');
            updateThemeIcon('light-theme');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark-theme');
            updateThemeIcon('dark-theme');
        }
    });

    function updateThemeIcon(theme) {
        if (theme === 'light-theme') {
            themeBtn.innerText = '☀️';
        } else {
            themeBtn.innerText = '🌙';
        }
    }

    // Lightbox Functionality
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';

    const img = document.createElement('img');
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.className = 'lightbox-close';

    lightbox.appendChild(img);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Get background image url from computed style
            const style = window.getComputedStyle(item);
            const bgImage = style.backgroundImage.slice(4, -1).replace(/"/g, "");

            // Set source to the high-res image (using same here for demo)
            img.src = bgImage;
            lightbox.classList.add('active');
        });
    });

    // Close lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
    };

    closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (lightbox.classList.contains('active')) closeLightbox();
            if (contactModal.classList.contains('active')) closeContactModal();
        }
    });

    // Contact Modal Logic
    const contactBtn = document.getElementById('contact-btn');
    const contactLinks = document.querySelectorAll('a[href="#contact"]');
    const contactModal = document.getElementById('contact-modal');
    const closeContactBtn = document.querySelector('.close-modal');
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailInput = document.getElementById('contact-email');
    const copySuccessMsg = document.getElementById('copy-success');

    function openContactModal(e) {
        if (e) e.preventDefault();
        contactModal.classList.add('active');
    }

    function closeContactModal() {
        contactModal.classList.remove('active');
        copySuccessMsg.classList.remove('visible');
    }

    if (contactBtn) contactBtn.addEventListener('click', openContactModal);

    // Also attach to any link pointing to #contact
    contactLinks.forEach(link => {
        link.addEventListener('click', openContactModal);
    });

    if (closeContactBtn) closeContactBtn.addEventListener('click', closeContactModal);

    window.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            closeContactModal();
        }
    });

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            emailInput.select();
            emailInput.setSelectionRange(0, 99999); // For mobile

            navigator.clipboard.writeText(emailInput.value).then(() => {
                copySuccessMsg.classList.add('visible');
                setTimeout(() => {
                    copySuccessMsg.classList.remove('visible');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                // Fallback for non-secure contexts if needed
                document.execCommand('copy');
                copySuccessMsg.classList.add('visible');
            });
        });
    }
});
