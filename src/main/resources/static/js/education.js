import { showError, hideError, hideAllErrors, validarNombreEntidad, isValidDescription, validarFecha, isValidLength } from './functions.js';

export function initEducation(initialEducations) {
    const educationForm = {
        institution: document.getElementById('educationInstitution'),
        degree: document.getElementById('educationDegree'),
        studyLevel: document.getElementById('educationStudyLevel'),
        startDate: document.getElementById('educationStartDate'),
        endDate: document.getElementById('educationEndDate'),
        current: document.getElementById('educationCurrent'),
        description: document.getElementById('educationDescription'),
        error: document.getElementById('educationError'),
        addButton: document.getElementById('addEducation'),
        listContainer: document.getElementById('educationListContainer'),
        list: document.getElementById('educationList'),
        hiddenContainer: document.getElementById('educationContainer')
    };

    let educations = initialEducations || [];

    // Helper Validation Functions (moved to functions.js)
    // function isValidLength(value, min, max) { ... } // Moved
    // function isAlphaNumericSpacePunctuation(value) { ... } // Removed
    // function isValidDescription(value) { ... } // Moved
    // function validarFecha(fechaStr) { ... } // Moved

    // Event listeners
    educationForm.current.addEventListener('change', toggleEndDate);
    educationForm.addButton.addEventListener('click', addEducation);

    // Real-time validation listeners
    educationForm.institution.addEventListener('input', function () {
        hideError(this);
        const value = this.value.trim();
        const validationResult = validarNombreEntidad(value, 'institución');
        if (!validationResult.valido) {
            showError(this, validationResult.mensaje);
        }
    });
    educationForm.degree.addEventListener('input', function () {
        hideError(this);
        const value = this.value.trim();
        const validationResult = validarNombreEntidad(value, 'título');
        if (!validationResult.valido) {
            showError(this, validationResult.mensaje);
        }
    });
    educationForm.studyLevel.addEventListener('change', function () {
        hideError(this);
        if (!educationForm.studyLevel.value) {
            showError(this, 'Debes seleccionar un nivel de estudio.');
        } else if (!isValidLength(value, 1, 255)) { // Assuming 1 char min for selection
            showError(this, 'El nivel de estudio no puede exceder los 255 caracteres.');
        }
    });
    educationForm.startDate.addEventListener('change', function () {
        hideError(this);
        const validationResult = validarFecha(this.value);
        if (!validationResult.valido) {
            showError(this, validationResult.mensaje);
        }
        validateDates(); // Re-validate end date if start date changes
    });
    educationForm.endDate.addEventListener('change', function () {
        hideError(this);
        const validationResult = validarFecha(this.value);
        if (!validationResult.valido) {
            showError(this, validationResult.mensaje);
        }
        validateDates(); // Re-validate start date if end date changes
    });
    educationForm.description.addEventListener('input', function () {
        hideError(this);
        const value = this.value.trim();
        if (value && !isValidDescription(value)) {
            showError(this, 'La descripción debe ser clara, con al menos 3 palabras y sin repeticiones excesivas.');
        }
    });


    educationForm.startDate.addEventListener('change', validateDates);
    educationForm.endDate.addEventListener('change', validateDates);

    function toggleEndDate() {
        if (educationForm.current.checked) {
            educationForm.endDate.disabled = true;
            educationForm.endDate.value = '';
            hideError(educationForm.endDate);
        } else {
            educationForm.endDate.disabled = false;
        }
    }

    // Updated validateDates function
    function validateDates() {
        let hasDateErrors = false;
        const startDateValue = educationForm.startDate.value;
        const endDateValue = educationForm.endDate.value;

        hideError(educationForm.startDate);
        hideError(educationForm.endDate);

        if (startDateValue) {
            const validationResult = validarFecha(startDateValue);
            if (!validationResult.valido) {
                showError(educationForm.startDate, validationResult.mensaje);
                hasDateErrors = true;
            }
        }

        if (endDateValue && !educationForm.current.checked) {
            const validationResult = validarFecha(endDateValue);
            if (!validationResult.valido) {
                showError(educationForm.endDate, validationResult.mensaje);
                hasDateErrors = true;
            }
        }

        if (startDateValue && endDateValue && !educationForm.current.checked) {
            const startDate = new Date(startDateValue + '-01');
            const endDate = new Date(endDateValue + '-01');

            // validar si la fecha de fin es anterior a la de inicio
            if (endDate < startDate) {
                showError(educationForm.endDate, 'La fecha de fin no puede ser anterior a la fecha de inicio.');
                hasDateErrors = true;
            }
            // validar duración mínima de 1 mes (solo si la fecha de fin no es anterior)
            else {
                const diffMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
                    (endDate.getMonth() - startDate.getMonth());
                if (diffMonths < 1) {
                    showError(educationForm.endDate, 'La duración debe ser de al menos 1 mes.');
                    hasDateErrors = true;
                }
            }
        }
        return !hasDateErrors;
    }

    function addEducation() {
        hideError(educationForm.error);
        let hasErrors = false;

        // Validar campos requeridos y longitud/formato
        if (!educationForm.institution.value.trim()) {
            showError(educationForm.institution, 'La institución es requerida.');
            hasErrors = true;
        } else {
            const validationResult = validarNombreEntidad(educationForm.institution.value.trim(), 'institución');
            if (!validationResult.valido) {
                showError(educationForm.institution, validationResult.mensaje);
                hasErrors = true;
            }
        }

        if (!educationForm.degree.value.trim()) {
            showError(educationForm.degree, 'El título es requerido');
            hasErrors = true;
        } else {
            const validationResult = validarNombreEntidad(educationForm.degree.value.trim(), 'título');
            if (!validationResult.valido) {
                showError(educationForm.degree, validationResult.mensaje);
                hasErrors = true;
            }
        }

        if (!educationForm.studyLevel.value) {
            showError(educationForm.studyLevel, 'El nivel de estudio es requerido');
            hasErrors = true;
        }

        if (!educationForm.startDate.value) {
            showError(educationForm.startDate, 'La fecha de inicio es requerida');
            hasErrors = true;
        } else {
            const validationResult = validarFecha(educationForm.startDate.value);
            if (!validationResult.valido) {
                showError(educationForm.startDate, validationResult.mensaje);
                hasErrors = true;
            }
        }

        if (educationForm.description.value.trim() && !isValidDescription(educationForm.description.value.trim())) {
            showError(educationForm.description, 'La descripción debe ser clara, con al menos 3 palabras y sin repeticiones excesivas.');
            hasErrors = true;
        }

        // Validar fechas (incluye la lógica de endDate vs startDate y future dates)
        if (!validateDates()) {
            hasErrors = true;
        }

        if (hasErrors) {
            educationForm.error.textContent = 'Por favor corrige los errores en los campos de educación.';
            educationForm.error.style.display = 'block';
            return;
        }

        // Crear objeto educación
        const education = {
            institution: educationForm.institution.value.trim(),
            degree: educationForm.degree.value.trim(),
            studyLevel: educationForm.studyLevel.value.trim(),
            startDate: educationForm.startDate.value,
            endDate: educationForm.current.checked ? null : educationForm.endDate.value,
            current: educationForm.current.checked,
            description: educationForm.description.value.trim()
        };

        // Agregar a la lista
        educations.push(education);
        updateEducationList();
        clearEducationForm();
        updateHiddenFields();
    }

    function updateEducationList() {
        if (educations.length > 0) {
            educationForm.listContainer.style.display = 'block';
        }

        educationForm.list.innerHTML = educations.map((edu, index) => `
            <div class="education-item">
                <div class="education-header">
                    <h4 class="education-title">${edu.degree}</h4>
                    <button type="button" class="remove-education" data-index="${index}">×</button>
                </div>
                <div class="education-details">
                    <div class="education-institution-period">
                        <span class="education-institution">${edu.institution}</span>
                        <span class="education-separator"> - </span>
                        <span class="education-period">${formatPeriod(edu)}</span>
                    </div>
                    ${edu.studyLevel ? `
                    <div class="education-study-level">
                        <span class="education-level">${edu.studyLevel}</span>
                    </div>
                    ` : ''}
                    ${edu.description ? `
                    <div class="education-description">${edu.description}</div>
                    ` : ''}
                </div>
            </div>
        `).join('');

        // Agregar event listeners para eliminar
        document.querySelectorAll('.remove-education').forEach(btn => {
            btn.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                removeEducation(index);
            });
        });
    }

    function formatPeriod(education) {
        const startDate = new Date(education.startDate + '-01');
        const startFormatted = startDate.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long'
        });

        if (education.current) {
            return `${startFormatted} - Actualidad`;
        }

        if (education.endDate) {
            const endDate = new Date(education.endDate + '-01');
            const endFormatted = endDate.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long'
            });
            return `${startFormatted} - ${endFormatted}`;
        }

        return startFormatted;
    }

    

    function removeEducation(index) {
        educations.splice(index, 1);
        updateEducationList();
        updateHiddenFields();

        if (educations.length === 0) {
            educationForm.listContainer.style.display = 'none';
        }
    }

    function clearEducationForm() {
        educationForm.institution.value = '';
        educationForm.degree.value = '';
        educationForm.studyLevel.value = '';
        educationForm.startDate.value = '';
        educationForm.endDate.value = '';
        educationForm.current.checked = false;
        educationForm.description.value = '';
        educationForm.endDate.disabled = false;
        educationForm.error.style.display = 'none';

        hideAllErrors([
            educationForm.institution,
            educationForm.degree,
            educationForm.startDate,
            educationForm.endDate
        ]);
    }

    function updateHiddenFields() {
        educationForm.hiddenContainer.innerHTML = educations.map((edu, index) => `
            <input type="hidden" name="educations[${index}].institution" value="${edu.institution}" />
            <input type="hidden" name="educations[${index}].degree" value="${edu.degree}" />
            <input type="hidden" name="educations[${index}].studyLevel" value="${edu.studyLevel}" />
            <input type="hidden" name="educations[${index}].startDate" value="${edu.startDate}" />
            <input type="hidden" name="educations[${index}].endDate" value="${edu.endDate || ''}" />
            <input type="hidden" name="educations[${index}].current" value="${edu.current}" />
            <input type="hidden" name="educations[${index}].description" value="${edu.description}" />
        `).join('');
    }

    // Función para validar antes de enviar el formulario
    function validateEducations() {
        if (educations.length === 0) {
            showError(educationForm.error, 'Debes agregar al menos una educación');
            educationForm.error.style.display = 'block';
            return false;
        }
        educationForm.error.style.display = 'none';
        return true;
    }

    // Función para obtener las educaciones (para validación en el form principal)
    function getEducations() {
        return educations;
    }


    // Inicializar
    toggleEndDate();
    updateEducationList();

    return {
        validateEducations,
        getEducations,
        updateHiddenFields
    };
}
