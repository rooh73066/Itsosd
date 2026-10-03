const signupForm = document.getElementById("signupForm");

const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const phone = document.getElementById("phone-n");
const address = document.getElementById("address");

const usernameError = document.getElementById("usernameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const phoneError = document.getElementById("phoneError");
const addressError = document.getElementById("addressError");

const togglePassword = document.getElementById("togglePassword");

// =========================================================
// SHOW / HIDE PASSWORD
// =========================================================

togglePassword.addEventListener("click", () => {
  if (password.type === "password") {
    password.type = "text";
    togglePassword.textContent = "Hide";
  } else {
    password.type = "password";
    togglePassword.textContent = "Show";
  }
});

// =========================================================
// ERROR FUNCTION
// =========================================================

function showError(input, errorElement, message) {
  input.classList.add("error");
  input.classList.remove("success");

  errorElement.textContent = message;
}

// =========================================================
// SUCCESS FUNCTION
// =========================================================

function showSuccess(input, errorElement) {
  input.classList.remove("error");
  input.classList.add("success");

  errorElement.textContent = "";
}

// =========================================================
// VALIDATE NAME
// =========================================================

function validateUsername() {
  const value = username.value.trim();

  if (value === "") {
    showError(username, usernameError, "Full name is required.");

    return false;
  }

  if (value.length < 3) {
    showError(
      username,
      usernameError,
      "Name must contain at least 3 characters.",
    );

    return false;
  }

  showSuccess(username, usernameError);

  return true;
}

// =========================================================
// VALIDATE EMAIL
// =========================================================

function validateEmail() {
  const value = email.value.trim();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value === "") {
    showError(email, emailError, "Email address is required.");

    return false;
  }

  if (!emailPattern.test(value)) {
    showError(email, emailError, "Please enter a valid email address.");

    return false;
  }

  showSuccess(email, emailError);

  return true;
}

// =========================================================
// VALIDATE PASSWORD
// =========================================================

function validatePassword() {
  const value = password.value;

  if (value === "") {
    showError(password, passwordError, "Password is required.");

    return false;
  }

  if (value.length < 8) {
    showError(
      password,
      passwordError,
      "Password must contain at least 8 characters.",
    );

    return false;
  }

  if (!/[A-Z]/.test(value)) {
    showError(
      password,
      passwordError,
      "Password must contain an uppercase letter.",
    );

    return false;
  }

  if (!/[0-9]/.test(value)) {
    showError(password, passwordError, "Password must contain a number.");

    return false;
  }

  showSuccess(password, passwordError);

  return true;
}

// =========================================================
// VALIDATE PHONE
// =========================================================

function validatePhone() {
  const value = phone.value.trim();

  const phonePattern = /^[0-9+\-\s()]{7,20}$/;

  if (value === "") {
    showError(phone, phoneError, "Phone number is required.");

    return false;
  }

  if (!phonePattern.test(value)) {
    showError(phone, phoneError, "Please enter a valid phone number.");

    return false;
  }

  showSuccess(phone, phoneError);

  return true;
}

// =========================================================
// VALIDATE ADDRESS
// =========================================================

function validateAddress() {
  const value = address.value.trim();

  if (value === "") {
    showError(address, addressError, "Address is required.");

    return false;
  }

  if (value.length < 5) {
    showError(address, addressError, "Please enter a valid address.");

    return false;
  }

  showSuccess(address, addressError);

  return true;
}

// =========================================================
// REAL-TIME VALIDATION
// =========================================================

username.addEventListener("input", validateUsername);
email.addEventListener("input", validateEmail);
password.addEventListener("input", validatePassword);
phone.addEventListener("input", validatePhone);
address.addEventListener("input", validateAddress);

// =========================================================
// FORM SUBMIT
// =========================================================

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const isUsernameValid = validateUsername();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isPhoneValid = validatePhone();
  const isAddressValid = validateAddress();

  if (
    isUsernameValid &&
    isEmailValid &&
    isPasswordValid &&
    isPhoneValid &&
    isAddressValid
  ) {
    // alert("Registration successful!");

    // Later you can send the data to your Node.js / Express backend.
    signupForm.submit();
  }
});
