import { setupPasswordToggle } from './functions.js';

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    // Función para mostrar errores debajo del campo
    function showError(input, message) {
        const formGroup = input.closest(".form-group");
        const errorSpan = formGroup.querySelector(".error-message");
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.classList.add("has-error");
        }
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

    // Configura la funcionalidad del "ojito" para la contraseña
    setupPasswordToggle("togglePassword", "password");

    loginForm.addEventListener("submit", (e) => {
        let hasErrors = false;

        // Limpia los errores anteriores
        hideError(usernameInput);
        hideError(passwordInput);

        // Validación de campos vacíos
        if (usernameInput.value.trim() === "") {
            showError(usernameInput, "El correo electrónico es requerido.");
            hasErrors = true;
        }

        if (passwordInput.value.trim() === "") {
            showError(passwordInput, "La contraseña es requerida.");
            hasErrors = true;
        }

    });

    usernameInput.addEventListener("blur", () => {
        if (usernameInput.value.trim() !== "") {
            hideError(usernameInput);
        }
    });
    
    passwordInput.addEventListener("blur", () => {
        if (passwordInput.value.trim() !== "") {
            hideError(passwordInput);
        }
    });
});