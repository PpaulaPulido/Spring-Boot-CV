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
        customPlaceholder: function (selectedCountryPlaceholder) {
            return "Ej: " + selectedCountryPlaceholder;
        }
    });

    // Borrar placeholder vacío
    inputPhone.placeholder = "";

    // Función para mostrar mensajes personalizados
    function getPhoneErrorMessage(errorCode) {
        switch (errorCode) {
            case 1: return "El número de teléfono es demasiado corto.";
            case 2: return "El código de país es inválido.";
            case 3: return "El número de teléfono es demasiado corto.";
            case 4: return "El número de teléfono es demasiado largo.";
            case 5: return "No es un número de teléfono válido.";
            case 6: return "El número solo es válido localmente.";
            default: return "Número de teléfono inválido.";
        }
    }

    // Validar al salir del campo
    inputPhone.addEventListener('blur', function () {
        hideError(inputPhone);
        if (!iti.isValidNumber()) {
            const errorMessage = getPhoneErrorMessage(iti.getValidationError());
            showError(inputPhone, errorMessage);
        }
    });

    // Validar en tiempo real
    inputPhone.addEventListener('input', function () {
        hideError(inputPhone);
        if (inputPhone.value.trim() && !iti.isValidNumber()) {
            const errorMessage = getPhoneErrorMessage(iti.getValidationError());
            showError(inputPhone, errorMessage);
        }
    });

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

// Helper Validation Functions
export function isValidLength(value, min, max) {
    const len = value.length;
    return len >= min && len <= max;
}

export function isAlphaNumericSpace(value) {
    return /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/.test(value);
}

export function isAlphaSpace(value) {
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value);
}

export function isValidURL(value) {
    try {
        new URL(value);
        return true;
    } catch (e) {
        return false;
    }
}

// Updated LinkedIn URL validation
export function isLinkedInURL(value) {
    const regex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_]{5,}\/?$/;
    if (!regex.test(value)) {
        return "El perfil de LinkedIn debe iniciar con 'https://www.linkedin.com/in/', tener al menos 5 caracteres válidos (letras, números o guiones) y no contener espacios ni caracteres especiales.";
    }
    return null;
}

export function isValidFullName(value) {
    const trimmedValue = value.trim();

    // 1. No vacío
    if (!trimmedValue) {
        return 'El nombre completo no puede estar vacío.';
    }

    // 2. Longitud total
    if (trimmedValue.length < 4 || trimmedValue.length > 100) {
        return 'El nombre completo debe tener entre 4 y 100 caracteres.';
    }

    // 3. Palabras no permitidas
    const inappropriateWords = [
        'admin', 'usuario', 'test', 'usertest', 'null', 'undefined', 
        'name', 'fake', 'demo', 'prueba', 'xxxx', 'aaaa'
    ];
    const lowerValue = trimmedValue.toLowerCase();
    for (const word of inappropriateWords) {
        if (lowerValue.includes(word)) {
            return 'El nombre contiene palabras no permitidas.';
        }
    }

    // 4. No espacios dobles
    if (/\s{2,}/.test(trimmedValue)) {
        return 'El nombre no puede contener espacios dobles.';
    }

    // 5. Al menos dos palabras
    const nameParts = trimmedValue.split(/\s+/);
    if (nameParts.length < 2) {
        return 'Debe ingresar al menos un nombre y un apellido.';
    }

    // 6. Máximo tres palabras (opcional, ajustable)
    if (nameParts.length > 3) {
        return 'El nombre no puede contener más de tres palabras.';
    }

    // 7. Validación de cada palabra
    const allowedLowercaseConnectors = ['de', 'del', 'la', 'las', 'los', 'y', 'san', 'santa'];
    for (let i = 0; i < nameParts.length; i++) {
        const part = nameParts[i];

        if (part.length < 2 || part.length > 25) {
            return `Cada parte del nombre debe tener entre 2 y 25 caracteres. Problema en: "${part}"`;
        }

        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ'’\-]+$/.test(part)) {
            return `Solo se permiten letras, guiones, apóstrofos y caracteres acentuados. Problema en: "${part}"`;
        }

        if (/(.)\1\1/.test(part)) {
            return `No se permiten caracteres repetidos en exceso. Problema en: "${part}"`;
        }

        if (isKeyboardPattern(part)) {
            return `El texto parece un patrón de teclado no válido. Problema en: "${part}"`;
        }

        if (isSequential(part)) {
            return `El texto parece una secuencia no válida. Problema en: "${part}"`;
        }

        if (!/[aeiouáéíóúüAEIOUÁÉÍÓÚÜ]/.test(part)) {
            return `Cada palabra debe contener al menos una vocal. Problema en: "${part}"`;
        }

        const lowerPart = part.toLowerCase();
        if (!allowedLowercaseConnectors.includes(lowerPart)) {
            if (!/^[A-ZÁÉÍÓÚÑÜ]/.test(part)) {
                return `Cada palabra debe comenzar con mayúscula. Problema en: "${part}"`;
            }
        }
    }

    return null; // Todo correcto
}

