document.addEventListener('DOMContentLoaded', function () {
    const cvGrid = document.getElementById('cvGrid');
    const loadingElement = document.getElementById('loading');

    // Función para formatear fechas
    function formatDate(dateString) {
        if (!dateString) return 'Fecha no disponible';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Función para crear una tarjeta de CV
    function createCVCard(summary) {
        const personalInfo = summary.personalInfo || {};
        const createdAt = formatDate(summary.createdAt);
        const updatedAt = formatDate(summary.updatedAt);

        const techSkillsCount = summary.technicalSkills ? summary.technicalSkills.length : 0;
        const softSkillsCount = summary.softSkills ? summary.softSkills.length : 0;
        const educationsCount = summary.educations ? summary.educations.length : 0;

        return `
            <div class="cv-card" data-id="${summary.id}">
                <div class="cv-img" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    ${personalInfo.profileImagePath ?
                `<img src="/uploads/images/${personalInfo.profileImagePath}" alt="${personalInfo.fullName}" class="profile-image">` :
                '<div style="padding: 20px; color: white; text-align: center;">📄 CV</div>'}
                </div>
                <div class="cv-info">
                    <h3>${personalInfo.fullName || 'CV Sin nombre'}</h3>
                    <p><strong>${personalInfo.profession || 'Profesión no especificada'}</strong></p>
                    
                    <div class="cv-meta">
                        <div class="meta-item">
                            <div class="meta-number">${techSkillsCount}</div>
                            <div class="meta-label">Técnicas</div>
                        </div>
                        <div class="meta-item">
                            <div class="meta-number">${softSkillsCount}</div>
                            <div class="meta-label">Blandas</div>
                        </div>
                        <div class="meta-item">
                            <div class="meta-number">${educationsCount}</div>
                            <div class="meta-label">Estudios</div>
                        </div>
                    </div>
                    
                    <p><strong>Creado:</strong> ${createdAt}</p>
                    <p><strong>Modificado:</strong> ${updatedAt}</p>
                    
                    <div class="cv-actions">
                        <a href="/cv/view/${summary.id}" class="btn green">Ver</a>
                        <a href="/cv/edit/${summary.id}" class="btn blue">Editar</a>
                        <button class="btn red delete-btn" data-id="${summary.id}">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Función para cargar los CVs
    async function loadCVs() {
        try {
            loadingElement.innerHTML = '<p>Cargando tus CVs...</p>';

            const response = await fetch('/cv/api/my-cvs', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const summaries = await response.json();
            console.log('CVs cargados:', summaries);

            if (summaries.length === 0) {
                cvGrid.innerHTML = `
                <div class="empty-state-centered">
                    <div class="empty-icon">📄</div>
                    <h3>Comienza tu journey profesional</h3>
                    <p>Aún no tienes CVs creados. Crea tu primer currículum para mostrar tus habilidades y experiencia.</p>
                    <a href="/cv/templateCv" class="btn-primary">Crear mi primer CV</a>
                </div>
            `;

                document.querySelector('.header-section').style.display = 'none';
                return;
            }

            document.querySelector('.header-section').style.display = 'block';

            summaries.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

            const cvCards = summaries.map(createCVCard).join('');
            cvGrid.innerHTML = cvCards;

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', function () {
                    const cvId = this.getAttribute('data-id');
                    deleteCV(cvId);
                });
            });

        } catch (error) {
            console.error('Error cargando CVs:', error);
            cvGrid.innerHTML = `
            <div class="empty-state-centered">
                <div class="empty-icon">Warning</div>
                <h3>Error al cargar</h3>
                <p>${error.message}</p>
                <button onclick="location.reload()" class="btn-primary">Reintentar</button>
            </div>
        `;
        }
    }

    // Función para eliminar un CV
    async function deleteCV(cvId) {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`/cv/api/delete/${cvId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                if (response.ok) {
                    Swal.fire(
                        '¡Eliminado!',
                        'Tu CV ha sido eliminado correctamente.',
                        'success'
                    );
                    loadCVs(); // Recargar la lista
                } else {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }
            } catch (error) {
                Swal.fire(
                    'Error',
                    'No se pudo eliminar el CV: ' + error.message,
                    'error'
                );
            }
        }
    }

    // Hacer loadCVs accesible globalmente para el botón de reintentar
    window.loadCVs = loadCVs;
    // Cargar los CVs al iniciar
    loadCVs();
});