/**
 * GreenRAN — JavaScript
 * Handles: dark mode toggle, mobile menu, smooth scroll, scroll animations
 */
(function () {
    'use strict';

    /* ==================== DARK MODE ==================== */
    const darkToggle = document.getElementById('darkToggle');
    const darkToggleMobile = document.getElementById('darkToggleMobile');
    const html = document.documentElement;
    const DARK_KEY = 'greenran-theme';

    function getDarkIcon() {
        return document.getElementById('darkIcon');
    }

    function setTheme(isDark) {
        var icon = getDarkIcon();
        if (isDark) {
            html.classList.add('dark');
            if (icon) {
                icon.outerHTML = '<svg id="darkIcon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
            }
            if (darkToggleMobile) darkToggleMobile.innerHTML = '☀️ Modo Claro';
        } else {
            html.classList.remove('dark');
            if (icon) {
                icon.outerHTML = '<svg id="darkIcon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
            }
            if (darkToggleMobile) darkToggleMobile.innerHTML = '🌙 Modo Escuro';
        }
    }

    function toggleTheme() {
        const isDark = html.classList.contains('dark');
        const newState = !isDark;
        setTheme(newState);
        try {
            localStorage.setItem(DARK_KEY, newState ? 'dark' : 'light');
        } catch (e) { /* localStorage not available */ }
    }

    // Init dark mode
    (function initTheme() {
        let stored;
        try {
            stored = localStorage.getItem(DARK_KEY);
        } catch (e) { /* ignore */ }
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = stored === 'dark' || (!stored && prefersDark);
        setTheme(isDark);
    })();

    if (darkToggle) darkToggle.addEventListener('click', toggleTheme);
    if (darkToggleMobile) darkToggleMobile.addEventListener('click', toggleTheme);

    /* ==================== MOBILE MENU ==================== */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    let menuOpen = false;

    function closeMenu() {
        menuOpen = false;
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    }

    function openMenu() {
        menuOpen = true;
        mobileMenu.classList.remove('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        mobileMenuBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function () {
            if (menuOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    // Close mobile menu when a link is clicked
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    // Close mobile menu on Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menuOpen) {
            closeMenu();
            mobileMenuBtn.focus();
        }
    });

    /* ==================== SMOOTH SCROLL ==================== */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = 72;
                const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    /* ==================== SCROLL ANIMATIONS ==================== */
    const reveals = document.querySelectorAll('.reveal');
    const staggerContainers = document.querySelectorAll('.reveal-stagger');

    function handleIntersection(entries, observer) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }

    const revealObserver = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    });

    if (reveals.length > 0) {
        reveals.forEach(function (el) {
            revealObserver.observe(el);
        });
    }

    if (staggerContainers.length > 0) {
        staggerContainers.forEach(function (el) {
            revealObserver.observe(el);
        });
    }

    /* ==================== ACTIVE NAV LINK ON SCROLL ==================== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        let current = '';
        sections.forEach(function (section) {
            const sectionTop = section.offsetTop - 150;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(function (link) {
            link.classList.remove('text-primary');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('text-primary');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });

})();
