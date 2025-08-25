//Libreria para manejar el input de teléfono con banderas y códigos de país
//https://github.com/jackocnr/intl-tel-input

// Librería para manejar el input de teléfono
export function initPhoneInput(inputSelector) {
    const inputPhone = document.querySelector(inputSelector);
    if (!inputPhone) return null;

    const iti = window.intlTelInput(inputPhone, {
        initialCountry: "auto",
        geoIpLookup: function (success, failure) {
            fetch("https://ipapi.co/json")
                .then(res => res.json())
                .then(data => success(data.country_code))
                .catch(() => failure());
        },
        preferredCountries: ['co', 'us', 'mx', 'es', 'ar', 'fr'],
        separateDialCode: true,
        hiddenInput: "full_phone",
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
        customPlaceholder: function (selectedCountryPlaceholder, selectedCountryData) {
            return "Ej: " + selectedCountryPlaceholder;
        }
    });

    inputPhone.placeholder = "";
    return iti;
}

// swalHelper para mostrar alertas personalizadas
export function showAlert({ icon = 'info', title = '', html = '', draggable = false }) {
    let confirmButtonClass = 'btn-red';
    let popupClass = 'border-red';
    let iconClass = 'icon-swal';

    if (icon === 'success') {
        confirmButtonClass = 'btn-green';
        popupClass = 'border-green';
        iconClass = 'icon-swal-green';
    }

    return Swal.fire({
        icon,
        title: `<span class="title-swal">${title}</span>`,
        html: `<div class="div-swal">${html}</div>`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        customClass: {
            confirmButton: confirmButtonClass,
            popup: popupClass,
            title: 'title-swal',
            icon: iconClass,
            htmlContainer: 'div-swal'
        },
        buttonsStyling: false,
        background: '#ffffff',
        draggable
    });
}

// Control para el campo de confirmación de contraseña
export function setupPasswordToggle(buttonId, inputId) {
    const toggleButton = document.getElementById(buttonId);
    const passwordInput = document.getElementById(inputId);

    // Verificamos que los elementos existan antes de agregar el listener
    if (!toggleButton || !passwordInput) {
        console.error(`Error: No se encontró el botón con ID '${buttonId}' o el campo con ID '${inputId}'.`);
        return;
    }

    toggleButton.addEventListener("click", function () {
        const isPassword = passwordInput.type === "password";
        // Aquí está el cambio clave: usamos toggleButton para buscar los elementos
        const eyeOpen = toggleButton.querySelector('.eye-open');
        const eyeClosed = toggleButton.querySelector('.eye-closed');

        passwordInput.type = isPassword ? "text" : "password";
        eyeOpen.style.display = isPassword ? "none" : "block";
        eyeClosed.style.display = isPassword ? "block" : "none";
        toggleButton.setAttribute('aria-label', isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
    });
}

// Función para mostrar errores debajo del campo
export function showError(input, message) {
    if (!input) return;

    const formGroup = input.closest(".form-group");
    if (!formGroup) return;

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
export function hideError(input) {
    if (!input) return;
    const formGroup = input.closest(".form-group");
    if (!formGroup) return;

    const errorSpan = formGroup.querySelector(".error-message");
    if (errorSpan) {
        errorSpan.textContent = "";
        errorSpan.classList.remove("has-error");
    }

    input.classList.remove("is-invalid");
}

// Función para ocultar todos los errores
export function hideAllErrors(form) {
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => hideError(input));
}

// Validación de la imagen
export function validateImage(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
        return 'Formato de imagen no permitido. Use JPG, PNG o JPEG.';
    }

    if (file.size > maxSize) {
        return 'La imagen no puede superar los 5MB.';
    }

    return null;
}