export function isValidEmail(email) {
    email = email.trim();

    // 1. Longitud total
    if (email.length < 6 || email.length > 100) {
        return "El email debe tener entre 6 y 100 caracteres.";
    }

    // 2. Regex estricto para formato general
    const regex = /^(?!(.*[._-]){3})[a-zA-Z0-9](?!.*[._-]{2})[a-zA-Z0-9._-]{1,62}[a-zA-Z0-9]@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;
    if (!regex.test(email)) {
        return "Formato de email inválido. Ej: usuario123@dominio.com";
    }

    // 3. Separar partes
    const [localPart, domainAndExt] = email.split('@');
    const domainParts = domainAndExt.split('.');
    const domain = domainParts[0];
    const extension = domainParts.slice(1).join('.');

    // 4. Longitud de partes
    if (localPart.length < 1 || localPart.length > 64) {
        return "La parte local del email es demasiado corta o larga.";
    }
    if (domainAndExt.length < 4 || domainAndExt.length > 253) {
        return "El dominio del email es inválido.";
    }

    // 5. Bloquear dominios temporales
    const disposableDomains = [
        'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com'
    ];
    if (disposableDomains.includes(domainAndExt.toLowerCase())) {
        return "No se permiten direcciones de correo temporales.";
    }

    // 6. Evitar repeticiones excesivas
    if (/(.)\1{3,}/.test(domain)) {
        return "El dominio del email contiene caracteres repetidos en exceso.";
    }
    if (/(.)\1{2,}/.test(localPart)) {
        return "El nombre de usuario no puede tener caracteres repetidos en exceso.";
    }

    // 7. Evitar patrones de teclado y secuencias
    const sequences = ['123', 'abc', 'qwe', 'asd', 'zxc'];
    if (isKeyboardPattern(domain) || isSequential(domain)) {
        return "El dominio del email contiene patrones o secuencias no válidas.";
    }
    if (sequences.some(seq => localPart.toLowerCase().includes(seq))) {
        return "El nombre de usuario no puede ser secuencial o predecible.";
    }

    // 9. Validar caracteres del dominio
    if (!/^[a-zA-Z0-9-]+$/.test(domain)) {
        return "El dominio del email contiene caracteres no permitidos.";
    }
    if (domain.startsWith('-') || domain.endsWith('-')) {
        return "El dominio del email no puede comenzar o terminar con guión.";
    }
    if (domain.length < 3) {
        return "El dominio debe tener al menos 3 caracteres.";
    }

    // 10. Validar extensiones de dominio permitidas
    const allowedExtensions = [
        'com', 'co', 'org', 'net', 'edu', 'gov', 'mil', 'info', 'io', 'me', 'dev', 'tech'
    ];
    if (!allowedExtensions.includes(extension.toLowerCase())) {
        return "Extensión de dominio no permitida. Use .com, .co, .org, .net, etc.";
    }

    return null; // Todo correcto
}

// Función para detectar patrones de teclado (mejorada)
function isKeyboardPattern(text) {
    const lowerText = text.toLowerCase();
    const keyboardPatterns = [
        'qwerty', 'asdf', 'zxcv', 'poiu', 'lkj', 'mnb', 'asdfgh', 'qwertyu',
        '123', 'abc', 'qwe', 'asd', 'zxc', 'iop', 'jkl', 'bnm', '1234', 'abcd',
        'asdfafd', 'ghajksdhgl', 'erqheorybx', 'avxcv,jz', 'sadfasdf', 'asdghadsghkl',
        'asdghlakd', 'dfadgafdgdsgdf', 'sfadfa', 'adfgadfg', 'asdfasdf'
    ];

    return keyboardPatterns.some(pattern => lowerText.includes(pattern));
}

