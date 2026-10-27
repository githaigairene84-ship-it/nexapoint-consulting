/* ==========================================================================
   NexaPoint Consulting — Contact form behaviour (contact.html only)
   --------------------------------------------------------------------------
   What this script does:
   1. Validates the enquiry form (HTML attributes + extra JavaScript rules).
   2. Shows clear, accessible feedback: a message beside each problem field
      AND a summary at the top whose links jump to the fields.
   3. Pre-selects the service when the visitor arrives from a Services button
      (contact.html?service=digital-transformation).
   4. Shows a live character count for the message.
   5. On a valid submit, shows an honest "demonstration" message.

   IMPORTANT: this website has no backend, so NOTHING is ever sent or stored.
   - There is no fetch(), XMLHttpRequest, form action or navigation.
   - There is no localStorage, sessionStorage, cookie or other storage.
   - After a valid submit the form is simply cleared.

   Safety: if the form is not on the page, the script does nothing.
   ========================================================================== */

(function () {
  'use strict';

  /* ----- Find the elements we need ---------------------------------------- */
  var form = document.getElementById('enquiry-form');
  var submitButton = document.getElementById('submit-button');
  var errorBox = document.getElementById('form-errors');
  var errorList = document.getElementById('form-errors-list');
  var successBox = document.getElementById('form-success');
  var messageCount = document.getElementById('message-count');

  if (!form || !submitButton || !errorBox || !errorList || !successBox) {
    return;
  }

  // The four services offered. Used to check the dropdown and the ?service= link.
  var SERVICE_VALUES = [
    'business-strategy',
    'digital-transformation',
    'operations-improvement',
    'data-business-intelligence'
  ];

  var MESSAGE_MIN_LENGTH = 20;

  // Becomes true after the first submit attempt. From then on, fields are
  // re-checked as the visitor types, so errors disappear as soon as they are fixed.
  var hasTriedToSubmit = false;


  /* ----- Validation rules -------------------------------------------------- */
  // Each rule receives the field's value and returns an error message,
  // or an empty string when the value is fine.
  var rules = {
    name: function (value) {
      var text = value.trim();

      if (text === '') {
        return 'Enter your full name.';
      }
      if (text.length < 2 || !/[A-Za-z\u00C0-\u024F]/.test(text)) {
        return 'Enter your full name using at least two characters, including letters.';
      }
      return '';
    },

    email: function (value) {
      var text = value.trim();

      if (text === '') {
        return 'Enter your email address.';
      }
      // Something@something.something (the browser's own check allows "a@b").
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text)) {
        return 'Enter a valid email address, such as name@example.com.';
      }
      return '';
    },

    service: function (value) {
      if (SERVICE_VALUES.indexOf(value) === -1) {
        return 'Select the service you are interested in.';
      }
      return '';
    },

    message: function (value) {
      var length = value.trim().length;

      if (length === 0) {
        return 'Enter a message.';
      }
      if (length < MESSAGE_MIN_LENGTH) {
        return 'Your message needs at least ' + MESSAGE_MIN_LENGTH + ' characters. You have written ' + length + '.';
      }
      return '';
    }
  };

  // The fields that have rules, in the order they appear on the page.
  // (Organisation and subject are optional, so they have no rules.)
  var fieldIds = ['name', 'email', 'service', 'message'];

  // The wrapper element around each field (label + input + messages), looked up once.
  var fieldWrappers = {};
  fieldIds.forEach(function (id) {
    fieldWrappers[id] = document.getElementById(id).closest('.form-field');
  });


  /* ----- Showing and clearing errors on a single field --------------------- */
  function showFieldError(id, message) {
    var input = document.getElementById(id);
    var errorElement = document.getElementById(id + '-error');

    fieldWrappers[id].classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');

    // The visually hidden word helps screen-reader users recognise an error.
    errorElement.textContent = '';
    var hidden = document.createElement('span');
    hidden.className = 'visually-hidden';
    hidden.textContent = 'Error: ';
    errorElement.appendChild(hidden);
    errorElement.appendChild(document.createTextNode(message));
  }

  function clearFieldError(id) {
    var input = document.getElementById(id);

    fieldWrappers[id].classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
    document.getElementById(id + '-error').textContent = '';
  }

  // Checks one field, updates its message, and returns the message ('' = valid).
  function validateField(id) {
    var message = rules[id](document.getElementById(id).value);

    if (message) {
      showFieldError(id, message);
    } else {
      clearFieldError(id);
    }
    return message;
  }


  /* ----- The summary of problems at the top of the form -------------------- */
  function updateErrorSummary() {
    errorList.textContent = '';

    var problems = fieldIds.filter(function (id) {
      return fieldWrappers[id].classList.contains('is-invalid');
    });

    problems.forEach(function (id) {
      var item = document.createElement('li');
      var link = document.createElement('a');

      link.href = '#' + id;
      link.textContent = document.getElementById(id + '-error').textContent.replace(/^Error: /, '');
      link.addEventListener('click', function (event) {
        // Move keyboard focus straight into the field with the problem.
        event.preventDefault();
        document.getElementById(id).focus();
      });

      item.appendChild(link);
      errorList.appendChild(item);
    });

    errorBox.hidden = problems.length === 0;
    return problems;
  }

  function validateAll() {
    fieldIds.forEach(validateField);
    return updateErrorSummary();
  }


  /* ----- Success message and clean-up -------------------------------------- */
  function hideSuccess() {
    successBox.hidden = true;
  }

  function showSuccess() {
    // Nothing is sent anywhere: the form is just cleared.
    form.reset();
    fieldIds.forEach(clearFieldError);
    updateErrorSummary();
    updateMessageCount();
    hasTriedToSubmit = false;

    successBox.hidden = false;
    successBox.focus(); // focusing it makes screen readers read the message
  }


  /* ----- Character counter for the message --------------------------------- */
  function updateMessageCount() {
    if (messageCount) {
      messageCount.textContent = String(document.getElementById('message').value.length);
    }
  }


  /* ----- Pre-select the service from ?service=... -------------------------- */
  // Only the four known values are accepted, so nothing else from the URL is
  // ever placed into the page.
  function preselectService() {
    var requested = new URLSearchParams(window.location.search).get('service');

    if (requested && SERVICE_VALUES.indexOf(requested) !== -1) {
      document.getElementById('service').value = requested;
    }
  }


  /* ----- Events ------------------------------------------------------------ */
  function handleSubmit(event) {
    // Always stop the browser's own submit: there is no server to send to.
    event.preventDefault();
    hasTriedToSubmit = true;
    hideSuccess();

    var problems = validateAll();

    if (problems.length > 0) {
      errorBox.focus(); // takes keyboard and screen-reader users to the summary
      return;
    }

    showSuccess();
  }

  // Re-check a field when the visitor leaves it, or while they fix it.
  function handleFieldChange(id, isBlurEvent) {
    var input = document.getElementById(id);
    var isShowingError = fieldWrappers[id].classList.contains('is-invalid');

    // Leaving an untouched, empty field is not an error until they try to submit.
    if (isBlurEvent && !hasTriedToSubmit && input.value.trim() === '' && !isShowingError) {
      return;
    }

    // Do not nag while typing, unless an error is already showing (so it can clear).
    if (!isBlurEvent && !isShowingError && !hasTriedToSubmit) {
      return;
    }

    validateField(id);

    // The summary box only appears after a submit attempt, so it never pushes
    // the form down while someone is simply tabbing through the fields.
    if (hasTriedToSubmit) {
      updateErrorSummary();
    }
  }

  function init() {
    // The script takes over validation, so the browser's pop-up bubbles are
    // switched off. The HTML rules (required, minlength...) still document the
    // limits and still apply to what the visitor can type.
    form.noValidate = true;

    preselectService();
    updateMessageCount();

    // The button starts disabled in the HTML so it cannot be used without JavaScript.
    submitButton.disabled = false;

    form.addEventListener('submit', handleSubmit);

    fieldIds.forEach(function (id) {
      var input = document.getElementById(id);

      input.addEventListener('blur', function () { handleFieldChange(id, true); });
      input.addEventListener('input', function () { handleFieldChange(id, false); });
      input.addEventListener('change', function () { handleFieldChange(id, false); });
    });

    document.getElementById('message').addEventListener('input', updateMessageCount);

    // Starting to type again removes the "thank you" message.
    form.addEventListener('input', hideSuccess);
  }

  init();
})();
