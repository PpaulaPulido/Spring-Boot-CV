import { initPhoneInput, showAlert, setupPasswordToggle } from './functions.js';
import { isValidEmail } from './functions.js';

function validatePhone(iti) {
    if (!iti.isValidNumber()) {
        return "Número de teléfono inválido para el país seleccionado.";
    }
    return null;
}

// Regex para validación de contraseña
const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const phoneInput = document.getElementById("phone");

    const iti = initPhoneInput("#phone");
    setupPasswordToggle("togglePassword", "password");
    setupPasswordToggle("toggleConfirmPassword", "confirmPassword");

    function showError(input, message) {
        const formGroup = input.closest(".form-group");
        let errorSpan = formGroup.querySelector(".error-message");
        if (!errorSpan) {
            errorSpan = document.createElement("span");
            errorSpan.className = "error-message";
            formGroup.appendChild(errorSpan);
        }
        errorSpan.textContent = message;
        errorSpan.classList.add("has-error");
        input.classList.add("is-invalid");
    }

    function hideError(input) {
        const formGroup = input.closest(".form-group");
        const errorSpan = formGroup.querySelector(".error-message");
        if (errorSpan) {
            errorSpan.textContent = "";
            errorSpan.classList.remove("has-error");
        }
        input.classList.remove("is-invalid");
    }

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        let hasErrors = false;

        hideError(emailInput);
        hideError(passwordInput);
        hideError(confirmPasswordInput);
        hideError(phoneInput);

        // ✅ Validación de email con isValidEmail
        const emailValue = emailInput.value.trim();
        const emailError = isValidEmail(emailValue);
        if (emailError) {
            showError(emailInput, emailError);
            hasErrors = true;
        }

        // ✅ Validación de contraseña
        if (!passRegex.test(passwordInput.value)) {
            showError(passwordInput, "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.");
            hasErrors = true;
        }

        // ✅ Confirmar contraseña
        if (passwordInput.value !== confirmPasswordInput.value) {
            showError(confirmPasswordInput, "Las contraseñas no coinciden.");
            hasErrors = true;
        }

        // ✅ Validación de teléfono
        const phoneError = validatePhone(iti);
        if (phoneError) {
            showError(phoneInput, phoneError);
            hasErrors = true;
        }

        // ✅ Si no hay errores, enviar formulario
        if (!hasErrors) {
            showAlert({
                icon: "success",
                title: "¡Éxito!",
                html: "El usuario se guardó con éxito.",
            }).then(() => {
                registerForm.submit();
            });
        } else {
            showAlert({
                icon: "error",
                title: "Oops...",
                html: "Por favor, corrige los errores en el formulario.",
            });
        }
    });

    // ✅ Validación en tiempo real de email
    emailInput.addEventListener("blur", () => {
        const emailValue = emailInput.value.trim();
        hideError(emailInput);
        if (emailValue) {
            const emailError = isValidEmail(emailValue);
            if (emailError) {
                showError(emailInput, emailError);
            }
        }
    });

    passwordInput.addEventListener("blur", () => {
        if (passRegex.test(passwordInput.value)) {
            hideError(passwordInput);
        } else if (passwordInput.value !== "") {
            showError(passwordInput, "La contraseña no cumple con los requisitos.");
        }
    });

    confirmPasswordInput.addEventListener("blur", () => {
        if (passwordInput.value === confirmPasswordInput.value && confirmPasswordInput.value !== "") {
            hideError(confirmPasswordInput);
        } else if (confirmPasswordInput.value !== "") {
            showError(confirmPasswordInput, "Las contraseñas no coinciden.");
        }
    });

    phoneInput.addEventListener("blur", () => {
        const phoneError = validatePhone(iti);
        if (!phoneError) {
            hideError(phoneInput);
        } else if (phoneInput.value !== "") {
            showError(phoneInput, phoneError);
        }
    });
});