// Función para detectar secuencias
function isSequential(text) {
    const lowerText = text.toLowerCase();

    // Verificar secuencias de 3 o más letras consecutivas
    for (let i = 0; i < lowerText.length - 2; i++) {
        const char1 = lowerText.charCodeAt(i);
        const char2 = lowerText.charCodeAt(i + 1);
        const char3 = lowerText.charCodeAt(i + 2);

        // Secuencia ascendente (abc, bcd, etc.)
        if (char2 === char1 + 1 && char3 === char2 + 1) {
            return true;
        }

        // Secuencia descendente (cba, dcb, etc.)
        if (char2 === char1 - 1 && char3 === char2 - 1) {
            return true;
        }
    }

    return false;
}

function hasExcessiveRepetition(text) {
    // Checks for any character repeated 4 or more times consecutively
    return /(.)\1{3,}/.test(text);
}

export function isValidProfession(value) {
    const trimmedValue = value.trim();

    // 1. Validar que no esté vacío
    if (!trimmedValue) {
        return 'La profesión no puede estar vacía.';
    }

    // 2. Longitud mínima y máxima
    if (trimmedValue.length < 3 || trimmedValue.length > 60) {
        return 'La profesión debe tener entre 3 y 60 caracteres.';
    }

    // 3. Caracteres permitidos (letras, acentos, ñ, guiones, apóstrofos y punto)
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ'’\-. ]+$/.test(trimmedValue)) {
        return 'La profesión solo puede contener letras, espacios y caracteres especiales permitidos.';
    }

    // 4. No permitir caracteres repetidos en exceso
    if (/(.)\1\1/.test(trimmedValue)) {
        return 'La profesión no puede contener caracteres repetidos más de dos veces.';
    }

    // 5. No permitir patrones de teclado o secuencias
    if (isKeyboardPattern(trimmedValue) || isSequential(trimmedValue)) {
        return 'La profesión no puede contener patrones o secuencias predecibles.';
    }

    // 6. Validar capitalización de palabras
    const words = trimmedValue.split(/\s+/);
    const lowerExceptions = ['de', 'del', 'la', 'las', 'los', 'y', 'en', 'para'];
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const lowerWord = word.toLowerCase();

        // Permitir conectores en minúscula
        if (lowerExceptions.includes(lowerWord)) continue;

        if (!/^[A-ZÁÉÍÓÚÑÜ]/.test(word)) {
            return `Cada palabra debe comenzar con mayúscula. Problema en: "${word}"`;
        }
    }

    return null; // Todo correcto
}

// New validation functions

export function isValidAddress(address) {
    if (!address) {
        return 'La dirección es obligatoria';
    }

    // Normalizar espacios y mayúsculas
    address = address.trim().replace(/\s+/g, ' ');

    // 1. Longitud mínima y máxima
    if (address.length < 5 || address.length > 200) {
        return 'La dirección debe tener entre 5 y 200 caracteres.';
    }

    // 2. No solo números
    if (/^\d+$/.test(address.replace(/\s/g, ''))) {
        return 'La dirección no puede contener solo números.';
    }

    // 3. Debe contener al menos un número
    if (!/\d/.test(address)) {
        return 'La dirección debe contener al menos un número.';
    }

    // 4. Patrones sospechosos
    const suspiciousPatterns = [
        /(.)\1{5,}/,              
        /(1234|abcd|asdf|qwerty)/i 
    ];
    for (const pattern of suspiciousPatterns) {
        if (pattern.test(address)) {
            return 'La dirección contiene patrones no válidos.';
        }
    }

    // 5. Tipos de vía aceptados
    const tiposVia = [
        'Calle', 'Carrera', 'Transversal', 'Avenida',
        'Diagonal', 'Circular', 'Autopista', 'Pasaje'
    ];

    // 6. Regex flexible para BIS + orientaciones en cualquier punto lógico
    const regex = new RegExp(
        `^(${tiposVia.join('|')})\\s*` + // Tipo de vía
        `\\d{1,3}[A-Za-z]?(?:\\s+BIS)?(?:\\s+(?:Sur|Norte|Este|Oeste))?\\s*` + // Número de vía + opcionales
        `#\\s*\\d{1,3}[A-Za-z]?(?:\\s+BIS)?(?:\\s+(?:Sur|Norte|Este|Oeste))?\\s*` + // Complemento + opcionales
        `-\\s*\\d{1,3}[A-Za-z]?(?:\\s+(?:Sur|Norte|Este|Oeste))?$`, // Número final + opcional
        'i' // insensible a mayúsculas/minúsculas
    );

    if (!regex.test(address)) {
        return 'Formato inválido. Ejemplo: "Calle 45 BIS Sur # 12B - 34 Norte"';
    }

    return null;
}

