package com.cv.springboot.di.app.springboot_cv.models;

import jakarta.persistence.Embeddable; // Importando Embeddable para definir una clase que se puede incrustar en otra entidad
import jakarta.persistence.Transient; // Importando Transient para indicar que un campo no debe ser persistido en la base de datos
import org.springframework.web.multipart.MultipartFile; // Importando MultipartFile para manejar archivos de imagen

@Embeddable
public class PersonalInfo {
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String linkedin;
    private String portfolio;
    private String profession;
    private String summary;
    private String profileImagePath;

    @Transient // No se persiste en la base de datos es decir se guarda la ruta mas no el archivo
    private MultipartFile profileImageFile;

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getLinkedin() { return linkedin; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }

    public String getPortfolio() { return portfolio; }
    public void setPortfolio(String portfolio) { this.portfolio = portfolio; }

    public String getProfession() { return profession; }
    public void setProfession(String profession) { this.profession = profession; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getProfileImagePath() { return profileImagePath; }
    public void setProfileImagePath(String profileImagePath) { this.profileImagePath = profileImagePath; }

    public MultipartFile getProfileImageFile() { return profileImageFile; }
    public void setProfileImageFile(MultipartFile profileImageFile) { this.profileImageFile = profileImageFile; }
}