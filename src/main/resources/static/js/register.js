import { initPhoneInput, showAlert, setupPasswordToggle, isValidLength } from './functions.js';

// Tu función de validación del teléfono
function validatePhone(iti) {
    if (!iti.isValidNumber()) {
        return "Número de teléfono inválido para el país seleccionado.";
    }
    return null;
}

// Regex para validación
const emailRegex = /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]{3,}\.(com|co|es|net|org|edu)$/i;
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

    // Función para mostrar errores
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

    // Función para ocultar errores
    function hideError(input) {
        const formGroup = input.closest(".form-group");
        const errorSpan = formGroup.querySelector(".error-message");
        if (errorSpan) {
            errorSpan.textContent = "";
            errorSpan.classList.remove("has-error");
        }
        input.classList.remove("is-invalid");

    }

    // Escucha el evento de envío del formulario
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Evita el envío del formulario por defecto

        let hasErrors = false;

        // Limpiamos los errores anteriores al inicio de la validación
        hideError(emailInput);
        hideError(passwordInput);
        hideError(confirmPasswordInput);
        hideError(phoneInput);

        // Validación del email
        const emailValue = emailInput.value.trim();
        if (!emailRegex.test(emailValue)) {
            showError(emailInput, 'Formato de correo electrónico inválido. Ej: usuario@dominio.com');
            hasErrors = true;
        } else if (emailValue.includes('..') || emailValue.startsWith('.') || emailValue.endsWith('.')) {
            showError(emailInput, 'El correo electrónico contiene caracteres inválidos o formato incorrecto.');
            hasErrors = true;
        } else if (!isValidLength(emailValue, 5, 254)) {
            showError(emailInput, 'El correo electrónico debe tener entre 5 y 254 caracteres.');
            hasErrors = true;
        }

        // Validación de la contraseña
        if (!passRegex.test(passwordInput.value)) {
            showError(passwordInput, "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.");
            hasErrors = true;
        }

        // Validación de la confirmación de contraseña
        if (passwordInput.value !== confirmPasswordInput.value) {
            showError(confirmPasswordInput, "Las contraseñas no coinciden.");
            hasErrors = true;
        }

        // Validación del teléfono
        const phoneError = validatePhone(iti);
        if (phoneError) {
            showError(phoneInput, phoneError);
            hasErrors = true;
        }

        // Si no hay errores, envía el formulario
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

    // Validar en tiempo real al cambiar el foco del campo
    emailInput.addEventListener("blur", () => {
        const emailValue = emailInput.value.trim();
        hideError(emailInput); // Clear previous error
        if (emailValue) {
            if (!emailRegex.test(emailValue)) {
                showError(emailInput, 'Formato de correo electrónico inválido. Ej: usuario@dominio.com');
            } else if (emailValue.includes('..') || emailValue.startsWith('.') || emailValue.endsWith('.')) {
                showError(emailInput, 'El correo electrónico contiene caracteres inválidos o formato incorrecto.');
            } else if (!isValidLength(emailValue, 5, 254)) {
                showError(emailInput, 'El correo electrónico debe tener entre 5 y 254 caracteres.');
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