export function isValidPersonalPortfolio(value) {
    const regex = /^(https?:\/\/)([a-zA-Z0-9-]{3,})\.(com|co|net|org|dev|io|me)(\/[^\s]*)?$/;
    if (!regex.test(value)) {
        return "El portafolio personal debe ser una URL válida (http:// o https://), con dominios .com, .co, .net, .org, .dev, .io, .me, y al menos 3 caracteres antes del dominio.";
    }
    return null;
}

export function validarResumenProfesional(resumen) {
    // 1. Quitar espacios en blanco al inicio y final
    resumen = resumen.trim();

    // 2. Longitud mínima y máxima
    if (resumen.length < 10) { // Added minimum length check
        return { valido: false, error: "El resumen debe tener al menos 10 caracteres." };
    }
    if (resumen.length > 1000) {
        return { valido: false, error: "El resumen no puede superar los 1000 caracteres." };
    }

    // 3. No permitir solo letras repetidas o secuencias sin sentido
    if (/^([a-zA-Z])\1{4,}$/.test(resumen.replace(/\s+/g, ""))) {
        return { valido: false, error: "El resumen no puede contener caracteres repetidos excesivamente." };
    }

    // 4. Debe contener al menos un verbo (para evitar solo listas de palabras)
    const verbosComunes = /\b(trabajo|desarrollo|gestiono|coordino|creo|analizo|implemento|mejoro|lidero|mantengo|diseño|programo|optimizo|administro)\b/i;
    if (!verbosComunes.test(resumen)) {
        return { valido: false, error: "El resumen debe incluir al menos un verbo relacionado con tu experiencia." };
    }

    // 5. Evitar texto con exceso de caracteres idénticos seguidos (indicador de spam o relleno)
    if (/(.)\1{5,}/.test(resumen)) {
        return { valido: false, error: "El resumen no debe contener caracteres repetidos más de 5 veces seguidas." };
    }

    // 6. Evitar que sean solo números o símbolos
    if (/^[^a-zA-Z]+$/.test(resumen)) {
        return { valido: false, error: "El resumen debe contener letras." };
    }

    // 7. Verificar que tenga al menos dos frases (punto y seguido o salto de línea)
    if (!/[\.!\?]/.test(resumen)) {
        return { valido: false, error: "El resumen debe contener al menos dos oraciones." };
    }

    return { valido: true, error: null };
}

