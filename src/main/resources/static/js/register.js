import { initPhoneInput, showAlert, setupPasswordToggle } from './functions.js';

document.addEventListener('DOMContentLoaded', function () {
    const formRegister = document.getElementById("registerForm");
    const iti = initPhoneInput("#phone");
    
    // Obtener referencias a todos los campos
    const firstNameInput = document.getElementById("firstName");
    const lastNameInput = document.getElementById("lastName");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    formRegister.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Validar campos vacíos
        if (!firstNameInput.value.trim() || 
            !lastNameInput.value.trim() || 
            !emailInput.value.trim() || 
            !phoneInput.value.trim() || 
            !passwordInput.value || 
            !confirmPasswordInput.value) {
            
            // Mostrar alerta general
            showAlert({
                icon: 'error',
                title: 'Campos incompletos',
                html: 'Por favor completa todos los campos requeridos.'
            });

            // Enfocar el primer campo vacío encontrado
            if (!firstNameInput.value.trim()) {
                firstNameInput.focus();
            } else if (!lastNameInput.value.trim()) {
                lastNameInput.focus();
            } else if (!emailInput.value.trim()) {
                emailInput.focus();
            } else if (!phoneInput.value.trim()) {
                phoneInput.focus();
            } else if (!passwordInput.value) {
                passwordInput.focus();
            } else {
                confirmPasswordInput.focus();
            }
            
            return;
        }

        //datos del formulario
        const formData = {
            firstName: firstNameInput.value.trim(),
            lastName: lastNameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: iti.getNumber(),
            password: passwordInput.value,
            confirmPassword: confirmPasswordInput.value
        };

        //Validacion correo
        const emailRegex = /^(?=[^\s@]*[a-zA-Z])[^\s@]+@[^\s@]+\.(com|co|net|org)$/;
        if (!emailRegex.test(formData.email)) {
            showAlert({
                icon: 'error',
                title: 'Correo inválido',
                html: 'Debe incluir letras antes de @ y terminar en .com, .co, .net o .org'
            });
            emailInput.focus();
            return;
        }

        //validacion numero
        if (!iti.isValidNumber()) {
            showAlert({
                icon: 'error',
                title: 'Teléfono inválido',
                html: 'El número no es válido para el país seleccionado'
            });
            phoneInput.focus();
            return;
        }

        //validacion contraseña
        const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!passRegex.test(formData.password)) {
            showAlert({
                icon: 'error',
                title: 'Contraseña débil',
                html: 'Debe tener mínimo 8 caracteres, una mayúscula, un número y un caracter especial'
            });
            passwordInput.focus();
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            showAlert({
                icon: 'error',
                title: 'Contraseñas no coinciden',
                html: 'Las contraseñas ingresadas no son iguales'
            });
            confirmPasswordInput.focus();
            return;
        }

        // Enviar datos al backe
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
                    window.location.href = "/dashboard";
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

    // Configurar toggles de contraseña
    setupPasswordToggle("togglePassword", "password");
    setupPasswordToggle("toggleConfirmPassword", "confirmPassword");
});