import { initPhoneInput, showAlert, setupPasswordToggle } from './functions.js';

// Tu función de validación del teléfono
function validatePhone(iti) {
    if (!iti.isValidNumber()) {
        return "Número de teléfono inválido para el país seleccionado.";
    }
    return null;
}

// Regex para validación
const emailRegex = /^(?=[^\s@]*[a-zA-Z])[^\s@]+@[^\s@]+\.(com|co|net|org)$/;
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
        if (!emailRegex.test(emailInput.value)) {
            showError(emailInput, "Formato de correo inválido. Solo se aceptan .com, .co, .net, .org y debe empezar con una letra.");
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
            registerForm.submit();
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
        if (emailRegex.test(emailInput.value)) {
            hideError(emailInput);
        } else if (emailInput.value !== "") {
            showError(emailInput, "Formato de correo inválido.");
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