export function validarNombreEntidad(valor, tipo) {
    if (!valor || !valor.trim()) {
        return { valido: false, mensaje: `El ${tipo} es requerido` };
    }

    // Validar longitud mínima y máxima
    if (valor.length < 2) {
        return { valido: false, mensaje: `El ${tipo} debe tener al menos 2 caracteres` };
    }

    if (valor.length > 255) {
        return { valido: false, mensaje: `El ${tipo} no puede exceder los 255 caracteres` };
    }

    // Validar que no contenga caracteres repetidos excesivamente
    if (hasExcessiveRepetition(valor)) {
        return { valido: false, mensaje: `El ${tipo} contiene caracteres repetidos excesivamente` };
    }

    // Validar que contenga al menos una vocal
    if (!/[aeiouáéíóú]/i.test(valor)) {
        return { valido: false, mensaje: `El ${tipo} debe contener vocales` };
    }

    // Validar formato básico (letras, espacios, algunos caracteres especiales)
    if (!/^[a-záéíóúñ\s\-.,()&]+$/i.test(valor)) {
        return { valido: false, mensaje: `El ${tipo} contiene caracteres no permitidos` };
    }

    // No permitir patrones de teclado o secuencias
    if (isKeyboardPattern(valor) || isSequential(valor)) {
        return { valido: false, mensaje: `El ${tipo} parece un patrón de teclado o secuencia no válida.` };
    }

    // Validar que no haya secuencias largas de consonantes
    if (/[bcdfghjklmnpqrstvwxyzñ]{5,}/i.test(valor.replace(/\s/g, ''))) {
        return { valido: false, mensaje: `El ${tipo} parece contener secuencias de consonantes muy largas.` };
    }

    // Validar que cada palabra tenga vocales
    const words = valor.split(/\s+/);
    for (const word of words) {
        if (word.length > 2 && !/[aeiouáéíóú]/i.test(word)) {
            return { valido: false, mensaje: `El texto en ${tipo} contiene palabras sin vocales como \"${word}\".` };
        }
    }

    return { valido: true, mensaje: '' };
}

export function normalizeSkillText(s) {
    return (s || "")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // quita acentos
}

