const validators = {
  fullName: function (value) {
    if (!value.trim()) {
      return 'Full name is required.';
    }
    return '';
  },

  email: function (value) {
    if (!value.trim()) {
      return 'Email is required.';
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      return 'Please enter a valid email address.';
    }
    return '';
  },

  password: function (value) {
    if (!value) {
      return 'Password is required.';
    }
    if (value.length < 8) {
      return 'Password must be at least 8 characters.';
    }
    if (!/\d/.test(value)) {
      return 'Password must contain at least one number.';
    }
    return '';
  }
};

const fieldConfig = [
  { inputId: 'full-name', errorId: 'full-name-error', validate: validators.fullName },
  { inputId: 'email', errorId: 'email-error', validate: validators.email },
  { inputId: 'password', errorId: 'password-error', validate: validators.password }
];

function setFieldError(input, errorElement, message) {
  const hasError = message.length > 0;
  input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
  errorElement.textContent = message;
}

function validateField(input, errorElement, validate) {
  const message = validate(input.value);
  setFieldError(input, errorElement, message);
  return message === '';
}

function validateForm(form) {
  let firstInvalidInput = null;
  let isValid = true;

  fieldConfig.forEach(function (field) {
    const input = form.querySelector('#' + field.inputId);
    const errorElement = form.querySelector('#' + field.errorId);
    const fieldIsValid = validateField(input, errorElement, field.validate);

    if (!fieldIsValid) {
      isValid = false;
      if (!firstInvalidInput) {
        firstInvalidInput = input;
      }
    }
  });

  if (firstInvalidInput) {
    firstInvalidInput.focus();
  }

  return isValid;
}

function initSettingsForm() {
  const form = document.getElementById('settings-form');
  if (!form) {
    return;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    validateForm(form);
  });

  fieldConfig.forEach(function (field) {
    const input = form.querySelector('#' + field.inputId);
    const errorElement = form.querySelector('#' + field.errorId);

    input.addEventListener('input', function () {
      if (input.getAttribute('aria-invalid') === 'true') {
        validateField(input, errorElement, field.validate);
      }
    });
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initSettingsForm);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = validators;
}
