document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Apply reveal animation classes
    const revealElements = document.querySelectorAll('.reveal, .card, .section-title, .gallery img');
    revealElements.forEach(el => {
        if (!el.classList.contains('reveal')) el.classList.add('reveal');
        observer.observe(el);
    });

    // Hamburger menu toggle
    const hamburger = document.getElementById('nav-hamburger');
    const navbar = document.querySelector('.navbar');
    if (hamburger && navbar) {
        hamburger.addEventListener('click', () => {
            navbar.classList.toggle('nav-open');
        });
        // Close when a link is tapped
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => navbar.classList.remove('nav-open'));
        });
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target)) navbar.classList.remove('nav-open');
        });
    }

    // Auto-select tier from URL query param (e.g. contact.html?tier=eagle)
    const params = new URLSearchParams(window.location.search);
    const tierParam = params.get('tier');
    if (tierParam) {
        const sel = document.getElementById('tier-select');
        if (sel) {
            sel.value = tierParam;
        }
    }

    // Smooth scroll for internal links
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

    // Form submission — nicer UX than bare alert()
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Sending&hellip;';
            btn.disabled = true;
            btn.style.opacity = '0.7';

            setTimeout(() => {
                // Replace form with success message
                form.innerHTML = `
                    <div style="text-align: center; padding: 60px 20px;">
                        <div style="font-size: 3rem; margin-bottom: 20px;">✓</div>
                        <h3 style="color: var(--primary); margin-bottom: 15px;">Request Received</h3>
                        <p style="color: var(--text-muted);">Our design team will be in touch within 24 hours to arrange your consultation.</p>
                    </div>`;
            }, 1500);
        });
    }

    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(18, 18, 18, 0.95)';
            navbar.style.padding = '1rem 5%';
        } else {
            navbar.style.background = 'rgba(18, 18, 18, 0.8)';
            navbar.style.padding = '1.5rem 5%';
        }
    });
});
