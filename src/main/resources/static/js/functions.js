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

export function isValidEmail(email) {
    email = email.trim();

    // Validar longitud total
    if (email.length < 6 || email.length > 100) {
        return "El email debe tener entre 6 y 100 caracteres.";
    }

    // Regex general
    const regex = /^[a-zA-Z0-9](?!.*[._-]{2})[a-zA-Z0-9._-]{2,}@[a-zA-Z0-9-]{3,}\.(com|co|es|net|org|edu)$/i;
    if (!regex.test(email)) {
        return "Formato de email inválido. Ej: usuario123@dominio.com";
    }

    const [localPart, domainAndExt] = email.split('@');
    const [domain, extension] = domainAndExt.split('.');

    // No permitir caracteres repetidos más de 2 veces
    if (/(.)\1\1/.test(localPart)) {
        return "El nombre de usuario no puede tener caracteres repetidos en exceso.";
    }

    // No permitir secuencias simples
    const sequences = ['123', 'abc', 'qwe', 'asd', 'zxc'];
    if (sequences.some(seq => localPart.toLowerCase().includes(seq))) {
        return "El nombre de usuario no puede ser secuencial o predecible.";
    }

    // Evitar solo letras
    if (/^[a-zA-Z]{3,}$/.test(localPart)) {
        return "El email debe incluir números o caracteres adicionales, no solo letras.";
    }

    // Validar dominio
    if (domain.length < 3 || /^-/.test(domain) || /-$/.test(domain)) {
        return "El dominio debe tener al menos 3 caracteres y no puede empezar o terminar con guion.";
    }

    return null; // Todo correcto
}

export function isValidFullName(value) {
    const trimmedValue = value.trim();

    // 1. Validar que no esté vacío
    if (!trimmedValue) {
        return 'El nombre completo no puede estar vacío.';
    }

    // 2. Validar longitud total
    if (trimmedValue.length < 4 || trimmedValue.length > 100) {
        return 'El nombre completo debe tener entre 4 y 100 caracteres.';
    }

    // 3. Validar que tenga al menos dos palabras
    const nameParts = trimmedValue.split(/\s+/).filter(part => part.length > 0);
    if (nameParts.length < 2) {
        return 'Debe ingresar al menos un nombre y un apellido.';
    }

    // 4. Validar cada parte del nombre
    for (let i = 0; i < nameParts.length; i++) {
        const part = nameParts[i];
        
        // Longitud de cada parte
        if (part.length < 2 || part.length > 25) {
            return `Cada parte del nombre debe tener entre 2 y 25 caracteres. Problema en: "${part}"`;
        }
        
        // Caracteres permitidos (letras, algunos caracteres especiales)
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ'’\-]+$/.test(part)) {
            return `Solo se permiten letras y algunos caracteres especiales (ñ, acentos, ' y -). Problema en: "${part}"`;
        }
        
        // No más de 2 caracteres repetidos consecutivos
        if (/(.)\1\1/.test(part)) {
            return `No se permiten caracteres repetidos en exceso. Problema en: "${part}"`;
        }
        
        // No patrones de teclado comunes
        if (isKeyboardPattern(part)) {
            return `El texto parece un patrón de teclado no válido. Problema en: "${part}"`;
        }
        
        // No secuencias alfanuméricas
        if (isSequential(part)) {
            return `El texto parece una secuencia no válida. Problema en: "${part}"`;
        }
        
        // Validar que comience con mayúscula (excepto para prefijos como "de", "del")
        const lowerPart = part.toLowerCase();
        if (i > 0 && (lowerPart === 'de' || lowerPart === 'del' || lowerPart === 'la' || lowerPart === 'las' || lowerPart === 'los')) {
            // Los prefijos pueden estar en minúscula
            continue;
        }
        
        if (!/^[A-ZÁÉÍÓÚÑÜ]/.test(part)) {
            return `Cada palabra debe comenzar con mayúscula. Problema en: "${part}"`;
        }
    }
    
    return null; // No error
}

