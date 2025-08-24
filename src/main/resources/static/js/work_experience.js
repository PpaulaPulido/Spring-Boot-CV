import { showError, hideError, hideAllErrors } from './functions.js';

export function initWorkExperience() {
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
        console.warn('Elementos de experiencia laboral no encontrados. La sección probablemente no está en el DOM.');
        return {
            validateWorkExperiences: () => true,
            getWorkExperiences: () => [],
            updateHiddenFields: () => {}
        };
    }

    let workExperiences = [];

    // Event listeners
    workForm.addButton.addEventListener('click', addWorkExperience);
    workForm.startDate.addEventListener('change', validateDates);
    workForm.endDate.addEventListener('change', validateDates);

    function validateDates() {
        if (workForm.startDate.value && workForm.endDate.value) {
            const startDate = new Date(workForm.startDate.value);
            const endDate = new Date(workForm.endDate.value);
            
            if (endDate < startDate) {
                showError(workForm.endDate, 'La fecha de fin no puede ser anterior a la fecha de inicio');
                return false;
            }
        }
        hideError(workForm.endDate);
        return true;
    }

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

        // Validar fechas
        if (!validateDates()) {
            hasErrors = true;
        }

        if (hasErrors) {
            workForm.error.textContent = 'Por favor completa los campos requeridos';
            workForm.error.style.display = 'block';
            return;
        }

        // Crear objeto experiencia laboral (sin campo current)
        const workExperience = {
            position: workForm.position.value.trim(),
            company: workForm.company.value.trim(),
            startDate: workForm.startDate.value,
            endDate: workForm.endDate.value,
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
            btn.addEventListener('click', function() {
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

    return {
        validateWorkExperiences,
        getWorkExperiences,
        updateHiddenFields
    };
}