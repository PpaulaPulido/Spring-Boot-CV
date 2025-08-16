import { initPhoneInput, showAlert } from './functions.js';

document.addEventListener('DOMContentLoaded', function () {
    const formRegister = document.getElementById("registerForm");
    const iti = initPhoneInput("#phone");

    formRegister.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Obtener datos del formulario
        const formData = {
            firstName: document.getElementById("firstName").value.trim(),
            lastName: document.getElementById("lastName").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: iti.getNumber(), // Obtiene número completo con código de país
            password: document.getElementById("password").value,
            confirmPassword: document.getElementById("confirmPassword").value
        };

        // Validación de email
        const emailRegex = /^(?=[^\s@]*[a-zA-Z])[^\s@]+@[^\s@]+\.(com|co|net|org)$/;
        if (!emailRegex.test(formData.email)) {
            showAlert({
                icon: 'error',
                title: 'Correo inválido',
                // html: 'Debe incluir letras antes de @ y terminar en .com, .co, .net o .org'
            });
            return;
        }

        // Validación de teléfono
        if (!iti.isValidNumber()) {
            showAlert({
                icon: 'error',
                title: 'Teléfono inválido',
                html: 'El número no es válido para el país seleccionado'
            });
            return;
        }

        // Validación de contraseña
        const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!passRegex.test(formData.password)) {
            showAlert({
                icon: 'error',
                title: 'Contraseña débil',
                html: 'Debe tener mínimo 8 caracteres, una mayúscula, un número y un caracter especial'
            });
            return;
        }

        // Confirmación de contraseña
        if (formData.password !== formData.confirmPassword) {
            showAlert({
                icon: 'error',
                title: 'Contraseñas no coinciden',
                html: 'Las contraseñas ingresadas no son iguales'
            });
            return;
        }

        // Enviar datos al backend
        try {
            const response = await fetch("/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                // Mostrar mensaje de error del backend
                showAlert({
                    icon: 'error',
                    title: result.message,
                });
                return;
            }

            // Registro exitoso
            showAlert({
                icon: 'success',
                title: '¡Registro exitoso!',
                html: result.message,
                willClose: () => {
                    window.location.href = "/dashboard"; // Redirigir después de cerrar el alert
                }
            });

            // Resetear formulario
            this.reset();
            iti.setNumber("");
            iti.setCountry("auto");

        } catch (error) {
            showAlert({
                icon: 'error',
                title: 'Error de conexión',
                html: 'No se pudo conectar con el servidor'
            });
            console.error('Error:', error);
        }
    });
});

// Control para el campo de confirmación de contraseña
document.getElementById("toggleConfirmPassword").addEventListener("click", function () {
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const eyeOpen = this.querySelector('.eye-open');
    const eyeClosed = this.querySelector('.eye-closed');
    
    if (confirmPasswordInput.type === "password") {
        confirmPasswordInput.type = "text";
        eyeOpen.style.display = "none";
        eyeClosed.style.display = "block";
        this.setAttribute('aria-label', 'Ocultar contraseña');
    } else {
        confirmPasswordInput.type = "password";
        eyeOpen.style.display = "block";
        eyeClosed.style.display = "none";
        this.setAttribute('aria-label', 'Mostrar contraseña');
    }
});