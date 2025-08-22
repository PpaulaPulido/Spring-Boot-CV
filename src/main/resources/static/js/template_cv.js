import { initPhoneInput, showAlert } from './functions.js';

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("cvForm");
    const iti = initPhoneInput("#phone");

    const softSkillInput = document.getElementById("softSkillInput");
    const technicalSkillInput = document.getElementById("technicalSkillInput");
    const technicalSkillCategory = document.getElementById("technicalSkillCategory");
    const addSoftSkillBtn = document.getElementById("addSoftSkill");
    const addTechnicalSkillBtn = document.getElementById("addTechnicalSkill");
    const softSkillList = document.getElementById("softSkillList");
    const technicalSkillList = document.getElementById("technicalSkillList");

    // Arrays para habilidades
    let softSkills = [];
    let technicalSkills = [];

    // Función para mostrar errores debajo del campo
    function showError(input, message) {
        const formGroup = input.closest(".form-group");
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
    function hideError(input) {
        const formGroup = input.closest(".form-group");
        const errorSpan = formGroup.querySelector(".error-message");
        
        if (errorSpan) {
            errorSpan.textContent = "";
            errorSpan.classList.remove("has-error");
        }
        
        input.classList.remove("is-invalid");
    }

    // Ocultar todos los errores al inicio
    function hideAllErrors() {
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => hideError(input));
    }

    // Agregar habilidades
    addSoftSkillBtn.addEventListener("click", addSoftSkill);
    addTechnicalSkillBtn.addEventListener("click", addTechnicalSkill);

    function addSoftSkill() {
        const skillName = softSkillInput.value.trim();
        if (skillName) {
            softSkills.push({ name: skillName, description: "" });
            updateSoftSkillList();
            softSkillInput.value = "";
        }
    }

    function addTechnicalSkill() {
        const skillName = technicalSkillInput.value.trim();
        const category = technicalSkillCategory.value.trim();
        
        if (skillName) {
            technicalSkills.push({
                name: skillName,
                category: category || "General"
            });
            updateTechnicalSkillList();
            technicalSkillInput.value = "";
            technicalSkillCategory.value = "";
        }
    }

    function updateSoftSkillList() {
        softSkillList.innerHTML = softSkills.map((skill, index) => `
            <div class="skill-item">
                <span>${skill.name}</span>
                <button type="button" class="remove-skill" data-index="${index}" data-type="soft">×</button>
            </div>
        `).join('');
        addSkillRemoveListeners();
        updateHiddenFields();
    }

    function updateTechnicalSkillList() {
        technicalSkillList.innerHTML = technicalSkills.map((skill, index) => `
            <div class="skill-item">
                <span>${skill.name}${skill.category ? ` (${skill.category})` : ''}</span>
                <button type="button" class="remove-skill" data-index="${index}" data-type="technical">×</button>
            </div>
        `).join('');
        addSkillRemoveListeners();
        updateHiddenFields();
    }

    function addSkillRemoveListeners() {
        document.querySelectorAll('.remove-skill').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const type = this.getAttribute('data-type');
                
                if (type === 'soft') {
                    softSkills.splice(index, 1);
                    updateSoftSkillList();
                } else {
                    technicalSkills.splice(index, 1);
                    updateTechnicalSkillList();
                }
            });
        });
    }

    function updateHiddenFields() {
        // Crear campos ocultos para soft skills
        const softSkillsContainer = document.getElementById('softSkillsContainer') || createSkillsContainer('softSkillsContainer');
        softSkillsContainer.innerHTML = softSkills.map((skill, index) => `
            <input type="hidden" name="softSkills[${index}].name" value="${skill.name}" />
            <input type="hidden" name="softSkills[${index}].description" value="${skill.description}" />
        `).join('');

        // Crear campos ocultos para technical skills
        const techSkillsContainer = document.getElementById('techSkillsContainer') || createSkillsContainer('techSkillsContainer');
        techSkillsContainer.innerHTML = technicalSkills.map((skill, index) => `
            <input type="hidden" name="technicalSkills[${index}].name" value="${skill.name}" />
            <input type="hidden" name="technicalSkills[${index}].category" value="${skill.category}" />
        `).join('');
    }

    function createSkillsContainer(id) {
        const container = document.createElement('div');
        container.id = id;
        container.style.display = 'none';
        form.appendChild(container);
        return container;
    }

    // Validación antes de enviar
    form.addEventListener("submit", function(e) {
        e.preventDefault(); 
        hideAllErrors(); 

        let hasErrors = false;
        let firstErrorField = null;

        // Validar campos requeridos
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showError(field, 'Este campo es obligatorio');
                hasErrors = true;
                if (!firstErrorField) firstErrorField = field;
            }
        });

        // Validar que haya al menos una habilidad técnica
        if (technicalSkills.length === 0) {
            showError(technicalSkillInput, 'Debes agregar al menos una habilidad técnica');
            hasErrors = true;
            if (!firstErrorField) firstErrorField = technicalSkillInput;
        }

        // Validar que haya al menos una habilidad técnica
        if (softSkills.length === 0) {
            showError(softSkillInput, 'Debes agregar al menos una habilidad técnica');
            hasErrors = true;
            if (!firstErrorField) firstErrorField = softSkillInput;
        }

        // Validar teléfono
        if (iti && !iti.isValidNumber()) {
            showError(document.getElementById('phone'), 'Por favor ingresa un número de teléfono válido');
            hasErrors = true;
            if (!firstErrorField) firstErrorField = document.getElementById('phone');
        }

        // Validar email si existe el campo
        const emailField = document.getElementById('email');
        if (emailField) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailField.value && !emailRegex.test(emailField.value)) {
                showError(emailField, 'Formato de correo electrónico inválido');
                hasErrors = true;
                if (!firstErrorField) firstErrorField = emailField;
            }
        }

        if (hasErrors) {
            // Scroll al primer campo con error
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstErrorField.focus();
            }
            
            showAlert({
                icon: 'warning',
                title: 'Error de validación',
                html: 'Por favor corrige los errores en el formulario.'
            });
        } else {
            // Actualizar campos ocultos y enviar formulario
            updateHiddenFields();
            form.submit();
        }
    });

    // Limpiar validación al escribir
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', function() {
            hideError(this);
        });
    });

    // Enter para agregar habilidades
    softSkillInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSoftSkill();
        }
    });

    technicalSkillInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTechnicalSkill();
        }
    });

    technicalSkillCategory.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTechnicalSkill();
        }
    });

    // Inicializar
    hideAllErrors();
    updateHiddenFields();
});