// Función para detectar patrones de teclado
function isKeyboardPattern(text) {
    const lowerText = text.toLowerCase();
    const keyboardPatterns = [
        'qwerty', 'asdf', 'zxcv', 'poiu', 'lkj', 'mnb',
        '123', 'abc', 'qwe', 'asd', 'zxc', 'iop', 'jkl', 'bnm'
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

export function isValidAddress(value) {
    const trimmedValue = value.trim();
    const regex = /^(?! )[a-zA-ZÀ-ÿ0-9\s,.\-#\/]{10,150}(?<! )$/; // Fixed: Escaped hyphen

    if (!regex.test(trimmedValue)) {
        return "La dirección debe tener entre 10 y 150 caracteres, contener números y letras, y solo se permiten espacios, comas, puntos y guiones. No puede iniciar ni terminar con espacio.";
    }
    // Additional check for ending space if lookbehind is not fully supported or for clarity
    if (value.endsWith(" ") && trimmedValue.length === value.length) {
        return "La dirección no puede terminar con espacio.";
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

export function validarNombreEntidad(nombre, tipo = "campo") {
    const clean = nombre.trim();
    if (clean.length < 2) {
        return { valido: false, mensaje: `El ${tipo} debe tener al menos 2 caracteres.` };
    }
    if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(clean)) {
        return { valido: false, mensaje: `El ${tipo} debe contener letras.` };
    }
    return { valido: true, mensaje: null };
}

export function normalizeSkillText(s) {
  return (s || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // quita acentos
}

export function isValidSoftSkillName(value) {
  const v = (value || "").trim();

  if (v.length < 2 || v.length > 50) {
    return "La habilidad blanda debe tener entre 2 y 50 caracteres.";
  }
  // letras + espacios + guion y apóstrofo, con acentos
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'’-]+$/.test(v)) {
    return "La habilidad blanda solo puede contener letras, espacios, guiones y apóstrofos.";
  }
  if (/(.)\1{3,}/.test(v)) {
    return "La habilidad blanda no puede repetir el mismo carácter más de 3 veces seguidas.";
  }
  // Evita basura tipo 'asdf', 'qwerty', 'lorem', etc.
  const basura = ["asdf", "qwerty", "lorem", "ipsum", "test", "xxxxx", "zzzzz"];
  const n = normalizeSkillText(v);
  if (basura.some(b => n.includes(b))) {
    return "La habilidad blanda parece texto de prueba o inválido.";
  }
  return null;
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
  if (/(.)\1{4,}/.test(v)) {
    return "La habilidad técnica no puede repetir el mismo carácter más de 4 veces seguidas.";
  }

  // Debe contener al menos una palabra de 2 o más letras seguidas
  if (!/\b[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]{2,}\b/.test(v)) {
    return "La habilidad técnica debe contener al menos una palabra válida.";
  }

  // Evitar paréntesis con menos de 3 caracteres dentro (probable basura)
  if (/\([^)]{0,2}\)/.test(v)) {
    return "El texto entre paréntesis es demasiado corto o inválido.";
  }

  // Bloquear palabras basura conocidas
  const basura = ["asdf", "qwerty", "lorem", "ipsum", "test", "xxxxx", "zzzzz", "dfadgafdgdsgdf", "sfadfa"];
  const n = normalizeSkillText(v);
  if (basura.some(b => n.includes(b))) {
    return "La habilidad técnica parece texto de prueba o inválido.";
  }

  return null;
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
  if (/(.)\1{3,}/.test(v)) {
    return "La categoría no puede repetir el mismo carácter más de 3 veces seguidas.";
  }
  const basura = ["asdf", "qwerty", "lorem", "ipsum", "test", "xxxxx", "zzzzz"];
  const n = normalizeSkillText(v);
  if (basura.some(b => n.includes(b))) {
    return "La categoría parece texto de prueba o inválido.";
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
    if (cleanValue.length < 10 || cleanValue.length > 500) return false;

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
    const fecha = new Date(fechaStr);
    
    // Verificar que sea una fecha válida
    if (isNaN(fecha.getTime())) {
        return { valido: false, mensaje: "La fecha no es válida" };
    }

    const año = fecha.getFullYear();
    const añoMin = 1950; // No aceptar fechas anteriores a 1950
    const añoMax = new Date().getFullYear() + 10; // Máximo 10 años en el futuro

    if (año < añoMin) {
        return { valido: false, mensaje: `El año no puede ser menor a ${añoMin}` };
    }

    if (año > añoMax) {
        return { valido: false, mensaje: `El año no puede ser mayor a ${añoMax}` };
    }

    return { valido: true, mensaje: "Fecha válida" };
}
