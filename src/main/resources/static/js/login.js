import {showAlert, setupPasswordToggle } from './functions.js';

document.addEventListener('DOMContentLoaded', function () {
    const formLogin = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    formLogin.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Validar campos vacíos
        if (!emailInput.value.trim() || !passwordInput.value) {
            showAlert({
                icon: 'error',
                title: 'Campos requeridos',
                html: 'Por favor, completa todos los campos'
            });
            
            // Enfocar el primer campo vacío
            if (!emailInput.value.trim()) {
                emailInput.focus();
            } else {
                passwordInput.focus();
            }
            return;
        }

        const formData = {
            email: emailInput.value.trim(),
            password: passwordInput.value,
        };

        try {
            const response = await fetch("/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                // Mostrar correo no existe o contraseña incorrecta
                showAlert({
                    icon: 'error',
                    title: result.message,
                });
                return;
            }

            // Login exitoso
            showAlert({
                icon: 'success',
                title: '¡Bienvenido!',
                willClose: () => {
                    window.location.href = "/dashboard"; // Redirigir al dashboard
                }
            });

        } catch (error) {
            showAlert({
                icon: 'error',
                title: 'Error de conexión',
                html: 'No se pudo conectar con el servidor. Intenta nuevamente.'
            });
            console.error('Error:', error);
        }
    });

    setupPasswordToggle("togglePassword", "password");
});