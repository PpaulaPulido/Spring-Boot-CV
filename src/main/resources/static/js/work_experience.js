import { showError, hideError, hideAllErrors, validarNombreEntidad, isValidDescription, validarFecha } from './functions.js';

export function initWorkExperience(initialWorkExperiences) {
    // Obtener elementos del DOM con verificación de null
    const workForm = {
        position: document.getElementById('workPosition'),
        company: document.getElementById('workCompany'),
        startDate: document.getElementById('workStartDate'),
        endDate: document.getElementById('workEndDate'),
        description: document.getElementById('workDescription'),
        error: document.getElementById('workError'),
        addButton: document.getElementById('addWorkExperience'),
        listContainer: document.getElementById('workListContainer'),
        list: document.getElementById('workList'),
        hiddenContainer: document.getElementById('workContainer')
    };

    // Verificar si los elementos existen
    if (!workForm.position || !workForm.addButton) {
        return {
            validateWorkExperiences: () => true,
            getWorkExperiences: () => [],
            updateHiddenFields: () => { }
        };
    }

    let workExperiences = initialWorkExperiences || [];

    // Helper Validation Functions (moved to functions.js or removed)
    // function isValidLength(value, min, max) { ... } // Moved
    // function isAlphaNumericSpacePunctuation(value) { ... } // Removed
    // function isValidDescription(value) { ... } // Moved
    // function validarFecha(fechaStr) { ... } // Moved

    // Event listeners
    workForm.addButton.addEventListener('click', addWorkExperience);
    workForm.startDate.addEventListener('change', validateDates);
    workForm.endDate.addEventListener('change', validateDates);

    // Updated validateDates function
    function validateDates() {
        let hasDateErrors = false;
        const startDateValue = workForm.startDate.value;
        const endDateValue = workForm.endDate.value;

        hideError(workForm.startDate);
        hideError(workForm.endDate);

        if (startDateValue) {
            const validationResult = validarFecha(startDateValue);
            if (!validationResult.valido) {
                showError(workForm.startDate, validationResult.mensaje);
                hasDateErrors = true;
            }
        }

        if (endDateValue) {
            const validationResult = validarFecha(endDateValue);
            if (!validationResult.valido) {
                showError(workForm.endDate, validationResult.mensaje);
                hasDateErrors = true;
            }
        }

        if (startDateValue && endDateValue) {
            const startDate = new Date(startDateValue + '-01');
            const endDate = new Date(endDateValue + '-01');

            if (endDate < startDate) {
                showError(workForm.endDate, 'La fecha de fin no puede ser anterior a la fecha de inicio.');
                hasDateErrors = true;
            }
        }
        return !hasDateErrors;
    }

    


    workForm.position.addEventListener('input', function () {
        hideError(this);
        const value = this.value.trim();

        if (value) {
            // Validación general
            const validationResult = validarNombreEntidad(value, 'puesto');
            if (!validationResult.valido) {
                showError(this, validationResult.mensaje);
            }
        }
    });


    workForm.company.addEventListener('input', function () {
        hideError(this);
        const value = this.value.trim();

        if (value) {
            // Validación general
            const validationResult = validarNombreEntidad(value, 'empresa');
            if (!validationResult.valido) {
                showError(this, validationResult.mensaje);
            }
        }
    });


    workForm.description.addEventListener('input', function () {
        hideError(this);
        const value = this.value.trim();
        if (value && !isValidDescription(value)) {
            showError(this, 'La descripción debe ser clara, con al menos 3 palabras y sin repeticiones excesivas.');
        }
    });

    function addWorkExperience() {
        hideError(workForm.error);

        // Validar campos requeridos
        const requiredFields = [
            { field: workForm.position, message: 'El puesto es requerido' },
            { field: workForm.company, message: 'La empresa es requerida' },
            { field: workForm.startDate, message: 'La fecha de inicio es requerida' }
        ];

        let hasErrors = false;

        for (const { field, message } of requiredFields) {
            if (!field.value.trim()) {
                showError(field, message);
                hasErrors = true;
            } else {
                hideError(field);
            }
        }

        // Specific validations for position, company, description
        if (workForm.position.value.trim()) {
            const validationResult = validarNombreEntidad(workForm.position.value.trim(), 'puesto');
            if (!validationResult.valido) {
                showError(workForm.position, validationResult.mensaje);
                hasErrors = true;
            }
        }

        if (workForm.company.value.trim()) {
            const validationResult = validarNombreEntidad(workForm.company.value.trim(), 'empresa');
            if (!validationResult.valido) {
                showError(workForm.company, validationResult.mensaje);
                hasErrors = true;
            }
        }

        if (workForm.description.value.trim() && !isValidDescription(workForm.description.value.trim())) {
            showError(workForm.description, 'La descripción debe ser clara, con al menos 3 palabras y sin repeticiones excesivas.');
            hasErrors = true;
        }

        // Validate dates using validarFecha
        if (workForm.startDate.value) {
            const validationResult = validarFecha(workForm.startDate.value);
            if (!validationResult.valido) {
                showError(workForm.startDate, validationResult.mensaje);
                hasErrors = true;
            }
        }

        if (workForm.endDate.value) {
            const validationResult = validarFecha(workForm.endDate.value);
            if (!validationResult.valido) {
                showError(workForm.endDate, validationResult.mensaje);
                hasErrors = true;
            }
        }

        // Validate date range (end date not before start date)
        if (!validateDates()) {
            hasErrors = true;
        }

        if (hasErrors) {
            workForm.error.textContent = 'Por favor corrige los errores en los campos de experiencia laboral.';
            workForm.error.style.display = 'block';
            return;
        }

        // Crear objeto experiencia laboral (sin campo current)
        const workExperience = {
            position: workForm.position.value.trim(),
            company: workForm.company.value.trim(),
            startDate: workForm.startDate.value,
            endDate: workForm.endDate.value, // Keep original value for storage
            description: workForm.description.value.trim()
        };

        // Agregar a la lista
        workExperiences.push(workExperience);
        updateWorkList();
        clearWorkForm();
        updateHiddenFields();
    }

    function updateWorkList() {
        if (workExperiences.length > 0) {
            workForm.listContainer.style.display = 'block';
        }

        workForm.list.innerHTML = workExperiences.map((work, index) => `
            <div class="work-item">
                <div class="work-header">
                    <h4 class="work-title">${work.position}</h4>
                    <button type="button" class="remove-work" data-index="${index}">×</button>
                </div>
                <div class="work-details">
                    <div class="work-company-period">
                        <span class="work-company">${work.company}</span>
                        <span class="work-separator"> - </span>
                        <span class="work-period">${formatPeriod(work)}</span>
                    </div>
                    ${work.description ? `
                    <div class="work-description">${work.description}</div>
                    ` : ''}
                </div>
            </div>
        `).join('');

        // Agregar event listeners para eliminar
        document.querySelectorAll('.remove-work').forEach(btn => {
            btn.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                removeWorkExperience(index);
            });
        });
    }

    function formatPeriod(workExperience) {
        const startDate = new Date(workExperience.startDate + '-01');
        const startFormatted = startDate.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long'
        });

        if (workExperience.endDate) {
            const endDate = new Date(workExperience.endDate + '-01');
            const endFormatted = endDate.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long'
            });
            return `${startFormatted} - ${endFormatted}`;
        }

        return startFormatted;
    }

    function removeWorkExperience(index) {
        workExperiences.splice(index, 1);
        updateWorkList();
        updateHiddenFields();

        if (workExperiences.length === 0) {
            workForm.listContainer.style.display = 'none';
        }
    }

    function clearWorkForm() {
        workForm.position.value = '';
        workForm.company.value = '';
        workForm.startDate.value = '';
        workForm.endDate.value = '';
        workForm.description.value = '';
        workForm.error.style.display = 'none';

        hideAllErrors([
            workForm.position,
            workForm.company,
            workForm.startDate,
            workForm.endDate
        ]);
    }

    function updateHiddenFields() {
        workForm.hiddenContainer.innerHTML = workExperiences.map((work, index) => `
            <input type="hidden" name="workExperiences[${index}].position" value="${work.position}" />
            <input type="hidden" name="workExperiences[${index}].company" value="${work.company}" />
            <input type="hidden" name="workExperiences[${index}].startDate" value="${work.startDate}" />
            <input type="hidden" name="workExperiences[${index}].endDate" value="${work.endDate || ''}" />
            <input type="hidden" name="workExperiences[${index}].description" value="${work.description}" />
        `).join('');
    }

    // Función para validar antes de enviar el formulario
    function validateWorkExperiences() {
        if (workExperiences.length === 0) {
            showError(workForm.error, 'Debes agregar al menos una experiencia laboral');
            workForm.error.style.display = 'block';
            return false;
        }
        workForm.error.style.display = 'none';
        return true;
    }

    // Función para obtener las experiencias laborales
    function getWorkExperiences() {
        return workExperiences;
    }

    updateWorkList();

    return {
        validateWorkExperiences,
        getWorkExperiences,
        updateHiddenFields
    };
}
