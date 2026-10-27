/* ==========================================================================
   NexaPoint Consulting — shared JavaScript (loaded on every page)
   --------------------------------------------------------------------------
   Responsibilities:
   1. Flag that JavaScript is running (so CSS can enable the mobile menu).
   2. Mobile navigation toggle (accessible: aria-expanded, Escape, focus return).
   3. Safety-net "current page" marker for the navigation.
   4. Footer copyright year.

   Everything lives inside one function so no variables leak into the
   global scope. Each feature first checks that its elements exist.
   ========================================================================== */

(function () {
  'use strict';

  var MOBILE_BREAKPOINT = 960; // keep in sync with the CSS media query


  /* 1. Tell the stylesheet that JavaScript is available. */
  document.documentElement.classList.add('js');


  /* 2. Mobile navigation ---------------------------------------------------- */
  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('primary-nav');

    // Page-specific safety: do nothing if the markup is missing.
    if (!toggle || !nav) {
      return;
    }

    function setOpen(isOpen) {
      toggle.setAttribute('aria-expanded', String(isOpen));
      nav.classList.toggle('is-open', isOpen);
    }

    function isOpen() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }

    toggle.addEventListener('click', function () {
      setOpen(!isOpen());
    });

    // Escape closes the menu and returns focus to the toggle button.
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Clicking outside the header closes the menu.
    document.addEventListener('click', function (event) {
      if (isOpen() && !event.target.closest('.site-header')) {
        setOpen(false);
      }
    });

    // Reset when the window grows to desktop width.
    window.addEventListener('resize', function () {
      if (window.innerWidth >= MOBILE_BREAKPOINT && isOpen()) {
        setOpen(false);
      }
    });
  }


  /* 3. Current-page marker -------------------------------------------------- */
  // Each HTML page already sets aria-current="page" on its own link.
  // This only fills the gap if that attribute was forgotten.
  function markCurrentPage() {
    var links = document.querySelectorAll('.primary-nav a');

    if (!links.length || document.querySelector('.primary-nav a[aria-current="page"]')) {
      return;
    }

    var currentFile = window.location.pathname.split('/').pop() || 'index.html';

    links.forEach(function (link) {
      if (link.getAttribute('href') === currentFile) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }


  /* 4. Footer year ---------------------------------------------------------- */
  function setFooterYear() {
    var yearElements = document.querySelectorAll('[data-current-year]');
    var year = String(new Date().getFullYear());

    yearElements.forEach(function (element) {
      element.textContent = year;
    });
  }


  /* Start everything once the page structure is ready. */
  function init() {
    initMobileNav();
    markCurrentPage();
    setFooterYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
