/* ==========================================================================
   NexaPoint Consulting — Insights page behaviour (js/insights.js)
   --------------------------------------------------------------------------
   Features
   1. Search: matches titles, summaries, categories and the full article text.
   2. Category filter: "chips" that work together with the search.
   3. Status message and a helpful "no results" state.
   4. Article reader: opens the full text in a native <dialog> modal.
      - Escape, the Close buttons and a click on the backdrop all close it.
      - Focus returns to the button that opened it.
      - If the browser has no <dialog> support, the article expands in place.

   This file only runs on insights.html: it stops immediately if the
   page's elements are missing.
   ========================================================================== */

(function () {
  'use strict';

  /* ---- Find the elements this page needs (and stop if they are absent) ---- */
  var list = document.getElementById('article-list');
  var searchInput = document.getElementById('article-search');

  if (!list || !searchInput) {
    return;
  }

  var cards = Array.prototype.slice.call(list.querySelectorAll('.article-card'));
  var chips = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var statusEl = document.getElementById('results-status');
  var emptyEl = document.getElementById('no-results');
  var clearButton = document.getElementById('clear-filters');

  var dialog = document.getElementById('article-dialog');
  var dialogTitle = document.getElementById('dialog-title');
  var dialogCategory = document.getElementById('dialog-category');
  var dialogBody = document.getElementById('dialog-body');

  // Older browsers may not support <dialog>; we then expand articles in place.
  var dialogSupported = Boolean(dialog && typeof dialog.showModal === 'function');

  /* ---- State ---- */
  var currentQuery = '';
  var currentCategory = 'all';
  var lastTrigger = null; // the button that opened the dialog


  /* ======================================================================
     Search and filter
     ====================================================================== */

  // Lower-case, strip punctuation and collapse spaces so "Data-informed!" matches "data informed".
  function normalise(text) {
    return text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Build one searchable string per article (title, summary, category and full text).
  function buildSearchIndex() {
    return cards.map(function (card) {
      var parts = [
        card.querySelector('.card__title'),
        card.querySelector('.card__text'),
        card.querySelector('.tag'), // first tag is the category
        card.querySelector('.article-content')
      ];

      var text = parts
        .map(function (part) { return part ? part.textContent : ''; })
        .join(' ');

      return {
        element: card,
        category: card.getAttribute('data-category'),
        text: normalise(text)
      };
    });
  }

  var searchIndex = buildSearchIndex();

  // Every word the visitor typed must appear somewhere in the article.
  function matchesQuery(entry) {
    if (!currentQuery) {
      return true;
    }

    return currentQuery.split(' ').every(function (word) {
      return entry.text.indexOf(word) !== -1;
    });
  }

  function matchesCategory(entry) {
    return currentCategory === 'all' || entry.category === currentCategory;
  }

  function updateStatus(visibleCount) {
    var total = cards.length;

    if (visibleCount === 0) {
      statusEl.textContent = 'No articles found';
    } else if (visibleCount === total) {
      statusEl.textContent = 'Showing ' + total + ' articles';
    } else {
      statusEl.textContent = 'Showing ' + visibleCount + ' of ' + total + ' articles';
    }
  }

  function applyFilters() {
    var visibleCount = 0;

    searchIndex.forEach(function (entry) {
      var isMatch = matchesQuery(entry) && matchesCategory(entry);
      entry.element.hidden = !isMatch;

      if (isMatch) {
        visibleCount += 1;
      }
    });

    list.hidden = visibleCount === 0;
    emptyEl.hidden = visibleCount !== 0;
    updateStatus(visibleCount);
  }

  function setCategory(category) {
    currentCategory = category;

    chips.forEach(function (chip) {
      var isSelected = chip.getAttribute('data-filter') === category;
      chip.setAttribute('aria-pressed', String(isSelected));
    });

    applyFilters();
  }

  function clearFilters() {
    searchInput.value = '';
    currentQuery = '';
    setCategory('all');
    searchInput.focus();
  }


  /* ======================================================================
     Article reader
     ====================================================================== */

  // Inside the dialog the article title is an h2, so its sub-headings become h3.
  function copyArticleBody(sourceElement) {
    var copy = sourceElement.cloneNode(true);

    copy.classList.remove('article-content', 'article-body', 'is-open');

    Array.prototype.forEach.call(copy.querySelectorAll('h4'), function (oldHeading) {
      var newHeading = document.createElement('h3');
      newHeading.textContent = oldHeading.textContent;
      oldHeading.parentNode.replaceChild(newHeading, oldHeading);
    });

    return copy;
  }

  function openInDialog(card, trigger) {
    var content = card.querySelector('.article-content');
    var category = card.querySelector('.tag').textContent;
    var title = card.querySelector('.card__title').textContent;

    lastTrigger = trigger;
    dialogTitle.textContent = title;
    dialogCategory.textContent = category;

    // Replace any previous article text with a fresh copy of this one.
    while (dialogBody.firstChild) {
      dialogBody.removeChild(dialogBody.firstChild);
    }

    var articleCopy = copyArticleBody(content);

    while (articleCopy.firstChild) {
      dialogBody.appendChild(articleCopy.firstChild);
    }

    dialog.showModal();
    document.body.classList.add('has-dialog');
    dialog.querySelector('.dialog__scroll').scrollTop = 0;
  }

  // Fallback for browsers without <dialog>: expand the article inside its card.
  function toggleInline(card, trigger) {
    var content = card.querySelector('.article-content');
    var isOpen = content.classList.toggle('is-open');
    var label = trigger.querySelector('.visually-hidden');
    var hiddenText = label ? label.outerHTML : '';

    trigger.setAttribute('aria-expanded', String(isOpen));
    trigger.innerHTML = (isOpen ? 'Hide Article' : 'Read Article') + hiddenText;
  }

  function handleReadClick(event) {
    var trigger = event.target.closest('[data-read-article]');

    if (!trigger) {
      return;
    }

    var card = trigger.closest('.article-card');

    if (dialogSupported) {
      openInDialog(card, trigger);
    } else {
      toggleInline(card, trigger);
    }
  }

  function handleDialogClosed() {
    document.body.classList.remove('has-dialog');

    // Return keyboard focus to the button that opened the article.
    if (lastTrigger) {
      lastTrigger.focus();
      lastTrigger = null;
    }
  }

  // A click on the dark backdrop lands on the <dialog> element itself.
  function handleDialogClick(event) {
    if (event.target === dialog) {
      dialog.close();
    }
  }

  function setUpDialog() {
    if (!dialogSupported) {
      // Give each button the information a screen reader needs for in-place expansion.
      Array.prototype.forEach.call(document.querySelectorAll('[data-read-article]'), function (button) {
        button.setAttribute('aria-expanded', 'false');
      });
      return;
    }

    Array.prototype.forEach.call(dialog.querySelectorAll('[data-dialog-close]'), function (button) {
      button.addEventListener('click', function () {
        dialog.close();
      });
    });

    dialog.addEventListener('click', handleDialogClick);
    dialog.addEventListener('close', handleDialogClosed); // fires for Escape and close() alike
  }


  /* ======================================================================
     Wire everything up
     ====================================================================== */

  searchInput.addEventListener('input', function () {
    currentQuery = normalise(searchInput.value);
    applyFilters();
  });

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      setCategory(chip.getAttribute('data-filter'));
    });
  });

  clearButton.addEventListener('click', clearFilters);
  list.addEventListener('click', handleReadClick);

  setUpDialog();
  applyFilters();
})();
