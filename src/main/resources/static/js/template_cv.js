document.getElementById("updateResume").addEventListener("click", function () {
    let name = document.getElementById("fullName").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let linkedin = document.getElementById("linkedin").value;
    let location = document.getElementById("location").value;

    document.getElementById("previewName").textContent = name || "Nombre del Candidato";
    document.getElementById("previewPhone").textContent = phone || "(000) 000-0000";
    document.getElementById("previewEmail").textContent = email || "correo@example.com";
    document.getElementById("previewLocation").textContent = location || "Ciudad, País";

    document.getElementById("previewTitle").textContent = linkedin || "linkedin.com/in/usuario";
});
