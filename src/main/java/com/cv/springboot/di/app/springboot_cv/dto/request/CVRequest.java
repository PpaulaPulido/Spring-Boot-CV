package com.cv.springboot.di.app.springboot_cv.dto.request;

import jakarta.validation.Valid; // Importar la anotación Valid
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank; //no permitir espacios en blanco o campo vacio
import jakarta.validation.constraints.Pattern; //validar con expresiones regulares
import java.util.List;
import org.springframework.web.multipart.MultipartFile; // Importar MultipartFile para manejar archivos subidos
import com.cv.springboot.di.app.springboot_cv.validation.ValidFullName;
import com.cv.springboot.di.app.springboot_cv.validation.ValidProfession;
import com.cv.springboot.di.app.springboot_cv.validation.ValidLinkedIn;
import com.cv.springboot.di.app.springboot_cv.validation.ValidAddress;
import com.cv.springboot.di.app.springboot_cv.validation.ValidURL;
import com.cv.springboot.di.app.springboot_cv.validation.ValidSummary;

public class CVRequest {

    @NotBlank(message = "El nombre completo es obligatorio")
    @ValidFullName(message = "El nombre completo no es válido")
    private String fullName;

    @NotBlank(message = "El correo electrónico es obligatorio")
    @Email(message = "El formato del correo electrónico no es válido")
    private String email;

    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(regexp = "^\\+?[0-9. ()-]{7,25}$", message = "El formato del teléfono no es válido")
    private String phone;

    @ValidAddress(message = "La dirección no es válida")
    private String address;
    @ValidLinkedIn(message = "La URL de LinkedIn no es válida")
    private String linkedin;
    @ValidURL(message = "La URL del portafolio no es válida")
    private String portfolio;
    @ValidProfession(message = "La profesión no es válida")
    private String profession;
    @ValidSummary(message = "El resumen profesional no es válido")
    private String summary;
    private MultipartFile profileImageFile;
    private String theme;

    @Valid
    private List<TechnicalSkillRequest> technicalSkills;

    @Valid
    private List<SoftSkillRequest> softSkills;

    @Valid
    private List<EducationRequest> educations;

    @Valid
    private List<WorkExperienceRequest> workExperiences;

    // Getters y Setters
    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getLinkedin() {
        return linkedin;
    }

    public void setLinkedin(String linkedin) {
        this.linkedin = linkedin;
    }

    public String getPortfolio() {
        return portfolio;
    }

    public void setPortfolio(String portfolio) {
        this.portfolio = portfolio;
    }

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public List<TechnicalSkillRequest> getTechnicalSkills() {
        return technicalSkills;
    }

    public void setTechnicalSkills(List<TechnicalSkillRequest> technicalSkills) {
        this.technicalSkills = technicalSkills;
    }

    public List<SoftSkillRequest> getSoftSkills() {
        return softSkills;
    }

    public void setSoftSkills(List<SoftSkillRequest> softSkills) {
        this.softSkills = softSkills;
    }

    public MultipartFile getProfileImageFile() {
        return profileImageFile;
    }

    public void setProfileImageFile(MultipartFile profileImageFile) {
        this.profileImageFile = profileImageFile;
    }

    public List<EducationRequest> getEducations() {
        return educations;
    }

    public void setEducations(List<EducationRequest> educations) {
        this.educations = educations;
    }

    public List<WorkExperienceRequest> getWorkExperiences() {
        return workExperiences;
    }

    public void setWorkExperiences(List<WorkExperienceRequest> workExperiences) {
        this.workExperiences = workExperiences;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

}