package com.cv.springboot.di.app.springboot_cv.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public class CVUpdateRequest {

    private Long summaryId; // Nuevo campo para identificar el summary a actualizar

    @NotBlank(message = "El nombre completo es obligatorio")
    private String fullName;

    @NotBlank(message = "El correo electrónico es obligatorio")
    @Email(message = "El formato del correo electrónico no es válido")
    private String email;

    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(regexp = "^\\+?[0-9. ()-]{7,25}$", message = "El formato del teléfono no es válido")
    private String phone;

    private String address;
    private String linkedin;
    private String portfolio;
    private String profession;
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
    public Long getSummaryId() {
        return summaryId;
    }

    public void setSummaryId(Long summaryId) {
        this.summaryId = summaryId;
    }

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

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public List<WorkExperienceRequest> getWorkExperiences() {
        return workExperiences;
    }

    public void setWorkExperiences(List<WorkExperienceRequest> workExperiences) {
        this.workExperiences = workExperiences;
    }
}
