console.log("template_cv.js cargado y ejecutándose!");

import {
    initPhoneInput,
    showAlert,
    showError,
    hideError,
    hideAllErrors,
    validateImage
} from './functions.js';
import { initEducation } from './education.js';
import { initWorkExperience } from './work_experience.js';

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("cvForm");
    const iti = initPhoneInput("#phone");
    const educationModule = initEducation();
    const workExperienceModule = initWorkExperience();

    const softSkillInput = document.getElementById("softSkillInput");
    const technicalSkillInput = document.getElementById("technicalSkillInput");
    const technicalSkillCategory = document.getElementById("technicalSkillCategory");
    const addSoftSkillBtn = document.getElementById("addSoftSkill");
    const addTechnicalSkillBtn = document.getElementById("addTechnicalSkill");
    const softSkillList = document.getElementById("softSkillList");
    const technicalSkillList = document.getElementById("technicalSkillList");
    const profileImageInput = document.getElementById("profileImageFile");

    // Arrays para habilidades
    let softSkills = [];
    let technicalSkills = [];

    function collectFormData() {
        const data = {};

        // Personal Info
        data.fullName = document.getElementById('fullName').value;
        data.email = document.getElementById('email').value;
        data.phone = document.getElementById('phone').value;
        data.address = document.getElementById('address').value;
        data.linkedin = document.getElementById('linkedin').value;
        data.portfolio = document.getElementById('portfolio').value;
        data.profession = document.getElementById('profession').value;
        data.summary = document.getElementById('summary').value;
        const checkedTheme = document.querySelector('input[name="theme"]:checked');
        data.theme = checkedTheme ? checkedTheme.value : 'default'; // Proporciona un valor por defecto

        // Skills (assuming softSkills and technicalSkills arrays are globally accessible or passed)
        data.softSkills = softSkills; // These are already managed by JS
        data.technicalSkills = technicalSkills; // These are already managed by JS

        // Education (assuming educationModule.getEducations() exists)
        data.educations = educationModule.getEducations();

        // Work Experience (assuming workExperienceModule.getWorkExperiences() exists)
        data.workExperiences = workExperienceModule.getWorkExperiences();

        // Profile Image (this is tricky for live preview, might need to use FileReader)
        // For now, we'll just pass the path if it exists, or a placeholder
        const profileImageFile = document.getElementById('profileImageFile').files[0];
        if (profileImageFile) {
            // For live preview, we need to read the file as a Data URL
            // This will be handled in the updatePreview function
            data.profileImageFile = profileImageFile;
        } else {
            data.profileImageFile = null;
        }

        return data;
    }

    function generateCVHtml(data) {
        // Profile Image
        const profileImageHtml = data.profileImageFile ?
            `<div class="img-container"><img src="${URL.createObjectURL(data.profileImageFile)}" alt="Foto de perfil"></div>` :
            '<div class="img-container"><img src="/images/default.jpg" alt="Foto de perfil por defecto"></div>'; // Default image

        // Contact Info
        const contactInfoHtml = `
            <h4>Contacto</h4>
            <p><strong>Email:</strong> ${data.email || ''}</p>
            <p><strong>Teléfono:</strong> ${data.phone || ''}</p>
            <p><strong>Dirección:</strong> ${data.address || ''}</p>
            ${data.linkedin ? `<p><strong>LinkedIn:</strong> <a href="${data.linkedin}" target="_blank">${data.linkedin}</a></p>` : ''}
            ${data.portfolio ? `<p><strong>Portfolio:</strong> <a href="${data.portfolio}" target="_blank">${data.portfolio}</a></p>` : ''}
        `;

        // Soft Skills
        const softSkillsHtml = data.softSkills.length > 0 ? `
            <h4>Habilidades Blandas</h4>
            <ul>
                ${data.softSkills.map(skill => `<li>${skill.name}</li>`).join('')}
            </ul>
        ` : '';

        // Technical Skills
        const technicalSkillsHtml = data.technicalSkills.length > 0 ? `
            <h3>Habilidades Técnicas</h3>
            ${data.technicalSkills.map(skill => `
                <div class="experience-item">
                    <h4>${skill.name}</h4>
                    <p>${skill.category}</p>
                </div>
            `).join('')}
        ` : '';

        // Professional Summary
        const summaryHtml = data.summary ? `
            <h3>Resumen Profesional</h3>
            <p>${data.summary}</p>
        ` : '';

        // Education
        const educationsHtml = data.educations.length > 0 ? `
            <h3>Educación</h3>
            ${data.educations.map(edu => `
                <div class="experience-item">
                    <h4>${edu.degree}</h4>
                    <p><strong>${edu.institution}</strong> | ${edu.startDate} - ${edu.current ? 'Actual' : edu.endDate}</p>
                    <p>${edu.description || ''}</p>
                </div>
            `).join('')}
        ` : '';

        // Work Experience
        const workExperiencesHtml = data.workExperiences.length > 0 ? `
            <h3>Experiencia Laboral</h3>
            ${data.workExperiences.map(exp => `
                <div class="experience-item">
                    <h4>${exp.position}</h4>
                    <p><strong>${exp.company}</strong> | ${exp.startDate} - ${exp.current ? 'Actual' : exp.endDate}</p>
                    <p>${exp.description || ''}</p>
                </div>
            `).join('')}
        ` : '';


        return `
            <div class="resume-container">
                <!-- Columna Izquierda -->
                <div class="resume-left">
                    ${profileImageHtml}
                    ${contactInfoHtml}
                    ${softSkillsHtml}
                </div>
                <!-- Columna Derecha -->
                <div class="resume-right">
                    <header>
                        <h1>${data.fullName || 'Nombre Completo'}</h1>
                        <p>${data.profession || 'Profesión'}</p>
                    </header>
                    ${summaryHtml}
                    ${educationsHtml}
                    ${workExperiencesHtml}
                    ${technicalSkillsHtml}
                </div>
            </div>
        `;
    }

    function updatePreview() {
        const cvData = collectFormData();
        const cvPreviewContainer = document.getElementById('cvPreview');

        // Generate HTML for the preview
        cvPreviewContainer.innerHTML = generateCVHtml(cvData);

        // --- Improved Theme Handling ---
        const themeId = 'cv-theme-link';
        let themeLink = document.getElementById(themeId);

        // If the theme link doesn't exist, create it
        if (!themeLink) {
            themeLink = document.createElement('link');
            themeLink.id = themeId;
            themeLink.rel = 'stylesheet';
            document.head.appendChild(themeLink);
        }

        // Update the href to apply the selected theme
        themeLink.href = `/css/themes/${cvData.theme}.css`;
    }

    // Event listeners for live preview
    form.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    document.querySelectorAll('input[name="theme"]').forEach(radio => {
        radio.addEventListener('change', updatePreview);
    });

    // Initial preview on load
    updatePreview();

    // Event listener para validar imagen al seleccionar
    if (profileImageInput) {
        profileImageInput.addEventListener('change', function (e) {
            hideError(this);
            const file = e.target.files[0];
            if (file) {
                const error = validateImage(file);
                if (error) {
                    showError(this, error);
                    // Limpiar el input de archivo
                    this.value = '';
                }
            }
            updatePreview(); // Update preview after image selection
        });
    }

    // Agregar habilidades
    addSoftSkillBtn.addEventListener("click", function() {
        console.log("Botón 'Agregar Habilidad Blanda' clickeado.");
        addSoftSkill();
    });
    addTechnicalSkillBtn.addEventListener("click", function() {
        console.log("Botón 'Agregar Habilidad Técnica' clickeado.");
        addTechnicalSkill();
    });

    function addSoftSkill() {
        const skillName = softSkillInput.value.trim();
        console.log("Intentando agregar habilidad blanda:", skillName);
        if (skillName) {
            softSkills.push({ name: skillName, description: "" });
            updateSoftSkillList();
            softSkillInput.value = "";
            hideError(softSkillInput);
            updatePreview(); // Refresh preview
            console.log("Habilidad blanda agregada:", skillName);
        } else {
            console.log("No se agregó habilidad blanda: el campo está vacío.");
            showError(softSkillInput, 'El nombre de la habilidad blanda no puede estar vacío.');
        }
    }

    function addTechnicalSkill() {
        const skillName = technicalSkillInput.value.trim();
        const category = technicalSkillCategory.value.trim();
        console.log("Intentando agregar habilidad técnica:", skillName, "Categoría:", category);

        if (skillName) {
            technicalSkills.push({
                name: skillName,
                category: category || "General"
            });
            updateTechnicalSkillList();
            technicalSkillInput.value = "";
            technicalSkillCategory.value = "";
            hideError(technicalSkillInput);
            updatePreview(); // Refresh preview
            console.log("Habilidad técnica agregada:", skillName, "Categoría:", category);
        } else {
            console.log("No se agregó habilidad técnica: el campo está vacío.");
            showError(technicalSkillInput, 'El nombre de la habilidad técnica no puede estar vacío.');
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
            btn.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                const type = this.getAttribute('data-type');

                if (type === 'soft') {
                    softSkills.splice(index, 1);
                    updateSoftSkillList();
                } else {
                    technicalSkills.splice(index, 1);
                    updateTechnicalSkillList();
                }
                updatePreview(); // Refresh preview
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
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        hideAllErrors(form); // Pasar el formulario como parámetro

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

        // Validar que haya al menos una habilidad blanda
        if (softSkills.length === 0) {
            showError(softSkillInput, 'Debes agregar al menos una habilidad blanda');
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

        // Validar imagen si se seleccionó alguna
        if (profileImageInput && profileImageInput.files.length > 0) {
            const file = profileImageInput.files[0];
            const imageError = validateImage(file);
            if (imageError) {
                showError(profileImageInput, imageError);
                hasErrors = true;
                if (!firstErrorField) firstErrorField = profileImageInput;
            }
        }

        // Validar educación
        if (!educationModule.validateEducations()) {
            hasErrors = true;
            if (!firstErrorField) firstErrorField = document.getElementById('educationInstitution');
        }

        //Validar experiencia laboral
        if (!workExperienceModule.validateWorkExperiences()) {
            hasErrors = true;
            if (!firstErrorField) firstErrorField = document.getElementById('workPosition');
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
            educationModule.updateHiddenFields();
            workExperienceModule.updateHiddenFields();
            form.submit();
        }
    });

    // Limpiar validación al escribir
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', function () {
            hideError(this);
        });
    });

    // Enter para agregar habilidades
    softSkillInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSoftSkill();
        }
    });

    technicalSkillInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTechnicalSkill();
        }
    });

    technicalSkillCategory.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTechnicalSkill();
        }
    });

    // Inicializar
    hideAllErrors(form); // Pasar el formulario como parámetro
    updateHiddenFields();
});