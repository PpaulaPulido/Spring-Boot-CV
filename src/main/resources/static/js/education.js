import { showError, hideError, hideAllErrors } from './functions.js';

export function initEducation() {
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

    let educations = [];

    // Event listeners
    educationForm.current.addEventListener('change', toggleEndDate);
    educationForm.addButton.addEventListener('click', addEducation);
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

    function validateDates() {
        if (educationForm.startDate.value && educationForm.endDate.value && !educationForm.current.checked) {
            const startDate = new Date(educationForm.startDate.value);
            const endDate = new Date(educationForm.endDate.value);

            if (endDate < startDate) {
                showError(educationForm.endDate, 'La fecha de fin no puede ser anterior a la fecha de inicio');
                return false;
            }
        }
        hideError(educationForm.endDate);
        return true;
    }

    function addEducation() {
        hideError(educationForm.error);

        // Validar campos requeridos
        const requiredFields = [
            { field: educationForm.institution, message: 'La institución es requerida' },
            { field: educationForm.degree, message: 'El título es requerido' },
            { field: educationForm.studyLevel, message: 'El nivel de estudio es requerido' },
            { field: educationForm.startDate, message: 'La fecha de inicio es requerida' }
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

        // Validar fechas
        if (!validateDates()) {
            hasErrors = true;
        }

        if (hasErrors) {
            educationForm.error.textContent = 'Por favor completa los campos requeridos';
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

    return {
        validateEducations,
        getEducations,
        updateHiddenFields
    };
}