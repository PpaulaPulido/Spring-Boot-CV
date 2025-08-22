document.addEventListener("DOMContentLoaded", () => {
  createResumePreview();
});


function createResumePreview() {
  const previewSection = document.createElement("section");
  previewSection.classList.add("resume-preview");

  previewSection.innerHTML = `
    <div class="resume-container">
      <!-- Columna izquierda -->
      <div class="resume-left">
        <div class="profile-pic">
          <img id="previewPhoto" src="/images/default.jpg" alt="Foto" />
        </div>
        <p id="previewPhone"></p>
        <p id="previewID"></p>
        <p id="previewEmail"></p>
        <p id="previewWebsite"></p>
        <p id="previewLocation"></p>

        <h4>Referencias</h4>
        <p id="previewReference1"></p>
        <p id="previewReference2"></p>

        <h4>Sobre mí</h4>
        <p id="previewAbout"></p>

        <h4>Perfil profesional</h4>
        <p id="previewProfile"></p>

        <h4>Habilidades</h4>
        <ul id="previewSkills"></ul>

        <h4>Idiomas</h4>
        <ul id="previewLanguages"></ul>
      </div>

      <!-- Columna derecha -->
      <div class="resume-right">
        <h1 id="previewName"></h1>
        <p id="previewTitle"></p>

        <h3>Educación y trayectoria</h3>
        <div id="previewExperience"></div>
      </div>
    </div>
  `;

  document.getElementById("resumePreviewContainer").appendChild(previewSection);
}
