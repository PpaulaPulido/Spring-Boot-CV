console.log("template_cv.js cargado y ejecutándose!");

import {
    initPhoneInput,
    showAlert,
    showError,
    hideError,
    hideAllErrors,
    validateImage,
    isValidLength,
    isAlphaNumericSpace,
    isAlphaSpace,
    isValidURL,
    isLinkedInURL,
    isValidEmail,
    isValidFullName,
    isValidProfession,
    isValidAddress,
    validarResumenProfesional,
    // New skill validation functions
    normalizeSkillText,
    isValidSoftSkillName,
    isValidTechnicalSkillName,
    isValidTechnicalCategory,
    isDuplicateSkillGlobal,
    isValidDescription, // Now imported
    validarFecha // Now imported

} from './functions.js';
import { initEducation } from './education.js';
import { initWorkExperience } from './work_experience.js';

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("cvForm");
    const iti = initPhoneInput("#phone");
    const educationModule = initEducation();
    const workExperienceModule = initWorkExperience();

    const softSkillInput = document.getElementById("softSkillSelect");
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
        data.theme = checkedTheme ? checkedTheme.value : 'default';

        // Skills
        data.softSkills = softSkills;
        data.technicalSkills = technicalSkills;

        // Education
        data.educations = educationModule.getEducations();

        // Work Experience
        data.workExperiences = workExperienceModule.getWorkExperiences();

        // Profile Image
        const profileImageFile = document.getElementById('profileImageFile').files[0];
        if (profileImageFile) {
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
            '<div class="img-container"><img src="/images/default.jpg" alt="Foto de perfil por defecto"></div>';

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
        const skillName = (softSkillInput.value || "").trim();
        hideError(softSkillInput); // Clear previous error

        const msg = isValidSoftSkillName(skillName);
        if (msg) {
            showError(softSkillInput, msg);
            return;
        }

        if (isDuplicateSkillGlobal(skillName, softSkills, technicalSkills)) {
            showError(softSkillInput, 'Ya agregaste esta habilidad (blanda o técnica).');
            return;
        }

        // Límite opcional para no desbordar el CV
        if (softSkills.length >= 15) {
            showError(softSkillInput, 'Máximo 15 habilidades blandas.');
            return;
        }

        softSkills.push({ name: skillName, description: "" });
        updateSoftSkillList();
        softSkillInput.value = "";
        updatePreview(); // Refresh preview
    }

    function addTechnicalSkill() {
        const skillName = (technicalSkillInput.value || "").trim();
        const category = (technicalSkillCategory.value || "").trim();

        hideError(technicalSkillInput);
        hideError(technicalSkillCategory);

        const msgName = isValidTechnicalSkillName(skillName);
        if (msgName) {
            showError(technicalSkillInput, msgName);
            return;
        }

        const msgCat = isValidTechnicalCategory(category);
        if (msgCat) {
            showError(technicalSkillCategory, msgCat);
            return;
        }

        if (isDuplicateSkillGlobal(skillName, softSkills, technicalSkills)) {
            showError(technicalSkillInput, 'Ya agregaste esta habilidad (blanda o técnica).');
            return;
        }

        if (technicalSkills.length >= 10) {
            showError(technicalSkillInput, 'Máximo 10 habilidades técnicas.');
            return;
        }

        technicalSkills.push({
            name: skillName,
            category: category || "General"
        });
        updateTechnicalSkillList();
        technicalSkillInput.value = "";
        technicalSkillCategory.value = "";
        updatePreview(); // Refresh preview
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


    // Validation before submission
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        hideAllErrors(form);

        let hasErrors = false;
        let firstErrorField = null;

        // Validate required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showError(field, 'Este campo es obligatorio');
                hasErrors = true;
                if (!firstErrorField) firstErrorField = field;
            }
        });

        // Validate fullName
        const fullNameField = document.getElementById('fullName');
        if (fullNameField) {
            const fullNameError = isValidFullName(fullNameField.value);
            if (fullNameError) {
                showError(fullNameField, fullNameError);
                hasErrors = true;
                if (!firstErrorField) firstErrorField = fullNameField;
            }
        }

        // Validate address
        const addressField = document.getElementById('address');
        if (addressField && addressField.value.trim()) {
            const addressError = isValidAddress(addressField.value.trim());
            if (addressError) {
                showError(addressField, addressError);
                hasErrors = true;
                if (!firstErrorField) firstErrorField = addressField;
            }
        }

        // Validate linkedin
        const linkedinField = document.getElementById('linkedin');
        if (linkedinField && linkedinField.value.trim()) {
            const linkedinError = isLinkedInURL(linkedinField.value.trim());
            if (linkedinError) {
                showError(linkedinField, linkedinError);
                hasErrors = true;
                if (!firstErrorField) firstErrorField = linkedinField;
            }
        }

        // Validate portfolio
        const portfolioField = document.getElementById('portfolio');
        if (portfolioField && portfolioField.value.trim()) {
            const portfolioError = isValidURL(portfolioField.value.trim());
            if (!portfolioError) { // isValidURL returns true/false
                showError(portfolioField, 'Formato de URL de portafolio inválido. Ej: https://www.miportafolio.com');
                hasErrors = true;
                if (!firstErrorField) firstErrorField = portfolioField;
            }
        }

        // Validate profession
        const professionField = document.getElementById('profession');
        if (professionField) {
            const professionError = isValidProfession(professionField.value);
            if (professionError) {
                showError(professionField, professionError);
                hasErrors = true;
                if (!firstErrorField) firstErrorField = professionField;
            }
        }

        // Validate summary
        const summaryField = document.getElementById('summary');
        if (summaryField && summaryField.value.trim()) {
            const summaryValidation = validarResumenProfesional(summaryField.value.trim());
            if (!summaryValidation.valido) {
                showError(summaryField, summaryValidation.error);
                hasErrors = true;
                if (!firstErrorField) firstErrorField = summaryField;
            }
        }

        // Validate that there is at least one technical skill
        if (technicalSkills.length === 0) {
            showError(technicalSkillInput, 'Debes agregar al menos una habilidad técnica');
            hasErrors = true;
            if (!firstErrorField) firstErrorField = technicalSkillInput;
        }

        // Validate that there is at least one soft skill
        if (softSkills.length === 0) {
            showError(softSkillInput, 'Debes agregar al menos una habilidad blanda');
            hasErrors = true;
            if (!firstErrorField) firstErrorField = softSkillInput;
        }

        // Validate phone
        if (iti && !iti.isValidNumber()) {
            const errorCode = iti.getValidationError();
            let errorMessage = 'Por favor ingresa un número de teléfono válido';
            // Map error codes to more specific messages
            switch (errorCode) {
                case 1: // IS_POSSIBLE
                    errorMessage = 'Número de teléfono demasiado corto.';
                    break;
                case 2: // INVALID_COUNTRY_CODE
                    errorMessage = 'Código de país inválido.';
                    break;
                case 3: // TOO_SHORT
                    errorMessage = 'Número de teléfono demasiado corto.';
                    break;
                case 4: // TOO_LONG
                    errorMessage = 'Número de teléfono demasiado largo.';
                    break;
                case 5: // NOT_A_NUMBER
                    errorMessage = 'No es un número de teléfono válido.';
                    break;
                case 6: // IS_POSSIBLE_LOCAL_ONLY
                    errorMessage = 'Número de teléfono válido solo localmente.';
                    break;
                case -99: // UNKNOWN
                default:
                    errorMessage = 'Número de teléfono inválido.';
                    break;
            }
            showError(document.getElementById('phone'), errorMessage);
            hasErrors = true;
            if (!firstErrorField) firstErrorField = document.getElementById('phone');
        }

        // Validate email if field exists
        const emailField = document.getElementById('email');
        if (emailField) {
            const emailError = isValidEmail(emailField.value);
            if (emailError) {
                showError(emailField, emailError);
                hasErrors = true;
                if (!firstErrorField) firstErrorField = emailField;
            }
        }

        // Validate image if one is selected
        if (profileImageInput && profileImageInput.files.length > 0) {
            const file = profileImageInput.files[0];
            const imageError = validateImage(file);
            if (imageError) {
                showError(profileImageInput, imageError);
                hasErrors = true;
                if (!firstErrorField) firstErrorField = profileImageInput;
            }
        }

        // Validate education
        if (!educationModule.validateEducations()) {
            hasErrors = true;
            if (!firstErrorField) firstErrorField = document.getElementById('educationInstitution');
        }

        // Validate work experience
        if (!workExperienceModule.validateWorkExperiences()) {
            hasErrors = true;
            if (!firstErrorField) firstErrorField = document.getElementById('workPosition');
        }

        if (hasErrors) {
            // Scroll to the first field with an error
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
            // Update hidden fields and submit form
            updateHiddenFields();
            educationModule.updateHiddenFields();
            workExperienceModule.updateHiddenFields();
            form.submit();
        }
    });

    // Clear validation on input
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', function () {
            hideError(this);
        });
    });

    

    // Real-time validation for specific fields
    document.getElementById('fullName').addEventListener('input', function() {
        const field = this;
        hideError(field);
        const fullNameError = isValidFullName(field.value);
        if (fullNameError) {
            showError(field, fullNameError);
        }
    });

    document.getElementById('address').addEventListener('input', function() {
        const field = this;
        const value = field.value.trim();
        hideError(field);
        const addressError = isValidAddress(value);
        if (addressError) {
            showError(field, addressError);
        }
    });

    document.getElementById('linkedin').addEventListener('input', function() {
        const field = this;
        const value = field.value.trim();
        hideError(field);
        const linkedinError = isLinkedInURL(value);
        if (linkedinError) {
            showError(field, linkedinError);
        }
    });

    document.getElementById('portfolio').addEventListener('input', function() {
        const field = this;
        const value = field.value.trim();
        hideError(field);
        const portfolioError = isValidURL(value);
        if (!portfolioError) { // isValidURL returns true/false
            showError(field, 'Formato de URL de portafolio inválido. Ej: https://www.miportafolio.com');
        }
    });

    document.getElementById('profession').addEventListener('input', function() {
        const field = this;
        hideError(field);
        const professionError = isValidProfession(field.value);
        if (professionError) {
            showError(field, professionError);
        }
    });

    document.getElementById('summary').addEventListener('input', function() {
        const field = this;
        const value = field.value.trim();
        hideError(field);
        const summaryValidation = validarResumenProfesional(value);
        if (!summaryValidation.valido) {
            showError(field, summaryValidation.error);
        }
    });

    document.getElementById('email').addEventListener('input', function() {
        const field = this;
        hideError(field);
        const emailError = isValidEmail(field.value);
        if (emailError) {
            showError(field, emailError);
        }
    });

    // Enter to add skills
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

    // Initialize
    hideAllErrors(form);
    updateHiddenFields();
});
