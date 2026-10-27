# Shared components (copy-and-paste reference)

The site uses plain HTML with no templating or build step, so the header and footer
markup is repeated in each of the six pages. This file holds the **one canonical copy**.
If you change the header or footer, change it here first, then update all six pages.

Only one thing differs per page: which navigation link has `aria-current="page"`
(in the header **and** in the footer's navigation list).

---

## 1. Page shell

```html
<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>PAGE TITLE | NexaPoint Consulting</title>
  <meta name="description" content="PAGE DESCRIPTION (about 150 characters).">
  <meta name="theme-color" content="#14243A">
  <link rel="icon" type="image/svg+xml" href="assets/icons/favicon.svg">
  <link rel="stylesheet" href="css/styles.css">
  <script src="js/main.js"></script>
  <!-- Page-specific script, only where needed, e.g. insights.html:
       <script src="js/insights.js" defer></script> -->
</head>
<body>
  <!-- header goes here -->
  <main id="main-content">
    <!-- page content -->
  </main>
  <!-- footer goes here -->
</body>
</html>
```

`main.js` is deliberately loaded in `<head>` *without* `defer`. It is tiny, and running
early lets it add the `js` class before the page is drawn, which stops the mobile menu
flashing open and then closing. Its DOM work waits for `DOMContentLoaded` internally.

---

## 2. Header

```html
<a class="skip-link" href="#main-content">Skip to main content</a>

<header class="site-header">
  <div class="container site-header__inner">
    <a class="logo" href="index.html">
      <img class="logo__mark" src="assets/icons/logo-mark.svg" alt="" width="38" height="38">
      <span class="logo__text">NexaPoint <small>Consulting</small></span>
    </a>

    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">
      <span class="nav-toggle__bars" aria-hidden="true"></span>
      <span>Menu</span>
    </button>

    <nav id="primary-nav" class="primary-nav" aria-label="Primary">
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html">About Us</a></li>
        <li><a href="services.html">Services</a></li>
        <li><a href="approach.html">Our Approach</a></li>
        <li><a href="insights.html">Insights</a></li>
        <li><a href="contact.html">Contact Us</a></li>
      </ul>
    </nav>
  </div>
</header>
```

To mark the current page, add `aria-current="page"` to that one link, for example on
`about.html`: `<li><a href="about.html" aria-current="page">About Us</a></li>`.

---

## 3. Footer

```html
<footer class="site-footer">
  <div class="container site-footer__grid">

    <div>
      <a class="logo" href="index.html">
        <img class="logo__mark" src="assets/icons/logo-mark.svg" alt="" width="38" height="38">
        <span class="logo__text">NexaPoint <small>Consulting</small></span>
      </a>
      <p class="site-footer__tagline">Clarity. Strategy. Sustainable Growth.</p>
    </div>

    <nav aria-label="Footer">
      <h2>Explore</h2>
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html">About Us</a></li>
        <li><a href="services.html">Services</a></li>
        <li><a href="approach.html">Our Approach</a></li>
        <li><a href="insights.html">Insights</a></li>
        <li><a href="contact.html">Contact Us</a></li>
      </ul>
    </nav>

    <div>
      <h2>Contact</h2>
      <address>
        <ul>
          <li><a href="mailto:info@nexapoint.example">info@nexapoint.example</a></li>
          <li><a href="tel:+254700000000">+254 700 000 000</a></li>
          <li>Nairobi, Kenya</li>
        </ul>
      </address>
      <p class="site-footer__demo-note">Demonstration details for a class project, not a real business contact.</p>
    </div>

    <div>
      <h2>Office hours</h2>
      <p>Monday–Friday<br>8:00 AM–5:00 PM EAT</p>
    </div>

  </div>

  <div class="container site-footer__bottom">
    <p>&copy; <span data-current-year>2026</span> NexaPoint Consulting. A fictional company created for a software development class project.</p>
  </div>
</footer>
```

---

## 4. Component quick reference (classes in `css/styles.css`)

| Need | Use |
|---|---|
| Centred content width | `.container` |
| Vertical section spacing | `.section` (add `.section--light` or `.section--dark`) |
| Section heading block | `.section__header` (add `--center` to centre) |
| Responsive card grid | `.grid .grid--2 / --3 / --4 / --5` |
| Text + media columns | `.split` (or `.split--wide-text`) |
| Buttons | `.btn .btn--primary / --secondary / --outline / --outline-light`, grouped in `.btn-group` |
| Card | `.card`, `.card__icon`, `.card__title`, `.card__text`, `.card__footer` |
| Label | `.tag` (or `.tag--gold`) |
| Gold-dot list | `.check-list` |
| Home hero | `.hero`, `.hero__lead` |
| Inner-page intro | `.page-hero` with `.breadcrumb` |
| Four-stage sequence | `ol.process > li.process__step` |
| Closing CTA | `.cta-band` |
| Highlighted note | `.notice` (or `.notice--gold`) |
| Image stand-in | `.media-placeholder` |
| Forms | `.form`, `.form-field`, `.form-label`, `.form-control`, `.form-hint`, `.form-error`, `.form-status` |
| Hero with illustration | `.hero__grid` + `.hero__media` (illustration hidden below 880px) |
| Top-aligned two-column layout | `.split.split--top` (add `--wide-text` for a wider text column) |
| Short statements separated by rules | `ul.reason-list > li` (`h3` + `p`) |
| Framed block (mission, vision, facts) | `.panel` (add `.panel--dark` for navy) |
| Label/value pairs | `dl.fact-list > div > dt + dd` |
| Statements with a gold top rule | `.commitment` (adapts to light or dark sections) |
| Link under a process list | `.process-link` |
| Slim band (e.g. a notice) | `.section--tight` |
| Pill links to sections on the same page | `nav.jump-nav > ul > li > a` |
| Service block (text left, details right) | `.service` containing `.service__main` + `.panel` |
| Smaller heading inside a block or panel | `.subheading` |
| Titled parts inside one panel, separated by rules | `.panel__section` |
| Vertical sequence of stages joined by a rail | `ol.timeline > li.timeline__item > .timeline__body` (with `.timeline__label`, `.timeline__details`) |
| Wrapped row of short labels | `ul.tag-list > li > span.tag` |
| Spacing above a block of indicators | `.evaluation-indicators` |

### Insights page hooks (`insights.html` + `js/insights.js`)

`js/insights.js` finds its elements by these IDs and attributes, so renaming any of them
breaks the page: `#article-search`, `#article-list`, `.article-card[data-category]`,
`.chip[data-filter]`, `#results-status`, `#no-results`, `#clear-filters`,
`[data-read-article]`, `.article-content`, `#article-dialog`, `#dialog-title`,
`#dialog-category`, `#dialog-body`, `.dialog__scroll`, `[data-dialog-close]`.
A chip's `data-filter` must equal the matching card's `data-category` (or be `all`).
The script returns immediately if `#article-list` or `#article-search` is missing, so it is
safe, but unnecessary, to load on other pages; only `insights.html` loads it.

### Contact page hooks (`contact.html` + `js/contact.js`)

`js/contact.js` finds its elements by these IDs, so renaming any of them breaks the form:
`#enquiry-form`, `#submit-button`, `#form-errors`, `#form-errors-list`, `#form-success`,
`#message-count`, the four validated fields `#name`, `#email`, `#service`, `#message`, and
one `#<field>-error` paragraph per validated field. The service dropdown's option values
(`business-strategy`, `digital-transformation`, `operations-improvement`,
`data-business-intelligence`) must match the `?service=` values used by the buttons on
`services.html`.

The form deliberately has **no `action` or `method`**, and the submit button starts
`disabled` until the script enables it. Together these mean the form cannot post data
anywhere, with or without JavaScript. Do not add either without also adding a real backend.

Colour behind a section is available as `var(--surface)`. It is white by default and
`.section--light` switches it, which lets connector lines and number markers blend into
either background.

Dark sections (`.section--dark`) set their own muted text colour, so `.lead` and
`.text-muted` stay readable on navy.