export function isValidTechnicalSkillName(value) {
    const v = (value || "").trim();

    // Longitud
    if (v.length < 2 || v.length > 50) {
        return "La habilidad técnica debe tener entre 2 y 50 caracteres.";
    }

    // Permitir letras, números, espacios y símbolos comunes
    if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.+#()_\-\/&]+$/.test(v)) {
        return "La habilidad técnica contiene caracteres no permitidos.";
    }

    // Evitar repeticiones exageradas de caracteres
    if (/(.)\1{3,}/.test(v)) {
        return "La habilidad técnica no puede repetir el mismo carácter más de 4 veces seguidas.";
    }

    // Debe contener al menos una palabra de 2 o más letras seguidas
    if (!/\b[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]{2,}\b/.test(v)) {
        return "La habilidad técnica debe contener al menos una palabra válida.";
    }

    // Evitar paréntesis con menos de 3 caracteres dentro
    if (/\([^)]{0,2}\)/.test(v)) {
        return "El texto entre paréntesis es demasiado corto o inválido.";
    }

    // Lista ampliada de palabras basura
    const basura = [
        "asdf", "qwerty", "lorem", "ipsum", "test", "xxxxx", "zzzzz",
        "dfadgafdgdsgdf", "sfadfa", "afdadsf", "hñljkñh", "eiruqpowieyt",
        "cxvbzm", "asdfasdf", "adfgadfg", "sadfasdf", "ghajksdhgl"
    ];
    const n = normalizeSkillText(v);
    if (basura.some(b => n.includes(b))) {
        return "La habilidad técnica parece texto de prueba o inválido.";
    }

    // Detectar patrones de teclado
    if (isKeyboardSequence(v)) {
        return "La habilidad técnica parece un patrón de teclado no válido.";
    }

    // Validar proporción vocales/consonantes
    if (!hasValidVowelConsonantRatio(v)) {
        return "La habilidad técnica no tiene una proporción válida de vocales y consonantes.";
    }

    // Evitar spam de caracteres especiales
    if (isSpecialCharacterSpam(v)) {
        return "La habilidad técnica contiene demasiados caracteres especiales en relación con las letras.";
    }

    // Detectar patrones repetitivos
    if (hasRepeatingPatterns(v)) {
        return "La habilidad técnica contiene patrones repetitivos no válidos.";
    }

    // Validar que no haya secuencias largas de consonantes
    if (/[bcdfghjklmnpqrstvwxyzñ]{5,}/i.test(v.replace(/\s/g, ''))) {
        return "La habilidad técnica parece contener secuencias de consonantes muy largas.";
    }

    // Validar que cada palabra tenga vocales (con excepciones para C++, C#, etc.)
    const words = v.split(/\s+/);
    for (const word of words) {
        if (/^(c#|c\+\+)$/i.test(word)) continue;
        if (word.length > 2 && !/[aeiouáéíóú]/i.test(word)) {
            return `El texto en la habilidad técnica contiene palabras sin vocales como \"${word}\".`;
        }
    }

    return null;
}

export function isValidSoftSkillName(value) {
    const v = (value || "").trim();

    // Longitud
    if (v.length < 2 || v.length > 50) {
        return "La habilidad blanda debe tener entre 2 y 50 caracteres.";
    }

    // Permitir letras, espacios y algunos símbolos comunes (similar a technical skills pero más restrictivo)
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.,\-()]+$/.test(v)) {
        return "La habilidad blanda contiene caracteres no permitidos.";
    }

    // Evitar repeticiones exageradas de caracteres
    if (/(.)\1{3,}/.test(v)) {
        return "La habilidad blanda no puede repetir el mismo carácter más de 4 veces seguidas.";
    }

    // Debe contener al menos una palabra de 2 o más letras seguidas
    if (!/\b[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]{2,}\b/.test(v)) {
        return "La habilidad blanda debe contener al menos una palabra válida.";
    }

    // Evitar paréntesis con menos de 3 caracteres dentro
    if (/\([^)]{0,2}\)/.test(v)) {
        return "El texto entre paréntesis es demasiado corto o inválido.";
    }

    // Lista ampliada de palabras basura
    const basura = [
        "asdf", "qwerty", "lorem", "ipsum", "test", "xxxxx", "zzzzz",
        "dfadgafdgdsgdf", "sfadfa", "afdadsf", "hñljkñh", "eiruqpowieyt",
        "cxvbzm", "asdfasdf", "adfgadfg", "sadfasdf", "ghajksdhgl"
    ];
    const n = normalizeSkillText(v);
    if (basura.some(b => n.includes(b))) {
        return "La habilidad blanda parece texto de prueba o inválido.";
    }

    // Detectar patrones de teclado
    if (isKeyboardSequence(v)) {
        return "La habilidad blanda parece un patrón de teclado no válido.";
    }

    // Validar proporción vocales/consonantes
    if (!hasValidVowelConsonantRatio(v)) {
        return "La habilidad blanda no tiene una proporción válida de vocales y consonantes.";
    }

    // Evitar spam de caracteres especiales (más restrictivo para soft skills)
    if (isSpecialCharacterSpam(v, true)) { // Pass true for soft skills to be more strict
        return "La habilidad blanda contiene demasiados caracteres especiales en relación con las letras.";
    }

    // Detectar patrones repetitivos
    if (hasRepeatingPatterns(v)) {
        return "La habilidad blanda contiene patrones repetitivos no válidos.";
    }

    // Validar que no haya secuencias largas de consonantes
    if (/[bcdfghjklmnpqrstvwxyzñ]{5,}/i.test(v.replace(/\s/g, ''))) {
        return "La habilidad blanda parece contener secuencias de consonantes muy largas.";
    }

    // Validar que cada palabra tenga vocales
    const words = v.split(/\s+/);
    for (const word of words) {
        if (word.length > 2 && !/[aeiouáéíóú]/i.test(word)) {
            return `El texto en la habilidad blanda contiene palabras sin vocales como \"${word}\".`;
        }
    }

    return null;
}

// Detectar secuencias de teclado
function isKeyboardSequence(text) {
    const keyboardRows = [
        'qwertyuiop', 'asdfghjkl', 'zxcvbnm',
        '1234567890', 'poiuytrewq', 'lkjhgfdsa', 'mnbvcxz'
    ];
    const lowerText = text.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (let i = 0; i <= lowerText.length - 4; i++) {
        const segment = lowerText.substring(i, i + 4);
        for (const row of keyboardRows) {
            if (row.includes(segment)) {
                return true;
            }
        }
    }
    return false;
}

// Validar proporción vocales/consonantes
function hasValidVowelConsonantRatio(text) {
    const cleanText = text.replace(/[^a-záéíóúñü]/gi, '');
    if (cleanText.length < 4) return true;
    const vowelCount = (cleanText.match(/[aeiouáéíóúü]/gi) || []).length;
    const vowelRatio = vowelCount / cleanText.length;
    return vowelRatio >= 0.15 && vowelRatio <= 0.85;
}

