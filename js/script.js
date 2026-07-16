const settingsForm = document.getElementById("settings-form");
const formStatus = document.getElementById("form-status");
const resetBtn = document.getElementById("reset-btn");
const bioField = document.getElementById("bio");
const bioCount = document.getElementById("bio-count");

const fields = {
  displayName: {
    input: document.getElementById("display-name"),
    error: document.getElementById("display-name-error"),
    validate(value) {
      if (!value.trim()) {
        return "Display name is required.";
      }
      if (value.trim().length < 2) {
        return "Display name must be at least 2 characters.";
      }
      return "";
    },
  },
  email: {
    input: document.getElementById("email"),
    error: document.getElementById("email-error"),
    validate(value) {
      if (!value.trim()) {
        return "Email address is required.";
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value.trim())) {
        return "Enter a valid email address.";
      }
      return "";
    },
  },
  username: {
    input: document.getElementById("username"),
    error: document.getElementById("username-error"),
    validate(value) {
      if (!value.trim()) {
        return "Username is required.";
      }
      if (value.length < 3 || value.length > 20) {
        return "Username must be between 3 and 20 characters.";
      }
      if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        return "Username can only contain letters, numbers, and underscores.";
      }
      return "";
    },
  },
  bio: {
    input: bioField,
    error: document.getElementById("bio-error"),
    validate(value) {
      if (value.length > 200) {
        return "Bio cannot exceed 200 characters.";
      }
      return "";
    },
  },
  language: {
    input: document.getElementById("language"),
    error: document.getElementById("language-error"),
    validate(value) {
      if (!value) {
        return "Please select a language.";
      }
      return "";
    },
  },
  currentPassword: {
    input: document.getElementById("current-password"),
    error: document.getElementById("current-password-error"),
    validate(value) {
      if (!value) {
        return "Current password is required.";
      }
      if (value.length < 8) {
        return "Current password must be at least 8 characters.";
      }
      return "";
    },
  },
  newPassword: {
    input: document.getElementById("new-password"),
    error: document.getElementById("new-password-error"),
    validate(value) {
      if (!value) {
        return "";
      }
      if (value.length < 8) {
        return "New password must be at least 8 characters.";
      }
      if (!/(?=.*[A-Za-z])(?=.*\d)/.test(value)) {
        return "New password must include at least one letter and one number.";
      }
      return "";
    },
  },
  confirmPassword: {
    input: document.getElementById("confirm-password"),
    error: document.getElementById("confirm-password-error"),
    validate(value, formData) {
      const newPassword = formData.newPassword;
      if (newPassword && value !== newPassword) {
        return "Passwords do not match.";
      }
      if (newPassword && !value) {
        return "Please confirm your new password.";
      }
      return "";
    },
  },
};

function setFieldError(fieldKey, message) {
  const field = fields[fieldKey];
  field.error.textContent = message;
  field.input.classList.toggle("is-invalid", Boolean(message));
}

function validateField(fieldKey, formData) {
  const field = fields[fieldKey];
  const message = field.validate(field.input.value, formData);
  setFieldError(fieldKey, message);
  return !message;
}

function getFormData() {
  return {
    displayName: fields.displayName.input.value,
    email: fields.email.input.value,
    username: fields.username.input.value,
    bio: fields.bio.input.value,
    language: fields.language.input.value,
    currentPassword: fields.currentPassword.input.value,
    newPassword: fields.newPassword.input.value,
    confirmPassword: fields.confirmPassword.input.value,
  };
}

function validateForm() {
  const formData = getFormData();
  let isValid = true;

  Object.keys(fields).forEach((fieldKey) => {
    const fieldIsValid = validateField(fieldKey, formData);
    if (!fieldIsValid) {
      isValid = false;
    }
  });

  return isValid;
}

function setFormStatus(message, type) {
  formStatus.textContent = message;
  formStatus.className = "form-status";

  if (type) {
    formStatus.classList.add(`form-status--${type}`);
  }
}

function updateBioCount() {
  bioCount.textContent = String(bioField.value.length);
}

Object.keys(fields).forEach((fieldKey) => {
  const field = fields[fieldKey];
  field.input.addEventListener("blur", () => {
    validateField(fieldKey, getFormData());
  });

  field.input.addEventListener("input", () => {
    if (field.input.classList.contains("is-invalid")) {
      validateField(fieldKey, getFormData());
    }
  });
});

bioField.addEventListener("input", updateBioCount);

settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  setFormStatus("");

  if (!validateForm()) {
    setFormStatus("Please fix the errors above before saving.", "error");
    return;
  }

  setFormStatus("Settings saved successfully.", "success");
});

resetBtn.addEventListener("click", () => {
  settingsForm.reset();
  updateBioCount();

  Object.keys(fields).forEach((fieldKey) => {
    setFieldError(fieldKey, "");
  });

  setFormStatus("");
});

updateBioCount();
