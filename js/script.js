/**
 * GreenRAN: JavaScript
 * Handles: dark mode toggle, mobile menu, smooth scroll, scroll animations, active nav link.
 * Motion respects prefers-reduced-motion; scroll tracking uses IntersectionObserver only.
 */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ==================== DARK MODE ==================== */
    var darkToggle = document.getElementById('darkToggle');
    var darkToggleMobile = document.getElementById('darkToggleMobile');
    var html = document.documentElement;
    var DARK_KEY = 'greenran-theme';

    var ICON_MOON = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"/></svg>';
    var ICON_SUN = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"/></svg>';

    function getDarkIcon() {
        return document.getElementById('darkIcon');
    }

    function setTheme(isDark) {
        var icon = getDarkIcon();
        var mobileIcon = document.getElementById('darkToggleMobileIcon');
        var mobileLabel = document.getElementById('darkToggleMobileLabel');
        if (isDark) {
            html.classList.add('dark');
            if (icon) {
                icon.outerHTML = '<svg id="darkIcon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"/></svg>';
            }
            if (mobileIcon) mobileIcon.innerHTML = ICON_SUN;
            if (mobileLabel) mobileLabel.textContent = 'Modo Claro';
        } else {
            html.classList.remove('dark');
            if (icon) {
                icon.outerHTML = '<svg id="darkIcon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"/></svg>';
            }
            if (mobileIcon) mobileIcon.innerHTML = ICON_MOON;
            if (mobileLabel) mobileLabel.textContent = 'Modo Escuro';
        }
    }

    function toggleTheme() {
        var isDark = html.classList.contains('dark');
        var newState = !isDark;
        setTheme(newState);
        try {
            localStorage.setItem(DARK_KEY, newState ? 'dark' : 'light');
        } catch (e) { /* localStorage not available */ }
    }

    // Init dark mode (class is also set early in <head> to avoid a flash)
    (function initTheme() {
        var stored;
        try {
            stored = localStorage.getItem(DARK_KEY);
        } catch (e) { /* ignore */ }
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var isDark = stored === 'dark' || (!stored && prefersDark);
        setTheme(isDark);
    })();

    if (darkToggle) darkToggle.addEventListener('click', toggleTheme);
    if (darkToggleMobile) darkToggleMobile.addEventListener('click', toggleTheme);

    /* ==================== MOBILE MENU ==================== */
    var mobileMenuBtn = document.getElementById('mobileMenuBtn');
    var mobileMenu = document.getElementById('mobileMenu');
    var menuOpen = false;

    var ICON_BARS = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6l16 0"/><path d="M4 12l16 0"/><path d="M4 18l16 0"/></svg>';
    var ICON_CLOSE = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6l-12 12"/><path d="M6 6l12 12"/></svg>';

    function closeMenu() {
        menuOpen = false;
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.innerHTML = ICON_BARS;
    }

    function openMenu() {
        menuOpen = true;
        mobileMenu.classList.remove('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        mobileMenuBtn.innerHTML = ICON_CLOSE;
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

    // Close mobile menu when any link inside it is clicked (nav links and CTA)
    document.querySelectorAll('#mobileMenu a').forEach(function (link) {
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
            var href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            var target = document.querySelector(href);
            if (target) {
                var navHeight = 72;
                var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
            }
        });
    });

    /* ==================== SCROLL ANIMATIONS ==================== */
    var reveals = document.querySelectorAll('.reveal');
    var staggerContainers = document.querySelectorAll('.reveal-stagger');

    if (reduceMotion) {
        reveals.forEach(function (el) { el.classList.add('visible'); });
        staggerContainers.forEach(function (el) { el.classList.add('visible'); });
    } else {
        function handleIntersection(entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }

        var revealObserver = new IntersectionObserver(handleIntersection, {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.1
        });

        reveals.forEach(function (el) { revealObserver.observe(el); });
        staggerContainers.forEach(function (el) { revealObserver.observe(el); });
    }

    /* ==================== ACTIVE NAV LINK ON SCROLL ==================== */
    var navLinks = document.querySelectorAll('.nav-link');

    if (navLinks.length > 0 && 'IntersectionObserver' in window) {
        var visibleSections = {};
        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                visibleSections[entry.target.id] = entry.isIntersecting;
            });
            var currentId = '';
            Object.keys(visibleSections).forEach(function (id) {
                if (visibleSections[id]) currentId = id;
            });
            navLinks.forEach(function (link) {
                link.classList.remove('text-primary');
                if (link.getAttribute('href') === '#' + currentId) {
                    link.classList.add('text-primary');
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px' });

        document.querySelectorAll('section[id]').forEach(function (section) {
            sectionObserver.observe(section);
        });
    }
})();