// Detectar spam de caracteres especiales
function isSpecialCharacterSpam(text, isSoftSkill = false) {
    const letterCount = (text.match(/[a-záéíóúñü]/gi) || []).length;
    // Count any character that is not a letter, number, or space
    const specialCharCount = (text.match(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]/g) || []).length;
    if (isSoftSkill) {
        return specialCharCount > letterCount * 0.3; // Más estricto para soft skills
    }
    return specialCharCount > letterCount;
}

// Detectar patrones repetitivos
function hasRepeatingPatterns(text) {
    const lowerText = text.toLowerCase();
    const patterns = [
        /(.)\1{2,}/,
        /(..)\1{2,}/,
        /(...)\1{2,}/,
        /(asd|qwe|zxc|jkl|iop|bnm){2,}/i
    ];
    return patterns.some(pattern => pattern.test(lowerText));
}

export function isValidTechnicalCategory(value) {
    const v = (value || "").trim();
    if (!v) return null; // opcional
    if (v.length < 2 || v.length > 50) {
        return "La categoría debe tener entre 2 y 50 caracteres.";
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(v)) {
        return "La categoría solo puede contener letras y espacios.";
    }
    if (hasExcessiveRepetition(v)) {
        return "La categoría no puede repetir el mismo carácter más de 3 veces seguidas.";
    }
    const basura = ["asdf", "qwerty", "lorem", "ipsum", "test", "xxxxx", "zzzzz"];
    const n = normalizeSkillText(v);
    if (basura.some(b => n.includes(b))) {
        return "La categoría parece texto de prueba o inválido.";
    }

    // Validar que no haya secuencias largas de consonantes
    if (/[bcdfghjklmnpqrstvwxyzñ]{5,}/i.test(v.replace(/\s/g, ''))) {
        return "La categoría parece contener secuencias de consonantes muy largas.";
    }

    // Validar que cada palabra tenga vocales
    const words = v.split(/\s+/);
    for (const word of words) {
        if (word.length > 2 && !/[aeiouáéíóú]/i.test(word)) {
            return `El texto en la categoría contiene palabras sin vocales como \"${word}\".`;
        }
    }

    return null;
}

export function isDuplicateSkillNormalized(name, list) {
    const n = normalizeSkillText(name);
    return list.some(s => normalizeSkillText(s.name) === n);
}

export function isDuplicateSkillGlobal(name, softList, techList) {
    const n = normalizeSkillText(name);
    return (
        softList.some(s => normalizeSkillText(s.name) === n) ||
        techList.some(s => normalizeSkillText(s.name) === n)
    );
}

export function isValidDescription(value) {
    const cleanValue = value.trim();

    // Longitud mínima y máxima
    if (cleanValue.length < 10 || cleanValue.length > 1000) return false;

    // Evitar repeticiones exageradas de caracteres (ej: aaaaaa o sssssss)
    if (/(.)\1{4,}/.test(cleanValue)) return false;

    // Evitar solo caracteres especiales o números
    if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(cleanValue)) return false;

    // Evitar texto de una sola palabra
    if (cleanValue.split(/\s+/).length < 3) return false;

    return true;
}

export function validarFecha(fechaStr) {
    // Convertir a objeto Date
    const fecha = new Date(fechaStr + '-01'); // Add -01 to treat as first day of month

    // Verificar que sea una fecha válida
    if (isNaN(fecha.getTime())) {
        return { valido: false, mensaje: "La fecha no es válida" };
    }

    const año = fecha.getFullYear();
    const añoMin = 1950; // No aceptar fechas anteriores a 1950
    const fechaActual = new Date(); // Get current date and time
    const añoActual = fechaActual.getFullYear();
    const mesActual = fechaActual.getMonth(); // 0-11
    const diaActual = fechaActual.getDate();

    const fechaComparacion = new Date(año, fecha.getMonth(), 1); // First day of the month to compare
    const fechaActualComparacion = new Date(añoActual, mesActual, 1); // First day of current month

    if (año < añoMin) {
        return { valido: false, mensaje: `El año no puede ser menor a ${añoMin}` };
    }

    // Check if date is in the future (YearMonth comparison)
    if (fechaComparacion > fechaActualComparacion) {
        return { valido: false, mensaje: "La fecha no puede ser futura" };
    }

    return { valido: true, mensaje: "Fecha válida" };
}